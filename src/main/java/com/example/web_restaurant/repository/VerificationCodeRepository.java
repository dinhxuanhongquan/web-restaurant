package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findByEmailAndCodeAndPurposeAndUsedFalseAndExpiresAtAfter(
            String email, String code, String purpose, LocalDateTime now);

    void deleteByEmailAndPurpose(String email, String purpose);

    void deleteByExpiresAtBefore(LocalDateTime now);
}