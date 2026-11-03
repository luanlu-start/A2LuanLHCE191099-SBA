-- ==========================================================
-- Database Script: A2LuanLH_SE1910
-- Assignment 02 SBA301 - News Management System (FUNewsManagementSystem)
-- Student: LuanLH - Class: SE1910
-- ==========================================================

USE master;
GO

-- Xóa CSDL cũ nếu tồn tại để tạo mới hoàn toàn sạch sẽ
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'A2LuanLH_SE1910')
BEGIN
    ALTER DATABASE [A2LuanLH_SE1910] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [A2LuanLH_SE1910];
END
GO

-- Tạo mới CSDL
CREATE DATABASE [A2LuanLH_SE1910];
GO

USE [A2LuanLH_SE1910];
GO

-- 1. Bảng SystemAccount (Tài khoản người dùng)
-- Admin role = 1, Staff role = 2
CREATE TABLE [dbo].[SystemAccount] (
    [AccountID]       INT IDENTITY(1,1) NOT NULL,
    [AccountName]     NVARCHAR(100) NOT NULL,
    [AccountEmail]    NVARCHAR(100) NOT NULL UNIQUE,
    [AccountRole]     INT NOT NULL, -- 1: Admin, 2: Staff
    [AccountPassword] NVARCHAR(100) NOT NULL,
    CONSTRAINT [PK_SystemAccount] PRIMARY KEY CLUSTERED ([AccountID] ASC)
);
GO

-- 2. Bảng Category (Danh mục tin tức)
-- IsActive = 1 (hoạt động), 0 (tạm ẩn)
CREATE TABLE [dbo].[Category] (
    [CategoryID]          INT IDENTITY(1,1) NOT NULL,
    [CategoryName]        NVARCHAR(100) NOT NULL,
    [CategoryDesciption]  NVARCHAR(255) NULL,
    [ParentCategoryID]    INT NULL,
    [IsActive]            BIT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Category] PRIMARY KEY CLUSTERED ([CategoryID] ASC),
    CONSTRAINT [FK_Category_Parent] FOREIGN KEY ([ParentCategoryID]) REFERENCES [dbo].[Category] ([CategoryID])
);
GO

-- 3. Bảng NewsArticle (Bài viết tin tức)
-- NewsStatus = 1 (active - công khai cho khách xem), 0 (inactive - nháp)
CREATE TABLE [dbo].[NewsArticle] (
    [NewsArticleID] NVARCHAR(50) NOT NULL,
    [NewsTitle]     NVARCHAR(255) NOT NULL,
    [Headline]      NVARCHAR(255) NULL,
    [CreatedDate]   DATETIME NOT NULL DEFAULT GETDATE(),
    [NewsContent]   NVARCHAR(MAX) NOT NULL,
    [NewsSource]    NVARCHAR(255) NULL,
    [CategoryID]    INT NOT NULL,
    [NewsStatus]    BIT NOT NULL DEFAULT 1,
    [CreatedByID]   INT NOT NULL,
    [UpdatedByID]   INT NULL,
    [ModifiedDate]  DATETIME NULL,
    CONSTRAINT [PK_NewsArticle] PRIMARY KEY CLUSTERED ([NewsArticleID] ASC),
    CONSTRAINT [FK_NewsArticle_Category] FOREIGN KEY ([CategoryID]) REFERENCES [dbo].[Category] ([CategoryID]),
    CONSTRAINT [FK_NewsArticle_CreatedBy] FOREIGN KEY ([CreatedByID]) REFERENCES [dbo].[SystemAccount] ([AccountID]),
    CONSTRAINT [FK_NewsArticle_UpdatedBy] FOREIGN KEY ([UpdatedByID]) REFERENCES [dbo].[SystemAccount] ([AccountID])
);
GO

-- 4. Bảng Tag (Thẻ phân loại bài viết)
CREATE TABLE [dbo].[Tag] (
    [TagID]   INT IDENTITY(1,1) NOT NULL,
    [TagName] NVARCHAR(100) NOT NULL,
    [Note]    NVARCHAR(255) NULL,
    CONSTRAINT [PK_Tag] PRIMARY KEY CLUSTERED ([TagID] ASC)
);
GO

-- 5. Bảng trung gian NewsTag (Quan hệ nhiều - nhiều giữa NewsArticle và Tag)
CREATE TABLE [dbo].[NewsTag] (
    [NewsArticleID] NVARCHAR(50) NOT NULL,
    [TagID]         INT NOT NULL,
    CONSTRAINT [PK_NewsTag] PRIMARY KEY CLUSTERED ([NewsArticleID] ASC, [TagID] ASC),
    CONSTRAINT [FK_NewsTag_NewsArticle] FOREIGN KEY ([NewsArticleID]) REFERENCES [dbo].[NewsArticle] ([NewsArticleID]) ON DELETE CASCADE,
    CONSTRAINT [FK_NewsTag_Tag] FOREIGN KEY ([TagID]) REFERENCES [dbo].[Tag] ([TagID]) ON DELETE CASCADE
);
GO

-- ==========================================================
-- NẠP DỮ LIỆU MẪU CHUẨN ĐỂ TEST ĐẦY ĐỦ CÁC CHỨC NĂNG
-- ==========================================================

-- 1. Thêm 3 tài khoản mẫu:
-- Tài khoản 1: Admin
-- Tài khoản 2: Staff 1 (Le Huu Luan) - Có bài viết (để test chặn xóa!)
-- Tài khoản 3: Staff 2 - Chưa có bài viết (để test xóa thành công!)
INSERT INTO [dbo].[SystemAccount] ([AccountName], [AccountEmail], [AccountRole], [AccountPassword])
VALUES 
(N'Administrator', 'admin@funews.com', 1, 'admin123'),
(N'Le Huu Luan (Staff 1)', 'luanlh@funews.com', 2, 'staff123'),
(N'Nguyen Van Staff (Staff 2)', 'staff2@funews.com', 2, 'staff123');
GO

-- 2. Thêm 4 danh mục mẫu:
-- Danh mục 1, 2, 3: Đã có bài viết liên kết
-- Danh mục 4 (Archived Category): Chưa có bài viết nào (để test Staff xóa danh mục thành công!)
INSERT INTO [dbo].[Category] ([CategoryName], [CategoryDesciption], [ParentCategoryID], [IsActive])
VALUES 
(N'Academic News', N'University official announcements and academic schedules', NULL, 1),
(N'Technology & Science', N'Latest IT trends, AI research, and software breakthroughs', NULL, 1),
(N'Student Life', N'Clubs, extracurricular activities, and campus life', NULL, 1),
(N'Archived Category', N'Empty category without articles for delete testing', NULL, 1);
GO

-- 3. Thêm 4 thẻ Tag mẫu:
INSERT INTO [dbo].[Tag] ([TagName], [Note])
VALUES 
(N'FPT University', N'News related to FPT University campus'),
(N'Technology', N'IT and Software Engineering news'),
(N'AI', N'Artificial Intelligence and Machine Learning'),
(N'Campus Event', N'Campus activities and workshops');
GO

-- 4. Thêm 3 bài viết mẫu:
-- NEWS001: Active (NewsStatus = 1), tạo bởi Staff 1 (CreatedByID = 2), Category = 1
-- NEWS002: Active (NewsStatus = 1), tạo bởi Staff 1 (CreatedByID = 2), Category = 3
-- NEWS003: Inactive (NewsStatus = 0), tạo bởi Staff 1 (CreatedByID = 2), Category = 1
INSERT INTO [dbo].[NewsArticle] ([NewsArticleID], [NewsTitle], [Headline], [CreatedDate], [NewsContent], [NewsSource], [CategoryID], [NewsStatus], [CreatedByID], [UpdatedByID], [ModifiedDate])
VALUES 
('NEWS001', N'FPT University Opens New AI Research Lab', N'Major milestone in modern AI education', GETDATE(), N'FPT University officially inaugurated a high-tech Artificial Intelligence lab equipped with modern GPU clusters to assist students in SBA301 and Capstone Projects.', N'FUNews Internal', 1, 1, 2, 2, GETDATE()),
('NEWS002', N'Spring 2026 Hackathon Registration Open', N'Compete for 100M VND prizes', DATEADD(day, -2, GETDATE()), N'Calling all students passionate about web development, AI, and cloud computing. Form teams of 4 and register before next Friday.', N'Student Affairs Office', 3, 1, 2, 2, GETDATE()),
('NEWS003', N'Draft: Upcoming Tuition Policy Updates', N'Internal draft for review', DATEADD(day, -5, GETDATE()), N'This article is inactive draft and only visible to staff who created it.', N'Finance Office', 1, 0, 2, 2, GETDATE());
GO

-- 5. Gán Tag cho các bài viết (NewsTag):
INSERT INTO [dbo].[NewsTag] ([NewsArticleID], [TagID])
VALUES 
('NEWS001', 1),
('NEWS001', 2),
('NEWS001', 3),
('NEWS002', 1),
('NEWS002', 4);
GO

-- ==========================================================
-- KIỂM TRA LẠI DỮ LIỆU ĐÃ NẠP
-- ==========================================================
SELECT * FROM [dbo].[SystemAccount];
SELECT * FROM [dbo].[Category];
SELECT * FROM [dbo].[Tag];
SELECT * FROM [dbo].[NewsArticle];
SELECT * FROM [dbo].[NewsTag];
GO
