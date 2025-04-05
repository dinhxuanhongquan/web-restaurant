package com.example.web_restaurant.dto.response;

import com.example.web_restaurant.entity.Dish;
import com.example.web_restaurant.entity.Table;
import com.example.web_restaurant.entity.User;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
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

    Table table;

    User user;

    Set<Dish> dishes;
    Integer quantity;
    String totalPrice;
}
