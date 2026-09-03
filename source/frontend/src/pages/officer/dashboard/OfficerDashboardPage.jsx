import React, { useState } from 'react';
import OfficerStatCards from './OfficerStatCards';
import WorkQueueTable from './WorkQueueTable';
import StatusDistributionChart from './StatusDistributionChart';
import SlaUrgentWidget from './SlaUrgentWidget';
import OfficerQuickActions from './OfficerQuickActions';
import ProcessRegistrationModal from './ProcessRegistrationModal';

/**
 * Trang Tổng quan Cán bộ (Officer Work Queue Dashboard)
 * Bố cục: 4 Card chỉ số -> Cột Trái (Work Queue Table) & Cột Phải (Biểu đồ, SLA khẩn, Thao tác nhanh)
 */
export default function OfficerDashboardPage() {
  const [selectedReg, setSelectedReg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleProcessClick = (reg) => {
    setSelectedReg(reg);
    setShowModal(true);
  };

  const handleApprove = (reg, note) => {
    alert(`Đã phê duyệt hồ sơ ${reg.code} thành công!`);
  };

  const handleRequestInfo = (reg, note) => {
    alert(`Đã gửi yêu cầu bổ sung thông tin cho hồ sơ ${reg.code}: "${note}"`);
  };

  const handleReject = (reg, note) => {
    alert(`Đã từ chối hồ sơ ${reg.code} với lý do: "${note}"`);
  };

  return (
    <div className="officer-dashboard-wrapper">
      {/* 1. Hàng 4 Card chỉ số công việc trên cùng */}
      <OfficerStatCards 
        totalRegistrations={156}
        pendingCount={24}
        additionalInfoCount={8}
        overdueCount={5}
      />

      {/* 2. Bố cục 2 Cột chính: Hàng đợi xử lý (8) & Thống kê/SLA/Thao tác (4) */}
      <div className="row g-4">
        {/* === CỘT TRÁI (8 phần): Hàng đợi hồ sơ cần xử lý === */}
        <div className="col-xl-8 col-12">
          <WorkQueueTable onProcess={handleProcessClick} />
        </div>

        {/* === CỘT PHẢI (4 phần): Biểu đồ tròn + SLA + Thao tác nhanh === */}
        <div className="col-xl-4 col-12">
          {/* Thống kê theo trạng thái (Biểu đồ tròn) */}
          <StatusDistributionChart />

          {/* Hồ sơ SLA sắp quá hạn */}
          <SlaUrgentWidget />

          {/* 4 Nút thao tác nhanh */}
          <OfficerQuickActions />
        </div>
      </div>

      {/* Modal Xử lý / Phê duyệt hồ sơ */}
      <ProcessRegistrationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        registration={selectedReg}
        onApprove={handleApprove}
        onRequestInfo={handleRequestInfo}
        onReject={handleReject}
      />
    </div>
  );
}
