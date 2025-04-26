package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.DishCreationRequest;
import com.example.web_restaurant.dto.request.DishUpdateRequest;
import com.example.web_restaurant.dto.response.DishResponse;
import com.example.web_restaurant.entity.BillDish;
import com.example.web_restaurant.entity.CategoryDish;
import com.example.web_restaurant.entity.Dish;
import com.example.web_restaurant.entity.FeedBack;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.DishMapper;
import com.example.web_restaurant.repository.BillDishRepository;
import com.example.web_restaurant.repository.CategoryDishRepository;
import com.example.web_restaurant.repository.DishRepository;
import com.example.web_restaurant.repository.FeedBackRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true )
public class DishService {
    DishRepository dishRepository;
    DishMapper dishMapper;

    BillDishRepository billDishRepository;
    CategoryDishRepository categoryDishRepository;
    FeedBackRepository feedBackRepository;

    public DishResponse createDish(DishCreationRequest request){
        Dish dish = dishMapper.toDish(request);

        HashSet<BillDish> billDishes = new HashSet<>();
        HashSet<FeedBack> feedBacks = new HashSet<>();
        var categoryDish = categoryDishRepository.findById(request.getCategoryDishId());
        billDishRepository.findById(request.getBillDishes().toString()).ifPresent(billDishes::add);
        feedBackRepository.findById(request.getFeedBacks().toString()).ifPresent(feedBacks::add);
        dish.setFeedBacks(feedBacks);
        dish.setBillDishes(billDishes);
        categoryDish.ifPresent(dish::setCategoryDish);

        try{
            dish = dishRepository.save(dish);
        } catch (Exception exception){
            throw new AppException(ErrorCode.DISH_NOT_CREATED);
        }
        return dishMapper.toResponse(dish);
    }

    public DishResponse getDishById(String dishId){
        return dishMapper.toResponse(
                dishRepository.findById(dishId)
                        .orElseThrow(() -> new AppException(ErrorCode.DISH_NOT_EXISTED))
        );
    }

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

    public DishResponse updateDish(DishUpdateRequest request, String dishId){
        var dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new AppException(ErrorCode.DISH_NOT_EXISTED));

        dishMapper.updateDish(dish, request);
        var billDishes = billDishRepository.findAllById(request.getBillDishes());
        var feedBacks = feedBackRepository.findAllById(request.getFeedBacks());
        var categoryDish = categoryDishRepository.findById(request.getCategoryDishId());

        dish.setBillDishes(new HashSet<>(billDishes));
        dish.setFeedBacks(new HashSet<>(feedBacks));
        categoryDish.ifPresent(dish::setCategoryDish);
        try{
            dish = dishRepository.save(dish);
        } catch (Exception exception){
            throw new AppException(ErrorCode.DISH_NOT_UPDATED);
        }
        return dishMapper.toResponse(dish);
    }

    public void deleteDish(String dishId) {
        dishRepository.deleteById(dishId);
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
