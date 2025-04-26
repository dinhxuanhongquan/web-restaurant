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
public class Bill {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String billId;

    LocalDateTime billTime;

    @OneToOne
    @JoinColumn(name = "bookingId")
    Booking booking;

    @OneToMany(mappedBy = "bill", cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    Set<BillDish> billDishes;

    @ManyToOne
    @JoinColumn(name = "userId")
    User user;
}
