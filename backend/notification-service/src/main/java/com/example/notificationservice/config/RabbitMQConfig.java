package com.example.notificationservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "food.delivery.exchange";

    public static final String NOTIFICATION_ORDER_QUEUE = "notification.order.queue";
    public static final String NOTIFICATION_PAYMENT_QUEUE = "notification.payment.queue";
    public static final String NOTIFICATION_DELIVERY_QUEUE = "notification.delivery.queue";

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue notificationOrderQueue() {
        return new Queue(NOTIFICATION_ORDER_QUEUE, true);
    }

    @Bean
    public Queue notificationPaymentQueue() {
        return new Queue(NOTIFICATION_PAYMENT_QUEUE, true);
    }

    @Bean
    public Queue notificationDeliveryQueue() {
        return new Queue(NOTIFICATION_DELIVERY_QUEUE, true);
    }

    @Bean
    public Binding orderBinding(Queue notificationOrderQueue, TopicExchange exchange) {
        return BindingBuilder.bind(notificationOrderQueue).to(exchange).with("order.created");
    }

    @Bean
    public Binding paymentBinding(Queue notificationPaymentQueue, TopicExchange exchange) {
        return BindingBuilder.bind(notificationPaymentQueue).to(exchange).with("payment.completed");
    }

    @Bean
    public Binding deliveryBinding(Queue notificationDeliveryQueue, TopicExchange exchange) {
        return BindingBuilder.bind(notificationDeliveryQueue).to(exchange).with("delivery.updated");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
