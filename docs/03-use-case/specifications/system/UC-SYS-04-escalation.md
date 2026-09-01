# UC-SYS-04 — ESCALATION

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-SYS-04 |
| Tên Use Case | Escalation |
| Actor chính | System Scheduler |
| Actor phụ | System |
| Nhóm | System |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép System tự động
thực hiện Escalation đối với các
hồ sơ hoặc Request đã vượt quá
ngưỡng SLA được cấu hình.

Escalation nhằm đảm bảo các hồ sơ
quá hạn được chuyển đến cấp có
trách nhiệm cao hơn hoặc được
cảnh báo theo Business Rules.

---

# 3. Preconditions

1. System Scheduler đang hoạt động.

2. SLA Configuration tồn tại
   và hợp lệ.

3. Database có thể truy cập.

4. Registration hoặc Request
   tồn tại.

5. Đối tượng đã đáp ứng điều kiện
   Escalation.

6. Quy tắc Escalation đã được
   cấu hình.

7. System có quyền thực hiện
   tác vụ tự động.

---

# 4. Trigger

Use Case được kích hoạt khi
UC-SYS-03 xác định hồ sơ hoặc
Request đã đáp ứng điều kiện
Escalation.

```text
UC-SYS-03
Kiểm tra SLA
      ↓
SLA Breached
      ↓
Đủ điều kiện Escalation
      ↓
UC-SYS-04
Escalation
5. Main Flow
Bước 1

System Scheduler kích hoạt
tác vụ Escalation.

Bước 2

System lấy danh sách các
Registration hoặc Request
đang đáp ứng điều kiện
Escalation.

Bước 3

System kiểm tra:

State hiện tại.
SLA Status.
Thời gian xử lý.
Escalation Threshold.
Escalation Level.
Data Scope.
Escalation Configuration.
Bước 4

System xác định cấp xử lý
tiếp theo theo Configuration.

Ví dụ:

Processing Officer
        ↓
Senior Officer
        ↓
Approver
        ↓
Management

Cấp thực tế phải tuân thủ
Configuration của hệ thống.

Bước 5

System xác định người hoặc
nhóm nhận Escalation.

Bước 6

System tạo Escalation Event.

Ví dụ:

ESCALATION_CREATED
Bước 7

System cập nhật thông tin
Escalation của hồ sơ hoặc
Request.

Bước 8

System tạo Audit Log.

Bước 9

System gửi Notification
cho Actor hoặc nhóm nhận
Escalation.

Bước 10

System ghi nhận kết quả
Escalation.

6. Escalation Level

System có thể hỗ trợ nhiều
cấp Escalation.

Ví dụ:

Level 0
Normal
   ↓
Level 1
Warning
   ↓
Level 2
SLA Breached
   ↓
Level 3
Escalated

Số lượng Level thực tế phải
được xác định bởi Configuration.

7. Alternative Flow
A1 — Chưa đủ điều kiện

Nếu hồ sơ chưa đạt
Escalation Threshold:

System không thực hiện
Escalation.

A2 — Đã Escalate

Nếu hồ sơ đã được Escalation
ở cùng một Level:

System không tạo Escalation
trùng lặp.

A3 — Escalation Level tiếp theo

Nếu hồ sơ tiếp tục vượt
ngưỡng thời gian tiếp theo:

System có thể chuyển sang
Escalation Level cao hơn.

Ví dụ:

Level 1
   ↓
Level 2
   ↓
Level 3

Việc chuyển Level phải tuân
thủ Configuration.

A4 — Không cần chuyển người xử lý

Nếu Business Rules chỉ yêu
cầu cảnh báo:

System tạo Notification hoặc
Alert nhưng không thay đổi
Assignment.

A5 — Nhiều hồ sơ cần Escalation

System xử lý từng hồ sơ
hoặc Request độc lập.

Một hồ sơ lỗi không được
làm mất kết quả của các
hồ sơ khác nếu Batch Policy
cho phép xử lý độc lập.

8. Exception Flow
E1 — Không có Configuration

Nếu không tìm thấy
Escalation Configuration:

System không tự ý chọn
người nhận.

System ghi nhận lỗi.

E2 — Không xác định được người nhận

Nếu System không xác định
được Actor hoặc nhóm nhận
Escalation:

System ghi nhận lỗi.

Escalation chưa được coi
là hoàn tất.

E3 — Data Scope không hợp lệ

Nếu người nhận Escalation
không thuộc phạm vi được
cấu hình:

System không thực hiện
Escalation đến Actor đó.

E4 — State đã thay đổi

Nếu hồ sơ đã được xử lý
trước khi Escalation:

System kiểm tra State mới nhất.

Nếu không còn đáp ứng điều
kiện:

Không thực hiện Escalation.

E5 — Database Error

Nếu Database không thể
cập nhật:

System ghi nhận lỗi.

Nếu sử dụng Transaction:

ROLLBACK

được thực hiện theo
Transaction Policy.

E6 — Notification Error

Nếu Notification không gửi
được:

Escalation Event vẫn phải
được lưu nhất quán.

Lỗi Notification được
ghi nhận để retry.

E7 — Concurrent Escalation

Nếu nhiều Scheduler cùng
thực hiện Escalation:

System phải đảm bảo không
tạo các Escalation Event
trùng lặp không cần thiết.

9. Escalation Target

Escalation Target có thể là:

Một cán bộ cụ thể.
Một Role.
Một nhóm xử lý.
Một cấp quản lý.

Ví dụ:

Processing Officer
       ↓
Senior Processing Officer

Target thực tế phải được
xác định bởi Configuration
và Data Scope.

10. Assignment

Nếu Business Rules cho phép
thay đổi người xử lý:

Current Assignee
       ↓
Escalation
       ↓
New Assignee

System phải ghi nhận:

Previous Assignee
New Assignee
Escalation Level
Escalation Time

Nếu Escalation chỉ mang tính
cảnh báo thì không thay đổi
Assignee.

11. Escalation Event

System ghi nhận Event:

Escalation ID
Registration ID
Request ID
Escalation Level
Previous Assignee
New Assignee
Reason
Created At
Status

Các trường thực tế phải
phù hợp với Data Model.

12. Idempotency

System phải đảm bảo một
Escalation không bị tạo
lặp lại ngoài quy định.

Ví dụ:

SLA_BREACHED
      ↓
ESCALATION_LEVEL_1

Nếu Scheduler chạy lại:

SLA_BREACHED
      ↓
ESCALATION_LEVEL_1

System không tạo thêm
Escalation Level 1 nếu
Event đã tồn tại.

Chỉ tạo Level mới khi
Configuration yêu cầu.

13. Concurrent Processing

System phải kiểm soát
trường hợp:

Scheduler A
      ↓
Registration
      ↑
Scheduler B

Chỉ một Scheduler được
phép tạo Escalation Event
hợp lệ cho cùng một điều
kiện tại cùng thời điểm.

14. System Audit Log

System ghi nhận:

ESCALATION_CREATED

Nếu thay đổi Assignment:

ASSIGNMENT_CHANGED

Audit Log có thể bao gồm:

Escalation ID
Registration ID
Request ID
Previous Level
New Level
Previous Assignee
New Assignee
Reason
Actor
Timestamp
Result
15. Notification

System gửi Notification
cho Target.

Notification có thể bao gồm:

Registration ID
Request ID
Escalation Level
Reason
SLA Status
Created At

Notification phải phản ánh
đúng trạng thái thực tế.

16. Security

System Scheduler chỉ được
thực hiện Escalation theo
Configuration.

Không được:

Tự ý thay đổi Role.
Tự ý cấp Permission.
Tự ý sửa Audit Log.
Escalate ngoài Data Scope.
Bỏ qua State Machine.
Thay đổi Business Rules.
17. Business Constraints
BR-SYS-ESC-01

Escalation chỉ được thực
hiện khi đáp ứng điều kiện
đã cấu hình.

BR-SYS-ESC-02

Escalation phải dựa trên
SLA hoặc Business Rules
tương ứng.

BR-SYS-ESC-03

Target phải được xác định
theo Configuration.

BR-SYS-ESC-04

Escalation không được
thực hiện ngoài Data Scope.

BR-SYS-ESC-05

Không tạo Escalation
trùng lặp cùng Level.

BR-SYS-ESC-06

Escalation Level phải tuân
thủ Configuration.

BR-SYS-ESC-07

Escalation phải được
Audit.

BR-SYS-ESC-08

Nếu thay đổi Assignment,
System phải ghi nhận lịch sử.

BR-SYS-ESC-09

Concurrent Escalation phải
được kiểm soát.

BR-SYS-ESC-10

Notification phải phản ánh
đúng Escalation Event.

18. Postconditions

Nếu Escalation thành công:

SLA_BREACHED
      ↓
ESCALATED

hoặc:

SLA_BREACHED
      ↓
Notification

tùy theo Configuration.

System:

Tạo Escalation Event.
Cập nhật Assignment nếu cần.
Tạo Audit Log.
Gửi Notification.
Ghi nhận kết quả xử lý.
19. Acceptance Criteria
AC01

System xác định đúng hồ sơ
đủ điều kiện Escalation.

AC02

System đọc đúng
Escalation Configuration.

AC03

System xác định đúng
Escalation Level.

AC04

System xác định đúng Target.

AC05

System tạo Escalation Event.

AC06

System không tạo Event
trùng lặp.

AC07

System cập nhật Assignment
nếu Business Rules yêu cầu.

AC08

System tạo Audit Log.

AC09

System gửi Notification.

AC10

System xử lý Database Error.

AC11

System xử lý Concurrent
Escalation.

AC12

System kiểm soát Data Scope.

AC13

System không thực hiện
Escalation khi chưa đủ điều kiện.

20. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-SYS-04
↓
Activity Diagram
↓
Sequence Diagram
↓
SLA Service
↓
Escalation Service
↓
Notification
↓
Implementation

21. Related Use Cases
UC-SYS-03
Kiểm tra SLA
      ↓
SLA_BREACHED
      ↓
UC-SYS-04
Escalation
      ↓
Target
      ↓
Notification

Liên quan:

UC-SYS-05
Gửi thông báo
22. Responsibility
System Scheduler
= Kích hoạt Escalation

System
= Kiểm tra điều kiện
  + Xác định Level
  + Xác định Target
  + Tạo Event
  + Assignment
  + Audit
  + Notification

SLA Configuration
= Cung cấp Threshold

Escalation Configuration
= Cung cấp Level
  + Target
  + Rule
23. Status

Use Case ID:

UC-SYS-04

Version:

1.0

Status:

Draft

Previous:

UC-SYS-03 — Kiểm tra SLA

Next:

UC-SYS-05 — Gửi thông báo