package com.fpt.funews.exception;

import com.fpt.funews.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * GLOBAL EXCEPTION HANDLER: Trạm kiểm soát lỗi tập trung của toàn bộ ứng dụng.
 * Khi ở tầng Service hoặc Controller ném (throw) ra bất kỳ lỗi nào,
 * class này sẽ tóm lấy và chuyển thành chuỗi JSON đẹp đẽ, chuyên nghiệp gửi về cho React.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * BẮT CÁC LỖI NGHIỆP VỤ (RuntimeException):
     * Ví dụ:
     * - "Cannot delete account: This account has already created news articles!"
     * - "Cannot delete category: There are news articles assigned to this category!"
     * - "Invalid password"
     * Trả về HTTP Status 400 Bad Request cho Frontend.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * BẮT CÁC LỖI VALIDATION DỮ LIỆU ĐẦU VÀO:
     * Xảy ra khi người dùng bỏ trống các trường bắt buộc (@NotBlank, @NotNull, @Email...).
     * Gom toàn bộ các lỗi theo từng ô nhập (field) gửi về để React hiển thị dưới chân từng ô.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<Map<String, String>>builder()
                        .success(false)
                        .message("Validation failed: Please check inputs")
                        .data(errors)
                        .build());
    }

    /**
     * Bắt các lỗi hệ thống không lường trước được (trả về mã 500).
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Internal Server Error: " + ex.getMessage()));
    }
}
