# NHẬT KÝ KHẮC PHỤC LỖI VÀ HOÀN THIỆN NGHIỆP VỤ (BUG FIX LOG)
> **Dự án:** QLNT_TKYC — Hệ thống Quản lý Sinh viên Ngoại trú  
> **Giai đoạn thực hiện:** Giai đoạn 1 — Khắc phục lỗi nghiệp vụ P0 và bảo đảm tính đúng đắn của dữ liệu  
> **Thời điểm cập nhật:** 16/10/2026  

---

## 1. TỔNG QUAN CÁC BUG ĐÃ XÁC MINH VÀ GIẢI QUYẾT

### Bug 1: Xung đột trạng thái địa chỉ khi duyệt chuyển nơi ở (CHANGE_ADDRESS)
- **Mức độ:** P0 (Nghiêm trọng).
- **Hiện trạng xác minh thực tế:**
  - Cơ sở dữ liệu SQL Server có ràng buộc `CK_ADDRESS_STATUS`:  
    `CHECK ([status]='INACTIVE' OR [status]='OLD' OR [status]='CURRENT')`.
  - Trong mã nguồn ban đầu, comment ghi `addr.Status = "PREVIOUS"`. Nếu gán `"PREVIOUS"` vào cột `status` của bảng `ADDRESS`, SQL Server sẽ phát sinh lỗi vi phạm CHECK Constraint `CK_ADDRESS_STATUS`.
  - Entity `Request` có các thuộc tính địa chỉ mới (`NewAddressLine`, `NewWard`, `NewDistrict`, `NewCity`, `NewLandlordId`) nhưng trong `AppDbContext.cs` **chưa được cấu hình ánh xạ** (`HasColumnName`) sang các cột snake_case (`new_address_line`, `new_ward`, `new_district`, `new_city`, `new_landlord_id`), dẫn đến nguy cơ lỗi runtime `Invalid column name 'NewAddressLine'`.
  - Ngoài ra, trong `Request.cs`, thuộc tính `Registration` không phải nullable (`public virtual Registration Registration { get; set; } = null!;`), khiến ASP.NET Core Model Validation tự động chặn request từ client với mã lỗi `400 Bad Request` (`The Registration field is required.`).
  - Thiếu cập nhật `EndDate` cho địa chỉ cũ khi chuyển trọ.
  - Thiếu ghi nhận bản ghi `Approval` và `RequestHistory` khi Cán bộ phê duyệt yêu cầu.
  - Thiếu kiểm tra ràng buộc: cho phép duyệt lại request đã `APPROVED` hoặc duyệt request đã bị `REJECTED`/`CANCELLED`.
- **Giải pháp đã thực hiện:**
  1. Cấu hình ánh xạ tường minh các cột `new_address_line`, `new_ward`, `new_district`, `new_city`, `new_landlord_id` trong `AppDbContext.cs`.
  2. Sửa thuộc tính `Registration` và `Status` trong `Request.cs` sang nullable (`Registration?`, `string?`).
  3. Cập nhật `ApproveRequest` trong `RequestController.cs`:
     - Kiểm tra trạng thái yêu cầu: chỉ cho phép duyệt khi request ở trạng thái `SUBMITTED`, `UNDER_REVIEW`, `PROCESSING`. Từ chối duyệt nếu request đã `APPROVED` hoặc đã `REJECTED`/`CANCELLED`.
     - Kiểm tra trạng thái hồ sơ: hồ sơ phải đang ở trạng thái `ACTIVE` hoặc `APPROVED`.
     - Xử lý địa chỉ cũ: Chuyển `Status = "OLD"`, gán `EndDate = DateOnly.FromDateTime(DateTime.Today)`.
     - Thêm địa chỉ mới: Gán `Status = "CURRENT"`, `AddressType = "TEMPORARY"`, `StartDate = DateOnly.FromDateTime(DateTime.Today)`.
     - Ghi nhận `Approval` (`approval_type = 'REQUEST'`, `decision = 'APPROVED'`).
     - Ghi nhận `RequestHistory` (`old_status -> new_status = 'APPROVED'`).
     - Gửi `Notification` đến tài khoản sinh viên.
     - Toàn bộ thao tác thực thi trong một Database Transaction an toàn.

---

### Bug 2: Ngăn sinh viên tạo nhiều hồ sơ ngoại trú trùng lặp
- **Mức độ:** P0 (Nghiêm trọng).
- **Hiện trạng xác minh thực tế:**
  - Trong phương thức `SubmitFullRegistration` (`RegistrationController.cs`), hệ thống tiếp nhận payload và trực tiếp tạo bản ghi `Registration` mới mà không kiểm tra xem sinh viên hiện tại đã có hồ sơ nào đang hoạt động hoặc đang chờ duyệt hay chưa.
  - Dẫn đến tình trạng một sinh viên có thể nộp hàng loạt hồ sơ `SUBMITTED` đè lên nhau, hoặc sinh viên đã có nơi ở ngoại trú hợp lệ (`ACTIVE`) vẫn có thể nộp hồ sơ mới gây mâu thuẫn dữ liệu cư trú.
- **Giải pháp đã thực hiện:**
  - Bổ sung kiểm tra tiền điều kiện ngay đầu phương thức `SubmitFullRegistration`:
    1. Nếu sinh viên đã có hồ sơ `ACTIVE` hoặc `APPROVED`: Chặn yêu cầu với mã `HTTP 400 Bad Request`, thông báo:  
       *“Bạn đã có hồ sơ ngoại trú đang hoạt động trên hệ thống. Nếu có thay đổi nơi ở, vui lòng tạo 'Yêu cầu chuyển nơi ở' thay vì tạo hồ sơ mới.”*
    2. Nếu sinh viên đang có hồ sơ `SUBMITTED`, `UNDER_REVIEW`, hoặc `PROCESSING`: Chặn yêu cầu với mã `HTTP 400 Bad Request`, thông báo:  
       *“Bạn đang có hồ sơ ngoại trú đang trong quá trình xét duyệt. Vui lòng chờ kết quả xử lý từ cán bộ nhà trường.”*
    3. Nếu sinh viên có hồ sơ `NEED_MORE_INFO`: Chặn yêu cầu với mã `HTTP 400 Bad Request`, thông báo:  
       *“Hồ sơ ngoại trú của bạn đang ở trạng thái cần bổ sung thông tin (NEED_MORE_INFO). Vui lòng cập nhật và nộp lại hồ sơ đó thay vì tạo hồ sơ mới.”*
  - Vẫn cho phép sinh viên nộp hồ sơ mới nếu các hồ sơ cũ đều đã ở trạng thái kết thúc (`REJECTED`, `TERMINATED`, `EXPIRED`, `WITHDRAWN`).

---

### Bug 3: Rà soát và đồng bộ luồng Reviewer và Officer giữa Backend & Frontend
- **Mức độ:** P1 (Tính nhất quán nghiệp vụ và giao diện người dùng).
- **Hiện trạng xác minh thực tế:**
  - Tại giao diện Reviewer (`ReviewerActionButtons.jsx`), nút hành động màu xanh hiển thị nhãn **“Phê duyệt hồ sơ”**, trong khi bản chất nghiệp vụ của Reviewer là thẩm định ban đầu (`PASS`), chuyển hồ sơ sang trạng thái `UNDER_REVIEW` để Cán bộ quản lý (Officer/Approver) ra quyết định phê duyệt chính thức (`APPROVE` -> `ACTIVE`).
  - Tại giao diện sinh viên (`ResidencePage.jsx`), việc lấy địa chỉ bằng `registration.addresses[0]` có nguy cơ lấy sai địa chỉ cũ (`OLD`) sau khi sinh viên đã chuyển nơi ở, thay vì lấy địa chỉ đang hiệu lực (`CURRENT`).
  - Nút “Báo chuyển trọ” tại `ResidencePage.jsx` hiển thị cho cả sinh viên chưa có hồ sơ hoặc hồ sơ chưa được duyệt, dễ gây nhầm lẫn.
- **Giải pháp đã thực hiện:**
  1. Cập nhật `ReviewerActionButtons.jsx`:
     - Đổi tiêu đề thành `HÀNH ĐỘNG THẨM ĐỊNH`.
     - Đổi nhãn nút hành động 1 thành **“Thẩm định đạt (Chuyển duyệt)”** với tooltip giải thích rõ thẩm quyền: chuyển tiếp lên Cán bộ quản lý phê duyệt chính thức.
  2. Cập nhật `ResidencePage.jsx`:
     - Sửa logic lấy địa chỉ: ưu tiên tìm bản ghi có `status === 'CURRENT'`.
     - Hiển thị huy hiệu (Badge) trực quan về trạng thái hồ sơ (ví dụ: `Đang hiệu lực - ACTIVE`).
     - Kiểm soát nút “Báo chuyển trọ”: chỉ kích hoạt khi hồ sơ ở trạng thái `ACTIVE` hoặc `APPROVED`; nếu không, nút sẽ ở trạng thái disabled kèm tooltip hướng dẫn.

---

## 2. DANH SÁCH FILE ĐÃ THAY ĐỔI VÀ MỤC ĐÍCH

| STT | Đường dẫn File | Mục đích thay đổi |
|---|---|---|
| 1 | `source/backend/Data/AppDbContext.cs` | Ánh xạ EF Core cho các cột `new_address_line`, `new_ward`, `new_district`, `new_city`, `new_landlord_id` của bảng `REQUEST`. |
| 2 | `source/backend/Models/Request.cs` | Đổi navigation property `Registration` và `Status` sang nullable để tránh lỗi Model Validation tự động chặn request hợp lệ từ client. |
| 3 | `source/backend/Controllers/RequestController.cs` | Bổ sung logic phê duyệt/từ chối yêu cầu `CHANGE_ADDRESS` và các loại yêu cầu: kiểm tra trạng thái trước/sau, cập nhật địa chỉ cũ `OLD` và địa chỉ mới `CURRENT`, ghi nhận `Approval`, `RequestHistory`, gửi `Notification`, bọc Transaction. |
| 4 | `source/backend/Controllers/RegistrationController.cs` | Thêm kiểm tra chặn sinh viên tạo nhiều hồ sơ ngoại trú khi đã có hồ sơ `ACTIVE`, `SUBMITTED`, `UNDER_REVIEW`, `NEED_MORE_INFO`. |
| 5 | `source/frontend/src/pages/reviewer/workspace/ReviewerActionButtons.jsx` | Đổi nhãn nút từ “Phê duyệt hồ sơ” thành “Thẩm định đạt (Chuyển duyệt)” để phản ánh đúng vai trò thẩm định viên. |
| 6 | `source/frontend/src/pages/student/residence/ResidencePage.jsx` | Lấy đúng địa chỉ `status === 'CURRENT'`, hiển thị badge trạng thái hồ sơ `ACTIVE`, kiểm soát điều kiện bấm nút “Báo chuyển trọ”. |
| 7 | `docs/bug-fix/BUG_FIX_LOG.md` | Tạo tài liệu lưu trữ toàn bộ bằng chứng kiểm thử và nhật ký sửa lỗi theo tiêu chuẩn. |

---

## 3. KẾT QUẢ BUILD HỆ THỐNG

### 3.1. Backend (`dotnet build`)
- **Thư mục:** `source/backend/`
- **Kết quả:** `Build succeeded. 0 Warning(s), 0 Error(s).`
- **Output Assembly:** `bin\Debug\net10.0\QLNT_TKYC.API.dll`

### 3.2. Frontend (`npm run build`)
- **Thư mục:** `source/frontend/`
- **Lệnh thực thi:** `npm run build` (Vite v5.4.21)
- **Kết quả:** `✓ built in 11.87s` (Exit code: 0)
- **Dist output:** `dist/index.html`, `dist/assets/index-DCjZNaDY.js` (588.88 kB).

---

## 4. KẾT QUẢ KIỂM THỬ THỰC TẾ TRÊN DATABASE VÀ API

Các ca kiểm thử đã được thực thi trực tiếp trên API đang chạy (`http://localhost:5005`) kết nối cơ sở dữ liệu `QLNT_TKYC` (SQL Server `Khánh\SQLEXPRESS01`).

| Ca kiểm thử | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|
| **TC-01** | Sinh viên `660203` (đã có hồ sơ `ACTIVE` ID 60) gọi `POST api/Registration/submit-full` | Bị chặn `400 Bad Request`, có thông báo hướng dẫn tạo yêu cầu chuyển trọ | `HTTP 400 Bad Request` — Response: `{"message":"Bạn đã có hồ sơ ngoại trú đang hoạt động trên hệ thống. Nếu có thay đổi nơi ở, vui lòng tạo 'Yêu cầu chuyển nơi ở' thay vì tạo hồ sơ mới.","registrationCode":"HS-20260912-001","status":"ACTIVE"}` | **ĐẠT** |
| **TC-02** | Sinh viên `640101` (chưa có hồ sơ nào) gọi `POST api/Registration/submit-full` | Cho phép tạo hồ sơ mới, trả về `HTTP 200 OK` | `HTTP 200 OK` — Tạo thành công hồ sơ `HS-20261016-001` (trạng thái `SUBMITTED`) | **ĐẠT** |
| **TC-03** | Sinh viên `640101` (vừa tạo hồ sơ `SUBMITTED`) tiếp tục gọi `POST api/Registration/submit-full` | Bị chặn `400 Bad Request`, thông báo hồ sơ đang chờ duyệt | `HTTP 400 Bad Request` — Response: `{"message":"Bạn đang có hồ sơ ngoại trú đang trong quá trình xét duyệt. Vui lòng chờ kết quả xử lý từ cán bộ nhà trường.","registrationCode":"HS-20261016-001","status":"SUBMITTED"}` | **ĐẠT** |
| **TC-04** | Sinh viên `660203` tạo yêu cầu `CHANGE_ADDRESS` (ID 28) kèm thông tin địa chỉ mới, Officer gọi `POST api/Request/28/approve` | Duyệt thành công `HTTP 200 OK`, cập nhật hồ sơ và địa chỉ | `HTTP 200 OK` — `{"message":"Đã duyệt yêu cầu CHANGE_ADDRESS thành công.","requestId":28,"requestStatus":"APPROVED"}` | **ĐẠT** |
| **TC-05** | Truy vấn DB hồ sơ ID 60 sau khi duyệt yêu cầu ID 28 | Địa chỉ cũ có trạng thái `OLD` và có `EndDate`; Địa chỉ mới có trạng thái `CURRENT` | - Địa chỉ cũ ID 57: `Status: OLD`, `EndDate: 2026-10-16`<br>- Địa chỉ mới ID 63: `Status: CURRENT`, `StartDate: 2026-10-16`, `EndDate: null` | **ĐẠT** |
| **TC-06** | Bảng `APPROVAL` và `REQUEST_HISTORY` sau khi duyệt request ID 28 | Có đầy đủ bản ghi lịch sử và thẩm định | - Bảng `APPROVAL`: ID 26, `approval_type: REQUEST`, `decision: APPROVED`, `decided_at: 2026-10-16 18:35:56`<br>- Bảng `REQUEST_HISTORY`: ID 28, `old_status: SUBMITTED`, `new_status: APPROVED` | **ĐẠT** |
| **TC-07** | Thử duyệt lại request ID 28 (`POST api/Request/28/approve`) | Bị chặn `400 Bad Request`, không cho duyệt lặp | `HTTP 400 Bad Request` — Response: `{"message":"Yêu cầu này đã được phê duyệt trước đó."}` | **ĐẠT** |
| **TC-08** | Thử từ chối request ID 28 đã duyệt (`POST api/Request/28/reject`) | Bị chặn `400 Bad Request`, không cho từ chối request đã APPROVED | `HTTP 400 Bad Request` — Response: `{"message":"Yêu cầu này đã được phê duyệt, không thể từ chối."}` | **ĐẠT** |
| **TC-09** | Tạo request RENEWAL ID 29, Officer gọi `POST api/Request/29/reject` | Từ chối thành công `HTTP 200 OK`, chuyển status sang `REJECTED` | `HTTP 200 OK` — Response: `{"message":"Đã từ chối yêu cầu.","requestId":29,"requestStatus":"REJECTED"}` | **ĐẠT** |
| **TC-10** | Thử duyệt request ID 29 đã bị từ chối (`POST api/Request/29/approve`) | Bị chặn `400 Bad Request` | `HTTP 400 Bad Request` — Response: `{"message":"Yêu cầu này đã bị từ chối, không thể phê duyệt."}` | **ĐẠT** |

---

## 5. CÔNG VIỆC CHƯA HOÀN THÀNH VÀ LÝ DO

- Chưa triển khai Background Scheduler tự động quét hồ sơ hết hạn (`EXPIRED`) và quét SLA quá hạn (`OVERDUE`): Đã được quy hoạch trong phạm vi **Giai đoạn 2**, chưa nằm trong phạm vi Giai đoạn 1.
- Chưa triển khai cơ chế ghi Audit Log tập trung: Thuộc phạm vi **Giai đoạn 2**.

---

## 6. RỦI RO CÒN LẠI VÀ KHUYẾN NGHỊ

1. **Dữ liệu lịch sử cũ trong DB:**  
   Nếu trong DB có các bản ghi request cũ được tạo từ trước thời điểm có các cột `new_*`, các request đó khi duyệt sẽ không tự động sinh ra bản ghi `Address` mới (vì `NewAddressLine` là null). Cán bộ có thể cần kiểm tra lý do trước khi duyệt các request cũ này.
2. **Khóa Concurrency tầng Database:**  
   Logic chống tạo trùng hồ sơ hiện tại đã được bảo vệ tốt bằng kiểm tra trong Transaction. Nếu sau này lượng sinh viên đăng ký đồng thời hàng nghìn request trong cùng một giây, có thể cân nhắc thêm một Unique Filtered Index trên SQL Server:  
   `CREATE UNIQUE INDEX UQ_REGISTRATION_STUDENT_ACTIVE ON REGISTRATION(student_id) WHERE status IN ('ACTIVE', 'SUBMITTED', 'UNDER_REVIEW');`  
   *(Khuyến nghị đánh giá kỹ trước khi thêm index).*

---

## 7. BƯỚC TIẾP THEO (GIAI ĐOẠN 2 ĐỀ XUẤT)

1. **Xây dựng Background Worker / Scheduler:**
   - Quét định kỳ hồ sơ ngoại trú đến ngày hết hạn để chuyển tự động sang trạng thái `EXPIRED`.
   - Quét các SLA Tracking quá 48h để đánh dấu `OVERDUE` và tự động kích hoạt tiến trình leo thang (`Escalation`).
2. **Audit Log tập trung:**
   - Tự động ghi vết tất cả các thao tác nhạy cảm (phê duyệt, từ chối, thay đổi địa chỉ) vào bảng `AUDIT_LOG`.
3. **Đồng bộ toàn bộ tài liệu đặc tả (DFD, Use Case, Sequence Diagram) khớp 100% với mã nguồn thực tế.**
