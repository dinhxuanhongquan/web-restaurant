package com.example.web_restaurant.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class BookingCreationRequest {
    LocalDateTime bookingTime;

//    String userId;
    String tableId;
//    String billId;
}
