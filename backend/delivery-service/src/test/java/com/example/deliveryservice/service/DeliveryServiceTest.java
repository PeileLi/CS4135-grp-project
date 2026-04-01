package com.example.deliveryservice.service;

import com.example.deliveryservice.exception.InvalidOperationException;
import com.example.deliveryservice.exception.ResourceNotFoundException;
import com.example.deliveryservice.model.Delivery;
import com.example.deliveryservice.model.DeliveryStatus;
import com.example.deliveryservice.model.Driver;
import com.example.deliveryservice.repository.DeliveryRepository;
import com.example.deliveryservice.repository.DriverRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeliveryServiceTest {

    @Mock
    private DeliveryRepository deliveryRepository;

    @Mock
    private DriverRepository driverRepository;

    @InjectMocks
    private DeliveryService deliveryService;

    private Delivery testDelivery;
    private Driver testDriver;

    @BeforeEach
    void setUp() {
        testDriver = Driver.builder()
                .id(1L)
                .name("John Doe")
                .available(true)
                .build();

        testDelivery = Delivery.builder()
                .id(1L)
                .orderId(100L)
                .userId(200L)
                .status(DeliveryStatus.PENDING)
                .build();
    }

    @Test
    void getAllDeliveries_ShouldReturnAll() {
        when(deliveryRepository.findAll()).thenReturn(List.of(testDelivery));

        List<Delivery> result = deliveryService.getAllDeliveries();

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(testDelivery);
    }

    @Test
    void getAvailableDeliveries_ShouldReturnPendingOnly() {
        when(deliveryRepository.findByStatus(DeliveryStatus.PENDING)).thenReturn(List.of(testDelivery));

        List<Delivery> result = deliveryService.getAvailableDeliveries();

        assertThat(result).hasSize(1);
    }

    @Test
    void getDelivery_ShouldReturnDelivery() {
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));

        Delivery result = deliveryService.getDelivery(1L);

        assertThat(result).isEqualTo(testDelivery);
    }

    @Test
    void getDelivery_ShouldThrowWhenNotFound() {
        when(deliveryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> deliveryService.getDelivery(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Delivery not found");
    }

    @Test
    void getDeliveryByOrderId_ShouldReturnDelivery() {
        when(deliveryRepository.findByOrderId(100L)).thenReturn(Optional.of(testDelivery));

        Delivery result = deliveryService.getDeliveryByOrderId(100L);

        assertThat(result).isEqualTo(testDelivery);
    }

    @Test
    void updateStatus_ShouldUpdate() {
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));
        when(deliveryRepository.save(any(Delivery.class))).thenReturn(testDelivery);

        Delivery result = deliveryService.updateStatus(1L, DeliveryStatus.ASSIGNED);

        assertThat(result.getStatus()).isEqualTo(DeliveryStatus.ASSIGNED);
    }

    @Test
    void assignDriver_ShouldAssignSuccessfully() {
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));
        when(driverRepository.findById(1L)).thenReturn(Optional.of(testDriver));
        when(deliveryRepository.save(any(Delivery.class))).thenReturn(testDelivery);
        when(driverRepository.save(any(Driver.class))).thenReturn(testDriver);

        Delivery result = deliveryService.assignDriver(1L, 1L);

        assertThat(result.getDriver()).isEqualTo(testDriver);
        assertThat(result.getStatus()).isEqualTo(DeliveryStatus.ASSIGNED);
    }

    @Test
    void assignDriver_ShouldThrowWhenDriverNotAvailable() {
        testDriver.setAvailable(false);
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));
        when(driverRepository.findById(1L)).thenReturn(Optional.of(testDriver));

        assertThatThrownBy(() -> deliveryService.assignDriver(1L, 1L))
                .isInstanceOf(InvalidOperationException.class)
                .hasMessageContaining("Driver is not available");
    }

    @Test
    void assignDriver_ShouldThrowWhenDeliveryNotPending() {
        testDelivery.setStatus(DeliveryStatus.ASSIGNED);
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));
        when(driverRepository.findById(1L)).thenReturn(Optional.of(testDriver));

        assertThatThrownBy(() -> deliveryService.assignDriver(1L, 1L))
                .isInstanceOf(InvalidOperationException.class)
                .hasMessageContaining("Delivery is not available");
    }
}