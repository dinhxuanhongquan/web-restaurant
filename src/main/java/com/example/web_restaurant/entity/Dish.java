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
public class Dish {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String dishId;

    String dishName;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    String dishDescription;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    String dishImage;

    String dishPrice;
    String nameChef;


    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "categoryId")
    CategoryDish categoryDish;
}
