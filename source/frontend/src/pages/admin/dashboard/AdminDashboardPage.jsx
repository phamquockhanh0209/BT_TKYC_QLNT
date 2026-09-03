import React, { useState, useEffect } from 'react';
import AdminSystemStats from './AdminSystemStats';
import RegistrationTimelineChart from './RegistrationTimelineChart';
import StatusBreakdownChart from './StatusBreakdownChart';
import FacultyReportTable from './FacultyReportTable';
import SlaHealthWidget from './SlaHealthWidget';
import RecentAuditLogsWidget from './RecentAuditLogsWidget';
import axiosClient from '../../../api/axiosClient';

/**
 * Bảng điều khiển Quản trị Toàn diện Hệ thống (Admin System Console Dashboard)
 */
export default function AdminDashboardPage() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    async function loadOverview() {
      try {
        const res = await axiosClient.get('/Report/overview');
        if (res) setOverview(res);
      } catch (err) {
        console.error("Failed to load overview report:", err);
      }
    }
    loadOverview();
  }, []);

  return (
    <div className="admin-dashboard-wrapper d-flex flex-column gap-4">
      {/* 1. Hàng 4 Card chỉ số hệ thống */}
      <AdminSystemStats overviewData={overview} />

      {/* 2. Hàng 2 Biểu đồ: Hồ sơ theo thời gian & Phân bổ trạng thái */}
      <div className="row g-4">
        <div className="col-xl-7 col-12">
          <RegistrationTimelineChart />
        </div>
        <div className="col-xl-5 col-12">
          <StatusBreakdownChart />
        </div>
      </div>

      {/* 3. Hàng Báo cáo Khoa/Viện & Hiệu suất SLA */}
      <div className="row g-4">
        <div className="col-xl-6 col-12">
          <FacultyReportTable />
        </div>
        <div className="col-xl-6 col-12">
          <SlaHealthWidget />
        </div>
      </div>

      {/* 4. Hàng Nhật ký kiểm toán hệ thống (Audit Logs) */}
      <div className="row g-4">
        <div className="col-12">
          <RecentAuditLogsWidget />
        </div>
      </div>
    </div>
  );
}
