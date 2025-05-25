package com.example.web_restaurant.dto.request;


import com.example.web_restaurant.entity.Role;
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
    String password;
    String firstName;
    String lastName;

    LocalDate dob;

    String email;
    String phoneNumber;
    String image;

    List<String> roleNames;
}
