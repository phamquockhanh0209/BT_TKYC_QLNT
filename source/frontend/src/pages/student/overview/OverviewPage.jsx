import React from 'react';
import WelcomeBanner from './WelcomeBanner';
import CurrentResidenceCard from './CurrentResidenceCard';
import RegistrationStepper from './RegistrationStepper';
import RecentActivityTable from './RecentActivityTable';
import NotificationWidget from './NotificationWidget';
import QuickActionsWidget from './QuickActionsWidget';
import SupportWidget from './SupportWidget';

/**
 * Trang Tổng quan Sinh viên - Kết hợp các component con theo đúng bố cục 8 : 4
 */
export default function OverviewPage() {
  return (
    <div className="overview-page-wrapper">
      {/* Khối Banner lời chào & Đếm số liệu nhanh */}
      <WelcomeBanner 
        studentName="Nguyễn Văn An"
        studentCode="2021001234"
        faculty="Khoa Công nghệ thông tin"
        registrationStatus="ACTIVE"
        documentRatio="4/4"
        pendingRequestsCount={1}
      />

      {/* Bố cục 2 Cột chính: Cột Trái (8) & Cột Phải (4) */}
      <div className="row g-4">
        {/* === CỘT TRÁI (8 phần) === */}
        <div className="col-lg-8 col-12">
          {/* 1. Thẻ Nơi ở hiện tại & Bản vẽ nhà */}
          <CurrentResidenceCard 
            residenceName="Nhà trọ Minh Anh — Phòng 203"
            address="123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng"
            landlordName="Nguyễn Văn Minh"
            landlordPhone="09xx xxx xxx"
            status="ACTIVE"
            contractStartDate="01/09/2026"
            contractEndDate="01/09/2027"
            daysRemaining={286}
          />

          {/* 2. Thanh tiến trình hồ sơ 5 bước */}
          <RegistrationStepper />

          {/* 3. Bảng Lịch sử hoạt động gần đây */}
          <RecentActivityTable />
        </div>

        {/* === CỘT PHẢI (4 phần) === */}
        <div className="col-lg-4 col-12">
          {/* 1. Widget Thông báo mới */}
          <NotificationWidget />

          {/* 2. Widget Thao tác nhanh */}
          <QuickActionsWidget />

          {/* 3. Thẻ Trợ giúp & Liên hệ phòng CTSV */}
          <SupportWidget />
        </div>
      </div>
    </div>
  );
}
