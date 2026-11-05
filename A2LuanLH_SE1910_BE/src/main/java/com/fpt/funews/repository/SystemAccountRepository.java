package com.fpt.funews.repository;

import com.fpt.funews.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * REPOSITORY: Tầng giao tiếp trực tiếp với bảng SystemAccount trong CSDL.
 * Kế thừa JpaRepository để có sẵn các hàm CRUD cơ bản (save, findById, findAll, deleteById...).
 */
@Repository
public interface SystemAccountRepository extends JpaRepository<SystemAccount, Integer> {

    /**
     * Tìm tài khoản theo Email.
     * Dùng cho chức năng Đăng nhập (Auth) và kiểm tra trùng Email khi tạo tài khoản mới.
     * Spring Data JPA tự động dịch tên hàm thành SQL:
     * SELECT * FROM SystemAccount WHERE AccountEmail = ?
     */
    Optional<SystemAccount> findByAccountEmail(String accountEmail);

    /**
     * Tìm kiếm tài khoản theo Tên HOẶC Email (không phân biệt chữ hoa/thường).
     * Dùng cho thanh Search của Admin trên giao diện quản lý tài khoản.
     * SQL tương đương:
     * SELECT * FROM SystemAccount WHERE LOWER(AccountName) LIKE %?% OR LOWER(AccountEmail) LIKE %?%
     */
    List<SystemAccount> findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(String name, String email);
}
