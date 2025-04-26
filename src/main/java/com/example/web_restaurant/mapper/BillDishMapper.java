package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.BillDishCreationRequest;
import com.example.web_restaurant.dto.request.BillDishUpdateRequest;
import com.example.web_restaurant.dto.response.BillDishResponse;
import com.example.web_restaurant.entity.BillDish;
import org.mapstruct.Mapper;

@Mapper( componentModel = "spring")
public interface BillDishMapper {
    BillDish toBillDish(BillDishCreationRequest request);

    BillDishResponse toBillDishResponse(BillDish billDish);

    void updateBillDish(BillDish billDish, BillDishUpdateRequest request);
}
