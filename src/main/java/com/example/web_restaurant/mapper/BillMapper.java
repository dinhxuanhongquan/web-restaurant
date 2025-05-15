package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.BillCreationRequest;
import com.example.web_restaurant.dto.request.BillUpdateRequest;
import com.example.web_restaurant.dto.response.BillResponse;
import com.example.web_restaurant.entity.Bill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {BookingMapper.class, UserMapper.class})
public interface BillMapper {
    @Mapping(target = "booking", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "billTime", ignore = true)
    Bill toBill(BillCreationRequest request);

    @Mapping(target = "booking", source = "booking")
    @Mapping(target = "user", source = "user")
    @Mapping(target = "billStatus", source = "billStatus")
    BillResponse toBillResponse(Bill bill);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "billTime", ignore = true)
    void updateBill(@MappingTarget Bill bill, BillUpdateRequest request);
}
