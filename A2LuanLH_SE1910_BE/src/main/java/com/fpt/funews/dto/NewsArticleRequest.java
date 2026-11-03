package com.fpt.funews.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticleRequest {

    @NotBlank(message = "News Article ID cannot be empty")
    private String newsArticleId;

    @NotBlank(message = "News Title cannot be empty")
    private String newsTitle;

    private String headline;

    @NotBlank(message = "News Content cannot be empty")
    private String newsContent;

    private String newsSource;

    @NotNull(message = "Category ID is required")
    private Integer categoryId;

    @Builder.Default
    private Boolean newsStatus = true;

    private Integer createdById;

    private List<Integer> tagIds;
}
