package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.PermissionRequest;
import com.example.web_restaurant.dto.response.PermissionResponse;
import com.example.web_restaurant.entity.Permission;
import com.example.web_restaurant.mapper.PermissionMapper;
import com.example.web_restaurant.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class PermissionService {
    PermissionMapper permissionMapper;
    PermissionRepository permissionRepository;

    public PermissionResponse create(PermissionRequest request){
        Permission permission = permissionMapper.toPermission(request);
        permission = permissionRepository.save(permission);
        return permissionMapper.toPermissionResponse((permission));
    }

    public List<PermissionResponse> getAll(){
        var permissions = permissionRepository.findAll();
        return permissions.stream().map(permissionMapper::toPermissionResponse).toList();
    }

    public void delete(String permission){
        permissionRepository.deleteById(permission);
    }
}
