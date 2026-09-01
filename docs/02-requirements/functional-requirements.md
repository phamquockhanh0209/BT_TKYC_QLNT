# FUNCTIONAL REQUIREMENTS
# HỆ THỐNG QUẢN LÝ SINH VIÊN NGOẠI TRÚ

---

# 1. Mục đích

Tài liệu này đặc tả các yêu cầu chức năng
của Website Quản lý Sinh viên Ngoại trú.

Mỗi Functional Requirement (FR) được gán
một mã định danh duy nhất để sử dụng xuyên suốt
các tài liệu:

Business
    ↓
Functional Requirement
    ↓
Use Case
    ↓
Activity Diagram
    ↓
Sequence Diagram
    ↓
API
    ↓
Database
    ↓
Website
    ↓
Test Case

---

# 2. Quy ước

## 2.1. Mã Requirement

Các yêu cầu được đặt mã theo module.

Ví dụ:

FR-AUTH-01
FR-STU-01
FR-REG-01
FR-ADDR-01
FR-DOC-01
FR-REQ-01
FR-NOTI-01
FR-SLA-01
FR-REPORT-01
FR-ADMIN-01
FR-SIS-01

---

# 3. Authentication & Authorization

## FR-AUTH-01 — Đăng nhập

Hệ thống phải cho phép người dùng
đăng nhập bằng tài khoản hợp lệ.

Actor:

- STUDENT
- RECEIVER
- PROCESSOR
- APPROVER
- SENIOR_APPROVER
- ADMIN

Kết quả:

- Đăng nhập thành công → chuyển đến Dashboard.
- Đăng nhập thất bại → thông báo lỗi.

---

## FR-AUTH-02 — Đăng xuất

Người dùng phải có khả năng
đăng xuất khỏi hệ thống.

Sau khi đăng xuất,
session/token hiện tại phải được
vô hiệu hóa theo cơ chế bảo mật.

---

## FR-AUTH-03 — Phân quyền theo Role

Hệ thống phải xác định quyền của người dùng
dựa trên Role.

Các Role chính:

- STUDENT
- RECEIVER
- PROCESSOR
- APPROVER
- SENIOR_APPROVER
- ADMIN

---

## FR-AUTH-04 — Phân quyền theo Permission

Hệ thống phải kiểm tra Permission
trước khi cho phép người dùng
thực hiện thao tác nghiệp vụ.

Ví dụ:

- VIEW_REGISTRATION
- PROCESS_REGISTRATION
- REQUEST_MORE_INFO
- APPROVE_REGISTRATION
- REJECT_REGISTRATION
- VIEW_REPORT
- MANAGE_USER

---

## FR-AUTH-05 — Phân quyền theo Data Scope

Hệ thống phải giới hạn dữ liệu
người dùng được phép xem và xử lý
theo Data Scope.

Ví dụ:

```text
Cán bộ khoa A
    ↓
Chỉ xem hồ sơ thuộc phạm vi khoa A
4. Student Management
FR-STU-01 — Xem thông tin cá nhân

Sinh viên có thể xem thông tin
cá nhân được đồng bộ từ SIS.

Thông tin có thể bao gồm:

MSSV
Họ tên
Ngày sinh
Giới tính
Lớp
Khoa
Ngành
Trạng thái học tập
FR-STU-02 — Đồng bộ thông tin sinh viên

Hệ thống phải nhận thông tin sinh viên
từ SIS.

SIS là nguồn dữ liệu chính đối với
thông tin đào tạo của sinh viên.

FR-STU-03 — Theo dõi trạng thái học tập

Hệ thống phải cập nhật trạng thái
học tập của sinh viên theo dữ liệu SIS.

Các trạng thái cần quan tâm:

Đang học
Bảo lưu
Đình chỉ
Thôi học
Tốt nghiệp
5. Registration Management
5.1. Tạo hồ sơ
FR-REG-01 — Tạo hồ sơ ngoại trú

Sinh viên có thể tạo hồ sơ ngoại trú mới.

Hệ thống phải kiểm tra:

Sinh viên có đủ điều kiện đăng ký hay không.
Sinh viên có hồ sơ ACTIVE hay không.
Có hồ sơ đang xử lý xung đột hay không.

Nếu hợp lệ:

Create Registration
        ↓
DRAFT
FR-REG-02 — Kiểm tra hồ sơ ACTIVE

Hệ thống không cho phép sinh viên
có nhiều hơn một hồ sơ ngoại trú ACTIVE
tại cùng một thời điểm.

FR-REG-03 — Lưu hồ sơ nháp

Sinh viên có thể lưu hồ sơ
ở trạng thái DRAFT.

Hồ sơ DRAFT có thể được chỉnh sửa
trước khi gửi.

FR-REG-04 — Chỉnh sửa hồ sơ DRAFT

Sinh viên có thể:

Cập nhật thông tin.
Cập nhật nơi ở.
Upload giấy tờ.
Thay đổi thông tin cần thiết.

Chức năng này chỉ áp dụng khi
hồ sơ còn ở trạng thái cho phép chỉnh sửa.

FR-REG-05 — Gửi hồ sơ

Sinh viên có thể gửi hồ sơ
sau khi hoàn thành các thông tin bắt buộc.

Khi gửi:

DRAFT
  ↓
SUBMITTED

Hệ thống phải ghi nhận:

Người gửi.
Thời gian gửi.
Thời điểm bắt đầu SLA.
Hồ sơ có nộp trễ hay không.
FR-REG-06 — Kiểm tra deadline

Khi sinh viên gửi hồ sơ,
hệ thống phải kiểm tra deadline.

Nếu gửi sau deadline:

IS_LATE = TRUE

Hệ thống không tự động chuyển hồ sơ
sang REJECTED chỉ vì nộp trễ.

FR-REG-07 — Rút hồ sơ

Sinh viên có thể rút hồ sơ
nếu trạng thái hiện tại cho phép.

Ví dụ:

DRAFT
   ↓
WITHDRAWN

SUBMITTED
   ↓
WITHDRAWN

Hệ thống phải kiểm tra trạng thái
trước khi thực hiện.

6. Registration Processing
FR-REG-08 — Tiếp nhận hồ sơ

RECEIVER có thể xem danh sách
hồ sơ SUBMITTED thuộc Data Scope.

RECEIVER có thể:

Tiếp nhận hồ sơ.
Kiểm tra sơ bộ.
Xác định hồ sơ có đầy đủ thông tin hay không.
FR-REG-09 — Chuyển hồ sơ xử lý

Sau khi tiếp nhận,
hồ sơ được chuyển sang bước xử lý.

SUBMITTED
    ↓
UNDER_REVIEW
FR-REG-10 — Kiểm tra chi tiết hồ sơ

PROCESSOR có thể kiểm tra:

Thông tin sinh viên.
Thông tin nơi ở.
Thông tin chủ trọ.
Giấy tờ.
Tính hợp lệ của hồ sơ.
FR-REG-11 — Yêu cầu bổ sung

PROCESSOR có thể yêu cầu sinh viên
bổ sung thông tin hoặc giấy tờ.

UNDER_REVIEW
      ↓
NEED_MORE_INFO

Hệ thống phải lưu:

Nội dung yêu cầu.
Người yêu cầu.
Thời gian.
Deadline bổ sung.
Số lần bổ sung.
FR-REG-12 — Bổ sung hồ sơ

Sinh viên có thể bổ sung
thông tin/giấy tờ theo yêu cầu.

Sau khi hoàn thành:

NEED_MORE_INFO
      ↓
UNDER_REVIEW

Hệ thống phải tăng số lần bổ sung.

FR-REG-13 — Kiểm tra giới hạn bổ sung

Hệ thống phải kiểm tra
số lần bổ sung tối đa.

Nếu vượt quá giới hạn:

Addition Attempts
       >
Maximum Attempts

Hệ thống xử lý theo Business Rules.

Phải phân biệt:

AUTO REJECT

và:

MANUAL REJECT

để phục vụ Audit Log.

7. Approval Management
FR-REG-14 — Trình duyệt

Sau khi hồ sơ được kiểm tra đầy đủ,
PROCESSOR chuyển hồ sơ đến
người có quyền phê duyệt.

FR-REG-15 — Phê duyệt hồ sơ

APPROVER có quyền phê duyệt
hồ sơ thuộc Data Scope.

Khi phê duyệt:

UNDER_REVIEW
      ↓
ACTIVE

Hệ thống phải:

Ghi nhận người duyệt.
Ghi nhận thời gian.
Ghi nhận quyết định.
Ghi Audit Log.
Xác định thời hạn hiệu lực.
FR-REG-16 — Từ chối hồ sơ

APPROVER có quyền từ chối hồ sơ.

Khi từ chối:

UNDER_REVIEW
      ↓
REJECTED

Lý do từ chối là bắt buộc.

FR-REG-17 — Phê duyệt cấp cao

SENIOR_APPROVER có thể xử lý
các trường hợp:

Escalation.
Quá SLA nghiêm trọng.
Trường hợp đặc biệt.
Trường hợp vượt thẩm quyền thông thường.
8. Address Management
FR-ADDR-01 — Khai báo nơi ở

Sinh viên phải khai báo
thông tin nơi ở ngoại trú.

Thông tin có thể gồm:

Tỉnh/thành phố.
Quận/huyện.
Phường/xã.
Địa chỉ chi tiết.
Số phòng.
Thông tin liên quan.
FR-ADDR-02 — Quản lý chủ trọ

Hệ thống phải lưu thông tin chủ trọ
gắn với nơi ở.

Thông tin có thể gồm:

Họ tên.
Số điện thoại.
Thông tin định danh cần thiết.

Chủ trọ không bắt buộc phải
có tài khoản hệ thống.

FR-ADDR-03 — Xác nhận của chủ trọ

Hệ thống cho phép sinh viên
đính kèm giấy tờ xác nhận của chủ trọ
theo quy định.

Việc xác minh cuối cùng thuộc
quy trình kiểm tra của cán bộ.

FR-ADDR-04 — Yêu cầu chuyển nơi ở

Sinh viên có thể tạo:

REQUEST TYPE = CHANGE_ADDRESS

cho hồ sơ ACTIVE.

FR-ADDR-05 — Nơi ở PENDING

Khi yêu cầu chuyển nơi ở
chưa được phê duyệt:

CURRENT ADDRESS
    ↓
Nơi ở cũ

PENDING ADDRESS
    ↓
Nơi ở mới

Nơi ở mới chưa được xem là
nơi ở hiện tại.

FR-ADDR-06 — Cập nhật nơi ở sau phê duyệt

Khi CHANGE_ADDRESS REQUEST
được APPROVED:

OLD ADDRESS
    ↓
ADDRESS HISTORY

NEW ADDRESS
    ↓
CURRENT ADDRESS
FR-ADDR-07 — Lưu lịch sử nơi ở

Hệ thống không được xóa
nơi ở cũ khi sinh viên chuyển nhà.

Lịch sử phải có thể truy vấn.

9. Document Management
FR-DOC-01 — Upload giấy tờ

Sinh viên có thể upload
các giấy tờ cần thiết.

Hệ thống phải kiểm tra:

Loại file.
Kích thước.
Định dạng.
Loại tài liệu.
FR-DOC-02 — Xem giấy tờ

Người có quyền có thể xem
giấy tờ thuộc hồ sơ.

Quyền xem phụ thuộc vào
Role, Permission và Data Scope.

FR-DOC-03 — Thay thế giấy tờ

Sinh viên có thể upload
phiên bản mới khi cần bổ sung
hoặc thay thế tài liệu.

FR-DOC-04 — Quản lý phiên bản

Khi tài liệu được thay thế:

DOCUMENT
   │
   ├── VERSION 1
   ├── VERSION 2
   └── VERSION 3

Phiên bản cũ không bị xóa.

Hệ thống phải xác định được
phiên bản hiện tại.

FR-DOC-05 — Lưu lịch sử tài liệu

Hệ thống phải lưu:

Người upload.
Thời gian upload.
Phiên bản.
Trạng thái.
Lý do thay thế nếu có.
10. Request Management
FR-REQ-01 — Tạo REQUEST

Sinh viên có thể tạo REQUEST
cho hồ sơ ACTIVE khi nghiệp vụ
cho phép.

Các loại REQUEST:

RENEWAL
CHANGE_ADDRESS
TERMINATION
FR-REQ-02 — Kiểm tra REQUEST đang mở

Hệ thống không cho phép một REGISTRATION
có nhiều hơn một REQUEST đang mở
tại cùng thời điểm.

OPEN REQUEST <= 1
FR-REQ-03 — Xem REQUEST

Sinh viên có thể xem:

Loại yêu cầu.
Trạng thái.
Ngày tạo.
Người xử lý.
Kết quả.
Lý do từ chối nếu có.
FR-REQ-04 — Xử lý REQUEST

Cán bộ có quyền có thể:

Tiếp nhận.
Kiểm tra.
Yêu cầu bổ sung.
Phê duyệt.
Từ chối.
FR-REQ-05 — Từ chối REQUEST

Khi REQUEST bị từ chối:

PENDING
   ↓
REJECTED

Lý do từ chối bắt buộc phải được
ghi nhận.

11. Renewal Management
FR-REN-01 — Tạo yêu cầu gia hạn

Sinh viên có thể yêu cầu gia hạn
khi hồ sơ ACTIVE sắp hết hạn
theo quy định.

FR-REN-02 — Không cho sinh viên tự chọn thời hạn

Sinh viên không nhập:

3 tháng
6 tháng
12 tháng

Thay vào đó hệ thống sử dụng
Renewal Period được cấu hình.

FR-REN-03 — Gia hạn 12 tháng

Giá trị mặc định:

RENEWAL_PERIOD = 12 MONTHS
FR-REN-04 — Cập nhật thời hạn sau phê duyệt

Khi RENEWAL REQUEST được APPROVED:

OLD EXPIRY_DATE
        +
RENEWAL_PERIOD
        ↓
NEW EXPIRY_DATE

Hệ thống tự động cập nhật
thời hạn hồ sơ.

FR-REN-05 — Không tự động gia hạn

Việc gia hạn chỉ được thực hiện
sau khi REQUEST được phê duyệt.

12. Expiration Management
FR-EXP-01 — Kiểm tra hồ sơ sắp hết hạn

Hệ thống định kỳ kiểm tra
các hồ sơ ACTIVE sắp hết hạn.

FR-EXP-02 — Thông báo sắp hết hạn

Hệ thống gửi thông báo
cho sinh viên khi hồ sơ
sắp hết hạn.

FR-EXP-03 — Tự động chuyển EXPIRED

Nếu hồ sơ hết hạn và không có
gia hạn hợp lệ:

ACTIVE
   ↓
EXPIRED
FR-EXP-04 — Xử lý hồ sơ EXPIRED

Hồ sơ EXPIRED không còn được
xem là hồ sơ ngoại trú hợp lệ.

Việc khôi phục hoặc đăng ký lại
phải tuân theo Business Rules.

13. Termination Management
FR-TER-01 — Tạo yêu cầu kết thúc

Sinh viên có thể tạo:

REQUEST TYPE = TERMINATION

khi không còn nhu cầu
duy trì ngoại trú.

FR-TER-02 — Xử lý yêu cầu kết thúc

Cán bộ có quyền xử lý
TERMINATION REQUEST.

FR-TER-03 — Kết thúc hồ sơ

Khi yêu cầu được phê duyệt:

ACTIVE
   ↓
TERMINATED

Hệ thống phải lưu:

Thời gian kết thúc.
Người xử lý.
Lý do.
Audit Log.
14. Notification Management
FR-NOTI-01 — Tạo thông báo

Hệ thống phải tạo Notification
khi xảy ra sự kiện nghiệp vụ quan trọng.

FR-NOTI-02 — Thông báo trạng thái hồ sơ

Sinh viên nhận thông báo khi:

Hồ sơ được gửi.
Hồ sơ được tiếp nhận.
Hồ sơ yêu cầu bổ sung.
Hồ sơ được duyệt.
Hồ sơ bị từ chối.
Hồ sơ sắp hết hạn.
Hồ sơ hết hạn.
FR-NOTI-03 — Thông báo REQUEST

Sinh viên nhận thông báo khi:

REQUEST được tiếp nhận.
REQUEST yêu cầu bổ sung.
REQUEST được duyệt.
REQUEST bị từ chối.
FR-NOTI-04 — Thông báo cán bộ

Cán bộ nhận thông báo khi:

Có hồ sơ mới.
Có hồ sơ cần xử lý.
Hồ sơ sắp quá SLA.
Hồ sơ quá SLA.
Có escalation.
FR-NOTI-05 — Theo dõi trạng thái thông báo

Hệ thống lưu:

Đã gửi.
Chưa đọc.
Đã đọc.
Thời gian đọc.
15. SLA Management
FR-SLA-01 — Thiết lập SLA

Hệ thống phải hỗ trợ cấu hình
SLA cho từng loại nghiệp vụ.

FR-SLA-02 — Bắt đầu tính SLA

SLA bắt đầu tính từ thời điểm
được quy định trong Business Rules.

Ví dụ:

SUBMITTED
    ↓
SLA START
FR-SLA-03 — Theo dõi SLA

Hệ thống phải theo dõi:

Thời gian đã xử lý.
Thời gian còn lại.
Deadline.
Trạng thái SLA.
FR-SLA-04 — Đánh dấu OVERDUE

Nếu vượt thời gian SLA:

SLA DEADLINE
     ↓
OVERDUE

Hệ thống phải ghi nhận
thời điểm quá hạn.

FR-SLA-05 — Escalation

Khi hồ sơ quá hạn đến mức
được quy định:

OVERDUE
   ↓
ESCALATION
   ↓
SENIOR_APPROVER
16. Audit & History
FR-AUDIT-01 — Ghi Audit Log

Hệ thống phải ghi nhận
các hành động quan trọng.

FR-AUDIT-02 — Theo dõi người thực hiện

Audit Log phải xác định:

User.
Role.
Action.
Object.
Timestamp.
FR-AUDIT-03 — Theo dõi thay đổi dữ liệu

Đối với các thao tác quan trọng,
hệ thống phải lưu:

BEFORE
AFTER

khi phù hợp.

FR-AUDIT-04 — Ghi nhận hành động tự động

Các hành động do hệ thống thực hiện
cũng phải được ghi nhận.

Ví dụ:

System Auto Expire
System Escalation
System Notification
System SIS Sync
17. Report & Statistics
FR-REPORT-01 — Dashboard

Cán bộ có thể xem Dashboard
tổng quan.

Các chỉ số có thể gồm:

Tổng hồ sơ.
Hồ sơ đang xử lý.
Hồ sơ ACTIVE.
Hồ sơ EXPIRED.
Hồ sơ REJECTED.
Hồ sơ quá SLA.
REQUEST đang xử lý.
FR-REPORT-02 — Thống kê theo khoa

Hệ thống cho phép thống kê
theo khoa.

FR-REPORT-03 — Thống kê theo lớp

Hệ thống cho phép thống kê
theo lớp.

FR-REPORT-04 — Thống kê theo trạng thái

Hệ thống cho phép thống kê
theo trạng thái hồ sơ.

FR-REPORT-05 — Thống kê theo thời gian

Hệ thống cho phép lọc theo:

Ngày.
Tháng.
Học kỳ.
Năm học.
FR-REPORT-06 — Thống kê theo khu vực

Hệ thống cho phép thống kê
sinh viên ngoại trú theo khu vực
nơi ở.

FR-REPORT-07 — Báo cáo xử lý

Hệ thống cho phép thống kê:

Số hồ sơ đã xử lý.
Số hồ sơ được duyệt.
Số hồ sơ bị từ chối.
Số hồ sơ quá hạn.
Tỷ lệ xử lý đúng SLA.
18. Administration
FR-ADMIN-01 — Quản lý User

ADMIN có thể:

Tạo User.
Cập nhật User.
Khóa User.
Mở khóa User.
Xem thông tin User.
FR-ADMIN-02 — Quản lý Role

ADMIN có thể quản lý:

Role.
Tên Role.
Trạng thái Role.
FR-ADMIN-03 — Quản lý Permission

ADMIN có thể:

Thêm Permission.
Gán Permission cho Role.
Thu hồi Permission.
FR-ADMIN-04 — Quản lý Data Scope

ADMIN có thể xác định
phạm vi dữ liệu mà cán bộ
được phép truy cập.

FR-ADMIN-05 — Cấu hình thời hạn

ADMIN có thể cấu hình
các tham số nghiệp vụ liên quan
đến thời hạn.

Ví dụ:

RENEWAL_PERIOD
DEADLINE
GRACE_PERIOD
FR-ADMIN-06 — Cấu hình số lần bổ sung

ADMIN có thể cấu hình:

MAX_ADDITION_ATTEMPTS
FR-ADMIN-07 — Cấu hình SLA

ADMIN có thể cấu hình
thời gian SLA cho từng loại
nghiệp vụ.

FR-ADMIN-08 — Xem Audit Log

ADMIN có thể tra cứu
Audit Log.

Có thể lọc theo:

User.
Action.
Object.
Thời gian.
Module.
19. SIS Synchronization
FR-SIS-01 — Đồng bộ dữ liệu sinh viên

Hệ thống phải đồng bộ
thông tin từ SIS.

FR-SIS-02 — Cập nhật thay đổi

Khi thông tin sinh viên
thay đổi trong SIS,
hệ thống phải cập nhật
dữ liệu tương ứng.

FR-SIS-03 — Đồng bộ trạng thái học tập

Hệ thống phải nhận biết
các thay đổi:

Đang học
Bảo lưu
Đình chỉ
Thôi học
Tốt nghiệp
FR-SIS-04 — Ghi Sync Log

Mỗi lần đồng bộ phải ghi nhận:

Thời gian.
Kết quả.
Số bản ghi.
Số bản ghi thành công.
Số bản ghi lỗi.
Nội dung lỗi nếu có.
20. Automatic Jobs
FR-JOB-01 — Kiểm tra hết hạn

Hệ thống phải có tác vụ tự động
kiểm tra hồ sơ hết hạn.

FR-JOB-02 — Kiểm tra SLA

Hệ thống phải có tác vụ tự động
kiểm tra hồ sơ/REQUEST quá SLA.

FR-JOB-03 — Tạo Escalation

Hệ thống tự động tạo escalation
khi đạt điều kiện quy định.

FR-JOB-04 — Gửi Notification

Hệ thống tự động tạo/gửi
Notification cho các sự kiện
đã cấu hình.

FR-JOB-05 — Đồng bộ SIS

Hệ thống thực hiện đồng bộ SIS
theo lịch hoặc cơ chế được cấu hình.

21. Quy tắc nhất quán chức năng
FR-CONS-01

Một STUDENT không được có
nhiều hơn một REGISTRATION ACTIVE
tại cùng thời điểm.

FR-CONS-02

Một REGISTRATION không được có
nhiều hơn một REQUEST đang mở
tại cùng thời điểm.

FR-CONS-03

Một REGISTRATION chỉ có một
CURRENT ADDRESS tại một thời điểm.

FR-CONS-04

PENDING ADDRESS không được
ghi đè CURRENT ADDRESS
trước khi REQUEST được APPROVED.

FR-CONS-05

Document Version cũ không được
xóa khỏi lịch sử.

FR-CONS-06

Mọi quyết định APPROVED/REJECTED
phải được ghi Audit Log.

FR-CONS-07

Mọi hành động tự động quan trọng
phải được ghi Audit Log.

22. Tổng hợp Functional Requirements
Module	Mã	Nội dung
Authentication	FR-AUTH	Đăng nhập & phân quyền
Student	FR-STU	Quản lý thông tin sinh viên
Registration	FR-REG	Quản lý hồ sơ ngoại trú
Address	FR-ADDR	Quản lý nơi ở
Document	FR-DOC	Quản lý giấy tờ
Request	FR-REQ	Quản lý yêu cầu
Renewal	FR-REN	Gia hạn
Expiration	FR-EXP	Hết hạn
Termination	FR-TER	Kết thúc
Notification	FR-NOTI	Thông báo
SLA	FR-SLA	Theo dõi SLA
Audit	FR-AUDIT	Nhật ký
Report	FR-REPORT	Báo cáo
Admin	FR-ADMIN	Quản trị
SIS	FR-SIS	Đồng bộ SIS
Job	FR-JOB	Tác vụ tự động
Consistency	FR-CONS	Ràng buộc chức năng
23. Tổng quan số lượng yêu cầu

Các Functional Requirement được phân chia
thành các nhóm:

AUTH
STUDENT
REGISTRATION
ADDRESS
DOCUMENT
REQUEST
RENEWAL
EXPIRATION
TERMINATION
NOTIFICATION
SLA
AUDIT
REPORT
ADMIN
SIS
JOB
CONSISTENCY

Các mã FR được sử dụng làm khóa tham chiếu
cho các tài liệu tiếp theo.

24. Requirement Status

Mỗi Functional Requirement có thể được
quản lý theo trạng thái:

DRAFT
REVIEW
APPROVED
CHANGED
DEPRECATED

Trong giai đoạn phân tích,
các requirement có trạng thái:

DRAFT

Sau khi được xác nhận:

APPROVED
25. Requirement Change

Khi một nghiệp vụ thay đổi,
Functional Requirement liên quan
phải được rà soát lại.

Ví dụ:

Business Rule thay đổi
        ↓
FR thay đổi
        ↓
Use Case thay đổi
        ↓
UML thay đổi
        ↓
API thay đổi
        ↓
Database thay đổi
        ↓
UI thay đổi
        ↓
Test Case thay đổi

Không được thay đổi trực tiếp
Database hoặc Website mà bỏ qua
việc cập nhật Requirement.

26. Tài liệu liên quan

Nguồn:

01-business/
├── business-overview.md
├── business-rules.md
├── business-flow.md
└── glossary.md

Requirements:

02-requirements/
├── requirements-overview.md
├── functional-requirements.md
├── non-functional-requirements.md
├── business-constraints.md
└── requirement-traceability.md

Tài liệu tiếp theo:

03-use-cases/
27. Document Status

Document:
Functional Requirements

Version:
1.0

Status:
Draft

Previous:
requirements-overview.md

Next:
non-functional-requirements.md


### 🔥 Có một điểm rất quan trọng

File này **chưa phải Use Case** nhé.

Hiện tại ta mới nói:

> **Website phải làm được gì?**

Ví dụ:

```text
FR-REG-05
Sinh viên có thể gửi hồ sơ.

Sau này sang 03-use-cases mới biến nó thành:

UC-REG-05
Tên: Gửi hồ sơ ngoại trú

Actor: Student

Precondition:
- Sinh viên đã đăng nhập.
- Hồ sơ đang DRAFT.
- Các trường bắt buộc đã đầy đủ.

Main Flow:
1. Sinh viên mở hồ sơ.
2. Hệ thống kiểm tra dữ liệu.
3. Sinh viên nhấn "Gửi hồ sơ".
4. Hệ thống kiểm tra deadline.
5. Hệ thống xác định IS_LATE.
6. Hệ thống chuyển hồ sơ sang SUBMITTED.
7. Hệ thống tạo notification.
8. Hệ thống ghi Audit Log.