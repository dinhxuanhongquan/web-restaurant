package com.example.web_restaurant.dto.response;

import com.example.web_restaurant.entity.Bill;
import com.example.web_restaurant.entity.Table;
import com.example.web_restaurant.entity.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingResponse {
    String bookingId;
    LocalDateTime bookingTime;

    UserResponse user;
    TableResponse table;
}
