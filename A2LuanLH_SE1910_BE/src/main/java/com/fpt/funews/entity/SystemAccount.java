package com.fpt.funews.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * ENTITY: Ánh xạ bảng SystemAccount trong CSDL SQL Server sang Java Class.
 * Quản lý thông tin tài khoản đăng nhập (Admin và Staff).
 */
@Entity // Báo cho Spring Boot biết class này là 1 bảng trong Database
@Table(name = "SystemAccount") // Tên chính xác của bảng trong SQL Server
@Getter // Lombok: Tự sinh toàn bộ các hàm get (ví dụ: getAccountName(), getAccountEmail()...)
@Setter // Lombok: Tự sinh toàn bộ các hàm set (ví dụ: setAccountName(...)...)
@NoArgsConstructor // Lombok: Tự sinh Constructor không tham số (bắt buộc đối với JPA Entity)
@AllArgsConstructor // Lombok: Tự sinh Constructor có đầy đủ tất cả tham số
@Builder // Lombok: Cho phép tạo đối tượng nhanh theo phong cách SystemAccount.builder()...build()
public class SystemAccount {

    @Id // Đánh dấu đây là Khóa chính (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Khóa chính tự động tăng trong SQL Server (IDENTITY(1,1))
    @Column(name = "AccountID") // Tên cột tương ứng trong SQL
    private Integer accountId;

    @Column(name = "AccountName", nullable = false, length = 100) // Họ tên người dùng, không được để trống (nullable = false)
    private String accountName;

    @Column(name = "AccountEmail", nullable = false, unique = true, length = 100) // Email đăng nhập, bắt buộc duy nhất (unique = true)
    private String accountEmail;

    @Column(name = "AccountRole", nullable = false) // Vai trò người dùng: 1 = Admin, 2 = Staff
    private Integer accountRole;

    @Column(name = "AccountPassword", nullable = false, length = 100) // Mật khẩu đăng nhập
    private String accountPassword;
}
