package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.AdminReplyRequest;
import com.example.web_restaurant.dto.request.ChatMessageRequest;
import com.example.web_restaurant.dto.response.ChatMessageResponse;
import com.example.web_restaurant.entity.ChatMessage;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.ChatMessageMapper;
import com.example.web_restaurant.repository.ChatMessageRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessageService {
    final ChatMessageRepository chatMessageRepository;
    final ChatMessageMapper chatMessageMapper;
    final JavaMailSender mailSender;

    @Transactional
    public ChatMessageResponse createChatMessage(ChatMessageRequest request) {
        try {
            ChatMessage entity = chatMessageMapper.toEntity(request);
            ChatMessage savedMessage = chatMessageRepository.save(entity);

            sendNotificationToAdmin(savedMessage);

            return chatMessageMapper.toResponse(savedMessage);
        } catch (Exception e) {
            throw new AppException(ErrorCode.FAILED_TO_CREATE_MESSAGE);
        }
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public ChatMessageResponse replyToMessage(Long messageId, AdminReplyRequest request) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Chat message not found"));
        message.setAdminReply(request.getAdminReply());
        message.setAdminEmail(request.getAdminEmail());
        message.setStatus(ChatMessage.ChatStatus.REPLIED);
        message.setRepliedAt(LocalDateTime.now());
        ChatMessage updatedMessage = chatMessageRepository.save(message);

        sendNotificationToAdmin(updatedMessage);
        log.info("Chat message replied successfully with ID: {}", updatedMessage.getId());
        return chatMessageMapper.toResponse(updatedMessage);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public List<ChatMessageResponse> getMessagesByCustomerEmail(String customerEmail) {
        List<ChatMessage> messages = chatMessageRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail);
        return messages.stream()
                .map(chatMessageMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ChatMessageResponse> getAllMessages(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessage> messages = chatMessageRepository.findAllByOrderByCreatedAtDesc(pageable);
        return messages.map(chatMessageMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ChatMessageResponse getMessageById(Long messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Chat message not found"));
        return chatMessageMapper.toResponse(message);
    }

    @Transactional
    public long getPendingMessageCount() {
        return chatMessageRepository.countByStatus(ChatMessage.ChatStatus.PENDING);
    }

    @Transactional(readOnly = true)
    public Page<ChatMessageResponse> getMessagesByStatus(ChatMessage.ChatStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessage> messages = chatMessageRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        return messages.map(chatMessageMapper::toResponse);
    }

    private void sendNotificationToAdmin(ChatMessage message) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo("quandinh.09022003@gmail.com"); // Replace with actual admin email
            mailMessage.setSubject("New Customer Message - ChatBox");
            mailMessage.setText(String.format(
                    "New message received from customer:\n\n" +
                            "Customer: %s (%s)\n" +
                            "Message: %s\n\n" +
                            "Please log in to the admin panel to reply.",
                    message.getCustomerName(),
                    message.getCustomerEmail(),
                    message.getMessage()
            ));

            mailSender.send(mailMessage);
            log.info("Notification email sent to admin for message ID: {}", message.getId());
        } catch (Exception e) {
            log.error("Failed to send notification email to admin: {}", e.getMessage());
        }
    }
}
