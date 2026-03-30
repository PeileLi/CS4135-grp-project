package com.example.orderservice.repository;

import com.example.orderservice.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByRestaurantId(Long restaurantId);

    List<Rating> findByUserId(Long userId);

    Optional<Rating> findByOrderId(Long orderId);

    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.restaurantId = ?1")
    Double getAverageRatingByRestaurantId(Long restaurantId);

    boolean existsByOrderId(Long orderId);
}