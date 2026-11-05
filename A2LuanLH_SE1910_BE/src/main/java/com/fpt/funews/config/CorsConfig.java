package com.fpt.funews.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CẤU HÌNH CORS (Cross-Origin Resource Sharing):
 * Trình duyệt web có cơ chế bảo mật chặn các yêu cầu gửi giữa 2 cổng khác nhau:
 * - Frontend chạy ở cổng: http://localhost:5173
 * - Backend chạy ở cổng: http://localhost:8080
 * File cấu hình này mở quyền (cho phép) Frontend ReactJS được phép gọi API sang Backend.
 */
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Áp dụng cho toàn bộ các link API
                        .allowedOriginPatterns("*") // Cho phép mọi nguồn (hoặc cụ thể localhost:5173)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Cho phép đầy đủ 4 phương thức CRUD
                        .allowedHeaders("*") // Cho phép gửi mọi loại Header
                        .allowCredentials(true); // Cho phép gửi kèm Cookie / Session
            }
        };
    }
}
