# USE CASE OVERVIEW
# HỆ THỐNG QUẢN LÝ SINH VIÊN NGOẠI TRÚ

---

## 1. Mục đích

Tài liệu này mô tả tổng quan các Use Case của Website
Quản lý Sinh viên Ngoại trú.

Use Case được xây dựng dựa trên các tài liệu phân tích
nghiệp vụ và yêu cầu của hệ thống, bao gồm:

- Business Overview.
- Business Rules.
- Business Flow.
- Business Constraints.
- Requirements Overview.
- Functional Requirements.
- Non-Functional Requirements.

Tài liệu này là cơ sở để xác định:

- Các Actor của hệ thống.
- Các chức năng mà từng Actor được phép thực hiện.
- Phạm vi tương tác giữa Actor và hệ thống.
- Các nhóm Use Case.
- Quan hệ giữa các Use Case.
- Vòng đời của hồ sơ ngoại trú.
- Vòng đời của các yêu cầu phát sinh.

---

# 2. Phạm vi hệ thống

Hệ thống là Website Quản lý Sinh viên Ngoại trú,
được sử dụng để hỗ trợ sinh viên và nhà trường
quản lý quá trình đăng ký và quản lý ngoại trú.

Phạm vi chính của hệ thống:

```text
Sinh viên
    ↓
Tạo hồ sơ ngoại trú
    ↓
Khai báo nơi ở
    ↓
Đính kèm giấy tờ
    ↓
Gửi hồ sơ
    ↓
Cán bộ tiếp nhận
    ↓
Cán bộ xử lý
    ↓
Cán bộ có quyền duyệt
    ↓
Duyệt / Từ chối / Yêu cầu bổ sung
    ↓
Quản lý hồ sơ ngoại trú
    ↓
Gia hạn / Chuyển nơi ở / Kết thúc

Hệ thống không quản lý:

Quản lý ký túc xá.
Quản lý điểm.
Quản lý học phí.
Quản lý đào tạo.
Quản lý toàn bộ hồ sơ sinh viên.

Hệ thống SIS chỉ cung cấp các thông tin sinh viên
và trạng thái học tập cần thiết cho nghiệp vụ
quản lý ngoại trú.

3. Đối tượng nghiệp vụ chính

Các Use Case của hệ thống xoay quanh các
đối tượng nghiệp vụ chính sau.

3.1. Registration — Hồ sơ ngoại trú

Registration đại diện cho hồ sơ đăng ký ngoại trú
của một sinh viên.

Một sinh viên có thể có lịch sử nhiều hồ sơ
trong quá trình học tập, nhưng tại một thời điểm
chỉ được tồn tại một hồ sơ ngoại trú hợp lệ
theo Business Rules của hệ thống.

Registration có vòng đời độc lập.

Các trạng thái chính:

DRAFT
SUBMITTED
UNDER_REVIEW
NEED_MORE_INFO
ACTIVE
EXPIRED
REJECTED
WITHDRAWN
TERMINATED

Vòng đời tổng quát:

DRAFT
   ↓
SUBMITTED
   ↓
UNDER_REVIEW
   │
   ├──→ ACTIVE
   │
   ├──→ NEED_MORE_INFO
   │       ↓
   │   Sinh viên bổ sung
   │       ↓
   │   UNDER_REVIEW
   │
   ├──→ REJECTED
   │
   └──→ WITHDRAWN

Sau khi ACTIVE:

ACTIVE
   │
   ├──→ EXPIRED
   │
   └──→ TERMINATED
3.2. Request — Yêu cầu phát sinh

Request đại diện cho một yêu cầu phát sinh
trong quá trình quản lý một Registration.

Các loại Request chính:

RENEWAL
CHANGE_ADDRESS
TERMINATION

Request được quản lý độc lập với Registration.

Quan hệ:

Registration
     │
     │ 1
     │
     │ N
     ↓
Request

Một Registration có thể phát sinh nhiều Request
trong toàn bộ vòng đời.

Tuy nhiên:

Tại một thời điểm, một Registration chỉ được
phép có tối đa một Request đang ở trạng thái
PENDING.

Ví dụ:

Registration = ACTIVE

Request 1
Type = RENEWAL
Status = PENDING

Trong thời gian Request 1 chưa được xử lý,
sinh viên không được tạo thêm Request khác
cho cùng Registration.

3.3. Document — Giấy tờ

Document đại diện cho các giấy tờ được đính kèm
vào hồ sơ hoặc Request.

Document phải hỗ trợ quản lý phiên bản.

Ví dụ:

Document
   │
   ├── Version 1
   ├── Version 2
   └── Version 3

Khi sinh viên thay thế hoặc bổ sung tài liệu,
phiên bản cũ không bị xóa khỏi lịch sử.

Mục đích:

Truy vết tài liệu.
Xác định tài liệu nào được sử dụng ở từng thời điểm.
Phục vụ Audit.
Phục vụ kiểm tra lịch sử hồ sơ.
3.4. Address — Nơi ở

Address đại diện cho nơi ở ngoại trú
của sinh viên.

Khi sinh viên chuyển nơi ở:

Current Address
       +
Proposed Address

Trong khi Request chuyển nơi ở đang PENDING:

Current Address
       ↓
Không thay đổi

Thông tin nơi ở mới chỉ trở thành
Current Address sau khi Request được phê duyệt.

Địa chỉ cũ phải được giữ lại trong lịch sử.

4. Actor của hệ thống

Hệ thống có các Actor chính:

1. Student
2. Reception Officer
3. Processing Officer
4. Approver
5. Administrator
6. SIS
7. System Scheduler

Chi tiết về từng Actor được mô tả riêng trong:

03-use-cases/actors.md
5. Nhóm Use Case

Các Use Case được chia thành các nhóm
nghiệp vụ chính.

5.1. Authentication & Authorization

Nhóm chức năng liên quan đến xác thực
và phân quyền người dùng.

Bao gồm:

Đăng nhập.
Đăng xuất.
Xác thực phiên đăng nhập.
Kiểm tra quyền.
Kiểm tra phạm vi dữ liệu.

Mô hình phân quyền:

User
  ↓
Role
  ↓
Permission
  ↓
Data Scope

Role không mặc nhiên đồng nghĩa với việc
người dùng được phép thực hiện mọi chức năng.

6. Student Registration Use Cases

Nhóm chức năng dành cho sinh viên trong
quá trình đăng ký ngoại trú.

Bao gồm:

Xem thông tin cá nhân.
Tạo hồ sơ ngoại trú.
Chỉnh sửa hồ sơ DRAFT.
Khai báo nơi ở.
Đính kèm giấy tờ.
Gửi hồ sơ.
Theo dõi hồ sơ.
Rút hồ sơ khi đủ điều kiện.
Bổ sung hồ sơ khi được yêu cầu.
Xem lịch sử hồ sơ.
7. Document Management Use Cases

Nhóm chức năng quản lý giấy tờ.

Bao gồm:

Upload tài liệu.
Xem tài liệu.
Kiểm tra tài liệu.
Thay thế tài liệu.
Quản lý phiên bản tài liệu.
Xem lịch sử tài liệu.

Khi sinh viên bổ sung hoặc thay thế
tài liệu theo yêu cầu của cán bộ:

Document Version cũ
        ↓
Không xóa
        ↓
Document Version mới
8. Reception Use Cases

Nhóm chức năng dành cho Cán bộ tiếp nhận.

Bao gồm:

Xem hồ sơ chờ tiếp nhận.
Kiểm tra sơ bộ.
Kiểm tra tính đầy đủ ban đầu.
Tiếp nhận hồ sơ.
Chuyển hồ sơ sang bước xử lý.

Cán bộ tiếp nhận không mặc nhiên
có quyền phê duyệt cuối cùng.

9. Processing Use Cases

Nhóm chức năng dành cho Cán bộ xử lý.

Bao gồm:

Xem hồ sơ được phân công.
Kiểm tra thông tin.
Kiểm tra giấy tờ.
Kiểm tra thông tin nơi ở.
Yêu cầu bổ sung.
Theo dõi hồ sơ đang xử lý.
Đề xuất kết quả xử lý.

Cán bộ xử lý không mặc nhiên có quyền
phê duyệt nếu không được cấp Permission
tương ứng.

10. Approval Use Cases

Nhóm chức năng dành cho Cán bộ có quyền duyệt.

Bao gồm:

Xem hồ sơ đủ điều kiện duyệt.
Phê duyệt hồ sơ.
Từ chối hồ sơ.
Phê duyệt Request.
Từ chối Request.

Mỗi quyết định quan trọng phải được ghi nhận
vào Audit Log.

11. Request Management Use Cases

Request được xem là nhóm Use Case riêng.

Các loại Request:

Registration
      │
      ├── Renewal Request
      │
      ├── Change Address Request
      │
      └── Termination Request

Không sử dụng một Use Case duy nhất để
đại diện cho tất cả các loại Request.

11.1. Renewal Request

Sinh viên gửi yêu cầu gia hạn khi
hồ sơ ngoại trú sắp hết hạn.

Sinh viên không tự lựa chọn thời gian
gia hạn như 3, 6 hoặc 12 tháng.

Thời gian gia hạn được xác định bởi
Configuration của hệ thống.

Ví dụ:

Renewal Period = 12 tháng

Sau khi Request được phê duyệt:

Current Expiry Date
        ↓
Tính thời hạn mới
        ↓
New Expiry Date

Hệ thống tự động cập nhật thời hạn
của Registration.

12. Change Address Request

Sinh viên gửi yêu cầu chuyển nơi ở
khi thay đổi địa chỉ ngoại trú.

Luồng tổng quát:

Current Address
       ↓
Student tạo Request
       ↓
Nhập Proposed Address
       ↓
PENDING
       ↓
Cán bộ xử lý
       ↓
Approver
       ↓
APPROVED
       ↓
Proposed Address
       ↓
Current Address

Trong thời gian Request PENDING,
địa chỉ hiện tại vẫn là địa chỉ cũ.

Địa chỉ mới chỉ được cập nhật chính thức
sau khi Request được phê duyệt.

13. Termination Request

Sinh viên có thể gửi yêu cầu kết thúc
ngoại trú khi không còn ở ngoại trú.

Luồng tổng quát:

ACTIVE
   ↓
Termination Request
   ↓
PENDING
   ↓
Approver
   ↓
APPROVED
   ↓
TERMINATED

Sau khi kết thúc:

Registration không còn là hồ sơ ngoại trú ACTIVE.
Lịch sử hồ sơ vẫn được giữ lại.
Các thông tin cần thiết cho Audit vẫn được giữ lại.
14. Registration State Management

Registration và Request có State Machine
riêng biệt.

Registration:

DRAFT
  ↓
SUBMITTED
  ↓
UNDER_REVIEW
  │
  ├────────→ ACTIVE
  │
  ├────────→ NEED_MORE_INFO
  │                ↓
  │            Bổ sung
  │                ↓
  │          UNDER_REVIEW
  │
  ├────────→ REJECTED
  │
  └────────→ WITHDRAWN

Sau khi ACTIVE:

ACTIVE
  │
  ├────────→ EXPIRED
  │
  └────────→ TERMINATED
15. Request State Management

Request có State Machine riêng:

PENDING
   │
   ├────────→ APPROVED
   │
   └────────→ REJECTED

Không sử dụng trạng thái Request
để thay thế trạng thái Registration.

Ví dụ:

Registration
Status = ACTIVE

Request
Type = CHANGE_ADDRESS
Status = PENDING

Điều này có nghĩa:

Sinh viên vẫn đang có hồ sơ ngoại trú ACTIVE
trong khi yêu cầu chuyển nơi ở đang chờ xử lý.

16. Bổ sung hồ sơ

Khi cán bộ yêu cầu bổ sung:

UNDER_REVIEW
      ↓
NEED_MORE_INFO
      ↓
Sinh viên bổ sung
      ↓
UNDER_REVIEW

Hệ thống phải ghi nhận:

Nội dung yêu cầu bổ sung.
Người yêu cầu.
Thời điểm yêu cầu.
Nội dung sinh viên bổ sung.
Tài liệu bổ sung.
Phiên bản tài liệu.
Số lần bổ sung.

Số lần bổ sung tối đa được quy định
bởi Business Rules.

Nếu vượt quá giới hạn:

NEED_MORE_INFO
      ↓
REJECTED

Lý do từ chối do vượt giới hạn bổ sung
phải được phân biệt với trường hợp
cán bộ chủ động từ chối.

17. Rút hồ sơ

Sinh viên được phép rút hồ sơ
khi hồ sơ đang ở trạng thái cho phép rút.

Ví dụ:

DRAFT
   ↓
WITHDRAWN

hoặc:

SUBMITTED
   ↓
WITHDRAWN

Khi rút hồ sơ:

Không xóa dữ liệu.
Không xóa tài liệu lịch sử.
Ghi nhận thời điểm rút.
Ghi nhận người thực hiện.
Ghi nhận Audit Log.
18. Nộp hồ sơ trễ

Nếu sinh viên gửi hồ sơ sau Deadline:

SUBMITTED
   +
is_late = true

is_late là một Business Flag,
không phải một Registration State.

Hồ sơ nộp trễ không tự động bị từ chối
chỉ vì nộp trễ.

Hồ sơ vẫn được xử lý theo quy trình
nghiệp vụ bình thường.

19. Hồ sơ hết hạn

System Scheduler định kỳ kiểm tra
các Registration đang ACTIVE.

Nếu:

Current Date > Expiry Date

và không có gia hạn hợp lệ được phê duyệt:

ACTIVE
   ↓
EXPIRED

Việc chuyển trạng thái tự động phải
được ghi nhận vào System Audit Log.

Hồ sơ EXPIRED được xem là không còn
ngoại trú hợp lệ.

Việc xử lý hồ sơ EXPIRED phải tuân theo
Business Rules của hệ thống.

20. SLA và Escalation

Hệ thống theo dõi thời gian xử lý
của hồ sơ và Request.

Nếu vượt thời gian SLA:

Normal
   ↓
Overdue

Nếu tiếp tục vượt ngưỡng Escalation:

Overdue
   ↓
Escalation

Hệ thống gửi thông báo đến cấp quản lý
hoặc người có trách nhiệm xử lý tiếp theo.

SLA và ngưỡng Escalation được cấu hình
theo Configuration của hệ thống.

21. Notification Use Cases

Hệ thống gửi thông báo khi xảy ra
các sự kiện nghiệp vụ quan trọng.

Ví dụ:

Gửi hồ sơ
   ↓
Thông báo

Yêu cầu bổ sung
   ↓
Thông báo

Hồ sơ được duyệt
   ↓
Thông báo

Hồ sơ bị từ chối
   ↓
Thông báo

Hồ sơ sắp hết hạn
   ↓
Thông báo

Hồ sơ hết hạn
   ↓
Thông báo

Kênh thông báo được xác định bởi
Configuration của hệ thống.

22. SIS Integration

SIS là hệ thống bên ngoài cung cấp
thông tin sinh viên.

Thông tin có thể được cung cấp:

MSSV.
Họ tên.
Lớp.
Khoa.
Ngành.
Trạng thái học tập.

SIS không phải là người dùng trực tiếp
của Website.

Hệ thống ngoại trú sử dụng SIS như
nguồn dữ liệu bên ngoài đối với các
thông tin được tích hợp.

Khi trạng thái học tập của sinh viên
thay đổi, hệ thống ngoại trú xử lý theo
Business Rules đã được định nghĩa.

23. Administrator Use Cases

Administrator quản lý các thành phần
quản trị hệ thống.

Bao gồm:

Quản lý User.
Quản lý Role.
Quản lý Permission.
Quản lý Configuration.
Quản lý danh mục.
Xem Audit Log.

Administrator không mặc nhiên được phép
phê duyệt hồ sơ nếu không có Permission
nghiệp vụ tương ứng.

24. Reporting Use Cases

Hệ thống hỗ trợ các chức năng báo cáo
và thống kê.

Bao gồm:

Xem Dashboard.
Thống kê số lượng hồ sơ.
Thống kê theo trạng thái.
Thống kê theo khoa.
Thống kê theo lớp.
Thống kê theo khu vực.
Thống kê theo thời gian.
Thống kê hồ sơ quá hạn.
Xuất báo cáo.
25. Audit Log

Các thao tác quan trọng phải được
ghi nhận vào Audit Log.

Thông tin tối thiểu:

Actor
Role
Action
Entity
Entity ID
Timestamp
Result
Reason
Source

Hệ thống phải phân biệt:

USER_ACTION

và:

SYSTEM_ACTION

Ví dụ:

Student
   ↓
Submit Registration
   ↓
USER_ACTION

và:

System Scheduler
   ↓
Auto Expire Registration
   ↓
SYSTEM_ACTION

Audit Log không được phép bị người dùng
thông thường chỉnh sửa hoặc xóa.

26. Authorization Model

Quyền truy cập được xác định theo:

Actor
   ↓
Role
   ↓
Permission
   ↓
Data Scope

Ví dụ:

Approver
   ↓
APPROVE_REGISTRATION
   ↓
Registration thuộc phạm vi được phân quyền

Điều này giúp hệ thống kiểm soát:

Ai được xem hồ sơ.
Ai được chỉnh sửa hồ sơ.
Ai được yêu cầu bổ sung.
Ai được phê duyệt.
Ai được từ chối.
Ai được xem báo cáo.
Ai được quản trị hệ thống.
27. Nguyên tắc Registration và Request

Registration và Request là hai đối tượng
nghiệp vụ độc lập.

Không sử dụng một cột Status duy nhất
để biểu diễn cả hai.

Ví dụ:

Registration
Status = ACTIVE

Request
Type = RENEWAL
Status = PENDING

Điều này giúp hệ thống phân biệt rõ:

Registration Status

và:

Request Status
28. Nguyên tắc một Request PENDING

Một Registration chỉ được phép có
tối đa một Request PENDING tại một thời điểm.

Ví dụ:

Registration = ACTIVE

Request A
RENEWAL
PENDING

Trong thời gian Request A chưa kết thúc:

Không cho tạo:
CHANGE_ADDRESS
PENDING

Không cho tạo:
TERMINATION
PENDING

Sau khi Request A:

APPROVED

hoặc:

REJECTED

Registration mới có thể xem xét
tạo Request khác nếu thỏa Business Rules.

29. Nguyên tắc lịch sử

Hệ thống phải duy trì lịch sử trong
suốt vòng đời quản lý ngoại trú.

Lịch sử bao gồm:

Lịch sử Registration.
Lịch sử trạng thái.
Lịch sử Request.
Lịch sử nơi ở.
Lịch sử tài liệu.
Lịch sử phiên bản tài liệu.
Lịch sử bổ sung.
Lịch sử quyết định.
Audit Log.

Thay đổi dữ liệu hiện tại không được
làm mất dữ liệu cần thiết để truy vết.

30. Traceability

Mỗi Use Case phải có khả năng truy ngược
về Requirement tương ứng.

Mối quan hệ:

Business Rule
      ↓
Requirement
      ↓
Use Case
      ↓
Activity Diagram
      ↓
Sequence Diagram
      ↓
UI / API
      ↓
Database
      ↓
Test Case

Điều này đảm bảo các chức năng của
Website đều có nguồn gốc từ yêu cầu
đã được phân tích.

31. Nguyên tắc đặc tả Use Case

Mỗi Use Case chi tiết sẽ được đặc tả
trong tài liệu riêng.

Mỗi Use Case Specification phải bao gồm:

Use Case ID
Use Case Name
Actor
Goal
Description

Preconditions
Trigger

Main Flow

Alternative Flow

Exception Flow

Postconditions

Business Rules

Related Requirements

Related Entities

Related Use Cases

File Overview này chỉ mô tả tổng quan,
không thay thế cho Use Case Specification.

32. Tài liệu liên quan
Tài liệu đầu vào
01-business/
├── business-overview.md
├── business-rules.md
├── business-flow.md
└── glossary.md
02-requirements/
├── requirements-overview.md
├── functional-requirements.md
├── non-functional-requirements.md
└── business-constraints.md
Tài liệu Use Case
03-use-cases/
├── use-case-overview.md
├── actors.md
├── use-case-list.md
└── specifications/
33. Kết quả mong đợi

Sau khi hoàn thành phân tích Use Case,
hệ thống phải xác định rõ:

Actor nào tương tác với hệ thống.
Actor nào được phép thực hiện chức năng nào.
Actor nào được xem dữ liệu nào.
Registration có vòng đời như thế nào.
Request có vòng đời như thế nào.
Registration và Request liên kết ra sao.
Các Request nào được phép tạo.
Khi nào Request được PENDING.
Khi nào Request được APPROVED hoặc REJECTED.
Khi nào Registration chuyển sang ACTIVE.
Khi nào Registration chuyển sang EXPIRED.
Khi nào Registration chuyển sang TERMINATED.
Cách xử lý hồ sơ cần bổ sung.
Cách xử lý hồ sơ nộp trễ.
Cách xử lý SLA và Escalation.
Hệ thống tự động thực hiện những gì.
SIS cung cấp dữ liệu gì.
Những thao tác nào phải ghi Audit Log.
Các Use Case liên kết với Requirement nào.
34. Trạng thái tài liệu
Document:
Use Case Overview

Version:
1.0

Status:
Draft

Previous Documents:
01-business/
02-requirements/

Next Documents:
actors.md
use-case-list.md
specifications/
Use Case Diagram
Activity Diagram
Sequence Diagram