# UC-ADM-03 — QUẢN LÝ PERMISSION

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-ADM-03 |
| Tên Use Case | Quản lý Permission |
| Actor chính | Administrator |
| Nhóm | Administration |
| Priority | High |
| Đối tượng | Permission |

---

# 2. Mục đích

Use Case mô tả việc Administrator
quản lý các Permission được sử dụng
trong hệ thống quản lý sinh viên
ngoại trú.

Permission xác định một hành động
mà User được phép thực hiện.

Ví dụ:

```text
VIEW_REGISTRATION
CREATE_REGISTRATION
APPROVE_REGISTRATION
REJECT_REGISTRATION
MANAGE_USER

Permission được kết hợp với Role
để xây dựng cơ chế phân quyền.

Mô hình tổng quát:

USER
  ↓
ROLE
  ↓
PERMISSION
  ↓
DATA SCOPE
3. Phân biệt Role và Permission

Role đại diện cho vai trò
của User.

Ví dụ:

APPROVER

Permission đại diện cho hành động
User được phép thực hiện.

Ví dụ:

APPROVE_REGISTRATION

Do đó:

APPROVER
    ↓
APPROVE_REGISTRATION

Role không nên được sử dụng
thay thế cho Permission.

4. Phạm vi

Administrator có thể:

Xem Permission.
Xem chi tiết Permission.
Tạo Permission nếu hệ thống
cho phép.
Cập nhật Permission nếu
Permission không bị khóa.
Kích hoạt Permission.
Vô hiệu hóa Permission.
Gán Permission cho Role.
Hủy Permission khỏi Role.
5. Preconditions
Administrator đã đăng nhập.
Phiên đăng nhập còn hiệu lực.
Administrator có Permission
quản lý Permission.
Hệ thống đang hoạt động.
6. Trigger

Administrator truy cập:

Quản trị
   ↓
Permission Management
7. Main Flow — Xem danh sách Permission
Bước 1

Administrator mở chức năng
Quản lý Permission.

Bước 2

System kiểm tra Permission
của Administrator.

Bước 3

System lấy danh sách
Permission.

Bước 4

System hiển thị:

Permission ID
Permission Code
Permission Name
Description
Module
Status
Created At
Updated At
8. Main Flow — Xem chi tiết Permission
Bước 1

Administrator chọn một Permission.

Bước 2

System hiển thị thông tin.

Bước 3

System hiển thị các Role
đang sử dụng Permission đó.

Ví dụ:

APPROVE_REGISTRATION
        ↓
     APPROVER

Một Permission có thể được
gán cho nhiều Role.

9. Main Flow — Tạo Permission

Nếu hệ thống cho phép tạo
Permission tùy chỉnh:

Bước 1

Administrator chọn:

Tạo Permission
Bước 2

Administrator nhập:

Permission Code
Permission Name
Description
Module
Bước 3

System kiểm tra dữ liệu.

Bước 4

System kiểm tra Permission Code
không bị trùng.

Bước 5

System tạo Permission.

Bước 6

System ghi Audit Log:

PERMISSION_CREATED
10. Main Flow — Cập nhật Permission
Bước 1

Administrator chọn Permission.

Bước 2

Administrator chọn:

Cập nhật
Bước 3

Administrator thay đổi các trường
được phép chỉnh sửa.

Bước 4

System kiểm tra dữ liệu.

Bước 5

System lưu thay đổi.

Bước 6

System ghi Audit Log:

PERMISSION_UPDATED
11. Main Flow — Kích hoạt Permission

Administrator chọn Permission
đang INACTIVE.

System yêu cầu xác nhận.

Sau khi xác nhận:

INACTIVE
    ↓
ACTIVE

System ghi:

PERMISSION_ACTIVATED
12. Main Flow — Vô hiệu hóa Permission

Administrator chọn Permission
đang ACTIVE.

System kiểm tra các Role
đang sử dụng Permission.

Nếu chính sách cho phép:

ACTIVE
    ↓
INACTIVE

System ghi:

PERMISSION_DEACTIVATED

Permission INACTIVE không còn
được sử dụng để cấp quyền
thực hiện thao tác.

13. Main Flow — Gán Permission cho Role
Bước 1

Administrator chọn Role.

Bước 2

Administrator chọn:

Quản lý Permission
Bước 3

System hiển thị danh sách
Permission có thể gán.

Bước 4

Administrator chọn Permission.

Bước 5

System kiểm tra Permission
có hợp lệ và ACTIVE hay không.

Bước 6

System tạo quan hệ:

ROLE
  ↓
ROLE_PERMISSION
  ↓
PERMISSION
Bước 7

System ghi Audit Log:

ROLE_PERMISSION_ASSIGNED
14. Main Flow — Hủy Permission khỏi Role
Bước 1

Administrator chọn Role.

Bước 2

System hiển thị Permission
đang được gán.

Bước 3

Administrator chọn Permission
cần hủy.

Bước 4

System yêu cầu xác nhận.

Bước 5

System xóa quan hệ:

ROLE
  X
ROLE_PERMISSION
  X
PERMISSION
Bước 6

System ghi:

ROLE_PERMISSION_REMOVED
15. Quan hệ Role — Permission

Một Role có thể có nhiều
Permission.

Một Permission có thể
được sử dụng bởi nhiều Role.

Do đó:

ROLE
  ↕
ROLE_PERMISSION
  ↕
PERMISSION

là quan hệ Many-to-Many.

16. Ví dụ Permission
Student
VIEW_OWN_PROFILE
CREATE_REGISTRATION
UPDATE_DRAFT
UPLOAD_DOCUMENT
SUBMIT_REGISTRATION
WITHDRAW_REGISTRATION
VIEW_OWN_REGISTRATION
CREATE_REQUEST
VIEW_OWN_REQUEST
Reception Officer
VIEW_SUBMITTED_REGISTRATION
CHECK_REGISTRATION
RECEIVE_REGISTRATION
FORWARD_REGISTRATION
Processing Officer
VIEW_ASSIGNED_REGISTRATION
CHECK_REGISTRATION
CHECK_DOCUMENT
REQUEST_MORE_INFO
PROCESS_REGISTRATION
Approver
VIEW_REGISTRATION_FOR_APPROVAL
APPROVE_REGISTRATION
REJECT_REGISTRATION
VIEW_REQUEST
APPROVE_REQUEST
REJECT_REQUEST
Administrator
VIEW_USER
CREATE_USER
UPDATE_USER
LOCK_USER
UNLOCK_USER
MANAGE_ROLE
MANAGE_PERMISSION
MANAGE_CONFIGURATION
VIEW_AUDIT_LOG
17. Permission không tự động được cấp

Việc tạo Permission không
có nghĩa Permission được
cấp cho tất cả User.

Ví dụ:

APPROVE_REGISTRATION

không tự động cho:

STUDENT
RECEPTION_OFFICER

Permission phải được gán
thông qua Role.

18. Permission không thay thế Data Scope

Permission trả lời:

User được làm gì?

Data Scope trả lời:

User được làm trên dữ liệu nào?

Ví dụ:

APPROVER
    ↓
APPROVE_REGISTRATION
    ↓
Data Scope
    ↓
Khoa được phân công

Có Permission không đồng nghĩa
với quyền thao tác trên
toàn bộ dữ liệu.

19. Authorization Flow

Khi User thực hiện một thao tác:

User
 ↓
Authentication
 ↓
User Identity
 ↓
Role
 ↓
Permission
 ↓
Data Scope
 ↓
Authorization
 ↓
Allow / Deny

Ví dụ:

Approver
   ↓
APPROVE_REGISTRATION
   ↓
Hồ sơ thuộc phạm vi được phép
   ↓
ALLOW

Nếu không có Permission:

Approver
   ↓
Không có APPROVE_REGISTRATION
   ↓
DENY
20. Kiểm tra Permission

Mỗi thao tác quan trọng
phải được System kiểm tra
Permission.

Ví dụ:

POST /registrations/{id}/approve

System kiểm tra:

Có APPROVE_REGISTRATION ?
          ↓
      YES / NO

Nếu NO:

403 Forbidden

Nếu YES:

Kiểm tra Data Scope
          ↓
      ALLOW / DENY
21. Alternative Flow
A1 — Permission Code đã tồn tại

Nếu Permission Code bị trùng:

Create Permission
        ↓
Duplicate Code

System:

Không tạo Permission.
Hiển thị lỗi.
Yêu cầu nhập Code khác.
A2 — Permission đã được gán

Nếu Administrator cố gắng
gán Permission đã tồn tại
trong Role:

System không tạo bản ghi
trùng trong ROLE_PERMISSION.

A3 — Hủy Permission chưa được gán

Nếu Permission không tồn tại
trong Role:

System thông báo Permission
chưa được gán.

Không thay đổi dữ liệu.

A4 — Permission hệ thống

Một số Permission quan trọng
có thể được đánh dấu:

SYSTEM_PERMISSION

Administrator không được
sửa hoặc xóa tùy tiện.

22. Exception Flow
E1 — Không có Permission

Nếu Administrator không có
quyền quản lý Permission:

403 Forbidden

System từ chối thao tác.

E2 — Permission không tồn tại

Nếu Permission không tồn tại:

Permission Not Found

System không thực hiện thao tác.

E3 — Role không tồn tại

Nếu Role không tồn tại
khi thực hiện gán Permission:

System:

Không tạo quan hệ.
Hiển thị lỗi.
E4 — Database Error

Nếu xảy ra lỗi Database:

Rollback transaction.
Không xác nhận thành công.
Ghi Error Log.
Thông báo lỗi.
23. Trạng thái Permission

Permission có thể có:

ACTIVE
INACTIVE
ACTIVE

Permission có thể được
sử dụng trong Authorization.

INACTIVE

Permission không được sử dụng
để cấp quyền thực hiện thao tác.

24. Permission Status Transition
ACTIVE
   ↓
INACTIVE
   ↓
ACTIVE

Chuyển đổi trạng thái phải
được thực hiện bởi Actor
có Permission phù hợp.

25. Không xóa Permission tùy tiện

Nếu Permission đã được sử dụng:

Permission
     ↓
Role
     ↓
User

không nên xóa vật lý.

Ưu tiên:

ACTIVE
INACTIVE

để bảo toàn lịch sử
và khả năng truy vết.

26. Audit Log

Các thao tác phải được
ghi Audit Log:

PERMISSION_CREATED
PERMISSION_UPDATED
PERMISSION_ACTIVATED
PERMISSION_DEACTIVATED
ROLE_PERMISSION_ASSIGNED
ROLE_PERMISSION_REMOVED

Audit Log tối thiểu gồm:

Actor
Action
TargetPermission
TargetRole
Timestamp
Result
Reason

Administrator không được
tự ý sửa Audit Log.

27. Bảo mật

Permission là thành phần
quan trọng của hệ thống
Authorization.

System không được kiểm tra
quyền chỉ ở giao diện.

Ví dụ không được chỉ dựa vào:

Ẩn nút Approve

mà Backend phải kiểm tra:

Authentication
      ↓
Permission
      ↓
Data Scope

Điều này giúp ngăn User
gọi API trực tiếp để vượt
qua giao diện.

28. Business Constraints
BR-PERM-01

Permission Code phải duy nhất.

BR-PERM-02

Permission phải mô tả
một hành động rõ ràng.

BR-PERM-03

Permission không tự động
được cấp cho User.

BR-PERM-04

Permission được cấp thông qua
Role.

BR-PERM-05

Permission không thay thế
Data Scope.

BR-PERM-06

User chỉ được thực hiện
Action khi có Permission
phù hợp.

BR-PERM-07

Permission INACTIVE không
được sử dụng để Authorization.

BR-PERM-08

Permission hệ thống quan trọng
không được xóa tùy tiện.

BR-PERM-09

Thay đổi Permission phải
được ghi Audit Log.

BR-PERM-10

Backend phải thực hiện
kiểm tra Authorization.

29. Postconditions

Sau khi tạo Permission:

Permission
    ↓
Created

Sau khi gán Permission:

Role
    ↓
ROLE_PERMISSION
    ↓
Permission

Sau khi thay đổi Permission:

Authorization
    ↓
Updated

Audit Log được ghi nhận.

30. Acceptance Criteria
AC01

Administrator có thể xem
danh sách Permission.

AC02

Administrator có thể xem
chi tiết Permission.

AC03

Permission Code không được
trùng.

AC04

Administrator có thể tạo
Permission nếu được phép.

AC05

Administrator có thể cập nhật
Permission nếu được phép.

AC06

Administrator có thể kích hoạt
Permission.

AC07

Administrator có thể vô hiệu hóa
Permission.

AC08

Một Role có thể có nhiều
Permission.

AC09

Một Permission có thể thuộc
nhiều Role.

AC10

Không tạo quan hệ
Role-Permission trùng.

AC11

Permission không tự động
được cấp cho User.

AC12

Authorization phải kiểm tra
Permission ở Backend.

AC13

Authorization phải kiểm tra
Data Scope khi cần.

AC14

Permission INACTIVE không
được sử dụng.

AC15

Thay đổi Permission được
ghi Audit Log.

AC16

Permission đã được sử dụng
không bị xóa vật lý tùy tiện.

31. Traceability
Business Rules
      ↓
Authorization Rules
      ↓
Functional Requirements
      ↓
UC-ADM-03
      ↓
Activity Diagram
      ↓
Sequence Diagram
      ↓
Authorization Module
      ↓
Database
      ↓
Implementation
32. Status

Use Case ID:

UC-ADM-03

Version:

1.0

Status:

Draft

Previous:

UC-ADM-02 — Quản lý Role

Next:

UC-ADM-04 — Quản lý Configuration