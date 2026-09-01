# UC-OFF-03 — KIỂM TRA HỒ SƠ

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-OFF-03 |
| Tên Use Case | Kiểm tra hồ sơ |
| Actor chính | Processing Officer |
| Actor phụ | System |
| Nhóm | Officer |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép Processing Officer
thực hiện kiểm tra nghiệp vụ chi tiết
đối với hồ sơ ngoại trú đã được
tiếp nhận.

Processing Officer kiểm tra thông tin
trong hồ sơ, đối chiếu tài liệu và
đánh giá hồ sơ theo các Business Rules.

Kết quả kiểm tra có thể dẫn đến:

- Hồ sơ đạt yêu cầu để trình duyệt.
- Hồ sơ cần bổ sung.
- Hồ sơ không đáp ứng điều kiện
  theo quy định.

Việc phê duyệt cuối cùng thuộc
Approver và không thuộc Use Case này.

---

# 3. Preconditions

1. Processing Officer đã đăng nhập.

2. Session còn hiệu lực.

3. Tài khoản có Role phù hợp.

4. Tài khoản có Permission kiểm tra
   hồ sơ.

5. Registration tồn tại.

6. Registration thuộc Data Scope
   của Processing Officer.

7. Registration đã được tiếp nhận.

8. Registration đang ở trạng thái
   cho phép kiểm tra.

---

# 4. Trigger

Processing Officer chọn một hồ sơ
cần xử lý từ danh sách:

```text
Dashboard
    ↓
Hồ sơ cần xử lý
    ↓
Chọn Registration
    ↓
Kiểm tra hồ sơ
5. Main Flow
Bước 1

Processing Officer đăng nhập
vào hệ thống.

Bước 2

Processing Officer mở danh sách
hồ sơ cần xử lý.

Bước 3

Processing Officer chọn một
Registration.

Bước 4

System kiểm tra:

Authentication.
Role.
Permission.
Data Scope.
Bước 5

System kiểm tra Registration
có tồn tại hay không.

Bước 6

System kiểm tra State hiện tại
của Registration.

Bước 7

System hiển thị thông tin hồ sơ
trong phạm vi được phép.

Thông tin có thể bao gồm:

Mã hồ sơ.
MSSV.
Họ tên.
Thông tin liên hệ.
Thông tin nơi ở.
Thông tin đăng ký ngoại trú.
Tài liệu đính kèm.
Lịch sử xử lý.
Trạng thái hiện tại.
Bước 8

Processing Officer kiểm tra
thông tin hồ sơ.

Bước 9

Processing Officer kiểm tra
các tài liệu liên quan.

Bước 10

Processing Officer đối chiếu
thông tin theo Business Rules.

Bước 11

Processing Officer đưa ra
kết quả kiểm tra nghiệp vụ.

Kết quả có thể là:

Đạt yêu cầu

hoặc:

Cần bổ sung

hoặc kết quả xử lý khác nếu
Business Rules quy định.

Bước 12

System kiểm tra kết quả
và các điều kiện liên quan.

Bước 13

System cập nhật thông tin
xử lý hồ sơ.

Bước 14

System ghi nhận Processing
Officer thực hiện kiểm tra.

Bước 15

System tạo Audit Log.

Bước 16

Nếu hồ sơ đạt yêu cầu,
System chuyển hồ sơ sang
bước tiếp theo theo State Machine.

Bước 17

Nếu hồ sơ cần bổ sung,
System chuyển sang quy trình
yêu cầu bổ sung.

Bước 18

System gửi Notification nếu
Business Rules yêu cầu.

6. Kiểm tra thông tin

Processing Officer kiểm tra
các thông tin được quy định
trong Business Rules.

Ví dụ:

Thông tin sinh viên
        ↓
Thông tin ngoại trú
        ↓
Thông tin nơi ở
        ↓
Thông tin liên hệ
        ↓
Thông tin tài liệu

Không được tự ý thêm điều kiện
nghiệp vụ ngoài phạm vi hệ thống.

7. Kiểm tra tài liệu

Processing Officer kiểm tra
các tài liệu mà Student đã
upload.

Có thể kiểm tra:

Tài liệu có tồn tại.
Tài liệu có đúng loại.
Tài liệu có đầy đủ.
Tài liệu có đáp ứng yêu cầu
nghiệp vụ.

Các yêu cầu cụ thể phải được
xác định trong Business Rules
và Functional Requirements.

8. Đối chiếu dữ liệu

Processing Officer có thể
đối chiếu dữ liệu hồ sơ
với dữ liệu do SIS cung cấp
nếu Business Rules yêu cầu.

Ví dụ:

Registration
      ↓
Student ID
      ↓
SIS
      ↓
Student Information

Nếu dữ liệu không khớp,
Processing Officer xử lý theo
quy tắc nghiệp vụ tương ứng.

9. Kiểm tra điều kiện

Processing Officer đánh giá
hồ sơ dựa trên các điều kiện
đã được hệ thống định nghĩa.

Không được sử dụng tiêu chí
cá nhân ngoài Business Rules.

10. Kết quả kiểm tra
10.1 Hồ sơ đạt yêu cầu

Nếu hồ sơ đạt yêu cầu:

Registration
      ↓
Processing
      ↓
Passed Review
      ↓
Next Approval Step

Hồ sơ được chuyển sang bước
phù hợp để Approver xem xét.

Processing Officer không
được tự động phê duyệt.

10.2 Hồ sơ cần bổ sung

Nếu hồ sơ chưa đầy đủ:

Processing Officer
        ↓
Yêu cầu bổ sung
        ↓
Student

Việc tạo yêu cầu bổ sung
được thực hiện theo
Use Case:

UC-OFF-05
Yêu cầu bổ sung
11. Alternative Flow
A1 — Hồ sơ đạt yêu cầu

Processing Officer xác nhận
hồ sơ đạt yêu cầu.

System ghi nhận kết quả
và chuyển hồ sơ sang bước
tiếp theo.

A2 — Hồ sơ cần bổ sung

Processing Officer xác định
thông tin hoặc tài liệu
chưa đầy đủ.

System chuyển sang quy trình
yêu cầu bổ sung.

A3 — Processing Officer
xem lại hồ sơ

Officer có thể mở lại thông tin
và tài liệu trước khi xác nhận
kết quả kiểm tra.

A4 — Processing Officer
lưu kết quả

Nếu hệ thống hỗ trợ lưu nháp:

Kiểm tra
    ↓
Lưu nháp
    ↓
Tiếp tục sau

Lưu nháp không được tự động
chuyển hồ sơ sang bước
phê duyệt.

12. Exception Flow
E1 — Không có Permission

System từ chối truy cập.

403 Forbidden

Không thực hiện kiểm tra.

E2 — Ngoài Data Scope

Nếu hồ sơ không thuộc phạm vi
được phép:

System từ chối truy cập.

Không trả về dữ liệu
không được phép.

E3 — Registration không tồn tại

System thông báo:

Không tìm thấy hồ sơ.
E4 — State không hợp lệ

Nếu hồ sơ chưa được tiếp nhận
hoặc đã chuyển sang State khác:

System không cho phép
thực hiện kiểm tra ở bước này.

E5 — Tài liệu không thể tải

Nếu tài liệu không thể truy cập:

System thông báo lỗi và không
được coi tài liệu là hợp lệ
chỉ vì lỗi tải dữ liệu.

E6 — SIS không khả dụng

Nếu cần đối chiếu SIS nhưng
SIS tạm thời không khả dụng:

System xử lý theo Business Rules.

Không tự động kết luận hồ sơ
đạt nếu dữ liệu SIS là bắt buộc.

E7 — Database Error

Nếu Database xảy ra lỗi:

ROLLBACK

nếu thao tác đang nằm trong
transaction.

System ghi nhận lỗi.

E8 — Concurrent State Change

Nếu hồ sơ bị thay đổi State
bởi một Actor khác trong lúc
Processing Officer đang kiểm tra:

System kiểm tra State mới nhất
trước khi lưu kết quả.

Nếu State không còn hợp lệ,
System từ chối thao tác.

13. State Transition

Processing Officer không được
tự ý chuyển State.

Mọi State Transition phải
tuân thủ State Machine.

Ví dụ:

UNDER_REVIEW
       ↓
PASSED_REVIEW
       ↓
PENDING_APPROVAL

hoặc:

UNDER_REVIEW
       ↓
REQUIRE_ADDITIONAL_INFO

Tên State thực tế phải sử dụng
đúng State được định nghĩa
trong Business Rules của hệ thống.

14. Phân biệt Review và Approval

Processing Officer:

Kiểm tra
    ↓
Đánh giá nghiệp vụ
    ↓
Đề xuất kết quả

Approver:

Xem kết quả
    ↓
Quyết định
    ↓
Approve / Reject

Hai trách nhiệm này không
được gộp thành một bước nếu
Permission khác nhau.

15. Audit Log

System ghi nhận sự kiện
kiểm tra hồ sơ.

Ví dụ:

REGISTRATION_REVIEWED

Thông tin có thể gồm:

Actor ID
Actor Type
Registration ID
Review Result
Timestamp
Previous State
New State
16. Notification

Nếu kết quả kiểm tra yêu cầu
thông báo:

System tạo Notification.

Ví dụ:

Hồ sơ của bạn cần bổ sung
thông tin.

hoặc:

Hồ sơ đã hoàn tất bước
kiểm tra và đang chờ duyệt.

Nội dung thông báo phải
phù hợp Business Rules.

17. Security

Processing Officer:

Được phép:

Xem hồ sơ được phân công
hoặc thuộc Data Scope.
Kiểm tra thông tin.
Kiểm tra tài liệu.
Đánh giá hồ sơ.
Yêu cầu bổ sung theo Permission.

Không mặc nhiên được:

Phê duyệt hồ sơ.
Từ chối cuối.
Quản lý User.
Quản lý Role.
Quản lý Permission.
Sửa Audit Log.
Xem dữ liệu ngoài Data Scope.
18. Business Constraints
BR-PROC-01

Chỉ Processing Officer có
Permission phù hợp mới được
kiểm tra hồ sơ.

BR-PROC-02

Officer chỉ được kiểm tra
hồ sơ thuộc Data Scope.

BR-PROC-03

Registration phải ở State
cho phép kiểm tra.

BR-PROC-04

Thông tin và tài liệu phải
được kiểm tra theo Business
Rules.

BR-PROC-05

Processing Officer không
mặc nhiên có quyền phê duyệt.

BR-PROC-06

Processing Officer không
mặc nhiên có quyền từ chối
cuối.

BR-PROC-07

Processing Officer không
được tự ý thay đổi State.

BR-PROC-08

State Transition phải tuân
thủ State Machine.

BR-PROC-09

Kết quả kiểm tra phải được
ghi nhận.

BR-PROC-10

Hoạt động kiểm tra phải
được Audit theo yêu cầu
của hệ thống.

BR-PROC-11

Nếu cần dữ liệu SIS,
System phải xử lý trường hợp
SIS không khả dụng theo
Business Rules.

BR-PROC-12

Concurrent State Change
phải được kiểm soát.

19. Postconditions

Nếu kiểm tra thành công:

Registration
      ↓
Review Completed
      ↓
Next State

Kết quả kiểm tra được lưu.

Processing Officer được
ghi nhận.

Audit Log được tạo.

Nếu hồ sơ đạt yêu cầu,
hồ sơ sẵn sàng cho bước
phê duyệt tiếp theo.

Nếu hồ sơ cần bổ sung,
hồ sơ chuyển sang quy trình
bổ sung.

20. Acceptance Criteria
AC01

Processing Officer có thể
mở danh sách hồ sơ cần xử lý.

AC02

System kiểm tra Authentication.

AC03

System kiểm tra Role.

AC04

System kiểm tra Permission.

AC05

System kiểm tra Data Scope.

AC06

System kiểm tra State.

AC07

Officer có thể xem thông tin
hồ sơ được phép.

AC08

Officer có thể kiểm tra
thông tin nghiệp vụ.

AC09

Officer có thể kiểm tra
tài liệu.

AC10

Officer có thể xác định
kết quả kiểm tra.

AC11

System lưu kết quả kiểm tra.

AC12

System không tự động
phê duyệt hồ sơ.

AC13

State Transition tuân thủ
State Machine.

AC14

System ghi Audit Log.

AC15

System xử lý an toàn khi
State thay đổi đồng thời.

AC16

Officer không thể kiểm tra
hồ sơ ngoài Data Scope.

21. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-OFF-03
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

22. Related Use Cases
UC-OFF-02
Tiếp nhận hồ sơ
       ↓
UNDER_REVIEW
       ↓
UC-OFF-03
Kiểm tra hồ sơ
       │
       ├───────────────┐
       ↓               ↓
Đạt yêu cầu       Cần bổ sung
       ↓               ↓
PENDING_APPROVAL   UC-OFF-05
       ↓            Yêu cầu bổ sung
UC-APP-01
Phê duyệt hồ sơ
23. Relationship với các Actor
Reception Officer
        ↓
UC-OFF-02
Tiếp nhận
        ↓
Processing Officer
        ↓
UC-OFF-03
Kiểm tra
        ↓
Approver
        ↓
UC-APP-01
Phê duyệt

Ba Actor có trách nhiệm
khác nhau:

Reception Officer
= Tiếp nhận

Processing Officer
= Kiểm tra

Approver
= Quyết định
24. Status

Use Case ID:

UC-OFF-03

Version:

1.0

Status:

Draft

Previous:

UC-OFF-02 — Tiếp nhận hồ sơ

Next:

UC-OFF-04 — Kiểm tra tài liệu