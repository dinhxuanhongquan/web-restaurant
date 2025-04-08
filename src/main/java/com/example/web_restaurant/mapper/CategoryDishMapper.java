package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.CategoryDishCreationRequest;
import com.example.web_restaurant.dto.request.CategoryDishUpdateRequest;
import com.example.web_restaurant.dto.response.CategoryDishResponse;
import com.example.web_restaurant.entity.CategoryDish;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryDishMapper {
    @Mapping(target = "dishes", ignore = true)
    CategoryDish toCategoryDish(CategoryDishCreationRequest request);

    CategoryDishResponse toCategoryDishResponse(CategoryDish categoryDish);

    @Mapping(target = "dishes", ignore = true)
    void updateCategoryDish(@MappingTarget CategoryDish categoryDish, CategoryDishUpdateRequest request);
}
