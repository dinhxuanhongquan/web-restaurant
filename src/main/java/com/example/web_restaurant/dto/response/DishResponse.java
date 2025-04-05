package com.example.web_restaurant.dto.response;

import com.example.web_restaurant.entity.Bill;
import com.example.web_restaurant.entity.FeedBack;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ManyToMany;
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
    Set<Bill> bills;
    Set<FeedBack> feedBacks;
}
