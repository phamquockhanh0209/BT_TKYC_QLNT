# UC-APP-03 — PHÊ DUYỆT REQUEST

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-APP-03 |
| Tên Use Case | Phê duyệt Request |
| Actor chính | Approver |
| Actor phụ | System |
| Nhóm | Approval |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép Approver xem xét
và đưa ra quyết định phê duyệt đối
với các Request phát sinh trong
quá trình quản lý ngoại trú.

Các Request có thể bao gồm:

- Renewal Request.
- Change Address Request.
- Termination Request.

Mỗi loại Request phải được xử lý
theo Business Rules tương ứng.

---

# 3. Preconditions

1. Approver đã đăng nhập.

2. Session còn hiệu lực.

3. Tài khoản có Role phù hợp.

4. Tài khoản có Permission:

```text
APPROVE_REQUEST
Request tồn tại.
Request thuộc Data Scope
của Approver.
Request đang ở trạng thái
cho phép phê duyệt.
Registration liên quan đến
Request tồn tại và hợp lệ.
4. Trigger

Approver mở danh sách Request
đang chờ phê duyệt.

Luồng:

Dashboard
    ↓
Request chờ duyệt
    ↓
Chọn Request
    ↓
Xem xét
    ↓
Phê duyệt Request
5. Main Flow
Bước 1

Approver đăng nhập vào Website.

Bước 2

Approver mở chức năng:

Request chờ phê duyệt
Bước 3

System kiểm tra:

Authentication.
Role.
Permission.
Data Scope.
Bước 4

System hiển thị danh sách
Request thuộc phạm vi được phép.

Bước 5

Approver chọn một Request.

Bước 6

System kiểm tra:

Request tồn tại.
Request State.
Registration liên quan.
Data Scope.
Permission.
Bước 7

System hiển thị thông tin
Request.

Có thể bao gồm:

Request ID
Request Type
Registration ID
Student ID
Current State
Requested At
Request Data
Attached Documents
Processing History
Bước 8

Approver xem xét Request.

Bước 9

Approver kiểm tra điều kiện
phê duyệt theo Business Rules.

Bước 10

Approver xác nhận quyết định
phê duyệt.

Bước 11

System kiểm tra lại:

Permission.
Data Scope.
Request State.
Registration State.
Điều kiện phê duyệt.
Bước 12

System thực hiện State Transition
của Request.

Ví dụ:

PENDING_APPROVAL
        ↓
APPROVED
Bước 13

System cập nhật Registration
nếu Request yêu cầu thay đổi
trạng thái hoặc dữ liệu nghiệp vụ.

Bước 14

System lưu Approval Decision.

Bước 15

System ghi nhận Approver
và thời gian phê duyệt.

Bước 16

System tạo Audit Log.

Bước 17

System gửi Notification cho
Student theo Business Rules.

6. Các loại Request
6.1 Renewal Request

Sinh viên yêu cầu gia hạn
thời gian ngoại trú.

Luồng:

Student
   ↓
Renewal Request
   ↓
Processing
   ↓
Approver
   ↓
Approve

Việc thay đổi thời hạn phải
tuân thủ Business Rules.

6.2 Change Address Request

Sinh viên yêu cầu chuyển
nơi ở.

Luồng:

Student
   ↓
Change Address Request
   ↓
Processing
   ↓
Approver
   ↓
Approve

Nếu được phê duyệt, thông tin
nơi ở phải được cập nhật theo
quy định của hệ thống.

6.3 Termination Request

Sinh viên yêu cầu kết thúc
trạng thái ngoại trú.

Luồng:

Student
   ↓
Termination Request
   ↓
Processing
   ↓
Approver
   ↓
Approve

Nếu được phê duyệt, Registration
được cập nhật theo State Machine.

7. Request State

Request phải tuân thủ State
Machine của Request.

Ví dụ:

SUBMITTED
    ↓
UNDER_REVIEW
    ↓
PENDING_APPROVAL
    ↓
APPROVED

Tên State thực tế phải sử dụng
đúng Business Rules.

8. Registration State

Việc Approval Request có thể
ảnh hưởng đến Registration.

Ví dụ với Termination Request:

ACTIVE
   ↓
Termination Request
   ↓
APPROVED
   ↓
TERMINATED

Ví dụ với Renewal Request:

ACTIVE
   ↓
Renewal Request
   ↓
APPROVED
   ↓
Cập nhật thời hạn

Ví dụ với Change Address Request:

ACTIVE
   ↓
Change Address Request
   ↓
APPROVED
   ↓
Cập nhật nơi ở

State thực tế phải tuân thủ
State Machine của hệ thống.

9. Alternative Flow
A1 — Renewal Request

Approver chọn Renewal Request.

System hiển thị:

Current Expiry
Requested Expiry
Reason
Supporting Information

Approver kiểm tra và phê duyệt
nếu đủ điều kiện.

A2 — Change Address Request

Approver chọn Change Address
Request.

System hiển thị:

Current Address
New Address
Reason
Supporting Information

Approver kiểm tra và phê duyệt
nếu đủ điều kiện.

A3 — Termination Request

Approver chọn Termination Request.

System hiển thị thông tin
kết thúc ngoại trú.

Approver kiểm tra và phê duyệt
nếu đủ điều kiện.

A4 — Approver hủy thao tác

Nếu Approver hủy trước khi
xác nhận:

Request vẫn giữ State hiện tại.

Không thực hiện Approval.

10. Exception Flow
E1 — Không có Permission

Nếu Approver không có:

APPROVE_REQUEST

System từ chối thao tác.

403 Forbidden

Không thay đổi Request.

E2 — Ngoài Data Scope

Nếu Request không thuộc
phạm vi của Approver:

System từ chối thao tác.

Không tiết lộ dữ liệu
ngoài phạm vi.

E3 — Request không tồn tại

System thông báo:

Không tìm thấy Request.

Không thực hiện Approval.

E4 — Request State không hợp lệ

Nếu Request không ở State
cho phép phê duyệt:

System từ chối thao tác.

E5 — Registration không hợp lệ

Nếu Registration liên quan
không tồn tại hoặc không
ở trạng thái phù hợp:

System không thực hiện
Approval.

E6 — Điều kiện phê duyệt
không đạt

Nếu Request không đáp ứng
Business Rules:

System thông báo Request
chưa đủ điều kiện.

Approver có thể chuyển sang
Use Case từ chối Request:

UC-APP-04
Từ chối Request
E7 — Request đã được xử lý

Nếu Approver khác đã xử lý
Request trước đó:

System kiểm tra State mới nhất.

Nếu Request không còn ở State
cho phép phê duyệt:

Không thực hiện Approval.

E8 — Database Error

Nếu không thể lưu quyết định:

ROLLBACK

nếu thao tác nằm trong
transaction.

Không để Request và
Registration ở trạng thái
không nhất quán.

E9 — Notification Error

Nếu Notification không gửi được:

System vẫn phải đảm bảo
Approval Decision được lưu
nhất quán.

Lỗi Notification phải được
ghi nhận.

11. Transaction

Nếu Approval Request làm thay
đổi cả Request và Registration,
các thay đổi liên quan phải
được xử lý nhất quán.

Ví dụ:

Approve Request
      ↓
Update Request
      ↓
Update Registration
      ↓
Create Approval Record
      ↓
Create Audit Log

Nếu một thao tác quan trọng
thất bại, System phải xử lý
theo cơ chế transaction phù hợp.

12. Approval Decision

System ghi nhận:

Approval ID
Request ID
Approver ID
Decision
Decision At
Comment
Previous State
New State

Các trường thực tế phải
phù hợp với Data Model.

13. Audit Log

System ghi nhận sự kiện:

REQUEST_APPROVED

Audit Log có thể bao gồm:

Actor ID
Actor Type
Request ID
Request Type
Registration ID
Action
Previous State
New State
Timestamp

Audit Log không được chỉnh
sửa thông qua Use Case này.

14. Notification

Sau khi Approval thành công,
System gửi Notification cho
Student theo Business Rules.

Notification có thể chứa:

Request ID
Request Type
Decision
Decision At
Updated Registration State

Nội dung phải phản ánh đúng
kết quả thực tế.

15. Security

Approver:

Được phép:

Xem Request trong Data Scope.
Xem thông tin liên quan.
Phê duyệt Request nếu có
Permission.

Không mặc nhiên được:

Phê duyệt Request ngoài
Data Scope.
Sửa Audit Log.
Quản lý User.
Quản lý Role.
Quản lý Permission.
Thay đổi Business Rules.
16. Concurrent Processing

System phải kiểm soát trường
hợp nhiều Approver cùng xử lý
một Request.

Ví dụ:

Approver A
     ↓
Request

Approver B
     ↓
Request

Nếu Approver A đã phê duyệt:

PENDING_APPROVAL
        ↓
APPROVED

Approver B không được tiếp
tục phê duyệt Request đó.

System phải kiểm tra State
mới nhất trước khi thực hiện
State Transition.

17. Business Constraints
BR-REQ-APP-01

Chỉ Actor có Permission
APPROVE_REQUEST mới được
phê duyệt Request.

BR-REQ-APP-02

Approver chỉ được xử lý
Request thuộc Data Scope.

BR-REQ-APP-03

Request phải ở State cho phép
phê duyệt.

BR-REQ-APP-04

Registration liên quan phải
hợp lệ.

BR-REQ-APP-05

Request phải đáp ứng các
điều kiện theo Business Rules.

BR-REQ-APP-06

Approval phải được ghi nhận.

BR-REQ-APP-07

Approval phải được Audit.

BR-REQ-APP-08

State Transition phải tuân
thủ State Machine.

BR-REQ-APP-09

Không được phê duyệt một
Request nhiều lần.

BR-REQ-APP-10

Concurrent State Change
phải được kiểm soát.

BR-REQ-APP-11

Nếu Approval làm thay đổi
Registration thì thay đổi
phải nhất quán.

18. Postconditions

Nếu Approval thành công:

Request
   ↓
APPROVED

Registration được cập nhật
nếu Request yêu cầu thay đổi
nghiệp vụ.

System lưu:

Approval Decision
Approver
Timestamp
Previous State
New State

Audit Log được tạo.

Notification được tạo hoặc
gửi theo Business Rules.

19. Acceptance Criteria
AC01

Approver có thể xem danh sách
Request chờ duyệt.

AC02

System kiểm tra Authentication.

AC03

System kiểm tra Permission.

AC04

System kiểm tra Data Scope.

AC05

System kiểm tra Request State.

AC06

Approver có thể xem chi tiết
Request.

AC07

System xác định đúng
Request Type.

AC08

Approver có thể xem thông tin
liên quan đến Registration.

AC09

Approver có thể xác nhận
Approval.

AC10

System kiểm tra điều kiện
phê duyệt.

AC11

System cập nhật Request State.

AC12

System cập nhật Registration
nếu cần.

AC13

System lưu Approval Decision.

AC14

System tạo Audit Log.

AC15

System gửi Notification
theo Business Rules.

AC16

System không cho phép Approver
phê duyệt ngoài Data Scope.

AC17

System không cho phép phê duyệt
Request đã được xử lý.

AC18

System xử lý Concurrent
State Change an toàn.

20. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-APP-03
↓
Activity Diagram
↓
Sequence Diagram
↓
API
↓
Request Module
↓
Approval Module
↓
Frontend
↓
Database
↓
Implementation

21. Related Use Cases
UC-REQ-01
Yêu cầu gia hạn
        │
        ├── Processing
        ↓
UC-APP-03
Phê duyệt Request
        ↓
APPROVED
UC-REQ-02
Yêu cầu chuyển nơi ở
        │
        ├── Processing
        ↓
UC-APP-03
Phê duyệt Request
        ↓
APPROVED
UC-REQ-03
Yêu cầu kết thúc ngoại trú
        │
        ├── Processing
        ↓
UC-APP-03
Phê duyệt Request
        ↓
APPROVED

Nếu Request không đáp ứng
điều kiện:

UC-APP-03
     ↓
Không đủ điều kiện
     ↓
UC-APP-04
Từ chối Request
22. Responsibility
Student
= Tạo Request

Processing Officer
= Kiểm tra Request

Approver
= Quyết định Approval

System
= Kiểm tra Permission
  + State
  + Data Scope
  + Business Rules
  + Transaction
  + Audit
  + Notification
23. Status

Use Case ID:

UC-APP-03

Version:

1.0

Status:

Draft

Previous:

UC-APP-02 — Từ chối hồ sơ

Next:

UC-APP-04 — Từ chối Request