package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.Table;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TableRepository extends JpaRepository<Table, String> {
    boolean existsByTableName(String tableName);

    Optional<Table> findByTableName(String tableName);
}
