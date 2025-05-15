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
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String bookingId;

    LocalDateTime bookingTime;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId")
    User user;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "tableId")
    Table table;

}
