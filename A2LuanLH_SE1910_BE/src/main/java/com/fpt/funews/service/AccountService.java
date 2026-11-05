package com.fpt.funews.service;

import com.fpt.funews.dto.AccountRequest;
import com.fpt.funews.dto.ProfileUpdateRequest;
import com.fpt.funews.entity.SystemAccount;
import com.fpt.funews.repository.NewsArticleRepository;
import com.fpt.funews.repository.SystemAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * SERVICE: Xử lý nghiệp vụ quản lý tài khoản cho Admin (CRUD)
 * và cập nhật thông tin cá nhân cho Staff (Profile).
 */
@Service
@RequiredArgsConstructor
public class AccountService {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleRepository newsArticleRepository;

    /**
     * 1. LẤY DANH SÁCH TÀI KHOẢN (KÈM TÌM KIẾM):
     * Nếu có truyền từ khóa 'keyword', tìm kiếm theo tên hoặc email.
     * Nếu không truyền, lấy toàn bộ danh sách tài khoản trong CSDL.
     */
    public List<SystemAccount> getAllAccounts(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return accountRepository.findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(
                    keyword.trim(), keyword.trim());
        }
        return accountRepository.findAll();
    }

    /**
     * Lấy thông tin 1 tài khoản theo ID.
     */
    public SystemAccount getAccountById(Integer id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));
    }

    /**
     * 2. TẠO MỚI TÀI KHOẢN (Admin):
     * - Kiểm tra xem Email đã bị ai dùng chưa.
     * - Đặt mật khẩu mặc định nếu Admin không nhập.
     * - Lưu tài khoản mới vào CSDL.
     */
    @Transactional // Đảm bảo toàn vẹn giao dịch CSDL (nếu lỗi sẽ rollback)
    public SystemAccount createAccount(AccountRequest request) {
        // Kiểm tra trùng Email
        if (accountRepository.findByAccountEmail(request.getAccountEmail().trim()).isPresent()) {
            throw new RuntimeException("Email already in use: " + request.getAccountEmail());
        }

        // Mật khẩu mặc định là 123456 nếu bỏ trống
        String password = (request.getAccountPassword() != null && !request.getAccountPassword().trim().isEmpty())
                ? request.getAccountPassword().trim()
                : "123456";

        SystemAccount account = SystemAccount.builder()
                .accountName(request.getAccountName().trim())
                .accountEmail(request.getAccountEmail().trim())
                .accountRole(request.getAccountRole())
                .accountPassword(password)
                .build();

        return accountRepository.save(account);
    }

    /**
     * 3. CẬP NHẬT TÀI KHOẢN (Admin):
     * - Nếu Admin sửa Email, phải đảm bảo Email mới không trùng với người khác.
     * - Cập nhật Tên, Role, Mật khẩu (nếu có nhập).
     */
    @Transactional
    public SystemAccount updateAccount(Integer id, AccountRequest request) {
        SystemAccount existing = getAccountById(id);

        // Kiểm tra xem email mới có trùng với ai khác ngoài chính tài khoản này không
        if (!existing.getAccountEmail().equalsIgnoreCase(request.getAccountEmail().trim())) {
            accountRepository.findByAccountEmail(request.getAccountEmail().trim()).ifPresent(acc -> {
                if (!acc.getAccountId().equals(id)) {
                    throw new RuntimeException("Email is already taken by another account");
                }
            });
        }

        existing.setAccountName(request.getAccountName().trim());
        existing.setAccountEmail(request.getAccountEmail().trim());
        existing.setAccountRole(request.getAccountRole());

        // Chỉ đổi mật khẩu nếu Admin có gõ mật khẩu mới
        if (request.getAccountPassword() != null && !request.getAccountPassword().trim().isEmpty()) {
            existing.setAccountPassword(request.getAccountPassword().trim());
        }

        return accountRepository.save(existing);
    }

    /**
     * 4. XÓA TÀI KHOẢN (Admin):
     * ⚠️ RÀNG BUỘC CỰC KỲ QUAN TRỌNG TỪ ĐỀ BÀI:
     * "the delete action will delete an account in the case this account is not belong to any news articles (created),
     * if the account is already created any news article, cannot delete."
     */
    @Transactional
    public void deleteAccount(Integer id) {
        SystemAccount account = getAccountById(id);

        // Đếm số lượng bài viết do tài khoản này tạo ra
        long articleCount = newsArticleRepository.countByCreatedBy_AccountId(id);

        // Nếu đã từng tạo dù chỉ 1 bài viết -> Chặn xóa ngay lập tức và ném ra thông báo lỗi!
        if (articleCount > 0) {
            throw new RuntimeException("Cannot delete account: This account has already created " + articleCount + " news article(s)!");
        }

        // Nếu chưa từng tạo bài viết nào -> Cho phép xóa an toàn
        accountRepository.delete(account);
    }

    /**
     * 5. CẬP NHẬT PROFILE CÁ NHÂN (Staff):
     * Nhân viên cập nhật tên, email của chính mình và đổi mật khẩu (phải nhập đúng mật khẩu cũ).
     */
    @Transactional
    public SystemAccount updateProfile(Integer id, ProfileUpdateRequest request) {
        SystemAccount account = getAccountById(id);

        // Kiểm tra trùng email
        if (!account.getAccountEmail().equalsIgnoreCase(request.getAccountEmail().trim())) {
            accountRepository.findByAccountEmail(request.getAccountEmail().trim()).ifPresent(acc -> {
                if (!acc.getAccountId().equals(id)) {
                    throw new RuntimeException("Email is already taken by another account");
                }
            });
        }

        account.setAccountName(request.getAccountName().trim());
        account.setAccountEmail(request.getAccountEmail().trim());

        // Nếu muốn đổi mật khẩu mới, bắt buộc phải kiểm tra mật khẩu cũ có đúng không
        if (request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty()) {
            if (request.getOldPassword() == null || !request.getOldPassword().equals(account.getAccountPassword())) {
                throw new RuntimeException("Current password does not match");
            }
            account.setAccountPassword(request.getNewPassword().trim());
        }

        return accountRepository.save(account);
    }
}
