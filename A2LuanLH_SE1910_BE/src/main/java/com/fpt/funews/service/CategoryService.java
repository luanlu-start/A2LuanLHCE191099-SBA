package com.fpt.funews.service;

import com.fpt.funews.dto.CategoryRequest;
import com.fpt.funews.entity.Category;
import com.fpt.funews.repository.CategoryRepository;
import com.fpt.funews.repository.NewsArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * SERVICE: Xử lý nghiệp vụ quản lý danh mục (Category) dành cho Staff (Role 2).
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    /**
     * Lấy toàn bộ danh mục (có hỗ trợ tìm kiếm theo tên).
     */
    public List<Category> getAllCategories(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return categoryRepository.findByCategoryNameContainingIgnoreCase(keyword.trim());
        }
        return categoryRepository.findAll();
    }

    /**
     * Lấy danh sách danh mục đang ACTIVE (IsActive = 1).
     * Dùng để nạp vào thẻ chọn (<select>) khi Staff tạo/sửa bài viết mới.
     */
    public List<Category> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue();
    }

    /**
     * Lấy chi tiết 1 danh mục theo ID.
     */
    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
    }

    /**
     * TẠO MỚI DANH MỤC:
     * Hỗ trợ gán danh mục cha (Parent Category) nếu có chọn.
     */
    @Transactional
    public Category createCategory(CategoryRequest request) {
        Category parent = null;
        if (request.getParentCategoryId() != null) {
            parent = categoryRepository.findById(request.getParentCategoryId()).orElse(null);
        }

        Category category = Category.builder()
                .categoryName(request.getCategoryName().trim())
                .categoryDesciption(request.getCategoryDesciption())
                .parentCategory(parent)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        return categoryRepository.save(category);
    }

    /**
     * CẬP NHẬT DANH MỤC:
     */
    @Transactional
    public Category updateCategory(Integer id, CategoryRequest request) {
        Category existing = getCategoryById(id);

        Category parent = null;
        // Tránh trường hợp chọn chính nó làm danh mục cha của chính nó
        if (request.getParentCategoryId() != null && !request.getParentCategoryId().equals(id)) {
            parent = categoryRepository.findById(request.getParentCategoryId()).orElse(null);
        }

        existing.setCategoryName(request.getCategoryName().trim());
        existing.setCategoryDesciption(request.getCategoryDesciption());
        existing.setParentCategory(parent);
        if (request.getIsActive() != null) {
            existing.setIsActive(request.getIsActive());
        }

        return categoryRepository.save(existing);
    }

    /**
     * XÓA DANH MỤC:
     * ⚠️ RÀNG BUỘC CỰC KỲ QUAN TRỌNG TỪ ĐỀ BÀI:
     * "The delete action will delete an item in the case this item is not belong to any news articles.
     * If the item is already stored in a news article cannot delete."
     */
    @Transactional
    public void deleteCategory(Integer id) {
        Category category = getCategoryById(id);

        // Đếm số lượng bài viết đang thuộc về danh mục này
        long articleCount = newsArticleRepository.countByCategory_CategoryId(id);

        // Nếu danh mục này đang chứa bài viết -> Chặn xóa ngay lập tức!
        if (articleCount > 0) {
            throw new RuntimeException("Cannot delete category: There are " + articleCount + " news article(s) assigned to this category!");
        }

        // Nếu không có bài viết nào liên kết -> Cho phép xóa
        categoryRepository.delete(category);
    }
}
