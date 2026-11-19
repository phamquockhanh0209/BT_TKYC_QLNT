# KẾ HOẠCH TRIỂN KHAI HOÀN THIỆN VÀ KIỂM THỬ HỆ THỐNG (IMPLEMENTATION PLAN)

> **Dự án:** QLNT_TKYC – Quản lý Ngoại trú Sinh viên  
> **Thời điểm lập kế hoạch:** 25/10/2026  
> **Mục tiêu:** Hoàn thiện 100% các lỗ hổng nghiệp vụ, bổ sung scheduler tự động, kiểm toán tập trung và kiểm thử toàn diện kịch bản end-to-end.  

---

## 1. PHÂN CẤP ƯU TIÊN VÀ LỘ TRÌNH THỰC HIỆN

### ƯU TIÊN P0 — Ràng buộc Nghiệp vụ cốt lõi & Tính toàn vẹn Dữ liệu
1. **Hoàn thiện API tạo yêu cầu phát sinh (`CreateRequest` trong `RequestController.cs`):**
   - Tiền điều kiện 1: Hồ sơ đăng ký (`Registration`) liên kết phải ở trạng thái `ACTIVE` hoặc `APPROVED`.
   - Tiền điều kiện 2: Chỉ cho phép **tối đa một yêu cầu đang chờ xử lý** (`SUBMITTED`, `UNDER_REVIEW`, `NEED_MORE_INFO`, `PROCESSING`) cho mỗi hồ sơ ngoại trú. Nếu đã có yêu cầu chờ xử lý, chặn ngay với mã `400 Bad Request` kèm thông báo rõ ràng.
   - Bảo vệ tương tranh (Concurrency Lock): Bọc trong Transaction an toàn để chống việc gửi hai request đồng thời tạo hai yêu cầu chờ.
   - Tự động khởi tạo lịch sử yêu cầu: Ghi bản ghi đầu tiên vào `REQUEST_HISTORY` (`old_status: null` -> `new_status: 'SUBMITTED'`).
   - Tự động gắn SLA tracking cho yêu cầu: Khởi tạo bản ghi `SLA_TRACKING` (`sla_type: "REQUEST_REVIEW"`, thời hạn 48h).
   - Ghi nhật ký kiểm toán vào `AUDIT_LOG`.

2. **Triển khai API Sinh viên hủy yêu cầu phát sinh (`CancelRequest`):**
   - Endpoint: `POST api/Request/{id}/cancel`.
   - Kiểm tra quyền: Chỉ chính sinh viên tạo yêu cầu (hoặc Admin) mới có quyền hủy.
   - Kiểm tra trạng thái: Chỉ cho phép hủy khi yêu cầu đang ở trạng thái `DRAFT` hoặc `SUBMITTED`. Chặn hủy nếu yêu cầu đã vào bước `UNDER_REVIEW`, `APPROVED` hoặc `REJECTED`.
   - Cập nhật trạng thái `CANCELLED`, ghi nhận vào `REQUEST_HISTORY` và `AUDIT_LOG`.
   - Cập nhật bản ghi `SLA_TRACKING` liên quan sang `CANCELLED`.

3. **Triển khai API Sinh viên rút hồ sơ ngoại trú (`WithdrawRegistration`):**
   - Endpoint: `POST api/Registration/{id}/withdraw`.
   - Kiểm tra quyền: Chỉ chính sinh viên sở hữu hồ sơ (hoặc Admin).
   - Kiểm tra trạng thái: Chỉ cho phép rút khi hồ sơ ở trạng thái `DRAFT` hoặc `SUBMITTED` (chưa thẩm định). Chặn rút khi hồ sơ đã `ACTIVE` (phải làm yêu cầu `TERMINATION`) hoặc đang `UNDER_REVIEW`.
   - Cập nhật trạng thái sang `WITHDRAWN`, hủy SLA tracking liên quan, ghi `AUDIT_LOG` và gửi thông báo xác nhận.

---

### ƯU TIÊN P1 — Scheduler Tự động & Dịch vụ Thông báo
4. **Xây dựng Background Scheduler Service (`SystemSchedulerService`):**
   - Kế thừa `BackgroundService` trong ASP.NET Core, chạy định kỳ trong nền hệ thống (mỗi 1 giờ, tự chạy ngay khi hệ thống khởi động).
   - Bổ sung endpoint thủ công để kích hoạt theo nhu cầu (Manual Trigger / On-Demand):
     - `POST api/SlaTracking/trigger-scheduled-tasks` (hoặc `POST api/Configuration/run-scheduler`).
   - Tác vụ 1 — **Tự động chuyển hồ sơ hết hạn (`Auto-Expire`)**:
     - Quét tất cả hồ sơ `ACTIVE` có `ExpiryDate < DateOnly.FromDateTime(DateTime.Today)`.
     - Cập nhật `status = 'EXPIRED'`, cập nhật địa chỉ `CURRENT` tương ứng sang `OLD` hoặc `INACTIVE`.
     - Ghi nhận `AUDIT_LOG` (Action: `AUTO_EXPIRE`, Entity: `REGISTRATION`).
     - Gửi thông báo đến sinh viên (Idempotent: kiểm tra để không gửi lặp).
   - Tác vụ 2 — **Cảnh báo sắp hết hạn ngoại trú (`Upcoming Expiry Reminder`)**:
     - Quét các hồ sơ `ACTIVE` có `ExpiryDate` trong vòng 15 ngày tới (`Today <= ExpiryDate <= Today + 15`).
     - Kiểm tra trong bảng `NOTIFICATION`: nếu trong vòng 15 ngày qua chưa gửi thông báo nhắc hạn cho hồ sơ này, tạo thông báo nhắc nhở sinh viên nộp đơn gia hạn.
   - Tác vụ 3 — **Quét SLA quá hạn và kích hoạt Escalation (`SLA Overdue & Escalation`)**:
     - Quét các bản ghi `SLA_TRACKING` có `status = 'IN_PROGRESS'` và `due_at < DateTime.Now`.
     - Chuyển `status = 'OVERDUE'`, gán `overdue_at = DateTime.Now`.
     - Tự động sinh bản ghi `ESCALATION` (nếu chưa có cho `sla_tracking_id` này):
       - `escalation_level = 1`, `status = 'OPEN'`, `reason = "Quá hạn xử lý SLA"`, gán cho Cán bộ/Reviewer/Admin.
     - Gửi thông báo cảnh báo cho tài khoản Cán bộ quản lý.
   - Bảo đảm tính **Idempotent**: Chạy nhiều lần liên tiếp không làm sinh bản ghi trùng hay sai lệch trạng thái.

5. **Hoàn thiện `NotificationService` và `AuditLogService` lưu cơ sở dữ liệu:**
   - Cập nhật `NotificationService.cs` thay thế `Console.WriteLine` bằng việc ghi trực tiếp vào `AppDbContext.Notifications`.
   - Tạo `IAuditLogService` và `AuditLogService` để chuẩn hóa việc ghi nhận nhật ký kiểm toán cho toàn bộ các thao tác nhạy cảm trong hệ thống.

---

### ƯU TIÊN P2 — Đồng bộ Giao diện Frontend
6. **Cập nhật Giao diện Cổng Sinh viên (`RequestPage.jsx`):**
   - Thêm nút hành động **"Hủy yêu cầu"** (kèm hộp thoại xác nhận) đối với các yêu cầu đang ở trạng thái `SUBMITTED` hoặc `DRAFT`.
   - Hiển thị phản hồi tức thì và cập nhật lại danh sách yêu cầu.
7. **Cập nhật Giao diện Cán bộ & Reviewer:**
   - Bổ sung nút bấm hoặc widget cho phép Cán bộ / Admin xem tình trạng Scheduler và kích hoạt chạy quét SLA / Hết hạn ngay trên giao diện nếu cần.

---

### ƯU TIÊN P3 — Sửa Cảnh báo Biên dịch & Kiểm thử Hệ thống
8. **Khắc phục triệt để các cảnh báo trình biên dịch:**
   - Sửa cảnh báo CS8629 trong `ReportService.cs`.
   - Sửa cảnh báo CS8602 trong `RequestController.cs`.
9. **Thực thi Kiểm thử Toàn diện (Kịch bản A - F):**
   - Kịch bản A: Sinh viên nộp hồ sơ, kiểm tra ngăn trùng lặp.
   - Kịch bản B: Cán bộ tiếp nhận và thẩm định hồ sơ (`PASS`, `REQUEST_INFO`, `REJECT`).
   - Kịch bản C: Người xét duyệt phê duyệt chính thức (`ACTIVE`).
   - Kịch bản D: Yêu cầu phát sinh: kiểm tra giới hạn 1 yêu cầu chờ, thử tạo trùng, duyệt `CHANGE_ADDRESS`/`RENEWAL`/`TERMINATION`, hủy yêu cầu.
   - Kịch bản E: Scheduler: chạy quét hồ sơ hết hạn, kiểm tra idempotent, quét SLA overdue & escalation.
   - Kịch bản F: Phân quyền & Bảo mật: sinh viên truy cập hồ sơ sinh viên khác, kiểm tra status code 403 Forbidden.
10. **Lập Báo cáo Kiểm thử (`TEST_REPORT.md`) và cập nhật `README.md`.**

---

## 2. TRẠNG THÁI HOÀN THÀNH THỰC TẾ (STATUS AS OF 25/10/2026)

| Hạng mục | Ưu tiên | Trạng thái | Ghi chú nghiệm thu |
| :--- | :---: | :---: | :---: |
| 1. API Tạo Yêu cầu (chặn trùng, max 1 pending, SLA, audit) | P0 | **HOÀN THÀNH** | Đã bọc Transaction, test case TC-D01 & TC-D02 Passed 100% |
| 2. API Hủy Yêu cầu phát sinh (`CancelRequest`) | P0 | **HOÀN THÀNH** | Test case TC-D03 & TC-D04 Passed, SLA chuyển CANCELLED |
| 3. API Rút Hồ sơ ngoại trú (`WithdrawRegistration`) | P0 | **HOÀN THÀNH** | Test case TC-A03 Passed, cập nhật WITHDRAWN và Audit Log |
| 4. Background Scheduler Service (`SystemSchedulerService`) | P1 | **HOÀN THÀNH** | BackgroundService & manual trigger; Idempotent verified |
| 5. Centralized `AuditLogService` & Real `NotificationService` | P1 | **HOÀN THÀNH** | Lưu bảng AUDIT_LOG & NOTIFICATION; kiểm toán mọi hành vi |
| 6. Sửa Unique Index CCCD chủ trọ (`09-fix-v3.sql`) | P0 | **HOÀN THÀNH** | Chuyển sang Filtered Index, cho phép nhiều landlord để trống CCCD |
| 7. Cập nhật Frontend (`RequestPage.jsx`, `studentService.js`) | P2 | **HOÀN THÀNH** | Bổ sung nút "Hủy yêu cầu" & "Rút hồ sơ" với confirm modal |
| 8. Khắc phục cảnh báo biên dịch CS8629, CS8602 | P3 | **HOÀN THÀNH** | `dotnet build` đạt 0 Warning, 0 Error |
| 9. Thực thi kiểm thử tích hợp tự động 15/15 Test Cases | P3 | **HOÀN THÀNH** | 100% Pass trên SQL Server và Web API thật |
| 10. Hoàn thiện bộ tài liệu Audit & Báo cáo kiểm thử | P4 | **HOÀN THÀNH** | Đã tạo `PROJECT_AUDIT.md`, `FEATURE_MATRIX.md`, `TEST_REPORT.md` |

