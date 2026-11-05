package com.fpt.funews.service;

import com.fpt.funews.dto.LoginRequest;
import com.fpt.funews.dto.LoginResponse;
import com.fpt.funews.entity.SystemAccount;
import com.fpt.funews.repository.SystemAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * SERVICE: Xử lý logic Đăng nhập (Authentication).
 */
@Service // Báo cho Spring Boot đây là tầng Service xử lý nghiệp vụ
@RequiredArgsConstructor // Lombok: Tự động tiêm các bean phụ thuộc (Dependency Injection)
public class AuthService {

    // Tiêm Repository để thao tác CSDL
    private final SystemAccountRepository accountRepository;

    /**
     * Hàm xử lý đăng nhập:
     * 1. Tìm tài khoản bằng Email.
     * 2. So sánh mật khẩu.
     * 3. Trả về thông tin người dùng kèm tên vai trò (Admin hoặc Staff).
     */
    public LoginResponse login(LoginRequest request) {
        // Bước 1: Tìm tài khoản trong database bằng email (đã xóa khoảng trắng thừa)
        SystemAccount account = accountRepository.findByAccountEmail(request.getEmail().trim())
                .orElseThrow(() -> new RuntimeException("Email does not exist in the system"));

        // Bước 2: So sánh mật khẩu người dùng nhập với mật khẩu lưu trong DB
        if (!account.getAccountPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Bước 3: Đổi mã số Role sang tên chữ để Frontend dễ hiển thị
        // Role = 1 là Admin, Role = 2 là Staff (theo quy định đề bài)
        String roleName = (account.getAccountRole() != null && account.getAccountRole() == 1) ? "Admin" : "Staff";

        // Bước 4: Đóng gói dữ liệu trả về cho Frontend (không trả về mật khẩu để bảo mật)
        return LoginResponse.builder()
                .accountId(account.getAccountId())
                .accountName(account.getAccountName())
                .accountEmail(account.getAccountEmail())
                .accountRole(account.getAccountRole())
                .roleName(roleName)
                .build();
    }
}
