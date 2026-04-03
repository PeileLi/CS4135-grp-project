package com.example.deliveryservice.service;

import lombok.Data;

@Data
public class DriverRegistrationRequest {
    private Long userId;
    private String name;
    private String phone;
    private String vehicle;
}