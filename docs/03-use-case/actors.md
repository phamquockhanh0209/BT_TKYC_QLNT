# ACTORS
# HỆ THỐNG QUẢN LÝ SINH VIÊN NGOẠI TRÚ

---

# 1. Mục đích

Tài liệu này định nghĩa các Actor tương tác
với Website Quản lý Sinh viên Ngoại trú.

Tài liệu xác định:

- Actor là ai.
- Mục tiêu của Actor.
- Trách nhiệm của Actor.
- Các chức năng Actor được phép thực hiện.
- Các chức năng Actor không được phép thực hiện.
- Role tương ứng.
- Permission liên quan.
- Phạm vi dữ liệu được phép truy cập.

Tài liệu này là cơ sở để xây dựng:

- Use Case List.
- Use Case Specification.
- Use Case Diagram.
- Activity Diagram.
- Sequence Diagram.
- Authorization Model.

---

# 2. Khái niệm Actor

Actor là đối tượng bên ngoài hệ thống
tương tác với Website để thực hiện
một hoặc nhiều mục tiêu nghiệp vụ.

Actor có thể là:

- Người dùng.
- Hệ thống bên ngoài.
- Tác nhân tự động.

Trong hệ thống này có 7 Actor chính:

```text
1. Student
2. Reception Officer
3. Processing Officer
4. Approver
5. Administrator
6. SIS
7. System Scheduler
3. Phân loại Actor
3.1. Human Actor

Các Actor là con người:

Student
Reception Officer
Processing Officer
Approver
Administrator
3.2. External System Actor

Hệ thống bên ngoài:

SIS

SIS cung cấp dữ liệu sinh viên cần thiết
cho Website Quản lý Sinh viên Ngoại trú.

3.3. Automated Actor

Tác nhân tự động:

System Scheduler

System Scheduler thực hiện các tác vụ
định kỳ hoặc tự động của hệ thống.

4. Student — Sinh viên
4.1. Mục tiêu

Sinh viên sử dụng Website để:

Đăng ký ngoại trú.
Quản lý hồ sơ ngoại trú.
Cập nhật thông tin được phép.
Theo dõi tình trạng hồ sơ.
Bổ sung hồ sơ.
Gửi yêu cầu gia hạn.
Gửi yêu cầu chuyển nơi ở.
Gửi yêu cầu kết thúc ngoại trú.
Theo dõi lịch sử xử lý.
4.2. Role
Role:
STUDENT
4.3. Quyền chính

Sinh viên được phép:

Đăng nhập.
Đăng xuất.
Xem thông tin cá nhân được cung cấp từ SIS.
Tạo hồ sơ ngoại trú.
Chỉnh sửa hồ sơ khi ở trạng thái DRAFT.
Khai báo nơi ở.
Upload giấy tờ.
Gửi hồ sơ.
Theo dõi trạng thái hồ sơ.
Rút hồ sơ khi thỏa điều kiện.
Bổ sung hồ sơ khi có yêu cầu.
Upload phiên bản tài liệu bổ sung.
Xem lịch sử hồ sơ của chính mình.
Gửi Request hợp lệ.
Theo dõi Request của chính mình.
Xem thông báo của mình.
4.4. Registration Permission

Các Permission có thể bao gồm:

VIEW_OWN_REGISTRATION
CREATE_REGISTRATION
EDIT_OWN_DRAFT
SUBMIT_REGISTRATION
WITHDRAW_OWN_REGISTRATION
SUPPLEMENT_OWN_REGISTRATION
VIEW_OWN_REGISTRATION_HISTORY
4.5. Request Permission
CREATE_RENEWAL_REQUEST
CREATE_CHANGE_ADDRESS_REQUEST
CREATE_TERMINATION_REQUEST
VIEW_OWN_REQUEST
4.6. Document Permission
UPLOAD_OWN_DOCUMENT
VIEW_OWN_DOCUMENT
REPLACE_OWN_DOCUMENT
VIEW_OWN_DOCUMENT_HISTORY
4.7. Không được phép

Sinh viên không được:

Phê duyệt hồ sơ.
Từ chối hồ sơ.
Phê duyệt Request.
Từ chối Request.
Sửa trạng thái hồ sơ trực tiếp.
Sửa Audit Log.
Xóa Audit Log.
Xem hồ sơ của sinh viên khác.
Xem dữ liệu ngoài phạm vi được cấp.
Tự thay đổi thời hạn gia hạn.
Tự chuyển Registration sang ACTIVE.
Tự chuyển Registration sang TERMINATED.
Tự chuyển Registration sang EXPIRED.
4.8. Data Scope
OWN_DATA

Sinh viên chỉ được truy cập dữ liệu
thuộc về chính mình.

5. Reception Officer — Cán bộ tiếp nhận
5.1. Mục tiêu

Cán bộ tiếp nhận thực hiện bước tiếp nhận
và kiểm tra sơ bộ hồ sơ do sinh viên gửi.

5.2. Role
Role:
RECEPTION_OFFICER
5.3. Trách nhiệm
Tiếp nhận hồ sơ.
Kiểm tra sơ bộ.
Kiểm tra tính đầy đủ ban đầu.
Phát hiện hồ sơ thiếu thông tin cơ bản.
Chuyển hồ sơ sang bước xử lý.
5.4. Quyền chính
VIEW_SUBMITTED_REGISTRATION
CHECK_REGISTRATION_BASIC
ACCEPT_REGISTRATION
FORWARD_REGISTRATION
5.5. Có thể thực hiện
Xem hồ sơ được phân công hoặc thuộc phạm vi.
Kiểm tra thông tin cơ bản.
Kiểm tra tình trạng nộp hồ sơ.
Kiểm tra sự tồn tại của tài liệu.
Tiếp nhận hồ sơ.
Chuyển hồ sơ sang Processing Officer.
5.6. Không được mặc nhiên phép

Cán bộ tiếp nhận không được:

Phê duyệt cuối cùng.
Từ chối cuối cùng.
Tự thay đổi thời hạn ngoại trú.
Tự thay đổi trạng thái ACTIVE.
Tự phê duyệt Request.
Xóa Audit Log.

Nếu được cấp Permission đặc biệt,
quyền thực tế được xác định bởi
Authorization Model.

5.7. Data Scope
ASSIGNED_SCOPE

Chỉ được xem và xử lý hồ sơ
thuộc phạm vi được phân quyền.

6. Processing Officer — Cán bộ xử lý
6.1. Mục tiêu

Cán bộ xử lý thực hiện kiểm tra nghiệp vụ
chi tiết đối với hồ sơ.

6.2. Role
Role:
PROCESSING_OFFICER
6.3. Trách nhiệm
Kiểm tra thông tin hồ sơ.
Kiểm tra giấy tờ.
Kiểm tra thông tin nơi ở.
Đánh giá tính hợp lệ của hồ sơ.
Yêu cầu sinh viên bổ sung.
Theo dõi tiến độ xử lý.
Đề xuất kết quả xử lý.
6.4. Quyền chính
VIEW_ASSIGNED_REGISTRATION
CHECK_REGISTRATION
CHECK_DOCUMENT
CHECK_ADDRESS
REQUEST_MORE_INFO
VIEW_PROCESSING_HISTORY
PROPOSE_DECISION
6.5. Có thể thực hiện
Xem hồ sơ được phân công.
Kiểm tra thông tin.
Kiểm tra tài liệu.
Kiểm tra nơi ở.
Yêu cầu bổ sung.
Theo dõi số lần bổ sung.
Ghi nhận kết quả kiểm tra.
Đề xuất duyệt hoặc từ chối.
6.6. Không được mặc nhiên phép

Cán bộ xử lý không được:

Phê duyệt cuối cùng nếu không có Permission.
Từ chối cuối cùng nếu không có Permission.
Tự thay đổi dữ liệu SIS.
Sửa Audit Log.
Xóa Audit Log.
Tự thay đổi trạng thái hồ sơ ngoài
các chuyển đổi được cho phép.
6.7. Data Scope
ASSIGNED_SCOPE

Cán bộ xử lý chỉ được truy cập
hồ sơ thuộc phạm vi được phân công.

7. Approver — Cán bộ có quyền duyệt
7.1. Mục tiêu

Approver chịu trách nhiệm đưa ra
quyết định cuối cùng đối với hồ sơ
và các Request thuộc phạm vi được phân quyền.

7.2. Role
Role:
APPROVER
7.3. Trách nhiệm
Xem hồ sơ đủ điều kiện duyệt.
Kiểm tra kết quả xử lý.
Phê duyệt hồ sơ.
Từ chối hồ sơ.
Phê duyệt Request.
Từ chối Request.
Ghi nhận lý do quyết định khi cần.
7.4. Permission
VIEW_APPROVAL_QUEUE
APPROVE_REGISTRATION
REJECT_REGISTRATION
APPROVE_REQUEST
REJECT_REQUEST
7.5. Phê duyệt Registration

Approver có thể thực hiện:

UNDER_REVIEW
      ↓
APPROVED
      ↓
ACTIVE

Nếu từ chối:

UNDER_REVIEW
      ↓
REJECTED
7.6. Phê duyệt Renewal Request

Khi Renewal Request được phê duyệt:

Request
PENDING
   ↓
APPROVED

Sau đó hệ thống thực hiện cập nhật
thời hạn Registration theo Configuration.

7.7. Phê duyệt Change Address Request

Khi Request chuyển nơi ở được phê duyệt:

Proposed Address
       ↓
Current Address

Địa chỉ cũ được lưu vào lịch sử.

7.8. Phê duyệt Termination Request

Khi Request kết thúc ngoại trú
được phê duyệt:

ACTIVE
   ↓
TERMINATED
7.9. Không được phép

Approver không được:

Sửa Audit Log.
Xóa Audit Log.
Tự ý thay đổi Permission.
Tự thay đổi Configuration.
Xóa dữ liệu lịch sử.
Phê duyệt ngoài Data Scope.
7.10. Data Scope
APPROVAL_SCOPE

Approver chỉ được phê duyệt
hồ sơ và Request thuộc phạm vi
được phân quyền.

8. Administrator — Quản trị viên
8.1. Mục tiêu

Administrator chịu trách nhiệm quản trị
tài khoản, quyền truy cập, cấu hình và
danh mục của Website.

8.2. Role
Role:
ADMINISTRATOR
8.3. Trách nhiệm
Quản lý User.
Quản lý Role.
Quản lý Permission.
Quản lý Configuration.
Quản lý danh mục.
Xem Audit Log.
Quản lý các thiết lập hệ thống.
8.4. Permission
MANAGE_USER
MANAGE_ROLE
MANAGE_PERMISSION
MANAGE_CONFIGURATION
MANAGE_MASTER_DATA
VIEW_AUDIT_LOG
8.5. Configuration có thể quản lý

Ví dụ:

Renewal Period
Supplement Limit
SLA
Escalation Threshold
Deadline
Notification Configuration

Ví dụ:

Renewal Period = 12 tháng

Nếu quy định thay đổi:

12 tháng
   ↓
Configuration mới

Việc thay đổi Configuration phải
được ghi nhận vào Audit Log.

8.6. Không mặc nhiên được phép

Administrator không mặc nhiên được:

Phê duyệt Registration.
Từ chối Registration.
Phê duyệt Request.
Từ chối Request.

Nếu Administrator đồng thời được cấp
Permission nghiệp vụ tương ứng thì
hệ thống mới cho phép thực hiện.

8.7. Data Scope
SYSTEM_SCOPE

Administrator có phạm vi quản trị
toàn hệ thống theo Permission.

9. SIS — Student Information System
9.1. Loại Actor
External System
9.2. Mục tiêu

SIS cung cấp dữ liệu sinh viên cần thiết
cho Website Quản lý Sinh viên Ngoại trú.

9.3. Dữ liệu cung cấp

Có thể bao gồm:

MSSV
Họ tên
Lớp
Khoa
Ngành
Trạng thái học tập
9.4. Trách nhiệm

SIS là nguồn cung cấp dữ liệu
sinh viên thuộc phạm vi tích hợp.

Website ngoại trú không tự ý sửa
dữ liệu gốc trên SIS.

9.5. Interaction
SIS
   ↓
Student Data
   ↓
Ngoại trú System

Các dữ liệu được sử dụng để:

Xác định sinh viên.
Hiển thị thông tin cá nhân.
Kiểm tra trạng thái học tập.
Hỗ trợ kiểm tra điều kiện nghiệp vụ.
9.6. Không phải User

SIS:

Không đăng nhập Website như người dùng.
Không sử dụng giao diện Website.
Không phê duyệt hồ sơ.
Không xử lý Request.
Không quản lý Audit Log của Website.
10. System Scheduler — Tác nhân tự động
10.1. Loại Actor
Automated Actor
10.2. Mục tiêu

System Scheduler thực hiện các tác vụ
tự động theo lịch hoặc theo sự kiện.

10.3. Trách nhiệm

Bao gồm:

Kiểm tra hồ sơ sắp hết hạn.
Kiểm tra hồ sơ đã hết hạn.
Chuyển Registration sang EXPIRED.
Kiểm tra SLA.
Xác định hồ sơ OVERDUE.
Thực hiện Escalation.
Gửi Notification.
Đồng bộ SIS theo lịch cấu hình.
Ghi System Audit Log.
10.4. Permission

System Scheduler sử dụng
System Permission nội bộ.

Ví dụ:

SYSTEM_CHECK_EXPIRY
SYSTEM_UPDATE_STATUS
SYSTEM_CHECK_SLA
SYSTEM_ESCALATE
SYSTEM_SEND_NOTIFICATION
SYSTEM_SYNC_SIS
SYSTEM_WRITE_AUDIT_LOG
10.5. Tự động chuyển EXPIRED

Ví dụ:

Registration
Status = ACTIVE

Expiry Date < Current Date
        ↓
System Scheduler
        ↓
EXPIRED

Thao tác này phải được ghi nhận:

Source = SYSTEM
Action = AUTO_EXPIRE
11. Actor Responsibility Matrix
Actor	Registration	Request	Document	Approval	Administration	SIS
Student	Own	Own	Own	Không	Không	Không
Reception Officer	Tiếp nhận	Không mặc định	Kiểm tra sơ bộ	Không	Không	Không
Processing Officer	Kiểm tra	Xử lý nghiệp vụ	Kiểm tra	Không mặc định	Không	Không
Approver	Quyết định	Quyết định	Xem	Có	Không	Không
Administrator	Quản trị hệ thống	Không mặc định	Không mặc định	Không mặc định	Có	Không
SIS	Cung cấp dữ liệu	Không	Không	Không	Không	Có
System Scheduler	Tự động	Tự động theo rule	Không	Không	Tác vụ hệ thống	Đồng bộ
12. Actor Permission Model

Quyền truy cập không được xác định
chỉ dựa vào tên Actor.

Mô hình:

User
  ↓
Role
  ↓
Permission
  ↓
Data Scope

Ví dụ:

Nguyễn Văn A
      ↓
APPROVER
      ↓
APPROVE_REGISTRATION
      ↓
Khoa được phân quyền

Do đó:

Hai người cùng có Role APPROVER
vẫn có thể có Data Scope khác nhau.

13. Data Scope

Hệ thống sử dụng Data Scope để
giới hạn dữ liệu mà Actor có thể truy cập.

Các Scope chính:

OWN_DATA
ASSIGNED_SCOPE
APPROVAL_SCOPE
SYSTEM_SCOPE
EXTERNAL_SYSTEM_SCOPE
SYSTEM_INTERNAL_SCOPE
13.1. OWN_DATA

Áp dụng chủ yếu cho Student.

Ví dụ:

Student A
   ↓
Chỉ xem Registration của Student A
13.2. ASSIGNED_SCOPE

Áp dụng cho cán bộ được phân công.

Ví dụ:

Processing Officer
       ↓
Hồ sơ được phân công
13.3. APPROVAL_SCOPE

Áp dụng cho Approver.

Ví dụ:

Approver
   ↓
Hồ sơ thuộc phạm vi phê duyệt
13.4. SYSTEM_SCOPE

Áp dụng cho Administrator
theo Permission quản trị.

14. Nguyên tắc phân quyền
Rule 1

Actor chỉ được thực hiện Use Case
nếu có Permission tương ứng.

Rule 2

Permission phải được kiểm tra
trước khi thực hiện thao tác.

Rule 3

Permission phải kết hợp với
Data Scope.

Permission
     +
Data Scope
     ↓
Effective Access
Rule 4

Administrator không mặc nhiên
có quyền nghiệp vụ phê duyệt.

Rule 5

Student chỉ được truy cập
dữ liệu của chính mình.

Rule 6

Cán bộ chỉ được truy cập
dữ liệu thuộc phạm vi được phân quyền.

Rule 7

Các thao tác quan trọng phải
được ghi nhận vào Audit Log.

15. Actor Interaction Overview

Tổng quan tương tác:

                    ┌─────────────┐
                    │     SIS     │
                    └──────┬──────┘
                           │
                           │ Student Data
                           ↓
┌─────────────┐      ┌───────────────┐
│   Student   │─────→│               │
└─────────────┘      │               │
                     │   Website     │
┌────────────────┐   │   Ngoại trú   │
│ Reception     │──→│               │
│ Officer       │   │               │
└────────────────┘   │               │
                     │               │
┌────────────────┐   │               │
│ Processing     │──→│               │
│ Officer        │   │               │
└────────────────┘   │               │
                     │               │
┌────────────────┐   │               │
│   Approver     │──→│               │
└────────────────┘   │               │
                     │               │
┌────────────────┐   │               │
│ Administrator  │──→│               │
└────────────────┘   │               │
                     └───────┬───────┘
                             ↑
                             │
                     ┌───────┴───────┐
                     │System Scheduler│
                     └───────────────┘
16. Actor Hierarchy

Có thể biểu diễn Actor theo nhóm:

                    SYSTEM
                       │
          ┌────────────┴────────────┐
          │                         │
       HUMAN                     EXTERNAL
          │                         │
    ┌─────┼───────────┐             │
    │     │     │     │             │
 Student  Reception  Processing  Administrator
             │          │
             └────┬─────┘
                  │
               Approver

External:
    └── SIS

Automated:
    └── System Scheduler

Actor hierarchy chỉ thể hiện
phân loại Actor.

Quyền thực tế vẫn phải được xác định
bằng Role + Permission + Data Scope.

17. Actor → Responsibility
Actor	Trách nhiệm chính
Student	Đăng ký và quản lý hồ sơ ngoại trú của mình
Reception Officer	Tiếp nhận và kiểm tra sơ bộ
Processing Officer	Kiểm tra nghiệp vụ và yêu cầu bổ sung
Approver	Phê duyệt hoặc từ chối
Administrator	Quản trị User, Role, Permission, Configuration và danh mục
SIS	Cung cấp dữ liệu sinh viên
System Scheduler	Thực hiện các tác vụ tự động
18. Nguyên tắc Audit

Các Actor thực hiện thao tác quan trọng
phải được ghi nhận vào Audit Log.

Ví dụ:

Student
   ↓
Submit Registration
   ↓
Audit Log
Processing Officer
   ↓
Request More Info
   ↓
Audit Log
Approver
   ↓
Approve Registration
   ↓
Audit Log
System Scheduler
   ↓
Auto Expire
   ↓
System Audit Log

Audit Log phải xác định được:

Who
What
When
Which Entity
Result
Reason
Source
19. Kết luận

Hệ thống có 7 Actor chính:

Human:
- Student
- Reception Officer
- Processing Officer
- Approver
- Administrator

External:
- SIS

Automated:
- System Scheduler

Mỗi Actor có trách nhiệm và quyền hạn
khác nhau.

Quyền thực tế được xác định theo:

Actor
   ↓
Role
   ↓
Permission
   ↓
Data Scope

Việc phân tách Actor rõ ràng giúp hệ thống:

Dễ xây dựng Use Case Diagram.
Dễ thiết kế Authorization.
Dễ thiết kế Database.
Dễ thiết kế API.
Dễ kiểm soát bảo mật.
Dễ kiểm thử.
Dễ truy vết nghiệp vụ.
20. Trạng thái tài liệu
Document:
Actors

Version:
1.0

Status:
Draft

Previous Document:
use-case-overview.md

Next Document:
use-case-list.md