package com.example.web_restaurant.dto.response;

import com.example.web_restaurant.entity.Dish;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedBackResponse {
    String feedBackId;
    String feedBackContent;
    String phoneNumber;
    String email;
}
