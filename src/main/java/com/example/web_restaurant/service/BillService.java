package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.BillCreationRequest;
import com.example.web_restaurant.dto.request.BillUpdateRequest;
import com.example.web_restaurant.dto.response.BillResponse;
import com.example.web_restaurant.entity.Bill;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.BillMapper;
import com.example.web_restaurant.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults( level = AccessLevel.PRIVATE, makeFinal = true)
public class BillService {
    BillRepository billRepository;
    BillMapper billMapper;
    BookingRepository bookingRepository;
    UserRepository userRepository;

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public BillResponse createBill(BillCreationRequest request) {
        Bill bill = billMapper.toBill(request);

//        Get user from token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        var booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        bill.setUser(user);
        bill.setBooking(booking);

        try {
            bill = billRepository.save(bill);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.BILL_NOT_CREATED);
        }
        return billMapper.toBillResponse(bill);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public BillResponse getBillById(String billId) {
        return billMapper.toBillResponse(
                billRepository.findById(billId)
                        .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_EXISTED))
        );
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public List<BillResponse> getAllBills() {
        return billRepository.findAll()
                .stream()
                .map(billMapper::toBillResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BillResponse> getAllBillsByBookingId(String bookingId) {
        return billRepository.findAllByBooking_BookingId(bookingId)
                .stream()
                .map(billMapper::toBillResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public List<BillResponse> getAllBillsByUserId(String userId) {
        return billRepository.findAllByUser_UserId(userId)
                .stream()
                .map(billMapper::toBillResponse)
                .toList();
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public BillResponse updateBill(String billId, BillUpdateRequest request) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_EXISTED));

        billMapper.updateBill(bill, request);
        var booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        bill.setBooking(booking);

        try {
            bill = billRepository.save(bill);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.BILL_NOT_UPDATED);
        }
        return billMapper.toBillResponse(bill);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteBillById(String billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_EXISTED));
        bill.setUser(null);
        bill.setBooking(null);
        billRepository.deleteById(billId);
    }

    // Sorting and Pagination
    public List<BillResponse> getBillsWithSorting(String field) {
        return billRepository.findAll(Sort.by(Sort.Direction.ASC, field))
                .stream()
                .map(billMapper::toBillResponse)
                .toList();
    }

    public List<BillResponse> getBillsWithPagination(int offset, int pageSize) {
        Page<Bill> bills = billRepository.findAll(PageRequest.of(offset, pageSize));
        return bills.stream()
                .map(billMapper::toBillResponse)
                .toList();
    }

    public List<BillResponse> getBillWithSortingAndPagination(int offset, int pageSize, String field) {
        Page<Bill> bills = billRepository.findAll(PageRequest.of(offset, pageSize).withSort(Sort.by(field)));
        return bills.stream()
                .map(billMapper::toBillResponse)
                .toList();
    }

}
