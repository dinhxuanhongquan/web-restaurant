package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DishRepository extends JpaRepository<Dish, String> {
    boolean existsByDishName(String dishName);

    Optional<Dish> findByDishName(String dishName);
    List<Dish> findAllByCategoryDish_CategoryId(String categoryId);
}
