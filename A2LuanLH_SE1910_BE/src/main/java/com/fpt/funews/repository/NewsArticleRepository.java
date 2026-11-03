package com.fpt.funews.repository;

import com.fpt.funews.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * REPOSITORY: Tầng giao tiếp với bảng NewsArticle trong CSDL.
 * Chứa các hàm nghiệp vụ trọng tâm của bài tập.
 */
@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {

    /**
     * 1. DÀNH CHO KHÁCH (Public Guest):
     * Lấy tất cả bài viết đang ACTIVE (NewsStatus = 1) và sắp xếp ngày tạo mới nhất lên đầu.
     * SQL: SELECT * FROM NewsArticle WHERE NewsStatus = 1 ORDER BY CreatedDate DESC
     */
    List<NewsArticle> findByNewsStatusTrueOrderByCreatedDateDesc();

    /**
     * Tìm kiếm bài viết ACTIVE theo từ khóa trong tiêu đề.
     * SQL: SELECT * FROM NewsArticle WHERE NewsStatus = 1 AND LOWER(NewsTitle) LIKE %?% ORDER BY CreatedDate DESC
     */
    List<NewsArticle> findByNewsStatusTrueAndNewsTitleContainingIgnoreCaseOrderByCreatedDateDesc(String keyword);

    /**
     * 2. DÀNH CHO STAFF (Lịch sử cá nhân):
     * Lấy danh sách các bài viết do chính nhân viên này tạo (CreatedByID = accountId).
     * SQL: SELECT * FROM NewsArticle WHERE CreatedByID = ? ORDER BY CreatedDate DESC
     */
    List<NewsArticle> findByCreatedBy_AccountIdOrderByCreatedDateDesc(Integer accountId);

    /**
     * 3. RÀNG BUỘC NGHIỆP VỤ 1 (Rất quan trọng):
     * Đếm xem tài khoản này đã tạo bao nhiêu bài viết.
     * Dùng để kiểm tra trước khi Admin xóa tài khoản:
     * - Nếu kết quả > 0: Chặn xóa tài khoản!
     * - Nếu kết quả == 0: Cho phép xóa.
     * SQL: SELECT COUNT(*) FROM NewsArticle WHERE CreatedByID = ?
     */
    long countByCreatedBy_AccountId(Integer accountId);

    /**
     * 4. RÀNG BUỘC NGHIỆP VỤ 2 (Rất quan trọng):
     * Đếm xem có bao nhiêu bài viết đang thuộc về danh mục này.
     * Dùng để kiểm tra trước khi Staff xóa danh mục:
     * - Nếu kết quả > 0: Chặn xóa danh mục!
     * - Nếu kết quả == 0: Cho phép xóa.
     * SQL: SELECT COUNT(*) FROM NewsArticle WHERE CategoryID = ?
     */
    long countByCategory_CategoryId(Integer categoryId);

    /**
     * Tìm kiếm tất cả bài viết (dành cho màn hình quản trị của Staff).
     */
    List<NewsArticle> findByNewsTitleContainingIgnoreCaseOrderByCreatedDateDesc(String keyword);
}
