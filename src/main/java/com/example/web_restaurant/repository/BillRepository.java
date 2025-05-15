package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, String> {
    boolean existsByBillId(String billId);

    List<Bill> findAllByBooking_BookingId(String bookingId);
    List<Bill> findAllByUser_UserId(String userId);
}
