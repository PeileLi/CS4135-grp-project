package com.example.orderservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "food.delivery.exchange";
    public static final String ORDER_CREATED_KEY = "order.created";
    public static final String PAYMENT_COMPLETED_KEY = "payment.completed";
    public static final String DELIVERY_UPDATED_KEY = "delivery.updated";

    public static final String ORDER_PAYMENT_QUEUE = "order.payment.completed.queue";
    public static final String ORDER_DELIVERY_QUEUE = "order.delivery.updated.queue";

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue orderPaymentQueue() {
        return new Queue(ORDER_PAYMENT_QUEUE, true);
    }

    @Bean
    public Queue orderDeliveryQueue() {
        return new Queue(ORDER_DELIVERY_QUEUE, true);
    }

    @Bean
    public Binding paymentBinding(Queue orderPaymentQueue, TopicExchange exchange) {
        return BindingBuilder.bind(orderPaymentQueue).to(exchange).with(PAYMENT_COMPLETED_KEY);
    }

    @Bean
    public Binding deliveryBinding(Queue orderDeliveryQueue, TopicExchange exchange) {
        return BindingBuilder.bind(orderDeliveryQueue).to(exchange).with(DELIVERY_UPDATED_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
