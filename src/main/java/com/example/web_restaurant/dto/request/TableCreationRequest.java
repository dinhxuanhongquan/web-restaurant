package com.example.web_restaurant.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;


@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TableCreationRequest {
    String tableName;
    Integer tableSeat;
    String tableKind;
    String tableStatus;
    String tableLocation;
}
