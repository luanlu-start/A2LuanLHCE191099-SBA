package com.fpt.funews.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * ENTITY: Ánh xạ bảng NewsArticle trong SQL Server sang Java.
 * Quản lý chi tiết bài viết tin tức.
 */
@Entity
@Table(name = "NewsArticle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticle {

    @Id // Khóa chính: Mã bài viết dạng chuỗi (ví dụ: "NEWS001", "NEWS002"...)
    @Column(name = "NewsArticleID", length = 50)
    private String newsArticleId;

    @Column(name = "NewsTitle", nullable = false, length = 255) // Tiêu đề bài viết (bắt buộc)
    private String newsTitle;

    @Column(name = "Headline", length = 255) // Tiêu đề phụ / Tóm tắt ngắn
    private String headline;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") // Định dạng hiển thị ngày giờ chuẩn cho JSON
    @Column(name = "CreatedDate", nullable = false)
    @Builder.Default
    private LocalDateTime createdDate = LocalDateTime.now();

    @Lob // Đánh dấu đây là dữ liệu văn bản lớn (NVARCHAR(MAX) trong SQL)
    @Column(name = "NewsContent", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String newsContent; // Nội dung chi tiết của bài viết

    @Column(name = "NewsSource", length = 255) // Nguồn tin (ví dụ: "Phòng Đào Tạo", "FPT Media")
    private String newsSource;

    /**
     * Quan hệ Many-to-One: Nhiều bài viết thuộc về 1 Danh mục (Category).
     * Cột CategoryID là khóa ngoại (Foreign Key).
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CategoryID", nullable = false)
    private Category category;

    @Column(name = "NewsStatus", nullable = false) // Trạng thái: 1 = Active (công khai cho khách xem), 0 = Inactive (nháp/ẩn)
    @Builder.Default
    private Boolean newsStatus = true;

    /**
     * Quan hệ Many-to-One: Nhiều bài viết được tạo bởi 1 Tài khoản nhân viên (CreatedByID).
     * Đây là căn cứ để:
     * 1. Lọc lịch sử bài viết của Staff.
     * 2. Chặn Admin không cho xóa tài khoản nếu tài khoản này đã từng tạo bài!
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CreatedByID", nullable = false)
    private SystemAccount createdBy;

    @Column(name = "UpdatedByID") // ID của người sửa bài viết gần nhất
    private Integer updatedById;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "ModifiedDate") // Ngày giờ chỉnh sửa gần nhất
    private LocalDateTime modifiedDate;

    /**
     * Quan hệ Many-to-Many: Một bài viết có nhiều thẻ Tag, một Tag có thể gắn vào nhiều bài viết.
     * Liên kết thông qua bảng trung gian "NewsTag" (gồm 2 cột NewsArticleID và TagID).
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "NewsTag",
            joinColumns = @JoinColumn(name = "NewsArticleID"),
            inverseJoinColumns = @JoinColumn(name = "TagID")
    )
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();
}
