package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.BillDishCreationRequest;
import com.example.web_restaurant.dto.request.BillDishUpdateRequest;
import com.example.web_restaurant.dto.response.BillDishResponse;
import com.example.web_restaurant.entity.BillDish;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.BillDishMapper;
import com.example.web_restaurant.repository.BillDishRepository;
import com.example.web_restaurant.repository.BillRepository;
import com.example.web_restaurant.repository.DishRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults( level = AccessLevel.PRIVATE, makeFinal = true)
public class BillDishService {
    BillDishMapper billDishMapper;
    BillDishRepository billDishRepository;
    BillRepository billRepository;
    DishRepository dishRepository;

    public BillDishResponse createDillDish(BillDishCreationRequest request) {
        BillDish billDish = billDishMapper.toBillDish(request);

        billDish.setBill(billRepository.findById(request.getBillId())
                .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_EXISTED)));
        billDish.setDish(dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new AppException(ErrorCode.DISH_NOT_EXISTED)));
        try {
            billDish = billDishRepository.save(billDish);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.BILL_NOT_CREATED);
        }
        return billDishMapper.toBillDishResponse(billDish);
    }

    public BillDishResponse getBillDishById(String billDishId) {
        return billDishMapper.toBillDishResponse(
                billDishRepository.findById(billDishId)
                        .orElseThrow(() -> new AppException(ErrorCode.BILLDISH_NOT_EXISTED))
        );
    }
    public List<BillDishResponse> getAllBillDishes() {
        return billDishRepository.findAll()
                .stream()
                .map(billDishMapper::toBillDishResponse)
                .toList();
    }

    public BillDishResponse updateBillDish(String billDishId, BillDishUpdateRequest request) {
        BillDish billDish = billDishRepository.findById(billDishId).orElseThrow(() -> new AppException(ErrorCode.BILLDISH_NOT_EXISTED));
        billDishMapper.updateBillDish(billDish, request);
        billDish.setDish(dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new AppException(ErrorCode.DISH_NOT_EXISTED)));
        billDish.setBill(billRepository.findById(request.getBillId())
                .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_EXISTED)));
        try {
            billDish = billDishRepository.save(billDish);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.BILL_NOT_CREATED);
        }
        return billDishMapper.toBillDishResponse(billDish);
    }

    public void deleteBillDish(String billDishId) {
        BillDish billDish = billDishRepository.findById(billDishId).orElseThrow(() -> new AppException(ErrorCode.BILLDISH_NOT_EXISTED));
        try {
            billDishRepository.delete(billDish);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.BILL_NOT_DELETED);
        }
    }

    // Sorting and Pagination
    public List<BillDishResponse> getBillDishesWithSorting(String field) {
        return billDishRepository.findAll(Sort.by(Sort.Direction.ASC, field))
                .stream()
                .map(billDishMapper::toBillDishResponse)
                .toList();
    }

    public List<BillDishResponse> getDillDishesWithPagination(int offset, int pageSize) {
        Page<BillDish> billDishes = billDishRepository.findAll(PageRequest.of(offset, pageSize));
        return billDishes.stream()
                .map(billDishMapper::toBillDishResponse)
                .toList();
    }

    public List<BillDishResponse> getBillDishesWithSortingAndPagination(int offset, int pageSize, String field) {
        Page<BillDish> billDishes = billDishRepository.findAll(PageRequest.of(offset, pageSize).withSort(Sort.by(field)));
        return billDishes
                .stream()
                .map(billDishMapper::toBillDishResponse)
                .toList();
    }
}
