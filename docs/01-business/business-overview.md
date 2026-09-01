# BUSINESS OVERVIEW
# HỆ THỐNG QUẢN LÝ SINH VIÊN NGOẠI TRÚ

---

## 1. Thông tin tài liệu

| Thuộc tính | Nội dung |
|---|---|
| Tên hệ thống | Hệ thống Quản lý Sinh viên Ngoại trú |
| Mã tài liệu | BO-001 |
| Phiên bản | 1.1 |
| Loại tài liệu | Phân tích nghiệp vụ |
| Phạm vi | Quản lý sinh viên ngoại trú |
| Trạng thái | Draft |

---

# 2. Tổng quan bài toán

Hiện nay việc quản lý sinh viên ngoại trú tại trường có thể được thực hiện
thông qua các hình thức giấy tờ, biểu mẫu hoặc nhiều nguồn dữ liệu khác nhau.

Sinh viên khi có nhu cầu ở ngoài trường phải khai báo thông tin cá nhân,
thông tin nơi ở, chủ trọ và các giấy tờ liên quan.

Sau khi gửi hồ sơ, cán bộ có trách nhiệm tiếp nhận, kiểm tra thông tin,
kiểm tra giấy tờ và đưa ra quyết định xử lý.

Trong quá trình sinh viên đang ngoại trú, có thể phát sinh nhiều nghiệp vụ
như:

- Gia hạn thời gian ngoại trú.
- Chuyển nơi ở.
- Kết thúc ngoại trú.
- Bổ sung hoặc thay thế giấy tờ.
- Kiểm tra lại thông tin trong những trường hợp đặc biệt.
- Xử lý hồ sơ hết hạn.
- Theo dõi lịch sử thay đổi của hồ sơ.

Hệ thống được xây dựng nhằm số hóa toàn bộ quy trình trên,
giúp sinh viên thực hiện khai báo và theo dõi hồ sơ,
đồng thời giúp cán bộ tiếp nhận, kiểm tra, phê duyệt,
quản lý và thống kê dữ liệu ngoại trú một cách tập trung.

---

# 3. Mục tiêu hệ thống

Hệ thống hướng đến các mục tiêu chính:

1. Quản lý tập trung thông tin sinh viên ngoại trú.
2. Số hóa quy trình đăng ký ngoại trú.
3. Giảm việc sử dụng hồ sơ giấy trong quá trình xử lý.
4. Cho phép sinh viên theo dõi trạng thái hồ sơ.
5. Cho phép cán bộ kiểm tra và xử lý hồ sơ theo quy trình thống nhất.
6. Quản lý giấy tờ và lịch sử phiên bản của giấy tờ.
7. Quản lý các yêu cầu phát sinh sau khi hồ sơ đã được duyệt.
8. Tự động xử lý các trường hợp liên quan đến thời hạn.
9. Ghi nhận lịch sử xử lý nhằm đảm bảo khả năng truy vết.
10. Hỗ trợ thống kê và báo cáo tình hình sinh viên ngoại trú.

---

# 4. Phạm vi hệ thống

## 4.1. Trong phạm vi

Hệ thống quản lý:

- Thông tin sinh viên ngoại trú.
- Hồ sơ đăng ký ngoại trú.
- Thông tin nơi ở.
- Thông tin chủ trọ.
- Giấy tờ đính kèm.
- Kiểm tra và phê duyệt hồ sơ.
- Yêu cầu gia hạn.
- Yêu cầu chuyển nơi ở.
- Yêu cầu kết thúc ngoại trú.
- Yêu cầu bổ sung thông tin.
- Lịch sử xử lý hồ sơ.
- Lịch sử thay đổi nơi ở.
- Lịch sử phiên bản giấy tờ.
- Thông báo.
- SLA xử lý hồ sơ.
- Theo dõi hồ sơ quá hạn.
- Escalation khi cán bộ xử lý quá SLA.
- Thống kê và báo cáo.
- Đồng bộ thông tin sinh viên từ SIS.
- Quản lý cấu hình nghiệp vụ.

## 4.2. Ngoài phạm vi

Hệ thống KHÔNG quản lý:

- Sinh viên đang ở ký túc xá.
- Quản lý phòng ký túc xá.
- Phân phòng ký túc xá.
- Thu tiền ký túc xá.
- Quản lý hợp đồng thuê nhà.
- Thu tiền thuê nhà.
- Quản lý tài chính của chủ trọ.
- Quản lý tài khoản chủ trọ.

Hệ thống chỉ tập trung vào việc quản lý
sinh viên đang hoặc có nhu cầu đăng ký ngoại trú.

---

# 5. Các bên tham gia hệ thống

Hệ thống có các Actor chính:

1. Sinh viên.
2. Cán bộ tiếp nhận.
3. Cán bộ xử lý.
4. Cán bộ phê duyệt.
5. Cán bộ phê duyệt cấp cao (Escalation Approver).
6. Administrator.
7. SIS.

Bốn vai trò Cán bộ tiếp nhận, Cán bộ xử lý, Cán bộ phê duyệt
và Cán bộ phê duyệt cấp cao là các vai trò nghiệp vụ độc lập
về mặt phân quyền.

Một nhân sự thực tế có thể được cấp một hoặc nhiều vai trò
tùy theo cơ cấu tổ chức và quyền hạn của nhà trường.

---

## 5.1. Sinh viên

Sinh viên là đối tượng chính của hệ thống.

Sinh viên có thể:

- Xem thông tin cá nhân được đồng bộ từ SIS.
- Tạo hồ sơ ngoại trú.
- Khai báo nơi ở.
- Khai báo thông tin chủ trọ.
- Đính kèm giấy tờ.
- Gửi hồ sơ.
- Theo dõi trạng thái hồ sơ.
- Nhận yêu cầu bổ sung.
- Bổ sung thông tin hoặc giấy tờ.
- Rút/hủy hồ sơ trong trường hợp được phép.
- Gửi yêu cầu gia hạn.
- Gửi yêu cầu chuyển nơi ở.
- Gửi yêu cầu kết thúc ngoại trú.
- Nhận thông báo.
- Xem lịch sử xử lý hồ sơ.

Sinh viên không có quyền:

- Phê duyệt hồ sơ của chính mình.
- Thay đổi kết quả xử lý của cán bộ.
- Thay đổi dữ liệu chính thức lấy từ SIS.
- Tự thay đổi trạng thái ACTIVE/EXPIRED/TERMINATED.
- Xóa lịch sử xử lý.

---

## 5.2. Cán bộ tiếp nhận

Cán bộ tiếp nhận chịu trách nhiệm tiếp nhận
và kiểm tra sơ bộ hồ sơ.

Các chức năng:

- Xem danh sách hồ sơ thuộc phạm vi được phân quyền.
- Tiếp nhận hồ sơ đã được sinh viên gửi.
- Kiểm tra hồ sơ có đầy đủ thành phần hay không.
- Kiểm tra thông tin cơ bản.
- Kiểm tra sự tồn tại của các giấy tờ bắt buộc.
- Ghi nhận tình trạng tiếp nhận.
- Chuyển hồ sơ sang bước xử lý.
- Trả hồ sơ về trạng thái cần bổ sung
  trong phạm vi quyền được cấp.

Cán bộ tiếp nhận không mặc nhiên có quyền
phê duyệt hồ sơ cuối cùng.

---

## 5.3. Cán bộ xử lý

Cán bộ xử lý chịu trách nhiệm kiểm tra nghiệp vụ
và đánh giá tính hợp lệ của hồ sơ.

Các chức năng:

- Kiểm tra thông tin sinh viên.
- Kiểm tra thông tin nơi ở.
- Kiểm tra thông tin chủ trọ.
- Kiểm tra giấy tờ đính kèm.
- Kiểm tra điều kiện đăng ký ngoại trú.
- Yêu cầu sinh viên bổ sung thông tin.
- Yêu cầu bổ sung hoặc thay thế giấy tờ.
- Ghi nhận kết quả kiểm tra.
- Đề xuất kết quả xử lý.
- Chuyển hồ sơ đến cán bộ phê duyệt.
- Theo dõi các hồ sơ đang xử lý.
- Xử lý các REQUEST thuộc phạm vi được phân quyền.

Cán bộ xử lý không mặc nhiên có quyền
phê duyệt cuối cùng nếu không được cấp quyền.

---

## 5.4. Cán bộ phê duyệt

Cán bộ phê duyệt là người có thẩm quyền
đưa ra quyết định cuối cùng đối với hồ sơ
hoặc yêu cầu thuộc phạm vi được phân quyền.

Các chức năng:

- Xem hồ sơ đã được kiểm tra.
- Xem kết quả kiểm tra của cán bộ xử lý.
- Xem các giấy tờ liên quan.
- Xem lịch sử xử lý.
- Phê duyệt hồ sơ.
- Từ chối hồ sơ.
- Phê duyệt yêu cầu gia hạn.
- Từ chối yêu cầu gia hạn.
- Phê duyệt yêu cầu chuyển nơi ở.
- Từ chối yêu cầu chuyển nơi ở.
- Phê duyệt yêu cầu kết thúc ngoại trú.
- Từ chối yêu cầu kết thúc ngoại trú.
- Ghi nhận lý do đối với các quyết định cần giải thích.

Mọi quyết định phê duyệt hoặc từ chối
phải được lưu vào lịch sử xử lý và Audit Log.

---

## 5.5. Cán bộ phê duyệt cấp cao (Escalation Approver)

Cán bộ phê duyệt cấp cao là vai trò tiếp nhận các hồ sơ
hoặc REQUEST đã vượt quá SLA xử lý thông thường
và được hệ thống tự động escalate theo mục 21.

Các chức năng:

- Xem danh sách hồ sơ/REQUEST đang trong trạng thái OVERDUE.
- Xem toàn bộ lịch sử xử lý và lý do chậm trễ (nếu có).
- Thực hiện phê duyệt/từ chối thay cho cán bộ phê duyệt
  đối với các hồ sơ đã escalate.
- Chỉ đạo hoặc phân công lại cán bộ xử lý/phê duyệt phụ trách.
- Xem báo cáo về tình trạng quá SLA theo đơn vị/khoa.

Vai trò này thường gắn với cấp quản lý cao hơn
trong đơn vị phụ trách công tác sinh viên
(ví dụ: trưởng phòng/tổ trưởng), và độc lập về mặt
phân quyền với Cán bộ phê duyệt thông thường.

Việc escalate không tự động tước quyền xử lý
của cán bộ phê duyệt ban đầu, trừ khi được
cấu hình khác trong quy tắc nghiệp vụ.

---

## 5.6. Administrator

Administrator chịu trách nhiệm quản trị hệ thống
và phân quyền người dùng.

Administrator có thể:

- Quản lý tài khoản.
- Khóa/mở khóa tài khoản.
- Gán vai trò cho người dùng.
- Thu hồi vai trò.
- Phân quyền theo đơn vị.
- Phân quyền theo khoa hoặc phạm vi dữ liệu.
- Cấu hình thời hạn ngoại trú.
- Cấu hình thời hạn xử lý hồ sơ.
- Cấu hình số lần bổ sung tối đa.
- Cấu hình thời gian ân hạn nếu có.
- Cấu hình quy tắc và ngưỡng escalation (thời gian, cấp tiếp nhận).
- Quản lý danh mục dùng chung.
- Quản lý cấu hình thông báo.
- Theo dõi Audit Log.
- Quản lý các cấu hình nghiệp vụ.

Administrator không mặc nhiên có quyền
phê duyệt hồ sơ nghiệp vụ.

Nếu Administrator cần thực hiện nghiệp vụ phê duyệt,
phải được cấp thêm vai trò Cán bộ phê duyệt
hoặc Cán bộ phê duyệt cấp cao.

---

## 5.7. SIS

SIS là hệ thống quản lý thông tin đào tạo
của nhà trường.

SIS là nguồn dữ liệu chính đối với thông tin sinh viên.

SIS cung cấp:

- Mã sinh viên.
- Họ tên.
- Ngày sinh.
- Lớp.
- Khoa.
- Chương trình đào tạo.
- Khóa học.
- Trạng thái học tập.

Hệ thống quản lý ngoại trú chỉ sử dụng
các thông tin do SIS cung cấp và không tự ý
thay đổi dữ liệu nguồn của SIS.

---

# 6. Khái niệm Hồ sơ và Yêu cầu

Một nguyên tắc quan trọng của hệ thống:

> HỒ SƠ (REGISTRATION) và YÊU CẦU (REQUEST) là hai thực thể nghiệp vụ độc lập.

## 6.1. Hồ sơ ngoại trú

REGISTRATION đại diện cho một hồ sơ đăng ký ngoại trú.

Hồ sơ có vòng đời riêng.

Ví dụ:

```text
DRAFT
   ↓
SUBMITTED
   ↓
UNDER_REVIEW
   ↓
ACTIVE
```

hoặc:

```text
UNDER_REVIEW
   ↓
NEED_MORE_INFO
   ↓
SUBMITTED
   ↓
UNDER_REVIEW
```

Ngoài ra hồ sơ có thể kết thúc bằng:

- REJECTED
- CANCELLED
- WITHDRAWN
- EXPIRED
- TERMINATED

## 6.2. Yêu cầu phát sinh

REQUEST đại diện cho một nghiệp vụ phát sinh
trên một hồ sơ ngoại trú đã tồn tại.

Các loại yêu cầu chính:

- RENEWAL: Gia hạn.
- CHANGE_ADDRESS: Chuyển nơi ở.
- TERMINATION: Kết thúc ngoại trú.

Trong trường hợp nghiệp vụ cần xử lý gia hạn muộn,
có thể sử dụng loại yêu cầu phù hợp theo quy định hệ thống.

REQUEST có vòng đời độc lập với REGISTRATION.

Ví dụ:

```text
ACTIVE REGISTRATION
       ↓
CREATE REQUEST
       ↓
PENDING
       ↓
UNDER_REVIEW
       ↓
APPROVED / REJECTED
```

---

# 7. Quy tắc đồng thời REQUEST

Một hồ sơ ngoại trú tại một thời điểm
chỉ được phép có tối đa một REQUEST đang mở.

Các REQUEST được xem là đang mở khi ở trạng thái:

- PENDING
- UNDER_REVIEW
- NEED_MORE_INFO

Ví dụ:

Nếu sinh viên đã có REQUEST #001 (CHANGE_ADDRESS, PENDING)
thì không được đồng thời tạo REQUEST #002 (RENEWAL, PENDING)
cho cùng một REGISTRATION.

Sau khi REQUEST #001 được APPROVED, REJECTED, hoặc CANCELLED,
thì hồ sơ mới có thể tạo REQUEST tiếp theo
nếu vẫn đáp ứng điều kiện nghiệp vụ.

---

# 8. Quy trình đăng ký ngoại trú

Quy trình tổng quát:

```text
Sinh viên
    ↓
Đăng nhập
    ↓
Tạo hồ sơ ngoại trú
    ↓
Khai báo nơi ở
    ↓
Khai báo chủ trọ
    ↓
Đính kèm giấy tờ
    ↓
Kiểm tra thông tin
    ↓
Gửi hồ sơ
    ↓
Hệ thống kiểm tra điều kiện
    ↓
Cán bộ tiếp nhận
    ↓
Kiểm tra hồ sơ
    ↓
┌───────────────────────────────┐
│                               │
↓                               ↓
Hợp lệ                       Không hợp lệ
↓                               ↓
Duyệt                     Yêu cầu bổ sung
↓                               ↓
ACTIVE                    NEED_MORE_INFO
                                ↓
                         Sinh viên bổ sung
                                ↓
                           Kiểm tra lại
```

Nếu hồ sơ không đáp ứng điều kiện sau quá trình kiểm tra:

```text
UNDER_REVIEW
      ↓
REJECTED
```

---

# 9. Quy trình bổ sung hồ sơ

Khi hồ sơ chưa đầy đủ hoặc thông tin chưa hợp lệ,
cán bộ có thể yêu cầu sinh viên bổ sung.

```text
UNDER_REVIEW
      ↓
NEED_MORE_INFO
      ↓
Thông báo sinh viên
      ↓
Sinh viên bổ sung
      ↓
SUBMITTED
      ↓
UNDER_REVIEW
```

Mỗi lần yêu cầu bổ sung phải ghi nhận:

- Nội dung cần bổ sung.
- Người yêu cầu.
- Thời điểm yêu cầu.
- Thời hạn bổ sung.
- Nội dung sinh viên đã bổ sung.
- Phiên bản giấy tờ mới nếu có.

Hệ thống phải giới hạn số lần bổ sung
theo cấu hình nghiệp vụ.

Khi vượt quá số lần bổ sung cho phép,
hệ thống xử lý theo quy tắc đã cấu hình
và phải phân biệt rõ lý do tự động với
quyết định từ chối thủ công của cán bộ.

---

# 10. Quy trình phê duyệt

Cán bộ kiểm tra:

- Thông tin sinh viên.
- Thông tin nơi ở.
- Thông tin chủ trọ.
- Giấy tờ.
- Tính đầy đủ của hồ sơ.
- Tính hợp lệ của dữ liệu.

Nếu hợp lệ:

```text
UNDER_REVIEW
      ↓
APPROVED
      ↓
ACTIVE
```

Khi ACTIVE, hồ sơ trở thành hồ sơ ngoại trú
đang có hiệu lực.

Nếu không hợp lệ:

```text
UNDER_REVIEW
      ↓
REJECTED
```

Mọi quyết định phải lưu:

- Người xử lý.
- Thời gian.
- Kết quả.
- Lý do.
- Nội dung xử lý.

---

# 11. Chủ trọ

Chủ trọ không phải là người dùng trực tiếp của hệ thống.

Chủ trọ không cần đăng nhập để xác nhận hồ sơ.

Việc xác nhận của chủ trọ được thể hiện thông qua
giấy xác nhận hoặc thông tin xác nhận hợp lệ
do sinh viên cung cấp.

Cán bộ có trách nhiệm kiểm tra thông tin này
theo quy trình nghiệp vụ của nhà trường.

Thông tin chủ trọ được quản lý thành dữ liệu riêng
để tránh việc nhiều sinh viên cùng một chủ trọ
phải nhập lại thông tin hoàn toàn độc lập.

---

# 12. Quản lý nơi ở

Nơi ở là thông tin quan trọng của hồ sơ ngoại trú.

Một hồ sơ có thể có nhiều nơi ở trong lịch sử,
nhưng chỉ có một nơi ở CURRENT tại một thời điểm.

## 12.1. Khi đăng ký lần đầu

Sinh viên khai báo:

- Địa chỉ.
- Tỉnh/thành phố.
- Quận/huyện.
- Phường/xã.
- Số nhà/đường.
- Thông tin nhà/phòng nếu cần.
- Chủ trọ.
- Giấy tờ liên quan.

Sau khi hồ sơ được duyệt,
nơi ở được xác định là nơi ở hiện tại.

---

# 13. Quy trình chuyển nơi ở

Sinh viên có thể chuyển sang nơi ở mới
trong thời gian hồ sơ đang ACTIVE.

Sinh viên tạo: CHANGE_ADDRESS REQUEST

Quy trình:

```text
ACTIVE
   ↓
Tạo yêu cầu chuyển nơi ở
   ↓
Khai báo nơi ở mới
   ↓
Đính kèm giấy tờ
   ↓
PENDING
   ↓
Cán bộ kiểm tra
```

Trong thời gian chờ xử lý:

- Nơi ở cũ = CURRENT
- Nơi ở mới = PENDING

Không được thay đổi nơi ở hiện tại
chỉ vì sinh viên vừa gửi yêu cầu.

Nếu được duyệt:

- Nơi ở cũ: CURRENT → HISTORICAL
- Nơi ở mới: PENDING → CURRENT

Nếu bị từ chối:

- Nơi ở cũ = CURRENT
- Nơi ở mới = REJECTED

---

# 14. Quy trình gia hạn

Thời hạn ngoại trú được quản lý bằng cấu hình hệ thống.

Thời hạn mặc định hiện tại: 12 tháng

Sinh viên không tự lựa chọn (3 tháng / 6 tháng / 12 tháng)
mà hệ thống tự xác định thời hạn
theo cấu hình hiện hành.

Khi gần hết hạn:

```text
ACTIVE
   ↓
Hệ thống gửi thông báo
   ↓
Sinh viên tạo RENEWAL REQUEST
   ↓
Cán bộ kiểm tra
   ↓
Duyệt
   ↓
Cập nhật expiry_date
```

Khi yêu cầu gia hạn được duyệt,
thời hạn mới được hệ thống tự động cập nhật
theo cấu hình.

---

# 15. Hồ sơ hết hạn

Nếu `current_date > expiry_date`
và sinh viên không gia hạn hợp lệ,
hệ thống tự động chuyển:

```text
ACTIVE
   ↓
EXPIRED
```

Việc chuyển trạng thái tự động phải được ghi nhận
trong lịch sử hệ thống.

Hệ thống sử dụng cơ chế job/scheduler
để kiểm tra các hồ sơ sắp hết hạn và đã hết hạn.

---

# 16. Hồ sơ EXPIRED

Hồ sơ EXPIRED không được xem là hồ sơ
ngoại trú đang có hiệu lực.

Việc có cho phép gia hạn muộn hay không
được quyết định bằng quy định nghiệp vụ
và cấu hình hệ thống.

Nếu chính sách không cho phép khôi phục hồ sơ cũ:

```text
EXPIRED
    ↓
Đăng ký hồ sơ mới
```

Nếu chính sách cho phép gia hạn muộn:

```text
EXPIRED
    ↓
LATE RENEWAL REQUEST
    ↓
Cán bộ xử lý
    ↓
ACTIVE
```

Quy tắc này phải được cấu hình rõ ràng
trước khi triển khai chính thức.

---

# 17. Kết thúc ngoại trú

Sinh viên có thể không còn nhu cầu ngoại trú.

Trong trường hợp đó sinh viên tạo: TERMINATION REQUEST

Quy trình:

```text
ACTIVE
   ↓
TERMINATION REQUEST
   ↓
Cán bộ kiểm tra
   ↓
APPROVED
   ↓
TERMINATED
```

Sau khi TERMINATED:

- Hồ sơ không còn hiệu lực.
- Nơi ở hiện tại kết thúc hiệu lực.
- Lịch sử hồ sơ vẫn được giữ lại.

---

# 18. Sinh viên rút hoặc hủy hồ sơ

Đối với hồ sơ chưa được duyệt,
sinh viên có thể thực hiện rút/hủy
nếu hồ sơ đang ở trạng thái cho phép.

Ví dụ:

```text
DRAFT → CANCELLED
```

hoặc:

```text
SUBMITTED → WITHDRAWN
```

Việc rút/hủy phải ghi nhận:

- Người thực hiện.
- Thời điểm.
- Lý do.
- Trạng thái trước.
- Trạng thái sau.

Sinh viên không được tự ý hủy hồ sơ đã ACTIVE.

Hồ sơ ACTIVE phải sử dụng nghiệp vụ
TERMINATION nếu muốn kết thúc ngoại trú.

---

# 19. Quản lý giấy tờ

Mỗi giấy tờ phải được quản lý theo phiên bản.

```text
DOCUMENT
   │
   ├── VERSION 1
   ├── VERSION 2
   └── VERSION 3
```

Khi sinh viên thay thế giấy tờ:

- File cũ không bị xóa.
- File cũ được giữ lại trong lịch sử.
- File mới trở thành phiên bản hiện hành.
- Phải ghi nhận thời điểm thay đổi.
- Phải ghi nhận người thực hiện.
- Phải ghi nhận lý do thay đổi nếu cần.

Điều này đảm bảo hệ thống có khả năng truy vết.

---

# 20. Deadline và hồ sơ nộp trễ

Hệ thống có thể cấu hình deadline
nộp hồ sơ theo học kỳ hoặc năm học.

Nếu sinh viên gửi hồ sơ sau deadline: `is_late = TRUE`

Hồ sơ vẫn có thể được tiếp nhận và xử lý bình thường.

Nộp trễ không phải là một trạng thái
riêng trong vòng đời hồ sơ.

---

# 21. SLA xử lý hồ sơ

Hệ thống phải quản lý thời gian xử lý hồ sơ.

```text
SUBMITTED
   ↓
Bắt đầu SLA
   ↓
Cán bộ xử lý
   ↓
ACTIVE / NEED_MORE_INFO / REJECTED
```

Nếu thời gian xử lý vượt quá SLA: `OVERDUE = TRUE`

Hệ thống thông báo cho cán bộ phụ trách (Cán bộ xử lý
hoặc Cán bộ phê duyệt đang nắm hồ sơ/REQUEST đó).

Nếu tiếp tục vượt quá thời gian quy định,
hệ thống thực hiện escalation đến **Cán bộ phê duyệt cấp cao**
(xem mục 5.5), theo ngưỡng thời gian được Administrator cấu hình.

Việc escalation phải được ghi nhận vào lịch sử xử lý,
bao gồm: thời điểm escalate, hồ sơ/REQUEST liên quan,
người phụ trách trước đó, và người/vai trò tiếp nhận sau escalate.

---

# 22. Phân quyền cán bộ

Cán bộ không được xem tất cả dữ liệu một cách mặc định.

Quyền được phân theo:

- Vai trò.
- Đơn vị.
- Khoa.
- Phạm vi dữ liệu.
- Chức năng.

Ví dụ:

```text
Cán bộ tiếp nhận       → Tiếp nhận + kiểm tra sơ bộ
Cán bộ xử lý           → Kiểm tra + yêu cầu bổ sung
Cán bộ phê duyệt       → Phê duyệt / từ chối
Cán bộ phê duyệt cấp cao → Xử lý hồ sơ/REQUEST đã escalate do quá SLA
Administrator          → Quản trị hệ thống
```

Quyền phê duyệt phải được kiểm soát bằng phân quyền.

---

# 23. Trạng thái học tập của sinh viên

Thông tin trạng thái học tập được lấy từ SIS.

Các trạng thái có thể bao gồm:

- Đang học.
- Bảo lưu.
- Đình chỉ.
- Tốt nghiệp.
- Thôi học.

Khi trạng thái sinh viên thay đổi,
hệ thống phải xác định tác động đến hồ sơ ngoại trú.

Ví dụ:

```text
ACTIVE
   +
Student = GRADUATED
   ↓
Hệ thống tạo task kiểm tra
```

Đối với các trường hợp đặc biệt như bảo lưu hoặc đình chỉ,
hệ thống không tự ý thay đổi trạng thái hồ sơ
nếu chưa có quy tắc nghiệp vụ tương ứng.

Các trường hợp cần cán bộ xem xét được tạo thành task/review.

---

# 24. Đồng bộ SIS

SIS là nguồn dữ liệu chính về sinh viên.

Hệ thống ngoại trú đồng bộ dữ liệu từ SIS
theo cơ chế được cấu hình.

Phiên bản nghiệp vụ hiện tại sử dụng: Batch synchronization
theo chu kỳ định kỳ.

Khi dữ liệu SIS thay đổi,
hệ thống ngoại trú cập nhật dữ liệu tương ứng
và ghi nhận thời điểm đồng bộ.

---

# 25. Thông báo

Hệ thống gửi thông báo cho sinh viên
khi xảy ra các sự kiện quan trọng:

- Hồ sơ được tiếp nhận.
- Hồ sơ được yêu cầu bổ sung.
- Hồ sơ được duyệt.
- Hồ sơ bị từ chối.
- Yêu cầu được duyệt.
- Yêu cầu bị từ chối.
- Hồ sơ sắp hết hạn.
- Hồ sơ đã hết hạn.
- Hồ sơ cần xử lý bổ sung.

Thông báo phải được lưu lại
để người dùng có thể tra cứu lịch sử.

---

# 26. Lịch sử và Audit Log

Mọi nghiệp vụ quan trọng phải có khả năng truy vết.

Hệ thống lưu:

- Người thực hiện.
- Thời điểm.
- Hành động.
- Đối tượng bị thay đổi.
- Giá trị trước.
- Giá trị sau.
- Lý do.
- Nguồn thao tác.

Ví dụ:

```text
USER: CB001
ACTION: APPROVE_REGISTRATION
TIME: 2026-08-30 10:30
REGISTRATION: REG001
OLD STATUS: UNDER_REVIEW
NEW STATUS: ACTIVE
```

Audit Log không được xóa tùy tiện.

---

# 27. Nguyên tắc lịch sử

Hệ thống không xóa dữ liệu nghiệp vụ
chỉ vì dữ liệu không còn hiệu lực.

Ví dụ:

- Nơi ở cũ → HISTORY
- Giấy tờ cũ: VERSION 1 → HISTORY
- Hồ sơ cũ: TERMINATED / EXPIRED / REJECTED

vẫn phải được lưu trữ để phục vụ tra cứu và báo cáo.

---

# 28. Thống kê và báo cáo

Hệ thống hỗ trợ thống kê theo:

- Khoa.
- Lớp.
- Khóa.
- Thời gian.
- Khu vực.
- Phường/xã.
- Quận/huyện.
- Tỉnh/thành phố.
- Trạng thái hồ sơ.
- Tình trạng xử lý.
- Số hồ sơ mới.
- Số hồ sơ đang xử lý.
- Số hồ sơ ACTIVE.
- Số hồ sơ EXPIRED.
- Số hồ sơ REJECTED.
- Số yêu cầu gia hạn.
- Số yêu cầu chuyển nơi ở.
- Số yêu cầu kết thúc.
- Số hồ sơ quá SLA.

---

# 29. Nguyên tắc dữ liệu quan trọng

Hệ thống phải đảm bảo:

- Một sinh viên chỉ có tối đa một REGISTRATION ACTIVE.
- Một REGISTRATION chỉ có tối đa một REQUEST đang mở.
- Nơi ở mới không trở thành CURRENT trước khi CHANGE_ADDRESS được duyệt.
- Hồ sơ hết hạn phải được chuyển EXPIRED.
- Giấy tờ cũ không bị xóa.
- Lịch sử xử lý phải được lưu.
- Dữ liệu sinh viên từ SIS là nguồn dữ liệu chính.
- Sinh viên không được tự thay đổi các thông tin thuộc SIS.
- Quyền phê duyệt phải được kiểm soát bằng phân quyền.
- Các hành động quan trọng phải được ghi Audit Log.

---

# 30. Vòng đời tổng quát của REGISTRATION

```text
                         ┌──────────────┐
                         │    DRAFT     │
                         └──────┬───────┘
                                │
                              Submit
                                ↓
                       ┌─────────────────┐
                       │    SUBMITTED    │
                       └────────┬────────┘
                                ↓
                       ┌─────────────────┐
                       │  UNDER_REVIEW   │
                       └────┬───────┬────┘
                            │       │
                   bổ sung  │       │ từ chối
                            ↓       ↓
                  ┌────────────┐  ┌──────────┐
                  │NEED_MORE_  │  │ REJECTED │
                  │INFO        │  └──────────┘
                  └─────┬──────┘
                        │
                     bổ sung
                        ↓
                   SUBMITTED
                        │
                        ↓
                  UNDER_REVIEW
                        │
                      duyệt
                        ↓
                    ┌────────┐
                    │ ACTIVE │
                    └───┬────┘
                        │
              ┌─────────┼─────────┐
              │         │         │
          hết hạn    kết thúc   nghiệp vụ
              │         │       phát sinh
              ↓         ↓
          EXPIRED   TERMINATED
```

---

# 31. Vòng đời REQUEST

```text
             CREATE
                ↓
             PENDING
                ↓
          UNDER_REVIEW
           /         \
          /           \
      APPROVED       REJECTED
```

Một REQUEST có thể yêu cầu bổ sung:

```text
UNDER_REVIEW
      ↓
NEED_MORE_INFO
      ↓
PENDING / SUBMITTED
      ↓
UNDER_REVIEW
```

REQUEST sau khi kết thúc không còn được xem là REQUEST đang mở.

---

# 32. Nguyên tắc thiết kế nghiệp vụ

Hệ thống phải đảm bảo sự tách biệt:

```text
REGISTRATION
      │
      │ 1:N
      ↓
REQUEST
```

Một REGISTRATION có thể phát sinh nhiều REQUEST trong suốt vòng đời.

Ví dụ:

```text
REGISTRATION #001
       │
       ├── RENEWAL #001
       ├── CHANGE_ADDRESS #002
       ├── RENEWAL #003
       └── TERMINATION #004
```

Tuy nhiên tại cùng một thời điểm
chỉ có tối đa một REQUEST đang mở.

---

# 33. Nguyên tắc cuối cùng

Hệ thống được thiết kế theo nguyên tắc:

Quản lý toàn bộ vòng đời ngoại trú của sinh viên,
đồng thời tách biệt hồ sơ gốc với các yêu cầu phát sinh,
đảm bảo dữ liệu hiện tại, lịch sử và quá trình xử lý
đều có thể truy vết.

Mọi thiết kế tiếp theo của hệ thống phải nhất quán với
tài liệu nghiệp vụ này.