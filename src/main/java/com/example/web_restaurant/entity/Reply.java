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

    // Add new annotation cascade
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId")
    User user;

    // Add new annotation cascade
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "feedBackId")
    FeedBack feedBack;
}
