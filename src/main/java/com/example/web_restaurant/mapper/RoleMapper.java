package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.RoleRequest;
import com.example.web_restaurant.dto.response.RoleResponse;
import com.example.web_restaurant.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
