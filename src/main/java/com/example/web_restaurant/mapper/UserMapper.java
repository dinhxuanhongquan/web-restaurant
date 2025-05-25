package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.UserCreationRequest;
import com.example.web_restaurant.dto.request.UserUpdateMeRequest;
import com.example.web_restaurant.dto.request.UserUpdateRequest;
import com.example.web_restaurant.dto.response.UserResponse;
import com.example.web_restaurant.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {RoleMapper.class})
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "password", ignore = true)
    void updateMe(@MappingTarget User user, UserUpdateMeRequest request);

}

