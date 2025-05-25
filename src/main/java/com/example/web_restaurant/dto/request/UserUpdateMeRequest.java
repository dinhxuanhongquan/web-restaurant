package com.example.web_restaurant.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateMeRequest {
    String firstName;
    String lastName;

    LocalDate dob;

    String email;
    String phoneNumber;
    String image;
}
