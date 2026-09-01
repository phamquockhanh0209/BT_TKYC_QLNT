# UC-REG-06 — THEO DÕI HỒ SƠ

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-REG-06 |
| Tên Use Case | Theo dõi hồ sơ |
| Actor chính | Student |
| Actor phụ | System |
| Nhóm | Student Registration |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép sinh viên
theo dõi tình trạng xử lý
hồ sơ ngoại trú của mình.

Sinh viên có thể xem:

- Trạng thái hiện tại.
- Thời gian cập nhật.
- Tiến trình xử lý.
- Yêu cầu bổ sung.
- Lý do từ chối nếu có.
- Thông tin liên quan đến
  hồ sơ.
- Lịch sử thay đổi trạng thái.

Sinh viên chỉ được theo dõi
hồ sơ thuộc quyền sở hữu
của mình.

---

# 3. Preconditions

1. Student đã đăng nhập.

2. Session còn hiệu lực.

3. Registration tồn tại.

4. Registration thuộc
   Student đang đăng nhập.

---

# 4. Trigger

Student chọn:

Hồ sơ ngoại trú

Sau đó chọn:

Theo dõi hồ sơ

---

# 5. Main Flow

## Bước 1

Student mở danh sách
hồ sơ ngoại trú.

## Bước 2

System lấy các Registration
thuộc Student hiện tại.

## Bước 3

Student chọn một hồ sơ.

## Bước 4

System kiểm tra quyền
truy cập.

## Bước 5

System lấy trạng thái
hiện tại của Registration.

## Bước 6

System lấy thông tin
tiến trình xử lý.

## Bước 7

System lấy lịch sử
trạng thái nếu Student
được phép xem.

## Bước 8

System kiểm tra xem hồ sơ
có yêu cầu bổ sung hay
không.

## Bước 9

Nếu có yêu cầu bổ sung,
System hiển thị nội dung
yêu cầu.

## Bước 10

Nếu hồ sơ bị từ chối,
System hiển thị lý do
từ chối theo phạm vi
được phép công khai
cho Student.

## Bước 11

System hiển thị thông tin
theo dõi hồ sơ.

---

# 6. Thông tin hiển thị

Student có thể xem:

```text
Registration ID
Trạng thái
Ngày tạo
Ngày Submit
Ngày cập nhật gần nhất
is_late
Tiến trình xử lý
Yêu cầu bổ sung
Lý do từ chối
Thông báo liên quan

Các trường thực tế phải
phù hợp với Functional
Requirements.

7. Registration State

System sử dụng State Machine
của Registration.

Ví dụ:

DRAFT
  ↓
SUBMITTED
  ↓
UNDER_REVIEW
  ↓
ACTIVE

Các nhánh khác:

UNDER_REVIEW
      ↓
NEED_MORE_INFO
      ↓
UNDER_REVIEW

hoặc:

UNDER_REVIEW
      ↓
REJECTED
8. Không tạo State mới

Theo dõi hồ sơ không tạo
ra State mới.

Ví dụ:

SUBMITTED

vẫn là:

SUBMITTED

Không tạo:

TRACKING

hoặc:

VIEWING
9. Hiển thị hồ sơ nộp trễ

Nếu:

Status = SUBMITTED
is_late = true

System hiển thị hồ sơ
được ghi nhận là:

Nộp trễ

is_late là flag nghiệp vụ,
không phải State.

10. Timeline

System có thể hiển thị
Timeline xử lý:

Created
   ↓
Submitted
   ↓
Received
   ↓
Under Review
   ↓
Approved
   ↓
Active

Nếu cần bổ sung:

Under Review
   ↓
Need More Info
   ↓
Student Submitted Additional Info
   ↓
Under Review

Timeline phải phản ánh
các sự kiện thực tế
được ghi nhận trong hệ thống.

11. NEED_MORE_INFO

Nếu hồ sơ ở:

NEED_MORE_INFO

System phải hiển thị:

Nội dung cần bổ sung.
Tài liệu cần bổ sung.
Thời hạn bổ sung nếu có.
Thời điểm yêu cầu.
Trạng thái yêu cầu.

Student có thể chuyển
sang Use Case:

UC-REG-08 — Bổ sung hồ sơ
12. Không tự động chuyển
State khi xem hồ sơ

Việc Student mở trang
theo dõi không được
làm thay đổi:

Registration Status

Ví dụ:

UNDER_REVIEW
   ↓
Student views
   ↓
UNDER_REVIEW
13. ACTIVE

Nếu Registration:

ACTIVE

System hiển thị:

Hồ sơ ngoại trú đang
có hiệu lực.

Đồng thời có thể hiển thị
các thông tin liên quan
đến thời hạn hiệu lực.

14. EXPIRED

Nếu Registration:

EXPIRED

System hiển thị:

Hồ sơ đã hết hiệu lực.

Việc xử lý gia hạn muộn
hay đăng ký mới không
được thực hiện trực tiếp
trong Use Case theo dõi.

Student phải sử dụng
Request phù hợp theo
Business Rules.

15. REJECTED

Nếu:

Status = REJECTED

System hiển thị:

Hồ sơ bị từ chối.

Nếu nghiệp vụ yêu cầu
ghi lý do từ chối:

System hiển thị lý do
được cán bộ ghi nhận.

Không cho phép Student
thay đổi quyết định
REJECTED.

16. Rút hồ sơ

Nếu hồ sơ đang ở trạng
thái cho phép rút:

Student có thể chuyển sang:

UC-REG-07
Rút hồ sơ

Không thực hiện việc
rút trực tiếp trong
Use Case này.

17. Request đang mở

Registration có thể có
Request phát sinh.

Ví dụ:

Registration
      │
      ├── Renewal Request
      ├── Change Address Request
      └── Termination Request

Student có thể xem
Request liên quan nếu
được phép.

18. Quy tắc Request đang mở

Tại một thời điểm,
một Registration chỉ được
có tối đa một Request
đang:

PENDING

Ví dụ:

Registration
      ↓
Renewal Request
      ↓
PENDING

thì không được đồng thời
tạo một Request PENDING
khác nếu Business Rule
không cho phép.

19. Thông tin Request

Nếu có Request:

System có thể hiển thị:

Request ID
Request Type
Created At
Status
Last Updated At

Ví dụ:

Request Type:
RENEWAL

Status:
PENDING
20. Alternative Flow
A1 — Không có hồ sơ

Nếu Student chưa có
Registration:

System hiển thị:

Bạn chưa có hồ sơ
ngoại trú.

Có thể cung cấp
chức năng:

Tạo hồ sơ
A2 — Hồ sơ DRAFT

Nếu:

Status = DRAFT

System hiển thị:

Hồ sơ đang được hoàn thiện.

Student có thể chuyển
sang:

UC-REG-03
Chỉnh sửa DRAFT

hoặc:

UC-REG-04
Upload tài liệu
A3 — Hồ sơ SUBMITTED

System hiển thị:

Đã gửi hồ sơ.
Đang chờ tiếp nhận.
A4 — Hồ sơ UNDER_REVIEW

System hiển thị:

Hồ sơ đang được cán bộ
kiểm tra và xử lý.
A5 — Hồ sơ NEED_MORE_INFO

System hiển thị rõ
nội dung cần bổ sung.

Student có thể chọn:

Bổ sung hồ sơ

để chuyển sang:

UC-REG-08
A6 — Hồ sơ ACTIVE

System hiển thị
hồ sơ đang có hiệu lực.

Student có thể xem
các Request phù hợp
như gia hạn hoặc
chuyển nơi ở nếu
đáp ứng điều kiện.

A7 — Hồ sơ EXPIRED

System hiển thị
hồ sơ đã hết hiệu lực.

Nếu có cơ chế gia hạn
muộn theo Business Rules,
Student có thể thực hiện
Request phù hợp.

Nếu không có cơ chế
gia hạn muộn, Student
phải thực hiện đăng ký
mới.

21. Exception Flow
E1 — Registration không tồn tại

System thông báo:

Không tìm thấy hồ sơ.
E2 — Không có quyền

Nếu Student cố truy cập
hồ sơ của Student khác:

403 Forbidden

System từ chối truy cập.

E3 — Session hết hạn

System yêu cầu
đăng nhập lại.

E4 — Không tải được
dữ liệu

Nếu Database hoặc Service
không phản hồi:

System hiển thị:

Không thể tải thông tin
hồ sơ.
Vui lòng thử lại sau.
E5 — Dữ liệu trạng thái
không hợp lệ

Nếu Registration chứa
State không nằm trong
State Machine:

System không tự ý sửa
State.

System ghi Error Log
và báo lỗi cho bộ phận
quản trị/kỹ thuật.

22. Security

Student chỉ được:

Student
   ↓
Own Registration
   ↓
View

Không được:

Student
   ↓
Other Student Registration
   ✗

Student không được:

Thay đổi trạng thái.
Xóa Audit Log.
Thay đổi quyết định
của cán bộ.
Thay đổi lý do từ chối.
Thay đổi dữ liệu xử lý
của cán bộ.
23. Data Scope

Dữ liệu hiển thị phải
tuân thủ:

Actor
  ↓
Role
  ↓
Permission
  ↓
Data Scope

Student chỉ có Data Scope
đối với hồ sơ của mình.

24. Audit Log

Việc Student xem hồ sơ
có thể được ghi nhận
trong Access Log nếu
chính sách bảo mật
yêu cầu.

Các thay đổi trạng thái
không được tạo bởi
Use Case này.

Các sự kiện nghiệp vụ
phải được ghi bởi Use Case
thực hiện sự kiện đó.

25. Notification

Nếu có Notification
chưa đọc liên quan đến
hồ sơ:

System có thể hiển thị
trên trang theo dõi.

Ví dụ:

Có yêu cầu bổ sung
tài liệu mới.

hoặc:

Hồ sơ đã được phê duyệt.
26. Business Constraints
BR-TRACK-01

Student chỉ được theo dõi
Registration của mình.

BR-TRACK-02

Theo dõi hồ sơ không
thay đổi Registration State.

BR-TRACK-03

System phải hiển thị
State hiện tại của
Registration.

BR-TRACK-04

Timeline phải phản ánh
các sự kiện đã được
ghi nhận.

BR-TRACK-05

Nộp trễ được thể hiện
bằng is_late.

BR-TRACK-06

is_late không phải
Registration State.

BR-TRACK-07

NEED_MORE_INFO phải
hiển thị nội dung cần
bổ sung nếu Student
được phép xem.

BR-TRACK-08

REJECTED phải hiển thị
lý do từ chối nếu nghiệp
vụ yêu cầu.

BR-TRACK-09

Student không được
thay đổi State thông qua
Use Case này.

BR-TRACK-10

Student không được
thay đổi Audit Log.

BR-TRACK-11

Request phát sinh được
quản lý độc lập với
Registration State.

BR-TRACK-12

Một Registration chỉ có
tối đa một Request PENDING
tại cùng một thời điểm,
trừ khi Business Rules
quy định ngoại lệ.

27. Postconditions

Sau khi Student xem
hồ sơ:

Registration
     ↓
State không thay đổi

Student nhận được
thông tin trạng thái
và tiến trình hiện tại.

Nếu có:

NEED_MORE_INFO

Student biết được
nội dung cần bổ sung.

Nếu:

REJECTED

Student có thể xem
lý do từ chối theo
quy định.

28. Acceptance Criteria
AC01

Student xem được
danh sách hồ sơ
của mình.

AC02

Student xem được
trạng thái hiện tại.

AC03

Student không xem
được hồ sơ của
Student khác.

AC04

System hiển thị đúng
State Machine.

AC05

System hiển thị
is_late nếu hồ sơ
nộp trễ.

AC06

is_late không được
hiển thị như một State
độc lập.

AC07

System hiển thị
Timeline xử lý.

AC08

System hiển thị yêu cầu
bổ sung khi hồ sơ
NEED_MORE_INFO.

AC09

System hiển thị lý do
từ chối khi có.

AC10

Việc xem hồ sơ không
làm thay đổi State.

AC11

Student không thể
thay đổi State.

AC12

Student có thể chuyển
sang Use Case Bổ sung
khi cần.

AC13

Request liên quan được
hiển thị theo quyền.

AC14

Một Registration không
được có nhiều Request
PENDING đồng thời nếu
Business Rules không
cho phép.

29. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-REG-06
↓
Activity Diagram
↓
Sequence Diagram
↓
API
↓
Registration Module
↓
Frontend Tracking Page
↓
Implementation

30. Related Use Cases

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

UC-REG-06
Theo dõi hồ sơ

    ├──→ UC-REG-07
    │     Rút hồ sơ
    │
    ├──→ UC-REG-08
    │     Bổ sung hồ sơ
    │
    ├──→ UC-REQ-01
    │     Yêu cầu gia hạn
    │
    ├──→ UC-REQ-02
    │     Yêu cầu chuyển nơi ở
    │
    └──→ UC-REQ-03
          Yêu cầu kết thúc
31. Status

Use Case ID:

UC-REG-06

Version:

1.0

Status:

Draft

Previous:

UC-REG-05 — Gửi hồ sơ

Next:

UC-REG-07 — Rút hồ sơ