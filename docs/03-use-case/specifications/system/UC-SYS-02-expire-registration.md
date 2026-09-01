# UC-SYS-02 — CHUYỂN HỒ SƠ EXPIRED

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-SYS-02 |
| Tên Use Case | Chuyển hồ sơ EXPIRED |
| Actor chính | System Scheduler |
| Actor phụ | System |
| Nhóm | System |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép System tự động
chuyển Registration đã hết hạn
sang trạng thái EXPIRED.

Việc chuyển trạng thái phải tuân
thủ State Machine và Business Rules
của hệ thống.

Use Case được thực hiện tự động
bởi System Scheduler và không yêu
cầu người dùng thao tác trực tiếp.

---

# 3. Preconditions

1. System Scheduler đang hoạt động.

2. Database có thể truy cập.

3. Registration tồn tại.

4. Registration có Expiry Date
   hợp lệ.

5. Registration đang ở State cho
   phép chuyển sang EXPIRED.

6. System có quyền thực hiện
   State Transition.

---

# 4. Trigger

Use Case được kích hoạt khi:

```text
UC-SYS-01
Kiểm tra hết hạn
        ↓
Phát hiện Registration hết hạn
        ↓
UC-SYS-02
Chuyển hồ sơ EXPIRED

Ngoài ra Scheduler có thể trực
tiếp kích hoạt Use Case theo
lịch nếu Business Rules cho phép.

5. Main Flow
Bước 1

System nhận Registration đã được
xác định là hết hạn.

Bước 2

System lấy State hiện tại của
Registration.

Bước 3

System kiểm tra State có cho phép
chuyển sang EXPIRED hay không.

Ví dụ:

ACTIVE
   ↓
EXPIRED
Bước 4

System kiểm tra Expiry Date.

Bước 5

System xác nhận Registration
đã hết hạn.

Bước 6

System thực hiện State Transition.

ACTIVE
   ↓
EXPIRED
Bước 7

System cập nhật Registration.

Các thông tin có thể được cập nhật:

Registration State
Updated At
Expired At

Các trường thực tế phải phù hợp
với Data Model.

Bước 8

System lưu State Transition
History nếu hệ thống có
lưu lịch sử.

Bước 9

System tạo System Audit Log.

Bước 10

System tạo Notification cho
Student nếu Business Rules
yêu cầu.

Bước 11

System ghi nhận kết quả xử lý.

6. State Transition

State Transition chính:

ACTIVE
   ↓
EXPIRED

System không được tự ý thực hiện
Transition ngoài State Machine.

7. Alternative Flow
A1 — Hồ sơ chưa hết hạn

Nếu Registration chưa hết hạn:

ACTIVE

được giữ nguyên.

Không thực hiện Transition.

A2 — Hồ sơ đã EXPIRED

Nếu Registration đã có State:

EXPIRED

System không thực hiện lại
Transition.

Không tạo Approval hoặc
Notification trùng lặp.

A3 — State khác

Nếu Registration đang ở State
khác:

DRAFT
SUBMITTED
UNDER_REVIEW
...

System kiểm tra State Machine.

Nếu State hiện tại không cho phép
chuyển sang EXPIRED:

Không thực hiện Transition.

A4 — Nhiều hồ sơ hết hạn

System xử lý nhiều Registration
theo batch.

Ví dụ:

Registration A → EXPIRED
Registration B → EXPIRED
Registration C → EXPIRED

Mỗi Registration phải được
xử lý theo State Machine.

8. Exception Flow
E1 — Registration không tồn tại

Nếu Registration không tồn tại:

System ghi nhận lỗi.

Không thực hiện Transition.

E2 — Expiry Date không hợp lệ

Nếu Expiry Date bị thiếu hoặc
không hợp lệ:

System không tự ý chuyển
Registration sang EXPIRED.

System ghi nhận lỗi dữ liệu.

E3 — State không hợp lệ

Nếu State hiện tại không cho
phép Transition:

System không cập nhật State.

Lỗi được ghi nhận.

E4 — Concurrent Update

Nếu một Actor hoặc tác vụ khác
đã thay đổi Registration:

System phải kiểm tra State
mới nhất trước khi cập nhật.

Nếu State không còn phù hợp:

Không thực hiện Transition.

E5 — Database Error

Nếu Database không thể cập nhật:

System ghi nhận lỗi.

Nếu sử dụng transaction:

ROLLBACK

được thực hiện theo Transaction
Policy.

Registration không được để ở
trạng thái không nhất quán.

E6 — Audit Log Error

Nếu không thể ghi Audit Log:

System xử lý theo Audit Policy
của hệ thống.

Không được làm mất thông tin
quan trọng về State Transition.

E7 — Notification Error

Nếu Notification không gửi được:

State Transition vẫn phải được
lưu nhất quán.

Lỗi Notification được ghi nhận
để xử lý lại.

9. Transaction

State Transition phải được xử lý
nhất quán.

Ví dụ:

Verify Registration
        ↓
Verify State
        ↓
Verify Expiry Date
        ↓
Update State
        ↓
Save Transition History
        ↓
Create Audit Log

Nếu có các thao tác bắt buộc
phải thực hiện cùng nhau, chúng
phải được xử lý trong transaction
phù hợp.

10. Idempotency

Use Case phải đảm bảo có thể
chạy nhiều lần mà không gây ra
các thay đổi hoặc sự kiện trùng
lặp không cần thiết.

Ví dụ:

Lần 1:

ACTIVE
   ↓
EXPIRED

Lần 2:

EXPIRED

Không thực hiện:

EXPIRED
   ↓
EXPIRED

Không tạo thêm Notification
hoặc Audit Event trùng lặp nếu
không cần thiết.

11. Concurrent Processing

System phải kiểm soát trường
hợp nhiều Scheduler hoặc tác vụ
cùng xử lý một Registration.

Ví dụ:

Scheduler A
     ↓
Registration
     ↑
Scheduler B

System phải đảm bảo chỉ có một
State Transition hợp lệ.

12. System Audit Log

System ghi nhận sự kiện:

REGISTRATION_EXPIRED

Thông tin có thể bao gồm:

Registration ID
Previous State
New State
Expired At
Execution Time
Scheduler ID
Action
Result

Audit Log phải phản ánh đúng
thay đổi thực tế.

13. Notification

Sau khi Registration được
chuyển sang EXPIRED, System
có thể gửi Notification cho
Student theo Business Rules.

Ví dụ:

Registration của bạn đã hết hạn.
Vui lòng thực hiện Request phù hợp
nếu muốn tiếp tục đăng ký ngoại trú.

Notification phải sử dụng
State thực tế sau khi cập nhật.

14. Security

System Scheduler chỉ được phép
thực hiện các State Transition
được cấu hình.

Scheduler không được:

Thay đổi Business Rules.
Sửa Audit Log.
Thay đổi Permission.
Thay đổi Role.
Thực hiện Transition ngoài
State Machine.
15. Business Constraints
BR-SYS-EXP-11

Chỉ Registration đã hết hạn
mới được xem xét chuyển
EXPIRED.

BR-SYS-EXP-12

State Transition phải tuân
thủ State Machine.

BR-SYS-EXP-13

Registration đã EXPIRED không
được chuyển EXPIRED lần nữa.

BR-SYS-EXP-14

System phải kiểm tra State
mới nhất trước khi Transition.

BR-SYS-EXP-15

State Transition phải được
ghi nhận.

BR-SYS-EXP-16

System phải tạo Audit Log.

BR-SYS-EXP-17

Notification phải phản ánh
đúng kết quả xử lý.

BR-SYS-EXP-18

Lỗi xử lý phải được ghi nhận.

BR-SYS-EXP-19

Concurrent Processing phải
được kiểm soát.

16. Postconditions

Nếu xử lý thành công:

ACTIVE
   ↓
EXPIRED

Registration có State:

EXPIRED

System:

Lưu State mới.
Lưu State Transition History
nếu có.
Tạo Audit Log.
Tạo Notification nếu cần.
Ghi nhận kết quả thực thi.

Nếu xử lý thất bại:

Registration không được chuyển
sang State không hợp lệ.

17. Acceptance Criteria
AC01

System nhận diện đúng
Registration đã hết hạn.

AC02

System kiểm tra State hiện tại.

AC03

System kiểm tra State Machine.

AC04

System chuyển Registration
hợp lệ sang EXPIRED.

AC05

Registration chưa hết hạn
không bị chuyển EXPIRED.

AC06

Registration đã EXPIRED không
bị xử lý lại.

AC07

System ghi nhận State Transition.

AC08

System tạo Audit Log.

AC09

System gửi Notification theo
Business Rules.

AC10

System xử lý Concurrent Update.

AC11

System xử lý Database Error.

AC12

System xử lý dữ liệu thời hạn
không hợp lệ.

AC13

System đảm bảo Idempotency.

AC14

System ghi nhận kết quả
của tác vụ.

18. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-SYS-02
↓
Activity Diagram
↓
Sequence Diagram
↓
Scheduler Service
↓
Registration Service
↓
Database
↓
Notification
↓
Implementation

19. Related Use Cases

Use Case trước:

UC-SYS-01
Kiểm tra hết hạn

Quan hệ:

UC-SYS-01
     ↓
Phát hiện hết hạn
     ↓
UC-SYS-02
     ↓
EXPIRED

Use Case liên quan:

UC-SYS-05
Gửi thông báo

Các Request có thể được tạo
sau khi hồ sơ hết hạn theo
Business Rules.

20. Responsibility
System Scheduler
= Kích hoạt tác vụ

System
= Kiểm tra điều kiện
  + State
  + State Machine
  + State Transition
  + Audit
  + Notification

Database
= Lưu Registration
  + State
  + Transition History
21. Status

Use Case ID:

UC-SYS-02

Version:

1.0

Status:

Draft

Previous:

UC-SYS-01 — Kiểm tra hết hạn

Next:

UC-SYS-03 — Kiểm tra SLA