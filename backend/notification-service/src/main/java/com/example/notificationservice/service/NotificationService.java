package com.example.notificationservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    public void sendOrderConfirmation(Long orderId, Long userId) {
        log.info("Sending order confirmation for order {} to user {}", orderId, userId);
    }

    public void sendPaymentConfirmation(Long orderId, Long userId) {
        log.info("Sending payment confirmation for order {} to user {}", orderId, userId);
    }

    public void sendDeliveryUpdate(Long orderId, String status) {
        log.info("Sending delivery update for order {}: {}", orderId, status);
    }
}
