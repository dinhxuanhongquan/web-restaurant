package com.example.web_restaurant.dto.response;

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
    String customerName;
    String customerEmail;
    String customerPhoneNumber;
    String customerMessage;

    LocalDateTime bookingTime;

    Set<TableResponse> tables;
}
