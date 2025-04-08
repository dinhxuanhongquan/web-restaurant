package com.example.web_restaurant.dto.request;

import com.example.web_restaurant.dto.response.TableResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class BookingCreationRequest {
    String customerName;
    String customerPhoneNumber;
    String customerEmail;
    String customerMessage;

    LocalDateTime bookingTime;

    List<String> tables;
}
