package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.BillCreationRequest;
import com.example.web_restaurant.dto.request.BillUpdateRequest;
import com.example.web_restaurant.dto.response.BillResponse;
import com.example.web_restaurant.entity.Bill;
import com.example.web_restaurant.entity.BillDish;
import com.example.web_restaurant.entity.Table;
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
import org.springframework.stereotype.Service;

import java.util.HashSet;
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
    BillDishRepository billDishRepository;

    public BillResponse createBill(BillCreationRequest request) {
        Bill bill = billMapper.toBill(request);

        HashSet<BillDish> billDishes = new HashSet<>();

        billDishRepository.findById(request.getBillDishes().toString()).ifPresent(billDishes::add);
        bill.setBillDishes(billDishes);
        bill.setBooking(bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED)));
        bill.setUser(userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
        try {
            bill = billRepository.save(bill);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.BILL_NOT_CREATED);
        }
        return billMapper.toBillResponse(bill);
    }

    public BillResponse getBillById(String billId) {
        return billMapper.toBillResponse(
                billRepository.findById(billId)
                        .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_EXISTED))
        );
    }

    public List<BillResponse> getAllBills() {
        return billRepository.findAll()
                .stream()
                .map(billMapper::toBillResponse)
                .toList();
    }

    public BillResponse updateBill(String billId, BillUpdateRequest request) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_EXISTED));

        billMapper.updateBill(bill, request);
        var billDishes = billDishRepository.findAllById(request.getBillDishes());
        bill.setBillDishes(new HashSet<>(billDishes));
        bill.setUser(userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
        bill.setBooking(bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED)));
        try {
            bill = billRepository.save(bill);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.BILL_NOT_UPDATED);
        }
        return billMapper.toBillResponse(bill);
    }

    public void deleteBillById(String billId) {
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
