package com.example.web_restaurant.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillDishResponse {
    String billDishId;
    Integer quantity;

    BillResponse bill;
    DishResponse dish;
}
