# REQUIREMENTS OVERVIEW
# HỆ THỐNG QUẢN LÝ SINH VIÊN NGOẠI TRÚ

---

## 1. Mục đích tài liệu

Tài liệu này mô tả tổng quan các yêu cầu của
Hệ thống Quản lý Sinh viên Ngoại trú.

Tài liệu được xây dựng dựa trên:

- Business Overview.
- Business Rules.
- Business Flow.
- Glossary.

Mục tiêu là chuyển các nghiệp vụ đã xác định thành
các yêu cầu mà hệ thống Website phải đáp ứng.

Tài liệu này là cơ sở để xây dựng:

- Functional Requirements.
- Non-functional Requirements.
- Business Constraints.
- Use Case.
- Activity Diagram.
- Sequence Diagram.
- Data Flow Diagram.
- Database.
- UI/UX.
- Website.
- Test Cases.

---

# 2. Mục tiêu hệ thống

Hệ thống được xây dựng nhằm số hóa quy trình
quản lý sinh viên ngoại trú của nhà trường.

Hệ thống cho phép sinh viên:

- Khai báo thông tin ngoại trú.
- Cập nhật thông tin nơi ở.
- Đính kèm giấy tờ.
- Gửi hồ sơ.
- Theo dõi tình trạng xử lý.
- Bổ sung hồ sơ khi được yêu cầu.
- Yêu cầu gia hạn.
- Yêu cầu chuyển nơi ở.
- Yêu cầu kết thúc ngoại trú.
- Nhận thông báo từ hệ thống.

Đồng thời hệ thống hỗ trợ cán bộ:

- Tiếp nhận hồ sơ.
- Kiểm tra hồ sơ.
- Yêu cầu sinh viên bổ sung.
- Phê duyệt hoặc từ chối.
- Xử lý các REQUEST phát sinh.
- Theo dõi hồ sơ quá hạn.
- Xử lý escalation.
- Tra cứu lịch sử.
- Thống kê và báo cáo.

Hệ thống cũng cung cấp cho Administrator
các chức năng quản trị và cấu hình.

---

# 3. Phạm vi hệ thống

## 3.1. Trong phạm vi

Hệ thống tập trung vào việc quản lý
sinh viên ngoại trú.

Các nghiệp vụ chính bao gồm:

1. Quản lý thông tin sinh viên.
2. Quản lý hồ sơ ngoại trú.
3. Quản lý nơi ở.
4. Quản lý thông tin chủ trọ.
5. Quản lý giấy tờ.
6. Quản lý yêu cầu phát sinh.
7. Quản lý gia hạn.
8. Quản lý chuyển nơi ở.
9. Quản lý kết thúc ngoại trú.
10. Quản lý bổ sung hồ sơ.
11. Quản lý thời hạn.
12. Quản lý SLA.
13. Quản lý thông báo.
14. Quản lý lịch sử và Audit Log.
15. Quản lý người dùng và phân quyền.
16. Đồng bộ thông tin sinh viên với SIS.
17. Thống kê và báo cáo.

---

## 3.2. Ngoài phạm vi

Hệ thống không nhằm thay thế toàn bộ
hệ thống quản lý đào tạo của nhà trường.

Các nghiệp vụ sau không thuộc phạm vi chính:

- Quản lý điểm.
- Quản lý học phí.
- Quản lý chương trình đào tạo.
- Quản lý lịch học.
- Quản lý thi.
- Quản lý tuyển sinh.
- Quản lý ký túc xá.

Nếu cần sử dụng thông tin sinh viên,
hệ thống lấy dữ liệu cần thiết từ SIS
thông qua cơ chế đồng bộ.

---

# 4. Đối tượng sử dụng

Hệ thống có các nhóm người dùng chính:

## 4.1. Sinh viên — STUDENT

Sinh viên sử dụng Website để:

- Đăng nhập.
- Xem thông tin cá nhân.
- Tạo hồ sơ ngoại trú.
- Lưu hồ sơ nháp.
- Đính kèm giấy tờ.
- Gửi hồ sơ.
- Theo dõi trạng thái hồ sơ.
- Bổ sung thông tin.
- Rút hồ sơ trong trường hợp được phép.
- Yêu cầu gia hạn.
- Yêu cầu chuyển nơi ở.
- Yêu cầu kết thúc ngoại trú.
- Xem thông báo.
- Xem lịch sử xử lý.

---

## 4.2. Cán bộ tiếp nhận — RECEIVER

Có nhiệm vụ:

- Tiếp nhận hồ sơ.
- Kiểm tra sơ bộ.
- Kiểm tra tính đầy đủ của hồ sơ.
- Chuyển hồ sơ sang bước xử lý phù hợp.

Cán bộ tiếp nhận không mặc nhiên
có quyền phê duyệt.

---

## 4.3. Cán bộ xử lý — PROCESSOR

Có nhiệm vụ:

- Kiểm tra chi tiết hồ sơ.
- Kiểm tra thông tin.
- Kiểm tra giấy tờ.
- Yêu cầu bổ sung.
- Xử lý REQUEST.
- Đề xuất kết quả xử lý.

Cán bộ xử lý không mặc nhiên
có quyền phê duyệt cuối cùng.

---

## 4.4. Cán bộ phê duyệt — APPROVER

Có quyền:

- Xem hồ sơ được phân công.
- Xem kết quả kiểm tra.
- Phê duyệt.
- Từ chối.
- Xem lịch sử xử lý.

Phạm vi phê duyệt phụ thuộc vào
Permission và Data Scope.

---

## 4.5. Cán bộ phê duyệt cấp cao — SENIOR_APPROVER

Có nhiệm vụ:

- Xử lý các trường hợp escalation.
- Xử lý các trường hợp đặc biệt.
- Phê duyệt theo thẩm quyền.
- Theo dõi các hồ sơ quá hạn nghiêm trọng.

---

## 4.6. Quản trị viên — ADMIN

Có quyền quản trị hệ thống:

- Quản lý tài khoản.
- Quản lý Role.
- Quản lý Permission.
- Quản lý Data Scope.
- Quản lý danh mục.
- Cấu hình quy tắc nghiệp vụ.
- Cấu hình thời hạn.
- Quản lý SLA.
- Xem Audit Log.
- Theo dõi đồng bộ SIS.

ADMIN không mặc nhiên có quyền
phê duyệt hồ sơ nghiệp vụ.

---

# 5. Phạm vi chức năng tổng quát

Hệ thống được chia thành các module:

```text
SYSTEM
│
├── Authentication
│
├── Student Management
│
├── Registration Management
│
├── Address Management
│
├── Landlord Management
│
├── Document Management
│
├── Request Management
│   ├── Renewal
│   ├── Change Address
│   └── Termination
│
├── Workflow Management
│
├── Notification Management
│
├── SLA & Escalation
│
├── Audit & History
│
├── Report & Statistics
│
├── User & Access Management
│
├── Configuration
│
└── SIS Synchronization
6. Quản lý hồ sơ ngoại trú

Hệ thống phải hỗ trợ vòng đời hồ sơ:

DRAFT
   ↓
SUBMITTED
   ↓
UNDER_REVIEW
   ↓
┌─────────────────────┐
│                     │
↓                     ↓
NEED_MORE_INFO      APPROVED
│                     │
│                     ↓
│                   ACTIVE
│
├── Bổ sung lại
│
└── Hết giới hạn
        ↓
     REJECTED

Ngoài các trạng thái trên,
hồ sơ có thể kết thúc theo các nhánh:

DRAFT → WITHDRAWN
SUBMITTED → WITHDRAWN
ACTIVE → EXPIRED
ACTIVE → TERMINATED

Trạng thái cụ thể phải tuân thủ
Business Rules.

7. Quản lý REQUEST

REQUEST được thiết kế thành entity
độc lập với REGISTRATION.

Các loại REQUEST chính:

REQUEST
│
├── RENEWAL
├── CHANGE_ADDRESS
└── TERMINATION

Một REGISTRATION có thể phát sinh
nhiều REQUEST trong lịch sử.

Tuy nhiên tại một thời điểm:

OPEN REQUEST <= 1

Nghĩa là một hồ sơ không được đồng thời
có nhiều REQUEST đang mở.

8. Quản lý nơi ở

Hệ thống phải phân biệt:

CURRENT ADDRESS

và

PENDING ADDRESS

Khi sinh viên yêu cầu chuyển nơi ở:

ADDRESS CŨ
    ↓
CURRENT

ADDRESS MỚI
    ↓
PENDING

Trong thời gian chờ duyệt,
nơi ở cũ vẫn là nơi ở hiện tại.

Sau khi REQUEST được APPROVED:

ADDRESS CŨ
    ↓
HISTORY

ADDRESS MỚI
    ↓
CURRENT

Lịch sử nơi ở phải được giữ lại
để phục vụ truy vết.

9. Quản lý giấy tờ

Hệ thống cho phép:

Upload giấy tờ.
Kiểm tra giấy tờ.
Yêu cầu bổ sung.
Thay thế giấy tờ.
Theo dõi trạng thái giấy tờ.

Khi sinh viên thay thế giấy tờ:

DOCUMENT
    │
    ├── VERSION 1
    ├── VERSION 2
    └── VERSION 3

Phiên bản cũ không bị xóa.

Hệ thống phải có khả năng xác định:

Phiên bản hiện tại.
Người upload.
Thời gian upload.
Lý do thay thế.
Lịch sử các phiên bản.
10. Quản lý thời hạn

Hồ sơ ACTIVE có:

START_DATE
EXPIRY_DATE

Khi đến hạn:

ACTIVE
   ↓
EXPIRY_DATE
   ↓
EXPIRED

Hệ thống phải tự động kiểm tra
các hồ sơ sắp hết hạn và hết hạn.

Trước ngày hết hạn,
hệ thống gửi thông báo nhắc sinh viên
thực hiện gia hạn nếu cần.

11. Quản lý gia hạn

Sinh viên không tự chọn thời gian
gia hạn.

Khi tạo RENEWAL REQUEST:

Student
   ↓
Renewal Request
   ↓
Cán bộ kiểm tra
   ↓
Approve
   ↓
Hệ thống tự cộng Renewal Period

Giá trị Renewal Period mặc định:

12 tháng

Giá trị này được quản lý thông qua
cấu hình nghiệp vụ.

12. Quản lý nộp trễ

Nếu sinh viên gửi hồ sơ sau deadline:

IS_LATE = TRUE

IS_LATE là một cờ nghiệp vụ,
không phải một trạng thái riêng.

Hồ sơ nộp trễ không tự động bị từ chối
chỉ vì nộp trễ.

Việc xử lý vẫn tuân theo Business Rules.

13. Quản lý bổ sung hồ sơ

Khi hồ sơ thiếu thông tin:

UNDER_REVIEW
      ↓
NEED_MORE_INFO
      ↓
Student bổ sung
      ↓
UNDER_REVIEW

Hệ thống phải:

Ghi nhận yêu cầu bổ sung.
Ghi nhận nội dung cần bổ sung.
Ghi nhận thời hạn bổ sung.
Đếm số lần bổ sung.
Theo dõi phiên bản giấy tờ.
Ghi nhận người yêu cầu.
Ghi nhận thời gian yêu cầu.

Khi vượt quá số lần bổ sung
được phép, hệ thống xử lý theo
Business Rules và phải phân biệt
lý do từ chối tự động với từ chối
do cán bộ quyết định.

14. Rút hồ sơ

Sinh viên có thể chủ động rút hồ sơ
khi hồ sơ đang ở trạng thái được phép.

Ví dụ:

DRAFT
   ↓
WITHDRAWN

hoặc:

SUBMITTED
   ↓
WITHDRAWN

Hệ thống phải kiểm tra trạng thái hiện tại
trước khi cho phép rút.

Hồ sơ đã ACTIVE không được xử lý
bằng cơ chế rút hồ sơ.

15. Hồ sơ hết hạn

Khi hồ sơ ACTIVE hết thời hạn
mà không có gia hạn hợp lệ:

ACTIVE
   ↓
EXPIRED

Hệ thống phải tự động chuyển trạng thái
thông qua cơ chế kiểm tra định kỳ.

Nếu nhà trường áp dụng Grace Period,
quy trình xử lý hồ sơ hết hạn phải
tuân theo cấu hình tương ứng.

16. Quản lý tình trạng sinh viên

Hệ thống nhận thông tin trạng thái
học tập từ SIS.

Các trường hợp cần theo dõi:

Đang học.
Bảo lưu.
Đình chỉ.
Thôi học.
Tốt nghiệp.

Khi trạng thái sinh viên thay đổi,
hệ thống thực hiện nghiệp vụ tương ứng
theo Business Rules.

Ví dụ:

SIS
 ↓
Student Status Changed
 ↓
Registration Check
 ↓
Business Rule
 ↓
Update / Flag / Terminate
17. Đồng bộ SIS

SIS là nguồn dữ liệu chính
đối với thông tin sinh viên.

Hệ thống ngoại trú không tự ý trở thành
nguồn dữ liệu chính cho:

MSSV.
Họ tên sinh viên.
Lớp.
Khoa.
Trạng thái học tập.

Hệ thống phải có cơ chế đồng bộ
và lưu Sync Log.

Tần suất đồng bộ được cấu hình
theo kiến trúc và yêu cầu thực tế
của hệ thống.

18. Thông báo

Hệ thống phải thông báo cho người dùng
khi xảy ra các sự kiện quan trọng.

Ví dụ đối với sinh viên:

Hồ sơ được gửi
Hồ sơ được tiếp nhận
Yêu cầu bổ sung
Hồ sơ được phê duyệt
Hồ sơ bị từ chối
Sắp hết hạn
Đã hết hạn
REQUEST được phê duyệt
REQUEST bị từ chối

Ví dụ đối với cán bộ:

Có hồ sơ mới
Có hồ sơ cần xử lý
Hồ sơ sắp quá SLA
Hồ sơ quá SLA
Có escalation

Kênh thông báo được cấu hình
theo khả năng triển khai của hệ thống.

19. SLA và Escalation

Mỗi loại nghiệp vụ có thể có
thời gian xử lý tối đa.

Ví dụ:

SUBMITTED
   ↓
SLA START
   ↓
Processing
   ↓
SLA Deadline

Nếu vượt thời hạn:

OVERDUE

Nếu quá hạn đến mức quy định:

OVERDUE
   ↓
ESCALATION
   ↓
SENIOR_APPROVER

Hệ thống phải lưu lịch sử
các lần quá hạn và escalation.

20. Phân quyền

Hệ thống áp dụng mô hình:

USER
 ↓
ROLE
 ↓
PERMISSION
 ↓
DATA SCOPE

Ví dụ:

PROCESSOR
    ↓
PROCESS_REGISTRATION
    ↓
Khoa được phân công

Một cán bộ không được xem hoặc xử lý
dữ liệu nằm ngoài Data Scope của mình.

21. Audit và lịch sử

Các hành động quan trọng phải được
ghi nhận vào Audit Log.

Ví dụ:

Student submit registration
Officer request more info
Officer approve
Officer reject
Student upload document
Student change address
Admin change configuration
System auto expire
System escalation

Audit Log phải cho phép xác định:

Ai thực hiện?
Thực hiện hành động gì?
Trên đối tượng nào?
Khi nào?
Kết quả gì?
Lý do gì?
Dữ liệu trước và sau thay đổi nếu cần.
22. Báo cáo và thống kê

Hệ thống cung cấp báo cáo theo
nhiều tiêu chí.

Theo đơn vị
Khoa
Lớp
Ngành
Theo trạng thái
DRAFT
SUBMITTED
UNDER_REVIEW
NEED_MORE_INFO
ACTIVE
EXPIRED
REJECTED
TERMINATED
Theo thời gian
Ngày
Tháng
Học kỳ
Năm học
Theo khu vực

Có thể thống kê theo:

Tỉnh/thành.
Quận/huyện.
Phường/xã.
Khu vực nơi ở.
Theo xử lý

Có thể thống kê:

Số hồ sơ tiếp nhận.
Số hồ sơ đã duyệt.
Số hồ sơ từ chối.
Số hồ sơ đang xử lý.
Số hồ sơ quá SLA.
Số REQUEST.
Tỷ lệ xử lý đúng hạn.
23. Yêu cầu về tính nhất quán dữ liệu

Hệ thống phải đảm bảo:

1 Student
      ↓
0..N Registration

1 Registration
      ↓
0..N Request

1 Registration
      ↓
0..N Document

1 Document
      ↓
1..N Document Version

Đồng thời phải đảm bảo:

ACTIVE REGISTRATION <= 1 / STUDENT
OPEN REQUEST <= 1 / REGISTRATION
CURRENT ADDRESS <= 1 / REGISTRATION

Các ràng buộc chi tiết được định nghĩa
trong Business Rules và Business Constraints.

24. Nguyên tắc kiến trúc nghiệp vụ

Hệ thống phải tách biệt:

REGISTRATION

với:

REQUEST

Không sử dụng trạng thái của REGISTRATION
để biểu diễn các REQUEST như:

PENDING_RENEWAL
PENDING_CHANGE_ADDRESS
PENDING_TERMINATION

Thay vào đó:

REGISTRATION
    status = ACTIVE

REQUEST
    type = RENEWAL
    status = PENDING

Cách thiết kế này giúp:

Dễ mở rộng.
Dễ truy vết.
Dễ xây dựng Database.
Dễ xây dựng API.
Dễ xây dựng UI.
Dễ thống kê.
Không làm State Machine quá phức tạp.
25. Nguyên tắc tự động hóa

Một số nghiệp vụ cần được hệ thống
tự động xử lý.

Bao gồm:

Kiểm tra hồ sơ sắp hết hạn.
Chuyển hồ sơ sang EXPIRED.
Kiểm tra SLA.
Đánh dấu OVERDUE.
Tạo escalation.
Gửi notification.
Đồng bộ SIS.
Kiểm tra trạng thái sinh viên.
Ghi Audit Log cho các hành động tự động.

Các hành động tự động phải được ghi nhận
để có thể truy vết.

26. Kết quả mong đợi

Sau khi triển khai, hệ thống phải giúp:

Đối với sinh viên
Khai báo ngoại trú trực tuyến.
Không phải xử lý hồ sơ thủ công
trong các bước hệ thống hỗ trợ.
Theo dõi hồ sơ dễ dàng.
Nhận thông báo kịp thời.
Thực hiện gia hạn và thay đổi nơi ở
theo quy trình.
Đối với cán bộ
Giảm thao tác thủ công.
Quản lý hồ sơ tập trung.
Kiểm tra và phê duyệt có phân quyền.
Theo dõi SLA.
Quản lý hồ sơ quá hạn.
Tra cứu lịch sử.
Xuất báo cáo.
Đối với nhà trường
Có dữ liệu ngoại trú tập trung.
Kiểm soát được trạng thái hồ sơ.
Có khả năng truy vết.
Có thống kê và báo cáo.
Tăng tính minh bạch.
Giảm sai sót do xử lý thủ công.
27. Các tài liệu liên quan

Tài liệu này phụ thuộc vào:

01-business/
├── business-overview.md
├── business-rules.md
├── business-flow.md
└── glossary.md

Các tài liệu tiếp theo:

02-requirements/
├── functional-requirements.md
├── non-functional-requirements.md
├── business-constraints.md
└── requirement-traceability.md

Sau Requirements sẽ xây dựng:

03-use-cases/
04-dfd/
05-uml/
06-data-model/
07-system-design/
08-ui-ux/
09-website/
10-testing/
11-deployment/
12-documentation/
28. Nguyên tắc quản lý thay đổi yêu cầu

Mọi thay đổi nghiệp vụ sau khi tài liệu
được phê duyệt phải được cập nhật
đồng bộ ở các tài liệu liên quan.

Ví dụ:

Business Rule thay đổi
        ↓
Requirement thay đổi
        ↓
Use Case thay đổi
        ↓
UML thay đổi
        ↓
Database / API / UI thay đổi

Không được tự ý thay đổi một tài liệu
mà không kiểm tra các tài liệu phụ thuộc.

29. Trạng thái tài liệu

Document: Requirements Overview

Version: 1.0

Status: Draft

Based on:

Business Overview
Business Rules
Business Flow
Glossary

Next: Functional Requirements