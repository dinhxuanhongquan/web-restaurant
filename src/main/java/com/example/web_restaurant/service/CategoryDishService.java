package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.CategoryDishCreationRequest;
import com.example.web_restaurant.dto.request.CategoryDishUpdateRequest;
import com.example.web_restaurant.dto.response.CategoryDishResponse;
import com.example.web_restaurant.entity.CategoryDish;
import com.example.web_restaurant.entity.Dish;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.CategoryDishMapper;
import com.example.web_restaurant.repository.CategoryDishRepository;
import com.example.web_restaurant.repository.DishRepository;
import com.example.web_restaurant.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryDishService {
    CategoryDishRepository categoryDishRepository;
    CategoryDishMapper categoryDishMapper;
    DishRepository dishRepository;
    UserRepository userRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public CategoryDishResponse createCategoryDish(CategoryDishCreationRequest request) {
        CategoryDish categoryDish = categoryDishMapper.toCategoryDish(request);
        var user = userRepository.findById(request.getUserId()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        HashSet<Dish> dishes = new HashSet<>();

        dishRepository.findById(request.getDishes().toString()).ifPresent(dishes::add);
        categoryDish.setDishes(dishes);
        categoryDish.setUser(user);
        try {
            categoryDish = categoryDishRepository.save(categoryDish);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.CATEGORY_DISH_NOT_CREATED);
        }

        return categoryDishMapper.toCategoryDishResponse(categoryDish);
    }

    public List<CategoryDishResponse> getAllCategoryDishes() {
        return categoryDishRepository.findAll()
                .stream()
                .map(categoryDishMapper::toCategoryDishResponse)
                .toList();
    }

    public CategoryDishResponse getCategoryDishById(String categoryId) {
        return categoryDishMapper.toCategoryDishResponse(
                categoryDishRepository.findById(categoryId)
                        .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_DISH_NOT_EXISTED))
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    public CategoryDishResponse updateCategoryDish(String categoryId, CategoryDishUpdateRequest request) {
        CategoryDish categoryDish = categoryDishRepository.findById(categoryId).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_DISH_NOT_EXISTED));

        categoryDishMapper.updateCategoryDish(categoryDish, request);
        var dishes = dishRepository.findAllById(request.getDishes());
        var user = userRepository.findById(request.getUserId()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        categoryDish.setDishes(new HashSet<>(dishes));
        categoryDish.setUser(user);

        return categoryDishMapper.toCategoryDishResponse(
                categoryDishRepository.save(categoryDish)
        );
    }

    public void deleteCategoryDish(String categoryId) {
        categoryDishRepository.deleteById(categoryId);
    }
    public List<CategoryDishResponse> getCategoryDishesWithSorting(String field) {
        return categoryDishRepository
                .findAll(Sort.by(Sort.Direction.ASC, field))
                .stream()
                .map(categoryDishMapper::toCategoryDishResponse)
                .toList();
    }

    public List<CategoryDishResponse> getCategoryDishesWithPagination(int offset, int pageSize) {
        Page<CategoryDish> categoryDishes = categoryDishRepository.findAll(PageRequest.of(offset, pageSize));
        return categoryDishes.stream().map(categoryDishMapper::toCategoryDishResponse).toList();
    }

    public List<CategoryDishResponse> getCategoryDishesWithSortingAndPagination (int offset, int pageSize, String field) {
        Page<CategoryDish> categoryDishes = categoryDishRepository.findAll(PageRequest.of(offset, pageSize).withSort(Sort.by(field)));
        return categoryDishes
                .stream()
                .map(categoryDishMapper::toCategoryDishResponse)
                .toList();
    }
}
