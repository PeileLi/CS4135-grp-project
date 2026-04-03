package com.example.orderservice.service;

import com.example.orderservice.model.DiscountType;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class DiscountCreateRequest {
    private String code;
    private String description;
    private DiscountType type;
    private BigDecimal value;
    private BigDecimal minimumOrderAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer usageLimit;
}