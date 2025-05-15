package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.BillDish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BillDishRepository extends JpaRepository<BillDish, String> {
    Boolean existsByBill_BillId(String billId);

    Optional<BillDish> findByBill_BillId(String billId);

    List<BillDish> findAllByBill_BillId(String billId);
}
