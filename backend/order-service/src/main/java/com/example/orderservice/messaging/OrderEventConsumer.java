package com.example.orderservice.messaging;

import com.example.common.dto.PaymentEvent;
import com.example.common.dto.DeliveryEvent;
import com.example.orderservice.config.RabbitMQConfig;
import com.example.orderservice.model.OrderStatus;
import com.example.orderservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {

    private final OrderService orderService;

    @RabbitListener(queues = RabbitMQConfig.ORDER_PAYMENT_QUEUE)
    public void handlePaymentCompleted(PaymentEvent event) {
        log.info("Received PaymentCompletedEvent for order {}", event.getOrderId());
        if ("SUCCESS".equals(event.getStatus())) {
            orderService.updateOrderStatus(event.getOrderId(), OrderStatus.CONFIRMED);
        }
    }

    @RabbitListener(queues = RabbitMQConfig.ORDER_DELIVERY_QUEUE)
    public void handleDeliveryUpdated(DeliveryEvent event) {
        log.info("Received DeliveryEvent for order {}: {}", event.getOrderId(), event.getStatus());
        switch (event.getStatus()) {
            case "ASSIGNED" -> orderService.updateOrderStatus(event.getOrderId(), OrderStatus.DELIVERING);
            case "PICKED_UP" -> orderService.updateOrderStatus(event.getOrderId(), OrderStatus.DELIVERING);
            case "DELIVERED" -> orderService.updateOrderStatus(event.getOrderId(), OrderStatus.DELIVERED);
        }
    }
}
