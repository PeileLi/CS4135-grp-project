package com.example.userservice.service;

import com.example.userservice.model.Favourite;
import com.example.userservice.repository.FavouriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavouriteService {

    private final FavouriteRepository favouriteRepository;

    @Transactional
    public Favourite addFavourite(FavouriteRequest request) {
        if (favouriteRepository.existsByUserIdAndRestaurantId(
                request.getUserId(), request.getRestaurantId())) {
            throw new RuntimeException("Restaurant already in favourites");
        }

        Favourite favourite = Favourite.builder()
                .userId(request.getUserId())
                .restaurantId(request.getRestaurantId())
                .build();

        return favouriteRepository.save(favourite);
    }

    public List<Favourite> getUserFavourites(Long userId) {
        return favouriteRepository.findByUserId(userId);
    }

    public boolean isFavourite(Long userId, Long restaurantId) {
        return favouriteRepository.existsByUserIdAndRestaurantId(userId, restaurantId);
    }

    @Transactional
    public void removeFavourite(Long userId, Long restaurantId) {
        favouriteRepository.deleteByUserIdAndRestaurantId(userId, restaurantId);
    }
}