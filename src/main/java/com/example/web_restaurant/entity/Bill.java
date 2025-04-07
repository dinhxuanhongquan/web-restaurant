package com.example.web_restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String billId;

    String billContent;
    String billStatus;
    String phoneNumber;

    @ManyToMany
    Set<Dish> dishes;

    Integer quantity;
    String totalPrice;

}
