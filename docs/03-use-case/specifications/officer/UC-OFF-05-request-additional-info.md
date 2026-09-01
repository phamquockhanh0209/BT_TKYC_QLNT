# UC-OFF-05 — YÊU CẦU BỔ SUNG

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-OFF-05 |
| Tên Use Case | Yêu cầu bổ sung |
| Actor chính | Processing Officer |
| Actor phụ | Student / System |
| Nhóm | Officer |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép Processing Officer
yêu cầu Student bổ sung hoặc cập nhật
thông tin, tài liệu còn thiếu hoặc
chưa đáp ứng yêu cầu nghiệp vụ.

Mục tiêu là giúp hồ sơ có đầy đủ
thông tin cần thiết trước khi tiếp tục
quy trình xử lý.

---

# 3. Preconditions

1. Processing Officer đã đăng nhập.

2. Session còn hiệu lực.

3. Tài khoản có Role phù hợp.

4. Tài khoản có Permission yêu cầu
   bổ sung hồ sơ.

5. Registration tồn tại.

6. Registration thuộc Data Scope
   của Processing Officer.

7. Registration đang ở trạng thái
   cho phép yêu cầu bổ sung.

8. Processing Officer đã xác định
   nội dung cần bổ sung.

---

# 4. Trigger

Processing Officer phát hiện hồ sơ
thiếu thông tin hoặc tài liệu.

Luồng:

```text
Registration
      ↓
Kiểm tra hồ sơ
      ↓
Phát hiện thiếu / chưa hợp lệ
      ↓
Yêu cầu bổ sung
5. Main Flow
Bước 1

Processing Officer mở Registration
cần xử lý.

Bước 2

System kiểm tra:

Authentication.
Role.
Permission.
Data Scope.
Registration State.
Bước 3

Processing Officer xác định
nội dung cần bổ sung.

Có thể bao gồm:

Thông tin cá nhân.
Thông tin nơi ở.
Thông tin liên hệ.
Tài liệu còn thiếu.
Tài liệu không hợp lệ.
Thông tin cần chỉnh sửa.
Bước 4

Processing Officer nhập
nội dung yêu cầu bổ sung.

Bước 5

System kiểm tra nội dung
yêu cầu.

Bước 6

Processing Officer xác nhận
yêu cầu bổ sung.

Bước 7

System tạo Additional Information
Request.

Bước 8

System liên kết Request với
Registration.

Bước 9

System cập nhật trạng thái
Registration theo State Machine.

Ví dụ:

UNDER_REVIEW
      ↓
REQUIRE_ADDITIONAL_INFO
Bước 10

System ghi nhận Processing Officer
đã tạo yêu cầu.

Bước 11

System tạo Audit Log.

Bước 12

System tạo Notification cho Student.

Bước 13

Student có thể xem yêu cầu
bổ sung và thực hiện bổ sung
theo Use Case:

UC-REG-08
Bổ sung hồ sơ
6. Nội dung yêu cầu bổ sung

Một yêu cầu bổ sung có thể
bao gồm:

Request ID
Registration ID
Reason
Required Information
Required Documents
Created By
Created At
Status

Các trường thực tế phải
phù hợp với Data Model và
Functional Requirements.

7. Yêu cầu bổ sung thông tin

Nếu thiếu thông tin:

Registration
      ↓
Missing Information
      ↓
Additional Request
      ↓
Student

Student cập nhật thông tin
theo phạm vi được cho phép.

8. Yêu cầu bổ sung tài liệu

Nếu thiếu hoặc tài liệu
không đáp ứng yêu cầu:

Registration
      ↓
Missing / Invalid Document
      ↓
Additional Request
      ↓
Student
      ↓
Upload / Update Document

Việc upload tài liệu được
thực hiện theo:

UC-REG-04
Upload tài liệu
9. Lý do yêu cầu bổ sung

Processing Officer phải
cung cấp lý do rõ ràng nếu
Business Rules yêu cầu.

Ví dụ:

Thiếu tài liệu bắt buộc.

hoặc:

Thông tin nơi ở chưa đầy đủ.

hoặc:

Tài liệu cần được cập nhật.

Nội dung cụ thể phải phù hợp
với quy định nghiệp vụ.

10. Alternative Flow
A1 — Bổ sung thông tin

Processing Officer chỉ yêu cầu
Student bổ sung thông tin.

System tạo Request và gửi
Notification.

A2 — Bổ sung tài liệu

Processing Officer yêu cầu
Student upload hoặc thay thế
tài liệu.

System tạo Request và gửi
Notification.

A3 — Bổ sung nhiều nội dung

Một Request có thể chứa
nhiều nội dung cần bổ sung
nếu Business Rules cho phép.

Ví dụ:

Request
   │
   ├── Thông tin nơi ở
   ├── Số điện thoại
   └── Tài liệu
A4 — Chỉnh sửa yêu cầu trước
khi xác nhận

Nếu hệ thống hỗ trợ Draft:

Nhập yêu cầu
     ↓
Lưu nháp
     ↓
Chỉnh sửa
     ↓
Xác nhận

Request chưa được gửi cho
Student trước khi được xác nhận.

11. Exception Flow
E1 — Không có Permission

System từ chối thao tác.

403 Forbidden

Không tạo Request.

E2 — Ngoài Data Scope

Nếu Registration không thuộc
phạm vi được phép:

System từ chối thao tác.

Không tiết lộ dữ liệu ngoài
phạm vi.

E3 — Registration không tồn tại

System thông báo:

Không tìm thấy hồ sơ.

Không tạo Request.

E4 — State không hợp lệ

Nếu Registration không ở
State cho phép yêu cầu
bổ sung:

System từ chối thao tác.

E5 — Nội dung yêu cầu không hợp lệ

Nếu nội dung yêu cầu không
đáp ứng điều kiện:

System hiển thị lỗi.

Processing Officer phải
chỉnh sửa trước khi xác nhận.

E6 — Request đang tồn tại

Nếu đã có Request đang xử lý
cho cùng nội dung:

System xử lý theo Business Rules
để tránh tạo Request trùng.

E7 — Không thể gửi Notification

Nếu Notification thất bại:

System vẫn phải đảm bảo
trạng thái Request và dữ liệu
nghiệp vụ được xử lý nhất quán.

Lỗi Notification phải được
ghi nhận để xử lý theo cơ chế
của hệ thống.

E8 — Database Error

Nếu không thể lưu Request:

ROLLBACK

nếu thao tác nằm trong
transaction.

Không được tạo Request
không hoàn chỉnh.

E9 — Concurrent State Change

Nếu Registration bị thay đổi
State bởi Actor khác trước
khi xác nhận:

System kiểm tra State mới nhất.

Nếu State không còn hợp lệ:

Không thể tạo yêu cầu
bổ sung ở trạng thái hiện tại.
12. State Transition

Registration có thể chuyển:

UNDER_REVIEW
      ↓
REQUIRE_ADDITIONAL_INFO

Sau khi Student bổ sung:

REQUIRE_ADDITIONAL_INFO
      ↓
UNDER_REVIEW

Tên State thực tế phải sử dụng
đúng State Machine đã được
định nghĩa trong Business Rules.

13. Request State

Nếu Request có State riêng,
có thể sử dụng mô hình:

CREATED
   ↓
SENT
   ↓
IN_PROGRESS
   ↓
COMPLETED

Tên State thực tế phải
thống nhất với Business Rules.

14. Notification

Sau khi yêu cầu bổ sung
được xác nhận:

System gửi Notification
cho Student.

Notification có thể chứa:

Registration ID
Request ID
Reason
Required Information
Required Documents
Created At

Student có thể mở Notification
để xem chi tiết.

15. Student Response

Student nhận yêu cầu:

Processing Officer
        ↓
Additional Request
        ↓
Student

Student thực hiện:

Xem yêu cầu
     ↓
Bổ sung thông tin
     ↓
Upload tài liệu
     ↓
Gửi bổ sung

Việc xử lý phía Student
được đặc tả trong:

UC-REG-08
Bổ sung hồ sơ
16. Audit Log

System ghi nhận:

ADDITIONAL_INFO_REQUESTED

Thông tin có thể gồm:

Actor ID
Registration ID
Request ID
Request Type
Reason
Created At
Previous State
New State

Audit Log không được chỉnh sửa
bởi Processing Officer.

17. Security

Processing Officer:

Được phép:

Tạo yêu cầu bổ sung
trong Data Scope.
Xem Registration được
phân quyền.
Ghi nhận lý do bổ sung.

Không mặc nhiên được:

Phê duyệt Registration.
Từ chối cuối.
Sửa Audit Log.
Tạo Request cho hồ sơ
ngoài Data Scope.
Thay đổi Permission.
18. Data Integrity

System phải đảm bảo:

Registration
      +
Additional Request
      +
Officer
      +
Reason
      +
Timestamp

được liên kết chính xác.

Không được tạo Request
không có Registration hợp lệ.

19. Business Constraints
BR-REQ-01

Chỉ Processing Officer có
Permission phù hợp mới được
yêu cầu bổ sung.

BR-REQ-02

Officer chỉ được yêu cầu
bổ sung đối với hồ sơ thuộc
Data Scope.

BR-REQ-03

Registration phải ở State
cho phép yêu cầu bổ sung.

BR-REQ-04

Request phải liên kết với
Registration hợp lệ.

BR-REQ-05

Yêu cầu bổ sung phải có
nội dung phù hợp với
Business Rules.

BR-REQ-06

Request phải được ghi nhận
người tạo và thời gian tạo.

BR-REQ-07

Request phải được Audit
theo yêu cầu của hệ thống.

BR-REQ-08

Việc yêu cầu bổ sung không
đồng nghĩa với phê duyệt
hoặc từ chối hồ sơ.

BR-REQ-09

State Transition phải tuân
thủ State Machine.

BR-REQ-10

System phải kiểm soát
Request trùng nếu Business
Rules yêu cầu.

20. Postconditions

Nếu thành công:

Additional Request
       ↓
Created
       ↓
Linked to Registration
       ↓
Notification
       ↓
Student

Registration được chuyển
sang State phù hợp.

Audit Log được tạo.

Student có thể xem yêu cầu
và thực hiện bổ sung.

21. Acceptance Criteria
AC01

Processing Officer có thể
chọn hồ sơ cần yêu cầu
bổ sung.

AC02

System kiểm tra Authentication.

AC03

System kiểm tra Permission.

AC04

System kiểm tra Data Scope.

AC05

System kiểm tra Registration State.

AC06

Officer có thể nhập nội dung
yêu cầu bổ sung.

AC07

System kiểm tra dữ liệu
yêu cầu.

AC08

System tạo Additional Request.

AC09

Request được liên kết đúng
với Registration.

AC10

System cập nhật State đúng
theo State Machine.

AC11

System tạo Audit Log.

AC12

System gửi Notification
cho Student theo Business Rules.

AC13

System không tự động
phê duyệt hồ sơ.

AC14

System không cho phép tạo
Request ngoài Data Scope.

AC15

System xử lý Concurrent
State Change an toàn.

22. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-OFF-05
↓
Activity Diagram
↓
Sequence Diagram
↓
API
↓
Request Module
↓
Frontend
↓
Database
↓
Implementation

23. Related Use Cases
UC-OFF-03
Kiểm tra hồ sơ
       ↓
Phát hiện thiếu thông tin
       ↓
UC-OFF-05
Yêu cầu bổ sung
       ↓
Student
       ↓
UC-REG-08
Bổ sung hồ sơ
       ↓
UC-OFF-03
Kiểm tra lại
       ↓
Approver
24. Relationship với Actor
Processing Officer
        ↓
Xác định thiếu
        ↓
Yêu cầu bổ sung
        ↓
System
        ↓
Notification
        ↓
Student
        ↓
Bổ sung hồ sơ

Trách nhiệm:

Processing Officer
= Xác định và yêu cầu bổ sung

Student
= Thực hiện bổ sung

System
= Quản lý Request + State
  + Notification + Audit
25. Status

Use Case ID:

UC-OFF-05

Version:

1.0

Status:

Draft

Previous:

UC-OFF-04 — Kiểm tra tài liệu

Next:

UC-OFF-06 — Theo dõi hồ sơ xử lý