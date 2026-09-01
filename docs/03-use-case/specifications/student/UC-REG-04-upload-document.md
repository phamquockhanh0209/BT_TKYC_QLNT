# UC-REG-04 — UPLOAD TÀI LIỆU

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-REG-04 |
| Tên Use Case | Upload tài liệu |
| Actor chính | Student |
| Actor phụ | System |
| Nhóm | Student Registration |
| Priority | High |

---

# 2. Mục đích

Use Case cho phép sinh viên
upload các tài liệu cần thiết
cho hồ sơ ngoại trú.

Tài liệu được liên kết với
Registration tương ứng.

System phải kiểm tra:

- Loại tài liệu.
- Định dạng file.
- Kích thước file.
- Tình trạng upload.
- Quyền truy cập.
- Phiên bản tài liệu.

---

# 3. Nguyên tắc tài liệu

Mỗi tài liệu phải thuộc
một Registration.

Mô hình:

```text
Student
   ↓
Registration
   ↓
Document

Không cho phép tạo tài liệu
không thuộc hồ sơ hợp lệ.

4. Preconditions
Student đã đăng nhập.
Session còn hiệu lực.
Registration tồn tại.
Registration thuộc
Student đang đăng nhập.
Registration đang ở
trạng thái cho phép
upload tài liệu.

Ví dụ:

DRAFT

hoặc trạng thái:

NEED_MORE_INFO

nếu Business Rule cho phép
sinh viên bổ sung tài liệu.

5. Trigger

Sinh viên chọn:

Hồ sơ ngoại trú
      ↓
Chọn hồ sơ
      ↓
Tài liệu
      ↓
Upload tài liệu
6. Loại tài liệu

System quản lý loại tài liệu
thông qua Catalog.

Ví dụ:

LANDLORD_CONFIRMATION
RESIDENCE_DOCUMENT
IDENTIFICATION_DOCUMENT
OTHER_REQUIRED_DOCUMENT

Tên loại tài liệu thực tế
phải được cấu hình trong
Catalog của hệ thống.

Không hard-code toàn bộ
loại tài liệu trong giao diện.

7. Required Document

Mỗi loại hồ sơ có thể
yêu cầu một tập tài liệu
khác nhau.

Ví dụ:

Registration
      ↓
Required Documents
      ├── Residence Document
      └── Landlord Confirmation

Danh sách tài liệu bắt buộc
phải được xác định bởi
Configuration / Catalog.

8. Main Flow
Bước 1

Student mở hồ sơ
ngoại trú.

Bước 2

System kiểm tra quyền
truy cập Registration.

Bước 3

System kiểm tra trạng thái
Registration.

Bước 4

Student chọn loại
tài liệu cần upload.

Bước 5

Student chọn file
từ thiết bị.

Bước 6

System kiểm tra file.

System kiểm tra:

File Type
File Size
File Name
File Content
Bước 7

Nếu file hợp lệ,
System tạo Document.

Bước 8

System tạo phiên bản
tài liệu:

Version = 1
Bước 9

System lưu file vào
Storage.

Bước 10

System lưu metadata
Document vào Database.

Bước 11

System liên kết Document
với Registration.

Bước 12

System ghi Audit Log.

Bước 13

System thông báo:

Upload tài liệu thành công.
9. Document Metadata

Database không chỉ lưu
file mà phải lưu metadata.

Ví dụ:

Document ID
Registration ID
Document Type
File Name
File Extension
File Size
Storage Location
Version
Uploaded By
Uploaded At
Status
10. File Storage

File thực tế không nên
lưu trực tiếp toàn bộ trong
các trường dữ liệu nghiệp vụ
của Registration.

Mô hình:

Student
   ↓
Registration
   ↓
Document Metadata
   ↓
File Storage

Database lưu metadata
và tham chiếu đến file.

Storage chịu trách nhiệm
lưu file thực tế.

11. File Validation

System phải kiểm tra
trước khi lưu.

11.1 File Extension

Chỉ cho phép các định dạng
được Configuration cho phép.

Ví dụ:

PDF
JPG
JPEG
PNG

Danh sách thực tế do
Administrator cấu hình.

12. File Size

System kiểm tra:

File Size <= Max File Size

Giới hạn dung lượng phải
được cấu hình trong
Configuration.

Nếu vượt quá giới hạn:

Upload Rejected
13. File Name

System phải xử lý
tên file an toàn.

Không sử dụng trực tiếp
tên file của người dùng
làm đường dẫn lưu trữ.

Ví dụ:

student_document.pdf

có thể được lưu bằng
Storage Key riêng:

generated-unique-key
14. File Content Validation

Không chỉ kiểm tra
extension.

System nên kiểm tra
nội dung file để tránh
trường hợp:

fake.pdf

nhưng nội dung thực tế
không phải PDF hợp lệ.

File không hợp lệ
phải bị từ chối.

15. Document Version

Mỗi lần tài liệu được
thay thế phải tạo
version mới.

Ví dụ:

Document
   │
   ├── Version 1
   │
   ├── Version 2
   │
   └── Version 3

Version không được
ghi đè lịch sử cũ.

16. Thay thế tài liệu

Nếu sinh viên upload
tài liệu mới cho cùng
một loại tài liệu:

Version 1
     ↓
Replace
     ↓
Version 2

Version 1 vẫn được
giữ lại để truy vết.

Version 2 trở thành
phiên bản hiện hành.

17. Current Version

System phải xác định
phiên bản hiện tại.

Ví dụ:

Document Type:
LANDLORD_CONFIRMATION

Versions:
V1
V2
V3

Current Version:
V3
18. Document Status

Document có thể có
các trạng thái nghiệp vụ
phù hợp.

Ví dụ:

UPLOADED
REPLACED
REJECTED

Danh sách trạng thái
thực tế phải thống nhất
với Business Rules.

19. Tài liệu bị yêu cầu
bổ sung

Nếu cán bộ yêu cầu
sinh viên bổ sung:

NEED_MORE_INFO
      ↓
Student
      ↓
Upload / Replace Document

Tài liệu mới phải được
liên kết với yêu cầu
bổ sung tương ứng nếu
hệ thống có cơ chế
tracking Request.

20. Không xóa lịch sử

Khi sinh viên thay thế
tài liệu:

Không thực hiện:

DELETE V1
INSERT V2

theo cách làm mất
khả năng truy vết.

Thay vào đó:

V1
 ↓
V2

và giữ lịch sử.

21. Alternative Flow
A1 — File không đúng định dạng

Nếu file không thuộc
định dạng cho phép:

System từ chối upload.

Thông báo:

Định dạng tài liệu
không được hỗ trợ.
A2 — File quá lớn

Nếu:

File Size > Max File Size

System từ chối upload.

Thông báo:

Dung lượng file vượt
quá giới hạn cho phép.
A3 — Upload cùng loại
tài liệu

Nếu Registration đã có
tài liệu cùng loại:

System hỏi / xác định
đây là thao tác thay thế.

Ví dụ:

Existing Document
      ↓
Replace
      ↓
Create New Version

Không tạo dữ liệu
trùng không kiểm soát.

A4 — Upload nhiều tài liệu

Nếu loại tài liệu cho phép
nhiều file:

Document Type
      ↓
File 1
File 2
File 3

System phải tuân thủ
số lượng tối đa được
Configuration cho phép.

A5 — Hồ sơ NEED_MORE_INFO

Nếu Registration đang:

NEED_MORE_INFO

System cho phép upload
tài liệu cần bổ sung nếu
yêu cầu bổ sung còn hiệu lực.

Tài liệu phải được liên kết
với Registration và Request
hoặc Review Item tương ứng
nếu có.

22. Exception Flow
E1 — Registration không tồn tại

System thông báo:

Không tìm thấy hồ sơ.

Không upload file.

E2 — Không có quyền

Nếu Registration không
thuộc Student hiện tại:

403 Forbidden

System từ chối.

E3 — Registration không
cho phép upload

Nếu trạng thái hồ sơ
không cho phép upload:

System từ chối thao tác.

Ví dụ:

ACTIVE

không mặc nhiên cho phép
sửa tài liệu đăng ký cũ.

Nếu cần thay đổi tài liệu,
phải sử dụng Request
nghiệp vụ phù hợp.

E4 — Storage Error

Nếu upload Storage thất bại:

Upload Failed

System không được tạo
Document metadata ở trạng
thái thành công nếu file
thực tế chưa được lưu
thành công.

E5 — Database Error

Nếu Database xảy ra lỗi:

System phải xử lý
transaction phù hợp.

Không để:

Database = Success
Storage = Failed

mà hệ thống lại hiển thị
upload thành công.

E6 — File bị gián đoạn

Nếu quá trình upload
bị gián đoạn:

System thông báo lỗi
và cho phép sinh viên
thực hiện lại.

23. Security

File upload phải được
kiểm soát bảo mật.

System phải:

Kiểm tra quyền truy cập.
Kiểm tra loại file.
Kiểm tra kích thước.
Kiểm tra nội dung file.
Không sử dụng tên file
trực tiếp làm Storage Path.
Không cho phép truy cập
file của sinh viên khác.
24. Access Control

Mô hình:

Authenticated User
        ↓
Student ID
        ↓
Registration Owner
        ↓
Document

Student chỉ được
upload tài liệu cho
Registration của chính mình.

25. Download / View Document

Student chỉ được xem
tài liệu thuộc hồ sơ
của mình.

Ví dụ:

Student A
   ↓
Registration A
   ↓
Document A

Không được:

Student A
   ↓
Document B
26. Audit Log

Các thao tác quan trọng
phải được ghi Audit Log.

Ví dụ:

DOCUMENT_UPLOADED
DOCUMENT_REPLACED
DOCUMENT_REJECTED

Thông tin Log:

Actor ID
Actor Type
Action
Registration ID
Document ID
Document Version
Timestamp
Result
27. Ví dụ Audit Log
Actor:
Student

Action:
DOCUMENT_REPLACED

Registration:
REG-2026-000001

Document:
DOC-000001

Version:
2

Timestamp:
2026-09-10 10:30:00

Result:
SUCCESS
28. Notification

Sau khi upload:

Tài liệu đã được tải lên
thành công.

Sau khi thay thế:

Tài liệu mới đã được
cập nhật.

Nếu upload thất bại:

Không thể tải tài liệu.
Vui lòng kiểm tra file
và thử lại.
29. Business Constraints
BR-DOC-01

Mỗi Document phải thuộc
một Registration hợp lệ.

BR-DOC-02

Student chỉ được upload
tài liệu cho Registration
của chính mình.

BR-DOC-03

Document Type phải thuộc
Catalog hợp lệ.

BR-DOC-04

File phải đáp ứng định dạng
được hệ thống cho phép.

BR-DOC-05

File không được vượt quá
Max File Size.

BR-DOC-06

System phải kiểm tra
nội dung file phù hợp.

BR-DOC-07

File phải được lưu vào
Storage an toàn.

BR-DOC-08

Metadata Document phải
được lưu trong Database.

BR-DOC-09

Thay thế tài liệu phải
tạo Version mới.

BR-DOC-10

Version cũ không được
xóa làm mất khả năng
truy vết.

BR-DOC-11

Chỉ Version hiện hành
được sử dụng cho nghiệp vụ
kiểm tra hiện tại.

BR-DOC-12

Document phải liên kết
đúng với Registration.

BR-DOC-13

Các thao tác tài liệu
quan trọng phải có
Audit Log.

BR-DOC-14

Document không được
truy cập bởi Student
không sở hữu hồ sơ.

BR-DOC-15

Việc upload phải tuân
thủ trạng thái của
Registration.

30. Postconditions

Nếu upload thành công:

File
 ↓
Storage

và:

Document Metadata
 ↓
Database

đồng thời:

Document
 ↓
Registration

được liên kết thành công.

Audit Log được ghi nhận.

31. State Machine

Upload tài liệu không
làm thay đổi State chính
của Registration.

Ví dụ:

DRAFT
  ↓
Upload Document
  ↓
DRAFT

hoặc:

NEED_MORE_INFO
  ↓
Upload Document
  ↓
NEED_MORE_INFO

Việc chuyển:

DRAFT
 ↓
SUBMITTED

được xử lý bởi:

UC-REG-05
32. Acceptance Criteria
AC01

Student có thể upload
tài liệu cho hồ sơ
của mình.

AC02

System kiểm tra quyền
trước khi upload.

AC03

System kiểm tra
Document Type.

AC04

System kiểm tra
File Extension.

AC05

System kiểm tra
File Size.

AC06

System kiểm tra
File Content.

AC07

File hợp lệ được
lưu vào Storage.

AC08

Document Metadata
được lưu vào Database.

AC09

Document được liên kết
với Registration.

AC10

Upload thành công
được ghi Audit Log.

AC11

Thay thế tài liệu
tạo Version mới.

AC12

Version cũ vẫn được
giữ để truy vết.

AC13

System xác định
Current Version.

AC14

Student không thể
truy cập tài liệu
của Student khác.

AC15

Upload không tự động
chuyển State của
Registration.

AC16

System xử lý Storage
Error.

AC17

System xử lý Database
Error.

33. Traceability
Business Overview
       ↓
Business Rules
       ↓
Business Flow
       ↓
Functional Requirements
       ↓
UC-REG-04
       ↓
Activity Diagram
       ↓
Sequence Diagram
       ↓
Document Module
       ↓
Storage
       ↓
Database
       ↓
Implementation
34. Related Use Cases
UC-REG-02
Tạo hồ sơ ngoại trú
        ↓
UC-REG-03
Chỉnh sửa DRAFT
        ↓
UC-REG-04
Upload tài liệu
        ↓
UC-REG-05
Gửi hồ sơ

Ngoài ra:

NEED_MORE_INFO
      ↓
UC-REG-08
Bổ sung hồ sơ
      ↓
UC-REG-04
Upload / Replace Document
35. Status

Use Case ID:

UC-REG-04

Version:

1.0

Status:

Draft

Previous:

UC-REG-03 — Chỉnh sửa hồ sơ DRAFT

Next:

UC-REG-05 — Gửi hồ sơ