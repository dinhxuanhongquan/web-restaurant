package com.example.web_restaurant.entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String customerName;

    String customerEmail;

    String adminEmail;

    @Column(nullable = false, columnDefinition = "TEXT")
    String message;

    @Column(columnDefinition = "TEXT")
    String adminReply;

    @Enumerated(EnumType.STRING)
    ChatStatus status = ChatStatus.PENDING;

    @Column(nullable = false)
    LocalDateTime createdAt;

    LocalDateTime repliedAt;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
    }

    public enum ChatStatus {
        PENDING,
        REPLIED,
        CLOSED
    }
}
