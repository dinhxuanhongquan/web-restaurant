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
@jakarta.persistence.Table(name = "restaurant_table")
public class Table {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String tableId;

    String tableName;
    Integer tableSeat;
    String tableKind;
    String tableStatus;
    String tableLocation;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId")
    User user;
}
