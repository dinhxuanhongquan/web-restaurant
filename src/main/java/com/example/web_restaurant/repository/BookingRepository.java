package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, String> {
    boolean existsByUserId(String userId);
    boolean existsByTableId(String tableId);

    Optional<Booking> findByUserId(String userId);
    Optional<Booking> findByBookingId(String bookingId);

    List<Booking> findAllByTableId(String tableId);
    List<Booking> findAllByUserId(String userId);
}

