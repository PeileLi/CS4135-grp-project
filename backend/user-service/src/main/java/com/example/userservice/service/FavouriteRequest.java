package com.example.userservice.service;

import lombok.Data;

@Data
public class FavouriteRequest {
    private Long userId;
    private Long restaurantId;
}