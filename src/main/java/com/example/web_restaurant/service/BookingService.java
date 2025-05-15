package com.example.web_restaurant.service;

import com.example.web_restaurant.constant.PredefineTableStatus;
import com.example.web_restaurant.dto.request.BookingCreationRequest;
import com.example.web_restaurant.dto.request.BookingUpdateRequest;
import com.example.web_restaurant.dto.response.BookingResponse;
import com.example.web_restaurant.entity.Booking;
import com.example.web_restaurant.entity.Table;
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
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingService {
    BookingRepository bookingRepository;
    BookingMapper bookingMapper;
    TableRepository tableRepository;
    UserRepository userRepository;

    @Transactional
    public BookingResponse createBooking(BookingCreationRequest request) {
        // check time and date
        LocalDateTime bookingTime = request.getBookingTime();

        if (!isBookingTimeValid(bookingTime)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_TIME);
        }

        // Only allow booking for 8 am to 10 pm
        if (!isBookingTimeInRange(bookingTime)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_TIME_RANGE);
        }

        // Booking time must be at least 1 hour in the future
        if (isBookingTimeInPast(bookingTime)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_TIME_MIN_MONTH);
        }

        Booking booking = bookingMapper.toBooking(request);

//        Get the user from token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        booking.setUser(userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
        // find table by id
        Table table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new AppException(ErrorCode.TABLE_NOT_EXISTED));
        if (!Objects.equals(table.getTableStatus(), PredefineTableStatus.AVAILABLE)) {
            throw new AppException(ErrorCode.TABLE_NOT_AVAILABLE);
        }
        booking.setTable(table);
        try {
            booking = bookingRepository.save(booking);
            table.setTableStatus(PredefineTableStatus.BOOKED);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.BOOKING_NOT_CREATED);
        }
        return bookingMapper.toBookingResponse(booking);
    }

    // Get booking with user
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(String bookingId) {
        return bookingMapper.toBookingResponse(
                bookingRepository.findById(bookingId)
                        .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED))
        );
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookingsByTable(String tableId) {
        return bookingRepository.findAllByTable_TableId(tableId)
                .stream()
                .map(bookingMapper::toBookingResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    @PostAuthorize("hasRole('ADMIN')")
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(bookingMapper::toBookingResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookingsByUser() {
        // Get the user from token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        String userId = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED))
                .getUserId();
        return bookingRepository.findAllByUser_UserId(userId)
                .stream()
                .map(bookingMapper::toBookingResponse)
                .toList();
    }

    @Transactional
    public BookingResponse updateBooking(String bookingId, BookingUpdateRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        // check time and date
        LocalDateTime bookingTime = request.getBookingTime();
        if (isBookingTimeInPast(bookingTime)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_TIME);
        }
        if (!isBookingTimeInRange(bookingTime)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_TIME_RANGE);
        }
        if (!isBookingTimeValid(bookingTime)) {
            throw new AppException(ErrorCode.INVALID_BOOKING_TIME_MIN_MONTH);
        }
        bookingMapper.updateBooking(booking, request);

        // Luu lai Set Table
        Table oldTable = booking.getTable();
        // if the request has a new tableId then change the table and set table status to available
        if (request.getTableId() != null) {
            booking.setTable(null);
            Table table = tableRepository.findById(request.getTableId())
                    .orElseThrow(() -> new AppException(ErrorCode.TABLE_NOT_EXISTED));
            if (!Objects.equals(table.getTableStatus(), PredefineTableStatus.AVAILABLE)) {
                throw new AppException(ErrorCode.TABLE_NOT_AVAILABLE);
            }
            oldTable.setTableStatus(PredefineTableStatus.AVAILABLE);
            table.setTableStatus(PredefineTableStatus.BOOKED);
            booking.setTable(table);
        }
        try {
            booking = bookingRepository.save(booking);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.BOOKING_NOT_UPDATED);
        }
        return bookingMapper.toBookingResponse(booking);
    }

    public void deleteBookingById(String bookingId) {
        // set user as null
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        booking.setUser(null);
        booking.setTable(null);
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

    private boolean isBookingTimeValid(LocalDateTime bookingTime) {
        LocalDateTime now = LocalDateTime.now();
        return bookingTime.isAfter(now.plusHours(1)) && bookingTime.isBefore(now.plusMonths(1));
    }

    private boolean isBookingTimeInRange(LocalDateTime bookingTime) {
        return bookingTime.getHour() >= 8 && bookingTime.getHour() <= 22;
    }

    private boolean isBookingTimeInPast(LocalDateTime bookingTime) {
        return bookingTime.isBefore(LocalDateTime.now());
    }

}
