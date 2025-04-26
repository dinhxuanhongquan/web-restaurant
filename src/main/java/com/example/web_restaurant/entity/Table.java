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
public class Table {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String tableId;

    String tableName;
    Integer tableSeat;
    String tableKind;
    String tableStatus;
    String tableLocation;

    @OneToMany(mappedBy = "table", cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    Set<Booking> bookings;
}
