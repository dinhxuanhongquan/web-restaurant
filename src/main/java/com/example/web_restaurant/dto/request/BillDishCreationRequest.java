package com.example.web_restaurant.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;


@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillDishCreationRequest {
    Integer quantity;
    String billId;
    String dishId;
}
