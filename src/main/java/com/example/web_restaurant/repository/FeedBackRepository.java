package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.FeedBack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeedBackRepository extends JpaRepository<FeedBack, String> {
    boolean existsByFeedBackId(String feedBackId);

    Optional<FeedBack> findByFeedBackId(String feedBackId);

    List<FeedBack> findAllByUser_UserId(String userId);

    List<FeedBack> findAllByDish_DishId(String dishId);
}
