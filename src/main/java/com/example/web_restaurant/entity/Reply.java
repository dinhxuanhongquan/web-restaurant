package com.example.web_restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults( level = AccessLevel.PRIVATE)
public class Reply {
    @Id @GeneratedValue( strategy = GenerationType.UUID)
    String replyId;

    String replyContent;
    LocalDateTime replyTime;

    @ManyToOne
    @JoinColumn(name = "userId")
    User user;

    @ManyToOne
    @JoinColumn(name = "feedBackId")
    FeedBack feedBack;
}
