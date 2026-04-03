package com.example.deliveryservice.messaging;

import com.example.common.dto.PaymentEvent;
import com.example.deliveryservice.config.RabbitMQConfig;
import com.example.deliveryservice.model.Delivery;
import com.example.deliveryservice.model.DeliveryStatus;
import com.example.deliveryservice.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeliveryEventConsumer {

    private final DeliveryRepository deliveryRepository;

    @RabbitListener(queues = RabbitMQConfig.DELIVERY_PAYMENT_QUEUE)
    public void handlePaymentCompleted(PaymentEvent event) {
        log.info("Received PaymentCompletedEvent for order {}", event.getOrderId());
        if ("SUCCESS".equals(event.getStatus())) {
            Delivery delivery = Delivery.builder()
                    .orderId(event.getOrderId())
                    .userId(event.getUserId())
                    .status(DeliveryStatus.PENDING)
                    .build();
            deliveryRepository.save(delivery);
            log.info("Created delivery task for order {}", event.getOrderId());
        }
    }
}
