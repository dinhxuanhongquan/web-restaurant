package com.example.web_restaurant.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryDishResponse {
    String categoryId;
    String categoryName;
    String categoryDescription;

    UserResponse user;
}
