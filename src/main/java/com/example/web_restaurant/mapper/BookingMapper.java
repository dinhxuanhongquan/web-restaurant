package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.BookingCreationRequest;
import com.example.web_restaurant.dto.request.BookingUpdateRequest;
import com.example.web_restaurant.dto.response.BookingResponse;
import com.example.web_restaurant.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BookingMapper{
    Booking toBooking(BookingCreationRequest request);

    BookingResponse toBookingResponse(Booking booking);

    @Mapping(target = "tables", ignore = true)
    void updateBooking(@MappingTarget Booking booking, BookingUpdateRequest request);

}
