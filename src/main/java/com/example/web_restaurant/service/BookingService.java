package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.BookingCreationRequest;
import com.example.web_restaurant.dto.request.BookingUpdateRequest;
import com.example.web_restaurant.dto.response.BookingResponse;
import com.example.web_restaurant.entity.Booking;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.BookingMapper;
import com.example.web_restaurant.repository.BillRepository;
import com.example.web_restaurant.repository.BookingRepository;
import com.example.web_restaurant.repository.TableRepository;
import com.example.web_restaurant.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingService {
    BookingRepository bookingRepository;
    BookingMapper bookingMapper;
    TableRepository tableRepository;
    UserRepository userRepository;
    BillRepository billRepository;

    public BookingResponse createBooking(BookingCreationRequest request) {
        Booking booking = bookingMapper.toBooking(request);
        booking.setUser(userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
        booking.setBill(billRepository.findById(request.getBillId())
                .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_EXISTED)));
        booking.setTable(tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new AppException(ErrorCode.TABLE_NOT_EXISTED)));
        try {
            booking = bookingRepository.save(booking);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.BOOKING_NOT_CREATED);
        }
        return bookingMapper.toBookingResponse(booking);
    }

    public BookingResponse getBookingById(String bookingId) {
        return bookingMapper.toBookingResponse(
                bookingRepository.findById(bookingId)
                        .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED))
        );
    }

    public List<BookingResponse> getAllBookingsByTable(String tableId) {
        return bookingRepository.findAllByTableId(tableId)
                .stream()
                .map(bookingMapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(bookingMapper::toBookingResponse)
                .toList();
    }

    public List<BookingResponse> getAllBookingsByUser(String userId) {
        return bookingRepository.findAllByUserId(userId)
                .stream()
                .map(bookingMapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse updateBooking(String bookingId, BookingUpdateRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        bookingMapper.updateBooking(booking, request);
        booking.setUser(userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
        booking.setBill(billRepository.findById(request.getBillId())
                .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_EXISTED)));
        booking.setTable(tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new AppException(ErrorCode.TABLE_NOT_EXISTED)));
        try {
            booking = bookingRepository.save(booking);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.BOOKING_NOT_UPDATED);
        }
        return bookingMapper.toBookingResponse(booking);
    }

    public void deleteBookingById(String bookingId) {
        bookingRepository.deleteById(bookingId);
    }

//   Sorting and Pagination
    public List<BookingResponse> getBookingsWithSorting(String field) {
        return bookingRepository.findAll(Sort.by(Sort.Direction.ASC, field))
                .stream()
                .map(bookingMapper::toBookingResponse)
                .toList();
    }

    public List<BookingResponse> getBookingsWithPagination(int offset, int pageSize) {
        Page<Booking> bookings = bookingRepository.findAll(PageRequest.of(offset, pageSize));
        return bookings.stream()
                .map(bookingMapper::toBookingResponse)
                .toList();
    }

    public List<BookingResponse> getBookingsWithSortingAndPagination(int offset, int pageSize, String filed) {
        Page<Booking> bookings = bookingRepository.findAll(PageRequest.of(offset, pageSize).withSort(Sort.by(filed)));
        return bookings.stream()
                .map(bookingMapper::toBookingResponse)
                .toList();
    }

}
