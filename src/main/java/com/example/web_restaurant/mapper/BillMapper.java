package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.BillCreationRequest;
import com.example.web_restaurant.dto.request.BillUpdateRequest;
import com.example.web_restaurant.dto.response.BillResponse;
import com.example.web_restaurant.entity.Bill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {DishMapper.class})
public interface BillMapper {
    Bill toBill(BillCreationRequest request);

    BillResponse toBillResponse(Bill bill);

    @Mapping(target = "dishes", ignore = true)
    void updateBill(@MappingTarget Bill bill, BillUpdateRequest request);
}
