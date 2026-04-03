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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DriverService {

    private static final BigDecimal DELIVERY_FEE = new BigDecimal("5.00");

    private final DriverRepository driverRepository;
    private final DeliveryRepository deliveryRepository;
    private final DeliveryEventPublisher deliveryEventPublisher;

    @Transactional
    public Driver registerDriver(DriverRegistrationRequest request) {
        if (request.getUserId() != null) {
            var existing = driverRepository.findByUserId(request.getUserId());
            if (existing.isPresent()) {
                return existing.get();
            }
        }

        Driver driver = Driver.builder()
                .userId(request.getUserId())
                .name(request.getName())
                .phone(request.getPhone())
                .vehicle(request.getVehicle())
                .available(true)
                .build();

        return driverRepository.save(driver);
    }

    public Driver getDriverByUserId(Long userId) {
        return driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found for user: " + userId));
    }

    public Map<String, Object> getDriverEarnings(Long driverId) {
        List<Delivery> completed = deliveryRepository.findByDriverIdAndStatus(driverId, DeliveryStatus.DELIVERED);
        BigDecimal totalEarnings = DELIVERY_FEE.multiply(new BigDecimal(completed.size()));

        Map<String, Object> result = new HashMap<>();
        result.put("totalEarnings", totalEarnings);
        result.put("completedDeliveries", completed.size());
        result.put("deliveryFee", DELIVERY_FEE);
        return result;
    }

    public List<Driver> getAvailableDrivers() {
        return driverRepository.findByAvailableTrue();
    }

    public Driver getDriver(Long driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
    }

    @Transactional
    public Driver updateDriverStatus(Long driverId, boolean available) {
        Driver driver = getDriver(driverId);
        driver.setAvailable(available);
        return driverRepository.save(driver);
    }

    @Transactional
    public Delivery acceptDelivery(Long driverId, Long deliveryId) {
        Driver driver = getDriver(driverId);
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));

        if (!driver.isAvailable()) {
            throw new InvalidOperationException("Driver is not available");
        }

        if (delivery.getStatus() != DeliveryStatus.PENDING) {
            throw new InvalidOperationException("Delivery is not available for assignment");
        }

        delivery.setDriver(driver);
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        driver.setAvailable(false);

        driverRepository.save(driver);
        Delivery saved = deliveryRepository.save(delivery);

        DeliveryEvent event = DeliveryEvent.builder()
                .deliveryId(saved.getId())
                .orderId(saved.getOrderId())
                .userId(saved.getUserId())
                .driverId(driverId)
                .status("ASSIGNED")
                .timestamp(LocalDateTime.now())
                .build();
        deliveryEventPublisher.publishDeliveryUpdated(event);

        return saved;
    }

    @Transactional
    public Delivery updateDeliveryStatus(Long deliveryId, String status) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));

        DeliveryStatus newStatus = DeliveryStatus.valueOf(status.toUpperCase());
        delivery.setStatus(newStatus);

        if (newStatus == DeliveryStatus.DELIVERED && delivery.getDriver() != null) {
            Driver driver = delivery.getDriver();
            driver.setAvailable(true);
            driverRepository.save(driver);
        }

        Delivery saved = deliveryRepository.save(delivery);

        DeliveryEvent event = DeliveryEvent.builder()
                .deliveryId(saved.getId())
                .orderId(saved.getOrderId())
                .userId(saved.getUserId())
                .driverId(saved.getDriver() != null ? saved.getDriver().getId() : null)
                .status(newStatus.name())
                .timestamp(LocalDateTime.now())
                .build();
        deliveryEventPublisher.publishDeliveryUpdated(event);

        return saved;
    }

    public List<Delivery> getDriverDeliveries(Long driverId) {
        return deliveryRepository.findByDriverId(driverId);
    }

    public Delivery getCurrentDelivery(Long driverId) {
        return deliveryRepository.findByDriverIdAndStatusIn(
                driverId,
                List.of(DeliveryStatus.ASSIGNED, DeliveryStatus.PICKED_UP)
        ).stream().findFirst().orElse(null);
    }
}