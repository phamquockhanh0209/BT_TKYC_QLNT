# UC-OFF-06 — THEO DÕI HỒ SƠ XỬ LÝ

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-OFF-06 |
| Tên Use Case | Theo dõi hồ sơ xử lý |
| Actor chính | Processing Officer |
| Actor phụ | System |
| Nhóm | Officer |
| Priority | Medium |

---

# 2. Mục đích

Use Case cho phép Processing Officer
theo dõi các Registration đang được
xử lý trong phạm vi được phân quyền.

Officer có thể xem:

- Danh sách hồ sơ.
- Trạng thái hồ sơ.
- Thời gian xử lý.
- Kết quả kiểm tra.
- Yêu cầu bổ sung.
- Người đang xử lý.
- Lịch sử xử lý.

Use Case này phục vụ việc theo dõi
tiến độ nghiệp vụ và không cho phép
Officer tự ý thay đổi trạng thái
ngoài các quyền được cấp.

---

# 3. Preconditions

1. Processing Officer đã đăng nhập.

2. Session còn hiệu lực.

3. Tài khoản có Role phù hợp.

4. Tài khoản có Permission xem
   hồ sơ xử lý.

5. Officer có Data Scope hợp lệ.

---

# 4. Trigger

Processing Officer truy cập:

```text
Dashboard
    ↓
Hồ sơ đang xử lý

hoặc chọn:

Theo dõi hồ sơ xử lý
5. Main Flow
Bước 1

Processing Officer đăng nhập
vào Website.

Bước 2

Officer mở chức năng:

Theo dõi hồ sơ xử lý
Bước 3

System kiểm tra:

Authentication.
Role.
Permission.
Data Scope.
Bước 4

System lấy danh sách Registration
thuộc phạm vi được phép xem.

Bước 5

System hiển thị danh sách hồ sơ.

Thông tin có thể bao gồm:

Registration ID
Student ID
Student Name
Current State
Submitted At
Received At
Assigned Officer
Updated At
SLA Status
Bước 6

Processing Officer có thể
lọc danh sách hồ sơ.

Ví dụ:

Theo trạng thái
Theo thời gian
Theo mã hồ sơ
Theo sinh viên
Theo người xử lý
Theo SLA

Các bộ lọc thực tế phải
phù hợp với Functional
Requirements.

Bước 7

Officer chọn một Registration.

Bước 8

System hiển thị thông tin
chi tiết trong phạm vi được phép.

Bước 9

Officer xem lịch sử xử lý
của Registration.

Ví dụ:

SUBMITTED
    ↓
RECEIVED
    ↓
UNDER_REVIEW
    ↓
REQUIRE_ADDITIONAL_INFO
    ↓
UNDER_REVIEW
    ↓
PENDING_APPROVAL
Bước 10

Officer sử dụng thông tin
để theo dõi tiến độ xử lý.

6. Theo dõi trạng thái

System hiển thị State hiện tại
của Registration.

Ví dụ:

DRAFT
SUBMITTED
RECEIVED
UNDER_REVIEW
REQUIRE_ADDITIONAL_INFO
PENDING_APPROVAL
ACTIVE
REJECTED
WITHDRAWN
EXPIRED

Chỉ sử dụng các State thực tế
được định nghĩa trong State
Machine của hệ thống.

7. Theo dõi SLA

Nếu hệ thống có SLA:

System có thể hiển thị:

SLA Status
Due Date
Elapsed Time
Remaining Time

Ví dụ:

ON_TIME
WARNING
OVERDUE

Officer không được tự ý
thay đổi SLA.

8. Xem lịch sử xử lý

Officer có thể xem lịch sử
các sự kiện của Registration
trong phạm vi được phép.

Ví dụ:

Event
Actor
Timestamp
Previous State
New State

Lịch sử phải phản ánh dữ liệu
được ghi nhận trong Audit Log
hoặc Processing History theo
thiết kế hệ thống.

9. Alternative Flow
A1 — Không có hồ sơ

Nếu không có Registration
phù hợp:

System hiển thị:

Không có hồ sơ cần hiển thị.
A2 — Lọc theo trạng thái

Officer chọn một State.

System chỉ hiển thị hồ sơ
phù hợp với State đó.

A3 — Lọc theo thời gian

Officer chọn khoảng thời gian.

System trả về các hồ sơ
phù hợp.

A4 — Tìm kiếm hồ sơ

Officer nhập:

Registration ID

hoặc thông tin được phép
tìm kiếm.

System trả về kết quả
trong Data Scope.

A5 — Xem chi tiết

Officer chọn Registration
từ danh sách.

System hiển thị chi tiết
hồ sơ.

10. Exception Flow
E1 — Không có Permission

System từ chối truy cập.

403 Forbidden
E2 — Ngoài Data Scope

System không hiển thị hồ sơ
ngoài phạm vi được phép.

E3 — Registration không tồn tại

System thông báo:

Không tìm thấy hồ sơ.
E4 — Database Error

Nếu không thể lấy dữ liệu:

System hiển thị thông báo lỗi.

Không hiển thị dữ liệu
không đầy đủ như dữ liệu
chính xác.

E5 — Session hết hạn

System yêu cầu Officer
đăng nhập lại.

E6 — Concurrent State Change

Nếu State thay đổi trong lúc
Officer đang xem hồ sơ:

System phải lấy State mới
nhất khi Officer refresh
hoặc thực hiện thao tác tiếp theo.

11. Data Scope

Processing Officer chỉ được
xem các Registration thuộc
phạm vi được phân quyền.

Ví dụ:

Processing Officer
        ↓
Data Scope
        ↓
Registration
        ↓
Student

Không được suy ra quyền
xem toàn bộ dữ liệu chỉ vì
có Role Processing Officer.

12. Phân biệt Tracking và Processing

Theo dõi hồ sơ:

Xem
↓
Lọc
↓
Tìm kiếm
↓
Theo dõi trạng thái
↓
Xem lịch sử

Không đồng nghĩa với:

Approve
Reject
Change Permission
Edit Audit Log

Các hành động này phải được
thực hiện bởi Use Case và
Permission tương ứng.

13. Audit Log

Việc xem dữ liệu có thể được
Audit tùy theo yêu cầu
của hệ thống.

Các thao tác làm thay đổi
dữ liệu phải được Audit
theo quy định.

Ví dụ:

REGISTRATION_VIEWED

hoặc:

REGISTRATION_STATUS_VIEWED

Thông tin có thể gồm:

Actor ID
Registration ID
Action
Timestamp
14. Security

Processing Officer:

Được phép:

Xem hồ sơ thuộc Data Scope.
Xem trạng thái.
Xem lịch sử xử lý.
Lọc và tìm kiếm dữ liệu
được phép.

Không mặc nhiên được:

Xem hồ sơ ngoài Data Scope.
Phê duyệt hồ sơ.
Từ chối hồ sơ.
Sửa Audit Log.
Quản lý User.
Quản lý Role.
Quản lý Permission.
15. Performance

Khi danh sách có số lượng
hồ sơ lớn, System nên hỗ trợ:

Pagination.
Filtering.
Sorting.
Search.

Mục tiêu là tránh tải toàn bộ
dữ liệu không cần thiết.

Các yêu cầu hiệu năng cụ thể
phải tuân thủ Non-Functional
Requirements.

16. Business Constraints
BR-TRACK-01

Chỉ Officer có Permission
phù hợp mới được theo dõi
hồ sơ.

BR-TRACK-02

Officer chỉ được xem hồ sơ
trong Data Scope.

BR-TRACK-03

Thông tin hiển thị phải
tuân thủ quyền truy cập.

BR-TRACK-04

State hiển thị phải là
State mới nhất của hồ sơ.

BR-TRACK-05

Lịch sử xử lý không được
bị chỉnh sửa thông qua
Use Case này.

BR-TRACK-06

Theo dõi hồ sơ không đồng
nghĩa với quyền phê duyệt.

BR-TRACK-07

Theo dõi hồ sơ không đồng
nghĩa với quyền từ chối.

BR-TRACK-08

SLA chỉ được hiển thị và
tính toán theo Configuration
và Business Rules.

BR-TRACK-09

Các thao tác truy cập dữ liệu
phải tuân thủ Security Rules.

17. Postconditions

Nếu thành công:

Processing Officer
        ↓
Danh sách hồ sơ
        ↓
Xem trạng thái
        ↓
Xem tiến độ
        ↓
Xem lịch sử

Không có thay đổi nghiệp vụ
đối với Registration chỉ vì
Officer thực hiện Use Case này.

18. Acceptance Criteria
AC01

Officer có thể mở danh sách
hồ sơ đang xử lý.

AC02

System kiểm tra Authentication.

AC03

System kiểm tra Permission.

AC04

System kiểm tra Data Scope.

AC05

System chỉ hiển thị hồ sơ
được phép xem.

AC06

Officer có thể xem State.

AC07

Officer có thể tìm kiếm
hồ sơ.

AC08

Officer có thể lọc hồ sơ.

AC09

Officer có thể xem chi tiết
hồ sơ.

AC10

Officer có thể xem lịch sử
xử lý.

AC11

System hiển thị State mới
nhất.

AC12

Officer không thể phê duyệt
hồ sơ thông qua Use Case này.

AC13

Officer không thể xem hồ sơ
ngoài Data Scope.

AC14

System xử lý Session hết hạn.

AC15

System xử lý Concurrent
State Change.

19. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-OFF-06
↓
Activity Diagram
↓
Sequence Diagram
↓
API
↓
Officer Dashboard
↓
Frontend
↓
Database
↓
Implementation

20. Related Use Cases
UC-OFF-01
Xem hồ sơ chờ tiếp nhận
        ↓
UC-OFF-02
Tiếp nhận hồ sơ
        ↓
UC-OFF-03
Kiểm tra hồ sơ
        ↓
UC-OFF-04
Kiểm tra tài liệu
        ↓
UC-OFF-05
Yêu cầu bổ sung
        ↓
UC-OFF-06
Theo dõi hồ sơ xử lý
        ↓
UC-APP-01
Phê duyệt hồ sơ
21. Relationship với các Actor
Processing Officer
        ↓
Theo dõi hồ sơ
        ↓
System
        ↓
Registration
        ↓
State
        ↓
Processing History
        ↓
SLA

Processing Officer có nhiệm
vụ theo dõi tiến độ xử lý
nhưng không mặc nhiên có
quyền đưa ra quyết định
phê duyệt cuối cùng.

22. Status

Use Case ID:

UC-OFF-06

Version:

1.0

Status:

Draft

Previous:

UC-OFF-05 — Yêu cầu bổ sung

Next:

UC-APP-01 — Phê duyệt hồ sơ