package com.example.web_restaurant.entity;


import jakarta.persistence.*;
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
public class FeedBack {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String feedBackId;

    String feedBackContent;
    LocalDateTime feedBackTime;
    Integer rating;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId")
    User user;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dishId")
    Dish dish;
}
