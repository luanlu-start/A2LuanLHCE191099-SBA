package com.fpt.funews.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private Integer accountId;
    private String accountName;
    private String accountEmail;
    private Integer accountRole; // 1: Admin, 2: Staff
    private String roleName;     // "Admin" or "Staff"
}
