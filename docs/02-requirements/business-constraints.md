# BUSINESS CONSTRAINTS
# HỆ THỐNG QUẢN LÝ SINH VIÊN NGOẠI TRÚ

---

# 1. Mục đích

Tài liệu này quy định các giới hạn và điều kiện
nghiệp vụ mà hệ thống phải tuân thủ.

Business Constraint khác với Functional Requirement:

- Functional Requirement:
  Hệ thống phải làm gì?

- Business Rule:
  Quy tắc nghiệp vụ là gì?

- Business Constraint:
  Những giới hạn nào hệ thống bắt buộc phải tuân thủ?

Các Constraint trong tài liệu này là cơ sở để:

- Thiết kế Database.
- Thiết kế API.
- Thiết kế Use Case.
- Thiết kế State Machine.
- Thiết kế Validation.
- Thiết kế phân quyền.
- Viết Test Case.

---

# 2. Phạm vi

Business Constraints áp dụng cho:

- Sinh viên.
- Hồ sơ ngoại trú.
- Nơi ở.
- Chủ trọ.
- Giấy tờ.
- Yêu cầu phát sinh.
- Cán bộ.
- Phê duyệt.
- Thời hạn ngoại trú.
- Thông báo.
- SIS.
- Audit Log.

---

# 3. Quy ước

Các Constraint được đánh mã:

```text
BC-STU-xx
BC-REG-xx
BC-REQ-xx
BC-DOC-xx
BC-ADDR-xx
BC-APP-xx
BC-TIME-xx
BC-ROLE-xx
BC-SIS-xx
BC-AUDIT-xx
4. Student Constraints
BC-STU-01 — Sinh viên phải tồn tại trong hệ thống

Chỉ sinh viên tồn tại trong
nguồn dữ liệu sinh viên hợp lệ
mới được đăng ký ngoại trú.

MSSV là định danh chính của sinh viên.

BC-STU-02 — Một sinh viên chỉ có tối đa một hồ sơ ACTIVE

Tại một thời điểm:

1 STUDENT
   ↓
MAX 1 ACTIVE REGISTRATION

Không cho phép một sinh viên
có đồng thời hai hồ sơ ngoại trú
đang ACTIVE.

BC-STU-03 — Sinh viên phải thuộc đối tượng được đăng ký

Sinh viên phải thỏa điều kiện
do nhà trường quy định để được
đăng ký ngoại trú.

Việc xác định điều kiện cụ thể
được cấu hình theo quy định
của nhà trường.

BC-STU-04 — Thông tin sinh viên lấy từ SIS

Các thông tin định danh chính
của sinh viên phải lấy từ
nguồn dữ liệu sinh viên.

Ví dụ:

MSSV
Họ tên
Ngày sinh
Lớp
Khoa
Ngành
Trạng thái học tập

Sinh viên không được tùy ý
thay đổi các thông tin này
trên hồ sơ ngoại trú.

5. Registration Constraints
BC-REG-01 — Hồ sơ có vòng đời riêng

Hồ sơ ngoại trú có trạng thái
độc lập với REQUEST.

Ví dụ:

DRAFT
SUBMITTED
UNDER_REVIEW
NEED_MORE_INFO
ACTIVE
REJECTED
WITHDRAWN
EXPIRED
TERMINATED

REQUEST không được sử dụng
để thay thế trạng thái của hồ sơ.

BC-REG-02 — REQUEST là entity độc lập

Các yêu cầu phát sinh được
quản lý riêng:

REGISTRATION
      │
      ├── REQUEST
      ├── REQUEST
      └── REQUEST

Các loại REQUEST có thể gồm:

RENEWAL
CHANGE_ADDRESS
TERMINATION

Yêu cầu bổ sung thông tin
được ghi nhận trong quá trình
xử lý hồ sơ/REQUEST tương ứng.

BC-REG-03 — Hồ sơ DRAFT

Hồ sơ ở trạng thái DRAFT:

Có thể được sinh viên chỉnh sửa.
Chưa được cán bộ xử lý.
Chưa được xem là hồ sơ chính thức
đang chờ phê duyệt.
BC-REG-04 — Hồ sơ SUBMITTED

Khi sinh viên gửi hồ sơ:

DRAFT
 ↓
SUBMITTED

Sinh viên không được tùy ý
thay đổi các dữ liệu quan trọng
đã khóa sau khi gửi.

Nếu cần chỉnh sửa,
hệ thống phải có cơ chế phù hợp.

BC-REG-05 — Sinh viên được rút hồ sơ

Hồ sơ đang:

DRAFT
SUBMITTED

có thể được sinh viên rút
theo điều kiện nghiệp vụ.

Khi rút:

SUBMITTED
 ↓
WITHDRAWN

Hành động phải được ghi Audit Log.

BC-REG-06 — Hồ sơ NEED_MORE_INFO

Khi cán bộ yêu cầu bổ sung:

UNDER_REVIEW
      ↓
NEED_MORE_INFO

Sinh viên phải bổ sung
các thông tin hoặc tài liệu
được yêu cầu.

BC-REG-07 — Giới hạn số lần bổ sung

Hệ thống phải giới hạn số lần
sinh viên được yêu cầu bổ sung.

Giá trị giới hạn:

MAX_ADDITION_ATTEMPTS

được quản lý bằng Configuration.

BC-REG-08 — Vượt quá số lần bổ sung

Nếu sinh viên vượt quá số lần
bổ sung được phép:

NEED_MORE_INFO
      ↓
REJECTED

Đây là:

SYSTEM_AUTO_REJECT

và phải được ghi rõ trong
Audit Log.

Không được nhầm với trường hợp
cán bộ chủ động REJECTED.

6. Active Registration Constraints
BC-REG-09 — ACTIVE là trạng thái ngoại trú hợp lệ

Hồ sơ ACTIVE đại diện cho
sinh viên đang có trạng thái
ngoại trú hợp lệ trong hệ thống.

BC-REG-10 — ACTIVE có thời hạn

Hồ sơ ACTIVE phải có:

START_DATE
EXPIRY_DATE
BC-REG-11 — Hết hạn tự động

Khi:

CURRENT_DATE > EXPIRY_DATE

và hồ sơ không được gia hạn
hợp lệ:

ACTIVE
  ↓
EXPIRED

Hệ thống phải thực hiện
chuyển trạng thái tự động.

7. Expired Constraints
BC-REG-12 — EXPIRED không tự động trở lại ACTIVE

Hồ sơ EXPIRED không được
tự động chuyển lại ACTIVE.

BC-REG-13 — Grace Period

Hệ thống có thể hỗ trợ
khoảng thời gian ân hạn:

GRACE_PERIOD

Trong khoảng thời gian này,
sinh viên có thể gửi yêu cầu
gia hạn muộn nếu nhà trường
cho phép.

Việc có hay không có
Grace Period phải được cấu hình.

BC-REG-14 — Hết Grace Period

Nếu hết Grace Period
mà sinh viên không thực hiện
đăng ký hợp lệ:

EXPIRED

vẫn được giữ nguyên.

Nếu cần tiếp tục ngoại trú,
sinh viên phải thực hiện
quy trình đăng ký mới
theo quy định.

8. Renewal Constraints
BC-REQ-01 — Chỉ hồ sơ hợp lệ mới được gia hạn

Sinh viên chỉ được tạo
RENEWAL REQUEST khi hồ sơ
đang ở trạng thái cho phép
gia hạn.

Thông thường:

ACTIVE

và có thể bao gồm:

EXPIRED + GRACE_PERIOD

nếu cấu hình cho phép.

BC-REQ-02 — Gia hạn mặc định 12 tháng

Mỗi lần gia hạn:

RENEWAL_PERIOD = 12 MONTHS

Sinh viên không được tự chọn:

3 tháng
6 tháng
9 tháng
12 tháng

Hệ thống tự xác định thời hạn
theo Configuration.

BC-REQ-03 — Thời hạn chỉ cập nhật sau khi duyệt

Khi sinh viên gửi:

RENEWAL REQUEST

thời hạn hiện tại chưa thay đổi.

Chỉ khi người có quyền
phê duyệt thực hiện APPROVE:

REQUEST
   ↓
APPROVED
   ↓
UPDATE EXPIRY_DATE
BC-REQ-04 — Gia hạn không làm mất lịch sử

Khi gia hạn:

EXPIRY_DATE cũ

không bị xóa khỏi lịch sử.

Hệ thống phải lưu:

Old Expiry Date
New Expiry Date
Approved By
Approved At
Request ID
9. Change Address Constraints
BC-REQ-05 — Đổi nơi ở là REQUEST riêng

Sinh viên đang ACTIVE
muốn đổi nơi ở phải tạo:

CHANGE_ADDRESS REQUEST

Không sửa trực tiếp
CURRENT_ADDRESS.

BC-REQ-06 — Nơi ở cũ vẫn là CURRENT_ADDRESS

Trong khi:

CHANGE_ADDRESS = PENDING

thì:

CURRENT_ADDRESS

vẫn là nơi ở cũ.

Nơi ở mới được lưu dưới dạng:

PROPOSED_ADDRESS

hoặc thông tin thuộc REQUEST.

BC-REQ-07 — Chỉ cập nhật nơi ở sau khi duyệt

Khi CHANGE_ADDRESS được duyệt:

OLD ADDRESS
      ↓
ADDRESS HISTORY

NEW ADDRESS
      ↓
CURRENT ADDRESS
BC-REQ-08 — Đổi nơi ở không tạo hồ sơ mới

Sinh viên đổi nhà trong
thời gian đang ACTIVE:

ACTIVE REGISTRATION
        +
CHANGE_ADDRESS REQUEST

Không tạo Registration mới.

BC-REQ-09 — Thời hạn ngoại trú không tự reset

Khi đổi nơi ở,
thời hạn của hồ sơ hiện tại
không tự động trở thành
12 tháng mới.

Thời hạn chỉ thay đổi khi
có RENEWAL hợp lệ.

10. Termination Constraints
BC-REQ-10 — Kết thúc ngoại trú là REQUEST

Sinh viên không còn ở ngoại trú
có thể gửi:

TERMINATION REQUEST
BC-REQ-11 — Kết thúc phải được xử lý

Sau khi REQUEST được duyệt:

ACTIVE
  ↓
TERMINATED
BC-REQ-12 — TERMINATED không được sử dụng như ACTIVE

Hồ sơ TERMINATED không còn
được tính là hồ sơ ngoại trú
đang hoạt động.

11. Request Concurrency Constraints
BC-REQ-13 — Mỗi hồ sơ tối đa một REQUEST PENDING

Tại một thời điểm:

OPEN_REQUEST <= 1

Ví dụ:

ACTIVE
   +
RENEWAL PENDING

thì không được đồng thời tạo:

CHANGE_ADDRESS PENDING
BC-REQ-14 — REQUEST phải hoàn tất trước khi tạo REQUEST khác

REQUEST hiện tại phải chuyển
sang trạng thái kết thúc:

APPROVED
REJECTED
CANCELLED

trước khi sinh viên tạo
REQUEST mới.

12. Document Constraints
BC-DOC-01 — Hồ sơ phải có tài liệu bắt buộc

Mỗi loại hồ sơ/REQUEST
có thể quy định danh sách
tài liệu bắt buộc.

BC-DOC-02 — Tài liệu phải đúng định dạng

File upload phải đáp ứng:

Định dạng cho phép.
Kích thước tối đa.
Không bị lỗi.
BC-DOC-03 — Không xóa lịch sử tài liệu

Khi sinh viên thay thế
tài liệu:

Document V1
     ↓
Document V2

V1 phải được giữ lại
nếu thuộc dữ liệu cần truy vết.

BC-DOC-04 — Version tài liệu

Mỗi lần thay thế tài liệu
phải tạo Version mới.

Ví dụ:

DOCUMENT
 ├── V1
 ├── V2
 └── V3
13. Address & Landlord Constraints
BC-ADDR-01 — Nơi ở là entity độc lập

Thông tin nơi ở không chỉ
là chuỗi địa chỉ nằm trong
Registration.

Nơi ở phải có entity riêng
để quản lý:

ADDRESS
BC-ADDR-02 — Chủ trọ là entity dùng chung

Chủ trọ nên được quản lý
thành entity riêng:

LANDLORD

để tránh nhập lại cùng
một chủ trọ nhiều lần.

BC-ADDR-03 — Nhiều sinh viên có thể cùng nơi ở

Một nơi ở có thể liên quan
đến nhiều sinh viên.

Ví dụ:

ADDRESS A
   ├── Student A
   ├── Student B
   └── Student C
BC-ADDR-04 — Chữ ký chủ trọ

Hồ sơ phải có giấy tờ hoặc
thông tin xác nhận của chủ trọ
theo quy định nghiệp vụ.

Chủ trọ không bắt buộc
phải có tài khoản đăng nhập
nếu hệ thống không triển khai
chức năng xác nhận trực tuyến.

14. Approval Constraints
BC-APP-01 — Cán bộ tiếp nhận không mặc nhiên có quyền duyệt

Các vai trò được phân tách:

Cán bộ tiếp nhận
Cán bộ xử lý
Cán bộ có quyền duyệt

Quyền hạn của từng vai trò
phải được xác định rõ.

BC-APP-02 — Chỉ APPROVER được duyệt

Chỉ cán bộ có Permission:

APPROVE_REGISTRATION

mới được APPROVE hồ sơ.

BC-APP-03 — Không được tự phê duyệt sai quyền

Frontend không phải là nơi
quyết định quyền.

Backend phải kiểm tra Permission.

BC-APP-04 — Phê duyệt phải có người thực hiện

Mọi quyết định:

APPROVE
REJECT

phải lưu:

Approver
Timestamp
Reason

nếu nghiệp vụ yêu cầu lý do.

15. Role Constraints
BC-ROLE-01 — Student

Sinh viên có thể:

Tạo hồ sơ.
Chỉnh sửa DRAFT.
Gửi hồ sơ.
Rút hồ sơ theo điều kiện.
Bổ sung hồ sơ.
Theo dõi trạng thái.
Gửi REQUEST hợp lệ.

Sinh viên không được:

Duyệt hồ sơ.
Sửa Audit Log.
Xem hồ sơ sinh viên khác.
BC-ROLE-02 — Reception Officer

Cán bộ tiếp nhận có thể:

Tiếp nhận hồ sơ.
Kiểm tra sơ bộ.
Chuyển hồ sơ sang bước xử lý.

Không mặc nhiên có quyền APPROVE.

BC-ROLE-03 — Processing Officer

Cán bộ xử lý có thể:

Kiểm tra hồ sơ.
Kiểm tra tài liệu.
Yêu cầu bổ sung.
Đề xuất kết quả xử lý.

Quyền APPROVE phụ thuộc Permission.

BC-ROLE-04 — Approver

Approver có quyền:

APPROVE.
REJECT.

trong phạm vi dữ liệu được phân quyền.

BC-ROLE-05 — Administrator

Administrator có thể:

Quản lý User.
Quản lý Role.
Quản lý Permission.
Quản lý Configuration.
Xem hệ thống.
Quản lý danh mục.

Administrator không mặc nhiên
được thay đổi dữ liệu nghiệp vụ
nếu không có Permission tương ứng.

16. Data Scope Constraints
BC-ROLE-06 — Phân quyền theo phạm vi dữ liệu

Cán bộ có thể được giới hạn
theo:

Khoa
Đơn vị
Cơ sở
Phạm vi nghiệp vụ

Ví dụ:

Officer A
    ↓
Khoa Công nghệ thông tin

không mặc nhiên được xử lý
hồ sơ của tất cả khoa.

17. Deadline Constraints
BC-TIME-01 — Deadline đăng ký

Hệ thống có thể cấu hình:

REGISTRATION_DEADLINE

theo:

Năm học.
Học kỳ.
Đợt đăng ký.
BC-TIME-02 — Nộp trễ không tự động REJECT

Nếu sinh viên gửi hồ sơ
sau Deadline:

is_late = true

nhưng trạng thái hồ sơ
không tự động chuyển thành
REJECTED.

Cán bộ xử lý theo quy định.

BC-TIME-03 — SLA xử lý

Hệ thống phải có:

PROCESSING_SLA

để xác định thời gian
cán bộ cần xử lý hồ sơ.

BC-TIME-04 — OVERDUE

Nếu quá SLA:

SUBMITTED / UNDER_REVIEW
          ↓
OVERDUE FLAG

OVERDUE là cờ theo dõi,
không nhất thiết là trạng thái
chính của hồ sơ.

BC-TIME-05 — Escalation

Nếu hồ sơ OVERDUE vượt
ngưỡng cho phép:

OVERDUE
   ↓
ESCALATION
   ↓
Cấp quản lý

Hệ thống phải ghi nhận
quá trình escalation.

18. SIS Constraints
BC-SIS-01 — SIS là nguồn dữ liệu sinh viên

SIS là nguồn chính đối với
thông tin học tập và định danh.

BC-SIS-02 — Đồng bộ dữ liệu

Hệ thống ngoại trú phải
đồng bộ trạng thái sinh viên
từ SIS.

BC-SIS-03 — Sinh viên thôi học

Nếu SIS xác định sinh viên:

GRADUATED
WITHDRAWN
DISMISSED

hệ thống phải xử lý hồ sơ
ngoại trú theo chính sách
đã cấu hình.

BC-SIS-04 — Không xóa lịch sử

Khi trạng thái sinh viên
thay đổi, lịch sử hồ sơ
ngoại trú vẫn phải được
giữ lại.

19. Notification Constraints
BC-TIME-06 — Thông báo trước hạn

Hệ thống phải có khả năng
gửi thông báo trước khi:

EXPIRY_DATE

đến gần.

Khoảng thời gian thông báo
được cấu hình.

BC-TIME-07 — Thông báo kết quả

Sinh viên phải nhận được
thông báo khi:

APPROVED
REJECTED
NEED_MORE_INFO
BC-TIME-08 — Không gửi trùng thông báo

Một sự kiện không được
gửi cùng một thông báo
lặp vô hạn.

20. Audit Constraints
BC-AUDIT-01 — Hành động quan trọng phải được ghi log

Bao gồm:

CREATE
SUBMIT
WITHDRAW
APPROVE
REJECT
REQUEST_MORE_INFO
UPLOAD_DOCUMENT
RENEW
CHANGE_ADDRESS
TERMINATE
AUTO_EXPIRE
ESCALATE
SIS_SYNC
BC-AUDIT-02 — Audit phải xác định được nguồn

Audit phải phân biệt:

USER ACTION
SYSTEM ACTION

Ví dụ:

Officer A → REJECTED

khác với:

SYSTEM → AUTO_REJECTED
21. Configuration Constraints
BC-TIME-09 — Các tham số thay đổi phải cấu hình được

Không hard-code các giá trị:

Renewal Period
Maximum Addition Attempts
Grace Period
Deadline
SLA
Notification Threshold
BC-TIME-10 — Configuration phải có hiệu lực theo thời gian

Nếu quy định thay đổi:

2026 → 12 months
2027 → 6 months

hệ thống phải có khả năng
quản lý giá trị theo từng
giai đoạn áp dụng.

Không được làm mất
lịch sử cấu hình cũ.

22. Constraint tổng hợp

Các Constraint quan trọng nhất:

1. Student có tối đa 1 ACTIVE Registration.

2. Registration và Request là hai entity độc lập.

3. Một Registration chỉ có tối đa 1 PENDING Request.

4. Request không được tự ý thay đổi trạng thái Registration
   nếu chưa được xử lý hợp lệ.

5. Gia hạn mặc định 12 tháng.

6. Expiry Date chỉ cập nhật sau khi Renewal được APPROVE.

7. Đổi nơi ở chỉ cập nhật Current Address sau khi APPROVE.

8. Trong lúc Change Address PENDING,
   Current Address vẫn là nơi ở cũ.

9. Đổi nơi ở không tạo Registration mới.

10. Hồ sơ ACTIVE tự chuyển EXPIRED khi hết hạn.

11. Hồ sơ EXPIRED không tự động ACTIVE lại.

12. Có thể cấu hình Grace Period.

13. Hồ sơ nộp trễ dùng is_late,
    không tạo trạng thái LATE.

14. Vượt số lần bổ sung tối đa
    → SYSTEM_AUTO_REJECT.

15. Cán bộ được phân quyền theo Role + Permission + Data Scope.

16. Audit Log phải phân biệt User Action và System Action.

17. Thông tin sinh viên lấy từ SIS.

18. Lịch sử hồ sơ, địa chỉ, tài liệu và quyết định
    phải được giữ lại.

19. Các tham số nghiệp vụ có khả năng thay đổi
    phải được cấu hình.

20. Mọi thay đổi quan trọng phải có khả năng truy vết.
23. Constraint và Database

Các Constraint trên sẽ được
chuyển thành các cơ chế
Database/API tương ứng.

Ví dụ:

BC-STU-02
    ↓
Unique / Filtered Index
    ↓
Một Student chỉ có 1 ACTIVE Registration
BC-REQ-13
    ↓
Database Constraint
+
Application Validation
    ↓
Một Registration chỉ có 1 PENDING Request
BC-DOC-03
    ↓
Document Versioning
    ↓
Không xóa lịch sử
BC-AUDIT-01
    ↓
AUDIT_LOG