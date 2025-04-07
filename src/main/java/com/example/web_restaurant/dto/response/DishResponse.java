package com.example.web_restaurant.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DishResponse {
    String dishId;

    String dishName;
    String dishDescription;
    String dishImage;
    String dishPrice;

    String dishCategory;
    Set<BillResponse> bills;
    Set<FeedBackResponse> feedBacks;
}
