# THUYẾT MINH LUỒNG HỆ THỐNG QUẢN LÝ SINH VIÊN NGOẠI TRÚ

## 1. Hệ thống này dùng để làm gì?

Đây là hệ thống giúp nhà trường quản lý việc sinh viên ở ngoài trường, hay còn gọi là **ở ngoại trú**.

Thay vì sinh viên phải điền nhiều loại giấy tờ và hỏi trực tiếp từng bộ phận, mọi việc được thực hiện trên một hệ thống chung. Sinh viên khai báo nơi ở, gửi giấy tờ và theo dõi kết quả. Nhà trường tiếp nhận, kiểm tra, phê duyệt và lưu lại toàn bộ lịch sử xử lý.

Nói đơn giản, hệ thống hoạt động giống như một quy trình nộp hồ sơ trực tuyến:

```text
Sinh viên khai báo
        ↓
Gửi hồ sơ
        ↓
Nhà trường tiếp nhận và kiểm tra
        ↓
Hồ sơ hợp lệ thì phê duyệt
        ↓
Sinh viên nhận kết quả và tiếp tục theo dõi
```

## 2. Những ai tham gia?

### Sinh viên

Sinh viên là người tạo hồ sơ, khai báo nơi ở, tải giấy tờ, gửi hồ sơ và xem tình trạng xử lý. Sau khi được duyệt, sinh viên vẫn có thể gửi yêu cầu gia hạn, chuyển nơi ở hoặc kết thúc ngoại trú.

### Cán bộ tiếp nhận

Đây là người nhận hồ sơ mới và kiểm tra nhanh xem hồ sơ có đủ các thông tin, giấy tờ cơ bản hay chưa. Cán bộ tiếp nhận không nhất thiết là người quyết định cuối cùng.

### Cán bộ xử lý

Đây là người kiểm tra kỹ nội dung hồ sơ: thông tin sinh viên, địa chỉ, chủ trọ, giấy tờ và các điều kiện liên quan. Nếu hồ sơ chưa rõ hoặc còn thiếu, cán bộ xử lý sẽ yêu cầu sinh viên bổ sung.

### Cán bộ phê duyệt

Đây là người có thẩm quyền xem kết quả kiểm tra và đưa ra quyết định cuối cùng: đồng ý hoặc từ chối hồ sơ.

### Quản trị viên

Quản trị viên quản lý tài khoản, quyền truy cập, danh mục và cấu hình hệ thống. Quản trị viên không mặc nhiên có quyền phê duyệt hồ sơ của sinh viên.

### Hệ thống thông tin sinh viên

Đây là nguồn cung cấp các thông tin chính thức như mã sinh viên, họ tên, lớp, khoa và tình trạng học tập. Sinh viên không tự sửa các thông tin chính thức này trên hệ thống ngoại trú.

## 3. Luồng đăng ký ngoại trú từ đầu đến cuối

### Bước 1: Sinh viên đăng nhập

Sinh viên đăng nhập bằng tài khoản được cấp. Hệ thống kiểm tra tài khoản có hợp lệ hay không.

Sau khi đăng nhập, hệ thống lấy thông tin cơ bản của sinh viên từ dữ liệu nhà trường để tránh việc nhập lại hoặc nhập sai thông tin.

### Bước 2: Sinh viên tạo hồ sơ

Sinh viên chọn chức năng **Đăng ký ngoại trú**. Hệ thống kiểm tra xem sinh viên đã có một hồ sơ ngoại trú đang còn hiệu lực hay chưa.

- Nếu chưa có, hệ thống cho phép tạo hồ sơ mới.
- Nếu đã có hồ sơ đang còn hiệu lực, hệ thống không tạo thêm hồ sơ trùng. Sinh viên phải dùng chức năng phù hợp như gia hạn, chuyển nơi ở hoặc kết thúc ngoại trú.

Hồ sơ mới lúc này được lưu ở dạng **bản nháp**. Bản nháp có nghĩa là sinh viên có thể nhập dần, lưu lại và quay lại chỉnh sửa sau.

### Bước 3: Sinh viên khai báo nơi ở

Sinh viên nhập các thông tin cần thiết, chẳng hạn:

- Địa chỉ nơi đang ở.
- Số nhà, tên đường, phường hoặc xã.
- Quận hoặc huyện, tỉnh hoặc thành phố.
- Thông tin chủ trọ.
- Thông tin phòng hoặc nơi ở.

### Bước 4: Sinh viên tải giấy tờ

Sinh viên tải lên các giấy tờ mà nhà trường yêu cầu. Hệ thống kiểm tra các trường bắt buộc và giấy tờ bắt buộc đã có đủ hay chưa.

- Nếu còn thiếu, hệ thống chỉ rõ phần nào cần bổ sung và chưa cho gửi hồ sơ.
- Nếu đã đủ, sinh viên có thể chọn **Gửi hồ sơ**.

### Bước 5: Sinh viên gửi hồ sơ

Khi bấm gửi, hồ sơ chuyển sang trạng thái đang chờ nhà trường tiếp nhận. Hệ thống lưu lại người gửi và thời gian gửi, sau đó thông báo cho cán bộ phụ trách.

Nếu sinh viên gửi sau thời hạn quy định, hệ thống ghi nhận là nộp trễ để cán bộ biết. Việc nộp trễ không tự động đồng nghĩa với bị từ chối; hồ sơ vẫn được xử lý theo quy định của nhà trường.

## 4. Nhà trường tiếp nhận và kiểm tra hồ sơ

### Kiểm tra sơ bộ

Cán bộ tiếp nhận mở danh sách hồ sơ mới, chọn hồ sơ và kiểm tra nhanh:

- Hồ sơ có đủ thông tin cơ bản chưa?
- Các giấy tờ bắt buộc đã được tải lên chưa?
- Thông tin có dấu hiệu thiếu hoặc sai rõ ràng không?

Nếu hồ sơ đủ điều kiện ban đầu, cán bộ tiếp nhận chuyển hồ sơ cho cán bộ xử lý.

Nếu hồ sơ thiếu, hồ sơ được trả về để sinh viên bổ sung. Sinh viên sẽ nhận được thông báo nêu rõ cần sửa hoặc thêm nội dung gì.

### Kiểm tra chi tiết

Cán bộ xử lý kiểm tra kỹ hơn bằng cách đối chiếu:

- Thông tin sinh viên với dữ liệu nhà trường.
- Thông tin nơi ở.
- Thông tin chủ trọ.
- Các giấy tờ đính kèm.
- Điều kiện đăng ký ngoại trú.

Sau khi kiểm tra, có hai khả năng:

1. **Hồ sơ hợp lệ:** cán bộ xử lý chuyển hồ sơ cho cán bộ có thẩm quyền phê duyệt.
2. **Hồ sơ chưa hợp lệ hoặc chưa đủ:** cán bộ ghi rõ lý do và yêu cầu sinh viên bổ sung.

## 5. Khi sinh viên phải bổ sung hồ sơ

Sinh viên nhận thông báo và xem cụ thể yêu cầu của cán bộ. Sinh viên có thể cập nhật thông tin, tải thêm giấy tờ hoặc thay thế giấy tờ cũ rồi gửi lại hồ sơ.

Hồ sơ sau khi gửi lại sẽ quay về quy trình kiểm tra để cán bộ xem phần bổ sung. Việc này có thể lặp lại cho đến khi hồ sơ đầy đủ hoặc không còn đáp ứng điều kiện xử lý.

Khi sinh viên thay thế một giấy tờ, hệ thống vẫn giữ bản cũ và lưu bản mới. Nhờ đó, nhà trường biết được giấy tờ nào đã được thay đổi và lịch sử xử lý vẫn đầy đủ.

Nếu sinh viên không bổ sung đúng thời hạn hoặc vượt quá số lần được phép bổ sung, hồ sơ có thể bị từ chối theo quy định. Hệ thống phải ghi rõ lý do để sinh viên và nhà trường cùng theo dõi được.

## 6. Phê duyệt và kết quả hồ sơ

Cán bộ phê duyệt xem toàn bộ hồ sơ, giấy tờ, kết quả kiểm tra và lịch sử xử lý trước khi quyết định.

### Nếu hồ sơ được chấp thuận

Hồ sơ được đánh dấu là **đã được duyệt** và chuyển sang trạng thái **đang ngoại trú hợp lệ**. Hệ thống đồng thời:

- Lưu người phê duyệt.
- Lưu thời gian phê duyệt.
- Tính thời hạn hiệu lực của hồ sơ.
- Gửi thông báo kết quả cho sinh viên.

### Nếu hồ sơ bị từ chối

Hồ sơ chuyển sang trạng thái **bị từ chối**. Cán bộ phải ghi lý do từ chối và hệ thống gửi thông báo cho sinh viên.

Mọi quyết định đều được lưu lại trong lịch sử. Vì vậy, sau này có thể biết hồ sơ đã được ai xử lý, xử lý lúc nào và vì lý do gì.

## 7. Những việc có thể phát sinh sau khi hồ sơ được duyệt

Hồ sơ đã được duyệt không có nghĩa là không bao giờ thay đổi. Trong thời gian sinh viên đang ngoại trú, có thể phát sinh các yêu cầu sau.

### Gia hạn ngoại trú

Khi hồ sơ sắp hết hạn, sinh viên chọn chức năng **Gia hạn**, cập nhật thông tin hoặc giấy tờ cần thiết và gửi yêu cầu. Cán bộ kiểm tra rồi trình người có thẩm quyền quyết định.

- Nếu được duyệt, thời hạn ngoại trú được kéo dài.
- Nếu bị từ chối, thời hạn cũ vẫn giữ nguyên và sinh viên nhận được lý do.

### Chuyển nơi ở

Sinh viên nhập địa chỉ mới và tải giấy tờ liên quan. Trong lúc chờ duyệt, địa chỉ cũ vẫn là địa chỉ đang có hiệu lực; địa chỉ mới chỉ được ghi nhận là đang chờ kiểm tra.

- Nếu được duyệt, địa chỉ cũ được chuyển vào lịch sử và địa chỉ mới trở thành địa chỉ hiện tại.
- Nếu bị từ chối, địa chỉ cũ vẫn được giữ nguyên.

### Kết thúc ngoại trú

Khi không còn ở ngoài trường, sinh viên gửi yêu cầu **Kết thúc ngoại trú**. Sau khi được duyệt, hồ sơ kết thúc hiệu lực, nhưng lịch sử nơi ở và lịch sử xử lý vẫn được lưu lại.

## 8. Hết hạn và xử lý quá hạn

Trước ngày hết hạn, hệ thống có thể gửi thông báo nhắc sinh viên gia hạn.

Nếu ngày hết hạn đã qua mà không có yêu cầu gia hạn hợp lệ, hồ sơ chuyển sang trạng thái hết hạn. Khi đó, sinh viên không còn được xem là đang ngoại trú hợp lệ theo hồ sơ đó.

Hệ thống cũng theo dõi thời gian cán bộ xử lý hồ sơ. Nếu hồ sơ bị xử lý quá lâu so với thời hạn quy định, hệ thống đánh dấu quá hạn và gửi cảnh báo. Nếu tiếp tục quá hạn, hồ sơ có thể được chuyển lên cán bộ cấp cao để xử lý.

## 9. Thông báo và lịch sử

Hệ thống gửi thông báo khi có các sự kiện quan trọng, ví dụ:

- Hồ sơ được gửi.
- Hồ sơ được tiếp nhận.
- Hồ sơ cần bổ sung.
- Hồ sơ được duyệt hoặc bị từ chối.
- Yêu cầu gia hạn, chuyển nơi ở hoặc kết thúc được tạo.
- Hồ sơ sắp hết hạn hoặc đã hết hạn.

Mỗi thao tác quan trọng đều được ghi vào lịch sử. Điều này giúp sinh viên biết hồ sơ đang ở đâu, cán bộ biết mình cần xử lý gì, còn nhà trường có thể kiểm tra lại toàn bộ quá trình khi cần.

## 10. Tóm tắt bằng một ví dụ dễ hình dung

Bạn An chuyển ra thuê trọ và cần đăng ký ngoại trú:

1. An đăng nhập hệ thống.
2. An tạo hồ sơ đăng ký mới.
3. An nhập địa chỉ phòng trọ và thông tin chủ trọ.
4. An tải giấy tờ theo yêu cầu.
5. Hệ thống kiểm tra, thấy đủ thông tin nên cho An gửi hồ sơ.
6. Cán bộ tiếp nhận kiểm tra sơ bộ rồi chuyển hồ sơ cho cán bộ xử lý.
7. Cán bộ xử lý phát hiện An thiếu một giấy tờ và gửi yêu cầu bổ sung.
8. An nhận thông báo, tải thêm giấy tờ và gửi lại.
9. Cán bộ kiểm tra lại, thấy hồ sơ hợp lệ và chuyển cho người phê duyệt.
10. Cán bộ phê duyệt đồng ý.
11. Hồ sơ của An được xác nhận đang ngoại trú hợp lệ và An nhận thông báo kết quả.
12. Gần hết hạn, An có thể gửi yêu cầu gia hạn; nếu chuyển trọ, An gửi yêu cầu chuyển nơi ở thay vì tạo hồ sơ mới.

Tóm lại, hệ thống bảo đảm hồ sơ đi đúng người, đúng bước, có thông báo khi cần hành động và có lịch sử để kiểm tra từ lúc bắt đầu đến khi kết thúc.