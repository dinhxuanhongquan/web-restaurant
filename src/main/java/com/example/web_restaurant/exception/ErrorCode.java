package com.example.web_restaurant.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized Error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User already existed", HttpStatus.BAD_REQUEST),
    USERNAME_VALIDATION(1003, "Username must be {min} characters long", HttpStatus.BAD_REQUEST),
    PASSWORD_VALIDATION(1004, "Password must be {min} characters long", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),

    TABLE_NOT_EXISTED(1009, "Table not existed", HttpStatus.NOT_FOUND),
    TABLE_CREATION_FAILED(1032, "Table creation failed", HttpStatus.BAD_REQUEST),
    TABLE_NOT_AVAILABLE(1033, "Table not available", HttpStatus.BAD_REQUEST),

    DISH_NOT_EXISTED(1010, "Dish not existed", HttpStatus.NOT_FOUND),
    DISH_NOT_CREATED(1011, "Dish not created", HttpStatus.BAD_REQUEST),
    DISH_NOT_DELETED(1012, "Dish not deleted", HttpStatus.BAD_REQUEST),
    DISH_NOT_UPDATED(1013, "Table not created", HttpStatus.BAD_REQUEST),

    CATEGORY_DISH_NOT_EXISTED(1014, "Category dish not existed", HttpStatus.NOT_FOUND),
    CATEGORY_DISH_NOT_CREATED(1015, "Category dish not created", HttpStatus.BAD_REQUEST),

    BILL_NOT_EXISTED(1016, "Bill not existed", HttpStatus.NOT_FOUND),
    BILL_NOT_CREATED(1017, "Bill not created", HttpStatus.BAD_REQUEST),
    BILL_NOT_DELETED(1018, "Bill not deleted", HttpStatus.BAD_REQUEST),
    BILL_NOT_UPDATED(1019, "Bill not updated", HttpStatus.BAD_REQUEST),

    BILLDISH_NOT_EXISTED(1020, "Bill dish not existed", HttpStatus.NOT_FOUND),

    BOOKING_NOT_EXISTED(1020, "Booking not existed", HttpStatus.NOT_FOUND),
    BOOKING_NOT_CREATED(1021, "Booking not created", HttpStatus.BAD_REQUEST),
    BOOKING_NOT_DELETED(1022, "Booking not deleted", HttpStatus.BAD_REQUEST),
    BOOKING_NOT_UPDATED(1023, "Booking not updated", HttpStatus.BAD_REQUEST),

    FEEDBACK_NOT_EXISTED(1024, "Feedback not existed", HttpStatus.NOT_FOUND),
    FEEDBACK_NOT_CREATED(1025, "Feedback not created", HttpStatus.BAD_REQUEST),
    FEEDBACK_NOT_DELETED(1026, "Feedback not deleted", HttpStatus.BAD_REQUEST),
    FEEDBACK_NOT_UPDATED(1027, "Feedback not updated", HttpStatus.BAD_REQUEST),

    REPLY_NOT_EXISTED(1028, "Reply not existed", HttpStatus.NOT_FOUND),
    REPLY_NOT_CREATED(1029, "Reply not created", HttpStatus.BAD_REQUEST),
    REPLY_NOT_DELETED(1030, "Reply not deleted", HttpStatus.BAD_REQUEST),
    REPLY_NOT_UPDATED(1031, "Reply not updated", HttpStatus.BAD_REQUEST),

    INVALID_BOOKING_TIME(1033, "Booking time must be in the future", HttpStatus.BAD_REQUEST),
    INVALID_BOOKING_TIME_RANGE(1034, "Booking time must be between 08:00 and 22:00.", HttpStatus.BAD_REQUEST),
    INVALID_BOOKING_TIME_MIN_MONTH(1035, "Booking cannot be more than 1 month or less than 1 hour in advance.", HttpStatus.BAD_REQUEST),

    ROLE_NOT_EXISTED(1036, "Role not existed", HttpStatus.NOT_FOUND),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
