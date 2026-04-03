package com.example.deliveryservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "food.delivery.exchange";
    public static final String PAYMENT_COMPLETED_KEY = "payment.completed";
    public static final String DELIVERY_UPDATED_KEY = "delivery.updated";

    public static final String DELIVERY_PAYMENT_QUEUE = "delivery.payment.completed.queue";

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue deliveryPaymentQueue() {
        return new Queue(DELIVERY_PAYMENT_QUEUE, true);
    }

    @Bean
    public Binding paymentBinding(Queue deliveryPaymentQueue, TopicExchange exchange) {
        return BindingBuilder.bind(deliveryPaymentQueue).to(exchange).with(PAYMENT_COMPLETED_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
