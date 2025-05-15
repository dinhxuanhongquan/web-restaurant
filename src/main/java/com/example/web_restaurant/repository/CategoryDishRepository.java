package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.CategoryDish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryDishRepository extends JpaRepository<CategoryDish, String> {
    boolean existsByCategoryName(String categoryName);

    Optional<CategoryDish> findByCategoryName(String categoryName);

    List<CategoryDish> findAllByUser_UserId(String userId);
}
