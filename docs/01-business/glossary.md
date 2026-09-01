# GLOSSARY
# HỆ THỐNG QUẢN LÝ SINH VIÊN NGOẠI TRÚ

---

## 1. Mục đích

Tài liệu này định nghĩa các thuật ngữ được sử dụng
trong hệ thống Quản lý Sinh viên Ngoại trú.

Mục tiêu:

- Thống nhất cách gọi giữa các tài liệu.
- Tránh một thuật ngữ có nhiều cách hiểu.
- Làm cơ sở xây dựng Requirements.
- Làm cơ sở xây dựng Use Case.
- Làm cơ sở xây dựng Database.
- Làm cơ sở xây dựng API.
- Làm cơ sở xây dựng giao diện Website.

---

# 2. Thuật ngữ nghiệp vụ

## 2.1. Sinh viên

**Định nghĩa:**

Người đang theo học tại trường và sử dụng hệ thống
để thực hiện các nghiệp vụ liên quan đến ngoại trú.

**Mã định danh:**

MSSV (Mã số sinh viên).

---

## 2.2. Ngoại trú

**Định nghĩa:**

Tình trạng sinh viên sinh sống tại nơi ở bên ngoài
phạm vi quản lý nội trú của trường và thuộc phạm vi
phải khai báo theo quy định của nhà trường.

---

## 2.3. Hồ sơ ngoại trú

**Tên tiếng Anh:**

Registration

**Tên kỹ thuật:**

`REGISTRATION`

**Định nghĩa:**

Hồ sơ chính ghi nhận việc sinh viên đăng ký
và duy trì tình trạng ngoại trú.

Một sinh viên có thể có nhiều hồ sơ trong lịch sử,
nhưng tại một thời điểm không được có nhiều hồ sơ
ngoại trú ACTIVE đồng thời.

---

## 2.4. Hồ sơ DRAFT

**Tên kỹ thuật:**

`DRAFT`

**Định nghĩa:**

Hồ sơ đang được sinh viên tạo và chưa gửi
cho nhà trường xử lý.

Sinh viên có thể tiếp tục chỉnh sửa hồ sơ.

---

## 2.5. Hồ sơ SUBMITTED

**Tên kỹ thuật:**

`SUBMITTED`

**Định nghĩa:**

Hồ sơ đã được sinh viên gửi thành công
và đang chờ cán bộ tiếp nhận/xử lý.

---

## 2.6. Hồ sơ UNDER_REVIEW

**Tên kỹ thuật:**

`UNDER_REVIEW`

**Định nghĩa:**

Hồ sơ đang được cán bộ xử lý và kiểm tra.

---

## 2.7. Hồ sơ NEED_MORE_INFO

**Tên kỹ thuật:**

`NEED_MORE_INFO`

**Định nghĩa:**

Hồ sơ chưa đủ thông tin hoặc giấy tờ và
cán bộ yêu cầu sinh viên bổ sung.

---

## 2.8. Hồ sơ APPROVED

**Tên kỹ thuật:**

`APPROVED`

**Định nghĩa:**

Kết quả phê duyệt của hồ sơ.

Trong thiết kế trạng thái chính,
sau khi được phê duyệt hồ sơ chuyển sang
`ACTIVE`.

---

## 2.9. Hồ sơ ACTIVE

**Tên kỹ thuật:**

`ACTIVE`

**Định nghĩa:**

Hồ sơ ngoại trú đã được phê duyệt và
đang có hiệu lực.

Đây là trạng thái xác định sinh viên
đang có hồ sơ ngoại trú hợp lệ.

---

## 2.10. Hồ sơ REJECTED

**Tên kỹ thuật:**

`REJECTED`

**Định nghĩa:**

Hồ sơ bị từ chối bởi cán bộ có thẩm quyền
hoặc bị từ chối theo một quy tắc nghiệp vụ
đã được hệ thống xác định.

Lý do từ chối phải được lưu lại.

---

## 2.11. Hồ sơ WITHDRAWN

**Tên kỹ thuật:**

`WITHDRAWN`

**Định nghĩa:**

Hồ sơ được sinh viên chủ động rút
trong trường hợp trạng thái hiện tại
cho phép rút.

---

## 2.12. Hồ sơ CANCELLED

**Tên kỹ thuật:**

`CANCELLED`

**Định nghĩa:**

Hồ sơ bị hủy trước khi trở thành hồ sơ
ngoại trú có hiệu lực.

Trạng thái này được sử dụng theo chính sách
được thống nhất trong Business Rules.

---

## 2.13. Hồ sơ EXPIRED

**Tên kỹ thuật:**

`EXPIRED`

**Định nghĩa:**

Hồ sơ đã hết thời hạn hiệu lực và
không được gia hạn hợp lệ trước thời điểm hết hạn.

Hồ sơ EXPIRED không còn được xem là
ngoại trú hợp lệ.

---

## 2.14. Hồ sơ TERMINATED

**Tên kỹ thuật:**

`TERMINATED`

**Định nghĩa:**

Hồ sơ ngoại trú đã được kết thúc
theo yêu cầu kết thúc ngoại trú
hoặc theo nghiệp vụ được nhà trường quy định.

---

# 3. Thuật ngữ REQUEST

## 3.1. Request

**Tên kỹ thuật:**

`REQUEST`

**Định nghĩa:**

Yêu cầu phát sinh trong quá trình một hồ sơ
ngoại trú đang tồn tại.

REQUEST là entity độc lập,
không phải là trạng thái của REGISTRATION.

---

## 3.2. Renewal Request

**Tên kỹ thuật:**

`RENEWAL`

**Định nghĩa:**

Yêu cầu gia hạn thời gian hiệu lực
của hồ sơ ngoại trú.

---

## 3.3. Change Address Request

**Tên kỹ thuật:**

`CHANGE_ADDRESS`

**Định nghĩa:**

Yêu cầu thay đổi nơi ở hiện tại
của sinh viên.

---

## 3.4. Termination Request

**Tên kỹ thuật:**

`TERMINATION`

**Định nghĩa:**

Yêu cầu kết thúc tình trạng ngoại trú
của sinh viên.

---

## 3.5. Request PENDING

**Tên kỹ thuật:**

`PENDING`

**Định nghĩa:**

REQUEST đã được tạo nhưng chưa được
cán bộ bắt đầu xử lý.

---

## 3.6. Request UNDER_REVIEW

**Tên kỹ thuật:**

`UNDER_REVIEW`

**Định nghĩa:**

REQUEST đang được cán bộ kiểm tra
và xử lý.

---

## 3.7. Request APPROVED

**Tên kỹ thuật:**

`APPROVED`

**Định nghĩa:**

REQUEST đã được cán bộ có thẩm quyền
phê duyệt.

---

## 3.8. Request REJECTED

**Tên kỹ thuật:**

`REJECTED`

**Định nghĩa:**

REQUEST bị cán bộ có thẩm quyền
từ chối.

Lý do từ chối phải được lưu lại.

---

# 4. Thuật ngữ nơi ở

## 4.1. Nơi ở

**Tên tiếng Anh:**

Residence / Address

**Tên kỹ thuật:**

`ADDRESS`

**Định nghĩa:**

Địa điểm sinh viên đang sinh sống
và được khai báo trong hồ sơ ngoại trú.

---

## 4.2. Nơi ở hiện tại

**Tên kỹ thuật:**

`CURRENT_ADDRESS`

**Định nghĩa:**

Nơi ở đang có hiệu lực của sinh viên.

Chỉ có một nơi ở được xác định là
CURRENT tại một thời điểm đối với
một hồ sơ ngoại trú.

---

## 4.3. Nơi ở lịch sử

**Tên kỹ thuật:**

`ADDRESS_HISTORY`

**Định nghĩa:**

Thông tin về các nơi ở mà sinh viên
đã từng đăng ký trong quá khứ.

Không được xóa nơi ở cũ chỉ vì
sinh viên chuyển sang nơi ở mới.

---

## 4.4. Nơi ở PENDING

**Tên kỹ thuật:**

`PENDING_ADDRESS`

**Định nghĩa:**

Nơi ở mới được khai báo trong
CHANGE_ADDRESS REQUEST nhưng
chưa được phê duyệt.

Trong trạng thái này:

```text
Nơi ở cũ = CURRENT
Nơi ở mới = PENDING
5. Thuật ngữ chủ trọ
5.1. Chủ trọ

Tên tiếng Anh:

Landlord

Tên kỹ thuật:

LANDLORD

Định nghĩa:

Người cho sinh viên thuê nơi ở
và xác nhận thông tin nơi ở
theo giấy tờ/quy trình được nhà trường
quy định.

Chủ trọ không nhất thiết phải có
tài khoản trên hệ thống.

5.2. Thông tin chủ trọ

Có thể bao gồm:

Họ tên.
Số điện thoại.
Thông tin định danh cần thiết.
Thông tin liên hệ.

Thông tin được lưu nhằm phục vụ
đối chiếu và quản lý.

6. Thuật ngữ giấy tờ
6.1. Document

Tên kỹ thuật:

DOCUMENT

Định nghĩa:

Giấy tờ/tài liệu được đính kèm
vào hồ sơ hoặc REQUEST để chứng minh
hoặc xác nhận thông tin.

6.2. Document Version

Tên kỹ thuật:

DOCUMENT_VERSION

Định nghĩa:

Một phiên bản cụ thể của tài liệu.

Khi sinh viên thay thế tài liệu,
phiên bản cũ không bị xóa.

Ví dụ:

DOCUMENT
 ├── VERSION 1
 ├── VERSION 2
 └── VERSION 3
6.3. Current Document Version

Phiên bản tài liệu hiện đang được sử dụng
để đánh giá hồ sơ.

7. Thuật ngữ xử lý
7.1. Cán bộ tiếp nhận

Tên tiếng Anh:

Receiver

Định nghĩa:

Cán bộ có nhiệm vụ tiếp nhận
và kiểm tra sơ bộ hồ sơ.

Không mặc nhiên có quyền phê duyệt.

7.2. Cán bộ xử lý

Tên tiếng Anh:

Processor

Định nghĩa:

Cán bộ thực hiện kiểm tra chi tiết
và xử lý hồ sơ/REQUEST.

7.3. Cán bộ phê duyệt

Tên tiếng Anh:

Approver

Định nghĩa:

Cán bộ có quyền đưa ra quyết định
phê duyệt hoặc từ chối theo phạm vi
được phân quyền.

7.4. Cán bộ phê duyệt cấp cao

Tên tiếng Anh:

Senior Approver

Định nghĩa:

Cán bộ có thẩm quyền cao hơn,
được xử lý các trường hợp escalation
hoặc các trường hợp đặc biệt.

8. Thuật ngữ quản trị
8.1. Administrator

Tên kỹ thuật:

ADMIN

Định nghĩa:

Người quản trị hệ thống.

Có quyền quản lý:

User.
Role.
Permission.
Data Scope.
Configuration.
Danh mục.
Audit Log.
SIS Synchronization.

Administrator không mặc nhiên có quyền
phê duyệt nghiệp vụ.

8.2. Role

Định nghĩa:

Vai trò của người dùng trong hệ thống.

Ví dụ:

STUDENT
RECEIVER
PROCESSOR
APPROVER
SENIOR_APPROVER
ADMIN
8.3. Permission

Định nghĩa:

Quyền thực hiện một hành động cụ thể
trên hệ thống.

Ví dụ:

VIEW_REGISTRATION
PROCESS_REGISTRATION
REQUEST_MORE_INFO
APPROVE_REGISTRATION
REJECT_REGISTRATION
VIEW_REPORT
MANAGE_USER
8.4. Data Scope

Định nghĩa:

Phạm vi dữ liệu mà một người dùng
được phép truy cập.

Ví dụ:

Khoa
Lớp
Đơn vị
Toàn trường
9. Thuật ngữ hệ thống
9.1. SIS

Tên đầy đủ:

Student Information System

Định nghĩa:

Hệ thống quản lý thông tin đào tạo
của nhà trường và là nguồn cung cấp
thông tin sinh viên cho hệ thống
quản lý ngoại trú.

9.2. Synchronization

Tên kỹ thuật:

SYNC

Định nghĩa:

Quá trình đồng bộ dữ liệu giữa hệ thống
quản lý ngoại trú và SIS.

9.3. Sync Log

Định nghĩa:

Nhật ký ghi nhận các lần đồng bộ dữ liệu.

Có thể bao gồm:

Thời gian.
Trạng thái.
Số lượng bản ghi.
Lỗi.
Kết quả.
10. Thuật ngữ thời gian
10.1. Expiry Date

Tên kỹ thuật:

EXPIRY_DATE

Định nghĩa:

Ngày cuối cùng hồ sơ ngoại trú
còn hiệu lực.

10.2. Renewal Period

Tên kỹ thuật:

RENEWAL_PERIOD

Định nghĩa:

Khoảng thời gian được cộng thêm
khi yêu cầu gia hạn được phê duyệt.

Giá trị mặc định hiện tại:

12 tháng

Giá trị này phải được quản lý
thông qua cấu hình nghiệp vụ.

10.3. Deadline

Định nghĩa:

Thời hạn cuối cùng để thực hiện
một nghiệp vụ theo quy định.

Ví dụ:

Deadline đăng ký.
Deadline bổ sung.
Deadline xử lý.
10.4. Grace Period

Định nghĩa:

Khoảng thời gian ân hạn sau khi
hồ sơ hết hạn nếu nhà trường có
chính sách cho phép xử lý gia hạn muộn.

Việc có sử dụng Grace Period hay không
phụ thuộc vào Business Rules đã được
phê duyệt.

11. Thuật ngữ SLA
11.1. SLA

Tên đầy đủ:

Service Level Agreement

Định nghĩa:

Thời gian tối đa được quy định
để cán bộ xử lý một hồ sơ hoặc REQUEST.

11.2. SLA Start

Tên kỹ thuật:

SLA_START_AT

Định nghĩa:

Thời điểm bắt đầu tính SLA.

11.3. Overdue

Tên kỹ thuật:

OVERDUE

Định nghĩa:

Hồ sơ hoặc REQUEST đã vượt
thời hạn SLA nhưng chưa hoàn thành.

11.4. Escalation

Định nghĩa:

Cơ chế chuyển một hồ sơ hoặc REQUEST
quá hạn hoặc đặc biệt lên cấp xử lý cao hơn.

Ví dụ:

Processor
   ↓
Overdue
   ↓
Escalation
   ↓
Senior Approver
12. Thuật ngữ bổ sung
12.1. Is Late

Tên kỹ thuật:

IS_LATE

Định nghĩa:

Cờ xác định hồ sơ được gửi
sau deadline đăng ký.

Giá trị:

TRUE
FALSE

IS_LATE không phải là trạng thái
của REGISTRATION.

12.2. Addition Attempt

Định nghĩa:

Một lần sinh viên bổ sung thông tin
hoặc giấy tờ theo yêu cầu của cán bộ.

12.3. Maximum Addition Attempts

Tên kỹ thuật:

MAX_ADDITION_ATTEMPTS

Định nghĩa:

Số lần tối đa sinh viên được phép
bổ sung hồ sơ.

Giá trị được quản lý bằng
cấu hình nghiệp vụ.

12.4. Audit Log

Tên kỹ thuật:

AUDIT_LOG

Định nghĩa:

Nhật ký ghi nhận các hành động
quan trọng trong hệ thống.

Có thể bao gồm:

Người thực hiện.
Hành động.
Đối tượng.
Thời gian.
Giá trị trước.
Giá trị sau.
Lý do.
Kết quả.
12.5. Notification

Tên kỹ thuật:

NOTIFICATION

Định nghĩa:

Thông báo được hệ thống tạo ra
để cung cấp thông tin về trạng thái
hoặc sự kiện nghiệp vụ cho người dùng.

13. Quan hệ giữa các khái niệm chính
13.1. Student → Registration
STUDENT
   │
   └── REGISTRATION

Một sinh viên có thể có nhiều
REGISTRATION trong lịch sử.

Tại một thời điểm:

ACTIVE REGISTRATION <= 1
13.2. Registration → Request
REGISTRATION
      │
      ├── REQUEST
      ├── REQUEST
      └── REQUEST

Một REGISTRATION có thể có nhiều REQUEST
trong suốt vòng đời.

Nhưng:

OPEN REQUEST <= 1

tại một thời điểm.

13.3. Registration → Address
REGISTRATION
      │
      ├── CURRENT ADDRESS
      │
      └── ADDRESS HISTORY

Nơi ở mới chỉ trở thành CURRENT
sau khi CHANGE_ADDRESS REQUEST
được APPROVED.

13.4. Registration → Document
REGISTRATION
      │
      └── DOCUMENT
              │
              ├── VERSION 1
              ├── VERSION 2
              └── VERSION 3

Không xóa lịch sử phiên bản.

13.5. Request → Audit Log
REQUEST
   ↓
Business Action
   ↓
AUDIT_LOG

Các thay đổi quan trọng phải
có khả năng truy vết.

14. State và Entity cần phân biệt

Để tránh nhầm lẫn:

Entity
STUDENT
REGISTRATION
REQUEST
ADDRESS
LANDLORD
DOCUMENT
DOCUMENT_VERSION
NOTIFICATION
AUDIT_LOG
Registration State
DRAFT
SUBMITTED
UNDER_REVIEW
NEED_MORE_INFO
ACTIVE
REJECTED
WITHDRAWN
CANCELLED
EXPIRED
TERMINATED
Request Type
RENEWAL
CHANGE_ADDRESS
TERMINATION
Request State
PENDING
UNDER_REVIEW
NEED_MORE_INFO
APPROVED
REJECTED
15. Nguyên tắc sử dụng thuật ngữ

Trong toàn bộ dự án:

Sử dụng
REGISTRATION

khi nói về hồ sơ ngoại trú.

Sử dụng
REQUEST

khi nói về yêu cầu phát sinh từ hồ sơ.

Không sử dụng
PENDING_CHANGE_ADDRESS
PENDING_RENEWAL
PENDING_TERMINATION

làm trạng thái của REGISTRATION.

Thay vào đó:

REGISTRATION = ACTIVE

REQUEST
type = CHANGE_ADDRESS
status = PENDING
16. Quy ước tên
Entity

Dùng danh từ:

STUDENT
REGISTRATION
REQUEST
ADDRESS
LANDLORD
DOCUMENT
Status

Dùng chữ in hoa:

ACTIVE
PENDING
APPROVED
REJECTED
EXPIRED
Request Type
RENEWAL
CHANGE_ADDRESS
TERMINATION
Boolean

Dùng tiền tố:

IS_LATE
IS_ACTIVE
IS_CURRENT
17. Tóm tắt thuật ngữ cốt lõi
Thuật ngữ	Ý nghĩa
Student	Sinh viên
Registration	Hồ sơ ngoại trú
Request	Yêu cầu phát sinh
Renewal	Yêu cầu gia hạn
Change Address	Yêu cầu chuyển nơi ở
Termination	Yêu cầu kết thúc
Address	Nơi ở
Current Address	Nơi ở hiện tại
Address History	Lịch sử nơi ở
Landlord	Chủ trọ
Document	Giấy tờ
Document Version	Phiên bản giấy tờ
SIS	Hệ thống quản lý thông tin sinh viên
SLA	Thời hạn xử lý
Overdue	Quá hạn SLA
Escalation	Leo thang xử lý
Audit Log	Nhật ký truy vết
Notification	Thông báo
Role	Vai trò
Permission	Quyền
Data Scope	Phạm vi dữ liệu
Is Late	Cờ nộp trễ
Expiry Date	Ngày hết hạn
Renewal Period	Thời hạn gia hạn
Addition Attempt	Lần bổ sung
Grace Period	Thời gian ân hạn
18. Nguồn sự thật của thuật ngữ

Nếu các tài liệu sau này sử dụng thuật ngữ
khác với Glossary:

Glossary
    ↓
Business Rules
    ↓
Business Flow
    ↓
Requirements
    ↓
Use Case
    ↓
Design
    ↓
Implementation

thì phải xem xét và cập nhật Glossary
hoặc tài liệu liên quan để đảm bảo
tính nhất quán của toàn bộ hệ thống.