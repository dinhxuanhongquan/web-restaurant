package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, String> {
    boolean existsByUser_UserId(String userId);
    boolean existsByTable_TableId(String tableId);

    Optional<Booking> findByUser_UserId(String userId);
    Optional<Booking> findByBookingId(String bookingId);

    List<Booking> findAllByTable_TableId(String tableId);
    List<Booking> findAllByUser_UserId(String userId);
}

