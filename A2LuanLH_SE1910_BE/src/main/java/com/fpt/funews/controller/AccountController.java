package com.fpt.funews.controller;

import com.fpt.funews.dto.AccountRequest;
import com.fpt.funews.dto.ApiResponse;
import com.fpt.funews.dto.ProfileUpdateRequest;
import com.fpt.funews.entity.SystemAccount;
import com.fpt.funews.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CONTROLLER: Quản lý các API liên quan đến tài khoản người dùng (Account).
 * Phục vụ màn hình quản trị của Admin và chỉnh sửa hồ sơ của Staff.
 */
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    /**
     * API LẤY DANH SÁCH TÀI KHOẢN (Có hỗ trợ Search):
     * GET http://localhost:8080/api/accounts?search=...
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<SystemAccount>>> getAllAccounts(@RequestParam(required = false) String search) {
        List<SystemAccount> list = accountService.getAllAccounts(search);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    /**
     * API LẤY CHI TIẾT 1 TÀI KHOẢN:
     * GET http://localhost:8080/api/accounts/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SystemAccount>> getAccountById(@PathVariable Integer id) {
        SystemAccount account = accountService.getAccountById(id);
        return ResponseEntity.ok(ApiResponse.ok(account));
    }

    /**
     * API TẠO TÀI KHOẢN MỚI (Admin):
     * POST http://localhost:8080/api/accounts
     * @Valid kiểm tra validation (không để trống tên, email đúng định dạng)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<SystemAccount>> createAccount(@Valid @RequestBody AccountRequest request) {
        SystemAccount created = accountService.createAccount(request);
        return ResponseEntity.ok(ApiResponse.ok("Account created successfully", created));
    }

    /**
     * API CẬP NHẬT TÀI KHOẢN (Admin):
     * PUT http://localhost:8080/api/accounts/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SystemAccount>> updateAccount(
            @PathVariable Integer id,
            @Valid @RequestBody AccountRequest request) {
        SystemAccount updated = accountService.updateAccount(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Account updated successfully", updated));
    }

    /**
     * API XÓA TÀI KHOẢN (Admin):
     * DELETE http://localhost:8080/api/accounts/{id}
     * Nếu tài khoản đã tạo bài viết, Service sẽ quăng Exception và GlobalExceptionHandler sẽ trả về mã lỗi 400.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable Integer id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok(ApiResponse.ok("Account deleted successfully", null));
    }

    /**
     * API CẬP NHẬT PROFILE CÁ NHÂN (Staff):
     * PUT http://localhost:8080/api/accounts/{id}/profile
     */
    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<SystemAccount>> updateProfile(
            @PathVariable Integer id,
            @Valid @RequestBody ProfileUpdateRequest request) {
        SystemAccount updated = accountService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }
}
