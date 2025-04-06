package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, String> {
}
