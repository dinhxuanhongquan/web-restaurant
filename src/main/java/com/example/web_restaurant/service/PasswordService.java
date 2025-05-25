package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.*;
import com.example.web_restaurant.dto.response.*;
import com.example.web_restaurant.entity.*;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@Slf4j
public class PasswordService {

    private final UserRepository userRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    // Length of verification code
    private static final int CODE_LENGTH = 6;

    // How long verification codes are valid (in minutes)
    private static final int CODE_VALIDITY_MINUTES = 15;

    public PasswordService(UserRepository userRepository,
                           VerificationCodeRepository verificationCodeRepository,
                           EmailService emailService) {
        this.userRepository = userRepository;
        this.verificationCodeRepository = verificationCodeRepository;
        this.emailService = emailService;
        this.passwordEncoder = new BCryptPasswordEncoder(10);
    }

    /**
     * Request a password reset by sending a verification code via email
     */
    @Transactional
    public PasswordResetResponse requestPasswordReset(PasswordResetRequest request) {
        String email = request.getEmail();

        // Check if user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Remove any existing verification codes for this email and purpose
        verificationCodeRepository.deleteByEmailAndPurpose(email, "PASSWORD_RESET");

        // Generate and save new verification code
        String code = generateVerificationCode();
        VerificationCode verificationCode = VerificationCode.builder()
                .email(email)
                .code(code)
                .purpose("PASSWORD_RESET")
                .used(false)
                .expiresAt(LocalDateTime.now().plusMinutes(CODE_VALIDITY_MINUTES))
                .build();

        verificationCodeRepository.save(verificationCode);

        // Send email with verification code
        emailService.sendVerificationEmail(email, code, "PASSWORD_RESET");

        return PasswordResetResponse.builder()
                .success(true)
                .message("Password reset instructions sent to your email")
                .build();
    }

    /**
     * Confirm password reset with verification code and set new password
     */
    @Transactional
    public PasswordResetResponse confirmPasswordReset(PasswordResetConfirmRequest request) {
        String email = request.getEmail();
        String code = request.getVerificationCode();
        String newPassword = request.getNewPassword();

        // Verify the code
        VerificationCode verificationCode = verificationCodeRepository
                .findByEmailAndCodeAndPurposeAndUsedFalseAndExpiresAtAfter(
                        email, code, "PASSWORD_RESET", LocalDateTime.now())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_KEY));

        // Mark code as used
        verificationCode.setUsed(true);
        verificationCodeRepository.save(verificationCode);

        // Update user's password
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return PasswordResetResponse.builder()
                .success(true)
                .message("Password has been reset successfully")
                .build();
    }

    /**
     * Change password for authenticated user
     */
    @Transactional
    public PasswordResetResponse changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return PasswordResetResponse.builder()
                .success(true)
                .message("Password changed successfully")
                .build();
    }

    /**
     * Request email verification by sending a verification code
     */
    @Transactional
    public EmailVerificationResponse requestEmailVerification(EmailVerificationRequest request) {
        String email = request.getEmail();

        // Check if user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Remove any existing verification codes for this email and purpose
        verificationCodeRepository.deleteByEmailAndPurpose(email, "EMAIL_VERIFICATION");

        // Generate and save new verification code
        String code = generateVerificationCode();
        VerificationCode verificationCode = VerificationCode.builder()
                .email(email)
                .code(code)
                .purpose("EMAIL_VERIFICATION")
                .used(false)
                .expiresAt(LocalDateTime.now().plusMinutes(CODE_VALIDITY_MINUTES))
                .build();

        verificationCodeRepository.save(verificationCode);

        // Send email with verification code
        emailService.sendVerificationEmail(email, code, "EMAIL_VERIFICATION");

        return EmailVerificationResponse.builder()
                .success(true)
                .message("Verification code sent to your email")
                .build();
    }

    /**
     * Verify email with verification code
     */
    @Transactional
    public EmailVerificationResponse verifyEmail(VerifyEmailRequest request) {
        String email = request.getEmail();
        String code = request.getVerificationCode();

        // Verify the code
        VerificationCode verificationCode = verificationCodeRepository
                .findByEmailAndCodeAndPurposeAndUsedFalseAndExpiresAtAfter(
                        email, code, "EMAIL_VERIFICATION", LocalDateTime.now())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_KEY));

        // Mark code as used
        verificationCode.setUsed(true);
        verificationCodeRepository.save(verificationCode);

        // Update user's email verification status
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userRepository.save(user);

        return EmailVerificationResponse.builder()
                .success(true)
                .message("Email verified successfully")
                .build();
    }

    /**
     * Generate a random verification code
     */
    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        StringBuilder code = new StringBuilder();

        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(random.nextInt(10));
        }

        return code.toString();
    }

    /**
     * Clean up expired verification codes (runs daily)
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupExpiredCodes() {
        log.info("Cleaning up expired verification codes");
        verificationCodeRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
