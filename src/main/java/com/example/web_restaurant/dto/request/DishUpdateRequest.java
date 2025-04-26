package com.example.web_restaurant.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DishUpdateRequest {
    String dishName;
    String dishDescription;
    String dishImage;
    String dishPrice;
    Set<String> billDishes;
    Set<String> feedBacks;
    String categoryDishId;
}
