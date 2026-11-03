package com.fpt.funews.service;

import com.fpt.funews.dto.NewsArticleRequest;
import com.fpt.funews.entity.Category;
import com.fpt.funews.entity.NewsArticle;
import com.fpt.funews.entity.SystemAccount;
import com.fpt.funews.entity.Tag;
import com.fpt.funews.repository.CategoryRepository;
import com.fpt.funews.repository.NewsArticleRepository;
import com.fpt.funews.repository.SystemAccountRepository;
import com.fpt.funews.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * SERVICE: Xử lý toàn bộ logic nghiệp vụ về Bài viết tin tức (News Article):
 * 1. Khách xem tin tức công khai (Active news).
 * 2. Nhân viên (Staff) xem, tìm kiếm, tạo mới, chỉnh sửa, xóa bài viết.
 * 3. Nhân viên xem lại lịch sử các bài do chính mình tạo (My News History).
 */
@Service
@RequiredArgsConstructor
public class NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagRepository tagRepository;

    /**
     * 1. DÀNH CHO KHÁCH (Public Guest):
     * Không cần đăng nhập, chỉ xem các bài viết có NewsStatus = 1 (Active).
     */
    public List<NewsArticle> getPublicActiveNews(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return newsArticleRepository.findByNewsStatusTrueAndNewsTitleContainingIgnoreCaseOrderByCreatedDateDesc(keyword.trim());
        }
        return newsArticleRepository.findByNewsStatusTrueOrderByCreatedDateDesc();
    }

    /**
     * 2. DÀNH CHO NHÂN VIÊN (Staff) TRONG MÀN HÌNH QUẢN TRỊ:
     * Xem được tất cả các bài viết (cả Active lẫn Inactive/Bản nháp) và hỗ trợ tìm kiếm.
     */
    public List<NewsArticle> getAllNews(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return newsArticleRepository.findByNewsTitleContainingIgnoreCaseOrderByCreatedDateDesc(keyword.trim());
        }
        return newsArticleRepository.findAll();
    }

    /**
     * 3. LỊCH SỬ BÀI VIẾT CỦA NHÂN VIÊN:
     * Đề bài yêu cầu: "View news history created by him/her".
     * Lọc tất cả bài viết mà CreatedByID chính là ID của nhân viên đang đăng nhập.
     */
    public List<NewsArticle> getStaffNewsHistory(Integer staffId) {
        return newsArticleRepository.findByCreatedBy_AccountIdOrderByCreatedDateDesc(staffId);
    }

    /**
     * Lấy chi tiết 1 bài viết theo ID.
     */
    public NewsArticle getNewsById(String newsArticleId) {
        return newsArticleRepository.findById(newsArticleId)
                .orElseThrow(() -> new RuntimeException("News article not found with ID: " + newsArticleId));
    }

    /**
     * 4. TẠO MỚI BÀI VIẾT:
     * - Kiểm tra trùng mã ID bài viết (NewsArticleID).
     * - Tìm Category tương ứng.
     * - Gán người tạo bài (Author/CreatedBy) là tài khoản Staff hiện tại.
     * - Gán danh sách các Tags được chọn (quan hệ Many-to-Many).
     */
    @Transactional
    public NewsArticle createNews(NewsArticleRequest request, Integer staffId) {
        // Kiểm tra xem ID bài viết đã tồn tại chưa
        if (newsArticleRepository.existsById(request.getNewsArticleId().trim())) {
            throw new RuntimeException("News Article ID already exists: " + request.getNewsArticleId());
        }

        // Tìm Category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + request.getCategoryId()));

        // Xác định ai là người tạo
        Integer creatorId = (staffId != null) ? staffId : request.getCreatedById();
        if (creatorId == null) {
            throw new RuntimeException("Creator account ID is required");
        }
        SystemAccount author = accountRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Author account not found with ID: " + creatorId));

        // Lấy danh sách Tag từ CSDL theo các tagId người dùng tích chọn
        Set<Tag> tags = new HashSet<>();
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            tags.addAll(tagRepository.findAllById(request.getTagIds()));
        }

        NewsArticle article = NewsArticle.builder()
                .newsArticleId(request.getNewsArticleId().trim())
                .newsTitle(request.getNewsTitle().trim())
                .headline(request.getHeadline())
                .createdDate(LocalDateTime.now()) // Ngày tạo bài là thời điểm hiện tại
                .newsContent(request.getNewsContent())
                .newsSource(request.getNewsSource())
                .category(category)
                .newsStatus(request.getNewsStatus() != null ? request.getNewsStatus() : true)
                .createdBy(author)
                .updatedById(author.getAccountId())
                .modifiedDate(LocalDateTime.now())
                .tags(tags)
                .build();

        return newsArticleRepository.save(article);
    }

    /**
     * 5. CẬP NHẬT BÀI VIẾT:
     * Cập nhật thông tin bài viết, cập nhật ModifiedDate và danh sách Tags.
     */
    @Transactional
    public NewsArticle updateNews(String id, NewsArticleRequest request, Integer staffId) {
        NewsArticle existing = getNewsById(id);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + request.getCategoryId()));

        existing.setNewsTitle(request.getNewsTitle().trim());
        existing.setHeadline(request.getHeadline());
        existing.setNewsContent(request.getNewsContent());
        existing.setNewsSource(request.getNewsSource());
        existing.setCategory(category);
        if (request.getNewsStatus() != null) {
            existing.setNewsStatus(request.getNewsStatus());
        }

        if (staffId != null) {
            existing.setUpdatedById(staffId);
        }
        existing.setModifiedDate(LocalDateTime.now()); // Đánh dấu ngày giờ chỉnh sửa mới nhất

        // Cập nhật lại danh sách Tags
        if (request.getTagIds() != null) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(request.getTagIds()));
            existing.setTags(tags);
        }

        return newsArticleRepository.save(existing);
    }

    /**
     * 6. XÓA BÀI VIẾT:
     * Nhờ cấu hình CASCADE dưới database, các liên kết trong bảng trung gian NewsTag cũng sẽ được xóa sạch.
     */
    @Transactional
    public void deleteNews(String id) {
        NewsArticle article = getNewsById(id);
        newsArticleRepository.delete(article);
    }
}
