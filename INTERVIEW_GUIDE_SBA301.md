# CẨM NANG TOÀN TẬP INTERVIEW MÔN SBA301 - ĐẠT ĐIỂM TỐI ĐA (10/10)
**DỰ ÁN:** FUNewsManagementSystem (Hệ thống Quản lý Tin tức Đại học FPT)  
**Sinh viên:** Lư Hữu Luân (LuanLH) | **MSSV:** CE191099 | **Lớp:** SE1910  
**Tên CSDL & Project:** `A2LuanLH_SE1910`

---

# MỤC LỤC
1. [PHẦN 1: BÀI THUYẾT TRÌNH MỞ ĐẦU (GIỚI THIỆU DỰ ÁN, CÔNG NGHỆ, KIẾN TRÚC & GIẢI PHÁP) - TIÊU CHÍ C1](#phần-1-bài-thuyết-trình-mở-đầu-giới-thiệu-dự-án-công-nghệ-kiến-trúc--giải-pháp---tiêu-chí-c1)
2. [PHẦN 2: THIẾT KẾ CƠ SỞ DỮ LIỆU & Ý NGHĨA TỪNG BẢNG, TỪNG CỘT](#phần-2-thiết-kế-cơ-sở-dữ-liệu--ý-nghĩa-từng-bảng-từng-cột)
3. [PHẦN 3: BẢNG GIẢI THÍCH CHI TIẾT TỪNG ANNOTATION, TỪNG BIẾN, TỪNG HÀM TRONG TOÀN BỘ CODEBASE - TIÊU CHÍ C4](#phần-3-bảng-giải-thích-chi-tiết-từng-annotation-từng-biến-từng-hàm-trong-toàn-bộ-codebase---tiêu-chí-c4)
4. [PHẦN 4: TRACE FLOW CHI TIẾT 22 LUỒNG CHỨC NĂNG (TOÀN BỘ HỆ THỐNG TỪ A - Z)](#phần-4-trace-flow-chi-tiết-22-luồng-chức-năng-toàn-bộ-hệ-thống-từ-a---z)
5. [PHẦN 5: BỘ CÂU HỎI "HỎI XOÁY ĐÁP XOAY" CỦA MENTOR & LIVE MODIFICATION](#phần-5-bộ-câu-hỏi-hỏi-xoáy-đáp-xoay-của-mentor--live-modification)
6. [PHẦN 6: KỊCH BẢN DEMO THỰC CHIẾN 5 PHÚT MƯỢT MÀ NHẤT](#phần-6-kịch-bản-demo-thực-chiến-5-phút-mượt-mà-nhất)

---

# PHẦN 1: BÀI THUYẾT TRÌNH MỞ ĐẦU (GIỚI THIỆU DỰ ÁN, CÔNG NGHỆ, KIẾN TRÚC & GIẢI PHÁP) - TIÊU CHÍ C1

*(Anh Luân hãy học thuộc hoặc nắm vững ý phần này để mở đầu buổi phỏng vấn khi mentor nói: "Em hãy giới thiệu tổng quan về bài làm của mình!")*

### 1. Giới thiệu bài toán (Problem Statement)
"Dạ em chào Thầy/Cô! Bài làm của em là **Assignment 02 môn SBA301 - FUNewsManagementSystem**.  
Đây là một **Hệ thống Quản lý Tin tức (News Management System - NMS)** được thiết kế cho các trường đại học và cơ sở giáo dục nhằm giải quyết bài toán:
- Quản lý quy trình sáng tạo, biên tập, phân loại và xuất bản tin tức học tập, công nghệ, sự kiện cho sinh viên.
- Phân quyền chặt chẽ giữa các đối tượng người dùng:
  1. **Khách vãng lai (Public Guest):** Đọc tin tức công khai đang hiển thị (`NewsStatus = 1`) mà **không cần đăng nhập**.
  2. **Quản trị viên (Admin - Role = 1):** Quản lý toàn bộ danh sách tài khoản người dùng trong hệ thống (CRUD + Search).
  3. **Nhân viên (Staff - Role = 2):** Quản lý danh mục tin tức (Category), tạo và biên tập bài viết (News Article) kèm gắn nhiều thẻ (Tags), quản lý hồ sơ cá nhân (Profile) và xem lại lịch sử bài viết của chính mình."

### 2. Các công nghệ sử dụng trong đồ án (Technology Stack)
- **Backend:** 
  - **Spring Boot 3 (Java 21):** Nền tảng xây dựng Web RESTful API hiện đại, nhúng sẵn máy chủ Apache Tomcat.
  - **Spring Data JPA & Hibernate:** ORM ánh xạ các bảng CSDL quan hệ sang đối tượng Java, loại bỏ việc viết lệnh SQL thủ công.
  - **Microsoft SQL Server JDBC Driver (`mssql-jdbc`):** Trình điều khiển kết nối mạng an toàn từ Java sang MS SQL Server.
  - **Hibernate Validator (`spring-boot-starter-validation`):** Bắt lỗi dữ liệu đầu vào (Data Validation) tuân thủ tiêu chí đề bài.
  - **Lombok:** Tự động sinh Getter, Setter, Constructor, Builder giúp code tinh gọn.
- **Frontend:**
  - **ReactJS (Vite):** Thư viện xây dựng giao diện người dùng Single Page Application (SPA) hiệu năng cao.
  - **Axios:** Thư viện gửi nhận HTTP Request/Response bất đồng bộ giữa Client và Server.
  - **React Router DOM v6:** Điều hướng trang web phía Client và bảo vệ đường dẫn (Protected Routes).
  - **Lucide React:** Bộ icon giao diện trực quan, hiện đại.
- **Database:**
  - **Microsoft SQL Server:** Hệ quản trị CSDL quan hệ lưu trữ bền vững (Persistence). Tên CSDL: `A2LuanLH_SE1910`.

### 3. Kiến trúc giải pháp (Architecture & Solution Design)
"Về mặt kiến trúc, em thiết kế hệ thống theo chuẩn **Mô hình 3 Lớp kết hợp Repository Pattern (3-Layer with Repository Architecture)**:
1. **Presentation Layer (ReactJS Client):** Tiếp nhận tương tác người dùng, hiển thị Popup Modal khi Tạo/Sửa, Confirm Dialog khi Xóa.
2. **Controller Layer (`@RestController`):** Nhận HTTP request từ React qua RESTful API, validate dữ liệu đầu vào qua DTO, chuyển tiếp xuống Service.
3. **Service Layer (`@Service`):** Trái tim của hệ thống - nơi chứa 100% các luật nghiệp vụ (Business Rules), đặc biệt là 2 ràng buộc cốt lõi:
   - *Chặn xóa tài khoản Admin nếu tài khoản đó đã từng tạo bài viết*.
   - *Chặn xóa danh mục Staff nếu danh mục đó đang chứa bài viết*.
4. **Data Access Layer (`@Repository`):** Tầng Spring Data JPA giao tiếp trực tiếp với database.
5. **Cơ chế Cross-Origin Resource Sharing (CORS):** Cấu hình mở cổng cho phép React (cổng 5173) gọi an toàn sang Spring Boot (cổng 8080)."

---

# PHẦN 2: THIẾT KẾ CƠ SỞ DỮ LIỆU & Ý NGHĨA TỪNG BẢNG, TỪNG CỘT

Cơ sở dữ liệu gồm **5 bảng** được thiết kế chuẩn hóa:

```
[SystemAccount] 1 ───────────< N [NewsArticle] N >─────────── 1 [Category]
       1                                1                                 1
       │ (UpdatedByID)                  │                                 │ (ParentCategoryID)
       └────────────────────────────────┘                                 └── Category (Self)
                                        │
                                        N
                                    [NewsTag]
                                        N
                                        │
                                        1
                                      [Tag]
```

### 1. Bảng `SystemAccount` (Tài khoản người dùng)
* `AccountID` (`INT IDENTITY(1,1)`, PK): Mã định danh tài khoản, tự tăng.
* `AccountName` (`NVARCHAR(100)`, NOT NULL): Tên hiển thị của người dùng.
* `AccountEmail` (`NVARCHAR(100)`, NOT NULL, UNIQUE): Email đăng nhập, không được phép trùng.
* `AccountRole` (`INT`, NOT NULL): Vai trò hệ thống (`1`: Admin, `2`: Staff).
* `AccountPassword` (`NVARCHAR(100)`, NOT NULL): Mật khẩu đăng nhập.

### 2. Bảng `Category` (Danh mục bài viết)
* `CategoryID` (`INT IDENTITY(1,1)`, PK): Mã danh mục, tự tăng.
* `CategoryName` (`NVARCHAR(100)`, NOT NULL): Tên danh mục (ví dụ: *Academic News, Technology*).
* `CategoryDesciption` (`NVARCHAR(255)`): Mô tả ngắn về danh mục.
* `ParentCategoryID` (`INT`, NULL, FK): Mã danh mục cha trỏ về chính cột `CategoryID` (quan hệ phân cấp cây thư mục cha/con).
* `IsActive` (`BIT`, NOT NULL, DEFAULT 1): Trạng thái hoạt động (`1`: Hoạt động, `0`: Tạm ẩn).

### 3. Bảng `Tag` (Thẻ bài viết)
* `TagID` (`INT IDENTITY(1,1)`, PK): Mã thẻ, tự tăng.
* `TagName` (`NVARCHAR(100)`, NOT NULL): Tên nhãn (ví dụ: *FPT University, AI, Tech*).
* `Note` (`NVARCHAR(255)`): Ghi chú bổ sung.

### 4. Bảng `NewsArticle` (Bài viết tin tức)
* `NewsArticleID` (`NVARCHAR(50)`, PK): Mã bài viết dạng chuỗi định danh (ví dụ: *NEWS001*).
* `NewsTitle` (`NVARCHAR(255)`, NOT NULL): Tiêu đề chính của bài báo.
* `Headline` (`NVARCHAR(255)`): Tiêu đề phụ hoặc phần mở đầu tóm tắt.
* `CreatedDate` (`DATETIME`, NOT NULL): Ngày giờ tạo bài viết (mặc định lấy `GETDATE()`).
* `NewsContent` (`NVARCHAR(MAX)`, NOT NULL): Nội dung chi tiết bài viết (dùng kiểu dữ liệu MAX để chứa văn bản dài).
* `NewsSource` (`NVARCHAR(255)`): Nguồn trích dẫn (ví dụ: *Phòng Đào Tạo, VnExpress*).
* `CategoryID` (`INT`, NOT NULL, FK): Khóa ngoại trỏ đến `Category(CategoryID)`.
* `NewsStatus` (`BIT`, NOT NULL, DEFAULT 1): Trạng thái (`1`: Active - Công khai cho khách xem, `0`: Inactive - Bản nháp).
* `CreatedByID` (`INT`, NOT NULL, FK): Khóa ngoại trỏ đến `SystemAccount(AccountID)` - Định danh ai là người viết bài này.
* `UpdatedByID` (`INT`, NULL, FK): Mã tài khoản của người chỉnh sửa bài viết gần nhất.
* `ModifiedDate` (`DATETIME`, NULL): Ngày giờ chỉnh sửa gần nhất.

### 5. Bảng trung gian `NewsTag` (Quan hệ Nhiều - Nhiều)
* `NewsArticleID` (`NVARCHAR(50)`, NOT NULL, FK): Trỏ đến bài viết (`ON DELETE CASCADE`).
* `TagID` (`INT`, NOT NULL, FK): Trỏ đến thẻ tag (`ON DELETE CASCADE`).
* Khóa chính kết hợp (Composite PK): `([NewsArticleID], [TagID])`.

---

# PHẦN 3: BẢNG GIẢI THÍCH CHI TIẾT TỪNG ANNOTATION, TỪNG BIẾN, TỪNG HÀM TRONG TOÀN BỘ CODEBASE - TIÊU CHÍ C4

*(Nếu Mentor chỉ ngón tay vào màn hình hỏi bất thình lình, đây là câu trả lời chính xác từng milimet)*

### 1. Bảng tra cứu các Annotation Backend (Spring Boot / JPA / Lombok / Validation)

| Annotation | Nằm ở đâu? | Ý nghĩa & Tác dụng chính xác |
|---|---|---|
| `@Entity` | Đầu các class Entity | Đánh dấu class này là đối tượng ánh xạ với một bảng trong CSDL (JPA quản lý). |
| `@Table(name = "...")` | Đầu các class Entity | Chỉ định tên bảng chính xác dưới CSDL (Ví dụ: `name = "SystemAccount"`). |
| `@Id` | Trên trường khóa chính | Xác định trường này là Primary Key của bảng. |
| `@GeneratedValue(strategy = IDENTITY)` | Trên trường khóa chính dạng số | Báo cho JPA biết khóa chính này do SQL Server tự tăng (`IDENTITY(1,1)`). |
| `@Column(name = "...", nullable = false, unique = true)` | Trên các trường thuộc tính | Khai báo tên cột, `nullable = false` (không được NULL), `unique = true` (không được trùng). |
| `@ManyToOne(fetch = FetchType.EAGER)` | Trên các trường liên kết khóa ngoại | Quan hệ Nhiều-Một. `EAGER` nghĩa là khi load bài viết thì load luôn thông tin Category đi kèm. |
| `@JoinColumn(name = "CategoryID")` | Dưới `@ManyToOne` | Chỉ định tên cột khóa ngoại (Foreign Key) lưu trữ trong bảng hiện tại. |
| `@ManyToMany` | Trên trường `Set<Tag> tags` | Quan hệ Nhiều-Nhiều giữa `NewsArticle` và `Tag`. |
| `@JoinTable(name = "NewsTag", ...)` | Dưới `@ManyToMany` | Chỉ định bảng trung gian `NewsTag`, cột liên kết `NewsArticleID` và `TagID`. |
| `@Lob` | Trên trường `newsContent` | Khai báo trường này chứa dữ liệu lớn (Large Object - `NVARCHAR(MAX)`). |
| `@JsonFormat(pattern = "...")` | Trên trường ngày tháng | Định dạng chuỗi ngày tháng khi xuất ra JSON (`yyyy-MM-dd HH:mm:ss`). |
| `@JsonIgnoreProperties` | Trên trường `parentCategory` | Chặn đệ quy vô tận khi chuyển Category cha/con sang JSON. |
| `@Repository` | Đầu interface Repository | Đánh dấu tầng truy cập dữ liệu (DAO). |
| `@Service` | Đầu class Service | Đánh dấu tầng xử lý nghiệp vụ kinh doanh (Business Logic). |
| `@Transactional` | Trên các hàm thêm/sửa/xóa | Đảm bảo tính toàn vẹn dữ liệu (ACID). Nếu xảy ra lỗi giữa chừng, tự động **Rollback** dữ liệu. |
| `@RestController` | Đầu class Controller | Kết hợp `@Controller` + `@ResponseBody`. Kết quả hàm tự động chuyển thành chuỗi JSON. |
| `@RequestMapping("/api/...")` | Đầu class Controller | Tiền tố đường dẫn URL dùng chung cho toàn bộ các API trong file đó. |
| `@GetMapping` / `@PostMapping` / `@PutMapping` / `@DeleteMapping` | Trên các hàm trong Controller | Định nghĩa phương thức HTTP tương ứng: GET (đọc), POST (tạo), PUT (sửa), DELETE (xóa). |
| `@PathVariable` | Trong tham số hàm Controller | Lấy giá trị biến trên URL (ví dụ: `/api/accounts/{id}`). |
| `@RequestParam` | Trong tham số hàm Controller | Lấy tham số truy vấn sau dấu `?` (ví dụ: `/api/accounts?search=admin`). |
| `@RequestBody` | Trong tham số hàm Controller | Đọc dữ liệu JSON gửi trong thân Request (Body) và ép kiểu thành đối tượng Java DTO. |
| `@Valid` | Trước `@RequestBody` | Kích hoạt bộ kiểm tra lỗi tự động theo các luật trong DTO (`@NotBlank`, `@Email`...). |
| `@RestControllerAdvice` | Đầu class `GlobalExceptionHandler` | Bộ bắt lỗi toàn cục của ứng dụng. Bắt mọi Exception ném ra từ Controller/Service. |
| `@ExceptionHandler(RuntimeException.class)` | Trong `GlobalExceptionHandler` | Bắt riêng lỗi nghiệp vụ (như chặn xóa) và trả về HTTP 400 Bad Request. |
| `@Getter` / `@Setter` | Đầu class (Lombok) | Tự động sinh mã nguồn hàm getter và setter. |
| `@NoArgsConstructor` / `@AllArgsConstructor` | Đầu class (Lombok) | Tự sinh constructor rỗng và constructor đầy đủ tham số. |
| `@Builder` | Đầu class (Lombok) | Cung cấp Builder Pattern để khởi tạo đối tượng nhanh. |
| `@RequiredArgsConstructor` | Đầu class Service/Controller | Tự sinh Constructor chứa các biến `final` để Spring Boot tiêm phụ thuộc (DI). |
| `@NotBlank(message = "...")` | Trong DTO | Kiểm tra chuỗi không được null, không được rỗng `""`. |
| `@Email(message = "...")` | Trong DTO | Bắt buộc phải đúng định dạng email (có `@` và tên miền). |
| `@NotNull` | Trong DTO | Không được mang giá trị null. |
| `@Min(1)` / `@Max(2)` | Trong DTO | Giới hạn khoảng giá trị hợp lệ cho `AccountRole` (chỉ 1 hoặc 2). |

---

### 2. Bảng tra cứu các Hàm then chốt trong Backend

* **`newsArticleRepository.countByCreatedBy_AccountId(id)`**:
  - *Ý nghĩa:* Gọi lệnh SQL `SELECT COUNT(*) FROM NewsArticle WHERE CreatedByID = ?`.
  - *Mục đích:* Đếm số lượng bài viết do tài khoản `id` tạo ra để làm căn cứ chặn xóa tài khoản.
* **`newsArticleRepository.countByCategory_CategoryId(id)`**:
  - *Ý nghĩa:* Gọi lệnh SQL `SELECT COUNT(*) FROM NewsArticle WHERE CategoryID = ?`.
  - *Mục đích:* Đếm số lượng bài viết thuộc về danh mục `id` để làm căn cứ chặn xóa danh mục.
* **`newsArticleRepository.findByNewsStatusTrueOrderByCreatedDateDesc()`**:
  - *Ý nghĩa:* Gọi lệnh SQL `SELECT * FROM NewsArticle WHERE NewsStatus = 1 ORDER BY CreatedDate DESC`.
  - *Mục đích:* Lấy tất cả bài viết Active cho khách xem, sắp xếp bài mới nhất lên trên.
* **`newsArticleRepository.findByCreatedBy_AccountIdOrderByCreatedDateDesc(staffId)`**:
  - *Ý nghĩa:* Lấy toàn bộ lịch sử bài viết của riêng nhân viên đang đăng nhập.

---

### 3. Bảng tra cứu các Thành phần then chốt trong ReactJS Frontend

* **`useState`**: Hook quản lý trạng thái cục bộ của component (Ví dụ: lưu danh sách `accounts`, lưu dữ liệu form `formData`, bật/tắt modal `isModalOpen`).
* **`useEffect`**: Hook vòng đời, chạy hàm tải dữ liệu (`fetchAccounts()`) ngay khi trang web được tải lần đầu.
* **`useNavigate`**: Hook điều hướng chuyển trang mà không cần tải lại toàn bộ trang web (Ví dụ: `navigate('/admin/accounts')`).
* **`useAuth()` / `AuthContext`**: Cung cấp trạng thái đăng nhập toàn cục (`user`, `isAdmin`, `isStaff`, hàm `login()`, hàm `logout()`).
* **`axiosClient.js`**: Cấu hình Axios tập trung (baseURL `http://localhost:8080/api`, bọc lỗi trả về thành chuỗi tiếng Anh dễ đọc).
* **`Modal.jsx`**: Component Popup Dialog tạo cửa sổ nổi đè lên màn hình với nền mờ (Overlay) dùng cho thao tác Create và Update.
* **`ConfirmModal.jsx`**: Component hộp thoại xác nhận cảnh báo dùng riêng cho thao tác Delete.

---

# PHẦN 4: TRACE FLOW CHI TIẾT 22 LUỒNG CHỨC NĂNG (TOÀN BỘ HỆ THỐNG TỪ A - Z)

*(Mỗi luồng được viết chuẩn 8 bước theo tài liệu Student Interview Guide của FPT)*

---

## NHÓM 1: KHÁCH VÃNG LAI (PUBLIC GUEST - KHÔNG CẦN LOGIN)

### Luồng 1: Khách xem danh sách bài viết Active tại Trang Chủ
1. **Purpose:** Người dùng vãng lai vào website đọc các tin tức đã được duyệt công khai.
2. **Trigger:** Truy cập đường dẫn `http://localhost:5173/` (`HomePage.jsx`).
3. **Input:** Không có tham số đầu vào.
4. **Client Request:** `newsApi.getPublic('')` gửi `GET http://localhost:8080/api/news/public`.
5. **Controller:** `NewsArticleController.getPublicNews()` tiếp nhận.
6. **Processing (Service & Repo):** 
   - `NewsArticleService.getPublicActiveNews(null)` gọi `newsArticleRepository.findByNewsStatusTrueOrderByCreatedDateDesc()`.
   - SQL thực thi: `SELECT * FROM NewsArticle WHERE NewsStatus = 1 ORDER BY CreatedDate DESC`.
7. **Output:** Trả về danh sách bài viết Active. React lưu vào state `newsList` và hiển thị dạng lưới thẻ (Cards).
8. **Failure Path:** Nếu mất kết nối DB, React bắt lỗi và hiện thông báo lỗi.

### Luồng 2: Khách tìm kiếm bài viết Active theo Tiêu đề
1. **Purpose:** Tìm kiếm tin tức công khai theo từ khóa.
2. **Trigger:** Khách gõ từ khóa vào ô Search ở trang chủ và bấm **"Search"**.
3. **Input:** Chuỗi từ khóa trong state `search` (Ví dụ: `"AI"`).
4. **Client Request:** `GET http://localhost:8080/api/news/public?search=AI`.
5. **Controller:** `NewsArticleController.getPublicNews(@RequestParam String search)`.
6. **Processing:** `newsArticleRepository.findByNewsStatusTrueAndNewsTitleContainingIgnoreCaseOrderByCreatedDateDesc("AI")`.
7. **Output:** Trả về các bài viết vừa Active vừa có chứa chữ "AI" trong tiêu đề.
8. **Failure Path:** Không tìm thấy $\rightarrow$ React hiển thị dòng chữ: *"No active news articles found"*.

### Luồng 3: Khách bấm "Read More" xem toàn văn bài viết
1. **Purpose:** Xem chi tiết nội dung, danh mục, tác giả và danh sách các Tags của bài viết.
2. **Trigger:** Bấm nút **"Read More"** trên một card bài viết.
3. **Input:** Toàn bộ đối tượng bài viết `article`.
4. **Processing (Client State):** Gọi `setSelectedNews(article)` $\rightarrow$ Kích hoạt `<Modal isOpen={true}>`.
5. **Output:** Cửa sổ Popup Modal bật lên hiển thị tiêu đề, headline, ngày tạo, tác giả, toàn văn bài viết và danh sách các thẻ `#{tagName}`.

---

## NHÓM 2: XÁC THỰC & ĐIỀU HƯỚNG (AUTHENTICATION)

### Luồng 4: Đăng nhập hệ thống (Phân luồng Admin vs Staff)
1. **Purpose:** Xác thực tài khoản bằng Email & Mật khẩu và điều hướng đúng phân hệ.
2. **Trigger:** Nhập Email, Password tại `LoginPage.jsx` $\rightarrow$ Bấm **"Sign In"**.
3. **Input:** `LoginRequest` gồm `{ email, password }`.
4. **Client Request:** `POST http://localhost:8080/api/auth/login`.
5. **Controller:** `AuthController.login(@Valid @RequestBody LoginRequest request)`.
6. **Processing (AuthService):**
   - Tìm account: `accountRepository.findByAccountEmail(email)`. Nếu không có $\rightarrow$ ném `RuntimeException("Email does not exist in the system")`.
   - Kiểm tra password: `if (!account.getAccountPassword().equals(password))` $\rightarrow$ ném `RuntimeException("Invalid password")`.
   - Xác định vai trò: `Role = 1` là `"Admin"`, `Role = 2` là `"Staff"`.
   - Đóng gói trả về `LoginResponse` (không gửi kèm mật khẩu).
7. **Output:** 
   - `AuthContext` lưu user vào `localStorage`.
   - Nếu `accountRole === 1` $\rightarrow$ `navigate('/admin/accounts')`.
   - Nếu `accountRole === 2` $\rightarrow$ `navigate('/staff/news')`.
8. **Failure Path:** Nếu sai email/pass, mã lỗi 400 trả về và khung màu đỏ cảnh báo trên trang Login.

### Luồng 5: Đăng xuất hệ thống (Logout)
1. **Purpose:** Xóa phiên làm việc hiện tại và quay về màn hình Login.
2. **Trigger:** Bấm nút **"Logout"** trên thanh Navbar.
3. **Processing (Client):** Gọi hàm `logout()` trong `AuthContext` $\rightarrow$ xóa key `funews_user` khỏi `localStorage`, đặt `user = null`.
4. **Output:** `navigate('/login')` đưa người dùng về lại màn hình đăng nhập.

---

## NHÓM 3: ADMIN - QUẢN LÝ TÀI KHOẢN (ACCOUNT MANAGEMENT)

### Luồng 6: Admin xem danh sách toàn bộ tài khoản
1. **Purpose:** Hiển thị danh sách tất cả tài khoản trong hệ thống kèm vai trò.
2. **Trigger:** Admin truy cập `/admin/accounts` (`AccountManagementPage.jsx`).
3. **Client Request:** `GET http://localhost:8080/api/accounts`.
4. **Controller:** `AccountController.getAllAccounts(null)`.
5. **Processing:** `accountRepository.findAll()`.
6. **Output:** Bảng dữ liệu hiển thị ID, Name, Email, Huy hiệu Role (Admin màu đỏ, Staff màu xanh), các nút Edit và Delete.

### Luồng 7: Admin tìm kiếm tài khoản theo Tên hoặc Email
1. **Purpose:** Lọc nhanh tài khoản theo từ khóa.
2. **Trigger:** Gõ từ khóa vào ô Search $\rightarrow$ Bấm nút **"Search"**.
3. **Client Request:** `GET http://localhost:8080/api/accounts?search={keyword}`.
4. **Processing:** `accountRepository.findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(...)`.
5. **Output:** Bảng cập nhật danh sách các tài khoản thỏa mãn điều kiện.

### Luồng 8: Admin tạo mới tài khoản (Create Modal)
1. **Purpose:** Thêm tài khoản Admin hoặc Staff mới vào hệ thống.
2. **Trigger:** Bấm nút **"+ Add New Account"** $\rightarrow$ Popup Modal mở ra $\rightarrow$ Điền Form $\rightarrow$ Bấm **"Create Account"**.
3. **Input:** `AccountRequest` gồm `{ accountName, accountEmail, accountRole, accountPassword }`.
4. **Validation (Client & Server):** Tên không rỗng, Email đúng định dạng, Role là 1 hoặc 2.
5. **Client Request:** `POST http://localhost:8080/api/accounts`.
6. **Processing (AccountService):**
   - Kiểm tra email: `if (accountRepository.findByAccountEmail(...).isPresent())` $\rightarrow$ Ném lỗi `"Email already in use"`.
   - Nếu mật khẩu để trống $\rightarrow$ gán mặc định `"123456"`.
   - Lưu: `accountRepository.save(account)`.
7. **Output:** Đóng Modal, hiện thông báo xanh *"Account created successfully!"*, nạp lại bảng.

### Luồng 9: Admin chỉnh sửa thông tin tài khoản (Update Modal)
1. **Purpose:** Cập nhật thông tin họ tên, email, vai trò hoặc mật khẩu mới.
2. **Trigger:** Bấm nút **"Edit"** tại 1 dòng $\rightarrow$ Modal mở ra với dữ liệu cũ điền sẵn $\rightarrow$ Sửa $\rightarrow$ Bấm **"Update Account"**.
3. **Client Request:** `PUT http://localhost:8080/api/accounts/{id}` kèm body DTO.
4. **Processing (AccountService):**
   - Kiểm tra nếu đổi email thì email mới không được trùng với tài khoản khác.
   - Cập nhật các trường. Nếu có nhập mật khẩu mới thì cập nhật mật khẩu.
   - Lưu: `accountRepository.save(existing)`.
5. **Output:** Đóng Modal, cập nhật bảng, báo thành công.

### Luồng 10: Admin xóa tài khoản (Delete Confirm & Ràng buộc cốt lõi)
1. **Purpose:** Xóa tài khoản, nhưng **chặn xóa nếu tài khoản này đã từng viết bài báo**.
2. **Trigger:** Bấm nút **"Delete"** màu đỏ $\rightarrow$ Hộp thoại `ConfirmModal` hiện lên cảnh báo $\rightarrow$ Bấm **"Confirm Delete"**.
3. **Client Request:** `DELETE http://localhost:8080/api/accounts/{id}`.
4. **Controller:** `AccountController.deleteAccount(@PathVariable Integer id)`.
5. **Processing (AccountService - Trọng tâm C4):**
   ```java
   long articleCount = newsArticleRepository.countByCreatedBy_AccountId(id);
   if (articleCount > 0) {
       throw new RuntimeException("Cannot delete account: This account has already created " 
               + articleCount + " news article(s)!");
   }
   accountRepository.delete(account);
   ```
6. **Failure Path:** Nếu tài khoản đã tạo bài viết (`articleCount > 0`) $\rightarrow$ Ném `RuntimeException` $\rightarrow$ `GlobalExceptionHandler` trả về HTTP 400 $\rightarrow$ React hiển thị banner cảnh báo đỏ: *"Cannot delete account: This account has already created..."*.
7. **Success Path:** Nếu chưa viết bài nào (`articleCount == 0`) $\rightarrow$ Xóa thành công, dòng đó biến mất khỏi bảng.

---

## NHÓM 4: STAFF - QUẢN LÝ DANH MỤC (CATEGORY MANAGEMENT)

### Luồng 11: Staff xem danh sách toàn bộ danh mục
1. **Purpose:** Xem danh mục, mô tả, danh mục cha và trạng thái Active/Inactive.
2. **Trigger:** Bấm menu **"Categories"** (`CategoryManagementPage.jsx`).
3. **Client Request:** `GET http://localhost:8080/api/categories`.
4. **Controller:** `CategoryController.getAllCategories(null)`.
5. **Processing:** `categoryRepository.findAll()`.
6. **Output:** Hiển thị bảng danh mục đầy đủ.

### Luồng 12: Staff tìm kiếm danh mục theo Tên
1. **Purpose:** Lọc danh mục theo từ khóa.
2. **Trigger:** Nhập từ khóa ô Search $\rightarrow$ Bấm **"Search"**.
3. **Client Request:** `GET http://localhost:8080/api/categories?search={keyword}`.
4. **Processing:** `categoryRepository.findByCategoryNameContainingIgnoreCase(keyword)`.
5. **Output:** Cập nhật bảng kết quả tìm kiếm.

### Luồng 13: Staff tạo mới danh mục (Create Modal)
1. **Purpose:** Thêm danh mục bài viết mới, có thể chọn danh mục cha.
2. **Trigger:** Bấm nút **"+ Add New Category"** $\rightarrow$ Điền Form Modal $\rightarrow$ Bấm **"Create Category"**.
3. **Input:** `{ categoryName, categoryDesciption, parentCategoryId, isActive }`.
4. **Client Request:** `POST http://localhost:8080/api/categories`.
5. **Processing (CategoryService):**
   - Nếu có chọn `parentCategoryId`, tìm Category cha trong CSDL và gán vào quan hệ.
   - Lưu: `categoryRepository.save(category)`.
6. **Output:** Đóng Modal, báo thành công, nạp lại danh sách.

### Luồng 14: Staff chỉnh sửa danh mục (Update Modal)
1. **Purpose:** Sửa tên, mô tả, đổi danh mục cha hoặc đổi trạng thái Active/Inactive.
2. **Trigger:** Bấm nút **"Edit"** $\rightarrow$ Sửa dữ liệu $\rightarrow$ Bấm **"Update Category"**.
3. **Client Request:** `PUT http://localhost:8080/api/categories/{id}`.
4. **Processing:** Cập nhật dữ liệu vào bản ghi CSDL.
5. **Output:** Đóng Modal, nạp lại bảng.

### Luồng 15: Staff xóa danh mục (Delete Confirm & Ràng buộc cốt lõi)
1. **Purpose:** Xóa danh mục, nhưng **chặn xóa nếu danh mục đang chứa bài viết**.
2. **Trigger:** Bấm **"Delete"** $\rightarrow$ Hộp thoại Confirm hiện lên $\rightarrow$ Bấm **"Confirm Delete"**.
3. **Client Request:** `DELETE http://localhost:8080/api/categories/{id}`.
4. **Processing (CategoryService - Trọng tâm C4):**
   ```java
   long articleCount = newsArticleRepository.countByCategory_CategoryId(id);
   if (articleCount > 0) {
       throw new RuntimeException("Cannot delete category: There are " 
               + articleCount + " news article(s) assigned to this category!");
   }
   categoryRepository.delete(category);
   ```
5. **Failure Path:** Nếu danh mục đã có bài viết $\rightarrow$ Chặn lại, ném HTTP 400 $\rightarrow$ React hiển thị banner màu đỏ cảnh báo.
6. **Success Path:** Nếu là danh mục trống $\rightarrow$ Xóa thành công.

---

## NHÓM 5: STAFF - QUẢN LÝ BÀI VIẾT TIN TỨC (NEWS ARTICLE MANAGEMENT)

### Luồng 16: Staff xem danh sách toàn bộ bài viết
1. **Purpose:** Xem tất cả bài viết trong hệ thống (cả Active lẫn Inactive) kèm Category, Author, Tags.
2. **Trigger:** Bấm menu **"Articles"** (`NewsManagementPage.jsx`).
3. **Client Request:** `GET http://localhost:8080/api/news`.
4. **Processing:** `newsArticleRepository.findAll()`.
5. **Output:** Bảng danh sách bài viết chi tiết.

### Luồng 17: Staff tìm kiếm bài viết theo Tiêu đề
1. **Purpose:** Tìm kiếm bài viết trong trang quản trị.
2. **Trigger:** Nhập từ khóa ô Search $\rightarrow$ Bấm **"Search"**.
3. **Client Request:** `GET http://localhost:8080/api/news?search={keyword}`.
4. **Processing:** `newsArticleRepository.findByNewsTitleContainingIgnoreCaseOrderByCreatedDateDesc(keyword)`.
5. **Output:** Cập nhật danh sách bài viết.

### Luồng 18: Staff tạo mới bài viết (Create Modal + Gán Tags)
1. **Purpose:** Tạo một bài viết mới, gán vào 1 Category và chọn nhiều Tags.
2. **Trigger:** Bấm **"+ Create News Article"** $\rightarrow$ Điền Form Modal $\rightarrow$ Tích chọn các checkbox Tags $\rightarrow$ Bấm **"Create Article"**.
3. **Input:** `{ newsArticleId, newsTitle, headline, newsContent, newsSource, categoryId, newsStatus, tagIds: [1, 2] }`.
4. **Client Request:** `POST http://localhost:8080/api/news?staffId={staffId}`.
5. **Processing (NewsArticleService):**
   - Kiểm tra `newsArticleRepository.existsById(newsArticleId)` xem ID đã tồn tại chưa.
   - Tìm Category: `categoryRepository.findById(categoryId)`.
   - Tìm Author: `accountRepository.findById(staffId)`.
   - Tìm danh sách Tags: `tagRepository.findAllById(tagIds)`.
   - Gán `createdDate = LocalDateTime.now()`, `updatedById = staffId`.
   - Lưu: `newsArticleRepository.save(article)`. Hibernate tự động chèn các dòng vào bảng trung gian `NewsTag`.
6. **Output:** Đóng Modal, báo thành công xanh, cập nhật bảng.

### Luồng 19: Staff chỉnh sửa bài viết (Update Modal)
1. **Purpose:** Sửa nội dung bài viết, đổi Category, đổi Tags, đổi trạng thái Active/Inactive.
2. **Trigger:** Bấm nút **"Edit"** trên dòng bài viết $\rightarrow$ Sửa $\rightarrow$ Bấm **"Update Article"**.
3. **Client Request:** `PUT http://localhost:8080/api/news/{id}?staffId={staffId}`.
4. **Processing (NewsArticleService):**
   - Cập nhật các trường thông tin.
   - Gán `modifiedDate = LocalDateTime.now()` (lưu vết thời gian chỉnh sửa gần nhất).
   - Gán `updatedById = staffId` (lưu vết ai là người sửa gần nhất).
   - Cập nhật lại danh sách `Set<Tag>`.
   - Lưu: `newsArticleRepository.save(existing)`.
5. **Output:** Đóng Modal, cập nhật bảng.

### Luồng 20: Staff xóa bài viết (Delete Confirm)
1. **Purpose:** Xóa hoàn toàn một bài viết.
2. **Trigger:** Bấm **"Delete"** $\rightarrow$ Hộp thoại Confirm hiện lên $\rightarrow$ Bấm **"Confirm Delete"**.
3. **Client Request:** `DELETE http://localhost:8080/api/news/{id}`.
4. **Processing:** `newsArticleRepository.delete(article)`. Nhờ cơ chế `ON DELETE CASCADE` ở khóa ngoại CSDL, các dòng liên kết tương ứng trong bảng `NewsTag` tự động được dọn dẹp sạch sẽ.
5. **Output:** Bài viết biến mất khỏi danh sách.

---

## NHÓM 6: STAFF - HỒ SƠ CÁ NHÂN & LỊCH SỬ VIẾT BÀI

### Luồng 21: Staff xem lịch sử bài viết của chính mình (My Articles)
1. **Purpose:** Đề bài yêu cầu: *"View news history created by him/her"*.
2. **Trigger:** Bấm menu **"My Articles"** (`HistoryNewsPage.jsx`).
3. **Input:** `user.accountId` lấy từ `AuthContext`.
4. **Client Request:** `GET http://localhost:8080/api/news/history?staffId={accountId}`.
5. **Controller:** `NewsArticleController.getStaffHistory(@RequestParam Integer staffId)`.
6. **Processing (NewsArticleService):**
   - Gọi `newsArticleRepository.findByCreatedBy_AccountIdOrderByCreatedDateDesc(staffId)`.
   - SQL: `SELECT * FROM NewsArticle WHERE CreatedByID = ? ORDER BY CreatedDate DESC`.
7. **Output:** Bảng chỉ hiển thị đúng các bài viết do chính nhân viên này là tác giả.

### Luồng 22: Staff quản lý hồ sơ cá nhân & đổi mật khẩu (Profile)
1. **Purpose:** Nhân viên xem và tự cập nhật họ tên, email hoặc đổi mật khẩu cá nhân.
2. **Trigger:** Bấm menu **"Profile"** (`ProfilePage.jsx`) $\rightarrow$ Sửa thông tin $\rightarrow$ Bấm **"Save Profile Changes"**.
3. **Input:** `{ accountName, accountEmail, oldPassword, newPassword }`.
4. **Client Request:** `PUT http://localhost:8080/api/accounts/{id}/profile`.
5. **Processing (AccountService):**
   - Kiểm tra trùng Email.
   - Nếu có nhập `newPassword` $\rightarrow$ Bắt buộc kiểm tra `oldPassword` có khớp với mật khẩu hiện tại trong DB không (`account.getAccountPassword().equals(...)`). Nếu sai $\rightarrow$ Ném lỗi `"Current password does not match"`.
   - Cập nhật thông tin và lưu vào CSDL.
6. **Output:** Cập nhật lại thông tin hiển thị trên Navbar thông qua `updateUser()` trong `AuthContext`.

---

# PHẦN 5: BỘ CÂU HỎI "HỎI XOÁY ĐÁP XOAY" CỦA MENTOR & LIVE MODIFICATION

### Câu 1: "Tại sao em dùng DTO (như AccountRequest, LoginRequest) thay vì hứng trực tiếp bằng Entity SystemAccount?"
* **Trả lời:**
  1. **Bảo mật tuyệt đối (Ngăn Over-posting Attack):** Nếu hứng trực tiếp bằng Entity, người dùng xấu có thể gửi lén các trường không được phép sửa (như tự ý đổi `accountId` hoặc tự phong quyền `accountRole = 1`).
  2. **Tách biệt dữ liệu:** Khi đăng nhập, ta chỉ cần 2 trường `email` và `password`, không cần cả cục Entity 5 trường. Khi trả kết quả về, DTO `LoginResponse` tuyệt đối **không chứa mật khẩu** (`AccountPassword`), bảo vệ an toàn cho người dùng.
  3. **Validation độc lập:** Ta có thể đặt các luật kiểm tra `@NotBlank`, `@Email` trên DTO mà không làm ảnh hưởng đến Entity CSDL.

### Câu 2: "Tại sao hàm xóa lại quăng RuntimeException mà không trả về chuỗi thông báo lỗi bình thường?"
* **Trả lời:**
  * Việc ném `RuntimeException` kết hợp với `@Transactional` sẽ kích hoạt cơ chế **Rollback** tự động của Spring, đảm bảo không có giao dịch dở dang nào được lưu xuống CSDL.
  * Lớp `@RestControllerAdvice` trong file [`GlobalExceptionHandler.java`](file:///d:/SBA301/Assigment/A2LuanLH_SE1910_BE/src/main/java/com/fpt/funews/exception/GlobalExceptionHandler.java) sẽ tự động bắt lấy `RuntimeException`, chuyển thành mã trạng thái HTTP chuẩn RESTful là `400 Bad Request` kèm theo câu thông báo lỗi dạng JSON cho React.

### Câu 3: "CORS là gì và tại sao trong bài này bắt buộc phải có file CorsConfig?"
* **Trả lời:**
  * CORS (*Cross-Origin Resource Sharing*) là chính sách bảo mật Same-Origin của trình duyệt web.
  * Trong dự án này, Frontend chạy ở `http://localhost:5173`, còn Backend chạy ở `http://localhost:8080` (khác cổng).
  * Nếu không có file [`CorsConfig.java`](file:///d:/SBA301/Assigment/A2LuanLH_SE1910_BE/src/main/java/com/fpt/funews/config/CorsConfig.java) khai báo `.allowedOriginPatterns("*")` và `.allowedMethods("GET", "POST", "PUT", "DELETE")`, trình duyệt sẽ ngay lập tức chặn đứng mọi cuộc gọi API của Axios và báo lỗi đỏ ngầu trên Console.

### Câu 4: "Live Modification: Nếu bây giờ thầy yêu cầu thêm trường 'Số điện thoại (Phone)' vào tài khoản SystemAccount, em sẽ sửa những file nào?"
* **Trả lời dõng dạc 5 bước Change Impact:**
  1. **Database:** Mở SSMS chạy lệnh: `ALTER TABLE SystemAccount ADD Phone NVARCHAR(20) NULL;`.
  2. **Entity:** Trong [`SystemAccount.java`](file:///d:/SBA301/Assigment/A2LuanLH_SE1910_BE/src/main/java/com/fpt/funews/entity/SystemAccount.java), thêm:
     ```java
     @Column(name = "Phone", length = 20)
     private String phone;
     ```
  3. **DTO:** Trong [`AccountRequest.java`](file:///d:/SBA301/Assigment/A2LuanLH_SE1910_BE/src/main/java/com/fpt/funews/dto/AccountRequest.java), thêm trường `private String phone;`.
  4. **Service:** Trong [`AccountService.java`](file:///d:/SBA301/Assigment/A2LuanLH_SE1910_BE/src/main/java/com/fpt/funews/service/AccountService.java), gán `existing.setPhone(request.getPhone());` ở hàm create và update.
  5. **Frontend:** Trong [`AccountManagementPage.jsx`](file:///d:/SBA301/Assigment/A2LuanLH_SE1910_FE/src/pages/admin/AccountManagementPage.jsx), thêm ô nhập `<input name="phone">` vào Modal và thêm 1 cột `<th>Phone</th>` vào bảng.

---

# PHẦN 6: KỊCH BẢN DEMO THỰC CHIẾN 5 PHÚT MƯỢT MÀ NHẤT

Khi Mentor bảo: *"Em hãy demo các chức năng chính của hệ thống trong 3-5 phút"*, anh làm đúng thứ tự 5 cảnh sau:

* **Cảnh 1: Khách vãng lai xem tin tức (Public)**
  - Đang ở trang chủ `http://localhost:5173/`.
  - Giới thiệu: *"Thưa Thầy/Cô, khi chưa đăng nhập, em là khách vãng lai chỉ xem được các bài viết đang Active (NewsStatus = 1)"*.
  - Gõ thử ô Search tìm kiếm bài viết.
  - Bấm **Read More** bật Popup xem chi tiết tin tức.

* **Cảnh 2: Đăng nhập quyền Admin (Role = 1)**
  - Bấm **Login** góc trên bên phải.
  - Nhập: `admin@funews.com` / `admin123`.
  - Hệ thống tự động chuyển vào `/admin/accounts`.
  - Bấm **"+ Add New Account"** bật Modal tạo thử 1 tài khoản mới.
  - Bấm **Edit** sửa thông tin 1 tài khoản.
  - 👉 **ĐIỂM NHẤN ĂN ĐIỂM:** Thử xóa tài khoản **Staff 1 (`luanlh@funews.com`)** $\rightarrow$ Hộp thoại Confirm hiện lên $\rightarrow$ Bấm Delete $\rightarrow$ **Khung đỏ hiện lên chặn lại ngay vì Staff 1 đã tạo 3 bài viết**.
  - Thử xóa tài khoản **Staff 2 (`staff2@funews.com`)** $\rightarrow$ Xóa thành công vì chưa tạo bài viết nào.

* **Cảnh 3: Đăng nhập quyền Staff (Role = 2)**
  - Bấm **Logout**, đăng nhập lại: `luanlh@funews.com` / `staff123`.
  - Hệ thống tự động chuyển vào màn hình viết bài `/staff/news`.

* **Cảnh 4: Demo quản lý Danh mục (Categories)**
  - Bấm tab **Categories**.
  - 👉 **ĐIỂM NHẤN ĂN ĐIỂM:** Thử xóa danh mục số 1 **`Academic News`** $\rightarrow$ **Bị chặn lại vì đang chứa bài viết**.
  - Thử xóa danh mục số 4 **`Archived Category`** $\rightarrow$ Xóa thành công vì là danh mục rỗng.

* **Cảnh 5: Demo Lịch sử bài viết & Hồ sơ cá nhân**
  - Bấm tab **Articles** $\rightarrow$ Bấm **"+ Create News Article"** tạo 1 bài viết mới kèm tích chọn các Tags.
  - Bấm tab **My Articles** $\rightarrow$ Chứng minh hệ thống chỉ lọc đúng các bài do chính tài khoản `Le Huu Luan` tạo ra.
  - Bấm tab **Profile** $\rightarrow$ Xem thông tin và đổi mật khẩu cá nhân.

---
**KẾT THÚC THUYẾT TRÌNH:** *"Dạ thưa Thầy/Cô, phần trình bày tổng quan và demo chức năng của em đến đây là hoàn thành. Em kính mời Thầy/Cô đặt câu hỏi về code để em làm rõ thêm ạ!"*
