# UC-OFF-02 — TIẾP NHẬN HỒ SƠ

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-OFF-02 |
| Tên Use Case | Tiếp nhận hồ sơ |
| Actor chính | Reception Officer |
| Actor phụ | System |
| Nhóm | Officer |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép Cán bộ tiếp nhận
thực hiện tiếp nhận một hồ sơ
ngoại trú đã được Student gửi lên
và đang chờ tiếp nhận.

Reception Officer thực hiện kiểm tra
sơ bộ trước khi tiếp nhận.

Sau khi tiếp nhận thành công,
hồ sơ được chuyển sang bước xử lý
nghiệp vụ tiếp theo theo State Machine.

---

# 3. Preconditions

1. Reception Officer đã đăng nhập.

2. Session còn hiệu lực.

3. Tài khoản có Role phù hợp.

4. Tài khoản có Permission tiếp nhận
   hồ sơ.

5. Registration tồn tại.

6. Registration thuộc Data Scope
   mà Reception Officer được phép
   xử lý.

7. Registration đang ở trạng thái
   cho phép tiếp nhận.

---

# 4. Trigger

Reception Officer mở hồ sơ đang
chờ tiếp nhận và chọn:

```text
Tiếp nhận hồ sơ
5. Main Flow
Bước 1

Reception Officer mở danh sách
hồ sơ chờ tiếp nhận.

Bước 2

Reception Officer chọn một
Registration.

Bước 3

System kiểm tra:

Authentication.
Role.
Permission.
Data Scope.
Bước 4

System kiểm tra Registration
có tồn tại hay không.

Bước 5

System kiểm tra State hiện tại
của Registration.

Bước 6

System hiển thị thông tin
cần thiết để Reception Officer
thực hiện kiểm tra sơ bộ.

Ví dụ:

Mã hồ sơ.
MSSV.
Họ tên.
Thông tin đăng ký.
Tài liệu đã cung cấp.
Thời gian gửi.
Trạng thái hiện tại.
Bước 7

Reception Officer thực hiện
kiểm tra sơ bộ.

Các nội dung kiểm tra phải
tuân thủ Business Rules.

Bước 8

Reception Officer xác nhận
tiếp nhận hồ sơ.

Bước 9

System kiểm tra lại State
ngay trước khi cập nhật.

Bước 10

System cập nhật Registration
sang trạng thái tiếp theo
theo State Machine.

Ví dụ:

SUBMITTED
    ↓
UNDER_REVIEW

Chỉ sử dụng State đã được
định nghĩa trong Business Rules.

Bước 11

System ghi nhận thông tin
người tiếp nhận.

Ví dụ:

Received By
Received At
Bước 12

System tạo Audit Log.

Bước 13

System tạo Notification
nếu nghiệp vụ yêu cầu.

Bước 14

System thông báo:

Tiếp nhận hồ sơ thành công.
6. Kiểm tra quyền

System phải kiểm tra:

Reception Officer
        ↓
Role
        ↓
Permission
        ↓
Data Scope
        ↓
Registration

Reception Officer chỉ được
tiếp nhận hồ sơ nằm trong
phạm vi được phân quyền.

7. Kiểm tra quyền sở hữu
và phạm vi dữ liệu

Data Scope phải được kiểm tra
trước khi thực hiện thao tác.

Nếu Registration nằm ngoài
phạm vi:

Access Denied

System không thực hiện
tiếp nhận.

8. Kiểm tra trạng thái

System phải kiểm tra
Registration State.

Ví dụ:

SUBMITTED

là trạng thái đang chờ
tiếp nhận nếu State Machine
của hệ thống quy định như vậy.

Không được tự ý coi một
State khác là trạng thái
chờ tiếp nhận.

9. Kiểm tra sơ bộ

Reception Officer thực hiện
kiểm tra sơ bộ theo phạm vi
được quy định.

Có thể bao gồm:

Kiểm tra hồ sơ có đầy đủ
thông tin cơ bản hay không.
Kiểm tra các trường bắt buộc.
Kiểm tra tài liệu tối thiểu.
Kiểm tra thông tin sinh viên.
Kiểm tra điều kiện tiếp nhận
ban đầu.

Reception Officer không thay
thế Processing Officer trong
việc kiểm tra nghiệp vụ chi tiết.

10. Không thực hiện phê duyệt

Reception Officer chỉ thực hiện:

Tiếp nhận

Không được mặc định thực hiện:

Phê duyệt cuối

hoặc:

Từ chối cuối

Quyền phê duyệt thuộc
Approver nếu tài khoản có
Permission phù hợp.

11. Không thực hiện xử lý
nghiệp vụ chi tiết

Reception Officer không mặc
định chịu trách nhiệm cho
toàn bộ việc kiểm tra
nghiệp vụ.

Sau khi tiếp nhận:

Reception Officer
        ↓
Tiếp nhận
        ↓
Processing Officer
        ↓
Kiểm tra nghiệp vụ
12. State Transition

State Transition phải tuân
thủ State Machine.

Ví dụ:

SUBMITTED
    ↓
UNDER_REVIEW

Không được tự ý chuyển:

SUBMITTED
    ↓
ACTIVE

vì ACTIVE cần đi qua
các bước nghiệp vụ và
phê duyệt tương ứng.

13. Main Transaction

Thao tác tiếp nhận phải
được xử lý nhất quán.

Ví dụ:

BEGIN TRANSACTION

    Validate Authentication

    Validate Permission

    Validate Data Scope

    Validate Registration

    Validate Current State

    Validate Reception Rules

    Update Registration State

    Update Received By

    Update Received At

    Create Audit Log

    Create Notification

COMMIT

Nếu xảy ra lỗi:

ROLLBACK
14. Concurrent Reception

Có thể xảy ra trường hợp
hai Reception Officer cùng
thực hiện tiếp nhận một
Registration.

Ví dụ:

Officer A ──┐
            ├── Registration
Officer B ──┘

System phải đảm bảo chỉ
một thao tác tiếp nhận
thành công.

Request còn lại phải
được từ chối an toàn
nếu State đã thay đổi.

15. Alternative Flow
A1 — Officer hủy thao tác

Nếu Reception Officer
chọn:

Hủy

System không thay đổi
Registration State.

A2 — Hồ sơ hợp lệ

Nếu kiểm tra sơ bộ
đạt yêu cầu:

SUBMITTED
    ↓
UNDER_REVIEW

System hoàn tất tiếp nhận.

A3 — Hồ sơ chưa đủ điều kiện
tiếp nhận

Nếu Business Rules quy định
hồ sơ chưa đủ điều kiện:

System không tiếp nhận
và xử lý theo quy trình
được định nghĩa.

Nếu cần bổ sung:

Registration
      ↓
Yêu cầu bổ sung
      ↓
Student

Việc tạo yêu cầu bổ sung
chi tiết được xử lý bởi
Use Case phù hợp.

16. Exception Flow
E1 — Registration không tồn tại

System thông báo:

Không tìm thấy hồ sơ.

Không thực hiện tiếp nhận.

E2 — Không có Permission

System trả về:

403 Forbidden

Không thay đổi dữ liệu.

E3 — Ngoài Data Scope

System từ chối thao tác.

Không trả về hoặc cập nhật
dữ liệu ngoài phạm vi.

E4 — State không hợp lệ

Nếu Registration không
ở trạng thái cho phép
tiếp nhận:

System thông báo:

Hồ sơ không ở trạng thái
có thể tiếp nhận.
E5 — Hồ sơ đã được Officer khác
tiếp nhận

Nếu một Officer khác đã
tiếp nhận trước:

System kiểm tra State
mới nhất và từ chối
thao tác tiếp nhận lần hai.

E6 — Database Error

Nếu Database xảy ra lỗi:

ROLLBACK

Không để Registration
ở trạng thái trung gian.

E7 — Audit Log Error

Nếu Audit Log là thành phần
bắt buộc của transaction:

System không hoàn tất
thao tác nếu không thể
ghi Audit Log.

E8 — Notification Error

Nếu Registration đã được
tiếp nhận thành công nhưng
Notification không gửi được:

Trạng thái nghiệp vụ vẫn
giữ kết quả thành công.

System ghi nhận lỗi
Notification để xử lý
theo cơ chế retry.

17. Audit Log

System ghi nhận sự kiện:

REGISTRATION_RECEIVED

Thông tin có thể gồm:

Actor ID
Actor Type
Registration ID
Previous Status
New Status
Received At
Result
Timestamp
18. Ví dụ Audit Log
Actor:
Reception Officer

Action:
REGISTRATION_RECEIVED

Registration:
REG-2026-000001

Previous Status:
SUBMITTED

New Status:
UNDER_REVIEW

Result:
SUCCESS
19. Notification

Sau khi tiếp nhận thành công,
System có thể gửi Notification
theo Business Rules.

Ví dụ Student nhận:

Hồ sơ của bạn đã được
tiếp nhận và đang được
xử lý.

Processing Officer có thể
nhận thông báo:

Hồ sơ mới đã được tiếp nhận
và chờ xử lý.
20. Security

Reception Officer không được:

Tiếp nhận hồ sơ ngoài
Data Scope.
Tiếp nhận hồ sơ của
người khác nếu không có
quyền.
Tự thay đổi State tùy ý.
Phê duyệt hồ sơ nếu
không có Permission.
Từ chối cuối nếu không
có Permission.
Sửa Audit Log.
21. Data Integrity

System phải đảm bảo:

Registration State
        +
Received By
        +
Received At
        +
Audit Log

được ghi nhận nhất quán.

Không được xảy ra trường hợp:

State = UNDER_REVIEW
Received By = NULL

nếu Business Rules yêu cầu
Received By phải tồn tại
sau khi tiếp nhận.

22. Business Constraints
BR-REC-01

Chỉ Reception Officer có
Permission phù hợp mới được
tiếp nhận hồ sơ.

BR-REC-02

Officer chỉ được tiếp nhận
hồ sơ trong Data Scope.

BR-REC-03

Registration phải ở State
cho phép tiếp nhận.

BR-REC-04

System phải kiểm tra State
ngay trước khi cập nhật.

BR-REC-05

Một Registration không
được tiếp nhận thành công
nhiều lần cho cùng một
trạng thái.

BR-REC-06

Tiếp nhận không đồng nghĩa
với phê duyệt.

BR-REC-07

Reception Officer không
mặc nhiên có quyền phê duyệt.

BR-REC-08

Tiếp nhận không thay thế
kiểm tra nghiệp vụ chi tiết.

BR-REC-09

State Transition phải
tuân thủ State Machine.

BR-REC-10

Thao tác tiếp nhận phải
được ghi Audit Log.

BR-REC-11

Concurrent Reception phải
được xử lý an toàn.

BR-REC-12

Không được xóa Registration
khi tiếp nhận.

23. Postconditions

Nếu tiếp nhận thành công:

SUBMITTED
    ↓
UNDER_REVIEW

theo State Machine chính
thức của hệ thống.

Ngoài ra:

Received By
Received At

được ghi nhận.

Audit Log được tạo.

Notification được tạo theo
quy định.

Hồ sơ sẵn sàng cho bước
xử lý nghiệp vụ tiếp theo.

24. Acceptance Criteria
AC01

Reception Officer có thể
chọn hồ sơ chờ tiếp nhận.

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

System kiểm tra State.

AC07

Officer có thể thực hiện
kiểm tra sơ bộ.

AC08

Officer có thể xác nhận
tiếp nhận.

AC09

System cập nhật State theo
State Machine.

AC10

System ghi nhận
Received By.

AC11

System ghi nhận
Received At.

AC12

System tạo Audit Log.

AC13

System không tự động
phê duyệt hồ sơ.

AC14

System không cho phép
tiếp nhận trùng.

AC15

Concurrent Reception
được xử lý an toàn.

AC16

Officer không thể tiếp nhận
hồ sơ ngoài Data Scope.

AC17

Database Error không tạo
trạng thái không nhất quán.

25. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-OFF-02
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

26. Related Use Cases
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
UNDER_REVIEW
      ↓
UC-OFF-03
Kiểm tra hồ sơ
27. Relationship với Processing Officer

Sau khi Reception Officer
tiếp nhận:

Reception Officer
        ↓
Receive
        ↓
UNDER_REVIEW
        ↓
Processing Officer
        ↓
Kiểm tra nghiệp vụ

Reception Officer và
Processing Officer là
hai vai trò khác nhau.

Không gộp hai vai trò này
thành một Actor nếu quyền
hạn nghiệp vụ khác nhau.

28. Status

Use Case ID:

UC-OFF-02

Version:

1.0

Status:

Draft

Previous:

UC-OFF-01 — Xem hồ sơ chờ tiếp nhận

Next:

UC-OFF-03 — Kiểm tra hồ sơ