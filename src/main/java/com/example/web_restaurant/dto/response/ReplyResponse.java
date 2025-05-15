package com.example.web_restaurant.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class ReplyResponse {
    String replyContent;
    LocalDateTime replyTime;

    UserResponse user;
    FeedBackResponse feedBack;
}
