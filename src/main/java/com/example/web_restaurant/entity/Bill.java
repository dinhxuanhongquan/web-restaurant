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
public class Bill {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String billId;

    LocalDateTime billTime;
    Boolean billStatus;

    // Add new annotation cascade
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bookingId")
    Booking booking;

    // Add new annotation cascade
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId")
    User user;
}
