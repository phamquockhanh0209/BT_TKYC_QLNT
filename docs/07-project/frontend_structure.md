HƯỚNG DẪN KIẾN TRÚC & BỘ KHUNG GIAO DIỆN FRONTEND (REACT + REACT-BOOTSTRAP)
Tài liệu này ghi chú chi tiết toàn bộ cấu trúc thư mục, các file component nhỏ đã được bóc tách và cách thức tùy biến giao diện Cổng thông tin Quản lý Ngoại trú Sinh viên (khớp 100% với thiết kế mẫu).

1. Sơ đồ Cây Thư Mục Tổng Thể (source/frontend)
text

source/frontend/
├── public/                                # Chứa tài nguyên tĩnh, favicon
├── src/
│   ├── api/
│   │   └── axiosClient.js                 # Cấu hình Axios gọi API Backend (Port 5005), tự động đính kèm Token JWT
│   │
│   ├── assets/
│   │   └── styles/
│   │       ├── variables.css              # Bảng màu chủ đạo (Xanh rêu, Nền ngà, Vàng nhũ, Font chữ)
│   │       ├── custom.css                 # Style tùy biến thẻ card, nhãn badge, liên kết hành động
│   │       └── stepper.css                # Style chuyên biệt cho thanh tiến trình hồ sơ 5 bước
│   │
│   ├── components/                        # CÁC THÀNH PHẦN DÙNG CHUNG (REUSABLE)
│   │   ├── common/
│   │   │   └── HouseIllustration.jsx      # Bản vẽ kiến trúc phác họa ngôi nhà trọ (SVG vector nét vẽ tay)
│   │   └── layout/
│   │       ├── StudentLayout.jsx          # Khung trang bao bọc (Navbar trên cùng + Thân trang + Footer)
│   │       └── StudentNavbar.jsx          # Thanh Menu điều hướng 7 Tabs + Logo + Chuông báo + Avatar User
│   │
│   ├── pages/                             # CÁC TRANG CỦA HỆ THỐNG
│   │   ├── auth/
│   │   │   └── LoginPage.jsx              # Màn hình đăng nhập sinh viên / cán bộ
│   │   │
│   │   └── student/                       # KHỐI TRANG DÀNH CHO SINH VIÊN
│   │       │
│   │       ├── overview/                  # [TRANG CHÍNH: TỔNG QUAN] (Đã bóc tách thành các file nhỏ)
│   │       │   ├── OverviewPage.jsx           # File chính ghép nối bố cục 2 cột (Trái 8 : Phải 4)
│   │       │   ├── WelcomeBanner.jsx          # Khối: Lời chào, MSSV, Khoa & 3 chỉ số đếm nhanh
│   │       │   ├── CurrentResidenceCard.jsx   # Khối: Thông tin nhà trọ, chủ trọ, hạn HĐ & bản vẽ nhà
│   │       │   ├── RegistrationStepper.jsx    # Khối: Thanh tiến trình hồ sơ 5 bước (Tạo -> Duyệt -> Hoàn tất)
│   │       │   ├── RecentActivityTable.jsx    # Khối: Bảng lịch sử hoạt động và thao tác gần đây
│   │       │   ├── NotificationWidget.jsx     # Khối phải: Danh sách thông báo mới theo màu sắc icon
│   │       │   ├── QuickActionsWidget.jsx     # Khối phải: 4 nút bấm thao tác nhanh (Khai báo, Yêu cầu...)
│   │       │   └── SupportWidget.jsx          # Khối phải: Thẻ liên hệ trợ giúp phòng CTSV
│   │       │
│   │       ├── registration/
│   │       │   └── RegistrationPage.jsx       # Trang Tab 2: Quản lý đợt hồ sơ ngoại trú
│   │       ├── residence/
│   │       │   └── ResidencePage.jsx          # Trang Tab 3: Chi tiết địa chỉ và báo chuyển trọ
│   │       ├── documents/
│   │       │   └── DocumentPage.jsx           # Trang Tab 4: 4 loại giấy tờ minh chứng & upload
│   │       ├── requests/
│   │       │   └── RequestPage.jsx            # Trang Tab 5: Yêu cầu gia hạn & khiếu nại
│   │       ├── notifications/
│   │       │   └── NotificationPage.jsx       # Trang Tab 6: Toàn bộ danh sách thông báo
│   │       └── profile/
│   │           └── ProfilePage.jsx            # Trang Tab 7: Thông tin sinh viên từ SIS & Đăng xuất
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx                  # Cấu hình định tuyến đường dẫn URL (React Router)
│   ├── App.jsx                            # Gốc ứng dụng bọc BrowserRouter
│   └── main.jsx                           # File khởi chạy React & nạp CSS Bootstrap
│
├── index.html                             # File HTML gốc (font Plus Jakarta Sans & Inter)
├── package.json                           # Khai báo React 18, React-Bootstrap, Bootstrap Icons, Lucide
└── vite.config.js                         # Cấu hình Vite & Proxy kết nối API backend port 5005
2. Bản Đồ Bóc Tách Component Đối Chiếu Với Ảnh Mẫu
Nhìn vào bức ảnh thiết kế, toàn bộ màn hình được chia thành các component con độc lập để bạn dễ dàng sửa đổi:

Vị trí trên ảnh mẫu	Tên Component	File tương ứng	Chức năng & Dữ liệu quản lý
Thanh Menu trên cùng	StudentNavbar	src/components/layout/StudentNavbar.jsx	Hiển thị Logo QL Ngoại trú, 7 tabs chuyển trang, chuông thông báo (kèm số 3) và Avatar sinh viên.
Dòng chữ to & 3 chỉ số	WelcomeBanner	src/pages/student/overview/WelcomeBanner.jsx	"Xin chào, Nguyễn Văn An", MSSV, Khoa cùng 3 ô đếm: HỒ SƠ NGOẠI TRÚ (ACTIVE), GIẤY TỜ (4/4), YÊU CẦU (1 đang xử lý).
Thẻ nhà trọ & bản vẽ nhà	CurrentResidenceCard	src/pages/student/overview/CurrentResidenceCard.jsx	Hiển thị thông tin trọ (Tên trọ, địa chỉ, chủ trọ, SĐT, hạn HĐ, số ngày còn lại) và hình vẽ ngôi nhà trọ (HouseIllustration.jsx).
Thanh 5 bước tròn kết nối	RegistrationStepper	src/pages/student/overview/RegistrationStepper.jsx	Tiến trình: 1. Tạo hồ sơ -> 2. Khai báo nơi ở -> 3. Nộp giấy tờ -> 4. Cán bộ xét duyệt -> 5. Hoàn tất (ACTIVE).
Bảng lịch sử thao tác	RecentActivityTable	src/pages/student/overview/RecentActivityTable.jsx	Bảng 4 cột: Thời gian, Hoạt động, Nội dung, Trạng thái (Thành công màu xanh).
Khối thông báo cột phải	NotificationWidget	src/pages/student/overview/NotificationWidget.jsx	3 thông báo mới nhất với 3 icon màu: Xanh lá (duyệt hồ sơ), Xanh đậm (xử lý yêu cầu), Cam (nhắc hạn nộp giấy).
Khối 4 nút thao tác nhanh	QuickActionsWidget	src/pages/student/overview/QuickActionsWidget.jsx	4 nút bấm chuyển nhanh: Khai báo nơi ở mới, Tạo yêu cầu mới, Cập nhật giấy tờ, Xem hướng dẫn.
Thẻ Cần hỗ trợ? góc dưới	SupportWidget	src/pages/student/overview/SupportWidget.jsx	Khối icon tai nghe và nút "Liên hệ ngay" tới phòng Công tác Sinh viên.
3. Hướng Dẫn Tùy Biến Giao Diện Dễ Dàng
A. Thay đổi màu sắc chủ đạo
Mở file src/assets/styles/variables.css:

Muốn đổi màu xanh rêu sang màu khác: Sửa biến --primary-color: #163828;
Muốn đổi màu nền trang: Sửa biến --bg-page: #fbfbf8;
Muốn đổi màu vàng nhũ: Sửa biến --accent-gold: #c59b27;
B. Thay đổi thông tin nhà trọ
Mở file src/pages/student/overview/CurrentResidenceCard.jsx:

Bạn có thể sửa trực tiếp các giá trị mặc định trong props hoặc truyền từ OverviewPage.jsx khi gọi API.
C. Thêm hoặc đổi bước trong Stepper tiến trình
Mở file src/pages/student/overview/RegistrationStepper.jsx:

Tìm mảng steps ở đầu file để thêm bớt bước, đổi icon hoặc ngày tháng.
D. Thêm thao tác nhanh bên cột phải
Mở file src/pages/student/overview/QuickActionsWidget.jsx:

Tìm mảng actions và thêm một đối tượng { id: 5, title: "...", link: "...", icon: <Icon /> }.
4. Cách Khởi Chạy Frontend Kiểm Tra Giao Diện
Mở Terminal tại thư mục source/frontend:

bash

# 1. Chạy chế độ phát triển
npm run dev
Trình duyệt sẽ tự động mở địa chỉ: http://localhost:3000

Mặc định sẽ vào trang Tổng quan Sinh viên (/overview) với đầy đủ giao diện như ảnh mẫu.
Nhấp vào các Tab trên Navbar để chuyển qua các trang: Hồ sơ ngoại trú, Nơi ở hiện tại, Giấy tờ, Yêu cầu, Thông báo, Tài khoản.
Đường dẫn /login để kiểm tra màn hình đăng nhập.