package com.fpt.funews.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {

    @NotBlank(message = "Category Name cannot be empty")
    private String categoryName;

    private String categoryDesciption;

    private Integer parentCategoryId;

    @Builder.Default
    private Boolean isActive = true;
}
