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

    @OneToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    Set<Dish> dishes;

    @ManyToOne
    @JoinColumn(name = "userId")
    User user;

}
