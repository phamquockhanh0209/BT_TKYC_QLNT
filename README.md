# QLNT_TKYC — HỆ THỐNG QUẢN LÝ NGOẠI TRÚ SINH VIÊN
> **AI / DEVELOPER COMPREHENSIVE KNOWLEDGE BASE & WORKFLOW SPECIFICATION**  
> *Tài liệu này chứa toàn bộ kiến trúc, luồng nghiệp vụ, danh mục chức năng, quy tắc dữ liệu và các lưu ý kỹ thuật sống còn để mọi AI hoặc Lập trình viên đọc hiểu ngay 100% hệ thống mà không cần đọc lại toàn bộ mã nguồn.*

---

## 1. TỔNG QUAN HỆ THỐNG & CÔNG NGHỆ SỬ DỤNG

Hệ thống **QLNT_TKYC** quản lý khép kín toàn bộ vòng đời cư trú ngoại trú của sinh viên: từ khai báo, nộp hồ sơ, tải 4 loại giấy tờ minh chứng, sơ duyệt tiếp nhận, thẩm định chuyên sâu, phê duyệt kích hoạt, quản lý các yêu cầu phát sinh (gia hạn, đổi trọ, kết thúc), theo dõi SLA (48h/72h), cảnh báo trễ hạn (Escalation), tự động hóa quét hết hạn cư trú và ghi nhật ký kiểm toán tập trung (`AUDIT_LOG`).

### Công nghệ cốt lõi (Tech Stack):
- **Cơ sở dữ liệu:** Microsoft SQL Server (`QLNT_TKYC`) với ràng buộc `CHECK Constraints`, `Filtered Unique Index` cho CCCD chủ trọ, và giao dịch `Database.BeginTransactionAsync()` đảm bảo tính ACID.
- **Backend:** .NET 8.0 Web API, Entity Framework Core 8, JWT Authentication (HMAC-SHA256), `BackgroundService` chạy nền (`SystemSchedulerService`).
- **Frontend:** React 18, Vite, React Router v6, TailwindCSS, Bootstrap Modals, Lucide React Icons.
- **Kiến trúc:** Clean / Layered Architecture (`Controllers` ➔ `Services` ➔ `Data/AppDbContext` ➔ `Models` ➔ `DTOs`).
- **Bảo mật & Phân quyền:** RBAC (Role-Based Access Control) đa tầng từ Router Frontend (`AppRoutes.jsx`) đến Backend Attributes `[Authorize(Roles = "...")]` và `IAccessControlService` chống IDOR.

---

## 2. VAI TRÒ HỆ THỐNG & TÀI KHOẢN THỰC NGHIỆM (SEED DATA)

> **Mật khẩu mặc định cho toàn bộ tài khoản thử nghiệm:** `123456`

| Phân hệ (Portal) | Vai trò (Role) | Username mẫu | Mô tả trách nhiệm & Phạm vi tác vụ |
| :--- | :--- | :--- | :--- |
| **Cổng Quản trị** | `ADMIN` | `admin` | Quản trị tài khoản, danh mục Role/Permission, cấu hình SLA/tham số hệ thống, xem Báo cáo toàn trường và tra cứu `AUDIT_LOG`. |
| **Cổng Tiếp nhận** | `OFFICER` | `officer01` | Tuyến đầu: Tiếp nhận hồ sơ mới nộp, sơ duyệt kiểm tra giấy tờ, quản lý danh bạ chủ trọ/nhà trọ, danh sách sinh viên, duyệt/từ chối các yêu cầu phát sinh. |
| **Cổng Thẩm định** | `REVIEWER` | `reviewer01` | Tuyến hai: Bàn làm việc chuyên sâu ("Reviewer Workspace" 3 cột), thẩm tra chi tiết tính hợp lệ của từng tài liệu scan (`VALID`/`REJECTED`), thẩm định đạt chuyển tiếp (`PASS`), hoặc phê duyệt chính thức (`APPROVE`). |
| **Cổng Sinh viên** | `STUDENT` | `670401` *(mới toanh)*<br>`660203` *(đã có hồ sơ `ACTIVE`)* | Khai báo nơi ở, tải 4 minh chứng, nộp hồ sơ, rút hồ sơ (`WITHDRAWN`), nộp lại hồ sơ bổ sung (`resubmit`), gửi yêu cầu gia hạn / đổi trọ / kết thúc, tự hủy yêu cầu (`CANCELLED`). |

---

## 3. TOÀN BỘ CÁC LUỒNG NGHIỆP VỤ CỐT LÕI (END-TO-END WORKFLOWS)

```
                            [ SINH VIÊN ]
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
[1. Khai báo & Nộp hồ sơ mới]               [2. Đã có hồ sơ ACTIVE]
         │                                                 │
         ▼                                                 ├─► Yêu cầu Gia hạn (RENEWAL)
[CÁN BỘ TIẾP NHẬN (OFFICER)]                               ├─► Yêu cầu Đổi trọ (CHANGE_ADDRESS)
  • Sơ duyệt kiểm tra giấy tờ                              ├─► Yêu cầu Kết thúc (TERMINATION)
  • Yêu cầu bổ sung (tối đa 3 lần)                         └─► Tự hủy yêu cầu (CANCELLED)
         │ (Chuyển tiếp hồ sơ đạt)                                 │
         ▼                                                         ▼
[THẨM ĐỊNH VIÊN (REVIEWER)]                               [CÁN BỘ PHÊ DUYỆT (OFFICER/REVIEWER)]
  • Thẩm định chuyên sâu minh chứng                         • Duyệt / Từ chối yêu cầu
  • Phê duyệt kích hoạt (ACTIVE)                            • Cập nhật địa chỉ mới CURRENT
         │                                                  • Cập nhật địa chỉ cũ OLD
         ▼
[HỆ THỐNG TỰ ĐỘNG CHẠY NGẦM (BACKGROUND SCHEDULER)]
  • Quét hồ sơ hết hạn cư trú ──► Tự chuyển sang EXPIRED
  • Quét sắp hết hạn trong 15 ngày ──► Bắn NOTIFICATION nhắc nhở
  • Quét hồ sơ quá hạn xử lý ──► Chuyển SLA sang OVERDUE & Kích hoạt ESCALATION
```

### Luồng 1: Vòng đời Đăng ký Ngoại trú (Registration Lifecycle)
1. **Lưu nháp (Draft):** Sinh viên nhập thông tin nơi ở và chủ trọ. Hệ thống tự động lưu nháp vào `localStorage` (`student-registration-draft`).
2. **Tải đủ 4 loại giấy tờ bắt buộc:**
   - `RENTAL_CONTRACT`: Hợp đồng thuê trọ có chữ ký 2 bên.
   - `RESIDENCE_CONFIRMATION`: Giấy xác nhận thông tin cư trú CT07.
   - `LANDLORD_ID`: Căn cước công dân chủ trọ (2 mặt).
   - `HOUSE_IMAGE`: Ảnh chụp cổng và biển số nhà trọ.
3. **Nộp hồ sơ (`POST /api/Registration/submit-full`):**
   - **Ràng buộc:** Chặn nộp nếu sinh viên đã có hồ sơ `ACTIVE`, `SUBMITTED`, hoặc `NEED_MORE_INFO`.
   - Sinh mã hồ sơ chuẩn: `HS-YYYYMMDD-XXX`.
   - Khởi tạo đồng hồ SLA tiếp nhận 72 giờ trong bảng `SLA_TRACKING`.
   - Lưu 4 tài liệu vào `DOCUMENT` & `DOCUMENT_VERSION` kèm băm SHA-256. Ghi `AUDIT_LOG`.
   - Trạng thái hồ sơ: **`SUBMITTED`**.
4. **Rút hồ sơ (`POST /api/Registration/{id}/withdraw`):**
   - Sinh viên có thể tự rút khi hồ sơ đang `SUBMITTED` hoặc `NEED_MORE_INFO`.
   - Trạng thái chuyển sang **`WITHDRAWN`**, hủy SLA tương ứng sang **`CANCELLED`**, ghi `AUDIT_LOG`.
5. **Sơ duyệt bởi Cán bộ Tiếp nhận (`OFFICER`):**
   - Thẩm định đạt: Bấm *Chuyển duyệt* (`action=PASS`) ➔ Hồ sơ sang **`UNDER_REVIEW`**.
   - Thiếu giấy tờ: Nhập lý do và chọn *Yêu cầu bổ sung* (`action=REQUEST_INFO`). Bộ đếm bổ sung tăng (+1). Nếu quá 3 lần (`MAX_SUPPLEMENT_COUNT = 3`), hệ thống tự từ chối hồ sơ (`MAX_SUPPLEMENT_LIMIT_EXCEEDED`). Nếu chưa quá 3 lần, hồ sơ sang **`NEED_MORE_INFO`**, bắn Notification cho sinh viên.
   - Không hợp lệ: Bấm *Từ chối* (`action=REJECT`) ➔ Hồ sơ sang **`REJECTED`**.
6. **Nộp lại hồ sơ (`POST /api/Registration/{id}/resubmit`):**
   - Sinh viên cập nhật lại giấy tờ và bấm nộp lại ➔ Hồ sơ quay về **`SUBMITTED`**.
7. **Phê duyệt chính thức (`APPROVE`):**
   - Cán bộ/Reviewer phê duyệt ➔ Trạng thái hồ sơ chuyển sang **`ACTIVE`** (hoặc `APPROVED`).
   - Bản ghi địa chỉ của sinh viên chuyển sang **`CURRENT`** (kích hoạt cư trú).
   - Các tài liệu minh chứng chuyển sang **`VALID`**. Ghi quyết định vào bảng `APPROVAL` và `AUDIT_LOG`.
8. **Hết hạn ngoại trú:**
   - Background Scheduler quét ngày hết hạn (`ExpiryDate < Today`) ➔ Chuyển sang **`EXPIRED`**, địa chỉ chuyển sang **`INACTIVE`**.

---

### Luồng 2: Quản lý Yêu cầu Phát sinh (Requests Lifecycle)
> **Quy tắc bắt buộc:** Sinh viên phải có hồ sơ **`ACTIVE`** mới được tạo yêu cầu; tại một thời điểm, mỗi hồ sơ chỉ có **tối đa 1 yêu cầu đang chờ xử lý**.

1. **Gia hạn ngoại trú (`RENEWAL`):**
   - Sinh viên nộp lý do gia hạn ➔ Trạng thái `SUBMITTED`, SLA 48h.
   - Khi được duyệt (`POST /api/Request/{id}/approve`): Tự động cộng thêm 1 năm (hoặc số tháng cấu hình) vào `ExpiryDate` của hồ sơ chính. Request sang `APPROVED`.
2. **Báo chuyển nơi ở (`CHANGE_ADDRESS`):**
   - Sinh viên nhập địa chỉ mới (số nhà, phường, quận, tỉnh) và lý do.
   - Trong lúc chờ: Địa chỉ cũ vẫn giữ `CURRENT`.
   - Khi được duyệt: Trong cùng 1 Database Transaction:
     + Chuyển địa chỉ cũ sang trạng thái **`OLD`**, gán `EndDate = Today`.
     + Tạo bản ghi địa chỉ mới với trạng thái **`CURRENT`**, gán `StartDate = Today`.
     + Yêu cầu chuyển sang **`APPROVED`**, ghi nhận vào `APPROVAL`, `REQUEST_HISTORY` và `AUDIT_LOG`.
3. **Kết thúc ngoại trú (`TERMINATION`):**
   - Sinh viên báo dọn về nhà / vào KTX ➔ Khi duyệt, hồ sơ chính chuyển sang **`TERMINATED`**, địa chỉ kết thúc.
4. **Hủy yêu cầu (`POST /api/Request/{id}/cancel`):**
   - Sinh viên được tự hủy khi yêu cầu còn ở `SUBMITTED`. Trạng thái sang `CANCELLED`, hủy SLA.

---

### Luồng 3: Background Scheduler & Giám sát SLA
- Lớp `SystemSchedulerService` (`BackgroundService`) tự động quét mỗi giờ, có endpoint kích hoạt theo nhu cầu: `POST /api/SlaTracking/trigger-scan`.
1. **Tự động hết hạn:** Quét hồ sơ `ACTIVE` có `ExpiryDate < Today` ➔ Chuyển `EXPIRED`.
2. **Nhắc nhở sắp hết hạn trước 15 ngày (Idempotent):** Quét hồ sơ sắp hết hạn trong 15 ngày ➔ Bắn `NOTIFICATION` nhắc nhở sinh viên (đảm bảo không gửi trùng lặp).
3. **Quét trễ hạn SLA:** Quét các bản ghi `SLA_TRACKING` có `DueAt < Now` và chưa hoàn tất ➔ Chuyển sang **`OVERDUE`**, tự sinh bản ghi trong bảng `ESCALATION` (Level 1) và gửi thông báo cảnh báo cho cán bộ.

---

## 4. BẢN ĐỒ CÁC TRANG & ROUTE FRONTEND (APP ROUTES)

### 1. Cổng Sinh viên (`StudentLayout`)
- `/overview`: Tổng quan, Banner trạng thái, Stepper 5 bước, Thẻ nơi ở hiện tại, Quick actions, Lịch sử hoạt động.
- `/registration`: Wizard 4 bước khai báo và nộp hồ sơ mới; Nộp lại hồ sơ (`resubmit`).
- `/residence`: Quản lý nơi ở hiện tại (`CURRENT`), lịch sử nơi ở cũ (`OLD`), nút "Báo chuyển trọ".
- `/documents`: Quản lý, tải lên, xem trước 4 tài liệu minh chứng và các phiên bản tệp.
- `/requests`: Quản lý danh sách yêu cầu (Gia hạn, Đổi trọ, Kết thúc), Modal tạo yêu cầu, Hủy yêu cầu, Rút hồ sơ.
- `/notifications`: Hộp thư thông báo hệ thống, đánh dấu đã đọc.
- `/profile`: Thông tin cá nhân sinh viên từ trường (MSSV, Họ tên, Lớp, Khoa, CCCD, SĐT).

### 2. Cổng Cán bộ Tiếp nhận (`OfficerLayout` - `/officer`)
- `/officer/dashboard`: Thống kê tổng quan tiếp nhận, phân bổ trạng thái, cảnh báo SLA khẩn cấp.
- `/officer/registrations`: Danh sách tiếp nhận hồ sơ, Modal sơ duyệt (Chuyển duyệt `PASS`, Yêu cầu bổ sung `REQUEST_INFO`, Từ chối `REJECT`).
- `/officer/requests`: Quản lý và phê duyệt/từ chối các yêu cầu phát sinh.
- `/officer/students`: Tra cứu thông tin và tình trạng ngoại trú của sinh viên toàn trường.
- `/officer/landlords`: Danh bạ chủ trọ, nhà trọ trên địa bàn, số lượng sinh viên đang thuê.
- `/officer/documents`: Thẩm định danh mục tài liệu minh chứng (`VALID`/`REJECTED`).
- `/officer/sla`: Giám sát đồng hồ đếm ngược SLA tiếp nhận.
- `/officer/notifications`: Soạn và gửi thông báo điều hành.
- `/officer/reports`: Báo cáo số liệu ngoại trú theo Khoa/Viện.

### 3. Cổng Thẩm định viên (`ReviewerLayout` - `/reviewer`)
- `/reviewer/workspace`: Không gian thẩm định chuyên sâu 3 cột: Cột 1 (Hàng đợi lọc đa trạng thái), Cột 2 (Chi tiết sinh viên, tab Nơi ở, tab Giấy tờ scan, tab Lịch sử duyệt), Cột 3 (Tiến trình SLA, Nút "Phê duyệt chính thức ACTIVE", "Thẩm định đạt PASS", "Yêu cầu bổ sung", "Từ chối").
- `/reviewer/processed`: Danh sách các hồ sơ đã xử lý (Hiển thị nhãn xanh `ĐÃ PHÊ DUYỆT` cho cả `ACTIVE` và `APPROVED`, nhãn đỏ `ĐÃ TỪ CHỐI`).
- `/reviewer/requests`: Thẩm định và duyệt yêu cầu phát sinh cấp cao.
- `/reviewer/additional-info`: Danh sách hồ sơ đang chờ sinh viên bổ sung (`NEED_MORE_INFO`).
- `/reviewer/overdue`: Danh sách hồ sơ quá hạn SLA và Escalation.
- `/reviewer/reports`: Báo cáo tỷ lệ đạt/trượt thẩm định.
- `/reviewer/stats`: Thống kê năng suất và thời gian giải quyết trung bình.

### 4. Cổng Quản trị viên (`AdminLayout` - `/admin`)
- `/admin/dashboard`: Bảng điều khiển quản trị toàn diện, sức khỏe hệ thống.
- `/admin/users`: Quản lý tài khoản (Thêm, Khóa, Mở khóa, Đặt lại mật khẩu `123456`).
- `/admin/students`: Quản lý danh mục sinh viên đồng bộ từ SIS.
- `/admin/registrations`: Quản trị toàn bộ hồ sơ đăng ký ngoại trú (Modal xem chi tiết hiển thị đầy đủ địa chỉ).
- `/admin/requests`: Quản trị toàn bộ các loại yêu cầu phát sinh.
- `/admin/roles` & `/admin/permissions` & `/admin/user-roles`: Phân quyền RBAC.
- `/admin/sla`: Cấu hình thời hạn SLA và giám sát vi phạm.
- `/admin/config`: Cấu hình tham số hệ thống (`MAX_SUPPLEMENT_COUNT`, `DEFAULT_EXPIRY_MONTHS`...).
- `/admin/audit`: Nhật ký kiểm toán tập trung (`AUDIT_LOG`), theo dõi IP, User, Hành động, Bảng dữ liệu.

---

## 5. QUY TẮC CỐT LÕI & LƯU Ý KỸ THUẬT DÀNH CHO AI (CRITICAL AI GOTCHAS)

> ⚠️ **MỌI AI KHI PHÁT TRIỂN / SỬA CODE PHẢI TUÂN THỦ NGHIÊM NGẶT CÁC QUY TẮC SAU:**

1. **Cấu trúc dữ liệu Địa chỉ trong API / Entity Framework:**
   - Quan hệ giữa `Registration` và `Address` là **1 - Nhiều**: Model chứa `public virtual ICollection<Address> Addresses { get; set; }`.
   - Do đó, trong JSON trả về Frontend, thuộc tính luôn là **`r.addresses` (mảng số nhiều)**, **TUYỆT ĐỐI KHÔNG ĐƯỢC DÙNG `r.address` (số ít)**.
   - Tên trường trong bảng `ADDRESS` là **`AddressLine`** (JSON: `addressLine`), **KHÔNG ĐƯỢC DÙNG `streetAddress`**.
   - *Cách đọc an toàn nhất trên Frontend:*
     ```javascript
     const addr = r.addresses?.[0] || r.address || {};
     const fullAddress = [addr.addressLine || addr.streetAddress, addr.ward, addr.district, addr.province || addr.city].filter(Boolean).join(', ');
     ```

2. **Quy ước Trạng thái Hồ sơ Ngoại trú (`REGISTRATION.status`):**
   - CHECK Constraint trong SQL Server: `'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'NEED_MORE_INFO', 'APPROVED', 'ACTIVE', 'REJECTED', 'WITHDRAWN', 'EXPIRED', 'TERMINATED'`.
   - Khi hồ sơ được phê duyệt chính thức thành công, hệ thống gán trạng thái là **`ACTIVE`** (Đang hiệu lực cư trú).
   - Khi kiểm tra hồ sơ đã duyệt trên Frontend, **PHẢI KIỂM TRA CẢ 2**: `r.status === 'ACTIVE' || r.status === 'APPROVED'`. Tuyệt đối không chỉ kiểm tra riêng `r.status === 'APPROVED'`, vì sẽ làm các hồ sơ `ACTIVE` bị hiển thị nhầm thành `ĐÃ TỪ CHỐI`.

3. **Quy ước Trạng thái Yêu cầu Bổ sung Giấy tờ:**
   - Tên trạng thái chuẩn trong Database và API là **`NEED_MORE_INFO`**.
   - Tuyệt đối **KHÔNG ĐƯỢC DÙNG chuỗi `'REQUEST_INFO'`** làm giá trị status trong Database/API (chỉ dùng `'REQUEST_INFO'` làm tên hành động action khi gửi review).

4. **Quy ước Trạng thái Địa chỉ (`ADDRESS.status`):**
   - CHECK Constraint `CK_ADDRESS_STATUS`: Chỉ chấp nhận **`'CURRENT'`**, **`'OLD'`**, **`'INACTIVE'`**.
   - Tuyệt đối **KHÔNG ĐƯỢC DÙNG `'PREVIOUS'`**.
   - Khi duyệt yêu cầu chuyển nơi ở (`CHANGE_ADDRESS`), địa chỉ cũ phải chuyển thành `'OLD'`, và địa chỉ mới tạo phải là `'CURRENT'`.

5. **Quy ước Ràng buộc Khóa duy nhất CCCD Chủ trọ (`LANDLORD`):**
   - Đã áp dụng Filtered Unique Index `UQ_LANDLORD_IDENTITY_FILTERED`: Cho phép nhiều chủ trọ có `identity_number IS NULL` (bỏ trống CCCD), nhưng nếu đã nhập CCCD thì không được trùng nhau.

6. **Phân quyền Phê duyệt Yêu cầu (`RequestController.cs`):**
   - Endpoint `POST api/Request/{id}/approve` và `POST api/Request/{id}/reject` được cấp quyền cho: `ADMIN,OFFICER,REVIEWER,APPROVER,SENIOR_APPROVER`.

---

## 6. HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG (RUNNING INSTRUCTIONS)

### Bước 1: Khởi động Cơ sở dữ liệu (SQL Server)
- Kết nối SQL Server Management Studio (SSMS) đến `localhost` hoặc `.\SQLEXPRESS`.
- Chạy file script hợp nhất toàn diện:
  ```powershell
  sqlcmd -S localhost -E -i script.sql
  ```

### Bước 2: Khởi chạy Backend API (.NET 8)
```powershell
cd source/backend
dotnet restore
dotnet run
```
- API Endpoint: `http://localhost:5005`
- Swagger UI tài liệu API: `http://localhost:5005/swagger`

### Bước 3: Khởi chạy Frontend Web (React Vite)
```powershell
cd source/frontend
npm install
npm run dev
```
- Truy cập trình duyệt: `http://localhost:5173`

---
*Tài liệu được cập nhật và kiểm thử tự động đạt 100% (Build Backend 0 Error, Build Frontend 0 Error, 15/15 Integration Test Cases Passed).*
