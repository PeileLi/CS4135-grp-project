package com.example.restaurantservice.service;

import com.example.restaurantservice.model.MenuItem;
import com.example.restaurantservice.model.Restaurant;
import com.example.restaurantservice.repository.MenuItemRepository;
import com.example.restaurantservice.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findByActiveTrue();
    }

    public Restaurant getRestaurant(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public Restaurant updateRestaurant(Long id, Restaurant updated) {
        Restaurant restaurant = getRestaurant(id);
        restaurant.setName(updated.getName());
        restaurant.setDescription(updated.getDescription());
        restaurant.setAddress(updated.getAddress());
        restaurant.setPhone(updated.getPhone());
        return restaurantRepository.save(restaurant);
    }

    public void deleteRestaurant(Long id) {
        Restaurant restaurant = getRestaurant(id);
        restaurant.setActive(false);
        restaurantRepository.save(restaurant);
    }

    public List<MenuItem> getMenuItems(Long restaurantId) {
        return menuItemRepository.findByRestaurantIdAndAvailableTrue(restaurantId);
    }

    public MenuItem addMenuItem(Long restaurantId, MenuItem menuItem) {
        Restaurant restaurant = getRestaurant(restaurantId);
        menuItem.setRestaurant(restaurant);
        menuItem.setAvailable(true);
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(Long itemId, MenuItem updated) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        menuItem.setName(updated.getName());
        menuItem.setDescription(updated.getDescription());
        menuItem.setPrice(updated.getPrice());
        menuItem.setImageUrl(updated.getImageUrl());
        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(Long itemId) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        menuItem.setAvailable(false);
        menuItemRepository.save(menuItem);
    }
}
