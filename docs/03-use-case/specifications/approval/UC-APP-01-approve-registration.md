# UC-APP-01 — PHÊ DUYỆT HỒ SƠ

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-APP-01 |
| Tên Use Case | Phê duyệt hồ sơ |
| Actor chính | Approver |
| Actor phụ | System |
| Nhóm | Approval |
| Priority | Critical |

---

# 2. Mục đích

Use Case cho phép Approver xem xét
và đưa ra quyết định phê duyệt đối
với Registration đã hoàn thành
quá trình kiểm tra nghiệp vụ.

Approver chỉ được phê duyệt hồ sơ
khi tài khoản có Permission phù hợp
và hồ sơ đáp ứng đầy đủ các điều kiện
theo Business Rules.

---

# 3. Preconditions

1. Approver đã đăng nhập.

2. Session còn hiệu lực.

3. Tài khoản có Role Approver hoặc
   Role có Permission tương ứng.

4. Tài khoản có Permission:

```text
APPROVE_REGISTRATION
Registration tồn tại.
Registration thuộc Data Scope
của Approver.
Registration đã hoàn thành
bước kiểm tra nghiệp vụ.
Registration đang ở State cho
phép phê duyệt.
4. Trigger

Approver mở danh sách hồ sơ
đủ điều kiện duyệt.

Luồng:

Dashboard
    ↓
Hồ sơ chờ duyệt
    ↓
Chọn Registration
    ↓
Phê duyệt hồ sơ
5. Main Flow
Bước 1

Approver đăng nhập vào hệ thống.

Bước 2

Approver mở danh sách hồ sơ
chờ phê duyệt.

Bước 3

System kiểm tra:

Authentication.
Role.
Permission.
Data Scope.
Bước 4

System hiển thị các Registration
đủ điều kiện xem xét.

Bước 5

Approver chọn một Registration.

Bước 6

System kiểm tra State hiện tại
của Registration.

Bước 7

System hiển thị thông tin hồ sơ
trong phạm vi được phép.

Có thể bao gồm:

Thông tin sinh viên.
Thông tin ngoại trú.
Thông tin nơi ở.
Tài liệu.
Kết quả kiểm tra.
Lịch sử xử lý.
Các yêu cầu bổ sung.
Thông tin liên quan đến việc
kiểm tra điều kiện.
Bước 8

Approver xem xét hồ sơ.

Bước 9

Approver kiểm tra kết quả
xử lý trước đó.

Bước 10

Approver xác nhận quyết định
phê duyệt.

Bước 11

System kiểm tra lại:

Permission.
Data Scope.
State.
Điều kiện phê duyệt.
Tính hợp lệ của hồ sơ.
Bước 12

System thực hiện State Transition
theo State Machine.

Ví dụ:

PENDING_APPROVAL
        ↓
ACTIVE
Bước 13

System lưu quyết định
phê duyệt.

Bước 14

System ghi nhận Approver
thực hiện quyết định.

Bước 15

System tạo Audit Log.

Bước 16

System gửi Notification cho
Student theo Business Rules.

Bước 17

Registration được xem là đã
được phê duyệt theo trạng thái
mới của hệ thống.

6. Kiểm tra trước khi phê duyệt

Trước khi thực hiện Approval,
System phải kiểm tra các điều
kiện được quy định.

Ví dụ:

Registration
      ↓
State hợp lệ
      ↓
Thông tin hợp lệ
      ↓
Tài liệu hợp lệ
      ↓
Review hoàn tất
      ↓
Data Scope hợp lệ
      ↓
Permission hợp lệ
      ↓
Approve

Các điều kiện cụ thể phải
tuân thủ Business Rules.

7. Quyết định phê duyệt

Approver thực hiện:

Approve

System yêu cầu xác nhận nếu
Business Rules hoặc giao diện
yêu cầu.

Ví dụ:

Bạn có chắc chắn muốn
phê duyệt hồ sơ này?

Approver xác nhận.

System mới thực hiện State
Transition.

8. State Transition

Registration có thể chuyển:

PENDING_APPROVAL
        ↓
ACTIVE

Tên State thực tế phải sử dụng
đúng State Machine đã được
định nghĩa trong Business Rules.

Approver không được tự ý
chuyển sang State không hợp lệ.

9. Alternative Flow
A1 — Approver xem lại hồ sơ

Approver có thể quay lại
thông tin hồ sơ trước khi
đưa ra quyết định.

A2 — Approver chưa xác nhận

Nếu Approver chưa xác nhận:

PENDING_APPROVAL

vẫn được giữ nguyên.

Không thực hiện Approval.

A3 — Hồ sơ không đủ điều kiện

Nếu phát hiện hồ sơ chưa
đủ điều kiện:

Approver không thực hiện
phê duyệt.

Approver có thể chuyển sang
quy trình từ chối nếu phù hợp:

UC-APP-02
Từ chối hồ sơ

hoặc xử lý theo Business Rules.

A4 — Approver mở lại hồ sơ

Approver có thể xem lại
kết quả kiểm tra và tài liệu
trước khi xác nhận.

10. Exception Flow
E1 — Không có Permission

Nếu Approver không có:

APPROVE_REGISTRATION

System từ chối thao tác.

403 Forbidden

Không thay đổi Registration.

E2 — Ngoài Data Scope

Nếu Registration không thuộc
phạm vi của Approver:

System từ chối thao tác.

Không tiết lộ dữ liệu
ngoài phạm vi.

E3 — Registration không tồn tại

System thông báo:

Không tìm thấy hồ sơ.

Không thực hiện Approval.

E4 — State không hợp lệ

Nếu Registration không ở:

PENDING_APPROVAL

hoặc State tương ứng theo
Business Rules:

System từ chối Approval.

E5 — Điều kiện phê duyệt
không đạt

Nếu hồ sơ chưa đáp ứng điều
kiện:

System thông báo hồ sơ chưa
đủ điều kiện.

Không chuyển sang ACTIVE.

E6 — Hồ sơ đã được Approver
khác xử lý

Nếu một Approver khác đã
thay đổi State trước khi
Approver hiện tại xác nhận:

System kiểm tra State mới nhất.

Nếu State không còn phù hợp:

Không thực hiện Approval.

E7 — Database Error

Nếu không thể lưu quyết định:

ROLLBACK

nếu thao tác nằm trong
transaction.

Không được để Registration
ở trạng thái không nhất quán.

E8 — Notification Error

Nếu Notification không gửi
được:

System vẫn phải đảm bảo
quyết định Approval được
lưu nhất quán.

Lỗi Notification phải được
ghi nhận để xử lý.

11. Approval Decision

Quyết định phê duyệt phải
được ghi nhận.

Có thể bao gồm:

Approval ID
Registration ID
Approver ID
Decision
Decision At
Comment
Previous State
New State

Các trường thực tế phải
phù hợp với Data Model.

12. Audit Log

System ghi nhận sự kiện:

REGISTRATION_APPROVED

Audit Log có thể bao gồm:

Actor ID
Actor Type
Registration ID
Action
Previous State
New State
Timestamp
Decision

Audit Log không được chỉnh
sửa thông qua Use Case này.

13. Notification

Sau khi Approval thành công,
System gửi Notification cho
Student nếu Business Rules
yêu cầu.

Ví dụ:

Hồ sơ ngoại trú của bạn
đã được phê duyệt.

Notification phải phản ánh
đúng State mới nhất.

14. Security

Approver:

Được phép:

Xem hồ sơ trong Data Scope.
Xem kết quả kiểm tra.
Xem tài liệu được phép.
Phê duyệt Registration nếu
có Permission.

Không mặc nhiên được:

Phê duyệt hồ sơ ngoài
Data Scope.
Sửa Audit Log.
Quản lý Permission.
Thay đổi Business Rules.
Tự ý bỏ qua điều kiện
phê duyệt.
15. Phân biệt Approve và Reject

Approval:

Approver
    ↓
Đủ điều kiện
    ↓
APPROVE
    ↓
ACTIVE

Rejection:

Approver
    ↓
Không đủ điều kiện
    ↓
REJECT
    ↓
REJECTED

Hai hành động được quản lý
bởi hai Use Case riêng:

UC-APP-01
Phê duyệt hồ sơ

UC-APP-02
Từ chối hồ sơ
16. Concurrent Processing

System phải kiểm soát trường
hợp nhiều Approver cùng mở
một Registration.

Ví dụ:

Approver A
      ↓
Registration

Approver B
      ↓
Registration

Nếu Approver A đã phê duyệt:

PENDING_APPROVAL
        ↓
ACTIVE

Approver B không được tiếp
tục phê duyệt Registration
đó.

System phải kiểm tra State
mới nhất trước khi thực hiện
State Transition.

17. Business Constraints
BR-APP-01

Chỉ Actor có Permission
APPROVE_REGISTRATION mới
được phê duyệt hồ sơ.

BR-APP-02

Approver chỉ được phê duyệt
hồ sơ thuộc Data Scope.

BR-APP-03

Registration phải ở State
cho phép phê duyệt.

BR-APP-04

Hồ sơ phải đáp ứng các điều
kiện phê duyệt theo Business
Rules.

BR-APP-05

Approver không được tự ý
bỏ qua Business Rules.

BR-APP-06

Approval phải được ghi nhận.

BR-APP-07

Approval phải được Audit.

BR-APP-08

State Transition phải tuân
thủ State Machine.

BR-APP-09

Approval không được thực hiện
hai lần trên cùng một State.

BR-APP-10

Concurrent State Change
phải được kiểm soát.

BR-APP-11

Approver không được sửa
Audit Log.

BR-APP-12

Approval không đồng nghĩa
với quyền quản trị hệ thống.

18. Postconditions

Nếu Approval thành công:

PENDING_APPROVAL
        ↓
ACTIVE

System lưu:

Approval Decision
Approver
Timestamp
Previous State
New State

Audit Log được tạo.

Notification được tạo hoặc
gửi theo Business Rules.

Registration trở thành
ACTIVE nếu State Machine
quy định như vậy.

19. Acceptance Criteria
AC01

Approver có thể xem danh sách
hồ sơ chờ duyệt.

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

Approver có thể xem kết quả
kiểm tra.

AC08

Approver có thể xem tài liệu
được phép.

AC09

Approver có thể xác nhận
Approval.

AC10

System kiểm tra điều kiện
trước khi Approval.

AC11

System cập nhật State đúng
theo State Machine.

AC12

System lưu Approval Decision.

AC13

System ghi Approver và
Timestamp.

AC14

System tạo Audit Log.

AC15

System gửi Notification
theo Business Rules.

AC16

Approver không thể phê duyệt
hồ sơ ngoài Data Scope.

AC17

Approver không thể phê duyệt
hồ sơ đã được xử lý trước đó.

AC18

System xử lý Concurrent
Approval an toàn.

20. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-APP-01
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

21. Related Use Cases
UC-OFF-03
Kiểm tra hồ sơ
       ↓
UC-OFF-04
Kiểm tra tài liệu
       ↓
UC-OFF-05
Yêu cầu bổ sung
       ↓
UC-OFF-06
Theo dõi hồ sơ
       ↓
PENDING_APPROVAL
       ↓
UC-APP-01
Phê duyệt hồ sơ
       │
       ├───────────────┐
       ↓               ↓
     APPROVE          REJECT
       ↓               ↓
    ACTIVE        UC-APP-02
22. Responsibility
Processing Officer
= Kiểm tra hồ sơ

Approver
= Đưa ra quyết định

System
= Kiểm tra Permission
  + State
  + Data Scope
  + Business Rules
  + Audit
  + Notification

Approver chịu trách nhiệm
đưa ra quyết định phê duyệt
trong phạm vi được phân quyền.

23. Status

Use Case ID:

UC-APP-01

Version:

1.0

Status:

Draft

Previous:

UC-OFF-06 — Theo dõi hồ sơ xử lý

Next:

UC-APP-02 — Từ chối hồ sơ