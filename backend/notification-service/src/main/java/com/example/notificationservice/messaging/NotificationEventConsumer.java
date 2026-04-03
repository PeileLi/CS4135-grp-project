package com.example.notificationservice.messaging;

import com.example.common.dto.OrderEvent;
import com.example.common.dto.PaymentEvent;
import com.example.common.dto.DeliveryEvent;
import com.example.notificationservice.config.RabbitMQConfig;
import com.example.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_ORDER_QUEUE)
    public void handleOrderCreated(OrderEvent event) {
        log.info("Received OrderCreatedEvent for order {}", event.getOrderId());
        notificationService.sendOrderConfirmation(event.getOrderId(), event.getUserId());
    }

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_PAYMENT_QUEUE)
    public void handlePaymentCompleted(PaymentEvent event) {
        log.info("Received PaymentCompletedEvent for order {}", event.getOrderId());
        notificationService.sendPaymentConfirmation(event.getOrderId(), event.getUserId());
    }

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_DELIVERY_QUEUE)
    public void handleDeliveryUpdated(DeliveryEvent event) {
        log.info("Received DeliveryEvent for order {}: {}", event.getOrderId(), event.getStatus());
        notificationService.sendDeliveryUpdate(event.getOrderId(), event.getStatus(), event.getUserId());
    }
}
