package com.example.web_restaurant.dto.response;

import com.example.web_restaurant.entity.Dish;
import com.example.web_restaurant.entity.Table;
import com.example.web_restaurant.entity.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillResponse {
    String billId;
    String billContent;
    String billStatus;
    String phoneNumber;

    Set<DishResponse> dishes;
    Integer quantity;
    String totalPrice;
}
