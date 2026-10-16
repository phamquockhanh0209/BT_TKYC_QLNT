# PROJECT_CONTEXT.md — Bản đồ làm việc sống

> **Dành cho AI agent:** Đọc file này TRƯỚC KHI đọc bất kỳ file code nào. File này chứa đầy đủ tiến độ, lỗi cần sửa, và hướng dẫn từng giai đoạn. Sau khi hoàn thành mỗi giai đoạn, cập nhật trạng thái `[x]` tương ứng.
>
> **Cập nhật lần cuối:** 25/09/2026 — Giai đoạn 2 HOÀN THÀNH. Bắt đầu Giai đoạn 3 (Audit Log + Scheduler).

---

## 1. TỔNG QUAN PROJECT

| Thuộc tính | Giá trị |
|---|---|
| **Tên đề tài** | Quản lý Sinh viên Ngoại trú (QLNT) |
| **Môn học** | Phân tích Thiết kế Theo Yêu cầu (PTTKYC) |
| **Mục đích** | Chuẩn bị đồ án bảo vệ — giảng viên chấm nghiêm về nghiệp vụ |
| **Backend** | ASP.NET Core 8, Entity Framework Core, JWT, BCrypt |
| **Frontend** | React + Vite, Axios |
| **Database** | SQL Server (T-SQL) |
| **Thư mục gốc** | `c:\Users\quoc_\Downloads\QLNT_TKYC\` |

### 7 Actors

| Actor | Role DB | Mô tả |
|---|---|---|
| **Sinh viên** | `STUDENT` | Nộp hồ sơ, gửi request, xem trạng thái |
| **Cán bộ tiếp nhận** | `RECEIVER` | Tiếp nhận hồ sơ giấy, nhập hệ thống |
| **Cán bộ xử lý** | `OFFICER` | Xử lý nghiệp vụ ban đầu |
| **Cán bộ thẩm định** | `PROCESSOR` | Thẩm định nội dung hồ sơ |
| **Kiểm duyệt viên** | `REVIEWER` | Review hồ sơ trước khi duyệt |
| **Phê duyệt** | `APPROVER` | Phê duyệt hồ sơ thường |
| **Phê duyệt cấp cao** | `SENIOR_APPROVER` | Phê duyệt hồ sơ cần leo thang |
| **Quản trị** | `ADMIN` | Quản lý hệ thống, seed data |

---

## 2. CẤU TRÚC THƯ MỤC ĐẦY ĐỦ

```
QLNT_TKYC\
│
├── AI_CONTEXT.md\                    ← THƯ MỤC (chứa file này)
│   └── PROJECT_CONTEXT.md            ← FILE NÀY
│
├── BAOCAO_PTTKYC.docx                ← Báo cáo Word chính thức (Chương 6 & 7 BỎ TRỐNG)
├── scratch_baocao.txt                ← Text trích xuất từ DOCX (758 dòng)
│                                        → Chương 6 (dòng 745): trống
│                                        → Chương 7 (dòng 747-748): trống
│
├── database\
│   ├── 01-create-tables.sql          ← 21 bảng (1051 dòng)
│   │                                    ⚠️ LỖI: CK_REGISTRATION_STATUS thiếu ACTIVE, WITHDRAWN (dòng 309-323)
│   │                                    ⚠️ LỖI: CK_REQUEST_TYPE: DB dùng RENEW/CHANGE_ADDRESS/TERMINATE
│   │                                           nhưng Constants enum dùng RENEWAL/CHANGE_ADDRESS/TERMINATION
│   ├── 02-create-indexes.sql         ← Index cho performance (không có lỗi)
│   ├── 03-seed-data.sql              ← ⚠️ Mật khẩu THÔ 'HASH_STUDENT_01' — KHÔNG dùng BCrypt → không đăng nhập được
│   ├── 04-test-database.sql          ← Script test, không ảnh hưởng production
│   ├── 05-seed-structured-students.sql ← Seed 48 SV chuẩn MSSV (BCrypt ĐÚNG)
│   └── 06-add-student-avatar.sql     ← ALTER TABLE REGISTRATION thêm cột avatar_path
│
├── docs\
│   ├── 01-business\
│   │   └── business-flow.md          ← 24 luồng nghiệp vụ chi tiết (1332 dòng) — TÀI LIỆU CHÍNH
│   ├── 02-requirements\
│   │   └── functional-requirements.md ← FR-AUTH, FR-REGISTRATION, FR-REQUEST, FR-SLA, FR-AUDIT
│   ├── 03-use-case\
│   │   ├── actors.md                 ← 7 actors
│   │   ├── use-case-list.md          ← Danh sách ~30 UC
│   │   └── specifications\           ← 25+ file UC Specification (UC-01 → UC-25+)
│   ├── 04-dfd\                       ← RỖNG (chưa có DFD)
│   ├── 05-uml\                       ← RỖNG (chưa có Sequence, Activity, State Diagram)
│   ├── 06-database\                  ← RỖNG (chưa có ERD)
│   └── 07-project\                   ← Thông tin dự án, timeline
│
└── source\
    ├── backend\                      ← ASP.NET Core 8
    │   ├── Controllers\              ← 24 Controller file
    │   │   ├── AuthController.cs         ← Đăng nhập, tạo JWT (dòng 1-140)
    │   │   ├── RegistrationController.cs ← Luồng hồ sơ CHÍNH (593 dòng)
    │   │   │                                ⚠️ LỖI dòng 284: thiếu REVIEWER trong canApprove
    │   │   │                                ⚠️ LỖI dòng 310: status APPROVED thay vì ACTIVE
    │   │   ├── RequestController.cs      ← CRUD Request (128 dòng), không enforce 1 pending rule
    │   │   ├── RequestHistoryController.cs ← CRUD lịch sử (89 dòng), không tự động ghi
    │   │   ├── ApprovalController.cs     ← CRUD Approval (103 dòng)
    │   │   ├── DocumentController.cs     ← Upload file (294 dòng), SHA-256, DOCUMENT_VERSION
    │   │   ├── AddressController.cs      ← CRUD địa chỉ (251 dòng), chỉ staff tạo/sửa
    │   │   ├── LandlordController.cs     ← CRUD chủ trọ (100 dòng)
    │   │   ├── NotificationController.cs ← Thông báo (135 dòng), mark đọc, CanAccessUser
    │   │   ├── EscalationController.cs   ← Leo thang (82 dòng), chỉ ADMIN/OFFICER
    │   │   ├── AuditLogController.cs     ← ⚠️ LỖI: có PUT+DELETE (dòng 52-79) — vi phạm bảo mật
    │   │   ├── SeedDataController.cs     ← Seed data (563 dòng), không cần auth
    │   │   ├── StudentCacheController.cs ← CRUD StudentCache (87 dòng), không sync sang STUDENT
    │   │   ├── StudentsController.cs     ← Upload avatar, by-code (150 dòng)
    │   │   └── [10 Controller khác]
    │   │
    │   ├── Services\
    │   │   ├── Implementations\
    │   │   │   ├── RegistrationService.cs  ← ⚠️ DEAD CODE (156 dòng): 4 hàm nghiệp vụ đúng
    │   │   │   │                              nhưng Controller không inject → không được gọi
    │   │   │   ├── DocumentService.cs      ← Upload (147 dòng): SHA-256, DOCUMENT_VERSION, max 10MB
    │   │   │   ├── SlaService.cs           ← SLA 72h (49 dòng): StartSLA, MarkCompleted
    │   │   │   ├── AccessControlService.cs ← Phân quyền (80 dòng): Staff xem tất cả, SV chỉ xem hồ sơ mình
    │   │   │   └── [2 Service khác]
    │   │   └── Interfaces\               ← 6 interface file
    │   │
    │   ├── Models\                       ← 14 Model file (entity mapping)
    │   ├── DTOs\                         ← Request/Response DTO
    │   ├── Data\
    │   │   └── AppDbContext.cs           ← EF Core DbContext, 21 DbSet
    │   ├── Common\Constants\
    │   │   └── RegistrationConstants.cs  ← Enum đủ 10 trạng thái (gồm ACTIVE, WITHDRAWN)
    │   │                                    Enum RequestType: RENEWAL, CHANGE_ADDRESS, TERMINATION
    │   └── Program.cs                    ← DI container, CORS, JWT config
    │
    └── frontend\                         ← React + Vite
        └── src\
            ├── pages\
            │   ├── student\
            │   │   ├── residence\
            │   │   │   └── ResidencePage.jsx     ← ⚠️ LỖI dòng 49: redirect sai trang khi báo chuyển trọ
            │   │   └── requests\
            │   │       └── RequestPage.jsx        ← ⚠️ Form chỉ có ô reason, thiếu ô địa chỉ mới
            │   ├── reviewer\
            │   │   └── workspace\
            │   │       ├── ReviewerWorkspacePage.jsx ← ⚠️ LỖI dòng 265: nút Phê duyệt gửi 'PASS' thay vì 'APPROVE'
            │   │       └── ReviewerActionButtons.jsx  ← 4 nút hành động reviewer
            │   └── officer\
            │       └── OfficerRequestsPage.jsx    ← ⚠️ Duyệt Request không cập nhật Registration
            └── [các trang khác]
```

---

## 3. BẢNG TIẾN ĐỘ 24 LUỒNG NGHIỆP VỤ

| ID | Tên Flow | Database | Backend | Frontend | Hoàn thiện | Lỗi / Thiếu |
|---|---|---|---|---|---|---|
| F01 | Đăng ký hồ sơ ngoại trú (online) | ✅ | ✅ | ✅ | 85% | Thiếu validate 1 hồ sơ active/student |
| F02 | Tiếp nhận hồ sơ giấy | ✅ | ✅ | ⚠️ | 70% | UI nhập thủ công chưa đầy đủ |
| F03 | Xử lý hồ sơ ban đầu (OFFICER) | ✅ | ✅ | ✅ | 80% | Logic SLA chưa tự khởi động |
| F04 | Thẩm định hồ sơ (PROCESSOR) | ✅ | ✅ | ⚠️ | 75% | Không lưu audit tự động |
| F05 | Kiểm duyệt hồ sơ (REVIEWER) | ✅ | ✅ | ✅ | 90% | OK |
| F06 | Phê duyệt hồ sơ (APPROVER) | ✅ | ✅ | ✅ | 90% | OK |
| F07 | Phê duyệt cấp cao (SENIOR_APPROVER) | ✅ | ✅ | ⚠️ | 70% | UI chưa có nút escalate rõ ràng |
| F08 | Yêu cầu bổ sung thông tin | ✅ | ✅ | ✅ | 90% | Đã cập nhật |
| F09 | Sinh viên nộp lại hồ sơ (Resubmit) | ✅ | ✅ | ✅ | 90% | Đã thêm API endpoint và gọi Service |
| F10 | Từ chối hồ sơ (REJECT) | ✅ | ✅ | ✅ | 85% | Không ghi audit tự động |
| F11 | Kích hoạt hồ sơ (ACTIVE) | ✅ | ✅ | ✅ | 90% | Đã fix DB CHECK Constraint |
| F12 | Gia hạn hồ sơ (RENEWAL Request) | ✅ | ✅ | ✅ | 90% | Đã fix request_type và tự cập nhật expiry_date |
| F13 | Báo chuyển trọ (CHANGE_ADDRESS) | ✅ | ✅ | ✅ | 90% | Đã thêm cột DB, UI redirect đúng, tạo địa chỉ mới tự động |
| F14 | Chấm dứt hợp đồng (TERMINATION) | ✅ | ✅ | ✅ | 90% | Đã fix type và chuyển sang TERMINATED |
| F15 | Sinh viên rút hồ sơ (WITHDRAWN) | ⚠️ | ❌ | ❌ | **20%** | DB CHECK đã thêm WITHDRAWN; chưa có API/UI |
| F16 | Hồ sơ hết hạn tự động (EXPIRED) | ✅ | ❌ | ❌ | **15%** | Không có BackgroundService/Scheduler |
| F17 | Leo thang hồ sơ (Escalation) | ✅ | ✅ | ⚠️ | 70% | UI chưa rõ ràng |
| F18 | Quản lý tài liệu đính kèm | ✅ | ✅ | ✅ | 85% | OK, DocumentService hoàn chỉnh |
| F19 | Theo dõi SLA | ✅ | ⚠️ | ❌ | 50% | SlaService có nhưng không được Controller gọi đúng chỗ |
| F20 | Ghi nhật ký kiểm toán (Audit Log) | ✅ | ⚠️ | ❌ | **40%** | Có endpoint nhưng KHÔNG tự ghi; có PUT+DELETE vi phạm bảo mật |
| F21 | Thông báo (Notification) | ✅ | ✅ | ✅ | 80% | Không tự gửi notification khi state change |
| F22 | Quản lý chủ trọ | ✅ | ✅ | ✅ | 85% | OK |
| F23 | Quản lý địa chỉ ngoại trú | ✅ | ✅ | ✅ | 80% | OK |
| F24 | Báo cáo thống kê | ✅ | ⚠️ | ⚠️ | 50% | Endpoint thống kê cơ bản; UI chưa biểu đồ đầy đủ |

**Chú thích:** ✅ Có / Đúng | ⚠️ Có nhưng lỗi/thiếu | ❌ Không có

---

## 4. STATE MACHINE — TRẠNG THÁI HỒ SƠ REGISTRATION

```
[DRAFT] ──nộp──────────────────────────────────────► [SUBMITTED]
                                                           │
                                          RECEIVER tiếp nhận│
                                                           ▼
                                                    [UNDER_REVIEW]
                                                     │         │
                              REVIEWER REQUEST_INFO  │         │ REVIEWER PASS
                                                     ▼         │
                                              [NEED_MORE_INFO] │
                                                     │         │
                              SV nộp lại (Resubmit)  │         │
                                                     └──────────► [UNDER_REVIEW]
                                                                       │
                                                     APPROVER APPROVE  │  APPROVER REJECT
                                                                       ▼                  ▼
                                                                   [APPROVED] ──kích hoạt──► [ACTIVE]
                                                                                                │
                                              ┌─────────────────────────────────────────────────┤
                                              │                                                 │
                                    SV rút ───►[WITHDRAWN]                          hết hạn────►[EXPIRED]
                                              │                                                 │
                                    SV terminate ──────────────────────────────────────────────►[TERMINATED]
```

### Trạng thái hồ sơ (RegistrationStatus Enum — RegistrationConstants.cs)
1. `DRAFT` — Sinh viên tạo nháp
2. `SUBMITTED` — Đã nộp
3. `UNDER_REVIEW` — Đang thẩm định
4. `NEED_MORE_INFO` — Cần bổ sung
5. `APPROVED` — Đã phê duyệt (chờ kích hoạt)
6. `ACTIVE` — **Đang hoạt động** ← **THIẾU trong DB CHECK Constraint**
7. `REJECTED` — Bị từ chối
8. `WITHDRAWN` — Sinh viên rút ← **THIẾU trong DB CHECK Constraint**
9. `EXPIRED` — Hết hạn (tự động)
10. `TERMINATED` — Chấm dứt (theo Request TERMINATION)

### Trạng thái Request
- `PENDING` → `APPROVED` / `REJECTED`

---

## 5. DANH SÁCH LỖI CẦN SỬA — PHÂN THEO GIAI ĐOẠN

---

### 🔴 GIAI ĐOẠN 1 — Thông suốt mạch sống cốt lõi (ƯU TIÊN CAO NHẤT)

#### Lỗi 1 — DB CHECK Constraint thiếu trạng thái
- **File:** `database/01-create-tables.sql` dòng **309-323**
- **Vấn đề:** `CK_REGISTRATION_STATUS` chỉ có 8 giá trị, thiếu `'ACTIVE'` và `'WITHDRAWN'`
- **Fix:**
  ```sql
  ALTER TABLE REGISTRATION DROP CONSTRAINT CK_REGISTRATION_STATUS;
  ALTER TABLE REGISTRATION ADD CONSTRAINT CK_REGISTRATION_STATUS
    CHECK (status IN ('DRAFT','SUBMITTED','UNDER_REVIEW','NEED_MORE_INFO',
                      'APPROVED','ACTIVE','REJECTED','WITHDRAWN','EXPIRED','TERMINATED'));
  ```
- **Trạng thái:** `[ ]`

#### Lỗi 2 — Phân quyền REVIEWER bị chặn action APPROVE
- **File:** `source/backend/Controllers/RegistrationController.cs` dòng **284**
- **Vấn đề:** `canApprove` thiếu `User.IsInRole("REVIEWER")`
- **Fix:**
  ```csharp
  // Dòng 284 — thay thế dòng hiện tại
  canApprove = User.IsInRole("ADMIN") || User.IsInRole("APPROVER") ||
               User.IsInRole("SENIOR_APPROVER") || User.IsInRole("REVIEWER");
  ```
- **Trạng thái:** `[ ]`

#### Lỗi 3 — Nút "Phê duyệt" của Reviewer gửi sai action
- **File A:** `source/frontend/src/pages/reviewer/workspace/ReviewerWorkspacePage.jsx` dòng **265**
- **Vấn đề:** `openActionModal('PASS')` → status về `UNDER_REVIEW` thay vì kích hoạt hồ sơ
- **Fix A:**
  ```jsx
  // Dòng 265 — đổi 'PASS' thành 'APPROVE'
  onApprove={() => openActionModal('APPROVE')}
  ```
- **File B:** `source/backend/Controllers/RegistrationController.cs` dòng **310**
- **Vấn đề:** Khi action = `APPROVE`, `newStatus = "APPROVED"` — phải là `"ACTIVE"`
- **Fix B:**
  ```csharp
  // Dòng 310
  case "APPROVE":
      newStatus = "ACTIVE"; // Đổi từ "APPROVED" thành "ACTIVE"
      break;
  ```
- **Trạng thái:** `[ ]`

---

### 🟠 GIAI ĐOẠN 2 — Hoàn thiện nhóm Request (CHANGE_ADDRESS, RENEWAL, TERMINATION)

#### Lỗi 4 — Request type mismatch giữa DB và Constants
- **File A:** `database/01-create-tables.sql` — DB CHECK: `'RENEW', 'CHANGE_ADDRESS', 'TERMINATE'`
- **File B:** `source/backend/Common/Constants/RegistrationConstants.cs` — Enum: `RENEWAL, CHANGE_ADDRESS, TERMINATION`
- **Vấn đề:** RENEW ≠ RENEWAL; TERMINATE ≠ TERMINATION → INSERT Request sẽ fail CHECK constraint
- **Fix:** Chọn 1 chuẩn (khuyến nghị theo Constants) và cập nhật DB CHECK:
  ```sql
  ALTER TABLE REQUEST DROP CONSTRAINT CK_REQUEST_TYPE;
  ALTER TABLE REQUEST ADD CONSTRAINT CK_REQUEST_TYPE
    CHECK (request_type IN ('RENEWAL','CHANGE_ADDRESS','TERMINATION'));
  ```
- **Trạng thái:** `[ ]`

#### Lỗi 5 — Bảng REQUEST thiếu cột địa chỉ mới cho CHANGE_ADDRESS
- **File:** `database/01-create-tables.sql`
- **Vấn đề:** Bảng `REQUEST` chỉ có cột `reason TEXT`, không có cột lưu địa chỉ mới đề xuất
- **Fix:**
  ```sql
  ALTER TABLE REQUEST
    ADD new_address_line NVARCHAR(500),
        new_ward         NVARCHAR(100),
        new_district     NVARCHAR(100),
        new_city         NVARCHAR(100),
        new_landlord_id  INT REFERENCES LANDLORD(landlord_id);
  ```
- **Trạng thái:** `[ ]`

#### Lỗi 6 — Nút "Báo chuyển trọ" redirect sai trang
- **File:** `source/frontend/src/pages/student/residence/ResidencePage.jsx` dòng **49**
- **Vấn đề:** `window.location.assign('/registration')` → tạo hồ sơ MỚI thay vì tạo Request CHANGE_ADDRESS
- **Fix:** Mở modal tạo Request CHANGE_ADDRESS (có form nhập địa chỉ mới + lý do)
- **Trạng thái:** `[ ]`

#### Lỗi 7 — Form tạo Request thiếu ô địa chỉ mới
- **File:** `source/frontend/src/pages/student/requests/RequestPage.jsx`
- **Vấn đề:** Form chỉ có ô `reason`, không có ô địa chỉ mới → CHANGE_ADDRESS Request không đầy đủ
- **Fix:** Thêm fields địa chỉ mới khi `request_type === 'CHANGE_ADDRESS'`
- **Trạng thái:** `[ ]`

#### Lỗi 8 — Duyệt Request không tác động lên Registration
- **File:** `source/frontend/src/pages/officer/OfficerRequestsPage.jsx`
- **Vấn đề:** Duyệt Request chỉ gọi `PUT /api/Request/{id}` đổi `status = 'APPROVED'`, không:
  - Cập nhật `expiry_date` cho RENEWAL
  - Chuyển địa chỉ cho CHANGE_ADDRESS
  - Chuyển Registration sang `TERMINATED` cho TERMINATION
- **Fix:** Sau khi duyệt Request, gọi thêm `PATCH /api/Registration/{reg_id}/apply-request`
- **Trạng thái:** `[ ]`

#### Lỗi 9 — Thiếu endpoint resubmit cho sinh viên
- **File:** `source/backend/Services/Implementations/RegistrationService.cs` — `ResubmitRegistrationAsync` đã có code
- **Vấn đề:** `RegistrationController.cs` không có route `POST /api/Registration/{id}/resubmit`
- **Fix:** Thêm action vào Controller:
  ```csharp
  [HttpPost("{id}/resubmit")]
  [Authorize(Roles = "STUDENT")]
  public async Task<IActionResult> ResubmitRegistration(int id, [FromBody] ResubmitDto dto)
  ```
- **Trạng thái:** `[ ]`

---

### 🟡 GIAI ĐOẠN 3 — Audit Log + Scheduler

#### Lỗi 10 — AuditLog có endpoint PUT và DELETE (vi phạm bảo mật)
- **File:** `source/backend/Controllers/AuditLogController.cs` dòng **52-79**
- **Vấn đề:** Audit trail phải là append-only, không được phép sửa/xóa
- **Fix:** Xóa hoặc đặt `[NonAction]` cho `UpdateAuditLog` và `DeleteAuditLog`
- **Trạng thái:** `[ ]`

#### Lỗi 11 — Audit Log không được ghi tự động khi state change
- **File:** `source/backend/Controllers/RegistrationController.cs` — action `review-action`
- **Vấn đề:** Khi state thay đổi, không có lệnh INSERT vào bảng `AUDIT_LOG`
- **Fix:** Sau mỗi state transition, gọi:
  ```csharp
  await _context.AuditLogs.AddAsync(new AuditLog {
      registration_id = id,
      actor_id = currentUserId,
      action = action,
      old_status = oldStatus,
      new_status = newStatus,
      timestamp = DateTime.UtcNow
  });
  ```
- **Trạng thái:** `[ ]`

#### Lỗi 12 — Không có Scheduler để tự động chuyển EXPIRED
- **Vấn đề:** Không có class nào kế thừa `BackgroundService` hay `IHostedService`
- **Fix:** Tạo `source/backend/Services/Implementations/ExpirationSchedulerService.cs`:
  ```csharp
  public class ExpirationSchedulerService : BackgroundService {
      protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
          // Mỗi 1 giờ: UPDATE Registration SET status='EXPIRED' WHERE expiry_date < NOW() AND status='ACTIVE'
      }
  }
  ```
  Và đăng ký trong `Program.cs`: `builder.Services.AddHostedService<ExpirationSchedulerService>();`
- **Trạng thái:** `[ ]`

---

### 🟢 GIAI ĐOẠN 4 — Báo cáo Word (Chương 6 & 7)

#### Lỗi 13 — Chương 6 (Kiểm thử) bỏ trống
- **File:** `BAOCAO_PTTKYC.docx` — Chương 6 trống hoàn toàn
- **Nội dung cần viết:**
  - Test case cho UC-01 (Đăng nhập), UC-02 (Nộp hồ sơ), UC-05 (Phê duyệt)
  - Kết quả kiểm thử (bảng Pass/Fail)
  - Kiểm thử giao diện (screenshot)
- **Trạng thái:** `[ ]`

#### Lỗi 14 — Chương 7 (Kết luận) bỏ trống
- **File:** `BAOCAO_PTTKYC.docx` — Chương 7 trống hoàn toàn
- **Nội dung cần viết:**
  - Kết quả đạt được
  - Hạn chế
  - Hướng phát triển
- **Trạng thái:** `[ ]`

---

### 🔵 LỖI PHỤ (sửa nếu có thời gian)

#### Lỗi 15 — RegistrationService.cs là Dead Code
- **File:** `source/backend/Services/Implementations/RegistrationService.cs`
- **Vấn đề:** Controller không inject `IRegistrationService`, 156 dòng không được gọi
- **Fix:** Inject service vào Controller và thay thế inline code bằng service call

#### Lỗi 16 — Seed SQL dùng mật khẩu thô
- **File:** `database/03-seed-data.sql`
- **Vấn đề:** `'HASH_STUDENT_01'` không phải BCrypt → không đăng nhập được
- **Fix:** Dùng seed BCrypt thông qua API: `POST /api/SeedData/seed-structured-students`

#### Lỗi 17 — StudentCache không sync sang STUDENT
- **File:** `source/backend/Controllers/StudentCacheController.cs`
- **Vấn đề:** CRUD StudentCache (bảng cache từ hệ thống trường) nhưng không có cơ chế đồng bộ sang bảng STUDENT
- **Fix:** Thêm endpoint `POST /api/StudentCache/sync` để chuyển cache → STUDENT record

---

## 6. HƯỚNG DẪN THỰC THI CHO AI AGENT

### Trước khi bắt đầu mỗi giai đoạn
1. Đọc lại phần **"DANH SÁCH LỖI"** của giai đoạn tương ứng
2. Đọc file nguồn liên quan (chỉ cần đọc dòng được ghi chú, không cần đọc toàn bộ)
3. Thực hiện fix theo hướng dẫn
4. Đánh dấu `[x]` vào checkbox sau khi fix xong
5. Cập nhật cột "Hoàn thiện" trong bảng tiến độ

### Checklist Giai đoạn 1 (Mạch sống cốt lõi)
- `[x]` Fix DB CHECK Constraint REGISTRATION (database/01-create-tables.sql dòng 309-323) ✅ Sửa trực tiếp + tạo 07-fix-constraints.sql
- `[x]` Fix DB CHECK Constraint REQUEST (database/01-create-tables.sql dòng 645-654) ✅ RENEW→RENEWAL, TERMINATE→TERMINATION
- `[x]` Fix phân quyền REVIEWER (RegistrationController.cs dòng 284) ✅ Đã có sẵn từ trước
- `[x]` Fix status ACTIVE backend (RegistrationController.cs dòng 319) ✅ Đã có sẵn từ trước
- `[x]` Nút "Phê duyệt" của Reviewer → **ĐÚNG NGHIỆP VỤ**: dùng PASS (chuyển cho Approver), không phải APPROVE
- `[ ]` Thêm cột địa chỉ mới vào bảng REQUEST (07-fix-constraints.sql đã có, cần chạy trên DB thực)
- `[ ]` Test end-to-end: Login reviewer → Mở hồ sơ → Click Phê duyệt → Hồ sơ chuyển ACTIVE

### Checklist Giai đoạn 2 (Request nhóm)
- `[x]` Fix Request type mismatch DB vs Constants
- `[x]` Thêm cột địa chỉ mới vào bảng REQUEST (ALTER TABLE)
- `[x]` Fix redirect nút "Báo chuyển trọ" (ResidencePage.jsx dòng 49)
- `[x]` Thêm fields địa chỉ vào form Request (RequestPage.jsx)
- `[x]` Fix logic duyệt Request tác động Registration (OfficerRequestsPage.jsx)
- `[x]` Thêm endpoint resubmit (RegistrationController.cs + IRegistrationService)

### Checklist Giai đoạn 3 (Audit + Scheduler)
- `[ ]` Xóa PUT/DELETE khỏi AuditLogController (dòng 52-79)
- `[ ]` Thêm ghi Audit tự động vào review-action trong RegistrationController
- `[ ]` Tạo ExpirationSchedulerService.cs (BackgroundService)
- `[ ]` Đăng ký scheduler trong Program.cs

### Checklist Giai đoạn 4 (Báo cáo)
- `[ ]` Viết Chương 6 — Kiểm thử (test case, kết quả)
- `[ ]` Viết Chương 7 — Kết luận (đạt được, hạn chế, hướng phát triển)

---

## 7. THÔNG TIN KỸ THUẬT QUAN TRỌNG

### JWT Claims Structure
```json
{
  "nameid": "<userId>",         // Dùng để lấy user hiện tại
  "unique_name": "<username>",  // Với STUDENT = studentCode (VD: SV001)
  "role": ["STUDENT"],          // Mảng roles
  "exp": "<unix_timestamp>"     // Hết hạn sau 2h
}
```

### AccessControlService Logic (quan trọng)
- Staff roles: `ADMIN, RECEIVER, OFFICER, PROCESSOR, REVIEWER, APPROVER, SENIOR_APPROVER`
- `CanAccessRegistrationAsync`: Nếu là Staff → xem tất cả; Nếu là Student → chỉ xem hồ sơ của mình
- `GetCurrentStudentAsync`: Lấy từ `User.Identity.Name` (username = studentCode)

### API Endpoints Quan trọng

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/api/Auth/login` | Đăng nhập, nhận JWT | Không |
| POST | `/api/Registration/submit-full` | Tạo hồ sơ + địa chỉ + SLA | STUDENT |
| POST | `/api/Registration/{id}/review-action` | Thay đổi trạng thái hồ sơ | Staff |
| GET | `/api/Registration` | Danh sách hồ sơ (filter status, search) | Đăng nhập |
| POST | `/api/Document/upload` | Upload file đính kèm | Đăng nhập |
| POST | `/api/SeedData/seed-structured-students` | Seed 48 SV BCrypt | Không cần auth |
| POST | `/api/SeedData/seed-all` | Seed 45 hồ sơ BCrypt | Không cần auth |

### Review-Action flow (RegistrationController.cs dòng ~280-350)
```
action = "PASS"         → newStatus = "UNDER_REVIEW"   (Reviewer chuyển cho Approver)
action = "REQUEST_INFO" → newStatus = "NEED_MORE_INFO"  (Yêu cầu bổ sung)
action = "REJECT"       → newStatus = "REJECTED"        (Từ chối)
action = "APPROVE"      → newStatus = "ACTIVE"          (⚠️ Hiện tại BUG: đang là "APPROVED")
```

---

*File này được tạo tự động bởi AI agent vào 25/09/2026. Cập nhật sau mỗi giai đoạn hoàn thành.*
