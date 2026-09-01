# UC-ADM-02 — QUẢN LÝ ROLE

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-ADM-02 |
| Tên Use Case | Quản lý Role |
| Actor chính | Administrator |
| Nhóm | Administration |
| Priority | High |
| Đối tượng | Role |

---

# 2. Mục đích

Use Case mô tả việc Administrator
quản lý các Role được sử dụng
trong hệ thống quản lý sinh viên
ngoại trú.

Role xác định nhóm trách nhiệm
của một User trong hệ thống.

Role không trực tiếp quyết định
User được phép truy cập dữ liệu nào.

Quyền truy cập được xác định theo:

User
↓
Role
↓
Permission
↓
Data Scope

---

# 3. Các Role chính

Hệ thống dự kiến có các Role:

```text
STUDENT
RECEPTION_OFFICER
PROCESSING_OFFICER
APPROVER
ADMINISTRATOR

Ý nghĩa:

STUDENT

Sinh viên sử dụng hệ thống để
quản lý hồ sơ ngoại trú của mình.

RECEPTION_OFFICER

Cán bộ tiếp nhận và kiểm tra
sơ bộ hồ sơ.

PROCESSING_OFFICER

Cán bộ thực hiện kiểm tra
nghiệp vụ chi tiết.

APPROVER

Cán bộ có quyền phê duyệt
hoặc từ chối theo Permission.

ADMINISTRATOR

Quản trị tài khoản, Role,
Permission, Configuration
và danh mục.

4. Phạm vi

Administrator có thể:

Xem Role.
Xem thông tin Role.
Tạo Role nếu hệ thống cho phép.
Cập nhật Role.
Kích hoạt Role.
Vô hiệu hóa Role.
Xem Permission của Role.
Quản lý quan hệ Role - Permission
theo quyền được cấp.

Use Case không trực tiếp xử lý:

User Account
Registration
Request
Document
Audit Log

Các nghiệp vụ này thuộc
Use Case khác.

5. Preconditions
Administrator đã đăng nhập.
Phiên đăng nhập còn hiệu lực.
Administrator có Permission
quản lý Role.
Hệ thống đang hoạt động.
6. Trigger

Administrator truy cập:

Quản trị
   ↓
Role Management
7. Main Flow — Xem danh sách Role
Bước 1

Administrator mở chức năng
Quản lý Role.

Bước 2

System kiểm tra Permission.

Bước 3

System lấy danh sách Role
trong hệ thống.

Bước 4

System hiển thị:

Role ID
Role Code
Role Name
Description
Status
Created At
Updated At
8. Main Flow — Xem chi tiết Role
Bước 1

Administrator chọn một Role.

Bước 2

System hiển thị thông tin Role.

Bước 3

System hiển thị danh sách
Permission đang được gán.

Ví dụ:

APPROVER
   |
   ├── VIEW_REGISTRATION
   ├── APPROVE_REGISTRATION
   ├── REJECT_REGISTRATION
   └── VIEW_REQUEST
9. Main Flow — Tạo Role

Nếu hệ thống cho phép tạo
Role tùy chỉnh:

Bước 1

Administrator chọn:

Tạo Role
Bước 2

Administrator nhập:

Role Code
Role Name
Description
Bước 3

System kiểm tra dữ liệu.

Bước 4

System kiểm tra Role Code
không bị trùng.

Bước 5

System tạo Role.

Bước 6

Role được tạo ở trạng thái
phù hợp theo Configuration.

Bước 7

System ghi Audit Log:

ROLE_CREATED
10. Main Flow — Cập nhật Role
Bước 1

Administrator chọn Role.

Bước 2

Administrator chọn:

Cập nhật
Bước 3

Administrator thay đổi thông tin
được phép chỉnh sửa.

Bước 4

System kiểm tra dữ liệu.

Bước 5

System lưu thay đổi.

Bước 6

System ghi Audit Log:

ROLE_UPDATED
11. Main Flow — Kích hoạt Role

Administrator chọn Role
đang INACTIVE.

System yêu cầu xác nhận.

Sau khi xác nhận:

INACTIVE
    ↓
ACTIVE

System ghi:

ROLE_ACTIVATED
12. Main Flow — Vô hiệu hóa Role

Administrator chọn Role
đang ACTIVE.

System kiểm tra xem Role
có đang được sử dụng hay không.

Nếu nghiệp vụ cho phép
vô hiệu hóa:

ACTIVE
    ↓
INACTIVE

System ghi:

ROLE_DEACTIVATED
13. Role không tự động cấp quyền

Việc tạo Role không có nghĩa
Role tự động có tất cả Permission.

Ví dụ:

ROLE
  ↓
Không mặc định có toàn bộ Permission

Permission phải được
gán rõ ràng.

14. Quan hệ Role — Permission

Một Role có thể có nhiều
Permission.

Một Permission có thể thuộc
nhiều Role.

Do đó quan hệ là:

ROLE
  ↕
ROLE_PERMISSION
  ↕
PERMISSION

Đây là quan hệ Many-to-Many.

15. Ví dụ Role — Permission

Ví dụ:

STUDENT

có thể có:

VIEW_OWN_PROFILE
CREATE_REGISTRATION
UPDATE_DRAFT
SUBMIT_REGISTRATION
WITHDRAW_REGISTRATION
VIEW_OWN_REGISTRATION
CREATE_REQUEST

Ví dụ:

RECEPTION_OFFICER

có thể có:

VIEW_SUBMITTED_REGISTRATION
CHECK_REGISTRATION
RECEIVE_REGISTRATION
FORWARD_REGISTRATION

Ví dụ:

PROCESSING_OFFICER

có thể có:

VIEW_ASSIGNED_REGISTRATION
CHECK_DOCUMENT
REQUEST_MORE_INFO
PROCESS_REGISTRATION

Ví dụ:

APPROVER

có thể có:

VIEW_REGISTRATION_FOR_APPROVAL
APPROVE_REGISTRATION
REJECT_REGISTRATION
APPROVE_REQUEST
REJECT_REQUEST
16. Role không thay thế Data Scope

Role chỉ xác định:

User được làm gì

Data Scope xác định:

User được làm trên dữ liệu nào

Ví dụ:

APPROVER
   ↓
APPROVE_REGISTRATION
   ↓
Hồ sơ thuộc phạm vi được phân quyền

Không được hiểu:

APPROVER
   ↓
Có thể duyệt mọi hồ sơ
17. Data Scope

Data Scope có thể được
xác định theo:

Toàn hệ thống.
Khoa.
Đơn vị.
Phạm vi được phân công.
Hồ sơ cụ thể.

Ví dụ:

Approver A
   ↓
APPROVE_REGISTRATION
   ↓
Khoa Công nghệ thông tin

Approver A không mặc nhiên
được duyệt hồ sơ của
các khoa khác.

Phạm vi cụ thể phải được
Administrator cấu hình theo
quy định của hệ thống.

18. Role Assignment

Role được gán cho User
thông qua User Management.

Quan hệ:

USER
  ↓
USER_ROLE
  ↓
ROLE

Một User có thể có một hoặc
nhiều Role nếu chính sách
phân quyền cho phép.

Ví dụ:

User
 ├── PROCESSING_OFFICER
 └── APPROVER

Tuy nhiên việc kết hợp Role
phải tuân thủ chính sách
phân quyền của hệ thống.

19. Không tự động cấp Role

User không được tự đăng ký
Role có quyền cao.

Ví dụ Student không thể
tự thay đổi:

STUDENT
   ↓
ADMINISTRATOR

hoặc:

STUDENT
   ↓
APPROVER

Việc thay đổi Role phải
được thực hiện bởi Actor
có Permission phù hợp.

20. Alternative Flow
A1 — Role Code đã tồn tại

Nếu Role Code đã tồn tại:

Create Role
    ↓
Duplicate Role Code

System:

Không tạo Role.
Hiển thị thông báo lỗi.
Yêu cầu nhập Role Code khác.
A2 — Role không được phép sửa

Nếu Role là Role hệ thống
được bảo vệ:

SYSTEM ROLE

System chỉ cho phép chỉnh sửa
các trường được phép.

A3 — Role đang được sử dụng

Nếu Role đang được gán
cho User:

Role
 ↓
Users

System phải kiểm tra chính sách
trước khi vô hiệu hóa Role.

21. Exception Flow
E1 — Không có Permission

Nếu Administrator không có
Permission:

403 Forbidden

System từ chối thao tác.

Không thay đổi dữ liệu.

E2 — Role không tồn tại

System không tìm thấy Role:

Role Not Found

System không thực hiện
thao tác.

E3 — Dữ liệu không hợp lệ

System phát hiện dữ liệu
không hợp lệ:

Không lưu dữ liệu.
Hiển thị lỗi.
Cho phép nhập lại.
E4 — Database Error

Nếu xảy ra lỗi Database:

Rollback transaction.
Không xác nhận thành công.
Ghi Error Log.
Thông báo lỗi.
22. Bảo vệ Role quan trọng

Các Role quan trọng như:

ADMINISTRATOR
APPROVER

có thể được bảo vệ
không cho chỉnh sửa hoặc
xóa tùy tiện.

Mọi thay đổi quan trọng
phải được ghi Audit Log.

23. Không xóa vật lý Role

Nếu Role đã được sử dụng:

User
 ↓
Role
 ↓
Permission

không nên xóa vật lý.

Ưu tiên:

ACTIVE
INACTIVE

để giữ khả năng truy vết
lịch sử phân quyền.

24. Audit Log

Các thao tác cần ghi:

ROLE_CREATED
ROLE_UPDATED
ROLE_ACTIVATED
ROLE_DEACTIVATED
ROLE_PERMISSION_ASSIGNED
ROLE_PERMISSION_REMOVED

Audit Log cần lưu:

Actor
Action
TargetRole
Timestamp
Result
Reason

Administrator không được
tự ý sửa Audit Log.

25. Phân quyền cho chính chức năng Role

Các Permission ví dụ:

VIEW_ROLE
CREATE_ROLE
UPDATE_ROLE
ACTIVATE_ROLE
DEACTIVATE_ROLE
ASSIGN_ROLE_PERMISSION
REMOVE_ROLE_PERMISSION

Administrator chỉ thực hiện
được thao tác nếu có
Permission tương ứng.

26. Business Constraints
BR-ROLE-01

Role Code phải duy nhất.

BR-ROLE-02

Role phải có tên và mô tả
phù hợp.

BR-ROLE-03

User không được tự thay đổi
Role của chính mình.

BR-ROLE-04

Role không tự động có
toàn bộ Permission.

BR-ROLE-05

Role phải được gán
Permission rõ ràng.

BR-ROLE-06

Role không thay thế
Data Scope.

BR-ROLE-07

Role đang được sử dụng
không được xóa vật lý
tùy tiện.

BR-ROLE-08

Các thay đổi Role phải
được ghi Audit Log.

BR-ROLE-09

Role quyền cao phải được
bảo vệ theo chính sách
phân quyền.

27. Postconditions

Sau khi thao tác thành công:

Role
 ↓
Updated

Nếu Permission thay đổi:

Role
 ↓
Permission Assignment
 ↓
Updated

Nếu Role được gán cho User:

User
 ↓
Role
 ↓
Permission

Hệ thống áp dụng quyền
theo cấu hình mới.

Audit Log được ghi nhận.

28. Acceptance Criteria
AC01

Administrator có thể xem
danh sách Role.

AC02

Administrator có thể xem
chi tiết Role.

AC03

Role Code không được
trùng.

AC04

Administrator có thể
tạo Role nếu được phép.

AC05

Administrator có thể
cập nhật Role nếu được phép.

AC06

Administrator có thể
kích hoạt Role.

AC07

Administrator có thể
vô hiệu hóa Role theo
chính sách.

AC08

Role có thể được liên kết
với nhiều Permission.

AC09

Permission có thể được
sử dụng bởi nhiều Role.

AC10

Role không tự động có
toàn bộ Permission.

AC11

Role không đồng nghĩa
với toàn bộ Data Scope.

AC12

User không thể tự nâng
Role của mình.

AC13

Role đang được sử dụng
không bị xóa vật lý
tùy tiện.

AC14

Các thay đổi quan trọng
được ghi Audit Log.

29. Traceability
Business Rules
      ↓
Authorization Rules
      ↓
Functional Requirements
      ↓
UC-ADM-02
      ↓
Activity Diagram
      ↓
Sequence Diagram
      ↓
Role Management Module
      ↓
Database
      ↓
Implementation
30. Status

Use Case ID:

UC-ADM-02

Version:

1.0

Status:

Draft

Previous:

UC-ADM-01 — Quản lý User

Next:

UC-ADM-03 — Quản lý Permission