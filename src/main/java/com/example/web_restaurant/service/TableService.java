package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.TableCreationRequest;
import com.example.web_restaurant.dto.request.TableUpdateRequest;
import com.example.web_restaurant.dto.response.TableResponse;
import com.example.web_restaurant.entity.Bill;
import com.example.web_restaurant.entity.Booking;
import com.example.web_restaurant.entity.Table;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.TableMapper;
import com.example.web_restaurant.repository.BillRepository;
import com.example.web_restaurant.repository.BookingRepository;
import com.example.web_restaurant.repository.TableRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TableService {
    TableMapper tableMapper;
    TableRepository tableRepository;
    BookingRepository bookingRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public TableResponse createTable(TableCreationRequest request){
        Table table = tableMapper.toTable(request);

        HashSet<Booking> bookings = new HashSet<>();
        bookingRepository.findById(request.getBookings().toString()).ifPresent(bookings::add);
        table.setBookings(bookings);

        try{
            table = tableRepository.save(table);
        } catch (Exception exception){
            throw new AppException(ErrorCode.TABLE_NOT_EXISTED);
        }

        return tableMapper.toTableResponse(table);
    }

    public List<TableResponse> getAllTables(){
        return tableRepository.findAll().stream()
                .map(tableMapper::toTableResponse)
                .toList();
    }

    public TableResponse getTableById(String tableId){
        return tableMapper.toTableResponse(
                tableRepository.findById(tableId).orElseThrow(() -> new AppException(ErrorCode.TABLE_NOT_EXISTED))
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    public TableResponse updateTable(String tableId, TableUpdateRequest request) {
        Table table = tableRepository.findById(tableId).orElseThrow(() -> new AppException(ErrorCode.TABLE_NOT_EXISTED));

        tableMapper.updateTable(table, request);
        var bookings = bookingRepository.findAllById(request.getBookings());
        table.setBookings(new HashSet<>(bookings));

        return tableMapper.toTableResponse(tableRepository.save(table));

    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteTable(String tableId) {
        tableRepository.deleteById(tableId);
    }


    public List<TableResponse> getTablesWithSorting(String filed) {
        return tableRepository.findAll(Sort.by(Sort.Direction.ASC, filed)).stream()
                .map(tableMapper::toTableResponse)
                .toList();
    }

    public List<TableResponse> getTablesWithPagination(int offset, int pageSize) {
        Page<Table> tables = tableRepository.findAll(PageRequest.of(offset, pageSize));
        return tables.stream()
                .map(tableMapper::toTableResponse)
                .toList();
    }

    public List<TableResponse> getTablesWithPaginationAndSorting(int offset, int pageSize, String filed ) {
        Page<Table> tables = tableRepository.findAll(PageRequest.of(offset, pageSize).withSort(Sort.by(filed)));
        return tables.stream()
                .map(tableMapper::toTableResponse)
                .toList();
    }
}
