package com.example.web_restaurant.controller;

import com.example.web_restaurant.dto.request.*;
import com.example.web_restaurant.dto.response.AuthenticationResponse;
import com.example.web_restaurant.dto.response.EmailVerificationResponse;
import com.example.web_restaurant.dto.response.IntrospectResponse;
import com.example.web_restaurant.dto.response.PasswordResetResponse;
import com.example.web_restaurant.service.AuthenticationService;
import com.example.web_restaurant.service.PasswordService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    PasswordService passwordService;

//    as login
    @PostMapping("/token")
    public ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);

        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request)
        throws JOSEException, ParseException{
        var result = authenticationService.introspect(request);

        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody LogoutRequest request)
        throws JOSEException, ParseException
    {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> refresh(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        var result = authenticationService.refresh(request);

        return ApiResponse.<AuthenticationResponse>builder()
                .result(result).build();
    }

    @PostMapping("/password/reset-request")
    public ApiResponse<PasswordResetResponse> requestPasswordReset(
            @Valid @RequestBody PasswordResetRequest request) {
        var result = passwordService.requestPasswordReset(request);
        return ApiResponse.<PasswordResetResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/password/reset-confirm")
    public ApiResponse<PasswordResetResponse> confirmPasswordReset(
            @Valid @RequestBody PasswordResetConfirmRequest request) {
        var result = passwordService.confirmPasswordReset(request);
        return ApiResponse.<PasswordResetResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/password/change")
    public ApiResponse<PasswordResetResponse> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        var result = passwordService.changePassword(userDetails.getUsername(), request);
        return ApiResponse.<PasswordResetResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/email/verification-request")
    public ApiResponse<EmailVerificationResponse> requestEmailVerification(
            @Valid @RequestBody EmailVerificationRequest request) {
        var result = passwordService.requestEmailVerification(request);
        return ApiResponse.<EmailVerificationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/email/verify")
    public ApiResponse<EmailVerificationResponse> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request) {
        var result = passwordService.verifyEmail(request);
        return ApiResponse.<EmailVerificationResponse>builder()
                .result(result)
                .build();
    }
}
