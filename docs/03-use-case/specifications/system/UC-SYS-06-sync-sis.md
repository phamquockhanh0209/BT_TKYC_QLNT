# UC-SYS-06 — ĐỒNG BỘ SIS

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-SYS-06 |
| Tên Use Case | Đồng bộ SIS |
| Actor chính | System Scheduler |
| Actor phụ | SIS |
| Nhóm | System |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép System đồng bộ
các thông tin cần thiết từ hệ thống
SIS vào hệ thống quản lý sinh viên
ngoại trú.

SIS được xem là hệ thống bên ngoài
cung cấp dữ liệu sinh viên và trạng
thái học tập cần thiết.

Các dữ liệu có thể bao gồm:

- MSSV.
- Họ tên.
- Lớp.
- Khoa.
- Ngành.
- Trạng thái học tập.

System chỉ đồng bộ những dữ liệu
cần thiết cho nghiệp vụ quản lý
sinh viên ngoại trú.

---

# 3. Preconditions

1. System Scheduler đang hoạt động.

2. SIS có thể được kết nối.

3. Thông tin kết nối SIS đã được
   cấu hình hợp lệ.

4. System có quyền truy cập dữ liệu
   được SIS cung cấp.

5. Database của hệ thống có thể
   truy cập.

6. Mapping giữa dữ liệu SIS và
   dữ liệu nội bộ đã được cấu hình.

---

# 4. Trigger

Use Case được kích hoạt khi
System Scheduler đến thời điểm
đồng bộ theo Configuration.

Ví dụ:

```text
Scheduler
    ↓
Đến thời điểm đồng bộ
    ↓
UC-SYS-06
Đồng bộ SIS

Ngoài ra, hệ thống có thể hỗ trợ
đồng bộ thủ công nếu được
Configuration cho phép.

5. Main Flow
Bước 1

System Scheduler kích hoạt
tác vụ đồng bộ SIS.

Bước 2

System kiểm tra Configuration
kết nối SIS.

Bước 3

System thiết lập kết nối đến SIS.

System
   ↓
SIS
Bước 4

System xác thực kết nối với SIS
theo cơ chế được cấu hình.

Bước 5

System gửi yêu cầu lấy dữ liệu
sinh viên cần đồng bộ.

Bước 6

SIS trả về dữ liệu.

Ví dụ:

MSSV
Họ tên
Lớp
Khoa
Ngành
Trạng thái học tập
Bước 7

System kiểm tra dữ liệu nhận được.

Các kiểm tra có thể bao gồm:

Dữ liệu có tồn tại.
MSSV hợp lệ.
Dữ liệu bắt buộc không bị thiếu.
Định dạng dữ liệu hợp lệ.
Mapping dữ liệu hợp lệ.
Bước 8

System xác định các bản ghi:

NEW
UPDATED
UNCHANGED
INVALID
Bước 9

System cập nhật dữ liệu phù hợp
vào Database.

Bước 10

System không ghi đè dữ liệu
nghiệp vụ ngoại trú nếu dữ liệu
đó không thuộc phạm vi SIS.

Bước 11

System ghi nhận kết quả đồng bộ.

Ví dụ:

Total Records
New Records
Updated Records
Unchanged Records
Invalid Records
Failed Records
Bước 12

System ghi System Audit Log.

Bước 13

System hoàn tất phiên đồng bộ.

6. Dữ liệu được đồng bộ

SIS có thể cung cấp:

MSSV
Họ tên
Lớp
Khoa
Ngành
Trạng thái học tập

System chỉ sử dụng dữ liệu SIS
phục vụ cho nghiệp vụ được xác
định trong phạm vi hệ thống.

7. Data Mapping

Dữ liệu từ SIS phải được mapping
với dữ liệu nội bộ.

Ví dụ:

SIS
 │
 ├── StudentCode
 ├── FullName
 ├── Class
 ├── Faculty
 ├── Major
 └── AcademicStatus
        ↓
Internal Student Data

Mapping phải được xác định bởi
Configuration hoặc Data Model.

8. Alternative Flow
A1 — Không có dữ liệu mới

Nếu SIS không có dữ liệu thay đổi:

System không cập nhật dữ liệu
không cần thiết.

Kết quả:

NEW = 0
UPDATED = 0
UNCHANGED > 0

System ghi nhận phiên đồng bộ
thành công.

A2 — Có dữ liệu mới

Nếu SIS trả về sinh viên chưa
có trong hệ thống:

System tạo hoặc cập nhật
Student Record theo Business
Rules.

A3 — Dữ liệu đã thay đổi

Nếu thông tin sinh viên trên
SIS thay đổi:

System cập nhật dữ liệu
tương ứng.

Ví dụ:

SIS
Faculty A
   ↓
Faculty B

System
Faculty A
   ↓
Faculty B
A4 — Dữ liệu không thay đổi

Nếu dữ liệu SIS giống dữ liệu
hiện tại:

System không thực hiện
UPDATE không cần thiết.

A5 — Đồng bộ theo Batch

Nếu SIS trả về số lượng lớn
bản ghi:

System có thể xử lý theo
Batch.

Ví dụ:

SIS
 ↓
Batch 1
 ↓
Batch 2
 ↓
Batch 3
 ↓
Complete

Kích thước Batch phải theo
Configuration.

A6 — Đồng bộ theo Delta

Nếu SIS hỗ trợ Delta Sync:

System chỉ lấy dữ liệu thay
đổi kể từ lần đồng bộ trước.

Last Sync
    ↓
Changed Data
    ↓
Current Sync
9. Exception Flow
E1 — Không kết nối được SIS

Nếu System không thể kết nối
đến SIS:

System ghi nhận lỗi.

Không cập nhật dữ liệu dựa
trên dữ liệu không nhận được.

E2 — SIS không phản hồi

Nếu SIS không phản hồi trong
thời gian quy định:

System ghi nhận Timeout.

Tác vụ có thể Retry theo
Retry Policy.

E3 — Authentication Failed

Nếu xác thực với SIS thất bại:

System dừng quá trình đồng bộ.

System ghi nhận lỗi.

E4 — Dữ liệu không hợp lệ

Nếu SIS trả về dữ liệu không
hợp lệ:

System không ghi dữ liệu
không hợp lệ vào Database.

System ghi nhận bản ghi lỗi.

E5 — Thiếu dữ liệu bắt buộc

Nếu bản ghi thiếu thông tin
bắt buộc:

System đánh dấu bản ghi
INVALID.

Bản ghi không được cập nhật
nếu Business Rules yêu cầu
dữ liệu đầy đủ.

E6 — Database Error

Nếu Database không thể cập nhật:

System ghi nhận lỗi.

Nếu Batch sử dụng Transaction:

ROLLBACK

được thực hiện theo
Transaction Policy.

E7 — Partial Failure

Nếu một số bản ghi đồng bộ
thành công và một số bản ghi
thất bại:

System phải ghi nhận riêng:

SUCCESS
FAILED

cho từng bản ghi hoặc Batch
theo Configuration.

Không được báo toàn bộ
phiên đồng bộ thành công nếu
vẫn còn lỗi chưa được ghi nhận.

E8 — Concurrent Update

Nếu dữ liệu Student đang
được cập nhật bởi một tác vụ
khác:

System phải kiểm soát
Concurrent Update.

System sử dụng cơ chế phù hợp
theo Data Consistency Policy.

10. Data Ownership

SIS là nguồn cung cấp dữ liệu
sinh viên.

Ví dụ:

SIS
 │
 ├── MSSV
 ├── Họ tên
 ├── Lớp
 ├── Khoa
 ├── Ngành
 └── Trạng thái học tập

Hệ thống quản lý sinh viên
ngoại trú không được tự ý
thay đổi dữ liệu nguồn SIS.

11. Phạm vi đồng bộ

System chỉ đồng bộ các dữ liệu
cần thiết cho nghiệp vụ ngoại trú.

Không đồng bộ:

Điểm.
Học phí.
Thời khóa biểu.
Toàn bộ hồ sơ đào tạo.
Dữ liệu không liên quan đến
nghiệp vụ ngoại trú.
12. Đồng bộ trạng thái học tập

Nếu Business Rules yêu cầu:

SIS
 ↓
Academic Status
 ↓
System
 ↓
Registration / Eligibility

Trạng thái học tập có thể được
sử dụng để kiểm tra điều kiện
nghiệp vụ.

System không tự ý thay đổi
trạng thái học tập do SIS cung
cấp.

13. Sync Status

Một phiên đồng bộ có thể có:

PENDING
RUNNING
SUCCESS
PARTIAL_SUCCESS
FAILED

Ví dụ:

PENDING
   ↓
RUNNING
   ↓
SUCCESS

Hoặc:

PENDING
   ↓
RUNNING
   ↓
PARTIAL_SUCCESS

Hoặc:

PENDING
   ↓
RUNNING
   ↓
FAILED

Tên State thực tế phải phù hợp
với Data Model.

14. Sync History

System nên ghi nhận lịch sử
các phiên đồng bộ.

Thông tin có thể bao gồm:

Sync ID
Start Time
End Time
Status
Total Records
New Records
Updated Records
Unchanged Records
Invalid Records
Failed Records
Error Message
15. Retry

Nếu đồng bộ thất bại do lỗi
tạm thời:

FAILED
   ↓
RETRY
   ↓
RUNNING

System phải giới hạn số lần
Retry theo Configuration.

Không Retry vô hạn.

16. Idempotency

Chạy lại cùng một dữ liệu SIS
không được tạo dữ liệu
trùng lặp.

Ví dụ:

SIS
Student 20240001
      ↓
Sync #1
      ↓
Student Record

Nếu Sync chạy lại:

SIS
Student 20240001
      ↓
Sync #2
      ↓
Không tạo Student Record
trùng lặp

System phải sử dụng khóa hoặc
cơ chế nhận diện phù hợp,
ví dụ MSSV nếu được xác định
là định danh duy nhất.

17. Concurrent Processing

System phải kiểm soát trường
hợp có nhiều Sync Job chạy
đồng thời.

Ví dụ:

Sync Job A
     ↓
    SIS
     ↑
Sync Job B

Không được để hai Job cập nhật
cùng dữ liệu theo cách gây
mất nhất quán.

18. System Audit Log

System ghi nhận các sự kiện:

SIS_SYNC_STARTED
SIS_SYNC_COMPLETED
SIS_SYNC_FAILED
SIS_SYNC_PARTIAL

Audit Log có thể bao gồm:

Sync ID
Start Time
End Time
Status
Total Records
Success Count
Failed Count
Executed By
Error
19. Security

System phải đảm bảo:

Kết nối SIS được bảo vệ.
Thông tin xác thực không
được lưu hoặc ghi Log
dưới dạng không an toàn.
Chỉ dữ liệu cần thiết được
đồng bộ.
Không cho phép Actor không
có quyền thực hiện Sync.
Không tiết lộ dữ liệu SIS
cho người không có quyền.
Audit Log không được sửa
trái phép.
20. Business Constraints
BR-SYS-SIS-01

SIS là nguồn cung cấp dữ liệu
sinh viên bên ngoài.

BR-SYS-SIS-02

System chỉ đồng bộ dữ liệu
cần thiết cho nghiệp vụ
ngoại trú.

BR-SYS-SIS-03

MSSV phải được xử lý theo
quy tắc định danh sinh viên.

BR-SYS-SIS-04

Dữ liệu không hợp lệ không
được ghi vào Database.

BR-SYS-SIS-05

System phải ghi nhận kết quả
đồng bộ.

BR-SYS-SIS-06

Sync phải có khả năng xử lý
lỗi kết nối.

BR-SYS-SIS-07

Retry phải tuân thủ
Retry Policy.

BR-SYS-SIS-08

Sync phải đảm bảo
Idempotency.

BR-SYS-SIS-09

Concurrent Sync phải được
kiểm soát.

BR-SYS-SIS-10

Dữ liệu SIS phải được bảo vệ
theo Security Policy.

21. Postconditions

Nếu đồng bộ thành công:

Sync Status
=
SUCCESS

Nếu một phần bản ghi thất bại:

Sync Status
=
PARTIAL_SUCCESS

Nếu toàn bộ tác vụ thất bại:

Sync Status
=
FAILED

System:

Cập nhật dữ liệu hợp lệ.
Ghi nhận Sync History.
Ghi Audit Log.
Ghi nhận lỗi nếu có.
22. Acceptance Criteria
AC01

System có thể kết nối SIS.

AC02

System xác thực SIS thành công.

AC03

System lấy đúng dữ liệu cần
thiết.

AC04

System mapping dữ liệu đúng.

AC05

System nhận diện dữ liệu
NEW / UPDATED / UNCHANGED.

AC06

System không ghi dữ liệu
không hợp lệ.

AC07

System không tạo dữ liệu
trùng lặp.

AC08

System xử lý Batch nếu
Configuration yêu cầu.

AC09

System xử lý lỗi kết nối SIS.

AC10

System xử lý Timeout.

AC11

System xử lý Database Error.

AC12

System hỗ trợ Retry.

AC13

System ghi nhận Sync History.

AC14

System ghi System Audit Log.

AC15

System kiểm soát Concurrent
Sync.

AC16

System bảo vệ dữ liệu SIS.

23. Traceability

Business Overview
↓
Business Rules
↓
Business Flow
↓
Functional Requirements
↓
UC-SYS-06
↓
Activity Diagram
↓
Sequence Diagram
↓
SIS Integration
↓
Sync Service
↓
Database
↓
Implementation

24. Related Use Cases
UC-SYS-06
Đồng bộ SIS
      ↓
Student Data
      ↓
Registration

Có thể liên quan đến:

UC-REG-01
Xem thông tin cá nhân

và các Use Case kiểm tra
điều kiện hồ sơ.

25. Responsibility
System Scheduler
= Kích hoạt Sync Job

System
= Kết nối SIS
  + Lấy dữ liệu
  + Validate
  + Mapping
  + Update Database
  + Retry
  + Audit
  + Sync History

SIS
= Cung cấp dữ liệu sinh viên

Database
= Lưu dữ liệu nội bộ
  + Sync History
26. Status

Use Case ID:

UC-SYS-06

Version:

1.0

Status:

Draft

Previous:

UC-SYS-05 — Gửi thông báo

Next:

Hoàn thành nhóm System