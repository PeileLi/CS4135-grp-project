package com.example.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryEvent {
    private Long deliveryId;
    private Long orderId;
    private Long userId;
    private Long driverId;
    private String status;
    private LocalDateTime timestamp;
}
