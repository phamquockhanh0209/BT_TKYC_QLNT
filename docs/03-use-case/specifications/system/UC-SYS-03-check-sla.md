# UC-SYS-03 — KIỂM TRA SLA

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-SYS-03 |
| Tên Use Case | Kiểm tra SLA |
| Actor chính | System Scheduler |
| Actor phụ | System |
| Nhóm | System |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép System tự động
kiểm tra thời gian xử lý của các
hồ sơ đang được tiếp nhận hoặc
xử lý.

System xác định các hồ sơ có nguy
cơ hoặc đã vượt quá thời gian SLA
được quy định.

Kết quả kiểm tra được sử dụng để:

- Theo dõi tiến độ xử lý.
- Phát hiện hồ sơ quá hạn SLA.
- Tạo cảnh báo.
- Thực hiện Escalation theo
  Business Rules.

---

# 3. Preconditions

1. System Scheduler đang hoạt động.

2. SLA Configuration đã được
   cấu hình.

3. Database có thể truy cập.

4. Registration có thông tin
   thời gian xử lý cần thiết.

5. System có quyền thực hiện
   tác vụ kiểm tra.

---

# 4. Trigger

System Scheduler kích hoạt
tác vụ theo lịch.

```text
Scheduler
    ↓
Đến thời điểm chạy
    ↓
UC-SYS-03
Kiểm tra SLA
5. Main Flow
Bước 1

System Scheduler kích hoạt
tác vụ kiểm tra SLA.

Bước 2

System lấy thời điểm hiện tại.

Bước 3

System lấy SLA Configuration
hiện hành.

Thông tin có thể bao gồm:

SLA Type
SLA Duration
Warning Threshold
Escalation Threshold

Tên trường thực tế phải phù hợp
với Configuration và Data Model.

Bước 4

System lấy các Registration
đang trong quá trình xử lý.

Ví dụ:

SUBMITTED
UNDER_REVIEW
PENDING_APPROVAL

Các State thực tế phải tuân thủ
State Machine.

Bước 5

System xác định thời điểm bắt
đầu tính SLA của từng hồ sơ.

Ví dụ:

Submitted At
Received At
Processing Started At

Thông tin sử dụng phải phù hợp
với Business Rules.

Bước 6

System tính thời gian xử lý
đã sử dụng.

Current Time
      -
Start Time
      =
Processing Duration
Bước 7

System so sánh thời gian xử lý
với SLA Configuration.

Processing Duration
        ↓
Compare SLA
Bước 8

Nếu hồ sơ chưa vượt ngưỡng:

System không thực hiện
Escalation.

Bước 9

Nếu hồ sơ đạt ngưỡng cảnh báo:

System ghi nhận trạng thái
cảnh báo SLA theo Business Rules.

Bước 10

Nếu hồ sơ vượt SLA:

System đánh dấu hồ sơ
SLA Breached theo Business Rules.

Bước 11

System tạo Audit Log cho kết quả
kiểm tra.

Bước 12

System tạo Notification hoặc
cảnh báo nếu Business Rules
yêu cầu.

Bước 13

Nếu điều kiện Escalation
được đáp ứng:

System chuyển xử lý sang
UC-SYS-04 — Escalation.

Bước 14

System tiếp tục kiểm tra
Registration tiếp theo.

6. SLA Evaluation

Logic tổng quát:

Start Time
    ↓
Current Time
    ↓
Processing Duration
    ↓
Compare SLA Threshold

Có thể có các mức:

NORMAL
   ↓
WARNING
   ↓
BREACHED

Tên trạng thái thực tế phải
tuân thủ Business Rules và
Configuration.

7. Alternative Flow
A1 — Hồ sơ trong SLA

Nếu thời gian xử lý vẫn nằm
trong giới hạn:

Processing Duration
        <
SLA Threshold

System ghi nhận hồ sơ đang
trong SLA.

Không thực hiện Escalation.

A2 — Đạt ngưỡng cảnh báo

Nếu thời gian xử lý đạt
Warning Threshold:

System tạo cảnh báo SLA
theo Configuration.

Ví dụ:

NORMAL
   ↓
WARNING

Không nhất thiết chuyển
State của Registration nếu
Business Rules không yêu cầu.

A3 — Vượt SLA

Nếu:

Processing Duration
        >
SLA Threshold

System ghi nhận SLA Breached.

Ví dụ:

NORMAL
   ↓
BREACHED

Sau đó kiểm tra điều kiện
Escalation.

A4 — Nhiều hồ sơ

System kiểm tra nhiều
Registration trong cùng một
lần Scheduler chạy.

Mỗi Registration được
đánh giá độc lập.

8. Exception Flow
E1 — Không có SLA Configuration

Nếu System không tìm thấy
SLA Configuration hợp lệ:

System không tự ý sử dụng
một giá trị khác.

System ghi nhận lỗi
Configuration.

E2 — SLA Configuration không hợp lệ

Nếu SLA Duration hoặc
Threshold không hợp lệ:

System ghi nhận lỗi.

Không thực hiện đánh giá
SLA dựa trên dữ liệu không
hợp lệ.

E3 — Không xác định được Start Time

Nếu Registration thiếu
thông tin cần thiết để tính
thời gian xử lý:

System ghi nhận lỗi dữ liệu.

Không tự ý kết luận
SLA Breached.

E4 — Registration không tồn tại

Nếu Registration không còn
tồn tại:

System bỏ qua bản ghi và
ghi nhận kết quả phù hợp.

E5 — State không phù hợp

Nếu Registration đang ở
State không thuộc phạm vi
kiểm tra SLA:

System không thực hiện
đánh giá SLA.

E6 — Database Error

Nếu Database không khả dụng:

System ghi nhận lỗi.

Tác vụ có thể được retry
theo Scheduler Configuration.

E7 — Concurrent Update

Nếu Registration thay đổi
trong quá trình kiểm tra:

System phải kiểm tra dữ liệu
mới nhất trước khi thực hiện
các hành động tiếp theo.

E8 — Notification Error

Nếu Notification không gửi
được:

Kết quả kiểm tra SLA vẫn
phải được lưu nhất quán.

Lỗi Notification được ghi
nhận để xử lý lại.

9. SLA Calculation

Công thức tổng quát:

Processing Duration
=
Current Time - SLA Start Time

Ví dụ:

SLA Start Time
       ↓
2026-08-30 08:00

Current Time
       ↓
2026-08-30 12:00

Processing Duration
       ↓
4 hours

Giá trị SLA thực tế phải
được lấy từ Configuration.

10. Business Calendar

Nếu hệ thống có quy định
ngày làm việc hoặc giờ làm
việc:

System phải tính SLA theo
Business Calendar.

Ví dụ:

Working Day
Working Hour
Holiday
Weekend

Nếu Business Rules không
quy định Business Calendar,
System sử dụng cách tính
được định nghĩa trong
Configuration.

11. SLA Warning

Khi hồ sơ đạt Warning
Threshold:

System có thể tạo:

SLA_WARNING

Thông tin cảnh báo có thể
bao gồm:

Registration ID
Current State
SLA Start Time
Current Time
Processing Duration
Warning Threshold
12. SLA Breach

Khi hồ sơ vượt SLA:

System ghi nhận:

SLA_BREACHED

Thông tin có thể bao gồm:

Registration ID
Current State
SLA Start Time
Current Time
Processing Duration
SLA Duration
Breach Time
13. Escalation

Nếu SLA đã bị vượt và
Business Rules yêu cầu:

SLA_BREACHED
      ↓
UC-SYS-04
Escalation

UC-SYS-03 chỉ xác định
điều kiện SLA.

Việc thực hiện Escalation
được mô tả riêng trong
UC-SYS-04.

14. Idempotency

System phải tránh tạo
các cảnh báo hoặc sự kiện
SLA trùng lặp không cần thiết.

Ví dụ:

Lần 1
NORMAL
  ↓
WARNING

Các lần kiểm tra tiếp theo
không được tạo vô hạn các
WARNING giống nhau nếu
Business Rules không yêu cầu.

Tương tự:

WARNING
   ↓
BREACHED

Sự kiện BREACHED chỉ được
ghi nhận khi thực sự xảy ra
State hoặc Threshold
Transition tương ứng.

15. Concurrent Processing

System phải kiểm soát trường
hợp nhiều Scheduler hoặc
Service cùng kiểm tra một
Registration.

Ví dụ:

Scheduler A
     ↓
Registration
     ↑
Scheduler B

System phải đảm bảo kết quả
SLA nhất quán.

16. System Audit Log

System ghi nhận các sự kiện
phù hợp:

SLA_CHECKED
SLA_WARNING
SLA_BREACHED

Audit Log có thể bao gồm:

Registration ID
Previous SLA Status
New SLA Status
SLA Threshold
Processing Duration
Execution Time
Scheduler ID
Result
17. Notification

System có thể gửi Notification
khi:

Hồ sơ gần vượt SLA.
Hồ sơ đã vượt SLA.
Escalation được kích hoạt.

Việc gửi Notification phải
tuân thủ Business Rules.

18. Security

System Scheduler chỉ được
thực hiện các tác vụ SLA
được cấu hình.

Scheduler không được:

Thay đổi SLA Configuration.
Thay đổi Permission.
Thay đổi Role.
Sửa Audit Log.
Bỏ qua Data Scope hoặc
State Machine.
19. Business Constraints
BR-SYS-SLA-01

System phải định kỳ kiểm tra
SLA của hồ sơ đang xử lý.

BR-SYS-SLA-02

SLA phải được tính dựa trên
thời gian bắt đầu hợp lệ.

BR-SYS-SLA-03

SLA Threshold phải lấy từ
Configuration hợp lệ.

BR-SYS-SLA-04

Hồ sơ chưa vượt SLA không
được đánh dấu Breached.

BR-SYS-SLA-05

Hồ sơ vượt SLA phải được
ghi nhận theo Business Rules.

BR-SYS-SLA-06

SLA Warning phải tuân thủ
Warning Threshold.

BR-SYS-SLA-07

SLA Breach phải được
Audit.

BR-SYS-SLA-08

Điều kiện Escalation phải
được chuyển sang Use Case
UC-SYS-04.

BR-SYS-SLA-09

System phải kiểm soát
Concurrent Processing.

BR-SYS-SLA-10

System không được tự ý
thay đổi SLA Configuration.

20. Postconditions

Nếu hồ sơ vẫn trong SLA:

SLA Status
=
NORMAL

Nếu đạt Warning Threshold:

SLA Status
=
WARNING

Nếu vượt SLA:

SLA Status
=
BREACHED

System:

Ghi nhận kết quả kiểm tra.
Tạo Audit Log.
Tạo Notification nếu cần.
Kích hoạt Escalation nếu
đủ điều kiện.
21. Acceptance Criteria
AC01

Scheduler có thể kích hoạt
kiểm tra SLA.

AC02

System lấy đúng
SLA Configuration.

AC03

System xác định đúng
SLA Start Time.

AC04

System tính đúng
Processing Duration.

AC05

System xác định đúng
hồ sơ còn trong SLA.

AC06

System xác định đúng
Warning Threshold.

AC07

System xác định đúng
SLA Breached.

AC08

System không tạo cảnh báo
trùng lặp không cần thiết.

AC09

System tạo Audit Log.

AC10

System gửi Notification
theo Business Rules.

AC11

System kích hoạt
Escalation khi đủ điều kiện.

AC12

System xử lý lỗi
Configuration.

AC13

System xử lý lỗi
Database.

AC14

System kiểm soát
Concurrent Processing.

22. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-SYS-03
↓
Activity Diagram
↓
Sequence Diagram
↓
SLA Service
↓
Scheduler
↓
Notification
↓
Escalation
↓
Implementation

23. Related Use Cases
UC-SYS-03
Kiểm tra SLA
      ↓
SLA Warning
      ↓
Notification
UC-SYS-03
Kiểm tra SLA
      ↓
SLA Breached
      ↓
UC-SYS-04
Escalation
24. Responsibility
System Scheduler
= Kích hoạt kiểm tra

System
= Tính SLA
  + Kiểm tra Threshold
  + Ghi nhận Warning
  + Ghi nhận Breach
  + Audit
  + Notification
  + Kích hoạt Escalation

SLA Configuration
= Cung cấp các ngưỡng SLA

Database
= Lưu dữ liệu xử lý và
  kết quả SLA
25. Status

Use Case ID:

UC-SYS-03

Version:

1.0

Status:

Draft

Previous:

UC-SYS-02 — Chuyển hồ sơ EXPIRED

Next:

UC-SYS-04 — Escalation