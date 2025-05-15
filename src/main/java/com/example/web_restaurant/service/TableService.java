package com.example.web_restaurant.service;

import com.example.web_restaurant.constant.PredefineTableStatus;
import com.example.web_restaurant.dto.request.TableCreationRequest;
import com.example.web_restaurant.dto.request.TableUpdateRequest;
import com.example.web_restaurant.dto.response.TableResponse;
import com.example.web_restaurant.entity.Table;
import com.example.web_restaurant.entity.User;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.TableMapper;
import com.example.web_restaurant.repository.TableRepository;
import com.example.web_restaurant.repository.UserRepository;
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
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TableService {
    TableMapper tableMapper;
    TableRepository tableRepository;
    UserRepository userRepository;

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public TableResponse createTable(TableCreationRequest request){
        Table table = tableMapper.toTable(request);

        // Get user from the token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Set user to table
        table.setUser(user);
        // Set table status to available
        if (request.getTableStatus() == null) {
            table.setTableStatus(PredefineTableStatus.AVAILABLE);
        } else {
            table.setTableStatus(request.getTableStatus());
        }

        try{
            table = tableRepository.save(table);
        } catch (Exception exception){
            throw new AppException(ErrorCode.TABLE_NOT_EXISTED);
        }

        return tableMapper.toTableResponse(table);
    }

    @Transactional(readOnly = true)
    public List<TableResponse> getAllTables(){
        return tableRepository.findAll().stream()
                .map(tableMapper::toTableResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TableResponse getTableById(String tableId){
        return tableMapper.toTableResponse(
                tableRepository.findById(tableId).orElseThrow(() -> new AppException(ErrorCode.TABLE_NOT_EXISTED))
        );
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public TableResponse updateTable(String tableId, TableUpdateRequest request) {
        Table table = tableRepository.findById(tableId).orElseThrow(() -> new AppException(ErrorCode.TABLE_NOT_EXISTED));
        if (request.getTableStatus() == null) {
            table.setTableStatus(PredefineTableStatus.AVAILABLE);
        }
        tableMapper.updateTable(table, request);

        return tableMapper.toTableResponse(tableRepository.save(table));

    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteTable(String tableId) {
        // set user as null
        Table table = tableRepository.findById(tableId).orElseThrow(
                () -> new AppException(ErrorCode.TABLE_NOT_EXISTED));
        table.setUser(null);
        tableRepository.save(table);
        tableRepository.deleteById(tableId);
    }

    @Transactional(readOnly = true)
    public List<TableResponse> getTablesWithSorting(String filed) {
        return tableRepository.findAll(Sort.by(Sort.Direction.ASC, filed)).stream()
                .map(tableMapper::toTableResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TableResponse> getTablesWithPagination(int offset, int pageSize) {
        Page<Table> tables = tableRepository.findAll(PageRequest.of(offset, pageSize));
        return tables.stream()
                .map(tableMapper::toTableResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TableResponse> getTablesWithPaginationAndSorting(int offset, int pageSize, String filed ) {
        Page<Table> tables = tableRepository.findAll(PageRequest.of(offset, pageSize).withSort(Sort.by(filed)));
        return tables.stream()
                .map(tableMapper::toTableResponse)
                .toList();
    }
}
