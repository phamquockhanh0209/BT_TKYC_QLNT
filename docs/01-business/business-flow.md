# BUSINESS FLOW
# HỆ THỐNG QUẢN LÝ SINH VIÊN NGOẠI TRÚ

---

## 1. Mục đích tài liệu

Tài liệu mô tả toàn bộ các luồng nghiệp vụ của hệ thống
Quản lý Sinh viên Ngoại trú.

Business Flow được sử dụng để:

- Mô tả trình tự xử lý nghiệp vụ.
- Xác định điểm bắt đầu và kết thúc của từng nghiệp vụ.
- Xác định các nhánh xử lý chính, thay thế và ngoại lệ.
- Làm cơ sở xây dựng Functional Requirements.
- Làm cơ sở xây dựng Use Case.
- Làm cơ sở xây dựng Activity Diagram.
- Làm cơ sở xây dựng Sequence Diagram.
- Làm cơ sở xây dựng State Machine.
- Làm cơ sở thiết kế Database và API.

---

# 2. Các Actor tham gia

## 2.1. Sinh viên

Sinh viên là người sử dụng hệ thống để:

- Tạo hồ sơ ngoại trú.
- Khai báo nơi ở.
- Tải giấy tờ.
- Gửi hồ sơ.
- Bổ sung hồ sơ.
- Theo dõi trạng thái hồ sơ.
- Rút hồ sơ trong trường hợp được phép.
- Gửi yêu cầu gia hạn.
- Gửi yêu cầu chuyển nơi ở.
- Gửi yêu cầu kết thúc ngoại trú.
- Nhận thông báo.
- Xem lịch sử xử lý.

---

## 2.2. Cán bộ tiếp nhận

Cán bộ tiếp nhận có nhiệm vụ:

- Tiếp nhận hồ sơ.
- Kiểm tra sơ bộ.
- Kiểm tra tính đầy đủ ban đầu.
- Chuyển hồ sơ sang bước xử lý.
- Thực hiện các thao tác được cấp quyền.

Cán bộ tiếp nhận không mặc nhiên có quyền
phê duyệt cuối.

---

## 2.3. Cán bộ xử lý

Cán bộ xử lý có nhiệm vụ:

- Kiểm tra thông tin.
- Kiểm tra giấy tờ.
- Đối chiếu dữ liệu.
- Yêu cầu sinh viên bổ sung.
- Đánh giá hồ sơ.
- Đề xuất kết quả.
- Chuyển hồ sơ đến cán bộ có quyền phê duyệt.

---

## 2.4. Cán bộ phê duyệt

Cán bộ phê duyệt có nhiệm vụ:

- Xem kết quả kiểm tra.
- Xem hồ sơ và giấy tờ.
- Phê duyệt hồ sơ.
- Từ chối hồ sơ.
- Phê duyệt hoặc từ chối REQUEST
  thuộc phạm vi được phân quyền.

---

## 2.5. Cán bộ phê duyệt cấp cao

Cán bộ phê duyệt cấp cao có nhiệm vụ:

- Xử lý hồ sơ được escalation.
- Xử lý trường hợp đặc biệt.
- Phê duyệt các hồ sơ thuộc phạm vi được cấp.

---

## 2.6. Administrator

Administrator có nhiệm vụ:

- Quản lý tài khoản.
- Quản lý Role.
- Quản lý Permission.
- Quản lý Data Scope.
- Quản lý danh mục.
- Quản lý cấu hình nghiệp vụ.
- Theo dõi Audit Log.
- Theo dõi tình trạng đồng bộ SIS.

Administrator không mặc nhiên có quyền phê duyệt
hồ sơ nghiệp vụ.

---

## 2.7. SIS

SIS là hệ thống nguồn cung cấp thông tin sinh viên.

Các thông tin có thể đồng bộ:

- MSSV.
- Họ tên.
- Ngày sinh.
- Lớp.
- Khoa.
- Khóa.
- Trạng thái học tập.

---

# 3. Tổng quan luồng hệ thống

Luồng nghiệp vụ tổng thể:

```text
Sinh viên
   ↓
Tạo hồ sơ
   ↓
Khai báo thông tin
   ↓
Khai báo nơi ở
   ↓
Đính kèm giấy tờ
   ↓
Kiểm tra hồ sơ
   ↓
Gửi hồ sơ
   ↓
Cán bộ tiếp nhận
   ↓
Cán bộ xử lý
   ↓
Kiểm tra
   ↓
┌─────────────────────────────────────┐
│                                     │
↓                                     ↓
Hợp lệ                            Không đầy đủ
↓                                     ↓
Cán bộ phê duyệt                 NEED_MORE_INFO
↓                                     ↓
┌───────────────┬───────────────┐    Sinh viên bổ sung
│               │               │         ↓
↓               ↓               │    Gửi lại
APPROVED      REJECTED          │         ↓
↓                               │    Tiếp tục xử lý
ACTIVE                         │
                               
ACTIVE
 │
 ├── Gia hạn
 │
 ├── Chuyển nơi ở
 │
 ├── Kết thúc ngoại trú
 │
 └── Hết hạn
       ↓
    EXPIRED
4. Luồng 01 — Đăng ký ngoại trú
4.1. Mục đích

Cho phép sinh viên đăng ký nơi ở ngoại trú
và gửi hồ sơ để nhà trường kiểm tra, phê duyệt.

4.2. Điều kiện bắt đầu

Sinh viên:

Có tài khoản hợp lệ.
Đang là sinh viên theo dữ liệu SIS.
Chưa có hồ sơ ngoại trú ACTIVE.
Đáp ứng điều kiện đăng ký ngoại trú.
4.3. Luồng chính
Bước 1

Sinh viên đăng nhập hệ thống.

Bước 2

Hệ thống xác thực tài khoản.

Bước 3

Hệ thống lấy thông tin sinh viên
từ dữ liệu SIS.

Bước 4

Sinh viên chọn chức năng:

Đăng ký ngoại trú
Bước 5

Hệ thống kiểm tra sinh viên
có hồ sơ ACTIVE hay không.

Bước 6

Nếu không có hồ sơ ACTIVE,
hệ thống tạo REGISTRATION:

status = DRAFT
Bước 7

Sinh viên khai báo thông tin nơi ở.

Thông tin có thể bao gồm:

Địa chỉ.
Số nhà.
Đường.
Phường/xã.
Quận/huyện.
Tỉnh/thành phố.
Thông tin chủ trọ.
Thông tin phòng.
Bước 8

Sinh viên nhập các thông tin cần thiết
theo biểu mẫu.

Bước 9

Sinh viên tải giấy tờ cần thiết.

Bước 10

Hệ thống kiểm tra tính đầy đủ.

Bước 11

Nếu hợp lệ,
sinh viên chọn:

Gửi hồ sơ
Bước 12

Hệ thống chuyển:

DRAFT
   ↓
SUBMITTED
Bước 13

Hệ thống ghi nhận thời điểm gửi.

Bước 14

Hệ thống xác định hồ sơ có nộp trễ hay không.

Nếu quá deadline:

is_late = TRUE
Bước 15

Hệ thống tạo thông báo
cho cán bộ tiếp nhận.

4.4. Luồng thay thế — Hồ sơ chưa đầy đủ

Nếu thiếu thông tin hoặc giấy tờ:

DRAFT
  ↓
Kiểm tra
  ↓
Thiếu dữ liệu
  ↓
Không cho SUBMIT

Hệ thống hiển thị danh sách
các trường còn thiếu.

Sinh viên bổ sung và kiểm tra lại.

4.5. Luồng thay thế — Sinh viên đã có ACTIVE

Nếu sinh viên đã có:

REGISTRATION.status = ACTIVE

hệ thống không cho tạo hồ sơ đăng ký ngoại trú mới.

Sinh viên phải sử dụng REQUEST phù hợp,
ví dụ:

CHANGE_ADDRESS
RENEWAL
TERMINATION
4.6. Luồng thay thế — Sinh viên rút hồ sơ

Nếu hồ sơ đang ở trạng thái cho phép rút:

DRAFT
SUBMITTED
NEED_MORE_INFO

sinh viên có thể chọn:

Rút hồ sơ

Hệ thống:

→ xác nhận yêu cầu
→ ghi lý do nếu cần
→ chuyển WITHDRAWN/CANCELLED
→ ghi Audit Log
→ gửi thông báo
5. Luồng 02 — Tiếp nhận hồ sơ
5.1. Mục đích

Cho phép cán bộ tiếp nhận xử lý
hồ sơ mới được sinh viên gửi.

5.2. Luồng chính
SUBMITTED
   ↓
Cán bộ tiếp nhận xem danh sách
   ↓
Chọn hồ sơ
   ↓
Kiểm tra sơ bộ
   ↓
Đầy đủ?
   ↓
Có
   ↓
Tiếp nhận
   ↓
UNDER_REVIEW
5.3. Nếu hồ sơ thiếu

Cán bộ có quyền yêu cầu bổ sung
theo phạm vi được cấp.

Hệ thống:

UNDER_REVIEW
      ↓
NEED_MORE_INFO

Sinh viên nhận thông báo.

6. Luồng 03 — Kiểm tra hồ sơ
6.1. Mục đích

Cán bộ xử lý kiểm tra tính chính xác
và hợp lệ của hồ sơ.

6.2. Luồng chính
UNDER_REVIEW
      ↓
Cán bộ xử lý
      ↓
Kiểm tra thông tin sinh viên
      ↓
Kiểm tra nơi ở
      ↓
Kiểm tra chủ trọ
      ↓
Kiểm tra giấy tờ
      ↓
Đối chiếu dữ liệu
      ↓
Đánh giá kết quả
6.3. Hồ sơ hợp lệ

Nếu hồ sơ hợp lệ:

UNDER_REVIEW
      ↓
Đề xuất phê duyệt
      ↓
Cán bộ phê duyệt
6.4. Hồ sơ cần bổ sung

Nếu hồ sơ chưa đủ:

UNDER_REVIEW
      ↓
NEED_MORE_INFO

Cán bộ phải ghi rõ:

Nội dung cần bổ sung.
Tài liệu cần bổ sung.
Thời hạn bổ sung.
7. Luồng 04 — Bổ sung hồ sơ
7.1. Mục đích

Cho phép sinh viên hoàn thiện hồ sơ
theo yêu cầu của cán bộ.

7.2. Luồng chính
NEED_MORE_INFO
      ↓
Sinh viên nhận thông báo
      ↓
Xem yêu cầu bổ sung
      ↓
Bổ sung thông tin
      ↓
Bổ sung/thay thế giấy tờ
      ↓
Gửi lại
      ↓
SUBMITTED
      ↓
UNDER_REVIEW
7.3. Bổ sung tài liệu

Khi thay thế giấy tờ:

DOCUMENT
 ├── VERSION 1
 └── VERSION 2 ← CURRENT

Version cũ vẫn được giữ lại.

7.4. Hết thời hạn bổ sung

Nếu sinh viên không bổ sung
trong thời hạn:

NEED_MORE_INFO
      ↓
Quá hạn

Hệ thống xử lý theo chính sách
được cấu hình.

Có thể:

→ REJECTED

hoặc áp dụng quy tắc khác
nếu nhà trường quy định.

7.5. Vượt số lần bổ sung

Nếu số lần bổ sung vượt:

MAX_ADDITION_ATTEMPTS

hệ thống xử lý:

NEED_MORE_INFO
      ↓
MAX_ATTEMPTS_REACHED
      ↓
REJECTED

Lý do phải được ghi nhận là:

SYSTEM_RULE_MAX_ATTEMPTS
8. Luồng 05 — Phê duyệt hồ sơ
8.1. Mục đích

Cho phép cán bộ có quyền phê duyệt
ra quyết định cuối cùng.

8.2. Luồng chính
Hồ sơ đã kiểm tra
      ↓
Cán bộ phê duyệt
      ↓
Xem hồ sơ
      ↓
Xem giấy tờ
      ↓
Xem kết quả kiểm tra
      ↓
Ra quyết định
8.3. Phê duyệt

Nếu hợp lệ:

APPROVED
   ↓
ACTIVE

Hệ thống:

Ghi người phê duyệt.
Ghi thời gian.
Tính thời hạn hiệu lực.
Cập nhật trạng thái.
Ghi Audit Log.
Gửi thông báo cho sinh viên.
8.4. Từ chối

Nếu không hợp lệ:

REJECTED

Cán bộ phải nhập lý do.

Sinh viên nhận thông báo.

9. Luồng 06 — Gia hạn ngoại trú
9.1. Điều kiện

Sinh viên có:

REGISTRATION.status = ACTIVE

và hồ sơ đang gần hết hạn
hoặc đủ điều kiện gửi yêu cầu gia hạn.

9.2. Luồng chính
Sinh viên
   ↓
Chọn Gia hạn
   ↓
Hệ thống kiểm tra điều kiện
   ↓
Tạo RENEWAL REQUEST
   ↓
PENDING
   ↓
Cán bộ xử lý
   ↓
Kiểm tra
   ↓
Cán bộ phê duyệt
9.3. Phê duyệt gia hạn

Nếu APPROVED:

REQUEST = APPROVED
       ↓
Tính ngày hết hạn mới
       ↓
expiry_date được cập nhật

Thời hạn mặc định:

12 tháng

Giá trị lấy từ cấu hình nghiệp vụ.

9.4. Từ chối gia hạn

Nếu REJECTED:

REQUEST = REJECTED

Ngày hết hạn cũ không thay đổi.

Sinh viên nhận thông báo.

10. Luồng 07 — Chuyển nơi ở
10.1. Mục đích

Cho phép sinh viên đang ngoại trú
thay đổi nơi ở.

10.2. Luồng chính
ACTIVE
   ↓
Sinh viên chọn Chuyển nơi ở
   ↓
Nhập nơi ở mới
   ↓
Đính kèm giấy tờ
   ↓
Tạo CHANGE_ADDRESS REQUEST
   ↓
PENDING

Trong thời gian chờ:

Địa chỉ cũ = CURRENT
Địa chỉ mới = PENDING
10.3. Kiểm tra

Cán bộ:

PENDING
   ↓
UNDER_REVIEW
   ↓
Kiểm tra nơi ở mới
   ↓
Kiểm tra giấy tờ
   ↓
Ra quyết định
10.4. Duyệt chuyển nơi ở

Nếu APPROVED:

OLD ADDRESS
CURRENT
   ↓
HISTORY

NEW ADDRESS
PENDING
   ↓
CURRENT

Hệ thống ghi lịch sử.

10.5. Từ chối chuyển nơi ở

Nếu REJECTED:

OLD ADDRESS = CURRENT
NEW ADDRESS = REJECTED

Hồ sơ ngoại trú vẫn tiếp tục
ở trạng thái ACTIVE.

11. Luồng 08 — Kết thúc ngoại trú
11.1. Mục đích

Cho phép sinh viên yêu cầu
kết thúc tình trạng ngoại trú.

11.2. Luồng chính
ACTIVE
   ↓
Sinh viên tạo TERMINATION REQUEST
   ↓
PENDING
   ↓
Cán bộ xử lý
   ↓
Kiểm tra
   ↓
Cán bộ phê duyệt
11.3. Duyệt

Nếu APPROVED:

ACTIVE
   ↓
TERMINATED

Đồng thời:

Kết thúc hiệu lực nơi ở hiện tại.
Giữ lịch sử nơi ở.
Đóng các nghiệp vụ liên quan nếu cần.
Ghi Audit Log.
Gửi thông báo.
11.4. Từ chối

Nếu REJECTED:

ACTIVE

vẫn giữ nguyên.

REQUEST được ghi nhận là REJECTED.

12. Luồng 09 — Hồ sơ hết hạn
12.1. Mục đích

Đảm bảo hồ sơ không tiếp tục ACTIVE
sau khi ngày hết hạn đã qua.

12.2. Thông báo trước hạn

Trước ngày hết hạn theo số ngày
được cấu hình:

ACTIVE
   ↓
Gửi thông báo
12.3. Không gia hạn

Nếu:

CURRENT_DATE > EXPIRY_DATE

và không có gia hạn hợp lệ:

ACTIVE
   ↓
EXPIRED
12.4. Sau khi EXPIRED

Sinh viên không còn được xem là
ngoại trú hợp lệ theo hồ sơ đó.

Chính sách gia hạn muộn được xử lý
theo cấu hình của nhà trường.

13. Luồng 10 — Rút hồ sơ
13.1. DRAFT

Sinh viên có thể hủy DRAFT.

DRAFT
   ↓
CANCELLED
13.2. SUBMITTED

Nếu chính sách cho phép:

SUBMITTED
   ↓
WITHDRAWN

Hệ thống ghi Audit.

13.3. NEED_MORE_INFO

Sinh viên có thể rút hồ sơ
nếu chính sách cho phép:

NEED_MORE_INFO
   ↓
WITHDRAWN
13.4. ACTIVE

Không cho phép sinh viên
tự rút hồ sơ ACTIVE.

Muốn kết thúc phải sử dụng:

TERMINATION REQUEST
14. Luồng 11 — SLA và quá hạn xử lý
14.1. Bắt đầu SLA

Khi hồ sơ/REQUEST bước vào trạng thái
cần cán bộ xử lý:

SLA_START_AT

được ghi nhận.

14.2. Trong thời gian SLA

Cán bộ xử lý bình thường.

14.3. Vượt SLA

Nếu quá thời hạn:

OVERDUE = TRUE

Hệ thống:

Đánh dấu quá hạn.
Hiển thị trong danh sách quá hạn.
Gửi cảnh báo nếu được cấu hình.
14.4. Escalation

Nếu tiếp tục vượt ngưỡng:

OVERDUE
   ↓
ESCALATION
   ↓
Cán bộ cấp cao

Hệ thống ghi Audit Log.

15. Luồng 12 — Đồng bộ SIS
15.1. Luồng tổng quát
SIS
 ↓
Synchronization Job
 ↓
Kiểm tra dữ liệu
 ↓
Đồng bộ
 ↓
Cập nhật dữ liệu sinh viên
 ↓
Ghi Sync Log
15.2. Đồng bộ thành công

Hệ thống ghi:

sync_status = SUCCESS

và:

last_sync_at
15.3. Đồng bộ thất bại

Hệ thống:

Ghi lỗi.
Giữ lại dữ liệu hiện tại.
Đánh dấu FAILED.
Cho phép retry theo chính sách.
15.4. Sinh viên thay đổi trạng thái học tập

Ví dụ:

ACTIVE
   ↓
TỐT NGHIỆP

hoặc:

ACTIVE
   ↓
THÔI HỌC

Hệ thống kiểm tra quy tắc tương ứng.

Không được xóa hồ sơ.

16. Luồng 13 — Xử lý sinh viên bảo lưu / đình chỉ
16.1. Nhận dữ liệu

SIS gửi trạng thái:

BẢO LƯU
hoặc
ĐÌNH CHỈ
16.2. Hệ thống đánh giá

Hệ thống kiểm tra:

Hồ sơ ngoại trú hiện tại.
Chính sách áp dụng.
Có cần cán bộ xem xét hay không.
16.3. Cần xem xét

Nếu cần:

ACTIVE
   ↓
REVIEW_REQUIRED

hoặc tạo task cho cán bộ
theo thiết kế cuối cùng.

Hồ sơ không tự động bị xóa.

17. Luồng 14 — Tốt nghiệp / Thôi học
17.1. Nhận thông tin từ SIS

SIS cập nhật:

TỐT NGHIỆP
hoặc
THÔI HỌC
17.2. Xử lý

Hệ thống áp dụng chính sách:

ACTIVE
   ↓
TERMINATED

nếu quy định cho phép tự động kết thúc.

Hoặc:

ACTIVE
   ↓
REVIEW_REQUIRED

nếu cần cán bộ xác nhận.

18. Luồng 15 — Thông báo
18.1. Các sự kiện tạo thông báo

Hệ thống tạo notification khi:

Hồ sơ được gửi
Hồ sơ được tiếp nhận
Hồ sơ cần bổ sung
Hồ sơ được duyệt
Hồ sơ bị từ chối
Yêu cầu được tạo
Yêu cầu được duyệt
Yêu cầu bị từ chối
Hồ sơ sắp hết hạn
Hồ sơ hết hạn
Hồ sơ quá SLA
Hồ sơ được escalation
18.2. Luồng thông báo
Business Event
      ↓
Notification Service
      ↓
Xác định người nhận
      ↓
Xác định kênh
      ↓
Gửi thông báo
      ↓
Lưu Notification Log
19. Luồng 16 — Quản lý lịch sử
19.1. Lịch sử hồ sơ

Hệ thống phải lưu:

Trạng thái.
Người thay đổi.
Thời điểm.
Lý do.
Dữ liệu liên quan.
19.2. Lịch sử nơi ở

Ví dụ:

2026-01 → Nhà trọ A
2026-08 → Nhà trọ B
2027-08 → Nhà trọ C

Không xóa dữ liệu nơi ở cũ.

19.3. Lịch sử giấy tờ

Ví dụ:

Giấy xác nhận
 ├── Version 1
 ├── Version 2
 └── Version 3
19.4. Lịch sử REQUEST

Ví dụ:

RENEWAL-001
→ APPROVED

CHANGE_ADDRESS-001
→ REJECTED

RENEWAL-002
→ APPROVED
20. Luồng 17 — Báo cáo thống kê
20.1. Cán bộ truy cập báo cáo
Cán bộ
 ↓
Báo cáo
 ↓
Chọn tiêu chí
20.2. Tiêu chí

Có thể thống kê:

Theo khoa.
Theo lớp.
Theo khóa.
Theo khu vực.
Theo tỉnh/thành phố.
Theo quận/huyện.
Theo phường/xã.
Theo trạng thái.
Theo loại REQUEST.
Theo khoảng thời gian.
Theo SLA.
20.3. Kết quả

Hệ thống:

Truy vấn dữ liệu
      ↓
Áp dụng Data Scope
      ↓
Tổng hợp
      ↓
Hiển thị báo cáo
21. Luồng 18 — Quản lý phân quyền
21.1. Administrator tạo tài khoản
ADMIN
 ↓
Tạo USER
 ↓
Gán ROLE
 ↓
Gán PERMISSION
 ↓
Gán DATA_SCOPE
21.2. Khi cán bộ thao tác

Hệ thống kiểm tra:

USER
 ↓
ROLE
 ↓
PERMISSION
 ↓
DATA_SCOPE
 ↓
Cho phép / từ chối
21.3. Không có quyền

Nếu không có permission:

ACCESS DENIED

Hệ thống ghi nhận sự kiện
nếu chính sách Audit yêu cầu.

22. Luồng 19 — Quản lý cấu hình nghiệp vụ
22.1. Administrator truy cập cấu hình

Có thể quản lý:

RENEWAL_PERIOD_MONTHS
MAX_ADDITION_ATTEMPTS
SLA_PROCESSING_DAYS
EXPIRY_NOTIFICATION_DAYS
ESCALATION_THRESHOLD
DEADLINE
22.2. Thay đổi cấu hình
Giá trị cũ
   ↓
Admin nhập giá trị mới
   ↓
Kiểm tra quyền
   ↓
Lưu cấu hình mới
   ↓
Ghi Audit
22.3. Cấu hình theo thời gian

Cấu hình phải có:

effective_from
effective_to

nếu nghiệp vụ yêu cầu.

Điều này cho phép hệ thống
giữ lịch sử các quy định theo từng
năm học.

23. Luồng tổng hợp vòng đời REGISTRATION
                    ┌──────────────┐
                    │    DRAFT     │
                    └──────┬───────┘
                           │
                     Submit hồ sơ
                           │
                           ▼
                    ┌──────────────┐
                    │  SUBMITTED   │
                    └──────┬───────┘
                           │
                     Tiếp nhận
                           │
                           ▼
                  ┌────────────────┐
                  │ UNDER_REVIEW   │
                  └───────┬────────┘
                          / \
                         /   \
                        /     \
                       ▼       ▼
             NEED_MORE_INFO   REJECTED
                  │
             Bổ sung
                  │
                  ▼
              SUBMITTED
                  │
                  ▼
             UNDER_REVIEW
                  │
                  ▼
              APPROVED
                  │
                  ▼
               ACTIVE
              /   |   \
             /    |    \
            ▼     ▼     ▼
       RENEWAL  CHANGE  TERMINATION
                  |          |
                  |          ▼
                  |      TERMINATED
                  |
                  ▼
             ADDRESS HISTORY

               ACTIVE
                  │
             Hết hạn
                  │
                  ▼
              EXPIRED
24. Luồng tổng hợp REQUEST
                 REGISTRATION
                      │
                      ▼
                  REQUEST
                      │
                      ▼
                   PENDING
                      │
                      ▼
                UNDER_REVIEW
                  /        \
                 /          \
                ▼            ▼
        NEED_MORE_INFO    REJECTED
             │
             │ Bổ sung
             ▼
        UNDER_REVIEW
             │
             ▼
          APPROVED

REQUEST có thể có loại:

RENEWAL
CHANGE_ADDRESS
TERMINATION
25. Quy tắc đồng thời REQUEST

Tại một thời điểm:

REGISTRATION
     │
     ├── REQUEST 1 = PENDING
     │
     ├── REQUEST 2 = không được mở
     │
     └── REQUEST 3 = không được mở

Ví dụ:

Sinh viên đang có:

RENEWAL = PENDING

thì không được tạo:

CHANGE_ADDRESS = PENDING

cho cùng REGISTRATION.

REQUEST mới chỉ được tạo
sau khi REQUEST hiện tại kết thúc.

26. Luồng khi REQUEST bị từ chối

REQUEST bị từ chối
không làm mất hồ sơ ACTIVE.

Ví dụ:

ACTIVE
   │
   ▼
CHANGE_ADDRESS REQUEST
   │
   ▼
REJECTED
   │
   ▼
ACTIVE

Hồ sơ tiếp tục sử dụng
nơi ở cũ.

27. Luồng khi REQUEST được duyệt

Mỗi loại REQUEST gây ra
một thay đổi nghiệp vụ khác nhau.

RENEWAL
APPROVED
   ↓
Cập nhật expiry_date
CHANGE_ADDRESS
APPROVED
   ↓
Địa chỉ mới → CURRENT
Địa chỉ cũ → HISTORY
TERMINATION
APPROVED
   ↓
ACTIVE → TERMINATED
28. Luồng lỗi và ngoại lệ
28.1. Database không khả dụng
Người dùng
   ↓
Thao tác
   ↓
Database Error

Hệ thống:

Không xác nhận giao dịch thành công.
Thông báo lỗi.
Không tạo dữ liệu không hoàn chỉnh.
28.2. Upload tài liệu thất bại

Nếu upload thất bại:

Không tạo Document Version mới

Người dùng được phép thử lại.

28.3. Đồng bộ SIS thất bại
SYNC FAILED

Hệ thống:

Ghi log.
Không xóa dữ liệu hiện tại.
Thực hiện retry theo chính sách.
28.4. Hai người cùng xử lý một REQUEST

Hệ thống phải có cơ chế
ngăn việc xử lý đồng thời gây
mâu thuẫn dữ liệu.

Ví dụ:

REQUEST = UNDER_REVIEW

Một cán bộ đã xử lý,
cán bộ khác không được ghi đè
kết quả đã hoàn tất.

29. Luồng giao dịch quan trọng

Các thao tác thay đổi dữ liệu quan trọng
phải được thực hiện theo nguyên tắc:

Validate
   ↓
Authorize
   ↓
Process
   ↓
Update Database
   ↓
Write Audit
   ↓
Create Notification

Nếu thao tác thất bại,
hệ thống không được để dữ liệu
ở trạng thái trung gian không hợp lệ.

30. Nguyên tắc nhất quán giữa các luồng

Các Business Flow phải tuân thủ:

REGISTRATION và REQUEST là hai khái niệm riêng.
REQUEST không thay thế trạng thái
của REGISTRATION.
Một REGISTRATION chỉ có tối đa
một REQUEST đang mở.
Nơi ở mới chỉ có hiệu lực
sau khi CHANGE_ADDRESS được duyệt.
Hồ sơ ACTIVE hết hạn phải chuyển EXPIRED.
Gia hạn không cập nhật trực tiếp
từ giao diện sinh viên.
Chuyển nơi ở không xóa địa chỉ cũ.
Thay thế giấy tờ không xóa phiên bản cũ.
Phê duyệt chỉ được thực hiện bởi
người có quyền.
Mọi thay đổi nghiệp vụ quan trọng
phải có lịch sử.
Dữ liệu sinh viên lấy từ SIS
không được tùy ý sửa tại hệ thống ngoại trú.
SLA và escalation được quản lý độc lập
với kết quả nghiệp vụ.
Nộp trễ được biểu diễn bằng is_late,
không tạo trạng thái LATE.
Administrator quản lý cấu hình và quyền,
nhưng không mặc nhiên có quyền phê duyệt.
Các ngoại lệ phải có kết quả xác định,
không để hồ sơ treo vô thời hạn.
31. Kết quả đầu ra của Business Flow

Sau khi hoàn thành Business Flow,
hệ thống phải xác định được:

Ai thực hiện nghiệp vụ.
Nghiệp vụ bắt đầu khi nào.
Điều kiện bắt đầu.
Các bước xử lý.
Điều kiện rẽ nhánh.
Kết quả của từng nhánh.
Trạng thái dữ liệu sau nghiệp vụ.
Dữ liệu được tạo/cập nhật.
Thông báo được phát sinh.
Audit Log được ghi nhận.
SLA được tính như thế nào.
Trường hợp lỗi được xử lý ra sao.

Business Flow này là cơ sở trực tiếp
để xây dựng:

Functional Requirements
        ↓
Use Case
        ↓
Activity Diagram
        ↓
Sequence Diagram
        ↓
State Machine
        ↓
DFD
        ↓
Database Design
        ↓
Web System Design