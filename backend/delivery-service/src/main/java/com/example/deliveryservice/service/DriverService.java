package com.example.deliveryservice.service;

import com.example.deliveryservice.model.Delivery;
import com.example.deliveryservice.model.DeliveryStatus;
import com.example.deliveryservice.model.Driver;
import com.example.deliveryservice.repository.DeliveryRepository;
import com.example.deliveryservice.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;
    private final DeliveryRepository deliveryRepository;

    @Transactional
    public Driver registerDriver(DriverRegistrationRequest request) {
        Driver driver = Driver.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .available(true)
                .build();

        return driverRepository.save(driver);
    }

    public List<Driver> getAvailableDrivers() {
        return driverRepository.findByAvailableTrue();
    }

    public Driver getDriver(Long driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
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
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        if (!driver.isAvailable()) {
            throw new RuntimeException("Driver is not available");
        }

        if (delivery.getStatus() != DeliveryStatus.PENDING) {
            throw new RuntimeException("Delivery is not available for assignment");
        }

        delivery.setDriver(driver);
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        driver.setAvailable(false);

        driverRepository.save(driver);
        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Delivery updateDeliveryStatus(Long deliveryId, String status) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        DeliveryStatus newStatus = DeliveryStatus.valueOf(status.toUpperCase());
        delivery.setStatus(newStatus);

        if (newStatus == DeliveryStatus.DELIVERED) {
            if (delivery.getDriver() != null) {
                Driver driver = delivery.getDriver();
                driver.setAvailable(true);
                driverRepository.save(driver);
            }
        }

        return deliveryRepository.save(delivery);
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