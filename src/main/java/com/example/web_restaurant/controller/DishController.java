package com.example.web_restaurant.controller;

import com.example.web_restaurant.dto.request.ApiResponse;
import com.example.web_restaurant.dto.request.DishCreationRequest;
import com.example.web_restaurant.dto.request.DishUpdateRequest;
import com.example.web_restaurant.dto.response.DishResponse;
import com.example.web_restaurant.service.DishService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dishes")
@Slf4j
@FieldDefaults( level = AccessLevel.PRIVATE, makeFinal = true)
public class DishController {
    DishService dishService;

    @PostMapping
    public ApiResponse<DishResponse> createDish(@RequestBody DishCreationRequest request) {
        return ApiResponse.<DishResponse>builder()
                .result(dishService.createDish(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<DishResponse>> getAllDishes() {
        return ApiResponse.<List<DishResponse>>builder()
                .result(dishService.getAllDishes())
                .build();
    }

    @GetMapping("/{dishId}")
    public ApiResponse<DishResponse> getDishById(@PathVariable("dishId") String dishId) {
        return ApiResponse.<DishResponse>builder()
                .result(dishService.getDishById(dishId))
                .build();
    }

    @PutMapping("/{dishId}")
    public ApiResponse<DishResponse> updateDish(
            @RequestBody @Valid DishUpdateRequest request,
            @PathVariable("dishId") String dishId) {
        return ApiResponse.<DishResponse>builder()
                .result(dishService.updateDish(request, dishId))
                .build();
    }

    @DeleteMapping("/{dishId}")
    public ApiResponse<String> deleteDish(@PathVariable("dishId") String dishId) {
        dishService.deleteDish(dishId);
        return ApiResponse.<String>builder()
                .result("Dish has deleted successfully")
                .build();
    }
}
