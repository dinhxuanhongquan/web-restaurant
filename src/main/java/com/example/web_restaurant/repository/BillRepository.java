package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, String> {
    boolean existsByBillName(String billName);

    Optional<Bill> findByBillName(String billName);
}
