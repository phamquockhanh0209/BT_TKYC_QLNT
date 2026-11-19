# BÁO CÁO KHẢO SÁT TOÀN DIỆN DỰ ÁN QLNT_TKYC (PROJECT AUDIT)

> **Dự án:** QLNT_TKYC – Hệ thống Quản lý Vòng đời Hồ sơ Sinh viên Ngoại trú  
> **Vai trò thực hiện:** Senior Software Engineer, Business Analyst & QA Engineer  
> **Thời điểm khảo sát:** 25/10/2026  
> **Phiên bản hệ thống:** v1.1.0  

---

## 1. TỔNG QUAN HỆ THỐNG VÀ CÔNG NGHỆ

### 1.1. Mục tiêu và phạm vi nghiệp vụ
Hệ thống **QLNT_TKYC** quản lý toàn diện vòng đời hồ sơ ngoại trú của sinh viên, từ khai báo ban đầu, kiểm tra sơ bộ, thẩm định hồ sơ, phê duyệt, kích hoạt nơi ở hợp lệ, theo dõi thời hạn (SLA & thời hạn cư trú), quản lý yêu cầu phát sinh (Gia hạn, Chuyển nơi ở, Kết thúc ngoại trú), cảnh báo và xử lý quá hạn tự động, cho tới khi hồ sơ kết thúc hoặc hết hạn.

### 1.2. Kiến trúc và Công nghệ thực tế
- **Cơ sở dữ liệu:** Microsoft SQL Server (Instance: `Khánh\SQLEXPRESS01`, Database: `QLNT_TKYC`).
  - Tổng cộng **20 bảng** chuẩn hóa (3NF).
  - Khóa chính, Khóa ngoại, CHECK Constraints, DEFAULT Constraints và các chỉ mục (Indexes) phục vụ truy vấn và ràng buộc dữ liệu.
- **Backend:** ASP.NET Core Web API (.NET 10.0), C#.
  - ORM: Entity Framework Core 10 (SQL Server Provider).
  - Xác thực & Phân quyền: JSON Web Token (JWT) Bearer, Role-based Claims kết hợp Service kiểm soát phạm vi truy cập dữ liệu (`AccessControlService`).
  - Validation: FluentValidation + Data Annotations.
  - Logging: Microsoft.Extensions.Logging.
  - Cổng Kestrel: `http://localhost:5005`.
- **Frontend:** Single Page Application (SPA) xây dựng trên React 18 + Vite v5.4.
  - Styling: Bootstrap 5.3 kết hợp Vanilla CSS Custom Design System (`variables.css`, `custom.css`, `stepper.css`), Lucide React icons, Bootstrap Icons.
  - Cấu trúc: 3 cổng phân quyền rõ rệt:
    1. **Cổng Sinh viên (`/overview`)**: Khai báo nơi ở, nộp hồ sơ, đính kèm giấy tờ, theo dõi trạng thái tiến trình 5 bước, gửi yêu cầu phát sinh.
    2. **Cổng Cán bộ Tiếp nhận & Xử lý (`/officer/dashboard`)**: Hàng đợi công việc (Work Queue), lọc hồ sơ, cảnh báo SLA khẩn cấp, biểu đồ phân phối trạng thái, tiếp nhận và kiểm tra chi tiết.
    3. **Cổng Thẩm định / Reviewer (`/reviewer/workspace`)**: Bàn làm việc thẩm định chuyên sâu 3 cột ("Một hồ sơ → Kiểm tra kỹ lưỡng → Ra quyết định"), timeline 5 bước, đối chiếu tài liệu và phê duyệt.
- **Tài liệu đặc tả nghiệp vụ:** Thư mục `docs/`:
  - `01-business/`: Business flow, overview, glossary, thuyết minh trực quan luồng hệ thống.
  - `02-requirements/`: Yêu cầu chức năng, phi chức năng, ràng buộc nghiệp vụ, ma trận truy vết.
  - `03-use-case/`: Danh sách mã Use Case (`UC-AUTH`, `UC-REG`, `UC-OFF`, `UC-APP`, `UC-REQ`, `UC-DOC`, `UC-NOT`, `UC-SLA`, `UC-SYS`, `UC-SUP`, `UC-SIS`), actors và đặc tả chi tiết.
  - `bug-fix/`: Nhật ký giải quyết sự cố P0 giai đoạn trước (`BUG_FIX_LOG.md`).

---

## 2. HIỆN TRẠNG TRIỂN KHAI VÀ ĐỐI CHIẾU MÃ NGUỒN

### 2.1. Tình trạng Database (20 bảng)
| Tên bảng | Số lượng bản ghi hiện tại | Đánh giá hiện trạng |
|---|---|---|
| `[USER]` | 53 | Có đầy đủ tài khoản Admin, Officer, Reviewer và 50 Sinh viên mẫu. |
| `ROLE` | 4 | `STUDENT`, `OFFICER`, `ADMIN`, `REVIEWER`. Khớp nghiệp vụ. |
| `PERMISSION` | 8 | Các quyền chi tiết từ đăng ký, duyệt, quản lý tài liệu đến cấu hình. |
| `USER_ROLE` | 53 | Liên kết phân vai người dùng hợp lệ. |
| `ROLE_PERMISSION` | 18 | Phân quyền tương ứng từng Role. |
| `STUDENT` | 93 | Dữ liệu sinh viên chuẩn hóa từ nguồn SIS (MSSV, họ tên, lớp, khoa, ngày sinh). |
| `STUDENT_CACHE` | 5 | Bộ đệm tra cứu sinh viên. |
| `LANDLORD` | 15 | Dữ liệu chủ trọ (họ tên, CCCD, SĐT, ghi chú). Không tạo tài khoản đăng nhập theo đúng nguyên tắc. |
| `REGISTRATION` | 64 | Hồ sơ ngoại trú ở các trạng thái: `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `NEED_MORE_INFO`, `APPROVED`, `ACTIVE`, `REJECTED`, `EXPIRED`, `TERMINATED`. |
| `ADDRESS` | 60 | Địa chỉ nơi ở: `CURRENT`, `OLD`, `INACTIVE`. Khóa ngoại liên kết `REGISTRATION` và `LANDLORD`. |
| `DOCUMENT` | 85 | Giấy tờ đăng ký ngoại trú (Hợp đồng thuê, CT07, CCCD, Ảnh phòng trọ). |
| `DOCUMENT_VERSION` | 42 | Quản lý phiên bản tài liệu (v1, v2...) kèm file hash SHA-256. |
| `REQUEST` | 29 | Yêu cầu phát sinh: `RENEWAL`, `CHANGE_ADDRESS`, `TERMINATION`. |
| `REQUEST_HISTORY` | 29 | Lịch sử chuyển trạng thái yêu cầu (`old_status` → `new_status`). |
| `APPROVAL` | 22 | Quyết định phê duyệt hồ sơ và yêu cầu của Cán bộ / Reviewer. |
| `SLA_TRACKING` | 56 | Theo dõi SLA 48h - 72h cho hồ sơ và yêu cầu. |
| `ESCALATION` | 1 | Bản ghi leo thang khi quá hạn xử lý SLA. |
| `NOTIFICATION` | 23 | Thông báo gửi tới tài khoản người dùng (`is_read`, loại thông báo). |
| `AUDIT_LOG` | 1 | Bảng nhật ký kiểm toán hệ thống. |
| `CONFIGURATION` | 3 | Cấu hình tham số nghiệp vụ hệ thống. |

---

## 3. CÁC VẤN ĐỀ VÀ THIẾU SÓT PHÁT HIỆN QUA KHẢO SÁT

Qua quá trình rà soát đối chiếu tài liệu đặc tả nghiệp vụ (`business-flow.md`, `business-rules`, `use-case-list.md`) với mã nguồn thực tế tại Backend và Frontend, các vấn đề kỹ thuật và nghiệp vụ được phân loại như sau:

### 3.1. Nhóm P0 — Rủi ro Nghiệp vụ & Dữ liệu
1. **Thiếu ràng buộc giới hạn yêu cầu phát sinh (REQUEST):**
   - *Tài liệu đặc tả (Mục 7 Use Case & Quy tắc 4.3):* Mỗi hồ sơ ngoại trú đang hoạt động (`ACTIVE`) chỉ được có **tối đa một yêu cầu đang chờ xử lý** (`SUBMITTED`, `UNDER_REVIEW`, `PROCESSING`, `NEED_MORE_INFO`).
   - *Mã nguồn ban đầu:* Phương thức `CreateRequest` trong `RequestController.cs` chưa kiểm tra xem hồ sơ đã có request đang chờ hay chưa, và chưa kiểm tra trạng thái hồ sơ phải là `ACTIVE`/`APPROVED`. Sinh viên có thể vô tình hoặc cố ý spam liên tiếp nhiều yêu cầu `CHANGE_ADDRESS` hoặc `RENEWAL` đè lên nhau.
   - *Rủi ro tương tranh (Concurrency):* Chưa có cơ chế khóa/kiểm tra chống hai request gửi đồng thời (race condition).

2. **Thiếu luồng Sinh viên hủy yêu cầu phát sinh (`CancelRequest`):**
   - *Tài liệu đặc tả (Quy tắc 4.3):* Yêu cầu ở trạng thái `DRAFT` hoặc `SUBMITTED` được sinh viên tự hủy khi chưa được cán bộ xử lý.
   - *Mã nguồn ban đầu:* Chưa có endpoint `POST api/Request/{id}/cancel` trong `RequestController.cs` và chưa có nút bấm hủy tương ứng tại giao diện `RequestPage.jsx`.

3. **Thiếu luồng Sinh viên rút hồ sơ ngoại trú (`WithdrawRegistration`):**
   - *Tài liệu đặc tả (UC-REG-11, UC-REG-12, UC-REG-13):* Sinh viên có quyền rút hồ sơ khi hồ sơ ở trạng thái `DRAFT` hoặc `SUBMITTED` (chưa vào vòng thẩm định). Hồ sơ đã `ACTIVE` không được rút mà phải làm thủ tục `TERMINATION`.
   - *Mã nguồn ban đầu:* `RegistrationService.cs` đã có phương thức `WithdrawRegistrationAsync` nhưng tại `RegistrationController.cs` chưa có API endpoint phơi ra ngoài cho Client gọi, và giao diện chưa có nút tương ứng.

### 3.2. Nhóm P1 — Tác vụ tự động (Scheduler) và Bền vững thông báo
4. **Chưa có Background Service / Scheduler vận hành thực tế:**
   - *Tài liệu đặc tả (Mục 11 Automatic Expiration, Mục 10 SLA, Mục 4.4 Quy tắc):*
     - Định kỳ tự động quét các hồ sơ `ACTIVE` đã quá hạn cư trú (`ExpiryDate < Today`) để chuyển trạng thái sang `EXPIRED`.
     - Tự động phát hiện các hồ sơ sắp hết hạn (trong vòng 15 ngày) để gửi thông báo nhắc sinh viên làm thủ tục gia hạn.
     - Quét các bản ghi `SLA_TRACKING` ở trạng thái `IN_PROGRESS` đã quá thời hạn `DueAt` để chuyển sang `OVERDUE` và tự động sinh bản ghi `ESCALATION` cho cấp quản lý.
   - *Mã nguồn ban đầu:* Chưa đăng ký `IHostedService` hay `BackgroundService` nào trong ASP.NET Core pipeline (`Program.cs`). Chưa có cơ chế chạy kiểm tra định kỳ cũng như trigger thủ công cho Admin/Officer để test.
   - *Tính Idempotent:* Cần bảo đảm khi Scheduler chạy nhiều lần liên tiếp không làm phát sinh trùng lặp thông báo hay nhân bản bản ghi `ESCALATION`.

5. **`NotificationService` chưa ghi dữ liệu vào Database:**
   - *Mã nguồn ban đầu:* Trong `NotificationService.cs`, phương thức `SendAsync` chỉ ghi `Console.WriteLine` dạng placeholder, dẫn đến các thông báo do `RegistrationService` phát ra không được lưu vào bảng `NOTIFICATION` của cơ sở dữ liệu.

### 3.3. Nhóm P2 — Nhật ký kiểm toán tập trung (Centralized Audit Log)
6. **Thao tác nhạy cảm chưa được ghi vết vào `AUDIT_LOG`:**
   - Các thao tác: Phê duyệt hồ sơ (`APPROVE`), Thẩm định chuyển tiếp (`PASS`), Yêu cầu bổ sung (`REQUEST_INFO`), Từ chối hồ sơ (`REJECT`), Phê duyệt yêu cầu (`ApproveRequest`), Từ chối yêu cầu (`RejectRequest`), Tự động hết hạn (`AUTO_EXPIRE`) hiện chưa tự động sinh bản ghi vào bảng `AUDIT_LOG`.

### 3.4. Nhóm P3 — Cảnh báo Trình biên dịch & Hoàn thiện giao diện
7. **Cảnh báo Nullable của trình biên dịch .NET:**
   - `ReportService.cs(148,54)`: CS8629 Nullable value type may be null.
   - `RequestController.cs(140,41)`: CS8602 Dereference of a possibly null reference.
8. **Đồng bộ giao diện Frontend:**
   - Bổ sung nút "Hủy yêu cầu" cho sinh viên trên màn hình `RequestPage.jsx` khi yêu cầu ở trạng thái `SUBMITTED`.
   - Bổ sung nút "Rút hồ sơ" trên giao diện sinh viên khi hồ sơ chưa được xử lý.
   - Cung cấp giao diện / chức năng kích hoạt và xem trạng thái Scheduler cho Quản trị viên / Cán bộ.

---

## 4. KẾT LUẬN VÀ HƯỚNG XỬ LÝ
Dự án đã có nền tảng kiến trúc vững chắc, database 20 bảng đầy đủ quan hệ và dữ liệu mẫu phong phú. Giao diện frontend được chia vai trò rõ ràng, thẩm mỹ cao.
Các lỗi và điểm thiếu sót chủ yếu tập trung ở:
1. Ràng buộc tiền điều kiện và điểm cuối cho Request (ngăn tạo trùng, cho phép hủy).
2. Tác vụ ngầm tự động (Scheduler) cho SLA overdue và Auto-expiration.
3. Đồng bộ dịch vụ thông báo và audit log vào cơ sở dữ liệu.

Các hạng mục này hoàn toàn có thể khắc phục triệt để và an toàn trực tiếp trên mã nguồn hiện tại mà không làm phá vỡ kiến trúc gốc hay làm mất dữ liệu hiện hữu.
