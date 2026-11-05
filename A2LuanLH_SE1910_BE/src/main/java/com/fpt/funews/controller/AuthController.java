package com.fpt.funews.controller;

import com.fpt.funews.dto.ApiResponse;
import com.fpt.funews.dto.LoginRequest;
import com.fpt.funews.dto.LoginResponse;
import com.fpt.funews.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * CONTROLLER: Tầng tiếp nhận HTTP Request từ React Frontend gửi sang.
 * Mở API phục vụ chức năng Đăng nhập.
 */
@RestController // Đánh dấu class là REST API, tự động chuyển kết quả trả về thành chuỗi JSON
@RequestMapping("/api/auth") // Tiền tố URL chung cho toàn bộ controller này
@RequiredArgsConstructor // Lombok: Tự động tiêm AuthService vào
public class AuthController {

    private final AuthService authService;

    /**
     * API ĐĂNG NHẬP:
     * Endpoint: POST http://localhost:8080/api/auth/login
     *
     * @param request: Chứa email và password từ Frontend gửi lên trong Body
     * @Valid: Kích hoạt kiểm tra tính hợp lệ dữ liệu (NotBlank, Email) từ DTO
     * @RequestBody: Tự động parse chuỗi JSON từ React thành đối tượng LoginRequest
     * @return: Đối tượng ApiResponse bọc dữ liệu LoginResponse kèm HTTP Status 200 OK
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        // Gọi Service xử lý kiểm tra tài khoản và mật khẩu
        LoginResponse response = authService.login(request);

        // Trả về kết quả thành công cho Frontend
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }
}
