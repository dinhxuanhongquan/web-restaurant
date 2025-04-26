package com.example.web_restaurant.dto.response;

import com.example.web_restaurant.entity.Dish;
import com.example.web_restaurant.entity.User;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

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

    User user;
    Set<ReplyResponse> replies;
}
