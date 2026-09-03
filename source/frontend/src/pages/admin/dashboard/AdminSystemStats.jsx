import React from 'react';
import { Users, FileSpreadsheet, Clock, AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function AdminSystemStats({ overviewData }) {
  const stats = [
    {
      id: 1,
      title: "Tổng Sinh Viên",
      value: overviewData?.totalStudents ? overviewData.totalStudents.toLocaleString() : "1,248",
      unit: "SV",
      growth: "+12% so với kỳ trước",
      icon: <Users size={22} />,
      iconBg: "#e0f2fe",
      iconColor: "#0284c7"
    },
    {
      id: 2,
      title: "Tổng Hồ Sơ Ngoại Trú",
      value: overviewData?.totalRegistrations ? overviewData.totalRegistrations.toLocaleString() : "326",
      unit: "Hồ sơ",
      growth: `${overviewData?.approvalRatePercentage || 89.2}% Tỷ lệ duyệt`,
      icon: <FileSpreadsheet size={22} />,
      iconBg: "#dcfce7",
      iconColor: "#00561f"
    },
    {
      id: 3,
      title: "Hồ Sơ Chờ Xử Lý",
      value: overviewData?.pendingReviewRegistrations || "42",
      unit: "Chờ duyệt",
      growth: "Cần cán bộ thẩm định",
      icon: <Clock size={22} />,
      iconBg: "#fef3c7",
      iconColor: "#d97706"
    },
    {
      id: 4,
      title: "Hồ Sơ Quá Hạn SLA",
      value: overviewData?.overdueRegistrations || "18",
      unit: "Quá hạn",
      growth: "Cảnh báo vi phạm SLA",
      icon: <AlertTriangle size={22} />,
      iconBg: "#fee2e2",
      iconColor: "#dc2626"
    }
  ];

  return (
    <div className="row g-3 mb-4">
      {stats.map((item) => (
        <div key={item.id} className="col-xl-3 col-sm-6 col-12">
          <div className="app-card-clean p-3 shadow-2xs h-100 bg-white border">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-semibold fs-7">{item.title}</span>
              <div 
                className="d-flex align-items-center justify-content-center rounded-2"
                style={{ width: '38px', height: '38px', backgroundColor: item.iconBg, color: item.iconColor }}
              >
                {item.icon}
              </div>
            </div>

            <div className="d-flex align-items-baseline gap-2">
              <span className="fw-bolder fs-2 text-dark lh-1">{item.value}</span>
              <span className="text-muted fw-bold fs-7">{item.unit}</span>
            </div>

            <div className="mt-2 pt-2 border-top d-flex align-items-center justify-content-between fs-8">
              <span className={item.id === 4 ? "text-danger fw-semibold" : "text-muted"}>
                {item.growth}
              </span>
              <ArrowUpRight size={14} className="text-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
