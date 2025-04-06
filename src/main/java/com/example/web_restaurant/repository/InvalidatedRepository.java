package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidatedRepository extends JpaRepository<InvalidatedToken, String> {
}
