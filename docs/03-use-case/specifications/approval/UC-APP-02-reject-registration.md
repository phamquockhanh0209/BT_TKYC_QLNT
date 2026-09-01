# UC-APP-02 — TỪ CHỐI HỒ SƠ

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-APP-02 |
| Tên Use Case | Từ chối hồ sơ |
| Actor chính | Approver |
| Actor phụ | System |
| Nhóm | Approval |
| Priority | Critical |

---

# 2. Mục đích

Use Case cho phép Approver đưa ra
quyết định từ chối đối với
Registration không đáp ứng các
điều kiện theo Business Rules.

Việc từ chối phải được thực hiện
bởi Actor có Permission phù hợp,
đúng Data Scope và đúng State.

---

# 3. Preconditions

1. Approver đã đăng nhập.

2. Session còn hiệu lực.

3. Tài khoản có Role phù hợp.

4. Tài khoản có Permission:

```text
REJECT_REGISTRATION
Registration tồn tại.
Registration thuộc Data Scope
của Approver.
Registration đã hoàn thành
bước kiểm tra cần thiết.
Registration đang ở State cho
phép từ chối.
4. Trigger

Approver phát hiện hồ sơ không
đáp ứng điều kiện phê duyệt và
quyết định từ chối hồ sơ.

Luồng:

Hồ sơ chờ duyệt
      ↓
Approver xem xét
      ↓
Không đủ điều kiện
      ↓
Từ chối hồ sơ
5. Main Flow
Bước 1

Approver đăng nhập vào Website.

Bước 2

Approver mở danh sách hồ sơ
chờ xử lý.

Bước 3

System kiểm tra:

Authentication.
Role.
Permission.
Data Scope.
Bước 4

System hiển thị Registration
thuộc phạm vi được phép.

Bước 5

Approver chọn Registration.

Bước 6

System kiểm tra State hiện tại.

Bước 7

System hiển thị thông tin
hồ sơ cần xem xét.

Có thể bao gồm:

Thông tin sinh viên.
Thông tin ngoại trú.
Thông tin nơi ở.
Tài liệu.
Kết quả kiểm tra.
Lịch sử xử lý.
Các yêu cầu bổ sung.
Bước 8

Approver xem xét hồ sơ.

Bước 9

Approver xác định hồ sơ
không đáp ứng điều kiện.

Bước 10

Approver nhập lý do từ chối.

Bước 11

System kiểm tra nội dung
lý do theo Business Rules.

Bước 12

Approver xác nhận quyết định
từ chối.

Bước 13

System kiểm tra lại:

Permission.
Data Scope.
State.
Điều kiện từ chối.
Bước 14

System thực hiện State Transition.

Ví dụ:

PENDING_APPROVAL
        ↓
REJECTED
Bước 15

System lưu quyết định
từ chối.

Bước 16

System ghi nhận Approver
đã thực hiện quyết định.

Bước 17

System tạo Audit Log.

Bước 18

System tạo Notification
cho Student theo Business Rules.

Bước 19

Registration được cập nhật
theo State mới.

6. Lý do từ chối

Approver phải cung cấp
lý do từ chối nếu Business Rules
yêu cầu.

Ví dụ:

Hồ sơ không đáp ứng điều kiện
đăng ký ngoại trú.

hoặc:

Thông tin hồ sơ không hợp lệ.

hoặc:

Tài liệu bắt buộc chưa đáp ứng
yêu cầu.

Lý do thực tế phải phù hợp
với Business Rules.

7. Approval Decision

Quyết định từ chối có thể
bao gồm:

Decision ID
Registration ID
Approver ID
Decision
Reason
Decision At
Previous State
New State

Các trường thực tế phải
phù hợp với Data Model.

8. State Transition

Registration có thể chuyển:

PENDING_APPROVAL
        ↓
REJECTED

Tên State phải sử dụng đúng
State Machine đã được định nghĩa
trong Business Rules.

Approver không được tự ý chuyển
Registration sang State không
hợp lệ.

9. Alternative Flow
A1 — Approver kiểm tra lại

Approver có thể quay lại
thông tin hồ sơ trước khi
xác nhận.

State chưa thay đổi.

A2 — Approver hủy thao tác

Nếu Approver hủy trước khi
xác nhận:

PENDING_APPROVAL

vẫn được giữ nguyên.

Không tạo quyết định từ chối.

A3 — Lý do từ chối chưa đầy đủ

Nếu Business Rules yêu cầu
lý do nhưng Approver chưa nhập:

System yêu cầu nhập lý do.

Không cho phép xác nhận.

10. Exception Flow
E1 — Không có Permission

Nếu Approver không có:

REJECT_REGISTRATION

System từ chối thao tác.

403 Forbidden

Không thay đổi Registration.

E2 — Ngoài Data Scope

Nếu Registration không thuộc
phạm vi của Approver:

System từ chối thao tác.

Không tiết lộ dữ liệu ngoài
phạm vi.

E3 — Registration không tồn tại

System thông báo:

Không tìm thấy hồ sơ.

Không thực hiện Rejection.

E4 — State không hợp lệ

Nếu Registration không ở
State cho phép từ chối:

System từ chối thao tác.

E5 — Lý do không hợp lệ

Nếu lý do không đáp ứng
Business Rules:

System hiển thị lỗi.

Approver phải chỉnh sửa
trước khi xác nhận.

E6 — Hồ sơ đã được xử lý

Nếu Approver khác đã thay đổi
State trước khi xác nhận:

System kiểm tra State mới nhất.

Nếu State không còn phù hợp:

Không thực hiện Rejection.

E7 — Database Error

Nếu không thể lưu quyết định:

ROLLBACK

nếu thao tác nằm trong
transaction.

Không để Registration
ở trạng thái không nhất quán.

E8 — Notification Error

Nếu Notification không gửi được:

System vẫn phải đảm bảo
quyết định từ chối được
lưu nhất quán.

Lỗi Notification phải được
ghi nhận để xử lý.

11. Concurrent Processing

System phải kiểm soát trường
hợp nhiều Approver cùng xử lý
một Registration.

Ví dụ:

Approver A
      ↓
Registration

Approver B
      ↓
Registration

Nếu Approver A đã từ chối:

PENDING_APPROVAL
        ↓
REJECTED

Approver B không được tiếp tục
thực hiện quyết định trên
Registration đó.

System phải kiểm tra State
mới nhất trước khi thực hiện
State Transition.

12. Notification

Sau khi Rejection thành công,
System gửi Notification cho
Student theo Business Rules.

Notification có thể bao gồm:

Registration ID
Decision
Reason
Decision At

Nội dung Notification phải
phản ánh đúng quyết định
từ chối.

13. Audit Log

System ghi nhận sự kiện:

REGISTRATION_REJECTED

Audit Log có thể bao gồm:

Actor ID
Actor Type
Registration ID
Action
Reason
Previous State
New State
Timestamp

Audit Log không được chỉnh sửa
thông qua Use Case này.

14. Security

Approver:

Được phép:

Xem hồ sơ trong Data Scope.
Xem kết quả kiểm tra.
Từ chối Registration nếu
có Permission.

Không mặc nhiên được:

Từ chối hồ sơ ngoài
Data Scope.
Sửa Audit Log.
Quản lý Permission.
Thay đổi Business Rules.
Bỏ qua điều kiện từ chối.
15. Phân biệt Reject và Request
Additional Information

Reject:

Approver
    ↓
Hồ sơ không đáp ứng điều kiện
    ↓
REJECT
    ↓
REJECTED

Request Additional Information:

Processing Officer
    ↓
Thiếu thông tin / tài liệu
    ↓
Yêu cầu bổ sung
    ↓
Student bổ sung

Hai nghiệp vụ này được
quản lý bởi Use Case riêng:

UC-APP-02
Từ chối hồ sơ

UC-OFF-05
Yêu cầu bổ sung
16. Business Constraints
BR-REJ-01

Chỉ Actor có Permission
REJECT_REGISTRATION mới
được từ chối hồ sơ.

BR-REJ-02

Approver chỉ được từ chối
hồ sơ thuộc Data Scope.

BR-REJ-03

Registration phải ở State
cho phép từ chối.

BR-REJ-04

Quyết định từ chối phải
tuân thủ Business Rules.

BR-REJ-05

Lý do từ chối phải được
ghi nhận nếu Business Rules
yêu cầu.

BR-REJ-06

Rejection phải được Audit.

BR-REJ-07

State Transition phải tuân
thủ State Machine.

BR-REJ-08

Không được thực hiện
Rejection nhiều lần trên
cùng một State.

BR-REJ-09

Concurrent State Change
phải được kiểm soát.

BR-REJ-10

Approver không được chỉnh
sửa Audit Log.

17. Postconditions

Nếu Rejection thành công:

PENDING_APPROVAL
        ↓
REJECTED

System lưu:

Decision
Reason
Approver
Timestamp
Previous State
New State

Audit Log được tạo.

Notification được tạo hoặc
gửi theo Business Rules.

18. Acceptance Criteria
AC01

Approver có thể xem hồ sơ
chờ xử lý.

AC02

System kiểm tra Authentication.

AC03

System kiểm tra Permission.

AC04

System kiểm tra Data Scope.

AC05

System kiểm tra Registration State.

AC06

Approver có thể xem thông tin
hồ sơ.

AC07

Approver có thể nhập lý do
từ chối.

AC08

System kiểm tra lý do từ chối.

AC09

Approver có thể xác nhận
Rejection.

AC10

System cập nhật State đúng
theo State Machine.

AC11

System lưu quyết định
từ chối.

AC12

System ghi nhận Approver
và Timestamp.

AC13

System tạo Audit Log.

AC14

System gửi Notification
theo Business Rules.

AC15

Approver không thể từ chối
hồ sơ ngoài Data Scope.

AC16

Approver không thể từ chối
hồ sơ đã được xử lý.

AC17

System xử lý Concurrent
State Change an toàn.

19. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-APP-02
↓
Activity Diagram
↓
Sequence Diagram
↓
API
↓
Approval Module
↓
Frontend
↓
Database
↓
Implementation

20. Related Use Cases
UC-OFF-03
Kiểm tra hồ sơ
       ↓
UC-OFF-04
Kiểm tra tài liệu
       ↓
UC-OFF-06
Theo dõi hồ sơ
       ↓
PENDING_APPROVAL
       ↓
Approver
       │
       ├──────────────┐
       ↓              ↓
UC-APP-01          UC-APP-02
Phê duyệt          Từ chối
       ↓              ↓
    ACTIVE        REJECTED
21. Responsibility
Processing Officer
= Kiểm tra hồ sơ

Approver
= Đưa ra quyết định
  từ chối

System
= Kiểm tra Permission
  + State
  + Data Scope
  + Business Rules
  + Audit
  + Notification
22. Status

Use Case ID:

UC-APP-02

Version:

1.0

Status:

Draft

Previous:

UC-APP-01 — Phê duyệt hồ sơ

Next:

UC-APP-03 — Phê duyệt Request