package com.example.web_restaurant.dto.request;


import com.example.web_restaurant.entity.Booking;
import com.example.web_restaurant.entity.FeedBack;
import com.example.web_restaurant.entity.Reply;
import com.example.web_restaurant.entity.Role;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    @Size(min = 4, message = "USERNAME_VALIDATION")
    String username;

    @Size(min = 4, message = "PASSWORD_VALIDATION")
    String password;

    String firstName;
    String lastName;

    LocalDate dob;
    String image;

    String email;
    String phoneNumber;

//    Set<Booking> bookings;
//    Set<FeedBack> feedBacks;
//    Set<Reply> replies;
    Set<Role> roles;
}
