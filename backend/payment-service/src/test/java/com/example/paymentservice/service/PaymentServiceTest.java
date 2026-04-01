package com.example.paymentservice.service;

import com.example.common.dto.PaymentEvent;
import com.example.paymentservice.exception.InvalidOperationException;
import com.example.paymentservice.exception.ResourceNotFoundException;
import com.example.paymentservice.messaging.PaymentEventPublisher;
import com.example.paymentservice.model.Payment;
import com.example.paymentservice.model.PaymentStatus;
import com.example.paymentservice.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentEventPublisher paymentEventPublisher;

    @InjectMocks
    private PaymentService paymentService;

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
                .status(PaymentStatus.PENDING)
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
    void createPayment_ShouldCreateNewPayment() {
        when(paymentRepository.findFirstByOrderIdOrderByIdDesc(100L)).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        Payment result = paymentService.createPayment(paymentRequest);

        assertThat(result).isNotNull();
        assertThat(result.getOrderId()).isEqualTo(100L);
        assertThat(result.getStatus()).isEqualTo(PaymentStatus.PENDING);
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    void createPayment_ShouldReturnExistingIfPending() {
        when(paymentRepository.findFirstByOrderIdOrderByIdDesc(100L)).thenReturn(Optional.of(testPayment));

        Payment result = paymentService.createPayment(paymentRequest);

        assertThat(result).isEqualTo(testPayment);
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void createPayment_ShouldRetryFailedPayment() {
        Payment failedPayment = Payment.builder()
                .id(1L)
                .orderId(100L)
                .status(PaymentStatus.FAILED)
                .build();
        when(paymentRepository.findFirstByOrderIdOrderByIdDesc(100L)).thenReturn(Optional.of(failedPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(failedPayment);

        Payment result = paymentService.createPayment(paymentRequest);

        assertThat(result.getStatus()).isEqualTo(PaymentStatus.PENDING);
        verify(paymentRepository).save(failedPayment);
    }

    @Test
    void processPayment_ShouldProcessSuccessfully() {
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        Payment result = paymentService.processPayment(1L, processRequest);

        assertThat(result.getStatus()).isEqualTo(PaymentStatus.SUCCESS);
        verify(paymentEventPublisher).publishPaymentCompleted(any(PaymentEvent.class));
    }

    @Test
    void processPayment_ShouldNotProcessAlreadySuccess() {
        testPayment.setStatus(PaymentStatus.SUCCESS);
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        Payment result = paymentService.processPayment(1L, processRequest);

        assertThat(result.getStatus()).isEqualTo(PaymentStatus.SUCCESS);
        verify(paymentEventPublisher, never()).publishPaymentCompleted(any(PaymentEvent.class));
    }

    @Test
    void processPayment_ShouldThrowWhenNotFound() {
        when(paymentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> paymentService.processPayment(999L, processRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Payment not found");
    }

    @Test
    void getPayment_ShouldReturnPayment() {
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        Payment result = paymentService.getPayment(1L);

        assertThat(result).isEqualTo(testPayment);
    }

    @Test
    void getPaymentByOrder_ShouldReturnPayment() {
        when(paymentRepository.findFirstByOrderIdOrderByIdDesc(100L)).thenReturn(Optional.of(testPayment));

        Payment result = paymentService.getPaymentByOrder(100L);

        assertThat(result).isEqualTo(testPayment);
    }

    @Test
    void getUserPayments_ShouldReturnList() {
        when(paymentRepository.findByUserId(200L)).thenReturn(List.of(testPayment));

        List<Payment> result = paymentService.getUserPayments(200L);

        assertThat(result).hasSize(1);
    }

    @Test
    void refundPayment_ShouldRefundSuccessfully() {
        testPayment.setStatus(PaymentStatus.SUCCESS);
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        Payment result = paymentService.refundPayment(1L, null);

        assertThat(result.getStatus()).isEqualTo(PaymentStatus.REFUNDED);
    }

    @Test
    void refundPayment_ShouldThrowWhenNotSuccess() {
        testPayment.setStatus(PaymentStatus.PENDING);
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        assertThatThrownBy(() -> paymentService.refundPayment(1L, null))
                .isInstanceOf(InvalidOperationException.class)
                .hasMessageContaining("Only successful payments can be refunded");
    }

    @Test
    void getSupportedPaymentMethods_ShouldReturnList() {
        List<String> methods = paymentService.getSupportedPaymentMethods();

        assertThat(methods).contains("credit_card", "debit_card", "paypal", "wallet");
    }
}