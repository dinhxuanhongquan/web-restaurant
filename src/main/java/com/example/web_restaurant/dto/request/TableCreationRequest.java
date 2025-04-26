package com.example.web_restaurant.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TableCreationRequest {
    String tableName;
    String tableSeat;
    String tableKind;
    String tableStatus;
    String tableLocation;
    Set<String> bookings;
}
