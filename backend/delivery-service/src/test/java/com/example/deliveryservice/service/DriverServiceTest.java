package com.example.deliveryservice.service;

import com.example.common.dto.DeliveryEvent;
import com.example.deliveryservice.exception.InvalidOperationException;
import com.example.deliveryservice.exception.ResourceNotFoundException;
import com.example.deliveryservice.messaging.DeliveryEventPublisher;
import com.example.deliveryservice.model.Delivery;
import com.example.deliveryservice.model.DeliveryStatus;
import com.example.deliveryservice.model.Driver;
import com.example.deliveryservice.repository.DeliveryRepository;
import com.example.deliveryservice.repository.DriverRepository;
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
class DriverServiceTest {

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private DeliveryRepository deliveryRepository;

    @Mock
    private DeliveryEventPublisher deliveryEventPublisher;

    @InjectMocks
    private DriverService driverService;

    private Driver testDriver;
    private Delivery testDelivery;
    private DriverRegistrationRequest registrationRequest;

    @BeforeEach
    void setUp() {
        testDriver = Driver.builder()
                .id(1L)
                .userId(100L)
                .name("John Doe")
                .phone("1234567890")
                .vehicle("Toyota Camry")
                .available(true)
                .build();

        testDelivery = Delivery.builder()
                .id(1L)
                .orderId(200L)
                .userId(100L)
                .status(DeliveryStatus.PENDING)
                .build();

        registrationRequest = new DriverRegistrationRequest();
        registrationRequest.setUserId(100L);
        registrationRequest.setName("John Doe");
        registrationRequest.setPhone("1234567890");
        registrationRequest.setVehicle("Toyota Camry");
    }

    @Test
    void registerDriver_ShouldCreateNewDriver() {
        when(driverRepository.findByUserId(100L)).thenReturn(Optional.empty());
        when(driverRepository.save(any(Driver.class))).thenReturn(testDriver);

        Driver result = driverService.registerDriver(registrationRequest);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("John Doe");
        verify(driverRepository).save(any(Driver.class));
    }

    @Test
    void registerDriver_ShouldReturnExistingDriver() {
        when(driverRepository.findByUserId(100L)).thenReturn(Optional.of(testDriver));

        Driver result = driverService.registerDriver(registrationRequest);

        assertThat(result).isEqualTo(testDriver);
        verify(driverRepository, never()).save(any(Driver.class));
    }

    @Test
    void getDriverByUserId_ShouldReturnDriver() {
        when(driverRepository.findByUserId(100L)).thenReturn(Optional.of(testDriver));

        Driver result = driverService.getDriverByUserId(100L);

        assertThat(result).isEqualTo(testDriver);
    }

    @Test
    void getDriverByUserId_ShouldThrowWhenNotFound() {
        when(driverRepository.findByUserId(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> driverService.getDriverByUserId(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Driver not found");
    }

    @Test
    void getAvailableDrivers_ShouldReturnAvailableDrivers() {
        when(driverRepository.findByAvailableTrue()).thenReturn(List.of(testDriver));

        List<Driver> result = driverService.getAvailableDrivers();

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(testDriver);
    }

    @Test
    void getDriver_ShouldReturnDriver() {
        when(driverRepository.findById(1L)).thenReturn(Optional.of(testDriver));

        Driver result = driverService.getDriver(1L);

        assertThat(result).isEqualTo(testDriver);
    }

    @Test
    void updateDriverStatus_ShouldUpdateAvailability() {
        when(driverRepository.findById(1L)).thenReturn(Optional.of(testDriver));
        when(driverRepository.save(any(Driver.class))).thenReturn(testDriver);

        Driver result = driverService.updateDriverStatus(1L, false);

        assertThat(result.isAvailable()).isFalse();
        verify(driverRepository).save(testDriver);
    }

    @Test
    void acceptDelivery_ShouldAssignDriverToDelivery() {
        when(driverRepository.findById(1L)).thenReturn(Optional.of(testDriver));
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));
        when(deliveryRepository.save(any(Delivery.class))).thenReturn(testDelivery);
        when(driverRepository.save(any(Driver.class))).thenReturn(testDriver);

        Delivery result = driverService.acceptDelivery(1L, 1L);

        assertThat(result.getStatus()).isEqualTo(DeliveryStatus.ASSIGNED);
        assertThat(result.getDriver()).isEqualTo(testDriver);
        verify(deliveryEventPublisher).publishDeliveryUpdated(any(DeliveryEvent.class));
    }

    @Test
    void acceptDelivery_ShouldThrowWhenDriverNotAvailable() {
        testDriver.setAvailable(false);
        when(driverRepository.findById(1L)).thenReturn(Optional.of(testDriver));
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));

        assertThatThrownBy(() -> driverService.acceptDelivery(1L, 1L))
                .isInstanceOf(InvalidOperationException.class)
                .hasMessageContaining("Driver is not available");
    }

    @Test
    void updateDeliveryStatus_ShouldUpdateToDelivered() {
        testDelivery.setDriver(testDriver);
        testDelivery.setStatus(DeliveryStatus.ASSIGNED);
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));
        when(deliveryRepository.save(any(Delivery.class))).thenReturn(testDelivery);
        when(driverRepository.save(any(Driver.class))).thenReturn(testDriver);

        Delivery result = driverService.updateDeliveryStatus(1L, "DELIVERED");

        assertThat(result.getStatus()).isEqualTo(DeliveryStatus.DELIVERED);
        verify(deliveryEventPublisher).publishDeliveryUpdated(any(DeliveryEvent.class));
    }

    @Test
    void getDriverEarnings_ShouldReturnEarnings() {
        List<Delivery> completedDeliveries = List.of(testDelivery, testDelivery);
        when(deliveryRepository.findByDriverIdAndStatus(1L, DeliveryStatus.DELIVERED))
                .thenReturn(completedDeliveries);

        var result = driverService.getDriverEarnings(1L);

        assertThat(result.get("completedDeliveries")).isEqualTo(2);
        assertThat(result.get("totalEarnings")).isEqualTo(new BigDecimal("10.00"));
    }

    @Test
    void getDriverDeliveries_ShouldReturnAllDeliveries() {
        when(deliveryRepository.findByDriverId(1L)).thenReturn(List.of(testDelivery));

        List<Delivery> result = driverService.getDriverDeliveries(1L);

        assertThat(result).hasSize(1);
    }
}