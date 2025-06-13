package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);

    Page<ChatMessage> findByStatusOrderByCreatedAtDesc(ChatMessage.ChatStatus status, Pageable pageable);

    Page<ChatMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(ChatMessage.ChatStatus status);
}
