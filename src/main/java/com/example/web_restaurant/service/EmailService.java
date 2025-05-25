package com.example.web_restaurant.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;

    @Async
    public void sendVerificationEmail(String to, String code, String purpose) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            String subject = purpose.equals("PASSWORD_RESET") ?
                    "Password Reset Code - Web Restaurant" :
                    "Email Verification Code - Web Restaurant";

            String content = buildEmailTemplate(code, purpose);

            helper.setText(content, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("noreply@webrestaurant.com");

            mailSender.send(mimeMessage);
            log.info("Verification email sent to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String buildEmailTemplate(String code, String purpose) {
        String action = purpose.equals("PASSWORD_RESET") ? "reset your password" : "verify your email";

        return "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>" +
                "<h2 style='color: #5c6ac4;'>Web Restaurant</h2>" +
                "<p>Your verification code to " + action + " is:</p>" +
                "<h1 style='font-size: 32px; letter-spacing: 3px; background-color: #f4f4f4; " +
                "padding: 10px; text-align: center; margin: 20px 0;'>" + code + "</h1>" +
                "<p>This code will expire in 15 minutes.</p>" +
                "<p>If you didn't request this code, you can safely ignore this email.</p>" +
                "<p>Thank you,<br>Web Restaurant Team</p>" +
                "</div>";
    }

    // Send email to user when they book a table successfully
    @Async
    public void sendBookingConfirmationEmail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("quandinh.09022003@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        try {
            mailSender.send(message);
            log.info("Booking confirmation email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email to: {}", to, e);
            throw new RuntimeException("Failed to send booking confirmation email", e);
        }
    }
}