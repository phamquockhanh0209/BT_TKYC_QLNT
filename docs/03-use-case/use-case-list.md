# USE CASE LIST
# HỆ THỐNG QUẢN LÝ SINH VIÊN NGOẠI TRÚ

---

# 1. Mục đích

Tài liệu này liệt kê toàn bộ Use Case
của Website Quản lý Sinh viên Ngoại trú.

Use Case được phân nhóm theo:

- Authentication.
- Student Registration.
- Registration Processing.
- Registration Approval.
- Registration Request.
- Document Management.
- Notification.
- SLA & Escalation.
- SIS Integration.
- Administration.
- Reporting.

Mỗi Use Case có một mã định danh duy nhất.

Mã Use Case được sử dụng để liên kết:

```text
Business Rule
      ↓
Requirement
      ↓
Use Case
      ↓
Activity Diagram
      ↓
Sequence Diagram
      ↓
Implementation
2. Quy ước mã Use Case
UC-AUTH  = Authentication
UC-REG   = Registration
UC-OFF   = Officer Processing
UC-APP   = Approval
UC-REQ   = Request
UC-DOC   = Document
UC-NOT   = Notification
UC-SLA   = SLA & Escalation
UC-SIS   = SIS Integration
UC-ADM   = Administration
UC-RPT   = Reporting
3. Authentication
ID	Use Case	Actor chính	Mô tả
UC-AUTH-01	Đăng nhập	All Human Users	Đăng nhập vào Website
UC-AUTH-02	Đăng xuất	All Human Users	Kết thúc phiên đăng nhập
UC-AUTH-03	Xác thực phiên đăng nhập	System	Kiểm tra phiên đăng nhập
UC-AUTH-04	Phân quyền truy cập	System	Kiểm tra Role + Permission + Data Scope
4. Student Registration
4.1. Hồ sơ ngoại trú
ID	Use Case	Actor chính	Mô tả
UC-REG-01	Xem thông tin cá nhân	Student	Xem dữ liệu sinh viên từ SIS
UC-REG-02	Tạo hồ sơ ngoại trú	Student	Tạo Registration mới
UC-REG-03	Chỉnh sửa hồ sơ DRAFT	Student	Chỉnh sửa hồ sơ chưa gửi
UC-REG-04	Khai báo nơi ở	Student	Nhập thông tin nơi ở ngoại trú
UC-REG-05	Upload tài liệu	Student	Đính kèm giấy tờ
UC-REG-06	Gửi hồ sơ	Student	Gửi hồ sơ để nhà trường xử lý
UC-REG-07	Theo dõi hồ sơ	Student	Theo dõi trạng thái hồ sơ
UC-REG-08	Rút hồ sơ	Student	Rút hồ sơ khi đủ điều kiện
UC-REG-09	Bổ sung hồ sơ	Student	Bổ sung thông tin theo yêu cầu
UC-REG-10	Xem lịch sử hồ sơ	Student	Xem toàn bộ lịch sử xử lý
5. Registration Processing
5.1. Tiếp nhận
ID	Use Case	Actor chính	Mô tả
UC-OFF-01	Xem hồ sơ chờ tiếp nhận	Reception Officer	Xem hồ sơ SUBMITTED
UC-OFF-02	Kiểm tra sơ bộ hồ sơ	Reception Officer	Kiểm tra tính đầy đủ ban đầu
UC-OFF-03	Tiếp nhận hồ sơ	Reception Officer	Ghi nhận hồ sơ đã được tiếp nhận
UC-OFF-04	Chuyển hồ sơ xử lý	Reception Officer	Chuyển sang Processing Officer
5.2. Kiểm tra nghiệp vụ
ID	Use Case	Actor chính	Mô tả
UC-OFF-05	Xem hồ sơ cần xử lý	Processing Officer	Xem hồ sơ được phân công
UC-OFF-06	Kiểm tra thông tin hồ sơ	Processing Officer	Kiểm tra dữ liệu nghiệp vụ
UC-OFF-07	Kiểm tra tài liệu	Processing Officer	Kiểm tra giấy tờ đính kèm
UC-OFF-08	Kiểm tra nơi ở	Processing Officer	Kiểm tra thông tin địa chỉ
UC-OFF-09	Yêu cầu bổ sung	Processing Officer	Yêu cầu sinh viên bổ sung
UC-OFF-10	Đề xuất kết quả xử lý	Processing Officer	Đề xuất duyệt hoặc từ chối
UC-OFF-11	Theo dõi hồ sơ xử lý	Processing Officer	Theo dõi hồ sơ đang phụ trách
6. Registration Approval
ID	Use Case	Actor chính	Mô tả
UC-APP-01	Xem hồ sơ chờ duyệt	Approver	Xem hồ sơ đủ điều kiện
UC-APP-02	Phê duyệt hồ sơ	Approver	Phê duyệt Registration
UC-APP-03	Từ chối hồ sơ	Approver	Từ chối Registration
UC-APP-04	Ghi nhận lý do từ chối	Approver	Ghi nhận nguyên nhân từ chối
7. Registration Request

Các Request là Entity độc lập,
được liên kết với Registration.

Registration
      │
      ├── Renewal Request
      ├── Change Address Request
      └── Termination Request

Tại một thời điểm:

Một Registration
        ↓
Tối đa 1 Request
đang PENDING
7.1. Renewal Request
ID	Use Case	Actor chính	Mô tả
UC-REQ-01	Tạo yêu cầu gia hạn	Student	Gửi yêu cầu gia hạn
UC-REQ-02	Xem yêu cầu gia hạn	Student	Theo dõi Renewal Request
UC-REQ-03	Kiểm tra yêu cầu gia hạn	Processing Officer	Kiểm tra điều kiện gia hạn
UC-REQ-04	Phê duyệt gia hạn	Approver	Duyệt yêu cầu gia hạn
UC-REQ-05	Từ chối gia hạn	Approver	Từ chối yêu cầu gia hạn
UC-REQ-06	Cập nhật thời hạn sau gia hạn	System	Tự động cập nhật ngày hết hạn

Quy tắc:

Renewal Period
=
Configuration của hệ thống

Ví dụ:

Configuration = 12 tháng

Sinh viên không tự chọn:

3 tháng
6 tháng
12 tháng

Sau khi Approver duyệt:

ACTIVE
   ↓
Renewal Approved
   ↓
Expiry Date được cập nhật
7.2. Change Address Request
ID	Use Case	Actor chính	Mô tả
UC-REQ-07	Tạo yêu cầu chuyển nơi ở	Student	Khai báo nơi ở mới
UC-REQ-08	Xem yêu cầu chuyển nơi ở	Student	Theo dõi Request
UC-REQ-09	Kiểm tra nơi ở mới	Processing Officer	Kiểm tra thông tin
UC-REQ-10	Phê duyệt chuyển nơi ở	Approver	Duyệt thay đổi
UC-REQ-11	Từ chối chuyển nơi ở	Approver	Từ chối thay đổi
UC-REQ-12	Cập nhật nơi ở chính thức	System	Cập nhật Current Address

Trong thời gian chờ duyệt:

Current Address
    ↓
Địa chỉ cũ

Proposed Address
    ↓
Địa chỉ mới

Request
    ↓
PENDING

Chỉ sau khi được duyệt:

Proposed Address
       ↓
Current Address

Địa chỉ cũ không bị xóa
mà được lưu trong lịch sử.

7.3. Termination Request
ID	Use Case	Actor chính	Mô tả
UC-REQ-13	Tạo yêu cầu kết thúc ngoại trú	Student	Gửi yêu cầu kết thúc
UC-REQ-14	Xem yêu cầu kết thúc	Student	Theo dõi Request
UC-REQ-15	Kiểm tra yêu cầu kết thúc	Processing Officer	Kiểm tra Request
UC-REQ-16	Phê duyệt kết thúc	Approver	Duyệt kết thúc
UC-REQ-17	Từ chối kết thúc	Approver	Từ chối Request
UC-REQ-18	Cập nhật trạng thái TERMINATED	System	Cập nhật hồ sơ sau khi duyệt
8. Document Management
ID	Use Case	Actor chính	Mô tả
UC-DOC-01	Upload tài liệu	Student	Upload giấy tờ
UC-DOC-02	Xem tài liệu	Student / Officer	Xem tài liệu theo quyền
UC-DOC-03	Thay thế tài liệu	Student	Upload phiên bản mới
UC-DOC-04	Kiểm tra tài liệu	Processing Officer	Kiểm tra tính hợp lệ
UC-DOC-05	Xem lịch sử tài liệu	Officer / Admin	Xem các phiên bản
UC-DOC-06	Ghi nhận kết quả kiểm tra	Processing Officer	Ghi nhận hợp lệ/không hợp lệ
8.1. Version tài liệu

Khi sinh viên bổ sung hoặc thay thế:

Document v1
     ↓
Document v2
     ↓
Document v3

Không xóa vật lý phiên bản cũ
nếu phiên bản đó đã tham gia xử lý nghiệp vụ.

Mục tiêu:

Traceability
+
Audit
+
History
9. Notification
ID	Use Case	Actor chính	Mô tả
UC-NOT-01	Gửi thông báo	System	Gửi Notification
UC-NOT-02	Xem thông báo	Student / Officer	Xem thông báo
UC-NOT-03	Thông báo hồ sơ cần bổ sung	System	Báo sinh viên
UC-NOT-04	Thông báo hồ sơ được duyệt	System	Báo kết quả
UC-NOT-05	Thông báo hồ sơ bị từ chối	System	Báo kết quả
UC-NOT-06	Cảnh báo sắp hết hạn	System	Báo trước ngày hết hạn
UC-NOT-07	Thông báo Request	System	Báo trạng thái Request
10. SLA & Escalation
ID	Use Case	Actor chính	Mô tả
UC-SLA-01	Kiểm tra SLA	System	Kiểm tra thời gian xử lý
UC-SLA-02	Đánh dấu OVERDUE	System	Đánh dấu hồ sơ quá SLA
UC-SLA-03	Escalation	System	Chuyển cảnh báo lên cấp trên
UC-SLA-04	Theo dõi hồ sơ quá hạn	Officer / Admin	Xem danh sách OVERDUE
10.1. Quy trình SLA
SUBMITTED
    ↓
Under Processing
    ↓
SLA Countdown
    ↓
Đúng hạn
    ↓
Xử lý bình thường

Nếu quá SLA:

SLA Deadline
      ↓
OVERDUE
      ↓
Escalation
      ↓
Cấp quản lý
11. Automatic Expiration
ID	Use Case	Actor chính	Mô tả
UC-SYS-01	Kiểm tra hồ sơ sắp hết hạn	System Scheduler	Kiểm tra Expiry Date
UC-SYS-02	Gửi cảnh báo hết hạn	System Scheduler	Thông báo sinh viên
UC-SYS-03	Chuyển hồ sơ EXPIRED	System Scheduler	Tự động hết hạn
UC-SYS-04	Ghi nhận Auto Expiration	System Scheduler	Ghi Audit Log

Luồng:

ACTIVE
   ↓
Expiry Date đến
   ↓
System Scheduler
   ↓
EXPIRED

EXPIRED không tự động quay lại ACTIVE.

Sinh viên phải thực hiện quy trình
đăng ký/khôi phục theo chính sách
được cấu hình nếu muốn tiếp tục ngoại trú.

12. Registration Withdrawal
ID	Use Case	Actor chính	Mô tả
UC-REG-11	Rút hồ sơ	Student	Sinh viên tự rút hồ sơ
UC-REG-12	Xác nhận rút hồ sơ	System	Kiểm tra điều kiện
UC-REG-13	Cập nhật trạng thái WITHDRAWN	System	Cập nhật trạng thái

Điều kiện:

DRAFT
    ↓
Có thể rút

SUBMITTED
    ↓
Có thể rút nếu chưa được xử lý

Hồ sơ đã:

ACTIVE

không được xử lý bằng Withdrawal.

Muốn kết thúc ngoại trú phải sử dụng:

Termination Request
13. Supplement
ID	Use Case	Actor chính	Mô tả
UC-SUP-01	Yêu cầu bổ sung	Processing Officer	Yêu cầu sinh viên bổ sung
UC-SUP-02	Bổ sung hồ sơ	Student	Sinh viên bổ sung
UC-SUP-03	Kiểm tra bổ sung	Processing Officer	Kiểm tra lại
UC-SUP-04	Theo dõi số lần bổ sung	System	Kiểm soát giới hạn
13.1. Giới hạn bổ sung

Hệ thống có:

Supplement Limit
=
Configuration

Ví dụ:

MAX_SUPPLEMENT_COUNT = N

Nếu vượt quá giới hạn:

NEED_MORE_INFO
       ↓
Maximum Supplement Count
       ↓
REJECTED

Hệ thống phải ghi rõ:

Rejected By = SYSTEM
Reason = MAX_SUPPLEMENT_LIMIT_EXCEEDED

Điều này khác với:

Rejected By = APPROVER
14. SIS Integration
ID	Use Case	Actor chính	Mô tả
UC-SIS-01	Đồng bộ dữ liệu sinh viên	SIS / System	Đồng bộ thông tin
UC-SIS-02	Kiểm tra MSSV	System	Xác thực sinh viên
UC-SIS-03	Cập nhật trạng thái học tập	SIS / System	Đồng bộ trạng thái
UC-SIS-04	Xử lý sinh viên thay đổi trạng thái	System	Xử lý nghiệp vụ liên quan
14.1. Dữ liệu lấy từ SIS
MSSV
Họ tên
Lớp
Khoa
Ngành
Trạng thái học tập
14.2. Nguyên tắc

SIS là nguồn dữ liệu gốc đối với:

Student Identity
+
Academic Status

Website Ngoại trú không được
tự ý sửa dữ liệu gốc này.

15. Academic Status Handling
ID	Use Case	Actor chính	Mô tả
UC-SIS-05	Phát hiện sinh viên bảo lưu	System	Phát hiện trạng thái
UC-SIS-06	Đánh dấu cần kiểm tra	System	Tạo task kiểm tra
UC-SIS-07	Phát hiện sinh viên thôi học	System	Kiểm tra trạng thái
UC-SIS-08	Xử lý hồ sơ không còn đủ điều kiện	Processing Officer / Approver	Xử lý theo nghiệp vụ
15.1. Trạng thái bảo lưu

Bảo lưu không tạo một Registration State mới.

Thay vào đó:

ACTIVE
   +
Student Academic Status = RESERVED
   ↓
RECHECK TASK

Hồ sơ vẫn được xem là:

ACTIVE

cho đến khi có quyết định nghiệp vụ khác.

16. Administration
16.1. User
ID	Use Case	Actor chính
UC-ADM-01	Xem User	Administrator
UC-ADM-02	Tạo User	Administrator
UC-ADM-03	Cập nhật User	Administrator
UC-ADM-04	Khóa User	Administrator
16.2. Role
ID	Use Case	Actor chính
UC-ADM-05	Xem Role	Administrator
UC-ADM-06	Tạo Role	Administrator
UC-ADM-07	Cập nhật Role	Administrator
16.3. Permission
ID	Use Case	Actor chính
UC-ADM-08	Xem Permission	Administrator
UC-ADM-09	Gán Permission	Administrator
UC-ADM-10	Thu hồi Permission	Administrator
16.4. Configuration
ID	Use Case	Actor chính
UC-ADM-11	Xem Configuration	Administrator
UC-ADM-12	Cập nhật Configuration	Administrator
UC-ADM-13	Xem lịch sử Configuration	Administrator
16.5. Master Data
ID	Use Case	Actor chính
UC-ADM-14	Quản lý danh mục	Administrator
UC-ADM-15	Quản lý loại giấy tờ	Administrator
UC-ADM-16	Quản lý loại nơi ở	Administrator
16.6. Audit
ID	Use Case	Actor chính
UC-ADM-17	Xem Audit Log	Administrator
UC-ADM-18	Tra cứu Audit Log	Administrator

Audit Log không được phép:

UPDATE
DELETE

bởi User thông thường.

17. Reporting
ID	Use Case	Actor chính	Mô tả
UC-RPT-01	Xem Dashboard	Officer / Admin	Tổng quan hệ thống
UC-RPT-02	Thống kê hồ sơ	Officer / Admin	Thống kê Registration
UC-RPT-03	Thống kê theo trạng thái	Officer / Admin	DRAFT/SUBMITTED/ACTIVE/...
UC-RPT-04	Thống kê theo khoa	Officer / Admin	Phân tích theo khoa
UC-RPT-05	Thống kê theo lớp	Officer / Admin	Phân tích theo lớp
UC-RPT-06	Thống kê theo khu vực	Officer / Admin	Phân tích theo nơi ở
UC-RPT-07	Thống kê theo thời gian	Officer / Admin	Phân tích theo khoảng thời gian
UC-RPT-08	Thống kê hồ sơ quá hạn	Officer / Admin	Theo dõi SLA
UC-RPT-09	Xuất báo cáo	Officer / Admin	Export dữ liệu
18. Tổng hợp Use Case

Tổng thể Website bao gồm các nhóm:

Authentication
      ↓
Student Registration
      ↓
Officer Processing
      ↓
Approval
      ↓
Request Management
      ↓
Document Management
      ↓
Notification
      ↓
SLA & Escalation
      ↓
Automatic Expiration
      ↓
SIS Integration
      ↓
Administration
      ↓
Reporting
19. Registration Use Case Flow

Luồng đăng ký chính:

Student
   ↓
UC-REG-02
Tạo hồ sơ
   ↓
UC-REG-03
Chỉnh sửa DRAFT
   ↓
UC-REG-04
Khai báo nơi ở
   ↓
UC-REG-05
Upload tài liệu
   ↓
UC-REG-06
Gửi hồ sơ
   ↓
Reception Officer
   ↓
UC-OFF-02
Kiểm tra sơ bộ
   ↓
UC-OFF-03
Tiếp nhận
   ↓
UC-OFF-04
Chuyển xử lý
   ↓
Processing Officer
   ↓
UC-OFF-06
Kiểm tra nghiệp vụ
   ↓
┌──────────────────┬─────────────────┐
↓                  ↓                 ↓
Đủ điều kiện     Bổ sung          Không hợp lệ
↓                  ↓                 ↓
Approver          Student          Approver
↓                  ↓                 ↓
Approve           Supplement       Reject
↓                  ↓                 ↓
ACTIVE            Review           REJECTED
20. Request Use Case Flow
ACTIVE Registration
        ↓
Student
        ↓
Create Request
        ↓
┌───────────────┬──────────────────┬────────────────┐
↓               ↓                  ↓
Renewal       Change Address    Termination
↓               ↓                  ↓
Processing    Processing         Processing
↓               ↓                  ↓
Approver      Approver           Approver
↓               ↓                  ↓
Approve/      Approve/          Approve/
Reject        Reject            Reject
21. Request Concurrency Rule

Một Registration ACTIVE:

MAX
1 PENDING REQUEST

Ví dụ:

ACTIVE
  ↓
Renewal Request = PENDING

thì hệ thống không cho phép tạo:

Change Address Request

hoặc:

Termination Request

cho đến khi Request hiện tại
được xử lý xong.

22. Registration State

Các trạng thái chính:

DRAFT
SUBMITTED
UNDER_REVIEW
NEED_MORE_INFO
APPROVED
ACTIVE
REJECTED
WITHDRAWN
EXPIRED
TERMINATED
23. State Flow
DRAFT
  │
  ├── Submit ─────────────→ SUBMITTED
  │                            │
  │                            ↓
  │                       UNDER_REVIEW
  │                       /     |      \
  │                      /      |       \
  │                     ↓       ↓        ↓
  │                  APPROVED  NEED_    REJECTED
  │                     ↓      MORE_INFO
  │                   ACTIVE       │
  │                                ↓
  │                         Supplement
  │                                │
  │                                ↓
  │                         UNDER_REVIEW
  │
  └── Withdraw → WITHDRAWN

ACTIVE
  │
  ├── Expiry → EXPIRED
  │
  ├── Termination Request → TERMINATED
  │
  ├── Renewal → ACTIVE
  │
  └── Change Address → ACTIVE
24. Nộp trễ

Nộp hồ sơ sau Deadline
không tạo State mới.

Thay vào đó:

Registration
    +
is_late = true

Ví dụ:

SUBMITTED
is_late = true

State và Flag được tách biệt:

State
=
SUBMITTED

Flag
=
is_late
25. EXPIRED

Khi:

Expiry Date < Current Date

và Registration vẫn:

ACTIVE

System Scheduler tự động:

ACTIVE
   ↓
EXPIRED

Thao tác phải được ghi Audit Log.

26. Rút hồ sơ

Sinh viên có thể rút hồ sơ
trong các trạng thái được cho phép:

DRAFT
SUBMITTED

Không sử dụng Withdrawal
đối với:

ACTIVE

Nếu đang ACTIVE:

Termination Request

được sử dụng thay thế.

27. Traceability

Mỗi Use Case sẽ được liên kết
với Requirement.

Ví dụ:

BR-XXX
   ↓
FR-XXX
   ↓
UC-REG-06
   ↓
Activity Diagram
   ↓
Sequence Diagram
28. Quy tắc xây dựng Use Case Specification

Sau khi Use Case List được duyệt,
mỗi Use Case quan trọng sẽ có
một tài liệu đặc tả riêng.

Ví dụ:

specifications/
├── UC-AUTH-01-login.md
├── UC-REG-02-create-registration.md
├── UC-REG-06-submit-registration.md
├── UC-OFF-02-basic-check.md
├── UC-OFF-09-request-more-info.md
├── UC-APP-02-approve-registration.md
├── UC-REQ-01-renewal-request.md
├── UC-REQ-07-change-address-request.md
└── ...

Mỗi Specification phải có:

Actor
Goal
Trigger
Preconditions
Main Flow
Alternative Flow
Exception Flow
Postconditions
Business Rules
Related Requirements
Related Entities
29. Nguyên tắc

Use Case không mô tả:

Thiết kế database chi tiết.
SQL.
Code.
Framework.
API implementation.
UI pixel-level.

Use Case tập trung vào:

WHO
  ↓
WANTS WHAT
  ↓
UNDER WHICH CONDITIONS
  ↓
SYSTEM DOES WHAT
  ↓
RESULT
30. Trạng thái tài liệu
Document:
Use Case List

Version:
1.0

Status:
Draft

Previous Documents:
- use-case-overview.md
- actors.md

Next Documents:
- specifications/
- use-case-diagram.md