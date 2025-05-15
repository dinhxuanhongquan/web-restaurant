package com.example.web_restaurant.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String username;
    String password;
    String firstName;
    String lastName;

    LocalDate dob;

    String email;
    String phoneNumber;
    String image;

    List<String> roles;
//    List<String> bookings;
//    List<String> feedBacks;
//    List<String> replies;
}
