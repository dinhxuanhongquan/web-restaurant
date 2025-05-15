package com.example.web_restaurant.dto.response;

import com.example.web_restaurant.entity.Booking;
import com.example.web_restaurant.entity.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillResponse {
    String billId;
    LocalDateTime billTime;

    BookingResponse booking;
    UserResponse user;
}
