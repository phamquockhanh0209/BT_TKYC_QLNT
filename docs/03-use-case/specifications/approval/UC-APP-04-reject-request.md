# UC-APP-04 — TỪ CHỐI REQUEST

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-APP-04 |
| Tên Use Case | Từ chối Request |
| Actor chính | Approver |
| Actor phụ | System |
| Nhóm | Approval |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép Approver xem xét
và từ chối các Request phát sinh
trong quá trình quản lý ngoại trú
khi Request không đáp ứng các
điều kiện theo Business Rules.

Các Request có thể bao gồm:

- Renewal Request.
- Change Address Request.
- Termination Request.

Việc từ chối phải được thực hiện
bởi Approver có Permission phù hợp,
đúng Data Scope và đúng State.

---

# 3. Preconditions

1. Approver đã đăng nhập.

2. Session còn hiệu lực.

3. Tài khoản có Role phù hợp.

4. Tài khoản có Permission:

```text
REJECT_REQUEST
Request tồn tại.
Request thuộc Data Scope
của Approver.
Request đang ở State cho phép
từ chối.
Registration liên quan tồn tại
và hợp lệ.
4. Trigger

Approver xác định Request không
đáp ứng điều kiện phê duyệt và
quyết định từ chối.

Luồng:

Request chờ duyệt
      ↓
Approver xem xét
      ↓
Không đủ điều kiện
      ↓
Từ chối Request
5. Main Flow
Bước 1

Approver đăng nhập vào Website.

Bước 2

Approver mở danh sách Request
chờ phê duyệt.

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

Approver chọn Request.

Bước 6

System kiểm tra:

Request tồn tại.
Request State.
Registration liên quan.
Data Scope.
Permission.
Bước 7

System hiển thị thông tin Request.

Có thể bao gồm:

Request ID.
Request Type.
Registration ID.
Student ID.
Nội dung Request.
Tài liệu đính kèm.
Lịch sử xử lý.
Kết quả kiểm tra.
Bước 8

Approver xem xét Request.

Bước 9

Approver xác định Request
không đáp ứng điều kiện.

Bước 10

Approver nhập lý do từ chối.

Bước 11

System kiểm tra lý do từ chối
theo Business Rules.

Bước 12

Approver xác nhận quyết định.

Bước 13

System kiểm tra lại:

Permission.
Data Scope.
Request State.
Registration State.
Điều kiện từ chối.
Bước 14

System thực hiện State Transition.

Ví dụ:

PENDING_APPROVAL
        ↓
REJECTED
Bước 15

System lưu quyết định từ chối.

Bước 16

System ghi nhận Approver
và thời gian thực hiện.

Bước 17

System tạo Audit Log.

Bước 18

System gửi Notification
cho Student theo Business Rules.

6. Lý do từ chối

Approver phải cung cấp lý do
từ chối nếu Business Rules
yêu cầu.

Ví dụ:

Request không đáp ứng
điều kiện theo quy định.

Hoặc:

Thông tin trong Request
không hợp lệ.

Hoặc:

Tài liệu hỗ trợ không
đáp ứng yêu cầu.

Lý do thực tế phải phù hợp
với Business Rules.

7. Xử lý theo Request Type
7.1 Renewal Request

Nếu yêu cầu gia hạn không
đủ điều kiện:

Renewal Request
       ↓
REJECTED

Registration không được
gia hạn.

7.2 Change Address Request

Nếu yêu cầu chuyển nơi ở
không đủ điều kiện:

Change Address Request
       ↓
REJECTED

Địa chỉ hiện tại của
Registration không thay đổi
bởi Request này.

7.3 Termination Request

Nếu yêu cầu kết thúc ngoại trú
không đủ điều kiện:

Termination Request
       ↓
REJECTED

Registration tiếp tục giữ
trạng thái hiện tại theo
State Machine.

8. Request State

Request phải tuân thủ
State Machine.

Ví dụ:

SUBMITTED
    ↓
UNDER_REVIEW
    ↓
PENDING_APPROVAL
    ↓
REJECTED

Tên State thực tế phải sử dụng
đúng State Machine đã định nghĩa
trong Business Rules.

9. Alternative Flow
A1 — Approver kiểm tra lại

Approver có thể quay lại
thông tin Request trước khi
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

A4 — Request cần bổ sung

Nếu Request thực tế chỉ thiếu
thông tin hoặc tài liệu và
Business Rules cho phép yêu cầu
bổ sung:

Approver không thực hiện
Rejection.

Request được xử lý theo
Use Case yêu cầu bổ sung
phù hợp.

10. Exception Flow
E1 — Không có Permission

Nếu Approver không có:

REJECT_REQUEST

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

Không thực hiện Rejection.

E4 — Request State không hợp lệ

Nếu Request không ở State
cho phép từ chối:

System từ chối thao tác.

Không thay đổi State.

E5 — Registration không hợp lệ

Nếu Registration liên quan
không tồn tại hoặc không
phù hợp:

System không thực hiện
Rejection.

E6 — Lý do không hợp lệ

Nếu lý do không đáp ứng
Business Rules:

System hiển thị lỗi.

Approver phải chỉnh sửa
trước khi xác nhận.

E7 — Request đã được xử lý

Nếu Approver khác đã thay đổi
Request trước khi Approver
hiện tại xác nhận:

System kiểm tra State mới nhất.

Nếu State không còn phù hợp:

Không thực hiện Rejection.

E8 — Database Error

Nếu không thể lưu quyết định:

ROLLBACK

nếu thao tác nằm trong
transaction.

Không để dữ liệu Request
ở trạng thái không nhất quán.

E9 — Notification Error

Nếu Notification không gửi được:

System vẫn phải đảm bảo
quyết định Rejection được
lưu nhất quán.

Lỗi Notification phải được
ghi nhận để xử lý.

11. Transaction

Nếu Rejection Request có
thay đổi liên quan đến
Registration, các thay đổi
phải được xử lý nhất quán.

Ví dụ:

Reject Request
      ↓
Update Request
      ↓
Create Decision
      ↓
Create Audit Log
      ↓
Send Notification

Nếu có cập nhật Registration
theo Business Rules, việc cập
nhật phải được thực hiện trong
cùng transaction phù hợp.

12. Rejection Decision

System ghi nhận:

Decision ID
Request ID
Approver ID
Decision
Reason
Decision At
Previous State
New State

Các trường thực tế phải
phù hợp với Data Model.

13. Audit Log

System ghi nhận sự kiện:

REQUEST_REJECTED

Audit Log có thể bao gồm:

Actor ID
Actor Type
Request ID
Request Type
Registration ID
Action
Reason
Previous State
New State
Timestamp

Audit Log không được chỉnh sửa
thông qua Use Case này.

14. Notification

Sau khi Rejection thành công,
System gửi Notification cho
Student theo Business Rules.

Notification có thể bao gồm:

Request ID
Request Type
Decision
Reason
Decision At

Nội dung phải phản ánh đúng
quyết định từ chối.

15. Security

Approver:

Được phép:

Xem Request trong Data Scope.
Xem thông tin liên quan.
Từ chối Request nếu có
Permission.

Không mặc nhiên được:

Từ chối Request ngoài
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

Nếu Approver A đã từ chối:

PENDING_APPROVAL
        ↓
REJECTED

Approver B không được tiếp tục
từ chối Request đó.

System phải kiểm tra State
mới nhất trước khi thực hiện
State Transition.

17. Business Constraints
BR-REQ-REJ-01

Chỉ Actor có Permission
REJECT_REQUEST mới được
từ chối Request.

BR-REQ-REJ-02

Approver chỉ được từ chối
Request thuộc Data Scope.

BR-REQ-REJ-03

Request phải ở State cho phép
từ chối.

BR-REQ-REJ-04

Quyết định từ chối phải
tuân thủ Business Rules.

BR-REQ-REJ-05

Lý do từ chối phải được
ghi nhận nếu Business Rules
yêu cầu.

BR-REQ-REJ-06

Rejection phải được Audit.

BR-REQ-REJ-07

State Transition phải tuân
thủ State Machine.

BR-REQ-REJ-08

Không được từ chối một
Request nhiều lần trên cùng
một State.

BR-REQ-REJ-09

Concurrent State Change
phải được kiểm soát.

BR-REQ-REJ-10

Approver không được chỉnh
sửa Audit Log.

18. Postconditions

Nếu Rejection thành công:

Request
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

Registration không được thay
đổi nếu Rejection không yêu
cầu thay đổi Registration.

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

Approver có thể nhập lý do
từ chối.

AC09

System kiểm tra lý do.

AC10

Approver có thể xác nhận
Rejection.

AC11

System cập nhật Request State.

AC12

System lưu Rejection Decision.

AC13

System ghi nhận Approver
và Timestamp.

AC14

System tạo Audit Log.

AC15

System gửi Notification
theo Business Rules.

AC16

Approver không thể từ chối
Request ngoài Data Scope.

AC17

Approver không thể từ chối
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
UC-APP-04
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
        ↓
Processing
        ↓
PENDING_APPROVAL
        ↓
UC-APP-04
Từ chối Request
        ↓
REJECTED
UC-REQ-02
Yêu cầu chuyển nơi ở
        ↓
Processing
        ↓
PENDING_APPROVAL
        ↓
UC-APP-04
Từ chối Request
        ↓
REJECTED
UC-REQ-03
Yêu cầu kết thúc ngoại trú
        ↓
Processing
        ↓
PENDING_APPROVAL
        ↓
UC-APP-04
Từ chối Request
        ↓
REJECTED
22. Responsibility
Student
= Tạo Request

Processing Officer
= Kiểm tra Request

Approver
= Quyết định từ chối

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

UC-APP-04

Version:

1.0

Status:

Draft

Previous:

UC-APP-03 — Phê duyệt Request

Next:

System Use Cases