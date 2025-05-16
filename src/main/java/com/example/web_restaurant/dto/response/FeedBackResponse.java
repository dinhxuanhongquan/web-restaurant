package com.example.web_restaurant.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedBackResponse {
    String feedBackId;
    String feedBackContent;
    LocalDateTime feedBackTime;
    Integer rating;

    UserResponse user;
    DishResponse dish;
}
