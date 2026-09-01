# UC-ADM-04 — QUẢN LÝ CONFIGURATION

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-ADM-04 |
| Tên Use Case | Quản lý Configuration |
| Actor chính | Administrator |
| Nhóm | Administration |
| Priority | High |
| Đối tượng | System Configuration |

---

# 2. Mục đích

Use Case mô tả việc Administrator
quản lý các tham số cấu hình
nghiệp vụ và hệ thống.

Các tham số này được sử dụng
để hệ thống xử lý nghiệp vụ
mà không cần thay đổi source code.

Ví dụ:

- Thời hạn ngoại trú.
- Số lần bổ sung tối đa.
- Thời gian phản hồi bổ sung.
- SLA xử lý hồ sơ.
- Deadline đăng ký.
- Grace Period.
- Tần suất đồng bộ SIS.
- Thời gian gửi thông báo trước hạn.

---

# 3. Nguyên tắc Configuration

Các quy định có khả năng thay đổi
theo năm học hoặc theo chính sách
không nên hard-code trực tiếp
trong chương trình.

Thay vào đó:

```text
Business Rule
      ↓
Configuration
      ↓
System Processing

Ví dụ:

REGISTRATION_DURATION_MONTHS = 12

System sử dụng Configuration
để xác định thời hạn hồ sơ.

4. Các Configuration chính
4.1 Thời hạn ngoại trú

Ví dụ:

REGISTRATION_DURATION_MONTHS

Giá trị:

12

Đơn vị:

month

Ý nghĩa:

Một hồ sơ ngoại trú được cấp
thời hạn theo giá trị cấu hình.

4.2 Số lần bổ sung tối đa
MAX_INFO_REQUEST_COUNT

Ví dụ:

3

Ý nghĩa:

Một hồ sơ không được yêu cầu
bổ sung vượt quá số lần
được cấu hình.

4.3 Thời hạn phản hồi bổ sung
INFO_RESPONSE_DEADLINE_DAYS

Ví dụ:

7

Ý nghĩa:

Sinh viên phải bổ sung hồ sơ
trong thời gian được cấu hình.

4.4 SLA xử lý hồ sơ
REGISTRATION_SLA_HOURS

Ví dụ:

48

Ý nghĩa:

Hồ sơ cần được xử lý trong
khoảng thời gian SLA.

4.5 Grace Period
EXPIRATION_GRACE_PERIOD_DAYS

Ví dụ:

3

Ý nghĩa:

Khoảng thời gian ân hạn sau
khi hồ sơ hết hạn.

Cơ chế sử dụng Grace Period
phải tuân thủ Business Rule
đã được phê duyệt.

4.6 Deadline đăng ký
REGISTRATION_DEADLINE

Có thể được cấu hình theo:

Academic Year
Semester
Start Date
End Date
4.7 Thông báo trước khi hết hạn
EXPIRATION_NOTIFICATION_DAYS

Ví dụ:

30
7
1

System có thể gửi thông báo
trước ngày hết hạn theo
các mốc được cấu hình.

4.8 Tần suất đồng bộ SIS
SIS_SYNC_INTERVAL_MINUTES

Ví dụ:

1440

tương đương một lần mỗi ngày.

Tần suất thực tế phải phù hợp
với kiến trúc tích hợp SIS.

5. Preconditions
Administrator đã đăng nhập.
Phiên đăng nhập còn hiệu lực.
Administrator có Permission
quản lý Configuration.
Hệ thống đang hoạt động.
6. Trigger

Administrator truy cập:

Quản trị
   ↓
Configuration Management
7. Main Flow — Xem Configuration
Bước 1

Administrator mở chức năng
Configuration.

Bước 2

System kiểm tra Permission.

Bước 3

System lấy danh sách
Configuration.

Bước 4

System hiển thị:

Configuration Code
Name
Value
Data Type
Unit
Scope
Effective From
Effective To
Status
Updated At
Updated By
8. Main Flow — Xem chi tiết Configuration
Bước 1

Administrator chọn một
Configuration.

Bước 2

System hiển thị thông tin
chi tiết.

Bước 3

System hiển thị lịch sử
thay đổi Configuration.

Ví dụ:

REGISTRATION_DURATION_MONTHS

2026-01-01 → 12 months
2027-01-01 → 12 months
9. Main Flow — Tạo Configuration

Nếu hệ thống cho phép tạo
Configuration mới:

Bước 1

Administrator chọn:

Tạo Configuration
Bước 2

Administrator nhập:

Code
Name
Value
Data Type
Unit
Description
Effective From
Effective To
Bước 3

System kiểm tra dữ liệu.

Bước 4

System kiểm tra Code
không bị trùng.

Bước 5

System kiểm tra Value
đúng Data Type.

Bước 6

System tạo Configuration.

Bước 7

System ghi Audit Log:

CONFIGURATION_CREATED
10. Main Flow — Cập nhật Configuration
Bước 1

Administrator chọn
Configuration.

Bước 2

Administrator chọn:

Cập nhật
Bước 3

Administrator nhập giá trị mới.

Bước 4

System kiểm tra giá trị.

Bước 5

System kiểm tra thời gian
áp dụng.

Bước 6

System lưu Configuration mới.

Bước 7

System giữ lại lịch sử
Configuration cũ.

Bước 8

System ghi Audit Log:

CONFIGURATION_UPDATED
11. Version Configuration

Configuration nghiệp vụ
không nên ghi đè hoàn toàn
giá trị cũ nếu giá trị đó
đã được sử dụng.

Ví dụ:

Version 1
12 months
Effective From:
2026-01-01

Version 2
12 months
Effective From:
2027-01-01

System phải có khả năng
xác định Configuration
đang có hiệu lực tại
một thời điểm cụ thể.

12. Effective Date

Configuration có thể có:

Effective From
Effective To

Ví dụ:

Configuration
      ↓
Effective From
2026-01-01
      ↓
Effective To
2026-12-31

Configuration chỉ được áp dụng
trong khoảng thời gian hiệu lực.

13. Không áp dụng Configuration
hồi tố tùy tiện

Nếu Administrator thay đổi:

REGISTRATION_DURATION_MONTHS

System không được tự ý
thay đổi thời hạn của các
hồ sơ đã được cấp trước đó,
trừ khi Business Rule quy định
rõ việc áp dụng hồi tố.

Ví dụ:

Registration A
Created: 2026
Duration: 12 months

Nếu Configuration năm 2027
thay đổi:

Duration: 6 months

không được tự động đổi
Registration A thành 6 tháng.

14. Configuration áp dụng
cho hồ sơ mới

Theo nguyên tắc mặc định:

Configuration mới
       ↓
Nghiệp vụ phát sinh sau
thời điểm Effective From

Các hồ sơ cũ giữ lại
giá trị đã được áp dụng
tại thời điểm xử lý.

15. Validation Configuration

System phải kiểm tra:

Integer

Ví dụ:

MAX_INFO_REQUEST_COUNT

phải là số nguyên hợp lệ.

Boolean

Ví dụ:

AUTO_EXPIRE_ENABLED

chỉ nhận:

true
false
Date

Ngày phải đúng định dạng.

Date Range
Effective From
<
Effective To
16. Validation Business Value

System phải kiểm tra
giá trị phù hợp với
Business Rule.

Ví dụ:

MAX_INFO_REQUEST_COUNT = -5

không hợp lệ.

Hoặc:

REGISTRATION_DURATION_MONTHS = 0

không hợp lệ nếu Business Rule
yêu cầu thời hạn lớn hơn 0.

17. Alternative Flow
A1 — Configuration Code trùng

Nếu Code đã tồn tại:

Create Configuration
        ↓
Duplicate Code

System:

Không tạo Configuration.
Hiển thị lỗi.
Yêu cầu nhập Code khác.
A2 — Giá trị không hợp lệ

Ví dụ:

SLA = abc

trong khi Data Type là Integer.

System:

Không lưu.
Hiển thị lỗi.
Yêu cầu nhập lại.
A3 — Configuration chưa đến
thời điểm hiệu lực

Nếu:

Effective From > Current Date

Configuration được lưu
nhưng chưa được sử dụng.

Trạng thái có thể:

SCHEDULED
18. Exception Flow
E1 — Không có Permission

Nếu Administrator không có
Permission:

403 Forbidden

System từ chối thao tác.

E2 — Configuration không tồn tại

System hiển thị:

Configuration Not Found

Không thực hiện cập nhật.

E3 — Xung đột thời gian hiệu lực

Nếu hai Configuration
cùng Code có khoảng thời gian
hiệu lực chồng lấn:

Version A
2026-01-01 → 2026-12-31

Version B
2026-06-01 → 2027-01-01

System từ chối nếu chính sách
không cho phép overlap.

E4 — Database Error

Nếu xảy ra lỗi Database:

Rollback transaction.
Không xác nhận thành công.
Ghi Error Log.
Thông báo lỗi.
19. Các Configuration liên quan
đến Registration
REGISTRATION_DURATION_MONTHS

MAX_INFO_REQUEST_COUNT

INFO_RESPONSE_DEADLINE_DAYS

REGISTRATION_SLA_HOURS

REGISTRATION_DEADLINE

EXPIRATION_GRACE_PERIOD_DAYS

EXPIRATION_NOTIFICATION_DAYS
20. Các Configuration liên quan
đến Request
REQUEST_SLA_HOURS

MAX_PENDING_REQUEST_PER_REGISTRATION

RENEWAL_DURATION_MONTHS

Rule thực tế phải phù hợp
với Business Rules đã được
xác định.

21. Các Configuration liên quan
đến SIS
SIS_SYNC_ENABLED

SIS_SYNC_INTERVAL_MINUTES

SIS_SYNC_RETRY_COUNT

SIS_SYNC_TIMEOUT_SECONDS
22. Các Configuration liên quan
đến Notification
NOTIFICATION_ENABLED

EXPIRATION_NOTIFICATION_DAYS

SLA_WARNING_HOURS
23. Configuration và System Scheduler

Một số Configuration
được System Scheduler sử dụng.

Ví dụ:

REGISTRATION_DURATION_MONTHS
          ↓
Registration Expiration
          ↓
System Scheduler
          ↓
Check Expiration

Hoặc:

REGISTRATION_SLA_HOURS
          ↓
System Scheduler
          ↓
Check SLA
          ↓
OVERDUE
          ↓
Escalation
24. Configuration và State Machine

Configuration có thể ảnh hưởng
đến việc chuyển trạng thái.

Ví dụ:

ACTIVE
  ↓
Expiration Date reached
  ↓
EXPIRED

Thời điểm chuyển trạng thái
được xác định dựa trên
Business Rule và Configuration
đang có hiệu lực.

25. Configuration không thay thế
Business Rule

Business Rule xác định:

Điều gì được phép?

Configuration xác định:

Giá trị cụ thể là bao nhiêu?

Ví dụ:

Business Rule:

Hồ sơ ngoại trú có thời hạn
theo quy định hiện hành.

Configuration:

REGISTRATION_DURATION_MONTHS = 12
26. Configuration và Audit Log

Mọi thay đổi Configuration
quan trọng phải được ghi lại.

Ví dụ:

CONFIGURATION_CREATED
CONFIGURATION_UPDATED
CONFIGURATION_ACTIVATED
CONFIGURATION_DEACTIVATED

Audit Log:

Actor
Action
Configuration Code
Old Value
New Value
Timestamp
Reason
Result
27. Không xóa Configuration
đã được sử dụng

Configuration đã từng được
sử dụng trong nghiệp vụ
không nên bị xóa vật lý.

Ưu tiên:

ACTIVE
INACTIVE
EXPIRED

hoặc lưu version lịch sử.

Mục tiêu:

Traceability
28. Phân quyền

Các Permission có thể gồm:

VIEW_CONFIGURATION
CREATE_CONFIGURATION
UPDATE_CONFIGURATION
ACTIVATE_CONFIGURATION
DEACTIVATE_CONFIGURATION
VIEW_CONFIGURATION_HISTORY

Administrator chỉ được thao tác
khi có Permission tương ứng.

29. Business Constraints
BR-CONFIG-01

Configuration Code phải duy nhất.

BR-CONFIG-02

Configuration phải có
Data Type rõ ràng.

BR-CONFIG-03

Configuration phải được
validate trước khi lưu.

BR-CONFIG-04

Configuration có thời gian
hiệu lực phải xác định rõ
Effective From và Effective To
khi cần.

BR-CONFIG-05

Không được có hai version
cùng Code cùng có hiệu lực
trong cùng một thời điểm
nếu chính sách không cho phép.

BR-CONFIG-06

Configuration mới không
tự động áp dụng hồi tố cho
hồ sơ cũ nếu không có
Business Rule cho phép.

BR-CONFIG-07

Configuration đã được sử dụng
không được xóa vật lý
tùy tiện.

BR-CONFIG-08

Mọi thay đổi Configuration
quan trọng phải được
ghi Audit Log.

BR-CONFIG-09

Chỉ Actor có Permission
phù hợp mới được thay đổi
Configuration.

BR-CONFIG-10

Configuration không được
vượt qua Business Rule.

30. Postconditions

Sau khi tạo thành công:

Configuration
      ↓
Created

Sau khi cập nhật:

Old Version
      ↓
History

New Version
      ↓
Active / Scheduled

System sử dụng Configuration
đang có hiệu lực cho các
nghiệp vụ tương ứng.

Audit Log được ghi nhận.

31. Acceptance Criteria
AC01

Administrator có thể xem
Configuration.

AC02

Administrator có thể xem
chi tiết Configuration.

AC03

Configuration Code không
được trùng.

AC04

Giá trị Configuration phải
đúng Data Type.

AC05

Giá trị Configuration phải
phù hợp Business Rule.

AC06

Administrator có thể cập nhật
Configuration nếu có quyền.

AC07

Configuration có thể có
Effective From và Effective To.

AC08

Configuration có thể được
version hóa.

AC09

Configuration mới không
tự động thay đổi dữ liệu
lịch sử.

AC10

Configuration đã được sử dụng
không bị xóa vật lý tùy tiện.

AC11

Configuration quan trọng
được ghi Audit Log.

AC12

System Scheduler có thể
sử dụng Configuration.

AC13

Configuration không được
vượt qua Business Rule.

AC14

Authorization được kiểm tra
trước khi thay đổi.

32. Traceability
Business Rules
      ↓
Configuration Rules
      ↓
Functional Requirements
      ↓
UC-ADM-04
      ↓
Activity Diagram
      ↓
Sequence Diagram
      ↓
Configuration Module
      ↓
Database
      ↓
Implementation
33. Status

Use Case ID:

UC-ADM-04

Version:

1.0

Status:

Draft

Previous:

UC-ADM-03 — Quản lý Permission

Next:

UC-ADM-05 — Quản lý danh mục