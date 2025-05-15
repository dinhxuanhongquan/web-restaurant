package com.example.web_restaurant.controller;

import com.example.web_restaurant.dto.request.ApiResponse;
import com.example.web_restaurant.dto.request.CategoryDishCreationRequest;
import com.example.web_restaurant.dto.request.CategoryDishUpdateRequest;
import com.example.web_restaurant.dto.response.CategoryDishResponse;
import com.example.web_restaurant.service.CategoryDishService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/category-dishes")
@Slf4j
@FieldDefaults( level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryDishController {
    CategoryDishService categoryDishService;

    @PostMapping
    public ApiResponse<CategoryDishResponse> createCategoryDish(@RequestBody CategoryDishCreationRequest request) {
        return ApiResponse.<CategoryDishResponse>builder()
                .result(categoryDishService.createCategoryDish(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<CategoryDishResponse>> getAllCategoryDishes() {
        return ApiResponse.<List<CategoryDishResponse>>builder()
                .result(categoryDishService.getAllCategoryDishes())
                .build();
    }


    @GetMapping("/{categoryDishId}")
    public ApiResponse<CategoryDishResponse> getCategoryDishById(@PathVariable("categoryDishId") String categoryDishId) {
        return ApiResponse.<CategoryDishResponse>builder()
                .result(categoryDishService.getCategoryDishById(categoryDishId))
                .build();
    }

    @PutMapping("/{categoryDishId}")
    public ApiResponse<CategoryDishResponse> updateCategoryDish(@RequestBody CategoryDishUpdateRequest request, @PathVariable("categoryDishId") String categoryDishId) {
        return ApiResponse.<CategoryDishResponse>builder()
                .result(categoryDishService.updateCategoryDish(categoryDishId, request))
                .build();
    }

    @DeleteMapping("/{categoryDishId}")
    public ApiResponse<String> deleteCategoryDish(@PathVariable("categoryDishId") String categoryDishId) {
        categoryDishService.deleteCategoryDish(categoryDishId);
        return ApiResponse.<String>builder()
                .result("Category Dish has deleted successfully")
                .build();
    }
}
