package com.example.web_restaurant.dto.request;

import com.example.web_restaurant.entity.BillDish;
import com.example.web_restaurant.entity.FeedBack;
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
    String nameChef;

    String categoryDishId;
//    Set<BillDish> billDishes;
//    Set<FeedBack> feedBacks;
}
