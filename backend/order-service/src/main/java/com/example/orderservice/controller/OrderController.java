package com.example.orderservice.controller;

import com.example.orderservice.dto.CreateOrderRequest;
import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderStatus;
import com.example.orderservice.service.OrderService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(orderService.getMyOrders(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrder(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        OrderStatus status = OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Order>> getRestaurantOrders(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(orderService.getOrdersByRestaurantId(restaurantId));
    }

    @GetMapping("/restaurant/{restaurantId}/revenue")
    public ResponseEntity<Map<String, Object>> getRestaurantRevenue(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(orderService.getDailyRevenue(restaurantId));
    }

    @GetMapping("/test-circuit-breaker")
    @CircuitBreaker(name = "restaurantService", fallbackMethod = "restaurantFallback")
    public ResponseEntity<String> testCircuitBreaker() {
        log.info("Order Service attempting to call Restaurant Service via RestTemplate...");
        String response = restTemplate.getForObject("http://localhost:8082/api/restaurants/health", String.class);
        return ResponseEntity.ok("Call successful: " + response);
    }

    public ResponseEntity<String> restaurantFallback(Throwable t) {
        log.error("CircuitBreaker is OPEN! Fallback triggered. Original error intercepted: {}", t.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("[Fallback Response] Service temporarily unavailable. The restaurant service is down, but the request was safely intercepted and degraded by the circuit breaker.");
    }
}