package com.fpt.funews.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

/**
 * ENTITY: Ánh xạ bảng Category trong SQL Server sang Java.
 * Quản lý danh mục tin tức (học tập, đời sống sinh viên, công nghệ...).
 */
@Entity
@Table(name = "Category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Integer categoryId;

    @Column(name = "CategoryName", nullable = false, length = 100) // Tên danh mục (bắt buộc)
    private String categoryName;

    // Lưu ý: Đề bài đặt tên cột trong diagram là "CategoryDesciption" (thiếu chữ 'r')
    @Column(name = "CategoryDesciption", length = 255) // Mô tả danh mục
    private String categoryDesciption;

    /**
     * Quan hệ danh mục cha/con (Self-referencing ManyToOne).
     * Một danh mục con có thể thuộc về 1 danh mục cha (ParentCategoryID trỏ về chính bảng Category).
     * @JsonIgnoreProperties giúp tránh bị lặp vô tận (Infinite recursion) khi chuyển sang JSON.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ParentCategoryID")
    @JsonIgnoreProperties({"parentCategory"})
    private Category parentCategory;

    @Column(name = "IsActive", nullable = false) // Trạng thái: 1 = Active (hiển thị), 0 = Inactive (ẩn)
    @Builder.Default
    private Boolean isActive = true;
}
