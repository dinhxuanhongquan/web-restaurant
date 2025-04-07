package com.example.web_restaurant.dto.response;

import com.example.web_restaurant.entity.Dish;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryDishResponse {
    String categoryId;
    String categoryName;
    String categoryDescription;

    Set<DishResponse> dishes;
}
