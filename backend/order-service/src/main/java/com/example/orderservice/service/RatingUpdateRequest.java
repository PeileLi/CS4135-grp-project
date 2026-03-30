package com.example.orderservice.service;

import lombok.Data;

@Data
public class RatingUpdateRequest {
    private Integer rating;
    private String comment;
}