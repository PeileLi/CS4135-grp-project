package com.example.paymentservice.controller;

import com.example.paymentservice.model.Payment;
import com.example.paymentservice.model.PaymentStatus;
import com.example.paymentservice.service.PaymentService;
import com.example.paymentservice.service.PaymentRequest;
import com.example.paymentservice.service.PaymentProcessRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PaymentService paymentService;

    @Autowired
    private ObjectMapper objectMapper;

    private Payment testPayment;
    private PaymentRequest paymentRequest;
    private PaymentProcessRequest processRequest;

    @BeforeEach
    void setUp() {
        testPayment = Payment.builder()
                .id(1L)
                .orderId(100L)
                .userId(200L)
                .amount(new BigDecimal("99.99"))
                .status(PaymentStatus.SUCCESS)
                .paymentMethod("credit_card")
                .build();

        paymentRequest = new PaymentRequest();
        paymentRequest.setOrderId(100L);
        paymentRequest.setUserId(200L);
        paymentRequest.setAmount(new BigDecimal("99.99"));
        paymentRequest.setPaymentMethod("credit_card");

        processRequest = new PaymentProcessRequest();
        processRequest.setPaymentMethod("credit_card");
    }

    @Test
    void createPayment_ShouldReturnPayment() throws Exception {
        when(paymentService.createPayment(any(PaymentRequest.class))).thenReturn(testPayment);

        mockMvc.perform(post("/api/payments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(paymentRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.orderId").value(100))
                .andExpect(jsonPath("$.status").value("SUCCESS"));
    }

    @Test
    void processPayment_ShouldReturnProcessedPayment() throws Exception {
        when(paymentService.processPayment(eq(1L), any(PaymentProcessRequest.class)))
                .thenReturn(testPayment);

        mockMvc.perform(post("/api/payments/1/process")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(processRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("SUCCESS"));
    }

    @Test
    void getPayment_ShouldReturnPayment() throws Exception {
        when(paymentService.getPayment(1L)).thenReturn(testPayment);

        mockMvc.perform(get("/api/payments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.orderId").value(100));
    }

    @Test
    void getPaymentByOrder_ShouldReturnPayment() throws Exception {
        when(paymentService.getPaymentByOrder(100L)).thenReturn(testPayment);

        mockMvc.perform(get("/api/payments/order/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.orderId").value(100));
    }

    @Test
    void getUserPayments_ShouldReturnList() throws Exception {
        when(paymentService.getUserPayments(200L)).thenReturn(List.of(testPayment));

        mockMvc.perform(get("/api/payments/user/200"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].userId").value(200));
    }

    @Test
    void refundPayment_ShouldReturnRefundedPayment() throws Exception {
        Payment refundedPayment = Payment.builder()
                .id(1L)
                .orderId(100L)
                .status(PaymentStatus.REFUNDED)
                .build();
        when(paymentService.refundPayment(eq(1L), eq(null))).thenReturn(refundedPayment);

        mockMvc.perform(post("/api/payments/1/refund"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REFUNDED"));
    }

    @Test
    void refundPayment_WithAmount_ShouldReturnRefundedPayment() throws Exception {
        Payment refundedPayment = Payment.builder()
                .id(1L)
                .orderId(100L)
                .status(PaymentStatus.REFUNDED)
                .build();
        when(paymentService.refundPayment(eq(1L), eq(new BigDecimal("50.00"))))
                .thenReturn(refundedPayment);

        mockMvc.perform(post("/api/payments/1/refund")
                        .param("amount", "50.00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REFUNDED"));
    }

    @Test
    void getPaymentMethods_ShouldReturnList() throws Exception {
        List<String> methods = List.of("credit_card", "debit_card", "paypal", "wallet");
        when(paymentService.getSupportedPaymentMethods()).thenReturn(methods);

        mockMvc.perform(get("/api/payments/methods"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("credit_card"))
                .andExpect(jsonPath("$[1]").value("debit_card"))
                .andExpect(jsonPath("$[2]").value("paypal"))
                .andExpect(jsonPath("$[3]").value("wallet"));
    }
}