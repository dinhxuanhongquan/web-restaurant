package com.example.web_restaurant.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

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

//    @OneToMany(mappedBy = "feedBack", cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
//    Set<Reply> replies;
}
