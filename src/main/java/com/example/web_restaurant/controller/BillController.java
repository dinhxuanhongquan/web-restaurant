package com.example.web_restaurant.controller;

import com.example.web_restaurant.dto.request.ApiResponse;
import com.example.web_restaurant.dto.request.BillCreationRequest;
import com.example.web_restaurant.dto.request.BillUpdateRequest;
import com.example.web_restaurant.dto.response.BillResponse;
import com.example.web_restaurant.service.BillService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/bills")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BillController {
    BillService billService;

    @PostMapping
    public ApiResponse<BillResponse> createBill(@RequestBody BillCreationRequest request) {
        return ApiResponse.<BillResponse>builder()
                .result(billService.createBill(request))
                .build();
    }

    @GetMapping("/{bookingId}")
    public ApiResponse<List<BillResponse>> getAllBillsByBookingId(@PathVariable("bookingId") String bookingId) {
        return ApiResponse.<List<BillResponse>>builder()
                .result(billService.getAllBillsByBookingId(bookingId))
                .build();
    }

    @GetMapping("/{userId}")
    public ApiResponse<List<BillResponse>> getAllBillsByUserId(@PathVariable("userId") String userId) {
        return ApiResponse.<List<BillResponse>>builder()
                .result(billService.getAllBillsByUserId(userId))
                .build();
    }

    @GetMapping
    public ApiResponse<List<BillResponse>> getAllBills() {
        return ApiResponse.<List<BillResponse>>builder()
                .result(billService.getAllBills())
                .build();
    }

    @GetMapping("/{billId}")
    public ApiResponse<BillResponse> getBillById(@PathVariable("billId") String billId) {
        return ApiResponse.<BillResponse>builder()
                .result(billService.getBillById(billId))
                .build();
    }

    @DeleteMapping("/{billId}")
    public ApiResponse<String> deleteBillById(@PathVariable("billId") String billId) {
        billService.deleteBillById(billId);
        return ApiResponse.<String>builder()
                .result("Bill deleted successfully")
                .build();
    }

    @PutMapping("/{billId}")
    public ApiResponse<BillResponse> updateBill(@PathVariable("billId") String billId,
                                                @RequestBody BillUpdateRequest request) {
        return ApiResponse.<BillResponse>builder()
                .result(billService.updateBill(billId, request))
                .build();
    }
}
