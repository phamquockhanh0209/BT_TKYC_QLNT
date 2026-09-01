# JWT Authentication & Authorization

## 1. Tổng quan

JWT (JSON Web Token) được sử dụng để xác thực người dùng trong hệ thống
Quản lý sinh viên ngoại trú.

JWT giúp hệ thống xác định:

- Người dùng đã đăng nhập hay chưa.
- Người dùng là ai.
- Người dùng đang có quyền gì.
- API nào mà người dùng được phép truy cập.

Luồng hoạt động:

Client
    ↓
Đăng nhập
    ↓
API kiểm tra tài khoản
    ↓
Tạo JWT Token
    ↓
Client lưu Token
    ↓
Client gửi Token khi gọi API
    ↓
API xác thực Token
    ↓
Cho phép / từ chối truy cập


## 2. Cấu hình JWT

Thông tin JWT được cấu hình trong:

`source/QLNT_TKYC.API/appsettings.json`

```json
"Jwt": {
  "Key": "QLNT_TKYC_SECRET_KEY_2026_CHANGE_THIS_TO_A_LONG_RANDOM_KEY",
  "Issuer": "QLNT_TKYC.API",
  "Audience": "QLNT_TKYC.Client"
}