package com.example.web_restaurant.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminReplyRequest {
    @NotBlank(message = "Reply message is required")
    @Email(message = "Reply message must be a valid email address")
    String adminEmail;

    @NotBlank(message = "Reply message is required")
    @Size(max = 1000, message = "Reply message must be less than 1000 characters")
    String adminReply;
}
