package com.example.deliveryservice.repository;

import com.example.deliveryservice.model.Delivery;
import com.example.deliveryservice.model.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    Optional<Delivery> findByOrderId(Long orderId);
    List<Delivery> findByDriverId(Long driverId);
    List<Delivery> findByDriverIdAndStatusIn(Long driverId, List<DeliveryStatus> statuses);
}