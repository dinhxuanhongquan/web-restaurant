package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.BillDishCreationRequest;
import com.example.web_restaurant.dto.request.BillDishUpdateRequest;
import com.example.web_restaurant.dto.response.BillDishResponse;
import com.example.web_restaurant.entity.BillDish;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper( componentModel = "spring", uses = {BillMapper.class, DishMapper.class})
public interface BillDishMapper {
    @Mapping(target = "bill", ignore = true)
    @Mapping(target = "dish", ignore = true)
    BillDish toBillDish(BillDishCreationRequest request);

    @Mapping(target = "bill", source = "bill")
    @Mapping(target = "dish", source = "dish")
    BillDishResponse toBillDishResponse(BillDish billDish);

    void updateBillDish(@MappingTarget BillDish billDish, BillDishUpdateRequest request);
}
