# REQUIREMENT TRACEABILITY
# HỆ THỐNG QUẢN LÝ SINH VIÊN NGOẠI TRÚ

---

# 1. Mục đích

Requirement Traceability Matrix (RTM) được sử dụng
để theo dõi mối quan hệ giữa:

Business Requirement
        ↓
Business Rule / Constraint
        ↓
Functional Requirement
        ↓
Use Case
        ↓
System Design
        ↓
Database
        ↓
API
        ↓
UI
        ↓
Test Case

Mục tiêu:

- Không bỏ sót yêu cầu.
- Không tạo chức năng không có cơ sở nghiệp vụ.
- Đảm bảo mỗi yêu cầu đều được thiết kế và kiểm thử.
- Dễ dàng truy ngược khi có thay đổi yêu cầu.
- Đảm bảo tính nhất quán giữa Business và System Design.

---

# 2. Nguyên tắc Traceability

Mỗi yêu cầu phải có:

- Requirement ID.
- Nguồn gốc nghiệp vụ.
- Use Case liên quan.
- Entity/Dữ liệu liên quan.
- Chức năng hệ thống liên quan.
- Test Case tương ứng.

Không yêu cầu nào quan trọng được
đưa vào hệ thống mà không có
nguồn gốc rõ ràng.

---

# 3. Quy ước ID

## Business

```text
BR-xx
Business Constraint
BC-xxx-xx
Functional Requirement
FR-xxx-xx
Non-Functional Requirement
NFR-xxx-xx
Use Case
UC-xxx
Test Case
TC-xxx
4. Traceability Matrix — Business → Requirement
Business / Constraint	Functional Requirement	Non-Functional Requirement
BC-STU-02	FR-REG-*	NFR-DATA-01
BC-REG-01	FR-REG-*	NFR-DATA-03
BC-REG-05	FR-REG-*	NFR-AUDIT-01
BC-REG-07	FR-REG-*	NFR-DATA-*
BC-REG-08	FR-REG-*	NFR-AUDIT-03
BC-REQ-02	FR-REQ-*	NFR-MAINT-03
BC-REQ-03	FR-REQ-*	NFR-DATA-03
BC-REQ-05	FR-REQ-*	NFR-DATA-*
BC-REQ-06	FR-REQ-*	NFR-DATA-*
BC-REQ-10	FR-REQ-*	NFR-DATA-*
BC-REQ-13	FR-REQ-*	NFR-DATA-04
BC-DOC-03	FR-DOC-*	NFR-AUDIT-*
BC-APP-02	FR-APP-*	NFR-SEC-02
BC-ROLE-06	FR-AUTH-*	NFR-SEC-02
BC-TIME-02	FR-REG-*	NFR-DATA-*
BC-TIME-03	FR-REQ-*	NFR-MON-*
BC-TIME-05	FR-NOT-*	NFR-MON-*
BC-SIS-01	FR-SIS-*	NFR-REL-*
BC-AUDIT-01	FR-AUDIT-*	NFR-AUDIT-*

Lưu ý: FR ID cụ thể sẽ được đối chiếu
với functional-requirements.md khi tài liệu
được hoàn thiện.

5. Traceability — Sinh viên
5.1 Đăng nhập
Business:
Sinh viên phải được xác thực.

        ↓

Functional:
FR-AUTH-01

        ↓

Use Case:
UC-AUTH-01 — Đăng nhập

        ↓

System:
Authentication Module

        ↓

Database:
USER
ROLE
PERMISSION

        ↓

Test:
TC-AUTH-01
TC-AUTH-02
6. Traceability — Tạo hồ sơ ngoại trú
Business:
Sinh viên có nhu cầu đăng ký
ngoại trú.

        ↓

Business Constraint:
BC-STU-02
BC-REG-03

        ↓

Functional:
FR-REG-01 — Tạo hồ sơ

        ↓

Use Case:
UC-REG-01 — Tạo hồ sơ ngoại trú

        ↓

Entity:
STUDENT
REGISTRATION
ADDRESS

        ↓

UI:
Registration Form

        ↓

API:
POST /registrations

        ↓

Test:
TC-REG-01
TC-REG-02
7. Traceability — Gửi hồ sơ
Business:
Sinh viên hoàn thiện hồ sơ
và gửi cho nhà trường.

        ↓

Constraint:
BC-REG-04

        ↓

Functional:
FR-REG-02 — Gửi hồ sơ

        ↓

Use Case:
UC-REG-02 — Gửi hồ sơ

        ↓

State:
DRAFT
  ↓
SUBMITTED

        ↓

Audit:
SUBMIT

        ↓

Test:
TC-REG-03
TC-REG-04
8. Traceability — Rút hồ sơ
Constraint:
BC-REG-05

        ↓

Functional:
FR-REG-03

        ↓

Use Case:
UC-REG-03 — Rút hồ sơ

        ↓

State:
DRAFT / SUBMITTED
        ↓
WITHDRAWN

        ↓

Audit:
WITHDRAW

        ↓

Test:
TC-REG-05
9. Traceability — Kiểm tra hồ sơ
Business:
Cán bộ phải kiểm tra
hồ sơ sinh viên.

        ↓

Functional:
FR-REG-04

        ↓

Use Case:
UC-REG-04 — Kiểm tra hồ sơ

        ↓

Actor:
Processing Officer

        ↓

State:
SUBMITTED
    ↓
UNDER_REVIEW

        ↓

Related:
DOCUMENT
AUDIT_LOG

        ↓

Test:
TC-REG-06
TC-REG-07
10. Traceability — Yêu cầu bổ sung
Constraint:
BC-REG-06
BC-REG-07
BC-REG-08

        ↓

Functional:
FR-REQ-01 — Yêu cầu bổ sung

        ↓

Use Case:
UC-REQ-01 — Yêu cầu bổ sung

        ↓

State:
UNDER_REVIEW
      ↓
NEED_MORE_INFO

        ↓

Student:
Bổ sung thông tin / tài liệu

        ↓

Document:
DOCUMENT
DOCUMENT_VERSION

        ↓

Test:
TC-REQ-01
TC-REQ-02
TC-REQ-03
11. Traceability — Phê duyệt hồ sơ
Constraint:
BC-APP-01
BC-APP-02
BC-APP-03
BC-APP-04

        ↓

Functional:
FR-APP-01 — Phê duyệt hồ sơ

        ↓

Use Case:
UC-APP-01 — Phê duyệt hồ sơ

        ↓

Actor:
Approver

        ↓

Permission:
APPROVE_REGISTRATION

        ↓

State:
UNDER_REVIEW
      ↓
ACTIVE

        ↓

Audit:
APPROVE

        ↓

Test:
TC-APP-01
TC-APP-02
TC-APP-03
12. Traceability — Từ chối hồ sơ
Constraint:
BC-APP-04

        ↓

Functional:
FR-APP-02 — Từ chối hồ sơ

        ↓

Use Case:
UC-APP-02 — Từ chối hồ sơ

        ↓

State:
UNDER_REVIEW
      ↓
REJECTED

        ↓

Required:
Rejection Reason

        ↓

Audit:
REJECT

        ↓

Test:
TC-APP-04
TC-APP-05
13. Traceability — Gia hạn
Constraint:
BC-REQ-01
BC-REQ-02
BC-REQ-03
BC-REQ-04

        ↓

Functional:
FR-REQ-02 — Gia hạn ngoại trú

        ↓

Use Case:
UC-REQ-02 — Gia hạn ngoại trú

        ↓

Request:
RENEWAL

        ↓

Approval:
Approver

        ↓

After APPROVE:

OLD EXPIRY_DATE
        ↓
NEW EXPIRY_DATE

        ↓

Audit:
RENEWAL
APPROVE

        ↓

Test:
TC-REN-01
TC-REN-02
TC-REN-03
14. Traceability — Chuyển nơi ở
Constraint:
BC-REQ-05
BC-REQ-06
BC-REQ-07
BC-REQ-08
BC-REQ-09

        ↓

Functional:
FR-REQ-03 — Chuyển nơi ở

        ↓

Use Case:
UC-REQ-03 — Chuyển nơi ở

        ↓

Request:
CHANGE_ADDRESS

        ↓

While PENDING:

CURRENT_ADDRESS
      ↓
Địa chỉ cũ

PROPOSED_ADDRESS
      ↓
Địa chỉ mới

        ↓

After APPROVE:

CURRENT_ADDRESS
      ↓
Địa chỉ mới

ADDRESS_HISTORY
      ↓
Lưu địa chỉ cũ

        ↓

Test:
TC-ADDR-01
TC-ADDR-02
TC-ADDR-03
15. Traceability — Kết thúc ngoại trú
Constraint:
BC-REQ-10
BC-REQ-11
BC-REQ-12

        ↓

Functional:
FR-REQ-04 — Kết thúc ngoại trú

        ↓

Use Case:
UC-REQ-04 — Kết thúc ngoại trú

        ↓

Request:
TERMINATION

        ↓

After APPROVE:

ACTIVE
  ↓
TERMINATED

        ↓

Audit:
TERMINATE

        ↓

Test:
TC-TERM-01
TC-TERM-02
16. Traceability — Tự động hết hạn
Constraint:
BC-REG-10
BC-REG-11
BC-REG-12

        ↓

Functional:
FR-SYS-01 — Tự động xử lý hết hạn

        ↓

Background Job:
Expiration Job

        ↓

Condition:

CURRENT_DATE > EXPIRY_DATE

        ↓

State:

ACTIVE
  ↓
EXPIRED

        ↓

Audit:

SYSTEM_AUTO_EXPIRE

        ↓

Notification:

EXPIRATION_NOTIFICATION

        ↓

Test:

TC-EXP-01
TC-EXP-02
17. Traceability — Quá số lần bổ sung
Constraint:
BC-REG-07
BC-REG-08

        ↓

System:

Addition Attempt Counter

        ↓

Condition:

attempt_count
>
MAX_ADDITION_ATTEMPTS

        ↓

State:

NEED_MORE_INFO
      ↓
REJECTED

        ↓

Audit:

SYSTEM_AUTO_REJECT

        ↓

Test:

TC-REQ-04
18. Traceability — Nộp trễ
Constraint:
BC-TIME-02

        ↓

Functional:
FR-REG-xx

        ↓

Condition:

SubmitDate > Deadline

        ↓

Data:

is_late = true

        ↓

Important:

is_late không phải
Registration Status.

        ↓

Processing:

Cán bộ vẫn có thể xử lý
theo quy định.

        ↓

Test:

TC-DEADLINE-01
TC-DEADLINE-02
19. Traceability — SLA & Escalation
Constraint:
BC-TIME-03
BC-TIME-04
BC-TIME-05

        ↓

Functional:
FR-SYS-02
FR-NOT-xx

        ↓

Condition:

ProcessingTime > SLA

        ↓

Flag:

is_overdue = true

        ↓

Nếu vượt ngưỡng:

ESCALATION

        ↓

Notification:

Supervisor Notification

        ↓

Audit:

SYSTEM_ESCALATION

        ↓

Test:

TC-SLA-01
TC-SLA-02
20. Traceability — SIS
Constraint:
BC-SIS-01
BC-SIS-02
BC-SIS-03
BC-SIS-04

        ↓

Functional:
FR-SIS-01 — Đồng bộ SIS

        ↓

Integration:
SIS

        ↓

Data:

Student
Academic Status

        ↓

Background Job:

SIS Sync

        ↓

Possible Events:

ACTIVE STUDENT
GRADUATED
WITHDRAWN
DISMISSED

        ↓

Audit:

SYSTEM_SIS_SYNC

        ↓

Test:

TC-SIS-01
TC-SIS-02
21. Traceability — Phân quyền
Constraint:
BC-ROLE-01
BC-ROLE-02
BC-ROLE-03
BC-ROLE-04
BC-ROLE-05
BC-ROLE-06

        ↓

Functional:
FR-AUTH-xx

        ↓

Security:

Authentication
        +
Role
        +
Permission
        +
Data Scope

        ↓

Examples:

Student
Officer
Approver
Administrator

        ↓

Test:

TC-AUTH-10
TC-AUTH-11
TC-AUTH-12
22. Traceability — Audit
Constraint:
BC-AUDIT-01
BC-AUDIT-02

        ↓

Functional:
FR-AUDIT-01

        ↓

Entity:

AUDIT_LOG

        ↓

Required:

Actor
Action
Target
Timestamp
Result
Source

        ↓

Source:

USER_ACTION
SYSTEM_ACTION

        ↓

Test:

TC-AUDIT-01
TC-AUDIT-02
23. Traceability — Document Version
Constraint:
BC-DOC-03
BC-DOC-04

        ↓

Functional:
FR-DOC-xx

        ↓

Entity:

DOCUMENT
DOCUMENT_VERSION

        ↓

Operation:

Upload V1
    ↓
Replace
    ↓
Upload V2

        ↓

Important:

V1 không bị xóa khỏi lịch sử.

        ↓

Test:

TC-DOC-01
TC-DOC-02
24. Traceability — Non-Functional Requirements
NFR	Ảnh hưởng
NFR-PERF	API, Database, Index, Pagination
NFR-SEC	Authentication, Authorization, API
NFR-AVAIL	Deployment, Monitoring
NFR-REL	Transaction, Error Handling
NFR-DATA	Database Constraint
NFR-AUDIT	AUDIT_LOG
NFR-USAB	UI/UX
NFR-SCALE	Database, Index, Architecture
NFR-BACKUP	Database/File Storage
NFR-MAINT	Architecture, Code Structure
NFR-COMPAT	Browser/API
NFR-PRIV	Authorization/Data Access
NFR-MON	Logging/Monitoring
NFR-DEPLOY	Dev/Test/Production
NFR-ERR	Backend/API/UI
25. Traceability Matrix tổng hợp
ID	Requirement	Use Case	Main Entity	Test
FR-AUTH-01	Đăng nhập	UC-AUTH-01	USER	TC-AUTH-01
FR-REG-01	Tạo hồ sơ	UC-REG-01	REGISTRATION	TC-REG-01
FR-REG-02	Gửi hồ sơ	UC-REG-02	REGISTRATION	TC-REG-03
FR-REG-03	Rút hồ sơ	UC-REG-03	REGISTRATION	TC-REG-05
FR-REG-04	Kiểm tra hồ sơ	UC-REG-04	REGISTRATION	TC-REG-06
FR-REQ-01	Yêu cầu bổ sung	UC-REQ-01	REQUEST	TC-REQ-01
FR-REQ-02	Gia hạn	UC-REQ-02	REQUEST	TC-REN-01
FR-REQ-03	Chuyển nơi ở	UC-REQ-03	REQUEST	TC-ADDR-01
FR-REQ-04	Kết thúc	UC-REQ-04	REQUEST	TC-TERM-01
FR-APP-01	Phê duyệt	UC-APP-01	REGISTRATION	TC-APP-01
FR-APP-02	Từ chối	UC-APP-02	REGISTRATION	TC-APP-04
FR-SYS-01	Tự động hết hạn	UC-SYS-01	REGISTRATION	TC-EXP-01
FR-SYS-02	SLA/Escalation	UC-SYS-02	REQUEST	TC-SLA-01
FR-SIS-01	Đồng bộ SIS	UC-SIS-01	STUDENT	TC-SIS-01
FR-AUDIT-01	Audit Log	UC-AUDIT-01	AUDIT_LOG	TC-AUDIT-01
26. Coverage Requirement

Mục tiêu của hệ thống tài liệu:

Business Requirement
        ↓
100% có Requirement
Functional Requirement
        ↓
100% có Use Case
Requirement
        ↓
100% có Test Case

Các yêu cầu Critical phải được
trace đầy đủ đến:

Business
 ↓
Requirement
 ↓
Use Case
 ↓
Design
 ↓
Implementation
 ↓
Test
27. Khi Requirement thay đổi

Khi một yêu cầu nghiệp vụ thay đổi,
phải xác định các thành phần
bị ảnh hưởng.

Ví dụ:

Renewal Period:
12 tháng
      ↓
Thay đổi thành 6 tháng

Phải kiểm tra:

Business Rule
      ↓
BC-REQ-02
      ↓
FR-REQ-02
      ↓
UC-REQ-02
      ↓
Configuration
      ↓
Database
      ↓
API
      ↓
UI
      ↓
Test Case

Không được chỉ sửa UI
mà bỏ qua Business Logic.

28. Requirement Change Impact

Mỗi Change Request nên xác định:

Change ID
Reason
Requested By
Date
Affected Business Rule
Affected Requirement
Affected Use Case
Affected Database
Affected API
Affected UI
Affected Test Case
Approval Status
29. Traceability Status
Business Analysis
        ↓
       DONE

Requirements Analysis
        ↓
       DONE

Traceability
        ↓
       CURRENT

Use Case Analysis
        ↓
       NEXT

System Design
        ↓
       FUTURE

Database Design
        ↓
       FUTURE

API Design
        ↓
       FUTURE

UI Design
        ↓
       FUTURE

Testing
        ↓
       FUTURE