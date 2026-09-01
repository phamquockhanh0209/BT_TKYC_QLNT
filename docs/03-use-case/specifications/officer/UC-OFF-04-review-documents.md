# UC-OFF-04 — KIỂM TRA TÀI LIỆU

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-OFF-04 |
| Tên Use Case | Kiểm tra tài liệu |
| Actor chính | Processing Officer |
| Actor phụ | System |
| Nhóm | Officer |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép Processing Officer
kiểm tra các tài liệu được Student
đính kèm trong hồ sơ ngoại trú.

Mục tiêu là xác định tài liệu có:

- Được cung cấp hay chưa.
- Đúng loại tài liệu hay không.
- Đầy đủ theo yêu cầu hay không.
- Có thể truy cập hay không.
- Đáp ứng điều kiện nghiệp vụ
  được quy định hay không.

Kết quả kiểm tra tài liệu được sử dụng
để hỗ trợ quá trình xử lý hồ sơ.

Use Case này không thực hiện
phê duyệt cuối cùng.

---

# 3. Preconditions

1. Processing Officer đã đăng nhập.

2. Session còn hiệu lực.

3. Tài khoản có Role phù hợp.

4. Tài khoản có Permission kiểm tra
   tài liệu.

5. Registration tồn tại.

6. Registration thuộc Data Scope
   của Processing Officer.

7. Registration đang ở trạng thái
   cho phép kiểm tra.

8. Các tài liệu liên quan đã được
   hệ thống lưu nhận nếu Student
   đã upload.

---

# 4. Trigger

Processing Officer mở hồ sơ và
chọn chức năng:

```text
Kiểm tra tài liệu

Luồng:

Dashboard
    ↓
Hồ sơ cần xử lý
    ↓
Registration
    ↓
Tài liệu
    ↓
Kiểm tra tài liệu
5. Main Flow
Bước 1

Processing Officer mở Registration.

Bước 2

System kiểm tra:

Authentication.
Role.
Permission.
Data Scope.
Bước 3

System tải danh sách tài liệu
của Registration.

Bước 4

System hiển thị các thông tin
liên quan đến từng tài liệu.

Ví dụ:

Document ID
Document Type
File Name
Uploaded At
Status
Bước 5

Processing Officer chọn
một tài liệu.

Bước 6

System kiểm tra tài liệu
có tồn tại hay không.

Bước 7

System cung cấp tài liệu
để Officer kiểm tra trong
phạm vi được phép.

Bước 8

Processing Officer kiểm tra
tài liệu.

Các nội dung kiểm tra phải
tuân thủ Business Rules.

Bước 9

Processing Officer xác định
kết quả kiểm tra.

Ví dụ:

Hợp lệ

hoặc:

Không hợp lệ

hoặc:

Cần bổ sung
Bước 10

Processing Officer ghi nhận
kết quả kiểm tra nếu hệ thống
yêu cầu.

Bước 11

System lưu kết quả kiểm tra.

Bước 12

System ghi nhận Actor thực hiện
kiểm tra.

Bước 13

System tạo Audit Log.

Bước 14

Nếu tài liệu không hợp lệ
hoặc còn thiếu, System hỗ trợ
chuyển sang quy trình yêu cầu
bổ sung theo Use Case phù hợp.

6. Danh sách tài liệu

System có thể hiển thị:

Document ID
Document Type
File Name
Uploaded At
Document Status
Reviewed By
Reviewed At

Các trường cụ thể phải phù hợp
với Data Model và Functional
Requirements.

7. Kiểm tra loại tài liệu

Processing Officer kiểm tra
Document Type.

Ví dụ:

Required Document
        ↓
Uploaded Document
        ↓
Compare Document Type

Nếu loại tài liệu không đúng
với yêu cầu:

Không hợp lệ

hoặc xử lý theo Business Rules.

8. Kiểm tra tính đầy đủ

System hoặc Processing Officer
xác định các tài liệu bắt buộc
đã được cung cấp đầy đủ hay chưa.

Ví dụ:

Required Documents
        ↓
Uploaded Documents
        ↓
Check Completeness

Nếu thiếu:

Cần bổ sung
9. Kiểm tra khả năng truy cập

System phải kiểm tra tài liệu
có thể được truy cập hay không.

Nếu file không tồn tại hoặc
không thể truy cập:

Document Unavailable

System không được coi tài liệu
là hợp lệ chỉ vì metadata
của tài liệu tồn tại.

10. Kiểm tra thông tin tài liệu

Processing Officer kiểm tra
nội dung tài liệu theo phạm vi
nghiệp vụ được quy định.

Không được tự ý bổ sung
tiêu chí kiểm tra ngoài
Business Rules.

11. Kết quả kiểm tra
11.1 Hợp lệ

Nếu tài liệu đáp ứng yêu cầu:

Document
    ↓
VALID

System lưu kết quả kiểm tra.

11.2 Không hợp lệ

Nếu tài liệu không đáp ứng
yêu cầu:

Document
    ↓
INVALID

Processing Officer ghi nhận
lý do nếu hệ thống yêu cầu.

11.3 Cần bổ sung

Nếu tài liệu thiếu hoặc cần
thay thế:

Document
    ↓
REQUIRE_ADDITIONAL_INFO

Student được thông báo
theo quy trình nghiệp vụ.

12. Kiểm tra toàn bộ tài liệu

Processing Officer có thể
kiểm tra lần lượt:

Document 1
    ↓
Document 2
    ↓
Document 3
    ↓
...

Sau khi kiểm tra, System
có thể tổng hợp:

All Documents Valid

hoặc:

Missing Documents

hoặc:

Invalid Documents
13. Alternative Flow
A1 — Không có tài liệu

Nếu Registration không có
tài liệu:

System hiển thị:

Không có tài liệu được
đính kèm.

Processing Officer xử lý
theo Business Rules.

A2 — Tài liệu hợp lệ

Officer xác nhận tài liệu
hợp lệ.

System lưu:

Document Status = VALID
A3 — Tài liệu không hợp lệ

Officer xác định tài liệu
không hợp lệ.

System lưu kết quả và
lý do nếu được yêu cầu.

A4 — Tài liệu cần bổ sung

Officer xác định tài liệu
cần bổ sung.

System chuyển sang quy trình:

UC-OFF-05
Yêu cầu bổ sung
A5 — Có nhiều tài liệu

Officer kiểm tra từng
tài liệu trong danh sách.

System duy trì kết quả
riêng cho từng tài liệu.

14. Exception Flow
E1 — Không có Permission

System từ chối truy cập.

403 Forbidden
E2 — Ngoài Data Scope

System không cho phép
Officer truy cập tài liệu.

E3 — Registration không tồn tại

System thông báo:

Không tìm thấy hồ sơ.
E4 — Document không tồn tại

System thông báo:

Không tìm thấy tài liệu.
E5 — Không thể tải tài liệu

System thông báo:

Không thể tải tài liệu.
Vui lòng thử lại.

System không tự động đánh
giá tài liệu là hợp lệ.

E6 — File không còn tồn tại

Nếu metadata tồn tại nhưng
file thực tế không tồn tại:

System ghi nhận lỗi và
không đánh dấu tài liệu
là hợp lệ.

E7 — Database Error

Nếu không thể lưu kết quả:

ROLLBACK

nếu thao tác nằm trong
transaction.

System thông báo lỗi.

E8 — Concurrent Update

Nếu Student hoặc Actor khác
thay đổi tài liệu trong lúc
Officer đang kiểm tra:

System kiểm tra phiên bản
hoặc trạng thái mới nhất
trước khi lưu kết quả.

15. State của Document

Nếu hệ thống có State cho
Document, State phải được
định nghĩa thống nhất.

Ví dụ:

UPLOADED
    ↓
UNDER_REVIEW
    ↓
VALID

hoặc:

UPLOADED
    ↓
UNDER_REVIEW
    ↓
INVALID

Tên State thực tế phải
phù hợp Business Rules.

16. Không phê duyệt hồ sơ

Kiểm tra tài liệu không
đồng nghĩa với phê duyệt
Registration.

Processing Officer
        ↓
Document Review
        ↓
Result
        ↓
Approver
        ↓
Approval Decision

Processing Officer không
được tự động chuyển hồ sơ
sang ACTIVE chỉ vì tài liệu
đã hợp lệ.

17. Audit Log

System ghi nhận hoạt động
kiểm tra tài liệu.

Ví dụ:

DOCUMENT_REVIEWED

Thông tin có thể gồm:

Actor ID
Registration ID
Document ID
Previous Status
New Status
Review Result
Timestamp
18. Notification

Nếu tài liệu cần bổ sung,
System có thể gửi Notification
cho Student.

Ví dụ:

Hồ sơ của bạn cần bổ sung
hoặc cập nhật tài liệu.

Nếu tất cả tài liệu đã
được kiểm tra và hồ sơ
đủ điều kiện cho bước tiếp
theo, System có thể gửi
thông báo theo Business Rules.

19. Security

Processing Officer:

Được phép:

Xem tài liệu thuộc
Data Scope.
Kiểm tra tài liệu.
Ghi nhận kết quả kiểm tra.
Yêu cầu bổ sung nếu có
Permission.

Không mặc nhiên được:

Xem tài liệu ngoài
Data Scope.
Xóa tài liệu.
Sửa Audit Log.
Phê duyệt hồ sơ.
Thay đổi Permission.
20. Data Integrity

System phải đảm bảo:

Registration
      +
Document
      +
Review Result
      +
Reviewer
      +
Reviewed At

được liên kết chính xác.

Kết quả kiểm tra phải gắn
đúng với Document tương ứng.

Không được ghi kết quả
kiểm tra cho sai hồ sơ
hoặc sai tài liệu.

21. Business Constraints
BR-DOC-01

Chỉ Processing Officer có
Permission phù hợp mới được
kiểm tra tài liệu.

BR-DOC-02

Officer chỉ được kiểm tra
tài liệu thuộc Data Scope.

BR-DOC-03

Tài liệu phải được kiểm tra
theo Business Rules.

BR-DOC-04

Tài liệu không thể truy cập
không được coi là hợp lệ.

BR-DOC-05

Tài liệu thiếu hoặc không
hợp lệ phải được xử lý theo
quy trình bổ sung phù hợp.

BR-DOC-06

Kết quả kiểm tra phải được
ghi nhận.

BR-DOC-07

Processing Officer không
mặc nhiên có quyền phê duyệt
Registration.

BR-DOC-08

Document Review không tự
động làm Registration trở
thành ACTIVE.

BR-DOC-09

State của Document phải
tuân thủ State Machine nếu
hệ thống định nghĩa State.

BR-DOC-10

Hoạt động kiểm tra phải
được Audit theo yêu cầu
của hệ thống.

22. Postconditions

Nếu kiểm tra thành công:

Document
    ↓
Review Result
    ↓
Saved

System ghi nhận:

Reviewed By
Reviewed At
Review Result

Nếu tài liệu hợp lệ:

VALID

Nếu tài liệu không hợp lệ:

INVALID

Nếu cần bổ sung:

REQUIRE_ADDITIONAL_INFO

Hồ sơ tiếp tục theo quy trình
nghiệp vụ tương ứng.

23. Acceptance Criteria
AC01

Processing Officer có thể
mở danh sách tài liệu.

AC02

System kiểm tra Authentication.

AC03

System kiểm tra Permission.

AC04

System kiểm tra Data Scope.

AC05

System kiểm tra Registration.

AC06

System hiển thị tài liệu
được phép truy cập.

AC07

Officer có thể xem tài liệu.

AC08

Officer có thể kiểm tra
loại tài liệu.

AC09

Officer có thể kiểm tra
tính đầy đủ.

AC10

Officer có thể ghi nhận
kết quả kiểm tra.

AC11

System lưu kết quả đúng
với Document.

AC12

System ghi nhận Reviewer.

AC13

System ghi nhận thời gian
kiểm tra.

AC14

System tạo Audit Log.

AC15

Tài liệu không thể truy cập
không được đánh dấu hợp lệ.

AC16

Document Review không
tự động phê duyệt hồ sơ.

AC17

Officer không thể kiểm tra
tài liệu ngoài Data Scope.

AC18

Concurrent Update được
xử lý an toàn.

24. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-OFF-04
↓
Activity Diagram
↓
Sequence Diagram
↓
API
↓
Document Module
↓
Frontend
↓
Database
↓
Implementation

25. Related Use Cases
UC-OFF-02
Tiếp nhận hồ sơ
       ↓
UC-OFF-03
Kiểm tra hồ sơ
       ↓
UC-OFF-04
Kiểm tra tài liệu
       │
       ├───────────────┐
       ↓               ↓
Hợp lệ           Cần bổ sung
       ↓               ↓
Tiếp tục         UC-OFF-05
xử lý             Yêu cầu bổ sung
       ↓
Approver
26. Relationship với Processing Officer

Processing Officer chịu trách
nhiệm kiểm tra nghiệp vụ và
tài liệu trong phạm vi được
phân quyền.

Processing Officer
        ↓
Kiểm tra hồ sơ
        ↓
Kiểm tra tài liệu
        ↓
Đánh giá kết quả
        ↓
Đề xuất / chuyển bước

Quyết định cuối cùng thuộc
Approver nếu tài khoản có
Permission phù hợp.

27. Status

Use Case ID:

UC-OFF-04

Version:

1.0

Status:

Draft

Previous:

UC-OFF-03 — Kiểm tra hồ sơ

Next:

UC-OFF-05 — Yêu cầu bổ sung