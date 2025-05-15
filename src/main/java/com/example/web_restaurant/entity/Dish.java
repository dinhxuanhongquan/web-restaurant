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
    String dishDescription;
    String dishImage;
    String dishPrice;
    String nameChef;

//    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
//    Set<BillDish> billDishes;
//
//    @OneToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}, orphanRemoval = true)
//    Set<FeedBack> feedBacks;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "categoryId")
    CategoryDish categoryDish;


}
