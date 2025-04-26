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
public class Dish {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String dishId;

    String dishName;
    String dishDescription;
    String dishImage;
    String dishPrice;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<BillDish> billDishes;

    @OneToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    Set<FeedBack> feedBacks;

    @OneToOne
    @JoinColumn(name = "categoryId")
    CategoryDish categoryDish;
}
