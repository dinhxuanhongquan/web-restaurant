package com.example.web_restaurant.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String userId;
    String username;
    String firstName;
    String lastName;
    String email;
    String phoneNumber;
    LocalDate dob;
    String image;

//    Set<BookingResponse> bookings;
//    Set<FeedBackResponse> feedBacks;
//    Set<ReplyResponse> replies;
    Set<RoleResponse> roles;
}
