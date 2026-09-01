# NON-FUNCTIONAL REQUIREMENTS
# HỆ THỐNG QUẢN LÝ SINH VIÊN NGOẠI TRÚ

---

# 1. Mục đích

Tài liệu này đặc tả các yêu cầu phi chức năng
của Website Quản lý Sinh viên Ngoại trú.

Non-Functional Requirements (NFR) quy định
cách hệ thống phải hoạt động về:

- Hiệu năng.
- Bảo mật.
- Tính sẵn sàng.
- Tính tin cậy.
- Khả năng mở rộng.
- Khả năng bảo trì.
- Khả năng sử dụng.
- Khả năng truy vết.
- Tính toàn vẹn dữ liệu.
- Khả năng sao lưu và phục hồi.
- Khả năng tương thích.

Các yêu cầu trong tài liệu này là cơ sở cho
việc thiết kế kiến trúc, Database, API,
Frontend và triển khai Website.

---

# 2. Phạm vi

Các yêu cầu phi chức năng áp dụng cho:

- Website dành cho sinh viên.
- Website dành cho cán bộ.
- Khu vực quản trị.
- Backend/API.
- Database.
- File Storage.
- Notification Service.
- Background Jobs.
- SIS Integration.

---

# 3. Quy ước mã yêu cầu

Các yêu cầu được đặt mã:

```text
NFR-PERF-xx
NFR-SEC-xx
NFR-AVAIL-xx
NFR-REL-xx
NFR-USAB-xx
NFR-SCALE-xx
NFR-DATA-xx
NFR-AUDIT-xx
NFR-BACKUP-xx
NFR-MAINT-xx
NFR-COMPAT-xx
NFR-ACCESS-xx
4. Performance Requirements
NFR-PERF-01 — Thời gian phản hồi

Đối với các thao tác thông thường,
Website phải phản hồi trong thời gian
hợp lý.

Mục tiêu:

95% request thông thường
≤ 2 giây

Không bao gồm:

Upload file lớn.
Export báo cáo lớn.
Đồng bộ SIS.
Các tác vụ nền.
NFR-PERF-02 — Truy vấn danh sách

Các màn hình danh sách hồ sơ,
REQUEST và sinh viên phải sử dụng:

Pagination.
Filtering.
Sorting.

Không tải toàn bộ dữ liệu
về trình duyệt cùng lúc.

NFR-PERF-03 — Tìm kiếm

Các thao tác tìm kiếm phổ biến
phải phản hồi nhanh và không gây
tải lớn cho Database.

Các trường thường được tìm kiếm:

MSSV.
Họ tên.
Mã hồ sơ.
Trạng thái.
Số điện thoại chủ trọ.
Khu vực.
NFR-PERF-04 — Dashboard

Dashboard phải tải các chỉ số
tổng quan trong thời gian hợp lý.

Các thống kê lớn nên được:

Cache.
Aggregate.
Pre-compute.

thay vì truy vấn toàn bộ dữ liệu
mỗi lần người dùng mở Dashboard.

NFR-PERF-05 — Upload tài liệu

Upload tài liệu phải:

Có giới hạn kích thước.
Kiểm tra định dạng.
Có progress nếu cần.
Không làm treo toàn bộ Website.
5. Security Requirements
NFR-SEC-01 — Xác thực

Người dùng phải được xác thực
trước khi truy cập các chức năng
yêu cầu đăng nhập.

NFR-SEC-02 — Authorization

Sau khi xác thực,
hệ thống phải kiểm tra:

USER
 ↓
ROLE
 ↓
PERMISSION
 ↓
DATA SCOPE

Không được chỉ kiểm tra Role
ở phía Frontend.

Backend phải kiểm tra quyền.

NFR-SEC-03 — Bảo vệ dữ liệu cá nhân

Hệ thống phải hạn chế việc
hiển thị thông tin cá nhân
không cần thiết.

Các dữ liệu cần bảo vệ có thể gồm:

MSSV.
Ngày sinh.
Số điện thoại.
Địa chỉ.
Thông tin chủ trọ.
Giấy tờ cá nhân.
NFR-SEC-04 — Bảo vệ mật khẩu

Mật khẩu không được lưu dưới
dạng plaintext.

Hệ thống phải sử dụng cơ chế
hash mật khẩu an toàn.

NFR-SEC-05 — Session / Token

Session hoặc Token phải có:

Thời hạn.
Cơ chế hết hạn.
Cơ chế đăng xuất.
Cơ chế thu hồi khi cần.
NFR-SEC-06 — HTTPS

Dữ liệu trao đổi giữa Browser
và Server phải được bảo vệ
bằng HTTPS khi triển khai thực tế.

NFR-SEC-07 — Chống truy cập trái phép

Hệ thống phải ngăn người dùng
truy cập trực tiếp vào dữ liệu
không thuộc quyền của mình.

Ví dụ:

Student A
    ↓
Registration A

Student A không được truy cập:

Registration B

chỉ bằng cách thay đổi ID
trên URL hoặc API request.

NFR-SEC-08 — Upload file an toàn

File upload phải được kiểm tra:

Extension.
MIME type.
File size.
Tên file.
Nội dung nguy hiểm nếu có cơ chế kiểm tra.

File không nên được lưu trực tiếp
vào thư mục public nếu không cần thiết.

NFR-SEC-09 — Chống các lỗi bảo mật phổ biến

Backend phải có biện pháp hạn chế:

SQL Injection.
XSS.
CSRF nếu kiến trúc sử dụng cookie.
Broken Access Control.
Brute Force.
Malicious File Upload.
6. Availability Requirements
NFR-AVAIL-01 — Tính sẵn sàng

Website phải có khả năng phục vụ
người dùng trong thời gian hoạt động
của nhà trường.

Mục tiêu triển khai:

Availability ≥ 99%

Đối với phiên bản bài tập lớn,
có thể xem đây là mục tiêu thiết kế
thay vì cam kết vận hành thực tế.

NFR-AVAIL-02 — Xử lý lỗi

Khi một chức năng xảy ra lỗi,
Website phải:

Hiển thị thông báo dễ hiểu.
Không làm mất dữ liệu đã lưu.
Ghi log lỗi.
Cho phép người dùng thử lại
khi phù hợp.
NFR-AVAIL-03 — Background Job

Các tác vụ như:

Kiểm tra hết hạn.
Kiểm tra SLA.
Gửi Notification.
Đồng bộ SIS.

nên chạy dưới dạng Background Job
thay vì làm người dùng phải chờ
trực tiếp trên giao diện.

7. Reliability Requirements
NFR-REL-01 — Không mất dữ liệu

Hệ thống phải đảm bảo dữ liệu
đã được xác nhận thành công
không bị mất do lỗi thông thường.

NFR-REL-02 — Transaction

Các nghiệp vụ thay đổi nhiều
bảng dữ liệu phải sử dụng Transaction
khi cần.

Ví dụ:

Approve CHANGE_ADDRESS
        ↓
Update Request
        ↓
Update Current Address
        ↓
Create Address History
        ↓
Audit Log

Các bước phải đảm bảo tính nhất quán.

NFR-REL-03 — Idempotency

Các thao tác tự động hoặc
có khả năng được gửi lại
phải hạn chế việc thực hiện
trùng lặp.

Ví dụ:

Auto Expire Job

không được chuyển cùng một hồ sơ
sang EXPIRED nhiều lần.

NFR-REL-04 — Xử lý đồng thời

Hệ thống phải xử lý trường hợp
nhiều người dùng cùng thao tác.

Ví dụ:

Hai cán bộ cùng mở một hồ sơ.

Hệ thống phải tránh việc:

Officer A → APPROVED
Officer B → REJECTED

mà không có cơ chế kiểm soát.

8. Data Integrity Requirements
NFR-DATA-01 — Referential Integrity

Database phải đảm bảo
quan hệ giữa các entity.

Ví dụ:

STUDENT
   ↓
REGISTRATION
   ↓
REQUEST
   ↓
DOCUMENT

Không được tồn tại Request
tham chiếu đến Registration
không tồn tại.

NFR-DATA-02 — Unique Constraint

Các dữ liệu cần duy nhất
phải có Unique Constraint.

Ví dụ:

MSSV
Email
Registration Code

tùy theo thiết kế Database.

NFR-DATA-03 — State Consistency

Hệ thống phải đảm bảo
chỉ cho phép các chuyển trạng thái
hợp lệ.

Ví dụ:

DRAFT
 ↓
SUBMITTED

Không được tùy ý:

DRAFT
 ↓
ACTIVE

nếu chưa trải qua quy trình
phê duyệt hợp lệ.

NFR-DATA-04 — Request Consistency

Tại một thời điểm:

OPEN REQUEST <= 1

trên một Registration.

NFR-DATA-05 — Current Address Consistency

Một Registration chỉ có:

CURRENT ADDRESS <= 1

tại một thời điểm.

NFR-DATA-06 — Document Version Integrity

Khi thay thế tài liệu,
phiên bản cũ phải được giữ lại
nếu thuộc dữ liệu cần truy vết.

Không được xóa lịch sử
chỉ để cập nhật phiên bản mới.

9. Auditability Requirements
NFR-AUDIT-01 — Audit Log

Các hành động quan trọng
phải được ghi Audit Log.

Ví dụ:

CREATE
SUBMIT
APPROVE
REJECT
WITHDRAW
REQUEST_MORE_INFO
UPLOAD_DOCUMENT
CHANGE_ADDRESS
RENEW
TERMINATE
NFR-AUDIT-02 — Người thực hiện

Audit Log phải xác định được:

Who
What
When
Where/Target
Result
NFR-AUDIT-03 — System Action

Hành động do hệ thống tự động
cũng phải được ghi nhận.

Ví dụ:

SYSTEM_AUTO_EXPIRE
SYSTEM_ESCALATION
SYSTEM_NOTIFICATION
SYSTEM_SIS_SYNC
NFR-AUDIT-04 — Không sửa Audit Log tùy tiện

Audit Log không được cho phép
người dùng thông thường chỉnh sửa.

Quyền truy cập Audit Log
phải được giới hạn.

10. Usability Requirements
NFR-USAB-01 — Giao diện dễ sử dụng

Website phải có giao diện
đơn giản và dễ hiểu.

Các chức năng chính phải
dễ tìm thấy.

NFR-USAB-02 — Responsive

Website phải hỗ trợ:

Desktop.
Laptop.
Tablet.
Mobile.

Đối với bài tập lớn,
Desktop có thể là giao diện
ưu tiên cho cán bộ.

NFR-USAB-03 — Trạng thái rõ ràng

Các trạng thái phải được
hiển thị rõ ràng.

Ví dụ:

DRAFT
SUBMITTED
UNDER REVIEW
NEED MORE INFO
ACTIVE
EXPIRED
REJECTED
TERMINATED

Không chỉ dựa vào màu sắc
để biểu diễn trạng thái.

NFR-USAB-04 — Validation

Form phải kiểm tra dữ liệu
trước khi gửi.

Ví dụ:

Trường bắt buộc.
Số điện thoại.
Ngày tháng.
Định dạng file.
Địa chỉ.

Thông báo lỗi phải chỉ rõ
người dùng cần sửa gì.

NFR-USAB-05 — Confirmation

Các thao tác quan trọng
nên có bước xác nhận.

Ví dụ:

Approve
Reject
Withdraw
Terminate
NFR-USAB-06 — Theo dõi tiến trình

Sinh viên phải dễ dàng biết
hồ sơ đang ở bước nào.

Ví dụ:

✓ Tạo hồ sơ
✓ Gửi hồ sơ
✓ Cán bộ kiểm tra
● Đang chờ phê duyệt
○ Hoàn tất
11. Scalability Requirements
NFR-SCALE-01 — Khả năng mở rộng dữ liệu

Database phải có khả năng
mở rộng khi số lượng:

Sinh viên.
Hồ sơ.
REQUEST.
Document.
Audit Log.

tăng lên.

NFR-SCALE-02 — Pagination

Các danh sách lớn phải
sử dụng Pagination.

NFR-SCALE-03 — Index

Database phải có Index
cho các trường thường xuyên:

Tìm kiếm.
Join.
Filter.
Sort.

Ví dụ:

Student.MSSV
Registration.StudentID
Registration.Status
Registration.ExpiryDate
Request.RegistrationID
Request.Status

Index cụ thể sẽ được xác định
trong giai đoạn Database Design.

NFR-SCALE-04 — Tách tác vụ nền

Các tác vụ nặng nên được
xử lý bất đồng bộ.

Ví dụ:

Generate Report
SIS Sync
Send Notification
Process Expiration
12. Backup & Recovery
NFR-BACKUP-01 — Backup Database

Database phải được sao lưu
định kỳ.

NFR-BACKUP-02 — Backup File

Các tài liệu sinh viên
cũng phải có cơ chế sao lưu
phù hợp.

NFR-BACKUP-03 — Recovery

Hệ thống phải có khả năng
khôi phục dữ liệu khi xảy ra:

Lỗi Database.
Lỗi Server.
Mất dữ liệu.
Sự cố hệ thống.
NFR-BACKUP-04 — Kiểm tra Backup

Backup không chỉ được tạo
mà phải có khả năng kiểm tra
khả năng phục hồi.

13. Maintainability Requirements
NFR-MAINT-01 — Kiến trúc module

Hệ thống nên được chia thành
các module độc lập.

Ví dụ:

Authentication
Student
Registration
Request
Document
Notification
Report
Administration
NFR-MAINT-02 — Tách Frontend / Backend

Website nên được thiết kế
theo mô hình:

Frontend
    ↓
API
    ↓
Backend
    ↓
Database
NFR-MAINT-03 — Configuration

Các giá trị có khả năng thay đổi
không nên hard-code.

Ví dụ:

Renewal Period
Maximum Addition Attempts
SLA
Deadline
Grace Period

Nên được quản lý thông qua
Configuration.

NFR-MAINT-04 — Logging

Backend phải có hệ thống log
để hỗ trợ:

Debug.
Monitoring.
Troubleshooting.
NFR-MAINT-05 — Documentation

Các API và module quan trọng
phải có tài liệu.

14. Compatibility Requirements
NFR-COMPAT-01 — Web Browser

Website phải hỗ trợ các trình duyệt
hiện đại phổ biến.

Ví dụ:

Google Chrome.
Microsoft Edge.
Mozilla Firefox.
NFR-COMPAT-02 — API Compatibility

API phải có cấu trúc rõ ràng
để Frontend có thể giao tiếp
ổn định với Backend.

NFR-COMPAT-03 — Database

Hệ thống phải sử dụng
một hệ quản trị Database
được xác định trong System Design.

Đối với phiên bản hiện tại,
có thể sử dụng:

Microsoft SQL Server
15. Accessibility Requirements
NFR-ACCESS-01 — Khả năng tiếp cận

Các chức năng chính phải
có thể sử dụng dễ dàng
bởi nhiều nhóm người dùng.

NFR-ACCESS-02 — Không phụ thuộc màu sắc

Thông tin quan trọng không được
chỉ biểu diễn bằng màu.

Ví dụ:

Không chỉ:

Màu đỏ = REJECTED

mà phải hiển thị:

REJECTED
NFR-ACCESS-03 — Form Label

Các trường nhập liệu phải
có Label rõ ràng.

16. Privacy Requirements
NFR-PRIV-01 — Hạn chế dữ liệu hiển thị

Người dùng chỉ được xem
dữ liệu cần thiết cho
chức năng của mình.

NFR-PRIV-02 — Student Privacy

Sinh viên không được xem
thông tin hồ sơ của sinh viên khác.

NFR-PRIV-03 — Officer Privacy

Cán bộ chỉ được xem dữ liệu
thuộc Data Scope được cấp.

NFR-PRIV-04 — Document Privacy

Tài liệu cá nhân chỉ được
truy cập bởi người có quyền.

17. Monitoring Requirements
NFR-MON-01 — Theo dõi hệ thống

Hệ thống nên theo dõi:

CPU.
RAM.
Database.
API.
Error Rate.
Response Time.
NFR-MON-02 — Theo dõi Background Job

Các Job phải có trạng thái:

PENDING
RUNNING
SUCCESS
FAILED
NFR-MON-03 — Theo dõi SIS Sync

SIS Sync phải có:

START_TIME
END_TIME
STATUS
SUCCESS_COUNT
ERROR_COUNT
ERROR_MESSAGE
18. Deployment Requirements
NFR-DEPLOY-01 — Môi trường

Hệ thống nên phân chia:

Development
Testing
Production
NFR-DEPLOY-02 — Environment Configuration

Thông tin môi trường không được
hard-code trong source code.

Ví dụ:

Database Connection String
API URL
Storage Path
Email Configuration
NFR-DEPLOY-03 — Migration

Database phải có cơ chế
quản lý Database Migration
khi cấu trúc thay đổi.

19. Error Handling Requirements
NFR-ERR-01 — Thông báo lỗi

Thông báo lỗi cho người dùng
phải dễ hiểu.

Không hiển thị trực tiếp
Stack Trace hoặc thông tin
kỹ thuật nhạy cảm.

NFR-ERR-02 — Logging lỗi

Backend phải ghi lại
thông tin lỗi cần thiết.

NFR-ERR-03 — Retry

Các tác vụ có thể retry
phải có cơ chế retry phù hợp.

Ví dụ:

Notification
SIS Sync
Background Job
20. Traceability

Mỗi NFR phải có thể liên kết
với các tài liệu thiết kế.

Ví dụ:

NFR-SEC-02
    ↓
Authorization Design
    ↓
Middleware
    ↓
API
    ↓
Test Case
21. Tổng hợp Non-Functional Requirements
Nhóm	Mã	Nội dung
Performance	NFR-PERF	Hiệu năng
Security	NFR-SEC	Bảo mật
Availability	NFR-AVAIL	Tính sẵn sàng
Reliability	NFR-REL	Độ tin cậy
Data Integrity	NFR-DATA	Toàn vẹn dữ liệu
Audit	NFR-AUDIT	Truy vết
Usability	NFR-USAB	Khả năng sử dụng
Scalability	NFR-SCALE	Khả năng mở rộng
Backup	NFR-BACKUP	Sao lưu & phục hồi
Maintainability	NFR-MAINT	Bảo trì
Compatibility	NFR-COMPAT	Tương thích
Accessibility	NFR-ACCESS	Khả năng tiếp cận
Privacy	NFR-PRIV	Quyền riêng tư
Monitoring	NFR-MON	Giám sát
Deployment	NFR-DEPLOY	Triển khai
Error Handling	NFR-ERR	Xử lý lỗi
22. Nguyên tắc ưu tiên

Các NFR được phân loại:

Critical

Các yêu cầu bắt buộc:

Authentication.
Authorization.
Data Integrity.
Audit.
Privacy.
Backup.
High

Các yêu cầu quan trọng:

Performance.
Reliability.
Availability.
Error Handling.
Medium

Các yêu cầu hỗ trợ:

Scalability.
Monitoring.
Accessibility.
Maintainability.
23. Mối quan hệ với Functional Requirements

Functional Requirement trả lời:

Hệ thống phải làm gì?

Non-Functional Requirement trả lời:

Hệ thống phải làm việc đó như thế nào?

Ví dụ:

FR-REG-15:

Hệ thống phải cho phép APPROVER
phê duyệt hồ sơ.

NFR-SEC-02:

Chỉ người có Permission
APPROVE_REGISTRATION
mới được thực hiện.

NFR-AUDIT-01:

Hành động phê duyệt phải
được ghi Audit Log.

NFR-PERF-01:

Request phê duyệt phải phản hồi
trong thời gian hợp lý.