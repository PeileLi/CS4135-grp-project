package com.example.restaurantservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantRequest {
    private String name;
    private String description;
    private String address;
    private String phone;
    private String category;
    private String image;
    private String deliveryTime;
    private Long ownerId;
}
