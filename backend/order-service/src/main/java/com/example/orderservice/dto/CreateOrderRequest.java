package com.example.orderservice.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateOrderRequest {
    private Long userId;
    private Long restaurantId;
    private String restaurantName;
    private BigDecimal totalAmount;
    private String deliveryAddress;
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private Long menuItemId;
        private String menuItemName;
        private Integer quantity;
        private BigDecimal price;
    }
}
