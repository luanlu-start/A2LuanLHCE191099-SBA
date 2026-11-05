package com.fpt.funews.controller;

import com.fpt.funews.dto.ApiResponse;
import com.fpt.funews.dto.NewsArticleRequest;
import com.fpt.funews.entity.NewsArticle;
import com.fpt.funews.service.NewsArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<NewsArticle>>> getPublicNews(@RequestParam(required = false) String search) {
        List<NewsArticle> list = newsArticleService.getPublicActiveNews(search);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NewsArticle>>> getAllNews(@RequestParam(required = false) String search) {
        List<NewsArticle> list = newsArticleService.getAllNews(search);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<NewsArticle>>> getStaffHistory(@RequestParam Integer staffId) {
        List<NewsArticle> list = newsArticleService.getStaffNewsHistory(staffId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NewsArticle>> getNewsById(@PathVariable String id) {
        NewsArticle article = newsArticleService.getNewsById(id);
        return ResponseEntity.ok(ApiResponse.ok(article));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NewsArticle>> createNews(
            @RequestParam(required = false) Integer staffId,
            @Valid @RequestBody NewsArticleRequest request) {
        NewsArticle created = newsArticleService.createNews(request, staffId);
        return ResponseEntity.ok(ApiResponse.ok("News article created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NewsArticle>> updateNews(
            @PathVariable String id,
            @RequestParam(required = false) Integer staffId,
            @Valid @RequestBody NewsArticleRequest request) {
        NewsArticle updated = newsArticleService.updateNews(id, request, staffId);
        return ResponseEntity.ok(ApiResponse.ok("News article updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNews(@PathVariable String id) {
        newsArticleService.deleteNews(id);
        return ResponseEntity.ok(ApiResponse.ok("News article deleted successfully", null));
    }
}
