package com.example.web_restaurant.dto.response;

import com.example.web_restaurant.entity.Bill;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ManyToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class TableResponse {
    String tableId;
    String tableName;
    String kindTable;
    String statusTable;

    Set<BillResponse> bills;
}
