package com.example.web_restaurant.controller;

import com.example.web_restaurant.dto.request.AdminReplyRequest;
import com.example.web_restaurant.dto.request.ChatMessageRequest;
import com.example.web_restaurant.dto.response.ApiResponse;
import com.example.web_restaurant.dto.response.ChatMessageResponse;
import com.example.web_restaurant.entity.ChatMessage;
import com.example.web_restaurant.service.ChatMessageService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ChatController {
    ChatMessageService chatMessageService;

    @PostMapping("/message")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> createMessage(
            @Valid @RequestBody ChatMessageRequest request) {
        try {
            ChatMessageResponse response = chatMessageService.createChatMessage((request));
            return ResponseEntity.ok(
                    ApiResponse.success(response, "Chat message created successfully")
            );
        } catch ( Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error("Failed to create chat message: " + e.getMessage())
            );
        }
    }

    @PostMapping("/messages/{messageId}/reply")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> replyToMessage(
            @PathVariable Long messageId,
            @Valid @RequestBody AdminReplyRequest request) {
        try {
            ChatMessageResponse response = chatMessageService.replyToMessage(messageId, request);
            return ResponseEntity.ok(
                    ApiResponse.success(response, "Reply sent successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to send reply: " + e.getMessage()));
        }
    }

    @GetMapping("/messages/customer/{customerEmail}")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>> getCustomerMessages(
            @PathVariable String customerEmail) {
        try {
            List<ChatMessageResponse> messages = chatMessageService.getMessagesByCustomerEmail(customerEmail);
            return ResponseEntity.ok(
                    ApiResponse.success(messages, "Messages retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve messages: " + e.getMessage()));
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<ApiResponse<Page<ChatMessageResponse>>> getAllMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<ChatMessageResponse> messages = chatMessageService.getAllMessages(page, size);
            return ResponseEntity.ok(
                    ApiResponse.success(messages, "Messages retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve messages: " + e.getMessage()));
        }
    }

    @GetMapping("/messages/status/{status}")
    public ResponseEntity<ApiResponse<Page<ChatMessageResponse>>> getMessagesByStatus(
            @PathVariable ChatMessage.ChatStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<ChatMessageResponse> messages = chatMessageService.getMessagesByStatus(status, page, size);
            return ResponseEntity.ok(
                    ApiResponse.success(messages, "Messages retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve messages: " + e.getMessage()));
        }
    }

    @GetMapping("/messages/{id}")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> getMessageById(@PathVariable Long id) {
        try {
            ChatMessageResponse message = chatMessageService.getMessageById(id);
            return ResponseEntity.ok(
                    ApiResponse.success(message, "Message retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Message not found: " + e.getMessage()));
        }
    }

    @GetMapping("/messages/pending/count")
    public ResponseEntity<ApiResponse<Long>> getPendingMessagesCount() {
        try {
            long count = chatMessageService.getPendingMessageCount();
            return ResponseEntity.ok(
                    ApiResponse.success(count, "Pending messages count retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to get pending messages count: " + e.getMessage()));
        }
    }
}
