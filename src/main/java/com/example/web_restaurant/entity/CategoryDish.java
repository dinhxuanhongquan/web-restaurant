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
public class CategoryDish {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String categoryId;

    String categoryName;
    String categoryDescription;


    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId")
    User user;
}
