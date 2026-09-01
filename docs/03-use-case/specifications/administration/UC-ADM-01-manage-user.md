# UC-ADM-01 — QUẢN LÝ NGƯỜI DÙNG

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-ADM-01 |
| Tên Use Case | Quản lý người dùng |
| Actor chính | Administrator |
| Nhóm | Administration |
| Priority | High |
| Đối tượng | User Account |

---

# 2. Mục đích

Use Case mô tả việc Administrator
quản lý các tài khoản được phép
sử dụng hệ thống quản lý sinh viên
ngoại trú.

Administrator có thể:

- Xem danh sách người dùng.
- Xem thông tin người dùng.
- Tạo tài khoản.
- Cập nhật thông tin tài khoản.
- Khóa tài khoản.
- Mở khóa tài khoản.
- Kích hoạt tài khoản.
- Vô hiệu hóa tài khoản.
- Gán Role cho người dùng.

---

# 3. Phạm vi

Use Case chỉ quản lý:

```text
User Account
Role Assignment
Account Status

Không quản lý trực tiếp:

Registration
Request
Document
Student Personal Data
Audit Log

Các đối tượng trên có Use Case
quản lý riêng.

4. Actor
Administrator

Administrator chịu trách nhiệm
quản trị tài khoản người dùng.

Administrator phải có Permission
phù hợp để thực hiện từng
thao tác.

Ví dụ:

MANAGE_USER
CREATE_USER
UPDATE_USER
ACTIVATE_USER
DEACTIVATE_USER
ASSIGN_ROLE
5. Preconditions
Administrator đã đăng nhập.
Phiên đăng nhập còn hiệu lực.
Administrator có Permission
tương ứng.
Hệ thống hoạt động bình thường.
6. Trigger

Administrator chọn:

Quản trị
    ↓
Người dùng

Sau đó thực hiện một
thao tác quản lý User.

7. Main Flow — Xem danh sách User
Bước 1

Administrator mở chức năng
Quản lý người dùng.

Bước 2

System kiểm tra Permission.

Bước 3

System lấy danh sách User
thuộc phạm vi Administrator
được phép xem.

Bước 4

System hiển thị:

User ID
Username
Họ tên
Email
Role
Status
Created At
Last Login
8. Main Flow — Tạo User
Bước 1

Administrator chọn:

Tạo người dùng
Bước 2

System hiển thị Form.

Bước 3

Administrator nhập:

Username
Email
Họ tên
Role
Bước 4

System kiểm tra dữ liệu.

Bước 5

System kiểm tra Username
không bị trùng.

Bước 6

System kiểm tra Email
theo quy tắc hệ thống.

Bước 7

System tạo User.

Bước 8

System ghi Audit Log.

USER_CREATED
Bước 9

System thông báo tạo User
thành công.

9. Main Flow — Cập nhật User
Bước 1

Administrator chọn User.

Bước 2

System hiển thị thông tin User.

Bước 3

Administrator thay đổi
thông tin được phép chỉnh sửa.

Bước 4

System validate dữ liệu.

Bước 5

System lưu thay đổi.

Bước 6

System ghi Audit Log.

USER_UPDATED
10. Main Flow — Khóa User

Administrator chọn:

Khóa tài khoản

System yêu cầu xác nhận.

Nếu Administrator xác nhận:

ACTIVE
   ↓
LOCKED

System:

Cập nhật trạng thái.
Hủy hoặc vô hiệu hóa
các phiên đăng nhập hiện tại
theo chính sách bảo mật.
Ghi Audit Log.
USER_LOCKED
11. Main Flow — Mở khóa User

Administrator chọn User đang:

LOCKED

Sau khi xác nhận:

LOCKED
   ↓
ACTIVE

System ghi:

USER_UNLOCKED

vào Audit Log.

12. Main Flow — Vô hiệu hóa User

Administrator chọn:

Deactivate

System yêu cầu xác nhận.

Sau khi xác nhận:

ACTIVE
   ↓
INACTIVE

User không thể đăng nhập
khi đang ở trạng thái INACTIVE.

System ghi:

USER_DEACTIVATED
13. Main Flow — Kích hoạt User

Administrator chọn User:

INACTIVE

System thực hiện:

INACTIVE
   ↓
ACTIVE

System ghi:

USER_ACTIVATED
14. Main Flow — Gán Role

Administrator chọn:

Gán Role

System hiển thị các Role
được phép gán.

Ví dụ:

STUDENT
RECEPTION_OFFICER
PROCESSING_OFFICER
APPROVER
ADMINISTRATOR

Administrator chọn Role.

System kiểm tra:

Role tồn tại.
Administrator có quyền
gán Role đó.
User có được phép nhận Role đó.

Sau đó System lưu
Role Assignment.

System ghi:

ROLE_ASSIGNED
15. Quy tắc quan trọng về Role

User không được tự thay đổi
Role của chính mình.

Administrator cũng không
mặc nhiên được gán mọi Role.

Việc gán Role phải phụ thuộc
vào Permission.

Ví dụ:

Administrator
      ↓
ASSIGN_ROLE
      ↓
Role được phép
16. Data Scope

Role không đồng nghĩa với
quyền xem toàn bộ dữ liệu.

Quyền truy cập được xác định:

User
 ↓
Role
 ↓
Permission
 ↓
Data Scope

Ví dụ:

Processing Officer
       ↓
VIEW_REGISTRATION
       ↓
Hồ sơ thuộc phạm vi được phân công

Administrator phải cấu hình
Data Scope phù hợp với
quy định của hệ thống.

17. Alternative Flow
A1 — Username đã tồn tại

Nếu Username đã tồn tại:

Create User
    ↓
Username Duplicate

System:

Không tạo User.
Hiển thị lỗi.
Yêu cầu nhập Username khác.
A2 — Email đã tồn tại

Nếu Email đã được sử dụng
theo chính sách hệ thống:

Email Duplicate

System không tạo tài khoản
trùng.

A3 — User đã bị khóa

Nếu Administrator chọn
khóa một User đang LOCKED:

System không tạo thay đổi
không cần thiết.

A4 — User đã INACTIVE

Nếu Administrator chọn
Deactivate một User đã
INACTIVE:

System thông báo User
đã ở trạng thái INACTIVE.

18. Exception Flow
E1 — Không có Permission

Nếu Administrator không có
Permission cần thiết:

403 Forbidden

System từ chối thao tác.

Không thay đổi dữ liệu.

Audit Log có thể ghi nhận
hành động bị từ chối.

E2 — User không tồn tại

Nếu User được yêu cầu
không tồn tại:

System:

Không thực hiện thao tác.
Hiển thị lỗi.
E3 — Dữ liệu không hợp lệ

Nếu dữ liệu không hợp lệ:

System:

Không lưu dữ liệu.
Hiển thị lỗi tương ứng.
Cho phép Administrator
chỉnh sửa lại.
E4 — Lỗi Database

Nếu xảy ra lỗi khi lưu:

System:

Không xác nhận thao tác
thành công.
Rollback transaction.
Ghi Error Log.
Thông báo lỗi.
19. Trạng thái User

User có thể có các trạng thái:

ACTIVE
LOCKED
INACTIVE

Ý nghĩa:

ACTIVE

User có thể đăng nhập
nếu thông tin xác thực
hợp lệ.

LOCKED

Tài khoản bị khóa và
không được đăng nhập.

INACTIVE

Tài khoản bị vô hiệu hóa.

20. User Status Transition
                 ┌──────────────┐
                 │              ↓
              ACTIVE ←────── LOCKED
                 │
                 ↓
             INACTIVE
                 │
                 └────────→ ACTIVE

Các chuyển đổi phải được
thực hiện thông qua thao tác
được phân quyền.

21. Không xóa User tùy tiện

Hệ thống không nên xóa
User vật lý nếu User đã
tham gia vào các nghiệp vụ
cần truy vết.

Ví dụ:

User
 ↓
Registration
 ↓
Audit Log

Nếu xóa User sẽ làm mất
khả năng xác định người
đã thực hiện thao tác.

Do đó nên ưu tiên:

ACTIVE
LOCKED
INACTIVE

thay vì Physical Delete.

22. Audit Log

Các thao tác cần ghi Audit:

USER_CREATED
USER_UPDATED
USER_LOCKED
USER_UNLOCKED
USER_ACTIVATED
USER_DEACTIVATED
ROLE_ASSIGNED
ROLE_REMOVED

Audit Log phải lưu tối thiểu:

Actor
Action
TargetUser
Timestamp
Result
Reason

Administrator không được
tự ý sửa Audit Log.

23. Bảo mật

Mật khẩu không được lưu
dưới dạng plaintext.

System phải sử dụng cơ chế
hash mật khẩu phù hợp.

Không hiển thị mật khẩu
trong:

UI
Log
Audit Log
API Response
24. Phân quyền

Các Permission ví dụ:

VIEW_USER
CREATE_USER
UPDATE_USER
LOCK_USER
UNLOCK_USER
ACTIVATE_USER
DEACTIVATE_USER
ASSIGN_ROLE
REMOVE_ROLE

Administrator chỉ thực hiện
được thao tác nếu có
Permission tương ứng.

25. Quan hệ với các Use Case khác
Authentication
UC-AUTH-01
Đăng nhập
      ↓
User Account
Role
UC-ADM-02
Quản lý Role
      ↓
Role Assignment
Permission
UC-ADM-03
Quản lý Permission
      ↓
Authorization
Audit Log
UC-ADM-06
Xem Audit Log
      ↓
USER_CREATED
USER_UPDATED
...
26. Postconditions

Sau khi thao tác thành công:

User Data
    ↓
Updated

Nếu có thay đổi Role:

Role Assignment
    ↓
Updated

Audit Log được tạo.

Permission được áp dụng
theo Role mới.

27. Acceptance Criteria
AC01

Administrator có thể xem
danh sách User trong
phạm vi được phép.

AC02

Administrator có thể tạo
User hợp lệ.

AC03

System không cho phép
Username bị trùng.

AC04

System không cho phép
tạo Email trùng nếu
chính sách yêu cầu duy nhất.

AC05

Administrator có thể
cập nhật User theo
Permission.

AC06

Administrator có thể
khóa User.

AC07

Administrator có thể
mở khóa User.

AC08

Administrator có thể
kích hoạt User.

AC09

Administrator có thể
vô hiệu hóa User.

AC10

Administrator có thể
gán Role nếu có
Permission.

AC11

User không được tự
thay đổi Role của mình.

AC12

Mọi thao tác quan trọng
đều được ghi Audit Log.

AC13

User đã có dữ liệu
nghiệp vụ không bị
xóa vật lý tùy tiện.

AC14

Mật khẩu không được
lưu dưới dạng plaintext.

AC15

User bị LOCKED hoặc
INACTIVE không được
đăng nhập.

28. Traceability
Business Rules
      ↓
Authorization Rules
      ↓
Functional Requirements
      ↓
UC-ADM-01
      ↓
Activity Diagram
      ↓
Sequence Diagram
      ↓
User Management Module
      ↓
Database
      ↓
Implementation
29. Status

Use Case ID:

UC-ADM-01

Version:

1.0

Status:

Draft

Previous:

UC-SYS-06 — Đồng bộ SIS

Next:

UC-ADM-02 — Quản lý Role