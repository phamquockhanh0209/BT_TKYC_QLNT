# BÁO CÁO KIỂM THỬ TOÀN DIỆN HỆ THỐNG QLNT_TKYC
**Dự án:** Quản lý ngoại trú sinh viên (QLNT_TKYC)  
**Ngày thực hiện:** 25/10/2026  
**Vai trò thực hiện:** Senior Software Engineer / QA Engineer  
**Môi trường kiểm thử:**
- Hệ điều hành: Windows 11
- Cơ sở dữ liệu: Microsoft SQL Server (`Khánh\SQLEXPRESS01`), Database: `QLNT_TKYC`
- Backend API: .NET 8.0 Web API (`http://localhost:5005`)
- Frontend Web: React 18 / Vite SPA (`http://localhost:5173`)

---

## 1. TỔNG QUAN KẾT QUẢ KIỂM THỬ

| Kịch bản nghiệp vụ | Số Test Case | Đạt (Passed) | Thất bại (Failed) | Tỷ lệ thành công |
| :--- | :---: | :---: | :---: | :---: |
| **Kịch bản A: Sinh viên nộp & rút hồ sơ** | 3 | 3 | 0 | 100% |
| **Kịch bản B & C: Quy trình tiếp nhận & xét duyệt hồ sơ** | 1 | 1 | 0 | 100% |
| **Kịch bản D: Vòng đời yêu cầu phát sinh (Requests)** | 5 | 5 | 0 | 100% |
| **Kịch bản E: Scheduler tự động & SLA Tracking** | 2 | 2 | 0 | 100% |
| **Kịch bản F: Phân quyền bảo mật & Audit Log** | 4 | 4 | 0 | 100% |
| **TỔNG CỘNG** | **15** | **15** | **0** | **100%** |

---

## 2. CHI TIẾT KẾT QUẢ TỪNG TEST CASE

### Kịch bản A: Sinh viên nộp hồ sơ & Rút hồ sơ
- **TC-A01: Chặn sinh viên có hồ sơ `ACTIVE` nộp thêm hồ sơ mới**
  - *Mục tiêu:* Đảm bảo một sinh viên chỉ có 1 hồ sơ ngoại trú hoạt động, không được tạo hồ sơ trùng lặp.
  - *Dữ liệu thử nghiệm:* Tài khoản `660203` (đang có hồ sơ `HS-20260401-002` ở trạng thái `ACTIVE`).
  - *Hành động:* Gửi `POST /api/Registration/submit-full`.
  - *Kết quả thực tế:* HTTP `400 Bad Request` với thông điệp: *"Bạn đã có hồ sơ ngoại trú đang hoạt động trên hệ thống..."*.
  - *Đánh giá:* **PASSED**.
- **TC-A02: Sinh viên chưa có hồ sơ nộp hồ sơ ngoại trú hoàn chỉnh**
  - *Mục tiêu:* Xác nhận sinh viên (sau khi hồ sơ cũ hết hạn hoặc sinh viên mới) nộp hồ sơ thành công; kiểm tra không bị lỗi trùng khóa Unique Index trên `LANDLORD.identity_number` khi để trống (NULL).
  - *Dữ liệu thử nghiệm:* Tài khoản `670102`.
  - *Hành động:* Gửi `POST /api/Registration/submit-full` với thông tin phòng trọ và chủ trọ không có CCCD.
  - *Kết quả thực tế:* Trả về HTTP `200 OK`, `RegistrationId=66`, `RegistrationCode=HS-20261025-001`, `Status=SUBMITTED`. Khởi tạo SLA 72 giờ và ghi `AUDIT_LOG`.
  - *Đánh giá:* **PASSED**.
- **TC-A03: Sinh viên rút hồ sơ đã nộp khi chưa được duyệt**
  - *Mục tiêu:* Cho phép sinh viên rút hồ sơ ở trạng thái `SUBMITTED`, `NEED_MORE_INFO`, chuyển sang `WITHDRAWN`, hủy SLA và ghi nhận Audit Log.
  - *Dữ liệu thử nghiệm:* Tài khoản `670102`, hồ sơ vừa nộp ID `66`.
  - *Hành động:* Gửi `POST /api/Registration/66/withdraw`.
  - *Kết quả thực tế:* Trả về `WITHDRAWN`, SLA tương ứng chuyển sang `CANCELLED`.
  - *Đánh giá:* **PASSED**.

---

### Kịch bản B & C: Tiếp nhận & Xét duyệt hồ sơ
- **TC-BC01: Cán bộ tiếp nhận kiểm tra và chuyển hồ sơ sang `UNDER_REVIEW`**
  - *Mục tiêu:* Cán bộ tiếp nhận xem xét hồ sơ và bấm `PASS` để chuyển tiếp sang người xét duyệt.
  - *Dữ liệu thử nghiệm:* Tài khoản cán bộ `officer01` / `reviewer01`, hồ sơ `59`.
  - *Hành động:* Gửi `POST /api/Registration/59/review-action` với `action="PASS"`.
  - *Kết quả thực tế:* HTTP `200 OK`, hồ sơ chuyển sang `UNDER_REVIEW`, cập nhật SLA và ghi nhận lịch sử xử lý.
  - *Đánh giá:* **PASSED**.

---

### Kịch bản D: Quản lý yêu cầu phát sinh (Requests)
- **TC-D01: Tạo yêu cầu Gia hạn (`RENEWAL`) cho hồ sơ đang `ACTIVE`**
  - *Mục tiêu:* Sinh viên có hồ sơ `ACTIVE` tạo yêu cầu gia hạn ngoại trú.
  - *Dữ liệu thử nghiệm:* Tài khoản sinh viên `660203`, hồ sơ `ACTIVE` ID `60`.
  - *Hành động:* Gửi `POST /api/Request` với `requestType="RENEWAL"`.
  - *Kết quả thực tế:* Tạo thành công Request với mã tự sinh `YCGH-...`, trạng thái `SUBMITTED`, khởi tạo SLA 48 giờ.
  - *Đánh giá:* **PASSED**.
- **TC-D02: Chặn tạo đồng thời 2 yêu cầu đang chờ xử lý trên cùng một hồ sơ**
  - *Mục tiêu:* Ràng buộc nghiệp vụ cốt lõi: Mỗi hồ sơ chỉ có tối đa 1 yêu cầu ở trạng thái chờ (`SUBMITTED`, `UNDER_REVIEW`, `NEED_MORE_INFO`, `PROCESSING`).
  - *Dữ liệu thử nghiệm:* Tiếp tục gửi `POST /api/Request` loại `CHANGE_ADDRESS` khi yêu cầu TC-D01 chưa xử lý xong.
  - *Kết quả thực tế:* HTTP `400 Bad Request` với thông báo: *"Hồ sơ đang có yêu cầu đang chờ xử lý. Không thể tạo thêm yêu cầu mới."*
  - *Đánh giá:* **PASSED**.
- **TC-D03: Sinh viên tự hủy yêu cầu phát sinh khi ở trạng thái `SUBMITTED`**
  - *Mục tiêu:* Cho phép sinh viên hủy yêu cầu nếu đổi ý, chuyển trạng thái sang `CANCELLED` và hủy SLA.
  - *Dữ liệu thử nghiệm:* Tài khoản `660203`, mã yêu cầu vừa tạo ở TC-D01.
  - *Hành động:* Gửi `POST /api/Request/{id}/cancel`.
  - *Kết quả thực tế:* Request chuyển sang `CANCELLED`, `RequestHistory` ghi nhận action `CANCELLED`, SLA chuyển sang `CANCELLED`.
  - *Đánh giá:* **PASSED**.
- **TC-D04: Cho phép tạo yêu cầu mới sau khi yêu cầu cũ đã bị hủy**
  - *Mục tiêu:* Sau khi yêu cầu trước đã về trạng thái kết thúc (`CANCELLED`), sinh viên có thể tạo yêu cầu khác bình thường.
  - *Dữ liệu thử nghiệm:* Gửi lại `POST /api/Request` loại `CHANGE_ADDRESS`.
  - *Kết quả thực tế:* Tạo thành công Request mới với trạng thái `SUBMITTED`.
  - *Đánh giá:* **PASSED**.
- **TC-D05: Cán bộ phê duyệt yêu cầu và cập nhật đồng bộ hồ sơ chính**
  - *Mục tiêu:* Khi duyệt `CHANGE_ADDRESS`, hồ sơ chính `REGISTRATION` và `ADDRESS` được cập nhật đồng bộ trong cùng một transaction.
  - *Dữ liệu thử nghiệm:* Tài khoản cán bộ `officer01`, Request ID `30`.
  - *Hành động:* Gửi `PUT /api/Request/30/approve`.
  - *Kết quả thực tế:* Request chuyển thành `APPROVED`, SLA kết thúc, bản ghi `ADDRESS` mới được kích hoạt, ghi `AUDIT_LOG`.
  - *Đánh giá:* **PASSED**.

---

### Kịch bản E: Scheduler & SLA Tracking
- **TC-E01: Kích hoạt quét định kỳ hồ sơ hết hạn và SLA quá hạn**
  - *Mục tiêu:* Kiểm tra phương thức quét định kỳ của `SystemSchedulerService`:
    1. Quét các hồ sơ `ACTIVE` có `ExpiryDate < Hôm nay` -> tự động chuyển sang `EXPIRED`.
    2. Gửi thông báo nhắc nhở trước 15 ngày cho các hồ sơ sắp hết hạn vào bảng `NOTIFICATION`.
    3. Quét các SLA quá hạn -> cập nhật `IsOverdue = true`, nâng `EscalationLevel = 1` và tạo bản ghi `ESCALATION`.
  - *Hành động:* Gửi `POST /api/SlaTracking/trigger-scan`.
  - *Kết quả thực tế:* Quét thành công, hồ sơ quá hạn (ví dụ hồ sơ `56`) tự động chuyển thành `EXPIRED`, bản ghi SLA được đánh dấu cảnh báo.
  - *Đánh giá:* **PASSED**.
- **TC-E02: Tính lũy biến / Idempotent của Scheduler**
  - *Mục tiêu:* Chạy scheduler nhiều lần không tạo thông báo trùng lặp hoặc bản ghi escalation lặp lại cho cùng một sự kiện.
  - *Hành động:* Chạy lại `POST /api/SlaTracking/trigger-scan` ngay lập tức.
  - *Kết quả thực tế:* Trả về thành công, số lượng bản ghi thông báo và escalation không bị tăng gấp đôi.
  - *Đánh giá:* **PASSED**.

---

### Kịch bản F: Phân quyền (Security/RBAC) & Dữ liệu
- **TC-F01: Sinh viên cố gắng xem hồ sơ của sinh viên khác (IDOR Prevention)**
  - *Mục tiêu:* Sinh viên A không được phép truy cập chi tiết hồ sơ của sinh viên B qua API.
  - *Dữ liệu thử nghiệm:* Sinh viên `670102` gọi `GET /api/Registration/60` (thuộc sinh viên `660203`).
  - *Kết quả thực tế:* HTTP `403 Forbidden` (truy cập bị chặn ở tầng Authorization backend).
  - *Đánh giá:* **PASSED**.
- **TC-F02: Sinh viên cố tình gọi API phê duyệt hồ sơ**
  - *Mục tiêu:* Sinh viên không thể tự duyệt hoặc đổi trạng thái hồ sơ của mình.
  - *Dữ liệu thử nghiệm:* Token sinh viên `660203` gửi `POST /api/Registration/60/review-action`.
  - *Kết quả thực tế:* HTTP `403 Forbidden` (chỉ role `OFFICER`, `REVIEWER`, `APPROVER` mới được truy cập).
  - *Đánh giá:* **PASSED**.
- **TC-F03: Request không kèm Token xác thực**
  - *Mục tiêu:* Chặn toàn bộ truy cập nặc danh vào các tài nguyên nội bộ.
  - *Dữ liệu thử nghiệm:* Gửi `GET /api/Registration` không có header `Authorization`.
  - *Kết quả thực tế:* HTTP `401 Unauthorized`.
  - *Đánh giá:* **PASSED**.
- **TC-F04: Kiểm tra lưu trữ tập trung Audit Log**
  - *Mục tiêu:* Mọi thao tác quan trọng (đăng nhập, nộp hồ sơ, duyệt, từ chối, rút hồ sơ, tạo yêu cầu) phải được ghi vào bảng `AUDIT_LOG`.
  - *Dữ liệu thử nghiệm:* Token Admin gọi `GET /api/AuditLog?page=1&pageSize=5`.
  - *Kết quả thực tế:* Dữ liệu `AUDIT_LOG` trả về đầy đủ với thông tin `Action`, `TableName`, `RecordId`, `PerformedBy`, `IpAddress` và `Timestamp`.
  - *Đánh giá:* **PASSED**.

---

## 3. LỆNH VÀ SCRIPT KIỂM THỬ ĐÃ THỰC THI

### 3.1. Biên dịch Backend & Frontend
```powershell
# Backend
cd c:\Users\quoc_\Downloads\QLNT_TKYC\source\backend
dotnet build
# Kết quả: 0 Warning, 0 Error

# Frontend
cd c:\Users\quoc_\Downloads\QLNT_TKYC\source\frontend
npm run build
# Kết quả: 0 Error, bundle output built successfully
```

### 3.2. Script kiểm thử tích hợp tự động
Toàn bộ kịch bản kiểm thử trên được tự động hóa trong file PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File scratch/run_tests.ps1
```
*Kết quả:*
```text
>>> BAT DAU KIEM THU TOAN DIEN QLNT_TKYC <<<
--- 1. Login & Token Retrieval ---
--- Scenario A: Student Registration ---
[PASS] TC-A01 - Block student with ACTIVE dossier from creating another
[PASS] TC-A02 - Student submits full registration
[PASS] TC-A03 - Student withdraws submitted registration
--- Scenario D: Requests Lifecycle ---
[PASS] TC-D01 - Create RENEWAL request for ACTIVE dossier
[PASS] TC-D02 - Block 2 pending requests simultaneously on same dossier
[PASS] TC-D03 - Student cancels pending request
[PASS] TC-D04 - Create new request after previous cancelled
[PASS] TC-D05 - Officer approves CHANGE_ADDRESS
--- Scenario B & C: Reviewer Pass & Approval ---
[PASS] TC-BC01 - Reviewer passes registration to UNDER_REVIEW
--- Scenario E: Scheduler & SLA ---
[PASS] TC-E01 - Trigger Scheduler Scan
[PASS] TC-E02 - Verify Idempotency of Scheduler
--- Scenario F: Security & Permissions ---
[PASS] TC-F01 - Student views another student dossier
[PASS] TC-F02 - Student tries to approve dossier
[PASS] TC-F03 - Unauthenticated request
[PASS] TC-F04 - Centralized AuditLog persistence
>>> TEST SUMMARY <<<
Total tests: 15 | Passed: 15 | Failed: 0
```

---

## 4. CÁC HẠN CHẾ & LƯU Ý MÔI TRƯỜNG THỰC TẾ
1. **Dịch vụ gửi Email / SMS thật:** Hệ thống hiện tại lưu notification vào cơ sở dữ liệu (`NOTIFICATION`) và hiển thị trực tiếp lên Notification Bell của người dùng. Để gửi email hoặc SMS thật, cần cấu hình thêm thông tin SMTP hoặc SMS Gateway trong `appsettings.json`.
2. **Hệ thống SIS tích hợp bên ngoài:** Dữ liệu sinh viên hiện được đồng bộ thông qua bảng `STUDENT_CACHE` và seed script. Nếu kết nối với cổng đào tạo đại học thực tế, cần bổ sung cron job sync định kỳ qua REST API của trường.
