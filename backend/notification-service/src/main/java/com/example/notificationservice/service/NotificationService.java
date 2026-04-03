package com.example.notificationservice.service;

import com.example.notificationservice.model.Notification;
import com.example.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void sendOrderConfirmation(Long orderId, Long userId) {
        log.info("Order confirmation for order {} to user {}", orderId, userId);
        createNotification(userId, "Order Confirmed",
                "Your order #" + orderId + " has been placed successfully.",
                "ORDER_CREATED", orderId);
    }

    @Transactional
    public void sendPaymentConfirmation(Long orderId, Long userId) {
        log.info("Payment confirmation for order {}", orderId);
        if (userId != null) {
            createNotification(userId, "Payment Successful",
                    "Payment for order #" + orderId + " was processed successfully.",
                    "PAYMENT_SUCCESS", orderId);
        }
    }

    @Transactional
    public void sendDeliveryUpdate(Long orderId, String status, Long userId) {
        log.info("Delivery update for order {}: {}", orderId, status);
        if (userId != null) {
            String title = formatDeliveryTitle(status);
            String message = formatDeliveryMessage(orderId, status);
            createNotification(userId, title, message, "DELIVERY_" + status, orderId);
        }
    }

    @Transactional
    public void sendMerchantNewOrder(Long orderId, Long restaurantOwnerId, String restaurantName) {
        log.info("New order notification for merchant {} (order {})", restaurantOwnerId, orderId);
        createNotification(restaurantOwnerId, "New Order Received",
                "New order #" + orderId + " received at " + restaurantName + ".",
                "MERCHANT_NEW_ORDER", orderId);
    }

    @Transactional
    public void sendRiderAssignment(Long orderId, Long driverId) {
        log.info("Rider assignment for driver {} (order {})", driverId, orderId);
        createNotification(driverId, "New Delivery Assignment",
                "You have been assigned delivery for order #" + orderId + ".",
                "RIDER_ASSIGNED", orderId);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        unread.stream().filter(n -> !n.isRead()).forEach(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    private void createNotification(Long userId, String title, String message, String type, Long orderId) {
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type)
                .orderId(orderId)
                .read(false)
                .build();
        notificationRepository.save(notification);
    }

    private String formatDeliveryTitle(String status) {
        return switch (status) {
            case "ASSIGNED" -> "Rider Assigned";
            case "PICKED_UP" -> "Order Picked Up";
            case "IN_TRANSIT" -> "Order In Transit";
            case "DELIVERED" -> "Order Delivered";
            default -> "Delivery Update";
        };
    }

    private String formatDeliveryMessage(Long orderId, String status) {
        return switch (status) {
            case "ASSIGNED" -> "A rider has been assigned to your order #" + orderId + ".";
            case "PICKED_UP" -> "Your order #" + orderId + " has been picked up by the rider.";
            case "IN_TRANSIT" -> "Your order #" + orderId + " is on the way!";
            case "DELIVERED" -> "Your order #" + orderId + " has been delivered. Enjoy!";
            default -> "Delivery status for order #" + orderId + " updated to " + status + ".";
        };
    }
}
