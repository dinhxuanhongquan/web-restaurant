package com.example.web_restaurant.mapper;


import com.example.web_restaurant.dto.request.DishCreationRequest;
import com.example.web_restaurant.dto.request.DishUpdateRequest;
import com.example.web_restaurant.dto.response.DishResponse;
import com.example.web_restaurant.entity.Dish;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {BillDishMapper.class, FeedBackMapper.class, UserMapper.class})
public interface DishMapper {
    @Mapping(target = "categoryDish", ignore = true)
    Dish toDish(DishCreationRequest request);

    @Mapping(target = "categoryDish", source = "categoryDish")
    DishResponse toResponse(Dish dish);

    @Mapping(target = "categoryDish", ignore = true)
    void updateDish(@MappingTarget Dish dish, DishUpdateRequest request);
}