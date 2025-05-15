package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.BookingCreationRequest;
import com.example.web_restaurant.dto.request.BookingUpdateRequest;
import com.example.web_restaurant.dto.response.BookingResponse;
import com.example.web_restaurant.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {TableMapper.class, UserMapper.class})
public interface BookingMapper{
    @Mapping(target = "table", ignore = true)
    @Mapping(target = "user", ignore = true)
    Booking toBooking(BookingCreationRequest request);

    @Mapping(target = "table", source = "table")
    @Mapping(target = "user", source = "user")
    BookingResponse toBookingResponse(Booking booking);

    @Mapping(target = "user", ignore = true)
    void updateBooking(@MappingTarget Booking booking, BookingUpdateRequest request);

}
