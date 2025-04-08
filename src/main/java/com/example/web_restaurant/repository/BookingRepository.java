package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, String> {
    boolean existsByCustomerName(String customerName);

    Optional<Booking> findByCustomerName(String customerName);
}
