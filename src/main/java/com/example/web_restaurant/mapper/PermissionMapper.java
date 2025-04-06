package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.PermissionRequest;
import com.example.web_restaurant.dto.response.PermissionResponse;
import com.example.web_restaurant.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
