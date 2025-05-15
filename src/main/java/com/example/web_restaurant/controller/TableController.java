package com.example.web_restaurant.controller;

import com.example.web_restaurant.dto.request.ApiResponse;
import com.example.web_restaurant.dto.request.TableCreationRequest;
import com.example.web_restaurant.dto.request.TableUpdateRequest;
import com.example.web_restaurant.dto.response.TableResponse;
import com.example.web_restaurant.service.TableService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tables")
@Slf4j
@FieldDefaults( level = AccessLevel.PRIVATE, makeFinal = true)
public class TableController {
    TableService tableService;

    @PostMapping
    public ApiResponse<TableResponse> createTable(@RequestBody TableCreationRequest request) {
        return ApiResponse.<TableResponse>builder()
                .result(tableService.createTable(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<TableResponse>> getAllTables() {
        return ApiResponse.<List<TableResponse>>builder()
                .result(tableService.getAllTables())
                .build();
    }

    @GetMapping("/{tableId}")
    public ApiResponse<TableResponse> getTableById(@PathVariable("tableId") String tableId) {
        return ApiResponse.<TableResponse>builder()
                .result(tableService.getTableById(tableId))
                .build();
    }

    @PutMapping("/{tableId}")
    public ApiResponse<TableResponse> updateTable(@RequestBody @Valid TableUpdateRequest request, @PathVariable("tableId") String tableId) {
        return ApiResponse.<TableResponse>builder()
                .result(tableService.updateTable(tableId, request))
                .build();
    }

    @DeleteMapping("/{tableId}")
    public ApiResponse<String> deleteTable(@PathVariable("tableId") String tableId) {
        tableService.deleteTable(tableId);
        return ApiResponse.<String>builder()
                .result("Table has deleted successfully")
                .build();
    }
}
