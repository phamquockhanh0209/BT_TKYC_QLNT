# UC-REG-08 — BỔ SUNG HỒ SƠ

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-REG-08 |
| Tên Use Case | Bổ sung hồ sơ |
| Actor chính | Student |
| Actor phụ | System |
| Nhóm | Student Registration |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép sinh viên
bổ sung thông tin hoặc tài liệu
theo yêu cầu của cán bộ xử lý.

Use Case được thực hiện khi
hồ sơ cần bổ sung thông tin
hoặc tài liệu để tiếp tục
quy trình xử lý.

Sau khi sinh viên bổ sung
đầy đủ và gửi lại:

NEED_MORE_INFO
      ↓
UNDER_REVIEW

---

# 3. Preconditions

1. Student đã đăng nhập.

2. Session còn hiệu lực.

3. Registration tồn tại.

4. Registration thuộc
   Student đang đăng nhập.

5. Registration đang ở
   trạng thái cho phép
   bổ sung.

6. Hệ thống đã ghi nhận
   yêu cầu bổ sung nếu
   nghiệp vụ yêu cầu.

---

# 4. Trigger

Student nhận được yêu cầu
bổ sung hồ sơ.

Student chọn:

```text
Bổ sung hồ sơ
5. Main Flow
Bước 1

Student mở danh sách
hồ sơ ngoại trú.

Bước 2

Student chọn Registration
cần bổ sung.

Bước 3

System kiểm tra quyền
truy cập Registration.

Bước 4

System kiểm tra trạng thái
hiện tại.

Bước 5

System lấy thông tin
yêu cầu bổ sung.

Bước 6

System hiển thị:

Nội dung cần bổ sung.
Trường thông tin cần sửa.
Tài liệu cần bổ sung.
Lý do yêu cầu bổ sung.
Thời hạn bổ sung nếu có.
Bước 7

Student cập nhật
thông tin được yêu cầu.

Bước 8

Student upload tài liệu
bổ sung nếu cần.

Bước 9

System kiểm tra dữ liệu
được bổ sung.

Bước 10

System kiểm tra tài liệu
được bổ sung.

Bước 11

Student chọn:

Gửi bổ sung
Bước 12

System kiểm tra lại
toàn bộ điều kiện.

Bước 13

System ghi nhận việc
Student đã bổ sung.

Bước 14

Registration chuyển:

NEED_MORE_INFO
↓
UNDER_REVIEW

nếu tất cả điều kiện
nghiệp vụ được đáp ứng.

Bước 15

System tạo Audit Log.

Bước 16

System tạo Notification
cho cán bộ xử lý.

Bước 17

System thông báo:

Thông tin bổ sung đã
được gửi thành công.
Hồ sơ đang được tiếp tục
xử lý.
6. Kiểm tra quyền sở hữu

System phải kiểm tra:

Logged-in Student ID
        ↓
Registration Student ID

Hai giá trị phải giống nhau.

Nếu không:

Access Denied

Student không được phép
bổ sung hồ sơ của
Student khác.

7. Kiểm tra trạng thái

System phải kiểm tra
Registration State.

Trạng thái dự kiến:

NEED_MORE_INFO

chỉ khi State Machine
cho phép Student bổ sung
ở trạng thái đó.

Không được tự ý cho phép
bổ sung ở mọi trạng thái.

8. Nội dung yêu cầu bổ sung

Yêu cầu bổ sung có thể
bao gồm:

Request ID
Registration ID
Reason
Required Information
Required Documents
Created At
Due Date
Created By
Status
9. Bổ sung thông tin

Student chỉ được chỉnh sửa
những thông tin mà
nghiệp vụ cho phép.

Ví dụ:

Thông tin địa chỉ
Thông tin nơi ở
Thông tin chủ trọ

Không được tự ý thay đổi
các dữ liệu hệ thống
không thuộc phạm vi
bổ sung.

10. Bổ sung tài liệu

Nếu cán bộ yêu cầu
tài liệu:

Student sử dụng chức năng
Upload Document.

Ví dụ:

Required Document
       ↓
Student Upload
       ↓
System Validate
       ↓
Document Version

Tài liệu mới phải được
quản lý theo cơ chế
Document Version của
hệ thống.

11. Kiểm tra tài liệu

System kiểm tra các
điều kiện liên quan:

Đúng loại tài liệu.
Đúng định dạng.
Không vượt quá giới hạn
hệ thống.
Có thể đọc được.
Không bị lỗi upload.
Phù hợp với yêu cầu
bổ sung.

Các giới hạn cụ thể phải
phù hợp với Non-Functional
Requirements và cấu hình
hệ thống.

12. Validation

System thực hiện:

Input
 ↓
Validation
 ↓
Business Rules
 ↓
Accept / Reject

Nếu dữ liệu không hợp lệ:

System không cho gửi
bổ sung thành công.

13. Required Information

System phải xác định
các trường cần bổ sung.

Ví dụ:

Field A
Field B
Field C

Student phải hoàn thiện
các trường bắt buộc.

14. Required Documents

System xác định các
tài liệu được yêu cầu.

Ví dụ:

Document A
Document B

Nếu thiếu tài liệu
bắt buộc:

System không hoàn tất
việc gửi bổ sung.

15. Main Transaction

Thao tác gửi bổ sung
phải được xử lý nhất quán.

Ví dụ:

BEGIN TRANSACTION

    Validate Student

    Validate Registration

    Validate State

    Validate Additional Data

    Validate Documents

    Update Registration Data

    Update Additional Request

    Update Registration State

    Create Audit Log

    Create Notification

COMMIT

Nếu xảy ra lỗi:

ROLLBACK
16. State Transition

Khi bổ sung hợp lệ:

NEED_MORE_INFO
      ↓
UNDER_REVIEW

Không chuyển trực tiếp:

NEED_MORE_INFO
      ↓
ACTIVE

hoặc:

NEED_MORE_INFO
      ↓
APPROVED

Việc phê duyệt vẫn phải
được thực hiện bởi
Approver theo Use Case
phù hợp.

17. Không tự động phê duyệt

Student chỉ có thể:

Bổ sung
   ↓
Gửi lại
   ↓
UNDER_REVIEW

Student không thể:

Bổ sung
   ↓
ACTIVE

Việc phê duyệt thuộc
Approver.

18. Deadline bổ sung

Nếu yêu cầu bổ sung
có Deadline:

System lưu:

Due Date

và kiểm tra:

Current Time
      ↓
Due Date

Nếu quá hạn, System xử lý
theo Business Rules.

Không tự ý tạo State mới
nếu Business Rules không
định nghĩa.

19. Bổ sung đúng hạn

Nếu:

Submitted Additional Info
<= Due Date

System ghi nhận việc
bổ sung đúng hạn.

20. Bổ sung trễ

Nếu:

Submitted Additional Info
> Due Date

System phải xử lý theo
Business Rules.

Nếu nghiệp vụ sử dụng
Flag để đánh dấu:

is_late = true

Không tạo State mới chỉ
để biểu diễn việc bổ sung
trễ nếu State Machine
không quy định.

21. Alternative Flow
A1 — Student lưu nháp

Nếu hệ thống cho phép
lưu tiến trình bổ sung:

Student có thể:

Lưu nháp

và tiếp tục bổ sung
sau.

Registration vẫn giữ
trạng thái phù hợp theo
Business Rules.

A2 — Student bổ sung
chưa đầy đủ

Nếu còn thiếu thông tin
hoặc tài liệu:

System hiển thị:

Hồ sơ bổ sung chưa đầy đủ.
Vui lòng hoàn thiện các
nội dung được yêu cầu.

Không chuyển sang:

UNDER_REVIEW
A3 — Upload thêm tài liệu

Student chọn:

Upload Document

System lưu Document
Version mới theo quy định.

A4 — Bổ sung nhiều lần

Nếu cán bộ tiếp tục yêu
cầu bổ sung sau lần kiểm
tra tiếp theo:

UNDER_REVIEW
      ↓
NEED_MORE_INFO
      ↓
Student bổ sung
      ↓
UNDER_REVIEW

Quy trình có thể lặp lại
nếu Business Rules cho phép.

22. Exception Flow
E1 — Registration không tồn tại

System thông báo:

Không tìm thấy hồ sơ.

Không thực hiện bổ sung.

E2 — Không có quyền

Nếu Registration không
thuộc Student:

403 Forbidden

System từ chối.

E3 — State không cho phép

Nếu Registration không
ở trạng thái cho phép
bổ sung:

System thông báo:

Hồ sơ hiện không yêu cầu
bổ sung.
E4 — Request bổ sung
không tồn tại

Nếu Registration ở
NEED_MORE_INFO nhưng
không tìm thấy yêu cầu
bổ sung hợp lệ:

System ghi nhận lỗi
dữ liệu và không cho
Student gửi bổ sung.

E5 — File không hợp lệ

Nếu tài liệu không đáp
ứng điều kiện:

System thông báo:

Tài liệu không hợp lệ.
Vui lòng kiểm tra và
upload lại.
E6 — Database Error

Nếu Database xảy ra lỗi:

ROLLBACK

Không tạo trạng thái
không nhất quán.

E7 — Concurrent Update

Nếu hồ sơ bị cán bộ
thay đổi trong lúc
Student đang bổ sung:

System phải kiểm tra lại
State trước khi Commit.

Nếu State không còn
phù hợp:

System từ chối thao tác
và yêu cầu Student
tải lại thông tin mới nhất.

E8 — Notification Error

Nếu bổ sung thành công
nhưng Notification
không gửi được:

Dữ liệu nghiệp vụ vẫn
được giữ theo kết quả
transaction.

System ghi nhận lỗi
Notification để xử lý
theo cơ chế retry.

23. Audit Log

System ghi nhận sự kiện:

ADDITIONAL_INFO_SUBMITTED

Thông tin có thể gồm:

Actor ID
Actor Type
Registration ID
Request ID
Previous Status
New Status
Submitted At
Result
Timestamp
24. Ví dụ Audit Log
Actor:
Student

Action:
ADDITIONAL_INFO_SUBMITTED

Registration:
REG-2026-000001

Request:
REQ-2026-000015

Previous Status:
NEED_MORE_INFO

New Status:
UNDER_REVIEW

Result:
SUCCESS
25. Notification

Sau khi Student gửi
bổ sung thành công:

Student nhận:

Thông tin bổ sung đã
được gửi thành công.

Processing Officer có thể
nhận:

Hồ sơ đã được sinh viên
bổ sung và chờ tiếp tục
xử lý.
26. Security

Student chỉ được:

Student
   ↓
Own Registration
   ↓
Provide Additional Info

Không được:

Student
   ↓
Other Student Registration
   ✗

Student không được:

Phê duyệt hồ sơ.
Từ chối hồ sơ.
Thay đổi quyết định
của cán bộ.
Sửa Audit Log.
Tự thay đổi Registration
State.
27. Data Scope

Student chỉ có quyền
đối với:

Own Registration

System phải kiểm tra:

Actor
  ↓
Role
  ↓
Permission
  ↓
Data Scope
28. Business Constraints
BR-ADD-01

Student chỉ được bổ sung
Registration thuộc mình.

BR-ADD-02

Registration phải ở
State cho phép bổ sung.

BR-ADD-03

Student chỉ được bổ sung
nội dung thuộc yêu cầu
của hệ thống.

BR-ADD-04

Required Information phải
được hoàn thiện.

BR-ADD-05

Required Documents phải
được cung cấp nếu được
yêu cầu.

BR-ADD-06

Document phải tuân thủ
quy tắc quản lý tài liệu.

BR-ADD-07

Bổ sung thành công phải
được ghi Audit Log.

BR-ADD-08

State sau khi gửi bổ sung
phải tuân thủ State Machine.

BR-ADD-09

Student không được tự
phê duyệt hồ sơ.

BR-ADD-10

Student không được tự
thay đổi Registration State.

BR-ADD-11

Concurrent Update phải
được xử lý an toàn.

BR-ADD-12

Nếu có Deadline bổ sung,
System phải kiểm tra
thời hạn theo Business
Rules.

BR-ADD-13

Không tự ý tạo State mới
chỉ để biểu diễn việc
bổ sung trễ.

29. Postconditions

Nếu bổ sung thành công:

NEED_MORE_INFO
      ↓
UNDER_REVIEW

Thông tin bổ sung
được lưu.

Tài liệu bổ sung
được lưu.

Audit Log được tạo.

Notification được tạo
theo quy định.

Hồ sơ quay trở lại
quy trình xử lý.

30. Acceptance Criteria
AC01

Student có thể xem
yêu cầu bổ sung.

AC02

Student chỉ bổ sung
được hồ sơ của mình.

AC03

System kiểm tra State
trước khi bổ sung.

AC04

System hiển thị rõ
nội dung cần bổ sung.

AC05

System kiểm tra
Required Information.

AC06

System kiểm tra
Required Documents.

AC07

System kiểm tra tài liệu
upload.

AC08

System kiểm tra Deadline
nếu có.

AC09

Student có thể gửi
thông tin bổ sung hợp lệ.

AC10

Bổ sung thành công
chuyển:

NEED_MORE_INFO
↓
UNDER_REVIEW

AC11

Không tự động chuyển
sang ACTIVE.

AC12

Student không thể
tự phê duyệt.

AC13

Bổ sung được ghi
Audit Log.

AC14

Concurrent Update
được xử lý an toàn.

AC15

Database Error không
tạo trạng thái
không nhất quán.

AC16

Student không thể
bổ sung hồ sơ của
Student khác.

31. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-REG-08
↓
Activity Diagram
↓
Sequence Diagram
↓
API
↓
Registration Module
↓
Frontend
↓
Database
↓
Implementation

32. Related Use Cases

UC-REG-06
Theo dõi hồ sơ

    ↓

UC-REG-08
Bổ sung hồ sơ

    ↓

UC-OFF-03
Kiểm tra hồ sơ

    ↓

UC-OFF-05
Yêu cầu bổ sung

    ↓

UC-APP-01
Phê duyệt hồ sơ

33. Request Relationship

Luồng nghiệp vụ:

Processing Officer
        ↓
Yêu cầu bổ sung
        ↓
NEED_MORE_INFO
        ↓
Student
        ↓
Bổ sung hồ sơ
        ↓
UNDER_REVIEW
        ↓
Processing Officer
        ↓
Kiểm tra lại
34. Status

Use Case ID:

UC-REG-08

Version:

1.0

Status:

Draft

Previous:

UC-REG-07 — Rút hồ sơ

Next:

UC-OFF-01 — Xem hồ sơ chờ tiếp nhận