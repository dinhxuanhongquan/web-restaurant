package com.example.web_restaurant.constant;

import java.util.Set;

public class PredefinedRole {
    public static final String EMPLOYEE_ROLE = "EMPLOYEE";
    public static final String ADMIN_ROLE = "ADMIN";
    public static final String CUSTOMER_ROLE = "CUSTOMER";


    private PredefinedRole(){}
    public static Set<String> getAllRoles() {
        return Set.of(EMPLOYEE_ROLE, ADMIN_ROLE, CUSTOMER_ROLE);
    }
}
