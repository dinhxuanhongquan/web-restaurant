package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.BillDish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BillDishRepository extends JpaRepository<BillDish, String> {
    Boolean existsByBillDishName(String billDishName);
    Boolean existsBillId(String billId);

    Optional<BillDish> findByBillDishName(String billDishName);
    Optional<BillDish> findByBillId(String billId);

    List<BillDish> findAllByBillId(String billId);
}
