package com.example.web_restaurant.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor 
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingUpdateRequest {
    @NotNull(message = "Booking ID cannot be null")
    LocalDateTime bookingTime;

    String tableId;
}
