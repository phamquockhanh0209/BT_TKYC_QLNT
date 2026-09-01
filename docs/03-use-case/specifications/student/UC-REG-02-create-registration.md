# UC-REG-02 — TẠO HỒ SƠ NGOẠI TRÚ

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-REG-02 |
| Tên Use Case | Tạo hồ sơ ngoại trú |
| Actor chính | Student |
| Actor phụ | SIS |
| Nhóm | Student Registration |
| Priority | Critical |

---

# 2. Mục đích

Use Case cho phép sinh viên
tạo một hồ sơ đăng ký ngoại trú
trên Website.

Sinh viên nhập thông tin nơi ở,
chủ trọ và các thông tin cần thiết,
sau đó lưu hồ sơ ở trạng thái
DRAFT.

Hồ sơ chỉ trở thành hồ sơ chính
được xử lý khi sinh viên thực hiện
gửi hồ sơ.

---

# 3. Kết quả mong muốn

Sau khi tạo thành công:

```text
Student
   ↓
Create Registration
   ↓
DRAFT

Sinh viên có thể tiếp tục:

DRAFT
  ↓
Edit
  ↓
Upload Document
  ↓
Submit
4. Preconditions
Sinh viên đã đăng nhập.
Phiên đăng nhập còn hiệu lực.
Tài khoản sinh viên hợp lệ.
Sinh viên tồn tại trong dữ liệu
được đồng bộ từ SIS.
Sinh viên đủ điều kiện đăng ký
ngoại trú theo Business Rule.
Sinh viên không có hồ sơ
ngoại trú đang ACTIVE nếu
Business Rule không cho phép
tạo hồ sơ ACTIVE thứ hai.
Không có Request đang xử lý
xung đột với việc tạo hồ sơ
mới.
5. Trigger

Sinh viên truy cập:

Hồ sơ ngoại trú
      ↓
Đăng ký ngoại trú
      ↓
Tạo hồ sơ mới
6. Dữ liệu được lấy từ SIS

System tự động lấy:

MSSV
Họ tên
Ngày sinh
Lớp
Khoa
Ngành
Trạng thái học tập

Sinh viên không cần nhập lại
các thông tin chính thức
do SIS quản lý.

7. Dữ liệu sinh viên nhập

Tùy theo Business Rule,
sinh viên có thể nhập:

Thông tin nơi ở
Thông tin chủ trọ
Địa chỉ
Số điện thoại liên hệ
Ngày bắt đầu ở
Ngày dự kiến kết thúc
Thông tin liên quan khác

Các trường bắt buộc phải
được xác định trong
Functional Requirements.

8. Residence Information

Thông tin nơi ở có thể gồm:

Residence Type
Province / City
District
Ward
Address
House / Room Number
Start Date

Ví dụ:

Residence Type:
RENTED_ROOM

Address:
...

Start Date:
...
9. Landlord Information

Nếu loại nơi ở yêu cầu
thông tin chủ trọ:

Landlord Name
Phone Number
Identification Information
Confirmation Information

System phải kiểm tra
các trường bắt buộc.

10. Chủ trọ và Entity dùng chung

Thông tin chủ trọ và nơi ở
có thể được quản lý thành
Entity riêng.

Mô hình:

Landlord
   │
   └── Residence
          │
          ├── Student A
          ├── Student B
          └── Student C

Điều này giúp tránh việc
lặp lại cùng một thông tin
chủ trọ khi nhiều sinh viên
cùng ở một nơi.

11. Tạo hồ sơ DRAFT
Bước 1

Sinh viên chọn:

Tạo hồ sơ ngoại trú
Bước 2

System kiểm tra điều kiện
đăng ký.

Bước 3

System lấy thông tin sinh viên
từ SIS.

Bước 4

System hiển thị form đăng ký.

Bước 5

Sinh viên nhập thông tin
nơi ở.

Bước 6

Sinh viên nhập thông tin
chủ trọ nếu cần.

Bước 7

Sinh viên lưu hồ sơ.

Bước 8

System tạo Registration.

Bước 9

System gán:

Status = DRAFT
Bước 10

System ghi Audit Log:

REGISTRATION_CREATED
12. Registration ID

Mỗi hồ sơ phải có
Registration ID duy nhất.

Ví dụ:

REG-2026-000001

Registration ID được System
sinh tự động.

Sinh viên không tự nhập
Registration ID.

13. Một sinh viên có bao nhiêu hồ sơ?

System phải kiểm tra
các hồ sơ hiện có của
sinh viên.

Ví dụ:

Student
   ↓
Registrations

Có thể có:

DRAFT
SUBMITTED
REJECTED
EXPIRED

nhưng việc tạo hồ sơ mới
phải tuân thủ Business Rule
về hồ sơ đang tồn tại.

Đặc biệt không được tạo
hồ sơ ACTIVE trùng thời gian
nếu nghiệp vụ không cho phép.

14. Kiểm tra hồ sơ đang tồn tại

Trước khi tạo:

Check Existing Registration
             ↓
        ┌────┴────┐
        │         │
      Found     Not Found
        │         │
     Check Rule   Create

Nếu đã có hồ sơ đang
xử lý hoặc ACTIVE:

System áp dụng Business Rule
tương ứng.

15. Validation dữ liệu

System phải kiểm tra:

Required Fields

Các trường bắt buộc
không được để trống.

Date

Ngày phải hợp lệ.

Ví dụ:

Start Date
<
End Date
Phone Number

Số điện thoại phải
đúng định dạng.

Address

Địa chỉ phải đầy đủ
theo quy định.

Residence Type

Loại nơi ở phải là
giá trị ACTIVE trong
Catalog.

16. Validation trạng thái sinh viên

System kiểm tra:

Student Academic Status

Ví dụ:

ACTIVE

có thể đủ điều kiện
đăng ký.

Các trạng thái khác:

SUSPENDED
RESERVED
GRADUATED
WITHDRAWN

phải được xử lý theo
Business Rule tương ứng.

Use Case này không tự
định nghĩa lại quy định
về trạng thái học tập.

17. Validation Deadline

System kiểm tra:

Current Date
       ↓
Registration Deadline

Nếu sinh viên nộp sau
deadline:

is_late = true

Nếu Business Rule cho phép
nộp trễ, hồ sơ vẫn có thể
được tạo và gửi.

Không tạo một State riêng
chỉ cho trường hợp nộp trễ.

18. is_late

is_late là cờ nghiệp vụ:

is_late = true

hoặc:

is_late = false

Ví dụ:

Deadline:
2026-09-15

Submit Date:
2026-09-20

is_late:
true

Trạng thái chính của
Registration vẫn có thể là:

SUBMITTED
19. Lưu nháp

Sinh viên có thể lưu
hồ sơ khi chưa hoàn thành.

Ví dụ:

Create
  ↓
DRAFT
  ↓
Save
  ↓
Exit

Sau đó:

Login
  ↓
My Registration
  ↓
Open DRAFT
  ↓
Continue Editing
20. DRAFT chưa được xử lý

Hồ sơ:

DRAFT

chưa được chuyển cho
cán bộ xử lý.

Cán bộ không thực hiện
quy trình duyệt chính thức
đối với hồ sơ DRAFT.

21. Chỉnh sửa DRAFT

Sau khi tạo DRAFT,
sinh viên có thể:

Edit
Upload Document
Update Information
Save

Use Case chỉnh sửa chi tiết
được đặc tả riêng tại:

UC-REG-03
22. Upload Document

Nếu hồ sơ yêu cầu
tài liệu:

Registration
     ↓
Document
     ↓
Upload

Sinh viên có thể upload
tài liệu theo loại được
hệ thống yêu cầu.

Use Case upload chi tiết
được đặc tả tại:

UC-REG-04
23. Document Version

Nếu sinh viên thay thế
tài liệu:

Document V1
     ↓
Replace
     ↓
Document V2

Không xóa lịch sử
phiên bản cũ một cách
tùy tiện.

Hệ thống phải bảo đảm
khả năng truy vết.

24. Alternative Flow
A1 — Sinh viên không đủ điều kiện

Nếu sinh viên không đủ
điều kiện đăng ký:

System:

Không tạo hồ sơ.
Hiển thị lý do.
Hướng dẫn sinh viên
liên hệ bộ phận phù hợp
nếu cần.
A2 — Đã có hồ sơ ACTIVE

Nếu sinh viên đã có
hồ sơ ACTIVE:

System kiểm tra Business Rule.

Nếu không cho phép tạo
hồ sơ mới:

Create Registration
      ↓
Existing ACTIVE Registration
      ↓
Reject Creation
A3 — Đã có hồ sơ đang xử lý

Nếu sinh viên đã có:

SUBMITTED
UNDER_REVIEW
NEED_MORE_INFO

System xử lý theo Rule
về hồ sơ trùng.

Mặc định không tạo
hồ sơ mới nếu việc này
gây ra hai quy trình
đăng ký song song.

A4 — Nộp sau deadline

Nếu:

Current Date > Deadline

và Business Rule cho phép
nộp trễ:

is_late = true

Hồ sơ vẫn có thể được
tạo và gửi.

A5 — Chưa hoàn thành dữ liệu

Nếu sinh viên chưa nhập
đủ thông tin:

System vẫn cho phép
lưu DRAFT nếu các trường
cốt lõi để tạo DRAFT
đã hợp lệ.

System không cho phép
SUBMIT cho đến khi
hoàn thành yêu cầu.

25. Exception Flow
E1 — SIS không khả dụng

Nếu System không lấy được
thông tin sinh viên:

SIS Unavailable

System không tạo hồ sơ
nếu thiếu dữ liệu bắt buộc.

E2 — Sinh viên không tồn tại
trong SIS

System hiển thị:

Student Not Found

Không tạo hồ sơ.

E3 — Database Error

Nếu xảy ra lỗi Database:

Rollback transaction.
Không tạo hồ sơ
không hoàn chỉnh.
Ghi Error Log.
Thông báo lỗi.
E4 — Session Expired

Nếu phiên đăng nhập
hết hạn:

System yêu cầu đăng nhập lại.

Dữ liệu chưa lưu có thể
được xử lý theo cơ chế
draft/autosave nếu hệ thống
có hỗ trợ.

26. Transaction

Việc tạo Registration
phải được thực hiện
trong transaction phù hợp.

Ví dụ:

BEGIN TRANSACTION
       ↓
Validate Student
       ↓
Validate Registration
       ↓
Create Registration
       ↓
Create related data
       ↓
Create Audit Log
       ↓
COMMIT

Nếu lỗi:

ROLLBACK
27. Audit Log

Khi tạo hồ sơ thành công:

REGISTRATION_CREATED

Audit Log:

Actor ID
Actor Type
Action
Registration ID
Timestamp
Result

Ví dụ:

Actor:
Student

Action:
REGISTRATION_CREATED

Target:
REG-2026-000001

Result:
SUCCESS
28. Notification

Sau khi tạo DRAFT,
System có thể thông báo:

Hồ sơ đã được lưu nháp.

Không gửi thông báo
"đã tiếp nhận" vì DRAFT
chưa được gửi cho cán bộ.

Thông báo tiếp nhận
được xử lý ở Use Case
khác sau khi sinh viên
Submit.

29. State Machine

Use Case này tạo:

[Start]
   ↓
Create Registration
   ↓
DRAFT

Sau đó sinh viên có thể:

DRAFT
  ↓
Edit
  ↓
Save
  ↓
DRAFT

Hoặc:

DRAFT
  ↓
Submit
  ↓
SUBMITTED
30. Không tạo State riêng
cho is_late

Không sử dụng:

LATE

làm State.

Thay vào đó:

Status:
SUBMITTED

is_late:
true

Điều này giúp State Machine
không bị phình to.

31. Business Constraints
BR-REG-01

Mỗi Registration phải có
Registration ID duy nhất.

BR-REG-02

Registration phải thuộc
về một Student.

BR-REG-03

Sinh viên chỉ được tạo
Registration cho chính mình.

BR-REG-04

Thông tin đào tạo chính thức
phải lấy từ SIS.

BR-REG-05

Sinh viên không được
tự thay đổi dữ liệu do
SIS quản lý.

BR-REG-06

Registration mới bắt đầu
ở trạng thái DRAFT.

BR-REG-07

DRAFT chưa được đưa vào
quy trình xử lý chính thức.

BR-REG-08

Sinh viên có thể tiếp tục
chỉnh sửa DRAFT.

BR-REG-09

Dữ liệu bắt buộc phải
được validation trước khi
Submit.

BR-REG-10

Residence Type phải
thuộc Catalog hợp lệ.

BR-REG-11

Thông tin nơi ở phải
tuân thủ các trường
bắt buộc.

BR-REG-12

Không được tạo hồ sơ
trùng với hồ sơ đang
xử lý nếu Business Rule
không cho phép.

BR-REG-13

Không được tạo hồ sơ
ACTIVE trùng thời gian
nếu Business Rule không
cho phép.

BR-REG-14

Nộp trễ được ghi nhận
bằng is_late.

BR-REG-15

Nộp trễ không mặc định
tạo State riêng.

BR-REG-16

Tài liệu thay thế phải
giữ khả năng truy vết
phiên bản.

BR-REG-17

Mọi Registration phải
có Audit Log cho các
thao tác quan trọng.

BR-REG-18

Student chỉ được truy cập
Registration của chính mình.

32. Postconditions

Nếu thành công:

Registration Created
        ↓
Status = DRAFT
        ↓
Student can continue editing

Registration có:

Registration ID
Student ID
Residence Information
Created At
Status

Nếu có dữ liệu liên quan:

Residence
Landlord
Documents

được liên kết đúng với
Registration.

Audit Log được ghi nhận.

33. Acceptance Criteria
AC01

Sinh viên đăng nhập có thể
tạo hồ sơ ngoại trú.

AC02

System tự lấy thông tin
sinh viên từ SIS.

AC03

Registration ID được tạo
tự động và duy nhất.

AC04

Hồ sơ mới có Status = DRAFT.

AC05

Sinh viên có thể lưu DRAFT.

AC06

Sinh viên có thể tiếp tục
chỉnh sửa DRAFT.

AC07

System validation các
trường bắt buộc.

AC08

Residence Type phải là
Catalog hợp lệ.

AC09

System kiểm tra hồ sơ
đang tồn tại trước khi
tạo hồ sơ mới.

AC10

System kiểm tra điều kiện
đăng ký của sinh viên.

AC11

Nộp trễ được ghi nhận
bằng is_late.

AC12

is_late không tạo
State riêng.

AC13

System xử lý lỗi SIS.

AC14

System xử lý Database Error
bằng transaction/rollback.

AC15

Registration được ghi
Audit Log.

AC16

Sinh viên không thể tạo
hồ sơ cho sinh viên khác.

AC17

Thông tin do SIS quản lý
không được sinh viên
tự ý sửa.

34. Traceability
Business Overview
       ↓
Business Rules
       ↓
Business Flow
       ↓
Functional Requirements
       ↓
UC-REG-02
       ↓
Activity Diagram
       ↓
Sequence Diagram
       ↓
API
       ↓
Registration Module
       ↓
Database
       ↓
Implementation
35. Related Use Cases
UC-REG-01
Xem thông tin cá nhân
        ↓
UC-REG-02
Tạo hồ sơ ngoại trú
        ↓
UC-REG-03
Chỉnh sửa DRAFT
        ↓
UC-REG-04
Upload tài liệu
        ↓
UC-REG-05
Gửi hồ sơ
36. Status

Use Case ID:

UC-REG-02

Version:

1.0

Status:

Draft

Previous:

UC-REG-01 — Xem thông tin cá nhân

Next:

UC-REG-03 — Chỉnh sửa hồ sơ DRAFT