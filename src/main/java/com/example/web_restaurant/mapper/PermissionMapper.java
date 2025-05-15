package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.PermissionRequest;
import com.example.web_restaurant.dto.response.PermissionResponse;
import com.example.web_restaurant.entity.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    @Mapping(source = "permissionName", target = "permissionName")
    @Mapping(source = "description", target = "description")
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
