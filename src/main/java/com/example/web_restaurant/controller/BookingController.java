package com.example.web_restaurant.controller;

import com.example.web_restaurant.dto.request.ApiResponse;
import com.example.web_restaurant.dto.request.BookingCreationRequest;
import com.example.web_restaurant.dto.request.BookingUpdateRequest;
import com.example.web_restaurant.dto.response.BookingResponse;
import com.example.web_restaurant.service.BookingService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/bookings")
@Slf4j
@FieldDefaults( level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingController {
    BookingService bookingService;

    @PostMapping
    public ApiResponse<BookingResponse> createBooking(@RequestBody @Valid BookingCreationRequest request) {
        return ApiResponse.<BookingResponse>builder()
                .result(bookingService.createBooking(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<BookingResponse>> getAllBookings() {
        return ApiResponse.<List<BookingResponse>>builder()
                .result(bookingService.getAllBookings())
                .build();
    }

    @GetMapping("/{tableId}")
    public ApiResponse<List<BookingResponse>> getAllBookingsByTable(@PathVariable("tableId") String tableId) {
        return ApiResponse.<List<BookingResponse>>builder()
                .result(bookingService.getAllBookingsByTable(tableId))
                .build();
    }

    @GetMapping("/{userId}")
    public ApiResponse<List<BookingResponse>> getAllBookingsByUser(@PathVariable("userId") String userId) {
        return ApiResponse.<List<BookingResponse>>builder()
                .result(bookingService.getAllBookingsByUser(userId))
                .build();
    }

    @GetMapping("/{bookingId}")
    public ApiResponse<BookingResponse> getBookingById(@PathVariable("bookingId") String bookingId) {
        return ApiResponse.<BookingResponse>builder()
                .result(bookingService.getBookingById(bookingId))
                .build();
    }

    @DeleteMapping("/{bookingId}")
    public ApiResponse<String> deleteBooking(@PathVariable("bookingId") String bookingId) {
        bookingService.deleteBookingById(bookingId);
        return ApiResponse.<String>builder()
                .result("Deleted successfully!")
                .build();
    }

    @PutMapping("/{bookingId}")
    public ApiResponse<BookingResponse> updateBooking(@PathVariable("bookingId") String bookingId,
                                                      @RequestBody @Valid BookingUpdateRequest request) {
        return ApiResponse.<BookingResponse>builder()
                .result(bookingService.updateBooking(bookingId, request))
                .build();
    }

}
