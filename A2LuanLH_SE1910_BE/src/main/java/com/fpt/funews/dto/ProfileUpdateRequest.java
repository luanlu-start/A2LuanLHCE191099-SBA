package com.fpt.funews.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {

    @NotBlank(message = "Account Name cannot be empty")
    private String accountName;

    @NotBlank(message = "Account Email cannot be empty")
    @Email(message = "Invalid email format")
    private String accountEmail;

    private String oldPassword;

    private String newPassword;
}
