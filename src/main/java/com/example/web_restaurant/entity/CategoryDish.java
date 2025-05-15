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
public class CategoryDish {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String categoryId;

    String categoryName;
    String categoryDescription;

//    @OneToMany(mappedBy = "categoryDish", cascade = CascadeType.ALL, orphanRemoval = true)
//    Set<Dish> dishes;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId")
    User user;

    // Helper method de quan ly quan he
//    public void addDish(Dish dish) {
//        this.dishes.add(dish);
//        dish.setCategoryDish(this);
//    }
//
//    public void removeDish(Dish dish) {
//        this.dishes.remove(dish);
//        dish.setCategoryDish(null);
//    }
}
