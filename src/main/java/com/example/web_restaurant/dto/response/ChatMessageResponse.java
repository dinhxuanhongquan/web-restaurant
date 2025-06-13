package com.example.web_restaurant.dto.response;

import com.example.web_restaurant.entity.ChatMessage;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessageResponse {
    Long id;
    String customerName;
    String customerEmail;
    String message;
    String adminEmail;
    String adminReply;
    ChatMessage.ChatStatus status;
    LocalDateTime createdAt;
    LocalDateTime repliedAt;
}


