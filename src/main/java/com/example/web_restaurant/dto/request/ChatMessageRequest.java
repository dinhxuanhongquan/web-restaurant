package com.example.web_restaurant.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessageRequest {
    @NotBlank(message = "Customer name is required")
    @Size(max = 100, message = "Customer name must be less than 100 characters")
    String customerName;

    @NotBlank(message = "Customer email is required")
    @Size(message = "Customer email must be less than 100 characters")
    String customerEmail;

    @NotBlank(message = "Message is required")
    @Size(max = 1000, message = "Message must be less than 500 characters")
    String message;
}
