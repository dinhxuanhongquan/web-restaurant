package com.example.web_restaurant.dto.response;

import com.example.web_restaurant.entity.Bill;
import com.example.web_restaurant.entity.Booking;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class TableResponse {
    String tableId;

    String tableName;
    Integer tableSeat;
    String tableKind;
    String tableStatus;
    String tableLocation;

    Set<BookingResponse> bookings;
}
