package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.TableCreationRequest;
import com.example.web_restaurant.dto.request.TableUpdateRequest;
import com.example.web_restaurant.dto.response.TableResponse;
import com.example.web_restaurant.entity.Table;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {BookingMapper.class})
public interface TableMapper {
    Table toTable(TableCreationRequest request);

    TableResponse toTableResponse(Table table);

    @Mapping(target = "bookings", ignore = true)
    void updateTable(@MappingTarget Table table, TableUpdateRequest request);
}
