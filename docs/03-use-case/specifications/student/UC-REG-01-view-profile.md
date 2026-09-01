# UC-REG-01 — XEM THÔNG TIN CÁ NHÂN

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-REG-01 |
| Tên Use Case | Xem thông tin cá nhân |
| Actor chính | Student |
| Actor phụ | SIS |
| Nhóm | Student Registration |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép sinh viên
xem các thông tin cá nhân
được sử dụng trong quá trình
đăng ký và quản lý hồ sơ
ngoại trú.

Thông tin cá nhân chính thức
được cung cấp từ SIS.

Hệ thống quản lý ngoại trú
không phải là nguồn dữ liệu
chính đối với thông tin
đào tạo của sinh viên.

---

# 3. Thông tin sinh viên

Các thông tin có thể được
hiển thị gồm:

```text
MSSV
Họ và tên
Ngày sinh
Lớp
Khoa
Ngành
Trạng thái học tập
Email
Số điện thoại

Phạm vi thông tin thực tế
phải phù hợp với dữ liệu
được SIS cung cấp và
Permission của hệ thống.

4. Nguyên tắc nguồn dữ liệu

Đối với các thông tin thuộc
hệ thống đào tạo:

SIS
 ↓
Student Information
 ↓
Residence Management System
 ↓
Student

SIS là nguồn dữ liệu chính
cho các thông tin như:

MSSV
Họ tên
Lớp
Khoa
Ngành
Trạng thái học tập

Sinh viên không được tự ý
thay đổi các thông tin
được quản lý bởi SIS
trên hệ thống ngoại trú.

5. Preconditions
Sinh viên đã đăng nhập.
Phiên đăng nhập còn
hiệu lực.
Tài khoản sinh viên
tồn tại trong hệ thống.
Sinh viên đã được xác định
bằng MSSV.
6. Trigger

Sinh viên truy cập:

Trang cá nhân

hoặc:

Hồ sơ cá nhân
7. Main Flow
Bước 1

Sinh viên đăng nhập
vào Website.

Bước 2

Sinh viên chọn:

Thông tin cá nhân
Bước 3

System xác định Student ID
của sinh viên đang đăng nhập.

Bước 4

System lấy thông tin sinh viên
từ dữ liệu đã được đồng bộ
từ SIS.

Bước 5

System kiểm tra dữ liệu
có tồn tại hay không.

Bước 6

System hiển thị thông tin
cá nhân.

Bước 7

Sinh viên xem thông tin.

8. Thông tin có thể chỉnh sửa

Không phải tất cả thông tin
đều được chỉnh sửa.

Read-only

Các thông tin do SIS
quản lý:

MSSV
Họ tên
Lớp
Khoa
Ngành
Trạng thái học tập

không được sinh viên
tự ý chỉnh sửa.

Có thể cập nhật

Các thông tin liên hệ
nếu hệ thống cho phép:

Email
Số điện thoại

Việc cập nhật phải tuân thủ
Business Rule và Permission
của hệ thống.

9. Alternative Flow
A1 — Sinh viên chưa có dữ liệu SIS

Nếu System không tìm thấy
thông tin sinh viên:

Student Not Found

System thông báo:

Không tìm thấy thông tin
sinh viên.
Vui lòng liên hệ bộ phận
quản lý.

Không cho phép sinh viên
tạo dữ liệu giả để thay thế.

A2 — Dữ liệu SIS chưa được
đồng bộ

Nếu dữ liệu SIS chưa được
đồng bộ:

SIS Data
   ↓
Not Available

System thông báo:

Thông tin sinh viên
chưa được cập nhật.
Vui lòng thử lại sau.
A3 — Dữ liệu SIS đã cũ

Nếu System phát hiện dữ liệu
có thời điểm đồng bộ cũ:

System có thể hiển thị:

Last Synced At

để xác định thời điểm
dữ liệu được cập nhật.

10. Exception Flow
E1 — Phiên đăng nhập hết hạn

Nếu session hết hạn:

Session Expired

System yêu cầu sinh viên
đăng nhập lại.

E2 — Không có quyền truy cập

Nếu tài khoản không có
Permission phù hợp:

403 Forbidden

System từ chối truy cập.

E3 — SIS không khả dụng

Nếu SIS đang tạm thời
không hoạt động:

System sử dụng dữ liệu
đã được đồng bộ gần nhất
nếu chính sách cho phép.

Nếu không có dữ liệu
có thể sử dụng:

System hiển thị thông báo
lỗi phù hợp.

E4 — Database Error

Nếu xảy ra lỗi Database:

Không hiển thị dữ liệu
không chính xác.
Ghi Error Log.
Thông báo lỗi.
11. Trạng thái học tập

System có thể nhận từ SIS
các trạng thái như:

ACTIVE
SUSPENDED
RESERVED
GRADUATED
WITHDRAWN

Tên trạng thái thực tế phải
phù hợp với dữ liệu SIS.

12. Ảnh hưởng của trạng thái
học tập

Thông tin trạng thái học tập
được sử dụng bởi các nghiệp vụ
khác.

Ví dụ:

Student
   ↓
Academic Status
   ↓
ACTIVE
   ↓
Có thể đăng ký ngoại trú

Hoặc:

Student
   ↓
Academic Status
   ↓
GRADUATED
   ↓
System xử lý hồ sơ
ngoại trú theo Business Rule

Use Case này chỉ hiển thị
trạng thái học tập.

Việc tự động kết thúc,
đánh dấu kiểm tra hoặc
thay đổi trạng thái hồ sơ
ngoại trú được xử lý bởi
các Use Case nghiệp vụ
khác.

13. Bảo mật dữ liệu

Sinh viên chỉ được xem
thông tin của chính mình.

Ví dụ:

Student A
   ↓
Student A Profile

Không được:

Student A
   ↓
Student B Profile

System phải kiểm tra:

Authenticated User
        ↓
Student ID
        ↓
Requested Student ID

Hai giá trị phải phù hợp
trước khi trả dữ liệu.

14. Audit Log

Việc xem thông tin cá nhân
có thể được ghi Log theo
chính sách Audit của hệ thống.

Các thao tác quan trọng
liên quan đến dữ liệu cá nhân
phải có khả năng truy vết.

Ví dụ:

Actor:
Student

Action:
VIEW_PROFILE

Target:
Student Profile

Timestamp:
...

Result:
SUCCESS
15. Business Constraints
BR-PROFILE-01

Sinh viên chỉ được xem
thông tin cá nhân của
chính mình.

BR-PROFILE-02

MSSV là thông tin nhận diện
chính của sinh viên trong
hệ thống.

BR-PROFILE-03

Thông tin đào tạo chính thức
phải lấy từ SIS.

BR-PROFILE-04

Sinh viên không được
tự ý sửa thông tin do
SIS quản lý.

BR-PROFILE-05

System phải kiểm tra
quyền truy cập trước khi
trả dữ liệu.

BR-PROFILE-06

Nếu SIS chưa có dữ liệu,
System không được tự tạo
thông tin đào tạo giả.

BR-PROFILE-07

Dữ liệu cá nhân phải được
bảo vệ khỏi truy cập trái phép.

BR-PROFILE-08

Trạng thái học tập từ SIS
có thể ảnh hưởng đến
các nghiệp vụ ngoại trú
khác.

16. Postconditions

Sau khi thực hiện thành công:

Student
   ↓
Profile
   ↓
Displayed

Sinh viên có thể xem
thông tin cá nhân.

Không có thông tin của
sinh viên khác được
trả về.

17. Acceptance Criteria
AC01

Sinh viên đăng nhập thành
công có thể xem thông tin
cá nhân.

AC02

Hệ thống hiển thị MSSV.

AC03

Hệ thống hiển thị họ tên.

AC04

Hệ thống hiển thị lớp,
khoa và ngành nếu SIS
cung cấp.

AC05

Hệ thống hiển thị trạng thái
học tập nếu SIS cung cấp.

AC06

Thông tin do SIS quản lý
không được sinh viên
tùy ý chỉnh sửa.

AC07

Sinh viên không thể xem
profile của sinh viên khác.

AC08

Hệ thống xử lý trường hợp
SIS chưa có dữ liệu.

AC09

Hệ thống xử lý trường hợp
SIS tạm thời không khả dụng.

AC10

Dữ liệu truy cập phải
được bảo vệ theo Permission.

18. Traceability
Business Overview
      ↓
Business Rules
      ↓
Functional Requirements
      ↓
UC-REG-01
      ↓
Activity Diagram
      ↓
Sequence Diagram
      ↓
Profile Module
      ↓
API
      ↓
Database / SIS
      ↓
Implementation
19. Status

Use Case ID:

UC-REG-01

Version:

1.0

Status:

Draft

Previous:

UC-ADM-06 — Xem Audit Log

Next:

UC-REG-02 — Tạo hồ sơ ngoại trú