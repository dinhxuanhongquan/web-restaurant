package com.example.web_restaurant.controller;

import com.example.web_restaurant.dto.request.ApiResponse;
import com.example.web_restaurant.dto.request.BillDishCreationRequest;
import com.example.web_restaurant.dto.request.BillDishUpdateRequest;
import com.example.web_restaurant.dto.response.BillDishResponse;
import com.example.web_restaurant.service.BillDishService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/bill-dishes")
@Slf4j
@FieldDefaults( level = AccessLevel.PRIVATE, makeFinal = true)
public class BillDishController {
    BillDishService billDishService;

    @PostMapping
    public ApiResponse<BillDishResponse> createBillDish(@RequestBody @Valid BillDishCreationRequest request) {
        return ApiResponse.<BillDishResponse>builder()
                .result(billDishService.createDillDish(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<BillDishResponse>> getAllBillDishes() {
        return ApiResponse.<List<BillDishResponse>>builder()
                .result(billDishService.getAllBillDishes())
                .build();
    }

    @GetMapping("/{billId}")
    public ApiResponse<List<BillDishResponse>> getAllBillDishesByBillId(@PathVariable("billId") String billId) {
        return ApiResponse.<List<BillDishResponse>>builder()
                .result(billDishService.getAllBillDishesByBillId(billId))
                .build();
    }

    @GetMapping("/{billDishId}")
    public ApiResponse<BillDishResponse> getBillDishById(@PathVariable("billDishId") String billDishId) {
        return ApiResponse.<BillDishResponse>builder()
                .result(billDishService.getBillDishById(billDishId))
                .build();
    }

    @DeleteMapping("/{billDishId}")
    public ApiResponse<String> deleteBillDishById(@PathVariable("billDishId") String billDishId) {
        billDishService.deleteBillDish(billDishId);
        return ApiResponse.<String>builder()
                .result("BillDish deleted successfully")
                .build();
    }

    @PutMapping("/{billDishId}")
    public ApiResponse<BillDishResponse> updateBillDish(@PathVariable("billDishId") String billDishId,
                                                        @RequestBody @Valid BillDishUpdateRequest request) {
        return ApiResponse.<BillDishResponse>builder()
                .result(billDishService.updateBillDish(billDishId, request))
                .build();
    }
}
