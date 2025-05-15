package com.example.web_restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillDish {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String billDishId;

    Integer quantity;

    // Add new annotation cascade
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "billId")
    Bill bill;

    // Add new annotation cascade
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dishId")
    Dish dish;

}
