package com.example.web_restaurant.dto.response;

import com.example.web_restaurant.entity.Bill;
import com.example.web_restaurant.entity.Dish;
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
    Bill bill;
    Dish dish;
}
