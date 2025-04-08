package com.example.web_restaurant.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingUpdateRequest {
    String customerName;
    String customerEmail;
    String customerPhoneNumber;
    String customerMessage;

    LocalDateTime bookingTime;

    List<String> tables;
}
