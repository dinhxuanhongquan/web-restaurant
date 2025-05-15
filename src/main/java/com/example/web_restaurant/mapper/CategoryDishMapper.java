package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.CategoryDishCreationRequest;
import com.example.web_restaurant.dto.request.CategoryDishUpdateRequest;
import com.example.web_restaurant.dto.response.CategoryDishResponse;
import com.example.web_restaurant.entity.CategoryDish;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {DishMapper.class, UserMapper.class})
public interface CategoryDishMapper {
    @Mapping(target = "user", ignore = true)
//    @Mapping(target = "dishes", ignore = true)
    CategoryDish toCategoryDish(CategoryDishCreationRequest request);

    @Mapping(target = "user", source = "user")
//    @Mapping(target = "dishes", source = "dishes")
    CategoryDishResponse toCategoryDishResponse(CategoryDish categoryDish);

//    @Mapping(target = "dishes", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateCategoryDish(@MappingTarget CategoryDish categoryDish, CategoryDishUpdateRequest request);
}
