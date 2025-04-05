package com.example.web_restaurant.dto.request;

import com.example.web_restaurant.entity.Dish;
import com.example.web_restaurant.entity.Table;
import com.example.web_restaurant.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillUpdateRequest {
    String billContent;
    String billStatus;
    String phoneNumber;

    Table table;
    User user;
    Set<Dish> dishes;

    Integer quantity;
    String totalPrice;

}
