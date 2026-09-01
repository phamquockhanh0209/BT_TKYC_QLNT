# UC-REG-07 — RÚT HỒ SƠ

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-REG-07 |
| Tên Use Case | Rút hồ sơ |
| Actor chính | Student |
| Actor phụ | System |
| Nhóm | Student Registration |
| Priority | Medium |

---

# 2. Mục đích

Use Case cho phép sinh viên
chủ động rút hồ sơ ngoại trú
đã tạo hoặc đã gửi trong
phạm vi trạng thái mà
Business Rules cho phép.

Sau khi rút thành công,
hồ sơ không tiếp tục được
xử lý theo quy trình hiện tại.

Rút hồ sơ là thao tác
do Student chủ động thực hiện.

Use Case này không đồng
nghĩa với:

- Kết thúc ngoại trú.
- Từ chối hồ sơ.
- Xóa hồ sơ.
- Hủy tài khoản sinh viên.

---

# 3. Preconditions

1. Student đã đăng nhập.

2. Session còn hiệu lực.

3. Registration tồn tại.

4. Registration thuộc
   Student đang đăng nhập.

5. Registration đang ở
   trạng thái cho phép rút
   theo Business Rules.

---

# 4. Trigger

Student mở hồ sơ ngoại trú.

Sau đó chọn:

```text
Rút hồ sơ
5. Main Flow
Bước 1

Student mở hồ sơ ngoại trú.

Bước 2

System kiểm tra quyền
truy cập Registration.

Bước 3

System kiểm tra State
hiện tại của Registration.

Bước 4

System xác định hồ sơ
có được phép rút hay không.

Bước 5

System hiển thị cảnh báo:

Bạn có chắc chắn muốn
rút hồ sơ này không?
Bước 6

Student xác nhận rút hồ sơ.

Bước 7

System thực hiện lại
các kiểm tra nghiệp vụ
trước khi thay đổi dữ liệu.

Bước 8

System thực hiện thao tác
Withdraw.

Bước 9

Registration chuyển sang
trạng thái kết quả theo
State Machine được quy
định trong Business Rules.

Bước 10

System ghi nhận:

Withdrawn At.
Withdrawn By.
Reason nếu nghiệp vụ
yêu cầu.
Bước 11

System tạo Audit Log.

Bước 12

System tạo Notification
nếu nghiệp vụ yêu cầu.

Bước 13

System thông báo:

Rút hồ sơ thành công.
6. Kiểm tra quyền sở hữu

System phải kiểm tra:

Logged-in Student ID
        ↓
Registration Student ID

Hai giá trị phải giống nhau.

Nếu không:

Access Denied

Student không được phép
rút hồ sơ của Student khác.

7. Kiểm tra trạng thái

System phải kiểm tra
Registration State trước
khi thực hiện Withdraw.

Ví dụ:

DRAFT
SUBMITTED
UNDER_REVIEW

Trạng thái nào được phép
rút phải tuân thủ
Business Rules.

Không được tự ý coi
mọi State đều có thể rút.

8. Không được rút hồ sơ
đã kết thúc

Nếu Registration đã ở
trạng thái kết thúc như:

REJECTED
EXPIRED

thì không được mặc định
cho phép Withdraw.

Việc xử lý phải theo
State Machine chính thức.

9. Không được nhầm với
Termination

Hai nghiệp vụ khác nhau:

Withdraw Registration
        ↓
Sinh viên rút hồ sơ
trong quá trình đăng ký

và:

Termination Request
        ↓
Sinh viên yêu cầu kết thúc
trạng thái ngoại trú

Không sử dụng UC-REG-07
để xử lý Termination.

Termination được quản lý
bởi:

UC-REQ-03
Yêu cầu kết thúc ngoại trú
10. Không xóa dữ liệu hồ sơ

Rút hồ sơ không đồng nghĩa
với:

DELETE Registration

System phải giữ lại dữ
liệu cần thiết để:

Audit.
Lịch sử.
Truy vết.
Báo cáo.
Kiểm tra nghiệp vụ.
11. Withdrawal Reason

Nếu Business Rules yêu
cầu lý do rút:

Student phải nhập:

Withdrawal Reason

Ví dụ:

Không còn nhu cầu đăng ký
ngoại trú.

Reason phải được lưu
cùng sự kiện Withdraw.

12. Main Transaction

Thao tác rút hồ sơ phải
được xử lý nhất quán.

Ví dụ:

BEGIN TRANSACTION

    Validate Student

    Validate Registration

    Validate State

    Validate Withdrawal Rule

    Update Registration

    Create Audit Log

    Create Notification

COMMIT

Nếu xảy ra lỗi:

ROLLBACK
13. Chống Withdraw trùng

Student có thể click
nút Rút hồ sơ nhiều lần.

System phải đảm bảo
không xử lý Withdraw
nhiều lần cho cùng
một Registration.

Ví dụ:

Request A
   ↓
Withdraw
   ↓
Success

Request B
   ↓
Registration no longer
withdrawable
   ↓
Reject
14. Concurrent Withdraw

Nếu có nhiều request
Withdraw đồng thời:

Request A
Request B
    ↓
Registration

System phải đảm bảo
chỉ một request có thể
thực hiện chuyển trạng
thái thành công.

Request còn lại phải
được xử lý an toàn.

15. Alternative Flow
A1 — Student hủy xác nhận

Nếu Student chọn:

Hủy

System không thực hiện
Withdraw.

Registration giữ nguyên
trạng thái.

A2 — Hồ sơ DRAFT

Nếu Business Rules cho
phép rút DRAFT:

Student có thể thực hiện
Withdraw.

Nếu Business Rules không
cho phép:

System từ chối thao tác.

A3 — Hồ sơ SUBMITTED

Nếu Business Rules cho
phép:

Student có thể rút
hồ sơ trước khi bước
xử lý tiếp theo được
hoàn tất.

Nếu không được phép:

System từ chối.

A4 — Hồ sơ UNDER_REVIEW

Nếu Business Rules cho
phép rút trong quá trình
xử lý:

System thực hiện theo
quy định.

Nếu không:

System thông báo:

Hồ sơ đang được xử lý
và không thể rút ở
thời điểm hiện tại.
A5 — Yêu cầu nhập lý do

Nếu Reason là bắt buộc:

System yêu cầu Student
nhập lý do trước khi
xác nhận.

16. Exception Flow
E1 — Registration không tồn tại

System thông báo:

Không tìm thấy hồ sơ.

Không thực hiện Withdraw.

E2 — Không có quyền

Nếu Registration không
thuộc Student:

403 Forbidden

System từ chối.

E3 — Session hết hạn

System yêu cầu Student
đăng nhập lại.

E4 — State không cho phép

Nếu Registration đang ở
State không cho phép
Withdraw:

System thông báo:

Hồ sơ không thể rút
ở trạng thái hiện tại.
E5 — Hồ sơ đã được xử lý

Nếu trong lúc Student
xác nhận Withdraw,
một cán bộ đã thay đổi
State:

System kiểm tra lại State.

Nếu không còn thỏa điều
kiện:

Withdraw bị từ chối.

System không được ghi
nhận Withdraw sai trạng
thái.

E6 — Database Error

Nếu Database xảy ra lỗi:

ROLLBACK

Không để Registration
ở trạng thái trung gian.

E7 — Audit Log Error

Nếu Audit Log là thành
phần bắt buộc của
transaction:

System không hoàn tất
Withdraw nếu Audit Log
không thể ghi thành công.

E8 — Notification Error

Nếu Withdraw đã thành
công nhưng Notification
không gửi được:

Registration vẫn giữ
trạng thái sau Withdraw.

System ghi nhận lỗi
Notification để xử lý
theo cơ chế phù hợp.

17. State Transition

State sau Withdraw phải
tuân thủ State Machine
chính thức.

Ví dụ nếu hệ thống
định nghĩa:

DRAFT
  ↓
WITHDRAWN

thì sử dụng:

DRAFT → WITHDRAWN

Nếu hệ thống không định
nghĩa State WITHDRAWN,
không được tự ý tạo State
mới.

Trong trường hợp đó,
phải sử dụng State đã
được quy định trong
Business Rules.

18. Withdrawal Flag

Nếu kiến trúc nghiệp vụ
sử dụng Flag thay vì
State riêng:

Ví dụ:

is_withdrawn = true

thì Flag phải được định
nghĩa rõ trong Business
Rules.

Không được đồng thời
tạo nhiều cơ chế biểu diễn
cùng một ý nghĩa mà không
có quy định rõ ràng.

19. Audit Log

System ghi nhận sự kiện:

REGISTRATION_WITHDRAWN

Thông tin có thể gồm:

Actor ID
Actor Type
Registration ID
Previous Status
New Status
Withdrawal Reason
Withdrawn At
Result
Timestamp
20. Ví dụ Audit Log
Actor:
Student

Action:
REGISTRATION_WITHDRAWN

Registration:
REG-2026-000001

Previous Status:
SUBMITTED

New Status:
WITHDRAWN

Reason:
Không còn nhu cầu đăng ký.

Result:
SUCCESS
21. Notification

Sau khi Withdraw thành
công:

Student nhận:

Hồ sơ đã được rút
thành công.

Nếu nghiệp vụ yêu cầu,
cán bộ đang xử lý cũng
có thể nhận Notification.

22. Không ảnh hưởng
đến hồ sơ khác

Withdraw chỉ áp dụng
cho Registration được
Student lựa chọn.

Ví dụ:

Student A
 ├── Registration 01
 └── Registration 02

Nếu Student rút:

Registration 01

thì:

Registration 02

không bị thay đổi.

23. Security

Student chỉ được:

Student
   ↓
Own Registration
   ↓
Withdraw

Không được:

Student
   ↓
Other Student Registration
   ↓
Withdraw

Student không được:

Thay đổi Audit Log.
Thay đổi quyết định
của cán bộ.
Tự thay đổi State.
Rút hồ sơ của người khác.
24. Business Constraints
BR-WD-01

Student chỉ được rút
Registration thuộc mình.

BR-WD-02

Registration phải ở
State được phép Withdraw.

BR-WD-03

System phải kiểm tra
State tại thời điểm
thực hiện Withdraw.

BR-WD-04

Withdraw không được
xóa Registration khỏi
Database.

BR-WD-05

Nếu Reason bắt buộc,
Student phải cung cấp
Withdrawal Reason.

BR-WD-06

Withdraw phải được
ghi Audit Log.

BR-WD-07

Không được Withdraw
trùng cùng một
Registration.

BR-WD-08

Concurrent Withdraw
phải được xử lý an toàn.

BR-WD-09

Withdraw không đồng
nghĩa với Termination.

BR-WD-10

Termination phải được
xử lý bằng Request riêng.

BR-WD-11

State sau Withdraw
phải tuân thủ State
Machine.

BR-WD-12

Không tự ý tạo State
mới nếu chưa được định
nghĩa trong Business Rules.

25. Postconditions

Nếu Withdraw thành công:

Registration
     ↓
State sau Withdraw

hoặc:

is_withdrawn = true

tùy theo mô hình chính
thức của hệ thống.

Thông tin Withdraw
được lưu.

Audit Log được tạo.

Notification được tạo
theo quy định.

Registration không bị
xóa khỏi hệ thống.

26. Acceptance Criteria
AC01

Student có thể chọn
hồ sơ của mình để rút.

AC02

System kiểm tra quyền
sở hữu hồ sơ.

AC03

System kiểm tra State
trước khi Withdraw.

AC04

System chỉ cho phép
Withdraw ở các State
được quy định.

AC05

Student phải xác nhận
trước khi Withdraw.

AC06

Nếu Reason bắt buộc,
System phải yêu cầu
nhập Reason.

AC07

Withdraw thành công
phải cập nhật trạng thái
theo State Machine.

AC08

Withdraw không xóa
Registration.

AC09

Withdraw trùng không
được xử lý nhiều lần.

AC10

Concurrent Withdraw
được xử lý an toàn.

AC11

Withdraw được ghi
Audit Log.

AC12

Notification được tạo
theo quy định.

AC13

Withdraw không được
xử lý thay cho
Termination.

AC14

Student không thể
Withdraw hồ sơ của
Student khác.

27. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-REG-07
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

UC-REG-04
Upload tài liệu

    ↓

UC-REG-05
Gửi hồ sơ

    ↓

UC-REG-06
Theo dõi hồ sơ

    ↓

UC-REG-07
Rút hồ sơ

29. Related Request

Rút hồ sơ khác với:

UC-REQ-03
Yêu cầu kết thúc ngoại trú

Withdraw:

Student
   ↓
Rút Registration

Termination:

Student
   ↓
Tạo Termination Request
   ↓
Cán bộ xử lý
   ↓
Approver
   ↓
Kết thúc ngoại trú

Hai nghiệp vụ không được
gộp thành một Use Case.

30. Status

Use Case ID:

UC-REG-07

Version:

1.0

Status:

Draft

Previous:

UC-REG-06 — Theo dõi hồ sơ

Next:

UC-REG-08 — Bổ sung hồ sơ