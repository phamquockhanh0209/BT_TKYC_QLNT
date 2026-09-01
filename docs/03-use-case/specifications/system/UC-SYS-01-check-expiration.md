# UC-SYS-01 — KIỂM TRA HẾT HẠN

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-SYS-01 |
| Tên Use Case | Kiểm tra hết hạn |
| Actor chính | System Scheduler |
| Actor phụ | System |
| Nhóm | System |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép System Scheduler
định kỳ kiểm tra các Registration
đang có thời hạn ngoại trú.

System xác định các Registration
đã đến hoặc vượt thời hạn để thực
hiện xử lý theo Business Rules.

Use Case này được thực hiện tự động
và không yêu cầu người dùng thao tác
trực tiếp.

---

# 3. Preconditions

1. System Scheduler đang hoạt động.

2. Scheduler đã được cấu hình.

3. Database có thể truy cập.

4. Registration có dữ liệu thời hạn
   hợp lệ.

5. System có quyền thực hiện tác vụ
   tự động.

---

# 4. Trigger

System Scheduler kích hoạt tác vụ
theo lịch đã được cấu hình.

Ví dụ:

```text
Scheduler
    ↓
Đến thời điểm chạy
    ↓
UC-SYS-01
Kiểm tra hết hạn
5. Main Flow
Bước 1

System Scheduler kích hoạt
tác vụ kiểm tra hết hạn.

Bước 2

System xác định thời điểm hiện tại.

Current DateTime
Bước 3

System truy vấn các Registration
đang ở trạng thái cần kiểm tra.

Ví dụ:

ACTIVE
Bước 4

System lấy thông tin thời hạn
của từng Registration.

Ví dụ:

Registration ID
Expiry Date
Current State
Bước 5

System so sánh thời điểm hiện tại
với thời hạn của Registration.

Current DateTime
        ↓
Compare
        ↓
Expiry Date
Bước 6

Nếu Registration chưa hết hạn:

System không thay đổi State.

Bước 7

Nếu Registration đã hết hạn:

System xác định Registration
đủ điều kiện chuyển sang State
EXPIRED theo Business Rules.

Bước 8

System thực hiện State Transition
theo State Machine.

Ví dụ:

ACTIVE
   ↓
EXPIRED
Bước 9

System ghi nhận thay đổi State.

Bước 10

System tạo System Audit Log.

Bước 11

System tạo Notification nếu
Business Rules yêu cầu.

Bước 12

System tiếp tục kiểm tra
Registration tiếp theo.

Bước 13

Sau khi hoàn tất danh sách,
System ghi nhận kết quả của
lần kiểm tra.

6. Kiểm tra thời hạn

System phải sử dụng thời gian
chuẩn của hệ thống để xác định
Registration có hết hạn hay chưa.

Logic tổng quát:

Current DateTime
        │
        ├── < Expiry Date
        │       ↓
        │    Chưa hết hạn
        │
        └── >= Expiry Date
                ↓
             Hết hạn

Điều kiện chính xác phải tuân
thủ Business Rules và State
Machine.

7. State Transition

Nếu Registration hết hạn:

ACTIVE
   ↓
EXPIRED

System không được chuyển
Registration sang State không
được định nghĩa trong State
Machine.

8. Alternative Flow
A1 — Registration chưa hết hạn

Nếu:

Current DateTime < Expiry Date

System không thay đổi State.

Registration tiếp tục giữ
trạng thái hiện tại.

A2 — Không có Registration
cần kiểm tra

Nếu không tìm thấy Registration
phù hợp:

System kết thúc lần kiểm tra.

Không có State Transition.

A3 — Có nhiều Registration

System xử lý lần lượt hoặc
theo cơ chế batch phù hợp.

Mỗi Registration phải được
kiểm tra độc lập.

9. Exception Flow
E1 — Database không khả dụng

Nếu System không thể truy cập
Database:

System ghi nhận lỗi.

Không thực hiện các State
Transition chưa thể xác minh.

Tác vụ được đánh dấu lỗi
để xử lý hoặc retry theo
cấu hình.

E2 — Dữ liệu thời hạn không hợp lệ

Nếu Registration có dữ liệu
Expiry Date không hợp lệ:

System không tự ý xác định
Registration là EXPIRED.

System ghi nhận lỗi dữ liệu
và xử lý theo Business Rules.

E3 — State không hợp lệ

Nếu Registration đang ở State
không phù hợp với quá trình
kiểm tra:

System không thực hiện
State Transition trái phép.

E4 — State đã thay đổi

Nếu Registration đã được
xử lý bởi một tác vụ hoặc
Actor khác trước khi System
thực hiện Transition:

System phải kiểm tra State
mới nhất.

Nếu State không còn phù hợp:

Không thực hiện Transition.

E5 — Lỗi khi cập nhật State

Nếu không thể cập nhật State:

System ghi nhận lỗi.

Nếu thao tác sử dụng
transaction thì thực hiện
ROLLBACK phù hợp.

E6 — Notification Error

Nếu Notification không gửi
được:

State Transition vẫn phải
được đảm bảo nhất quán.

Lỗi Notification phải được
ghi nhận để xử lý.

10. Batch Processing

System có thể xử lý nhiều
Registration trong một lần chạy.

Ví dụ:

Scheduler
    ↓
Load registrations
    ↓
Registration #1 → Check
Registration #2 → Check
Registration #3 → Check
Registration #4 → Check
    ↓
Finish

Một Registration bị lỗi
không được làm mất dữ liệu
của các Registration khác,
trừ khi Business Rules hoặc
transaction policy quy định
khác.

11. Idempotency

System phải tránh việc xử lý
hết hạn nhiều lần đối với
cùng một Registration.

Ví dụ:

ACTIVE
   ↓
EXPIRED

Sau khi đã:

EXPIRED

System không tiếp tục thực
hiện:

EXPIRED
   ↓
EXPIRED

hoặc tạo các quyết định
trùng lặp không cần thiết.

12. Concurrent Processing

System phải kiểm soát trường
hợp Registration được thay đổi
bởi Actor khác trong lúc
Scheduler đang kiểm tra.

Ví dụ:

Scheduler
    ↓
Check Registration
          ↑
          │
Processing Officer
    ↓
Update Registration

Trước khi thực hiện State
Transition, System phải kiểm
tra State mới nhất.

13. System Audit Log

System ghi nhận sự kiện:

REGISTRATION_EXPIRATION_CHECKED

Nếu Registration được chuyển
sang EXPIRED, ghi nhận thêm:

REGISTRATION_EXPIRED

Audit Log có thể bao gồm:

Registration ID
Previous State
New State
Execution Time
Scheduler ID
Action
Result
14. Notification

Nếu Business Rules yêu cầu,
System gửi Notification cho
Student khi Registration
chuyển sang EXPIRED.

Ví dụ:

Hồ sơ ngoại trú của bạn
đã hết hạn.

Notification phải phản ánh
đúng State thực tế của
Registration.

15. Security

System Scheduler chỉ được
thực hiện các thao tác
được cấu hình và cấp quyền.

Scheduler không được:

Thay đổi Business Rules.
Sửa Audit Log.
Tự ý thay đổi dữ liệu
ngoài phạm vi tác vụ.
Bỏ qua State Machine.
16. Business Constraints
BR-SYS-EXP-01

System phải định kỳ kiểm tra
Registration theo Scheduler.

BR-SYS-EXP-02

Chỉ Registration thuộc phạm
vi kiểm tra mới được xử lý.

BR-SYS-EXP-03

Việc xác định hết hạn phải
dựa trên thời gian và
Expiry Date hợp lệ.

BR-SYS-EXP-04

Registration hết hạn phải
được xử lý theo State Machine.

BR-SYS-EXP-05

System không được thực hiện
State Transition trái phép.

BR-SYS-EXP-06

Registration đã EXPIRED không
được xử lý hết hạn lại.

BR-SYS-EXP-07

System phải ghi nhận
System Audit Log.

BR-SYS-EXP-08

Notification phải phản ánh
đúng State mới.

BR-SYS-EXP-09

Lỗi xử lý phải được ghi nhận.

BR-SYS-EXP-10

Concurrent State Change
phải được kiểm soát.

17. Postconditions

Đối với Registration chưa
hết hạn:

State không thay đổi

Đối với Registration hết hạn:

ACTIVE
   ↓
EXPIRED

System:

Ghi nhận State Transition.
Tạo System Audit Log.
Tạo Notification nếu cần.
Ghi nhận kết quả thực thi.
18. Acceptance Criteria
AC01

Scheduler có thể kích hoạt
tác vụ kiểm tra.

AC02

System xác định thời điểm
hiện tại.

AC03

System lấy đúng Registration
cần kiểm tra.

AC04

System đọc đúng Expiry Date.

AC05

System xác định đúng
Registration đã hết hạn.

AC06

Registration chưa hết hạn
không bị thay đổi State.

AC07

Registration hết hạn được
chuyển sang EXPIRED theo
State Machine.

AC08

System không xử lý lại
Registration đã EXPIRED.

AC09

System ghi nhận Audit Log.

AC10

System gửi Notification
theo Business Rules.

AC11

System xử lý lỗi Database.

AC12

System xử lý dữ liệu
Expiry Date không hợp lệ.

AC13

System kiểm soát Concurrent
State Change.

AC14

System ghi nhận kết quả
của lần Scheduler chạy.

19. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-SYS-01
↓
Activity Diagram
↓
Sequence Diagram
↓
Scheduler Service
↓
Database
↓
Notification
↓
Implementation

20. Related Use Cases
UC-SYS-01
Kiểm tra hết hạn
       ↓
Registration hết hạn
       ↓
UC-SYS-02
Chuyển hồ sơ EXPIRED

Có thể liên quan:

UC-SYS-05
Gửi thông báo

và:

UC-SYS-06
Đồng bộ SIS

nếu Business Rules yêu cầu
kiểm tra trạng thái học tập
trước khi xử lý.

21. Responsibility
System Scheduler
= Kích hoạt tác vụ

System
= Kiểm tra thời hạn
  + Kiểm tra State
  + State Transition
  + Audit
  + Notification

Database
= Cung cấp và lưu dữ liệu
22. Status

Use Case ID:

UC-SYS-01

Version:

1.0

Status:

Draft

Previous:

UC-APP-04 — Từ chối Request

Next:

UC-SYS-02 — Chuyển hồ sơ EXPIRED