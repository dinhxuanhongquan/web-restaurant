package com.example.web_restaurant.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedBackCreationRequest {
    String feedBackContent;
    LocalDateTime  feedBackTime;
    Integer rating;
    String userId;
    Set<String> replies;
}
