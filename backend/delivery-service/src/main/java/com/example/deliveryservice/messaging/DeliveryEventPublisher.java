package com.example.deliveryservice.messaging;

import com.example.common.dto.DeliveryEvent;
import com.example.deliveryservice.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeliveryEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishDeliveryUpdated(DeliveryEvent event) {
        log.info("Publishing DeliveryEvent for order {}: {}", event.getOrderId(), event.getStatus());
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.DELIVERY_UPDATED_KEY, event);
    }
}
