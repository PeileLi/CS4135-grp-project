package com.example.orderservice.service;

import com.example.common.dto.OrderEvent;
import com.example.orderservice.dto.CreateOrderRequest;
import com.example.orderservice.messaging.OrderEventPublisher;
import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderItem;
import com.example.orderservice.model.OrderStatus;
import com.example.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderEventPublisher orderEventPublisher;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        Order order = Order.builder()
                .userId(request.getUserId())
                .restaurantId(request.getRestaurantId())
                .restaurantName(request.getRestaurantName())
                .totalAmount(request.getTotalAmount())
                .deliveryAddress(request.getDeliveryAddress())
                .status(OrderStatus.PENDING)
                .build();

        List<OrderItem> items = request.getItems().stream()
                .map(dto -> OrderItem.builder()
                        .menuItemId(dto.getMenuItemId())
                        .menuItemName(dto.getMenuItemName())
                        .quantity(dto.getQuantity())
                        .price(dto.getPrice())
                        .order(order)
                        .build())
                .toList();
        order.setItems(items);

        Order saved = orderRepository.save(order);

        OrderEvent event = OrderEvent.builder()
                .orderId(saved.getId())
                .userId(saved.getUserId())
                .restaurantId(saved.getRestaurantId())
                .totalAmount(saved.getTotalAmount())
                .deliveryAddress(saved.getDeliveryAddress())
                .status(saved.getStatus().name())
                .timestamp(saved.getCreatedAt())
                .build();
        orderEventPublisher.publishOrderCreated(event);

        return saved;
    }

    public Order getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getMyOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Order cancelOrder(Long id) {
        Order order = getOrder(id);
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Only pending orders can be cancelled");
        }
        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(Long id, OrderStatus status) {
        Order order = getOrder(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByRestaurantId(Long restaurantId) {
        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
    }

    public Map<String, Object> getDailyRevenue(Long restaurantId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        List<Order> todayOrders = orderRepository.findByRestaurantIdAndCreatedAtAfterAndStatusNot(
                restaurantId, startOfDay, OrderStatus.CANCELLED);

        BigDecimal totalRevenue = todayOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> result = new HashMap<>();
        result.put("revenue", totalRevenue);
        result.put("orderCount", todayOrders.size());
        return result;
    }
}
