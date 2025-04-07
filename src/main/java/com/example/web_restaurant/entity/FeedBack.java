package com.example.web_restaurant.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class FeedBack {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String feedBackId;

    String feedBackContent;

    String phoneNumber;
    String email;
}
