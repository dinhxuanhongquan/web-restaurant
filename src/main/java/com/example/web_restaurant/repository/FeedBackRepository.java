package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.FeedBack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeedBackRepository extends JpaRepository<FeedBack, String> {
    boolean existsByFeedBackName(String feedBackName);

    Optional<FeedBack> findByFeedBackName(String feedBackName);
}
