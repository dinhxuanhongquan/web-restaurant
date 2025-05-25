package com.example.web_restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@jakarta.persistence.Table(name = "app_user")
public class User {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String userId;

    @Column(name = "username")
    String username;

    String password;
    String firstName;
    String lastName;
    LocalDate dob;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    String image;

    @Column(name = "email", unique = true, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String email;
    String phoneNumber;

//    @OneToMany(mappedBy = "user", cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
//    Set<Booking> bookings;
//
//    @OneToMany(mappedBy = "user", cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
//    Set<FeedBack> feedBacks;
//
//    @OneToMany(mappedBy = "user", cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
//    Set<Reply> replies;

    @ManyToMany
    Set<Role> roles;
}
