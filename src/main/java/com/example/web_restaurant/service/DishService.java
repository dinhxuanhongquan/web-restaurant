package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.DishCreationRequest;
import com.example.web_restaurant.dto.request.DishUpdateRequest;
import com.example.web_restaurant.dto.response.DishResponse;
import com.example.web_restaurant.entity.*;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.CategoryDishMapper;
import com.example.web_restaurant.mapper.DishMapper;
import com.example.web_restaurant.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true )
public class DishService {
    private final CategoryDishMapper categoryDishMapper;
    DishRepository dishRepository;
    DishMapper dishMapper;

    CategoryDishRepository categoryDishRepository;

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public DishResponse createDish(DishCreationRequest request){
        Dish dish = dishMapper.toDish(request);

        CategoryDish categoryDish = categoryDishRepository.findById(request.getCategoryDishId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_DISH_NOT_EXISTED));

        dish.setCategoryDish(categoryDish);

        try{
            dish = dishRepository.save(dish);
        } catch (Exception exception){
            log.error("Error when creating dish: {}", exception.getMessage());
            throw new AppException(ErrorCode.DISH_NOT_CREATED);
        }

        return dishMapper.toResponse(dish);
    }

    @Transactional(readOnly = true)
    public DishResponse getDishById(String dishId){
        return dishMapper.toResponse(
                dishRepository.findById(dishId)
                        .orElseThrow(() -> new AppException(ErrorCode.DISH_NOT_EXISTED))
        );
    }

    // New
    @Transactional(readOnly = true)
    public List<DishResponse>getAllDishesByCategoryDishId(String categoryId){
        return dishRepository.findAllByCategoryDish_CategoryId(categoryId).stream()
                .map(dishMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DishResponse> getAllDishes(){
        return dishRepository.findAll().stream()
                .map(dishMapper::toResponse)
                .toList();
    }

    public void deleteDishById(String dishId){
        var dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new AppException(ErrorCode.DISH_NOT_EXISTED));
        try{
            dishRepository.delete(dish);
        } catch (Exception exception){
            throw new AppException(ErrorCode.DISH_NOT_DELETED);
        }
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public DishResponse updateDish(DishUpdateRequest request, String dishId){
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new AppException(ErrorCode.DISH_NOT_EXISTED));
        // Set Category Dish to null before mapper
        dish.setCategoryDish(null);
        dishMapper.updateDish(dish, request);

        if (request.getCategoryDishId() != null) {
            var categoryDish = categoryDishRepository.findById(request.getCategoryDishId());
            categoryDish.ifPresent(dish::setCategoryDish);
        }
        try{
            dish = dishRepository.save(dish);
        } catch (Exception exception){
            throw new AppException(ErrorCode.DISH_NOT_UPDATED);
        }
        return dishMapper.toResponse(dish);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteDish(String dishId) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new AppException(ErrorCode.DISH_NOT_EXISTED));
        dish.setCategoryDish(null);
        dishRepository.save(dish);

        dishRepository.delete(dish);
    }

    public List<DishResponse> getDishesWithSorting(String field) {
        return dishRepository.findAll(Sort.by(Sort.Direction.ASC, field))
                .stream()
                .map(dishMapper::toResponse)
                .toList();
    }

    public List<DishResponse> getDishesWithPagination(int offset, int pageSize) {
        Page<Dish> dishes = dishRepository.findAll(PageRequest.of(offset, pageSize));
        return dishes.map(dishMapper::toResponse).stream().toList();
    }

    public List<DishResponse> getDishesWithPaginationAndSorting(int offset, int pageSize, String field) {
        Page<Dish> dishes = dishRepository.findAll(PageRequest.of(offset, pageSize).withSort(Sort.by(field)));
        return dishes.map(dishMapper::toResponse).stream().toList();
    }
}
