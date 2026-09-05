import React from 'react';
import { Users, FileSpreadsheet, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function AdminSystemStats({ overviewData }) {
  const stats = [
    {
      id: 1,
      title: "Tổng Sinh Viên",
      value: overviewData?.totalStudents ? overviewData.totalStudents.toLocaleString() : "1,248",
      unit: "SV",
      growth: "+12% so với kỳ trước",
      isAlert: false,
      icon: <Users size={20} />,
      iconBg: "#0f172a"
    },
    {
      id: 2,
      title: "Tổng Hồ Sơ Ngoại Trú",
      value: overviewData?.totalRegistrations ? overviewData.totalRegistrations.toLocaleString() : "326",
      unit: "Hồ sơ",
      growth: `${overviewData?.approvalRatePercentage || 89.2}% Tỷ lệ duyệt`,
      isAlert: false,
      icon: <FileSpreadsheet size={20} />,
      iconBg: "#15803d"
    },
    {
      id: 3,
      title: "Hồ Sơ Chờ Xử Lý",
      value: overviewData?.pendingReviewRegistrations || "42",
      unit: "Chờ duyệt",
      growth: "Cần cán bộ thẩm định",
      isAlert: false,
      icon: <Clock size={20} />,
      iconBg: "#b45309"
    },
    {
      id: 4,
      title: "Hồ Sơ Quá Hạn SLA",
      value: overviewData?.overdueRegistrations || "18",
      unit: "Quá hạn",
      growth: "Cảnh báo vi phạm SLA",
      isAlert: true,
      icon: <AlertTriangle size={20} />,
      iconBg: "#dc2626"
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
                className="d-flex align-items-center justify-content-center rounded-2 text-white"
                style={{ width: '36px', height: '36px', backgroundColor: item.iconBg }}
              >
                {item.icon}
              </div>
            </div>

            <div className="d-flex align-items-baseline gap-2">
              <span className="fw-bolder fs-2 text-dark lh-1">{item.value}</span>
              <span className="text-muted fw-bold fs-7">{item.unit}</span>
            </div>

            <div className="mt-2 pt-2 border-top d-flex align-items-center justify-content-between fs-8">
              {item.isAlert ? (
                <span className="badge bg-danger text-white">
                  {item.growth}
                </span>
              ) : (
                <span className="text-muted">
                  {item.growth}
                </span>
              )}
              <ArrowUpRight size={14} className="text-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
