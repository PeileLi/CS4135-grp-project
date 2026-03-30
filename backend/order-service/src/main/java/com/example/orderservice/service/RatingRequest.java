package com.example.orderservice.service;

import lombok.Data;

@Data
public class RatingRequest {
    private Long orderId;
    private Long userId;
    private Long restaurantId;
    private Integer rating;
    private String comment;
}