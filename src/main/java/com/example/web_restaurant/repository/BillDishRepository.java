package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.BillDish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BillDishRepository extends JpaRepository<BillDish, String> {
    Boolean existsByBillDishName(String billDishName);

    Optional<BillDish> findByBillDishName(String billDishName);
}
