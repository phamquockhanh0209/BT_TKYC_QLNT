# UC-SYS-05 — GỬI THÔNG BÁO

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-SYS-05 |
| Tên Use Case | Gửi thông báo |
| Actor chính | System Scheduler |
| Actor phụ | System |
| Nhóm | System |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép System tạo và
gửi Notification đến người dùng
khi xảy ra các sự kiện cần thông
báo theo Business Rules.

Các sự kiện có thể bao gồm:

- Hồ sơ được tiếp nhận.
- Hồ sơ cần bổ sung.
- Hồ sơ được phê duyệt.
- Hồ sơ bị từ chối.
- Request được xử lý.
- Registration hết hạn.
- SLA Warning.
- SLA Breached.
- Escalation.

---

# 3. Preconditions

1. System đang hoạt động.

2. Notification Service có thể
   được sử dụng.

3. Sự kiện cần gửi thông báo
   đã được xác định.

4. Recipient có thể được xác
   định.

5. Notification Configuration
   hợp lệ.

6. Database có thể truy cập
   nếu Notification cần lưu
   trước khi gửi.

---

# 4. Trigger

Use Case được kích hoạt khi
một sự kiện trong hệ thống
yêu cầu gửi Notification.

Ví dụ:

```text
Registration
      ↓
State Changed
      ↓
Business Rule
      ↓
UC-SYS-05
Gửi thông báo

Hoặc:

UC-SYS-04
Escalation
      ↓
Notification
5. Main Flow
Bước 1

System nhận Event cần gửi
Notification.

Bước 2

System xác định Event Type.

Ví dụ:

REGISTRATION_APPROVED
REGISTRATION_REJECTED
REQUEST_APPROVED
REQUEST_REJECTED
REGISTRATION_EXPIRED
SLA_WARNING
SLA_BREACHED
ESCALATION_CREATED
Bước 3

System xác định Recipient.

Recipient có thể là:

Student.
Processing Officer.
Reception Officer.
Approver.
Administrator.
Nhóm xử lý.

Recipient thực tế phải được
xác định theo Business Rules.

Bước 4

System kiểm tra Notification
Configuration.

Bước 5

System xác định Channel.

Ví dụ:

IN_APP
EMAIL

Các Channel thực tế phải
phù hợp với Configuration.

Bước 6

System tạo nội dung
Notification.

Nội dung phải phản ánh đúng
Event và dữ liệu liên quan.

Bước 7

System tạo Notification Record.

Thông tin có thể bao gồm:

Notification ID
Recipient ID
Event Type
Title
Content
Channel
Created At
Status
Bước 8

System thực hiện gửi
Notification qua Channel
được cấu hình.

Bước 9

System cập nhật kết quả
gửi.

Ví dụ:

PENDING
   ↓
SENT

hoặc:

PENDING
   ↓
FAILED
Bước 10

System ghi nhận Audit Log
nếu Business Rules yêu cầu.

Bước 11

System hoàn tất Use Case.

6. Notification Event

Một Notification phải được
gắn với một Event cụ thể.

Ví dụ:

Registration Approved
        ↓
REGISTRATION_APPROVED
        ↓
Notification

Hoặc:

Request Rejected
        ↓
REQUEST_REJECTED
        ↓
Notification

System không được tạo
Notification không có nguồn
Event hợp lệ nếu Business
Rules không cho phép.

7. Recipient

System phải xác định đúng
người nhận.

Ví dụ:

Student
   ↓
Hồ sơ của chính Student

Hoặc:

SLA Breached
   ↓
Processing Officer
   ↓
Approver

Recipient phải tuân thủ
Data Scope và Business Rules.

8. Notification Content

Notification có thể bao gồm:

Title
Message
Reference ID
Event Type
Created At

Ví dụ:

Title:
Hồ sơ ngoại trú đã được phê duyệt

Message:
Hồ sơ đăng ký ngoại trú của bạn
đã được phê duyệt.

Reference:
Registration ID

Nội dung thực tế phải được
xác định bởi Notification
Template hoặc Configuration.

9. Notification Channel

System có thể hỗ trợ:

IN_APP
EMAIL

Nếu hệ thống được mở rộng,
có thể bổ sung các Channel
khác theo Configuration.

Mỗi Channel phải có cơ chế
gửi và ghi nhận kết quả riêng.

10. Alternative Flow
A1 — In-App Notification

Nếu Channel là:

IN_APP

System tạo Notification trong
hệ thống.

Student hoặc Officer có thể
xem Notification khi đăng nhập.

A2 — Email Notification

Nếu Channel là:

EMAIL

System gửi Notification đến
địa chỉ Email hợp lệ.

A3 — Nhiều Recipient

Nếu Event yêu cầu nhiều
người nhận:

Event
 ↓
Recipient A
Recipient B
Recipient C

System tạo Notification phù
hợp cho từng Recipient.

A4 — Nhiều Channel

Nếu Configuration yêu cầu
nhiều Channel:

Event
 ↓
IN_APP
 ↓
EMAIL

System thực hiện theo thứ tự
được cấu hình.

A5 — Recipient đã đọc

Nếu Notification đã được
đọc:

UNREAD
   ↓
READ

Việc đánh dấu READ thuộc
về chức năng của người dùng,
không phải việc gửi
Notification.

11. Exception Flow
E1 — Không xác định được Recipient

Nếu System không xác định
được người nhận:

System không gửi Notification.

System ghi nhận lỗi.

E2 — Email không hợp lệ

Nếu Channel là EMAIL và
Email không hợp lệ:

System đánh dấu gửi thất bại.

Ví dụ:

PENDING
   ↓
FAILED

Lỗi được ghi nhận để xử lý.

E3 — Notification Service Error

Nếu Notification Service
không hoạt động:

System ghi nhận lỗi.

Notification có thể được
retry theo Retry Policy.

E4 — Database Error

Nếu không thể lưu
Notification Record:

System ghi nhận lỗi.

Không coi Notification là
đã gửi thành công nếu chưa
có cơ chế xác nhận phù hợp.

E5 — Template Error

Nếu Notification Template
không tồn tại hoặc không
hợp lệ:

System không gửi nội dung
không hoàn chỉnh.

System ghi nhận lỗi.

E6 — Event không hợp lệ

Nếu Event không tồn tại hoặc
không được phép tạo
Notification:

System bỏ qua Event và
ghi nhận lỗi.

E7 — Duplicate Notification

Nếu cùng một Event đã tạo
Notification trước đó và
Business Rules không cho phép
gửi lại:

System không tạo Notification
trùng lặp.

12. Notification Status

Notification có thể sử dụng
các trạng thái:

PENDING
   ↓
SENT

Nếu thất bại:

PENDING
   ↓
FAILED

Nếu người nhận đã đọc:

SENT
   ↓
READ

Các State thực tế phải phù
hợp với Data Model.

13. Retry

Nếu Notification gửi thất bại
và Retry Policy cho phép:

FAILED
   ↓
RETRY
   ↓
PENDING
   ↓
SENT

System phải giới hạn số lần
Retry theo Configuration.

Không được Retry vô hạn.

14. Idempotency

System phải tránh tạo nhiều
Notification giống nhau cho
cùng một Event nếu Business
Rules không yêu cầu.

Ví dụ:

REQUEST_REJECTED
      ↓
Notification #1

Nếu Scheduler hoặc Service
chạy lại:

REQUEST_REJECTED
      ↓
Không tạo Notification #2

trong trường hợp Event đã
được xử lý thành công.

15. Concurrent Processing

System phải kiểm soát trường
hợp nhiều Service cùng xử lý
một Event.

Ví dụ:

Service A
    ↓
   Event
    ↑
Service B

System phải đảm bảo Event
không tạo Notification trùng
lặp ngoài quy định.

16. Audit Log

System có thể ghi nhận:

NOTIFICATION_CREATED
NOTIFICATION_SENT
NOTIFICATION_FAILED

Audit Log có thể bao gồm:

Notification ID
Event Type
Recipient ID
Channel
Status
Created At
Sent At
Result
17. Security

System phải đảm bảo:

Notification chỉ được gửi
đến Recipient hợp lệ.
Không tiết lộ dữ liệu của
sinh viên khác.
Không gửi dữ liệu ngoài
Data Scope.
Nội dung Notification phải
phù hợp với Permission và
Business Rules.
18. Business Constraints
BR-SYS-NOT-01

Notification phải được tạo
từ Event hợp lệ.

BR-SYS-NOT-02

Recipient phải được xác định
đúng.

BR-SYS-NOT-03

Notification phải tuân thủ
Data Scope.

BR-SYS-NOT-04

Channel phải được cấu hình
hợp lệ.

BR-SYS-NOT-05

Notification phải phản ánh
đúng Event.

BR-SYS-NOT-06

Không tạo Notification
trùng lặp ngoài quy định.

BR-SYS-NOT-07

Lỗi gửi phải được ghi nhận.

BR-SYS-NOT-08

Retry phải tuân thủ
Retry Policy.

BR-SYS-NOT-09

Notification quan trọng phải
được lưu và theo dõi trạng thái.

BR-SYS-NOT-10

Notification không được
tiết lộ dữ liệu trái phép.

19. Postconditions

Nếu gửi thành công:

Notification
   ↓
SENT

Nếu người dùng đã đọc:

SENT
   ↓
READ

Nếu gửi thất bại:

Notification
   ↓
FAILED

System lưu kết quả gửi và
ghi nhận lỗi nếu có.

20. Acceptance Criteria
AC01

System nhận đúng Event.

AC02

System xác định đúng
Event Type.

AC03

System xác định đúng
Recipient.

AC04

System tạo Notification
Record.

AC05

System sử dụng đúng
Notification Template.

AC06

System gửi đúng Channel.

AC07

System cập nhật đúng
Notification Status.

AC08

System ghi nhận lỗi
khi gửi thất bại.

AC09

System hỗ trợ Retry theo
Configuration.

AC10

System không tạo
Notification trùng lặp.

AC11

System đảm bảo
Data Scope.

AC12

System ghi nhận Audit Log
khi cần.

AC13

System xử lý Concurrent
Processing.

21. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-SYS-05
↓
Activity Diagram
↓
Sequence Diagram
↓
Notification Service
↓
Email / In-App Service
↓
Database
↓
Implementation

22. Related Use Cases
UC-SYS-01
Kiểm tra hết hạn
      ↓
UC-SYS-02
Chuyển hồ sơ EXPIRED
      ↓
UC-SYS-05
Gửi thông báo
UC-SYS-03
Kiểm tra SLA
      ↓
SLA Warning / Breached
      ↓
UC-SYS-05
Gửi thông báo
UC-SYS-04
Escalation
      ↓
UC-SYS-05
Gửi thông báo

Các Use Case Approval cũng
có thể kích hoạt Notification:

UC-APP-01
Phê duyệt hồ sơ
      ↓
UC-SYS-05
Gửi thông báo
UC-APP-02
Từ chối hồ sơ
      ↓
UC-SYS-05
Gửi thông báo
23. Responsibility
Event Source
= Tạo Event

System
= Xác định Recipient
  + Tạo Notification
  + Chọn Channel
  + Gửi Notification
  + Cập nhật Status
  + Retry
  + Audit

Notification Service
= Thực hiện gửi

Database
= Lưu Notification
  + Status
  + History
24. Status

Use Case ID:

UC-SYS-05

Version:

1.0

Status:

Draft

Previous:

UC-SYS-04 — Escalation

Next:

UC-SYS-06 — Đồng bộ SIS