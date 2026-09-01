# UC-OFF-01 — XEM HỒ SƠ CHỜ TIẾP NHẬN

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-OFF-01 |
| Tên Use Case | Xem hồ sơ chờ tiếp nhận |
| Actor chính | Reception Officer |
| Actor phụ | System |
| Nhóm | Officer |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép Cán bộ tiếp nhận
xem danh sách các hồ sơ ngoại trú
đang chờ được tiếp nhận.

Reception Officer sử dụng chức năng
này để xác định các hồ sơ mới được
Student gửi lên và thực hiện bước
tiếp nhận ban đầu.

Use Case này chỉ phục vụ việc
xem và lựa chọn hồ sơ.

Việc tiếp nhận hồ sơ được xử lý
bởi:

UC-OFF-02 — Tiếp nhận hồ sơ.

---

# 3. Preconditions

1. Reception Officer đã đăng nhập.

2. Session còn hiệu lực.

3. Tài khoản có Role phù hợp.

4. Tài khoản có Permission cần thiết
   để xem hồ sơ chờ tiếp nhận.

5. Reception Officer thuộc phạm vi
   Data Scope được phép truy cập.

---

# 4. Trigger

Reception Officer truy cập:

```text
Dashboard
    ↓
Hồ sơ chờ tiếp nhận
5. Main Flow
Bước 1

Reception Officer đăng nhập
vào hệ thống.

Bước 2

Reception Officer mở Dashboard.

Bước 3

Reception Officer chọn:

Hồ sơ chờ tiếp nhận
Bước 4

System kiểm tra:

Authentication.
Role.
Permission.
Data Scope.
Bước 5

System tìm các Registration
đang ở trạng thái được quy định
là chờ tiếp nhận.

Ví dụ:

SUBMITTED

Việc xác định State phải tuân thủ
State Machine chính thức của
hệ thống.

Bước 6

System trả về danh sách hồ sơ.

Danh sách có thể hiển thị:

Mã hồ sơ.
MSSV.
Họ tên sinh viên.
Thời gian gửi.
Trạng thái.
Thời gian chờ.
Người phụ trách nếu đã được
phân công.
Bước 7

Reception Officer xem danh sách.

Bước 8

Reception Officer có thể chọn
một hồ sơ để xem thông tin
chi tiết.

Bước 9

System hiển thị thông tin chi tiết
trong phạm vi Permission và
Data Scope.

6. Data Scope

Reception Officer chỉ được xem
những hồ sơ thuộc phạm vi được
phân quyền.

Mô hình:

Reception Officer
        ↓
Role
        ↓
Permission
        ↓
Data Scope
        ↓
Allowed Registrations

Không mặc định rằng mọi
Reception Officer đều có thể
xem toàn bộ hồ sơ.

7. Danh sách hồ sơ

System có thể cung cấp:

Registration ID
Student ID
Student Name
Submitted At
Current State
Priority
Assigned Officer

Các trường hiển thị cụ thể phải
phù hợp với Functional Requirements
và Data Model.

8. Sắp xếp hồ sơ

Danh sách có thể được sắp xếp
theo các tiêu chí nghiệp vụ
được hệ thống hỗ trợ.

Ví dụ:

Submitted At
Priority
SLA

Nếu có quy tắc ưu tiên hồ sơ,
System phải tuân thủ Business Rules.

Không tự ý thay đổi thứ tự ưu tiên
nghiệp vụ.

9. Tìm kiếm hồ sơ

Reception Officer có thể tìm kiếm
hồ sơ nếu chức năng Search được
định nghĩa trong Functional
Requirements.

Ví dụ:

Registration ID
MSSV
Student Name

System chỉ trả về các hồ sơ
thuộc Data Scope của Officer.

10. Lọc hồ sơ

Nếu hệ thống hỗ trợ Filter,
Reception Officer có thể lọc
theo các tiêu chí được cho phép.

Ví dụ:

State
Date
Priority

Filter không được vượt qua
Data Scope.

11. Pagination

Nếu số lượng hồ sơ lớn,
System có thể sử dụng Pagination.

Ví dụ:

Page 1
Page 2
Page 3
...

System không cần tải toàn bộ
hồ sơ lên giao diện cùng lúc.

12. Refresh

Reception Officer có thể
Refresh danh sách.

Khi Refresh:

UI
 ↓
Request
 ↓
System
 ↓
Database
 ↓
Latest Registrations

System phải trả về trạng thái
mới nhất trong phạm vi cho phép.

13. Hồ sơ mới được gửi

Nếu Student vừa gửi một hồ sơ:

Student
   ↓
Submit Registration
   ↓
SUBMITTED
   ↓
Pending Reception

Reception Officer có thể thấy
hồ sơ sau khi System cập nhật
danh sách.

14. Hồ sơ đã được người khác
tiếp nhận

Nếu một Reception Officer
khác đã tiếp nhận hồ sơ:

Officer A
    ↓
Receive Registration

Officer B
    ↓
Refresh

System không được hiển thị hồ sơ
như vẫn đang chờ tiếp nhận nếu
State đã thay đổi.

Dữ liệu phải phản ánh State
hiện tại.

15. Alternative Flow
A1 — Không có hồ sơ

Nếu không có hồ sơ chờ
tiếp nhận:

System hiển thị:

Không có hồ sơ đang chờ
tiếp nhận.

Đây không phải lỗi hệ thống.

A2 — Có nhiều hồ sơ

Nếu có nhiều hồ sơ:

System hiển thị danh sách
theo Pagination và các
quy tắc sắp xếp được định nghĩa.

A3 — Officer tìm kiếm

Reception Officer nhập
từ khóa tìm kiếm.

System thực hiện:

Search
   ↓
Validate Scope
   ↓
Query
   ↓
Result
A4 — Officer lọc

Reception Officer chọn
Filter.

System chỉ trả về những
hồ sơ phù hợp và thuộc
Data Scope.

A5 — Officer xem chi tiết

Reception Officer chọn
một Registration.

System mở:

Registration Detail

Reception Officer có thể
xem thông tin được phép.

Việc thay đổi trạng thái
không thuộc Use Case này.

16. Exception Flow
E1 — Chưa đăng nhập

Nếu Session không tồn tại:

System chuyển Officer
đến màn hình Login.

E2 — Session hết hạn

System yêu cầu đăng nhập lại.

E3 — Không có Permission

Nếu tài khoản không có
Permission cần thiết:

System từ chối truy cập.

Ví dụ:

403 Forbidden
E4 — Ngoài Data Scope

Nếu Officer cố truy cập
hồ sơ ngoài phạm vi:

System từ chối truy cập.

Không trả về dữ liệu
của hồ sơ đó.

E5 — Database Error

Nếu không thể truy vấn
Database:

System hiển thị:

Không thể tải danh sách
hồ sơ. Vui lòng thử lại.

System ghi nhận lỗi
theo cơ chế Logging.

E6 — Concurrent State Change

Nếu hồ sơ thay đổi State
trong lúc Officer đang xem:

System phải sử dụng
trạng thái mới nhất khi
thực hiện thao tác tiếp theo.

Use Case này không được
dựa vào State cũ để thực
hiện nghiệp vụ tiếp nhận.

17. Security

Reception Officer chỉ được:

View
   ↓
Allowed Registrations

Không được:

View
   ↓
Other Data Scope

Reception Officer cũng
không được mặc định:

Phê duyệt hồ sơ.
Từ chối cuối.
Sửa Audit Log.
Quản lý User.
Thay đổi Permission.

Các quyền này thuộc
Use Case khác và phải được
kiểm soát bằng Permission.

18. Audit

Việc xem danh sách có thể
được ghi Log nếu hệ thống
yêu cầu Audit đối với
truy cập dữ liệu.

Nếu có Audit:

Actor ID
Action
Timestamp
Data Scope
Result

Không ghi Audit Log bằng
cách làm thay đổi dữ liệu
nghiệp vụ.

19. Performance

Danh sách hồ sơ phải được
tải trong giới hạn hiệu năng
được quy định bởi
Non-Functional Requirements.

Khi số lượng hồ sơ lớn,
System nên sử dụng:

Pagination
Filtering
Indexing

để tránh tải toàn bộ dữ liệu.

20. Business Constraints
BR-OFF-01

Chỉ Reception Officer có
Permission phù hợp mới được
xem hồ sơ chờ tiếp nhận.

BR-OFF-02

Officer chỉ được xem hồ sơ
trong Data Scope của mình.

BR-OFF-03

Danh sách phải phản ánh
State hiện tại của hồ sơ.

BR-OFF-04

Hồ sơ đã được tiếp nhận
không được tiếp tục hiển thị
như hồ sơ đang chờ tiếp nhận.

BR-OFF-05

Việc xem hồ sơ không được
tự động thay đổi Registration
State.

BR-OFF-06

Reception Officer không
mặc nhiên có quyền phê duyệt.

BR-OFF-07

Reception Officer không
mặc nhiên có quyền từ chối
cuối cùng.

BR-OFF-08

Search và Filter không
được vượt Data Scope.

BR-OFF-09

Thông tin hiển thị phải
phù hợp với Permission.

BR-OFF-10

System phải xử lý an toàn
khi State thay đổi đồng thời.

21. Postconditions

Sau khi Use Case hoàn tất:

Reception Officer
        ↓
Xem được danh sách
hồ sơ được phép truy cập

Không có Registration State
nào được thay đổi chỉ bởi
Use Case này.

Không có hồ sơ nào được
tiếp nhận tự động.

22. Acceptance Criteria
AC01

Reception Officer có thể
mở danh sách hồ sơ chờ
tiếp nhận.

AC02

System kiểm tra
Authentication.

AC03

System kiểm tra Role.

AC04

System kiểm tra Permission.

AC05

System kiểm tra Data Scope.

AC06

System chỉ hiển thị hồ sơ
được phép truy cập.

AC07

System hiển thị State
hiện tại của Registration.

AC08

Officer có thể xem chi tiết
hồ sơ được phép.

AC09

Officer có thể Search nếu
chức năng được yêu cầu.

AC10

Officer có thể Filter nếu
chức năng được yêu cầu.

AC11

Officer có thể Refresh
danh sách.

AC12

Hồ sơ đã được tiếp nhận
không tiếp tục được xem là
hồ sơ chờ tiếp nhận.

AC13

Việc xem hồ sơ không
tự động thay đổi State.

AC14

Officer không thể xem
hồ sơ ngoài Data Scope.

AC15

Officer không thể tự động
phê duyệt hồ sơ.

23. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-OFF-01
↓
Activity Diagram
↓
Sequence Diagram
↓
API
↓
Officer Module
↓
Frontend
↓
Database
↓
Implementation

24. Related Use Cases

Student

↓

UC-REG-05
Gửi hồ sơ

↓

SUBMITTED

↓

UC-OFF-01
Xem hồ sơ chờ tiếp nhận

↓

UC-OFF-02
Tiếp nhận hồ sơ

↓

UC-OFF-03
Kiểm tra hồ sơ

25. Relationship
UC-REG-05
Gửi hồ sơ
      │
      ▼
SUBMITTED
      │
      ▼
UC-OFF-01
Xem hồ sơ chờ tiếp nhận
      │
      ▼
UC-OFF-02
Tiếp nhận hồ sơ

UC-OFF-01 chỉ chịu trách nhiệm
cho việc xem danh sách và
truy cập hồ sơ trong phạm vi
được phép.

Không thực hiện nghiệp vụ
tiếp nhận trong Use Case này.

26. Status

Use Case ID:

UC-OFF-01

Version:

1.0

Status:

Draft

Previous:

UC-REG-08 — Bổ sung hồ sơ

Next:

UC-OFF-02 — Tiếp nhận hồ sơ