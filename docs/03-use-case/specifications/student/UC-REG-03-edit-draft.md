# UC-REG-03 — CHỈNH SỬA HỒ SƠ DRAFT

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-REG-03 |
| Tên Use Case | Chỉnh sửa hồ sơ DRAFT |
| Actor chính | Student |
| Actor phụ | SIS |
| Nhóm | Student Registration |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép sinh viên
tiếp tục hoàn thiện và chỉnh sửa
hồ sơ ngoại trú đang ở trạng thái
DRAFT trước khi gửi hồ sơ
cho hệ thống xử lý.

Sinh viên chỉ được chỉnh sửa
những thông tin thuộc phạm vi
cho phép.

Các thông tin chính thức do SIS
quản lý không được sinh viên
tự ý thay đổi.

---

# 3. Phạm vi chỉnh sửa

Sinh viên có thể chỉnh sửa
các thông tin thuộc hồ sơ
ngoại trú như:

```text
Thông tin nơi ở
Địa chỉ
Phòng / số nhà
Loại hình nơi ở
Ngày bắt đầu ở
Thông tin chủ trọ
Thông tin liên hệ
Các trường nghiệp vụ khác

Việc chỉnh sửa phải tuân thủ
các trường và quy tắc được
định nghĩa trong Functional
Requirements và Business Rules.

4. Preconditions
Sinh viên đã đăng nhập.
Phiên đăng nhập còn hiệu lực.
Hồ sơ tồn tại.
Hồ sơ thuộc về sinh viên
đang đăng nhập.
Hồ sơ đang ở trạng thái:
DRAFT
Hồ sơ chưa được Submit.
5. Trigger

Sinh viên chọn:

Hồ sơ ngoại trú
      ↓
Hồ sơ DRAFT
      ↓
Chỉnh sửa
6. Main Flow
Bước 1

Sinh viên mở danh sách
hồ sơ ngoại trú của mình.

Bước 2

System hiển thị các hồ sơ
mà sinh viên được phép xem.

Bước 3

Sinh viên chọn hồ sơ
có trạng thái:

DRAFT
Bước 4

System kiểm tra quyền
truy cập hồ sơ.

Bước 5

System tải dữ liệu
hồ sơ DRAFT.

Bước 6

System hiển thị form
chỉnh sửa.

Bước 7

Sinh viên thay đổi
thông tin cần thiết.

Bước 8

System thực hiện
validation dữ liệu.

Bước 9

Nếu dữ liệu hợp lệ,
System lưu thay đổi.

Bước 10

System giữ trạng thái:

DRAFT
Bước 11

System ghi Audit Log.

Bước 12

System thông báo:

Đã lưu thay đổi hồ sơ.
7. Dữ liệu được phép chỉnh sửa

Các thông tin thuộc
Registration có thể được
chỉnh sửa nếu đang DRAFT.

Ví dụ:

Residence Type
Address
House Number
Room Number
Start Date
Landlord Information
Contact Information

Các trường thực tế phải
phù hợp với thiết kế
Database và Functional
Requirements.

8. Dữ liệu không được chỉnh sửa

Các thông tin do SIS
quản lý không được sinh viên
thay đổi trực tiếp.

Ví dụ:

MSSV
Họ tên
Lớp
Khoa
Ngành
Trạng thái học tập

Nếu thông tin SIS bị sai,
sinh viên phải thực hiện
quy trình điều chỉnh dữ liệu
tại hệ thống/đơn vị có thẩm
quyền tương ứng.

9. Quy tắc sở hữu hồ sơ

System phải kiểm tra:

Logged-in Student ID
        ↓
Registration Student ID

Hai giá trị phải giống nhau.

Ví dụ:

Student A
   ↓
Registration A
   ✓ Allowed

Không cho phép:

Student A
   ↓
Registration B
   ✗ Forbidden
10. Kiểm tra trạng thái

Trước khi cho phép chỉnh sửa:

Registration Status
        ↓
      DRAFT?
      /    \
    YES     NO
     ↓       ↓
  Edit    Reject

Nếu hồ sơ đã:

SUBMITTED
UNDER_REVIEW
NEED_MORE_INFO
ACTIVE
REJECTED
EXPIRED

thì không được sử dụng
Use Case này để chỉnh sửa
tùy ý.

Mỗi trạng thái có quy trình
xử lý riêng.

11. Validation dữ liệu

System phải kiểm tra
dữ liệu trước khi lưu.

11.1 Required Fields

Các trường bắt buộc
không được để trống.

11.2 Date Validation

Ngày phải hợp lệ.

Ví dụ:

Start Date
<
End Date

nếu hồ sơ yêu cầu
Ngày kết thúc.

11.3 Phone Validation

Số điện thoại phải
đúng định dạng được
hệ thống quy định.

11.4 Catalog Validation

Các trường dạng danh mục
phải sử dụng giá trị hợp lệ.

Ví dụ:

Residence Type

phải thuộc Catalog
đang hoạt động.

12. Thay đổi thông tin nơi ở

Sinh viên có thể cập nhật
thông tin nơi ở khi hồ sơ
đang DRAFT.

Ví dụ:

Địa chỉ cũ
     ↓
Sinh viên chỉnh sửa
     ↓
Địa chỉ mới
     ↓
Validation
     ↓
Save

Thông tin sau khi lưu phải
được liên kết đúng với
Registration.

13. Thay đổi thông tin chủ trọ

Nếu hồ sơ có thông tin
chủ trọ:

Sinh viên có thể chỉnh sửa
các trường được phép.

Ví dụ:

Tên chủ trọ
Số điện thoại
Thông tin xác nhận

Nếu hệ thống sử dụng
Landlord Entity dùng chung,
System phải tránh tạo
bản ghi trùng không cần thiết.

14. Upload hoặc thay thế
tài liệu

Sinh viên có thể thêm hoặc
thay thế tài liệu trong
giai đoạn DRAFT nếu nghiệp vụ
cho phép.

Luồng:

DRAFT
  ↓
Document
  ↓
Upload / Replace
  ↓
Validation
  ↓
Save

Việc quản lý tài liệu
được đặc tả chi tiết tại:

UC-REG-04 — Upload tài liệu
15. Version tài liệu

Khi tài liệu được thay thế:

Document V1
     ↓
Replace
     ↓
Document V2

System không được tùy tiện
xóa toàn bộ lịch sử
tài liệu cũ.

Phiên bản cũ phải có khả năng
truy vết theo chính sách
Audit và Document Versioning.

16. Lưu thay đổi

Khi sinh viên chọn:

Lưu

System:

Validate dữ liệu.
Kiểm tra quyền.
Kiểm tra trạng thái.
Lưu thay đổi.
Ghi thời gian cập nhật.
Ghi Audit Log.
Giữ Status = DRAFT.
17. Autosave

Nếu hệ thống hỗ trợ
Autosave:

Student Editing
       ↓
Autosave
       ↓
DRAFT

Autosave không được
chuyển hồ sơ sang:

SUBMITTED

Sinh viên vẫn phải
thực hiện thao tác Submit
riêng biệt.

18. Alternative Flow
A1 — Sinh viên chưa hoàn
thành dữ liệu

Nếu dữ liệu chưa đầy đủ:

System có thể cho phép
lưu DRAFT.

System hiển thị những
trường còn thiếu để
sinh viên hoàn thiện.

Không cho phép Submit
cho đến khi đáp ứng
đầy đủ điều kiện.

A2 — Dữ liệu không hợp lệ

Ví dụ:

Phone Number
Date
Address
Catalog Value

không hợp lệ.

System:

Không lưu dữ liệu
không hợp lệ.
Hiển thị lỗi.
Cho phép sinh viên
chỉnh sửa lại.
A3 — Hồ sơ không còn DRAFT

Nếu trong lúc sinh viên
đang chỉnh sửa, trạng thái
hồ sơ đã thay đổi:

DRAFT
  ↓
SUBMITTED

System phải kiểm tra lại
trạng thái trước khi lưu.

Nếu không còn DRAFT:

Save
 ↓
Reject

và thông báo cho sinh viên.

A4 — SIS có thay đổi dữ liệu

Nếu dữ liệu SIS được
cập nhật trong lúc sinh viên
đang chỉnh sửa:

System phải ưu tiên
dữ liệu SIS đối với các
trường do SIS quản lý.

Không cho phép thao tác
Edit DRAFT ghi đè dữ liệu
chính thức từ SIS.

A5 — Sinh viên muốn
rút hồ sơ DRAFT

Nếu sinh viên chọn:

Hủy / Rút hồ sơ

System kiểm tra trạng thái.

Nếu:

Status = DRAFT

thì cho phép thực hiện
Use Case:

UC-REG-07 — Rút hồ sơ

Không xử lý việc rút
trực tiếp trong Use Case
chỉnh sửa.

19. Exception Flow
E1 — Không tìm thấy hồ sơ

Nếu Registration ID
không tồn tại:

System thông báo:

Không tìm thấy hồ sơ.
E2 — Không có quyền

Nếu hồ sơ không thuộc
sinh viên hiện tại:

403 Forbidden

System từ chối truy cập.

E3 — Session hết hạn

System yêu cầu sinh viên
đăng nhập lại.

E4 — Database Error

Nếu xảy ra lỗi Database:

ROLLBACK

Không lưu thay đổi
không hoàn chỉnh.

System ghi Error Log.

E5 — Concurrent Update

Nếu hồ sơ bị thay đổi
bởi một tiến trình khác:

Version A
     ↓
Student Editing
     
Version B
     ↓
Another Update

System phải phát hiện
xung đột và yêu cầu
sinh viên tải lại dữ liệu
trước khi tiếp tục.

20. Transaction

Các thay đổi liên quan
đến nhiều Entity phải được
xử lý trong transaction
phù hợp.

Ví dụ:

BEGIN TRANSACTION
       ↓
Validate Registration
       ↓
Update Residence
       ↓
Update Landlord
       ↓
Update Registration
       ↓
Create Audit Log
       ↓
COMMIT

Nếu có lỗi:

ROLLBACK
21. Audit Log

Mỗi thay đổi quan trọng
phải có khả năng truy vết.

Ví dụ:

Actor:
Student

Action:
REGISTRATION_UPDATED

Target:
REG-2026-000001

Old Value:
...

New Value:
...

Timestamp:
...

Result:
SUCCESS

Không cho phép sinh viên
xóa hoặc sửa Audit Log.

22. Notification

Sau khi lưu thành công:

Đã cập nhật hồ sơ.

Nếu có lỗi:

Không thể cập nhật hồ sơ.
Vui lòng kiểm tra lại
thông tin.

Không gửi thông báo
"đã gửi hồ sơ" vì hồ sơ
vẫn đang DRAFT.

23. State Machine

Use Case này không tạo
State mới.

DRAFT
  ↓
Edit
  ↓
DRAFT

Khi sinh viên Submit:

DRAFT
  ↓
SUBMITTED

Việc Submit được xử lý
bởi:

UC-REG-05
24. Business Constraints
BR-EDIT-01

Chỉ Student sở hữu hồ sơ
mới được chỉnh sửa hồ sơ.

BR-EDIT-02

Chỉ Registration ở trạng thái
DRAFT được chỉnh sửa bằng
Use Case này.

BR-EDIT-03

Sinh viên không được chỉnh
sửa thông tin do SIS quản lý.

BR-EDIT-04

Mọi dữ liệu chỉnh sửa phải
được validation.

BR-EDIT-05

Residence Type phải thuộc
Catalog hợp lệ.

BR-EDIT-06

Thông tin chủ trọ phải
tuân thủ quy tắc nghiệp vụ.

BR-EDIT-07

Thay thế tài liệu phải
giữ khả năng truy vết
phiên bản.

BR-EDIT-08

Autosave nếu có không
được tự động Submit.

BR-EDIT-09

Việc chỉnh sửa DRAFT
không tạo State mới.

BR-EDIT-10

Mọi thay đổi quan trọng
phải có Audit Log.

BR-EDIT-11

Sinh viên không được
xem hoặc chỉnh sửa
Registration của sinh viên
khác.

BR-EDIT-12

Nếu trạng thái hồ sơ
thay đổi trong quá trình
chỉnh sửa, System phải
kiểm tra lại trạng thái
trước khi lưu.

25. Postconditions

Nếu thành công:

Registration
      ↓
Status = DRAFT
      ↓
Updated Data Saved
      ↓
Audit Log Created

Sinh viên có thể tiếp tục:

DRAFT
  ↓
Edit
  ↓
Upload Document
  ↓
Submit
26. Acceptance Criteria
AC01

Sinh viên có thể mở
hồ sơ DRAFT của mình.

AC02

Sinh viên có thể chỉnh sửa
thông tin nơi ở được phép.

AC03

Sinh viên có thể chỉnh sửa
thông tin chủ trọ được phép.

AC04

System không cho phép
sửa dữ liệu do SIS quản lý.

AC05

System kiểm tra quyền
sở hữu hồ sơ.

AC06

System kiểm tra trạng thái
DRAFT trước khi lưu.

AC07

System validation dữ liệu.

AC08

Dữ liệu hợp lệ được
lưu thành công.

AC09

Sau khi lưu, hồ sơ vẫn
ở trạng thái DRAFT.

AC10

Autosave nếu có không
được Submit hồ sơ.

AC11

Thay đổi quan trọng
được ghi Audit Log.

AC12

System xử lý Concurrent
Update.

AC13

Database Error không
được làm hồ sơ ở trạng
thái dữ liệu không nhất quán.

AC14

Sinh viên có thể chuyển
sang Use Case Rút hồ sơ
nếu muốn hủy DRAFT.

27. Traceability
Business Overview
       ↓
Business Rules
       ↓
Business Flow
       ↓
Functional Requirements
       ↓
UC-REG-03
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
28. Related Use Cases
UC-REG-02
Tạo hồ sơ ngoại trú
        ↓
UC-REG-03
Chỉnh sửa DRAFT
        ↓
┌───────────────┬───────────────┐
↓               ↓               ↓
UC-REG-04       UC-REG-05       UC-REG-07
Upload          Gửi hồ sơ       Rút hồ sơ
tài liệu
29. Status

Use Case ID:

UC-REG-03

Version:

1.0

Status:

Draft

Previous:

UC-REG-02 — Tạo hồ sơ ngoại trú

Next:

UC-REG-04 — Upload tài liệu