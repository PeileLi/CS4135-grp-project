package com.example.orderservice.repository;

import com.example.orderservice.model.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {

    Optional<Discount> findByCodeAndActiveTrue(String code);

    boolean existsByCode(String code);
}