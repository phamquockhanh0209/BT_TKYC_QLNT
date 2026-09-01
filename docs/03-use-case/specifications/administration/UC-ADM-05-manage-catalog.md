# UC-ADM-05 — QUẢN LÝ DANH MỤC

---

# 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| Use Case ID | UC-ADM-05 |
| Tên Use Case | Quản lý danh mục |
| Actor chính | Administrator |
| Nhóm | Administration |
| Priority | Medium |
| Đối tượng | Catalog / Master Data |

---

# 2. Mục đích

Use Case mô tả việc Administrator
quản lý các dữ liệu danh mục
được sử dụng trong hệ thống
quản lý sinh viên ngoại trú.

Danh mục giúp hệ thống sử dụng
các giá trị thống nhất thay vì
cho phép người dùng nhập tự do.

Ví dụ:

- Khoa.
- Ngành.
- Loại nơi ở.
- Loại giấy tờ.
- Một số danh mục nghiệp vụ khác.

---

# 3. Nguyên tắc quản lý danh mục

Danh mục được sử dụng làm
dữ liệu tham chiếu cho các
nghiệp vụ khác.

Mô hình:

```text
Catalog
   ↓
Business Data
   ↓
Registration / Request

Ví dụ:

Loại nơi ở
   ↓
Phòng trọ
   ↓
Registration
4. Các nhóm danh mục

Hệ thống có thể quản lý
các nhóm danh mục sau:

4.1 Academic Catalog
Faculty
Major
Class
Academic Year

Tuy nhiên dữ liệu sinh viên,
khoa, ngành và lớp nếu là
dữ liệu chính thức từ SIS
thì SIS vẫn là nguồn dữ liệu
chính.

Administrator không tùy tiện
thay đổi dữ liệu do SIS cung cấp.

4.2 Residence Catalog

Ví dụ:

RENTED_ROOM
BOARDING_HOUSE
RELATIVE_HOME
OTHER
4.3 Document Type Catalog

Ví dụ:

LANDLORD_CONFIRMATION
RESIDENCE_DOCUMENT
IDENTIFICATION_DOCUMENT
OTHER
4.4 Request Type Catalog

Ví dụ:

RENEWAL
CHANGE_ADDRESS
TERMINATION
4.5 Status / Reference Catalog

Chỉ quản lý các giá trị
được phép cấu hình.

Các trạng thái cốt lõi của
State Machine không được
thay đổi tùy tiện nếu chúng
được định nghĩa cố định
trong nghiệp vụ.

5. Preconditions
Administrator đã đăng nhập.
Phiên đăng nhập còn hiệu lực.
Administrator có Permission
quản lý danh mục.
Hệ thống đang hoạt động.
6. Trigger

Administrator truy cập:

Quản trị
   ↓
Quản lý danh mục
7. Main Flow — Xem danh sách danh mục
Bước 1

Administrator chọn nhóm
danh mục.

Bước 2

System kiểm tra Permission.

Bước 3

System lấy dữ liệu danh mục.

Bước 4

System hiển thị:

Catalog Code
Catalog Name
Description
Status
Sort Order
Created At
Updated At
8. Main Flow — Xem chi tiết danh mục
Bước 1

Administrator chọn một
danh mục.

Bước 2

System hiển thị thông tin.

Ví dụ:

RESIDENCE_TYPE

Code:
RENTED_ROOM

Name:
Phòng trọ

Status:
ACTIVE
9. Main Flow — Tạo danh mục
Bước 1

Administrator chọn:

Tạo danh mục
Bước 2

Administrator nhập:

Code
Name
Description
Sort Order
Bước 3

System kiểm tra dữ liệu.

Bước 4

System kiểm tra Code
không bị trùng trong
cùng nhóm danh mục.

Bước 5

System tạo danh mục.

Bước 6

System ghi Audit Log:

CATALOG_CREATED
10. Main Flow — Cập nhật danh mục
Bước 1

Administrator chọn danh mục.

Bước 2

Administrator chọn:

Cập nhật
Bước 3

Administrator thay đổi
thông tin được phép.

Bước 4

System kiểm tra dữ liệu.

Bước 5

System lưu thay đổi.

Bước 6

System ghi:

CATALOG_UPDATED
11. Main Flow — Kích hoạt danh mục

Administrator chọn danh mục
đang INACTIVE.

System yêu cầu xác nhận.

Sau khi xác nhận:

INACTIVE
    ↓
ACTIVE

System ghi:

CATALOG_ACTIVATED
12. Main Flow — Vô hiệu hóa danh mục

Administrator chọn danh mục
đang ACTIVE.

System kiểm tra danh mục
có đang được sử dụng hay không.

Nếu chính sách cho phép:

ACTIVE
    ↓
INACTIVE

System ghi:

CATALOG_DEACTIVATED
13. Không xóa danh mục
đang được sử dụng

Ví dụ:

RESIDENCE_TYPE
      ↓
RENTED_ROOM
      ↓
Registration

Nếu đã có hồ sơ sử dụng
giá trị này thì không nên
xóa vật lý.

Thay vào đó:

ACTIVE
   ↓
INACTIVE

Mục tiêu:

Không phá vỡ dữ liệu lịch sử
14. Danh mục và Registration

Registration có thể tham chiếu
đến các danh mục.

Ví dụ:

Registration
     ↓
Residence Type
     ↓
RENTED_ROOM

Khi danh mục bị INACTIVE:

Hồ sơ cũ vẫn giữ giá trị.
Không cho tạo dữ liệu mới
sử dụng danh mục đó nếu
nghiệp vụ yêu cầu.
15. Danh mục và Request

Request có thể tham chiếu
đến Request Type.

Ví dụ:

Request
   ↓
Request Type
   ↓
CHANGE_ADDRESS

Danh mục giúp System phân biệt
các loại yêu cầu phát sinh.

16. Danh mục loại giấy tờ

Document có thể tham chiếu
đến Document Type.

Ví dụ:

Document
    ↓
Document Type
    ↓
LANDLORD_CONFIRMATION

Điều này giúp System xác định
loại tài liệu mà sinh viên
cần cung cấp.

17. Danh mục từ SIS

Nếu dữ liệu thuộc SIS:

SIS
 ↓
Faculty
Major
Class
Academic Year

thì SIS là nguồn dữ liệu
chính.

System ngoại trú chỉ nên
sử dụng dữ liệu được đồng bộ
từ SIS.

Administrator không được
tùy tiện sửa dữ liệu SIS
tại hệ thống ngoại trú.

18. Alternative Flow
A1 — Code bị trùng

Nếu Code đã tồn tại:

Create Catalog
      ↓
Duplicate Code

System:

Không tạo dữ liệu.
Hiển thị lỗi.
Yêu cầu nhập Code khác.
A2 — Danh mục đã được sử dụng

Nếu Administrator muốn
vô hiệu hóa danh mục đang
được sử dụng:

System cảnh báo.

Administrator phải xác nhận
theo chính sách.

A3 — Danh mục INACTIVE

Nếu danh mục đã INACTIVE:

System không thực hiện
thao tác vô hiệu hóa lần nữa.

19. Exception Flow
E1 — Không có Permission

Nếu Administrator không có
quyền:

403 Forbidden

System từ chối thao tác.

E2 — Catalog Not Found

Nếu danh mục không tồn tại:

Catalog Not Found

System không thực hiện
thao tác.

E3 — Dữ liệu không hợp lệ

Nếu dữ liệu không hợp lệ:

Không lưu.
Hiển thị lỗi.
Cho phép nhập lại.
E4 — Database Error

Nếu xảy ra lỗi Database:

Rollback transaction.
Không xác nhận thành công.
Ghi Error Log.
Thông báo lỗi.
20. Trạng thái danh mục

Danh mục có thể có:

ACTIVE
INACTIVE
ACTIVE

Có thể sử dụng trong
các nghiệp vụ mới.

INACTIVE

Không được sử dụng cho
dữ liệu mới nếu chính sách
yêu cầu.

Dữ liệu lịch sử vẫn giữ
giá trị cũ.

21. Sort Order

Một số danh mục có thể
có thứ tự hiển thị.

Ví dụ:

1. Phòng trọ
2. Nhà thuê
3. Nhà người thân
4. Khác

Administrator có thể
thay đổi Sort Order nếu
có Permission phù hợp.

22. Không thay đổi
mã danh mục tùy tiện

Nếu Code đã được sử dụng
bởi dữ liệu nghiệp vụ:

RENTED_ROOM
     ↓
Registration

không nên đổi trực tiếp:

RENTED_ROOM
     ↓
ROOM_RENT

vì có thể ảnh hưởng đến
dữ liệu tham chiếu.

Ưu tiên tạo giá trị mới
hoặc thực hiện migration
theo quy trình được kiểm soát.

23. Audit Log

Các thao tác quan trọng
phải được ghi Audit Log:

CATALOG_CREATED
CATALOG_UPDATED
CATALOG_ACTIVATED
CATALOG_DEACTIVATED

Audit Log tối thiểu:

Actor
Action
Catalog Type
Catalog Code
Old Value
New Value
Timestamp
Result
Reason
24. Phân quyền

Các Permission có thể gồm:

VIEW_CATALOG
CREATE_CATALOG
UPDATE_CATALOG
ACTIVATE_CATALOG
DEACTIVATE_CATALOG

Administrator chỉ thực hiện
được thao tác nếu có
Permission tương ứng.

25. Business Constraints
BR-CAT-01

Catalog Code phải duy nhất
trong phạm vi Catalog Type.

BR-CAT-02

Catalog phải có tên
và thông tin cần thiết.

BR-CAT-03

Catalog INACTIVE không
được sử dụng cho dữ liệu
mới nếu nghiệp vụ không
cho phép.

BR-CAT-04

Catalog đang được sử dụng
không được xóa vật lý
tùy tiện.

BR-CAT-05

Không tự ý thay đổi
mã Catalog đã được
tham chiếu.

BR-CAT-06

Dữ liệu thuộc SIS phải
được quản lý theo nguồn
dữ liệu SIS.

BR-CAT-07

Các thay đổi Catalog
phải được ghi Audit Log.

BR-CAT-08

Chỉ User có Permission
phù hợp mới được quản lý
Catalog.

26. Postconditions

Sau khi tạo:

Catalog
   ↓
Created

Sau khi cập nhật:

Catalog
   ↓
Updated

Sau khi vô hiệu hóa:

Catalog
   ↓
INACTIVE

Dữ liệu lịch sử vẫn
có thể truy xuất.

Audit Log được ghi nhận.

27. Acceptance Criteria
AC01

Administrator có thể xem
danh sách Catalog.

AC02

Administrator có thể xem
chi tiết Catalog.

AC03

Catalog Code không được
trùng trong cùng Catalog Type.

AC04

Administrator có thể tạo
Catalog nếu được phép.

AC05

Administrator có thể cập nhật
Catalog nếu được phép.

AC06

Administrator có thể kích hoạt
Catalog.

AC07

Administrator có thể vô hiệu hóa
Catalog.

AC08

Catalog INACTIVE không được
sử dụng cho dữ liệu mới
nếu nghiệp vụ không cho phép.

AC09

Catalog đang được sử dụng
không bị xóa vật lý tùy tiện.

AC10

Dữ liệu lịch sử vẫn giữ
giá trị Catalog đã sử dụng.

AC11

Dữ liệu thuộc SIS không
bị chỉnh sửa tùy tiện tại
hệ thống ngoại trú.

AC12

Thay đổi Catalog được
ghi Audit Log.

28. Traceability
Business Rules
      ↓
Catalog Rules
      ↓
Functional Requirements
      ↓
UC-ADM-05
      ↓
Activity Diagram
      ↓
Sequence Diagram
      ↓
Catalog Management Module
      ↓
Database
      ↓
Implementation
29. Status

Use Case ID:

UC-ADM-05

Version:

1.0

Status:

Draft

Previous:

UC-ADM-04 — Quản lý Configuration

Next:

UC-ADM-06 — Xem Audit Log