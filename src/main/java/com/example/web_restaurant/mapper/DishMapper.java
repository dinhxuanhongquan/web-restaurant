package com.example.web_restaurant.mapper;


import com.example.web_restaurant.dto.request.DishCreationRequest;
import com.example.web_restaurant.dto.request.DishUpdateRequest;
import com.example.web_restaurant.dto.response.DishResponse;
import com.example.web_restaurant.entity.Dish;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {BillDishMapper.class, FeedBackMapper.class})
public interface DishMapper {
    Dish toDish(DishCreationRequest request);

    DishResponse toResponse(Dish dish);

    @Mapping(target = "feedBacks", ignore = true )
    @Mapping(target = "billDishes", ignore = true)
    void updateDish(@MappingTarget Dish dish, DishUpdateRequest request);
}
