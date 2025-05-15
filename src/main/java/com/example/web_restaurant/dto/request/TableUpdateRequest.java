package com.example.web_restaurant.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.Set;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TableUpdateRequest {
    String tableName;
    Integer tableSeat;
    String tableKind;
    String tableStatus;
    String tableLocation;
//    Set<String> bookings;
}
