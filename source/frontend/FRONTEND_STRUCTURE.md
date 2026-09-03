# HƯỚNG DẪN KIẾN TRÚC & BỘ KHUNG GIAO DIỆN FRONTEND (STUDENT, OFFICER & REVIEWER)

Tài liệu này ghi chú chi tiết toàn bộ cấu trúc thư mục, các file component nhỏ đã được bóc tách và cách thức tùy biến giao diện cho 3 cổng riêng biệt theo vai trò:
1. **Cổng Sinh viên (`/overview`)**: Phong cách thanh lịch, ấm áp, tối ưu cho sinh viên khai báo nơi ở và theo dõi tiến trình.
2. **Cổng Cán bộ (`/officer/dashboard`)**: Phong cách **Work Queue (Hàng đợi công việc)**, giao diện tác nghiệp chuyên nghiệp giúp cán bộ xử lý hàng chục hồ sơ, cảnh báo SLA, biểu đồ phân phối trạng thái.
3. **Cổng Thẩm định / Reviewer (`/reviewer/workspace`)**: Phong cách **Review Workspace (Không gian xét duyệt chuyên sâu)**, bố cục 3 cột tập trung vào: **"Một hồ sơ → Kiểm tra kỹ lưỡng → Ra quyết định"** (khớp 100% với ảnh mẫu 3).

---

## 1. Sơ đồ Cây Thư Mục Tổng Thể (`source/frontend`)

```text
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
│   │   │   ├── HouseIllustration.jsx      # Bản vẽ kiến trúc phác họa ngôi nhà trọ (SVG sketch tay)
│   │   │   └── BuildingIllustration.jsx   # Bản vẽ kiến trúc giảng đường đại học (SVG ở đáy Sidebar)
│   │   └── layout/
│   │       ├── StudentLayout.jsx          # Khung trang Sinh viên (Top Navbar + Thân trang + Footer)
│   │       ├── StudentNavbar.jsx          # Thanh Menu điều hướng 7 Tabs + Logo + Chuông báo + Avatar Sinh viên
│   │       ├── OfficerLayout.jsx          # Khung trang Cán bộ (Left Sidebar + Top Header + Thân trang)
│   │       ├── OfficerSidebar.jsx         # Cột Sidebar 9 mục công việc + Badge đếm + Khối Cán bộ tiếp nhận
│   │       ├── OfficerHeader.jsx          # Header Cán bộ: Lời chào 👋 + Chuông báo + Avatar dropdown
│   │       ├── ReviewerLayout.jsx         # Khung trang Reviewer (Left Sidebar + Top Header + Workspace)
│   │       ├── ReviewerSidebar.jsx        # Cột Sidebar Reviewer: Menu 7 mục + Badge đếm + Khối Reviewer
│   │       └── ReviewerHeader.jsx         # Header Reviewer: Hamburger + "Không gian xét duyệt" + Chuông báo (5) + Avatar
│   │
│   ├── pages/                             # CÁC TRANG CỦA HỆ THỐNG
│   │   ├── auth/
│   │   │   └── LoginPage.jsx              # Màn hình đăng nhập sinh viên / cán bộ / reviewer
│   │   │
│   │   ├── student/                       # KHỐI 1: CỔNG SINH VIÊN
│   │   │   ├── overview/                  # [TỔNG QUAN SINH VIÊN]
│   │   │   │   ├── OverviewPage.jsx           # Bố cục 2 cột (Trái 8 : Phải 4)
│   │   │   │   ├── WelcomeBanner.jsx          # Lời chào, MSSV, Khoa & 3 chỉ số đếm nhanh
│   │   │   │   ├── CurrentResidenceCard.jsx   # Thông tin nhà trọ, chủ trọ, hạn HĐ & bản vẽ nhà
│   │   │   │   ├── RegistrationStepper.jsx    # Thanh tiến trình 5 bước (Tạo -> Duyệt -> Hoàn tất)
│   │   │   │   ├── RecentActivityTable.jsx    # Bảng lịch sử hoạt động và thao tác gần đây
│   │   │   │   ├── NotificationWidget.jsx     # Khối thông báo mới theo màu sắc icon
│   │   │   │   ├── QuickActionsWidget.jsx     # 4 nút thao tác nhanh (Khai báo, Yêu cầu...)
│   │   │   │   └── SupportWidget.jsx          # Thẻ liên hệ trợ giúp phòng CTSV
│   │   │   ├── registration/RegistrationPage.jsx
│   │   │   ├── residence/ResidencePage.jsx
│   │   │   ├── documents/DocumentPage.jsx
│   │   │   ├── requests/RequestPage.jsx
│   │   │   ├── notifications/NotificationPage.jsx
│   │   │   └── profile/ProfilePage.jsx
│   │   │
│   │   ├── officer/                       # KHỐI 2: CỔNG CÁN BỘ TIẾP NHẬN (WORK QUEUE)
│   │   │   ├── dashboard/                 # [TỔNG QUAN TÁC NGHIỆP CÁN BỘ]
│   │   │   │   ├── OfficerDashboardPage.jsx      # Bố cục Work Queue chính
│   │   │   │   ├── OfficerStatCards.jsx          # 4 thẻ chỉ số: Tổng hồ sơ (156), Chờ xử lý (24), Bổ sung (8), Quá hạn (5)
│   │   │   │   ├── WorkQueueTable.jsx            # Hàng đợi hồ sơ cần xử lý: Tìm kiếm, lọc Khoa/Trạng thái, nút Xử lý
│   │   │   │   ├── StatusDistributionChart.jsx   # Biểu đồ tròn SVG thống kê phân phối 5 trạng thái
│   │   │   │   ├── SlaUrgentWidget.jsx           # Khối hồ sơ sắp chạm ngưỡng SLA cần xử lý gấp
│   │   │   │   ├── OfficerQuickActions.jsx       # Lưới 2x2 thao tác nhanh (Tiếp nhận, Bổ sung, Tìm kiếm, Báo cáo)
│   │   │   │   └── ProcessRegistrationModal.jsx  # Popup kiểm tra giấy tờ, phê duyệt hoặc từ chối hồ sơ
│   │   │   ├── registrations/OfficerRegistrationsPage.jsx
│   │   │   ├── requests/OfficerRequestsPage.jsx
│   │   │   ├── students/OfficerStudentsPage.jsx
│   │   │   ├── landlords/OfficerLandlordsPage.jsx
│   │   │   ├── documents/OfficerDocumentsPage.jsx
│   │   │   ├── sla/OfficerSlaPage.jsx
│   │   │   ├── notifications/OfficerNotificationsPage.jsx
│   │   │   └── reports/OfficerReportsPage.jsx
│   │   │
│   │   └── reviewer/                      # KHỐI 3: CỔNG THẨM ĐỊNH / REVIEWER (REVIEW WORKSPACE)
│   │       ├── workspace/                 # [BÀN SOI XÉT DUYỆT HỒ SƠ CHÍNH - 3 CỘT]
│   │       │   ├── ReviewerWorkspacePage.jsx     # File điều phối trung tâm
│   │       │   ├── ReviewerQueueSidebar.jsx      # CỘT 1 (Trái): Danh sách chờ xét duyệt + Search/Filter + Phân trang
│   │       │   ├── DossierDetailCard.jsx         # CỘT 2 (Giữa): Avatar SV, xác thực tên, MSSV, khoa & thông tin đợt nộp
│   │       │   ├── DossierResidenceInfo.jsx      # CỘT 2: Tab 1 - Chi tiết nơi ở, chủ trọ, thời gian thuê, ghi chú cán bộ
│   │       │   ├── DossierDocumentsTab.jsx       # CỘT 2: Tab 2 - Giấy tờ đính kèm (HĐ thuê, CT07, CCCD, ảnh nhà)
│   │       │   ├── DossierHistoryTab.jsx         # CỘT 2: Tab 3 - Lịch sử xử lý & Audit trail
│   │       │   ├── ReviewerTimelineWidget.jsx    # CỘT 3 (Phải): Tiến trình xử lý dạng dọc 5 bước
│   │       │   ├── ReviewerGuideWidget.jsx       # CỘT 3 (Phải): Tài liệu hướng dẫn & checklist PDF
│   │       │   └── ReviewerActionButtons.jsx     # CỘT 3 (Phải): 4 nút quyết định (Phê duyệt, Bổ sung, Từ chối, Ghi chú)
│   │       ├── processed/ReviewerProcessedPage.jsx
│   │       ├── requests/ReviewerRequestsPage.jsx
│   │       ├── additional-info/ReviewerAdditionalInfoPage.jsx
│   │       ├── overdue/ReviewerOverduePage.jsx
│   │       ├── reports/ReviewerReportsPage.jsx
│   │       └── stats/ReviewerStatsPage.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx                  # Cấu hình định tuyến đường dẫn URL (React Router)
│   ├── App.jsx                            # Gốc ứng dụng bọc BrowserRouter
│   └── main.jsx                           # File khởi chạy React & nạp CSS Bootstrap
│
├── index.html                             # File HTML gốc (font Plus Jakarta Sans & Inter)
├── package.json                           # Khai báo React 18, React-Bootstrap, Bootstrap Icons, Lucide
└── vite.config.js                         # Cấu hình Vite & Proxy kết nối API backend port 5005
```

---

## 2. Bản Đồ Bóc Tách Trang Reviewer Đối Chiếu Với Ảnh Mẫu 3

Nhìn vào ảnh thiết kế Reviewer Workspace (`media_1788438819042.png`), giao diện được bố trí thành 3 cột tối ưu cho việc thẩm định:

| Cột & Vị trí | Tên Component | File tương ứng | Chức năng cụ thể |
|---|---|---|---|
| **Menu bên trái** | `ReviewerSidebar` | `src/components/layout/ReviewerSidebar.jsx` | Menu 7 mục xét duyệt có badge đếm số lượng (`18`, `7`, `5`), khối "Reviewer", hình vẽ tòa nhà đại học. |
| **Thanh Header trên cùng** | `ReviewerHeader` | `src/components/layout/ReviewerHeader.jsx` | Nút Hamburger, tiêu đề "Không gian xét duyệt", slogan, chuông báo `5` và Avatar "Trần Văn Xét Duyệt - Reviewer". |
| **Cột 1 (Bên trái)** | `ReviewerQueueSidebar` | `src/pages/reviewer/workspace/ReviewerQueueSidebar.jsx` | Danh sách các thẻ hồ sơ xếp dọc (`REG-2026-00156`, `REG-2026-00155`...), ô tìm kiếm MSSV, nút lọc và phân trang `< 1 2 3 ... 4 >`. |
| **Cột 2 (Ở giữa - Trên)** | `DossierDetailCard` | `src/pages/reviewer/workspace/DossierDetailCard.jsx` | Breadcrumb, tiêu đề `HỒ SƠ NGOẠI TRÚ #REG-2026-00156`, Avatar SV, tích xanh xác thực, thông tin sinh viên & hạn xét duyệt. |
| **Cột 2 (Ở giữa - Tab 1)** | `DossierResidenceInfo` | `src/pages/reviewer/workspace/DossierResidenceInfo.jsx` | Thông tin nơi ở (địa chỉ, loại hình, diện tích), chủ trọ (SĐT, CCCD), thời gian thuê (12 tháng) và Ghi chú màu vàng của cán bộ tiếp nhận. |
| **Cột 2 (Ở giữa - Tab 2)** | `DossierDocumentsTab` | `src/pages/reviewer/workspace/DossierDocumentsTab.jsx` | Kiểm tra 4 loại giấy tờ minh chứng: Hợp đồng, CT07, CCCD chủ trọ, ảnh phòng trọ (kèm nút Xem và Tải). |
| **Cột 2 (Ở giữa - Tab 3)** | `DossierHistoryTab` | `src/pages/reviewer/workspace/DossierHistoryTab.jsx` | Nhật ký xử lý qua từng bước (Sinh viên nộp -> Cán bộ kiểm tra -> Reviewer). |
| **Cột 3 (Bên phải - Widget 1)** | `ReviewerTimelineWidget` | `src/pages/reviewer/workspace/ReviewerTimelineWidget.jsx` | Thanh tiến trình dọc 5 bước hiển thị trạng thái hoàn thành / đang chờ xử lý. |
| **Cột 3 (Bên phải - Widget 2)** | `ReviewerGuideWidget` | `src/pages/reviewer/workspace/ReviewerGuideWidget.jsx` | Danh sách 3 file tài liệu hướng dẫn & checklist xét duyệt dạng PDF. |
| **Cột 3 (Bên phải - Widget 3)** | `ReviewerActionButtons` | `src/pages/reviewer/workspace/ReviewerActionButtons.jsx` | 4 nút hành động quyết định: **Phê duyệt hồ sơ** (Xanh rêu đậm), **Yêu cầu bổ sung** (Cam), **Từ chối hồ sơ** (Đỏ), **Gửi ghi chú** (Trắng). |

---

## 3. Cách Kiểm Tra Giao Diện Trên Trình Duyệt

Mở trình duyệt và truy cập:
* **Cổng Reviewer (Không gian xét duyệt 3 cột)**: 
  👉 **`http://localhost:3000/reviewer/workspace`**
  *(Thử nhấp chọn các hồ sơ ở cột bên trái, chuyển qua lại giữa 4 Tabs ở giữa, hoặc bấm các nút Phê duyệt / Yêu cầu bổ sung / Từ chối ở cột bên phải).*
* **Cổng Cán bộ (Officer Work Queue)**: 
  👉 **`http://localhost:3000/officer/dashboard`**
* **Cổng Sinh viên (Student Portal)**: 
  👉 **`http://localhost:3000/overview`**
* **Màn hình Đăng nhập**: 
  👉 **`http://localhost:3000/login`**
