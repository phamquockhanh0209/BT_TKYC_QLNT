# UC-REG-05 — GỬI HỒ SƠ

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-REG-05 |
| Tên Use Case | Gửi hồ sơ |
| Actor chính | Student |
| Actor phụ | System |
| Nhóm | Student Registration |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép sinh viên
gửi hồ sơ ngoại trú đã hoàn
thiện để hệ thống bắt đầu
quy trình tiếp nhận và xử lý.

Đây là thao tác chuyển hồ sơ
từ trạng thái:

DRAFT

sang:

SUBMITTED

Sau khi Submit thành công,
sinh viên không còn được
chỉnh sửa hồ sơ theo cơ chế
DRAFT thông thường.

---

# 3. Preconditions

1. Student đã đăng nhập.

2. Session còn hiệu lực.

3. Registration tồn tại.

4. Registration thuộc
   Student đang đăng nhập.

5. Registration đang ở:

DRAFT

6. Sinh viên đã hoàn thiện
   các thông tin bắt buộc.

7. Các tài liệu bắt buộc
   đã được cung cấp nếu
   nghiệp vụ yêu cầu.

---

# 4. Trigger

Sinh viên chọn:

Gửi hồ sơ

hoặc:

Submit Registration

---

# 5. Main Flow

## Bước 1

Student mở hồ sơ ngoại trú.

## Bước 2

System kiểm tra quyền
truy cập Registration.

## Bước 3

System kiểm tra trạng thái
hiện tại.

System yêu cầu:

DRAFT

## Bước 4

System kiểm tra dữ liệu
bắt buộc.

## Bước 5

System kiểm tra các tài liệu
bắt buộc.

## Bước 6

System kiểm tra các
Business Rules liên quan.

## Bước 7

System xác định hồ sơ
có nộp đúng hạn hay không.

## Bước 8

Nếu hồ sơ được nộp sau
deadline, System ghi nhận:

is_late = true

Nếu không trễ:

is_late = false

## Bước 9

System thực hiện Submit
Registration.

## Bước 10

Registration chuyển:

DRAFT
  ↓
SUBMITTED

## Bước 11

System ghi nhận:

Submitted At

Submitted By

is_late

## Bước 12

System tạo Audit Log.

## Bước 13

System tạo Notification
cho quy trình tiếp nhận.

## Bước 14

System thông báo cho
Student:

Hồ sơ đã được gửi
thành công.

---

# 6. Kiểm tra quyền sở hữu

System phải kiểm tra:

Logged-in Student ID
        ↓
Registration Student ID

Hai giá trị phải giống nhau.

Nếu không:

Access Denied

Student không được phép
Submit hồ sơ của sinh viên
khác.

---

# 7. Kiểm tra trạng thái

Trước khi Submit:

Registration Status
        ↓
      DRAFT?
      /    \
    YES     NO
     ↓       ↓
Continue   Reject

Chỉ hồ sơ DRAFT mới được
Submit bằng Use Case này.

---

# 8. Kiểm tra thông tin bắt buộc

System phải kiểm tra
tất cả Required Fields.

Ví dụ:

- Thông tin nơi ở.
- Địa chỉ.
- Ngày bắt đầu ở.
- Thông tin chủ trọ.
- Các trường bắt buộc khác.

Danh sách chính thức phải
phù hợp với Functional
Requirements và Business
Rules.

Nếu còn trường bắt buộc
chưa hoàn thiện:

System không cho Submit.

---

# 9. Kiểm tra tài liệu bắt buộc

System xác định danh sách
Required Documents.

Ví dụ:

Registration
      ↓
Required Documents
      ├── Residence Document
      └── Landlord Confirmation

System kiểm tra từng loại
tài liệu.

Nếu thiếu tài liệu bắt buộc:

Submit bị từ chối.

---

# 10. Kiểm tra Document Version

Nếu tài liệu có nhiều
version:

V1
 ↓
V2
 ↓
V3

System phải xác định
Current Version.

Current Version phải là
version được sử dụng để
kiểm tra hồ sơ hiện tại.

---

# 11. Kiểm tra Business Rules

Trước khi Submit,
System phải thực hiện
các kiểm tra nghiệp vụ
liên quan.

Ví dụ:

- Hồ sơ thuộc đúng Student.
- Registration đang DRAFT.
- Thông tin bắt buộc đầy đủ.
- Tài liệu bắt buộc đầy đủ.
- Dữ liệu hợp lệ.
- Không vi phạm quy tắc
  đăng ký hiện hành.

---

# 12. Deadline

System xác định:

Submission Deadline

và:

Submitted At

So sánh:

Submitted At <= Deadline

hoặc:

Submitted At > Deadline

---

# 13. Hồ sơ nộp đúng hạn

Nếu:

Submitted At <= Deadline

System ghi:

is_late = false

Hồ sơ được Submit bình
thường.

---

# 14. Hồ sơ nộp trễ

Nếu:

Submitted At > Deadline

System ghi:

is_late = true

Hồ sơ vẫn được ghi nhận
SUBMITTED nếu Business Rule
cho phép.

Nộp trễ không tạo ra
một State riêng.

Không sử dụng:

LATE

như một Registration State.

---

# 15. Mô hình State và Late Flag

Registration State:

DRAFT
  ↓
SUBMITTED

Late được biểu diễn bằng:

is_late

Ví dụ:

Status = SUBMITTED
is_late = true

Điều này có nghĩa:

Hồ sơ đã được Submit
nhưng Submit sau Deadline.

---

# 16. Submit Transaction

Thao tác Submit phải được
xử lý nhất quán.

Ví dụ:

BEGIN TRANSACTION

    Validate Registration

    Validate Required Fields

    Validate Required Documents

    Check Deadline

    Update Registration

    Create Audit Log

    Create Notification

COMMIT

Nếu xảy ra lỗi:

ROLLBACK

---

# 17. Chống Submit trùng

Student có thể vô tình
click nút Submit nhiều lần.

System phải đảm bảo
không tạo nhiều lần Submit.

Ví dụ:

Click 1
  ↓
SUBMIT

Click 2
  ↓
Registration đã SUBMITTED
  ↓
Reject

Không tạo thêm một
Submission mới cho cùng
một Registration.

---

# 18. Concurrent Submit

Nếu nhiều request Submit
được gửi gần như đồng thời:

Request A
Request B
    ↓
Registration

System phải đảm bảo chỉ
một request có thể chuyển
Registration:

DRAFT
  ↓
SUBMITTED

Request còn lại phải
được từ chối hoặc trả về
kết quả hồ sơ đã Submit.

---

# 19. Alternative Flow

## A1 — Thiếu thông tin

Nếu còn Required Field:

System hiển thị:

Không thể gửi hồ sơ.
Vui lòng hoàn thiện
các trường bắt buộc.

Registration vẫn:

DRAFT

---

## A2 — Thiếu tài liệu

Nếu thiếu Required Document:

System hiển thị:

Hồ sơ chưa đầy đủ
tài liệu bắt buộc.

Registration vẫn:

DRAFT

Student có thể sử dụng:

UC-REG-04

để upload tài liệu.

---

## A3 — Nộp trễ

Nếu:

Submitted At > Deadline

System:

1. Cho phép Submit nếu
   Business Rule cho phép.

2. Ghi:

is_late = true

3. Giữ:

Status = SUBMITTED

4. Ghi Audit Log.

5. Có thể tạo Notification
   để cán bộ biết hồ sơ
   được nộp trễ.

---

## A4 — Hồ sơ đã được Submit

Nếu Registration đã:

SUBMITTED

System không thực hiện
Submit lần nữa.

---

## A5 — Sinh viên quay lại
# chỉnh sửa

Nếu Registration đã
SUBMITTED:

Student không thể dùng:

UC-REG-03

để chỉnh sửa DRAFT.

Nếu cần thay đổi sau Submit,
phải sử dụng quy trình
nghiệp vụ phù hợp.

---

# 20. Exception Flow

## E1 — Registration không tồn tại

System thông báo:

Không tìm thấy hồ sơ.

Không thực hiện Submit.

---

## E2 — Không có quyền

Nếu Registration không
thuộc Student:

403 Forbidden

System từ chối.

---

## E3 — Session hết hạn

System yêu cầu Student
đăng nhập lại.

Không Submit nếu chưa
xác thực lại.

---

## E4 — Registration không
# còn DRAFT

Nếu trạng thái đã thay đổi:

DRAFT
  ↓
SUBMITTED

hoặc một trạng thái khác:

System từ chối thao tác.

---

## E5 — Database Error

Nếu Database xảy ra lỗi:

ROLLBACK

Không được chuyển
Registration sang SUBMITTED
nếu transaction không
hoàn tất.

---

## E6 — Notification Error

Nếu Submit thành công
nhưng Notification thất bại:

Registration vẫn giữ:

SUBMITTED

System ghi nhận lỗi
Notification để xử lý
theo cơ chế retry phù hợp.

Không rollback hồ sơ
chỉ vì Notification
không gửi được.

---

## E7 — Audit Log Error

Nếu Audit Log là thành
phần bắt buộc của transaction
nghiệp vụ:

Submit không được hoàn
tất nếu Audit Log không
được ghi thành công.

Việc xử lý cụ thể phải
phù hợp với kiến trúc
Audit của hệ thống.

---

# 21. Sau khi Submit

Sau khi thành công:

DRAFT
  ↓
SUBMITTED

Sinh viên có thể:

- Theo dõi hồ sơ.
- Xem lịch sử hồ sơ.
- Chờ cán bộ tiếp nhận.

Use Case tiếp theo:

UC-OFF-02

Tiếp nhận hồ sơ.

---

# 22. Notification

Sau Submit thành công:

Student nhận:

Hồ sơ đã được gửi
thành công.

Hệ thống có thể tạo
Notification cho cán bộ
tiếp nhận.

Ví dụ:

Có hồ sơ ngoại trú mới
chờ tiếp nhận.

---

# 23. Audit Log

System ghi:

REGISTRATION_SUBMITTED

Thông tin có thể gồm:

Actor ID

Actor Type

Registration ID

Previous Status

New Status

Submitted At

is_late

Timestamp

Result

---

# 24. Ví dụ Audit Log

Actor:

Student

Action:

REGISTRATION_SUBMITTED

Registration:

REG-2026-000001

Previous Status:

DRAFT

New Status:

SUBMITTED

is_late:

false

Result:

SUCCESS

---

# 25. State Machine

State chính:

DRAFT
  ↓
SUBMITTED

Không tạo State:

LATE

Thay vào đó:

SUBMITTED
is_late = true

---

# 26. Business Constraints

### BR-SUBMIT-01

Chỉ Student sở hữu
Registration mới được
Submit.

### BR-SUBMIT-02

Registration phải ở
DRAFT trước khi Submit.

### BR-SUBMIT-03

Required Fields phải
được hoàn thiện.

### BR-SUBMIT-04

Required Documents phải
được cung cấp nếu nghiệp
vụ yêu cầu.

### BR-SUBMIT-05

Dữ liệu phải vượt qua
validation.

### BR-SUBMIT-06

Deadline phải được kiểm
tra tại thời điểm Submit.

### BR-SUBMIT-07

Nộp trễ được biểu diễn
bằng is_late.

### BR-SUBMIT-08

Không tạo State LATE.

### BR-SUBMIT-09

Submit thành công chuyển
Registration:

DRAFT → SUBMITTED

### BR-SUBMIT-10

Không cho phép Submit
trùng cùng một Registration.

### BR-SUBMIT-11

Concurrent Submit phải
được xử lý an toàn.

### BR-SUBMIT-12

Submit phải được xử lý
nhất quán bằng transaction
phù hợp.

### BR-SUBMIT-13

Submit thành công phải
có khả năng truy vết
qua Audit Log.

### BR-SUBMIT-14

Student không được
chỉnh sửa DRAFT sau khi
Registration đã SUBMITTED.

---

# 27. Postconditions

Nếu thành công:

Registration:

DRAFT
  ↓
SUBMITTED

Các thông tin được ghi:

Submitted At

Submitted By

is_late

Audit Log được tạo.

Notification được tạo
theo cơ chế của hệ thống.

---

# 28. Acceptance Criteria

### AC01

Student có thể Submit
Registration của mình.

### AC02

System kiểm tra quyền
sở hữu hồ sơ.

### AC03

System chỉ cho phép
Submit Registration
đang DRAFT.

### AC04

System kiểm tra Required
Fields.

### AC05

System kiểm tra Required
Documents.

### AC06

System kiểm tra deadline.

### AC07

Hồ sơ đúng hạn có:

is_late = false

### AC08

Hồ sơ nộp trễ có:

is_late = true

### AC09

Nộp trễ không tạo
Registration State mới.

### AC10

Submit thành công chuyển:

DRAFT → SUBMITTED

### AC11

Submit trùng không tạo
Submission thứ hai.

### AC12

Concurrent Submit được
xử lý an toàn.

### AC13

Submit thành công được
ghi Audit Log.

### AC14

Student không thể tiếp
tục Edit DRAFT sau Submit.

### AC15

Database Error không
được tạo trạng thái
không nhất quán.

### AC16

Notification Error không
làm mất kết quả Submit
đã thành công.

---

# 29. Traceability

Business Overview
       ↓
Business Rules
       ↓
Business Flow
       ↓
Functional Requirements
       ↓
UC-REG-05
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

---

# 30. Related Use Cases

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

        ↓

UC-OFF-01
Xem hồ sơ chờ tiếp nhận

        ↓

UC-OFF-02
Tiếp nhận hồ sơ

---

# 31. Status

Use Case ID:

UC-REG-05

Version:

1.0

Status:

Draft

Previous:

UC-REG-04 — Upload tài liệu

Next:

UC-REG-06 — Theo dõi hồ sơ