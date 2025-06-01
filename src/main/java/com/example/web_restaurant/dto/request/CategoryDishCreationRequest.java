package com.example.web_restaurant.dto.request;

import com.example.web_restaurant.entity.Dish;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryDishCreationRequest {

    String categoryName;
    String categoryDescription;
}
