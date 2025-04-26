package com.example.web_restaurant.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DishCreationRequest {

    String dishName;
    String dishDescription;
    String dishImage;
    String dishPrice;

    Set<String> billDishes;

    Set<String> feedBacks;
    String categoryDishId;
}
