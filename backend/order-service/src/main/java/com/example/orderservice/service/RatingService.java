package com.example.orderservice.service;

import com.example.orderservice.model.Rating;
import com.example.orderservice.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;

    @Transactional
    public Rating createRating(RatingRequest request) {
        if (ratingRepository.existsByOrderId(request.getOrderId())) {
            throw new RuntimeException("This order has already been rated");
        }

        Rating rating = Rating.builder()
                .orderId(request.getOrderId())
                .userId(request.getUserId())
                .restaurantId(request.getRestaurantId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return ratingRepository.save(rating);
    }

    public List<Rating> getRatingsByRestaurant(Long restaurantId) {
        return ratingRepository.findByRestaurantId(restaurantId);
    }

    public List<Rating> getRatingsByUser(Long userId) {
        return ratingRepository.findByUserId(userId);
    }

    public Double getAverageRating(Long restaurantId) {
        return ratingRepository.getAverageRatingByRestaurantId(restaurantId);
    }

    @Transactional
    public Rating updateRating(Long ratingId, RatingUpdateRequest request) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        if (request.getRating() != null) {
            rating.setRating(request.getRating());
        }
        if (request.getComment() != null) {
            rating.setComment(request.getComment());
        }

        return ratingRepository.save(rating);
    }

    @Transactional
    public void deleteRating(Long ratingId) {
        ratingRepository.deleteById(ratingId);
    }
}