package com.example.web_restaurant.mapper;


import com.example.web_restaurant.dto.request.ChatMessageRequest;
import com.example.web_restaurant.dto.response.ChatMessageResponse;
import com.example.web_restaurant.entity.ChatMessage;
import org.springframework.stereotype.Component;

@Component
public class ChatMessageMapper {
    public ChatMessage toEntity(ChatMessageRequest request) {
        ChatMessage entity = new ChatMessage();
        entity.setCustomerName(request.getCustomerName());
        entity.setCustomerEmail(request.getCustomerEmail());
        entity.setMessage(request.getMessage());
        return entity;
    }

    public ChatMessageResponse toResponse(ChatMessage entity) {
        return ChatMessageResponse.builder()
                .id(entity.getId())
                .customerName(entity.getCustomerName())
                .customerEmail(entity.getCustomerEmail())
                .message(entity.getMessage())
                .adminEmail(entity.getAdminEmail())
                .adminReply(entity.getAdminReply())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .repliedAt(entity.getRepliedAt())
                .build();
    }
}
