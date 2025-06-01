package com.example.web_restaurant.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;


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

    UserResponse user;
}
