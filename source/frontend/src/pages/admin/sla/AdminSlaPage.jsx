import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, TrendingUp, Download } from 'lucide-react';
import axiosClient from '../../../api/axiosClient';

export default function AdminSlaPage() {
  const [slaData, setSlaData] = useState({
    totalTracked: 120,
    onTimeCount: 109,
    overdueCount: 11,
    onTimeRatePercentage: 90.8,
    averageProcessingHours: 18.5
  });

  useEffect(() => {
    async function fetchSla() {
      try {
        const res = await axiosClient.get('/Report/sla-performance');
        if (res && res.totalTracked !== undefined) setSlaData(res);
      } catch (e) {/* use fallback */}
    }
    fetchSla();
  }, []);

  const slaRules = [
    { id: 1, name: "Tiếp nhận hồ sơ ban đầu", targetHours: 24, warningHours: 20, critical: false },
    { id: 2, name: "Cán bộ kiểm tra giấy tờ", targetHours: 48, warningHours: 40, critical: false },
    { id: 3, name: "Reviewer xét duyệt chính thức", targetHours: 72, warningHours: 60, critical: true },
    { id: 4, name: "Phản hồi yêu cầu bổ sung", targetHours: 120, warningHours: 96, critical: false }
  ];

  const overdueList = [
    { code: "REG-2026-00142", student: "Nguyễn Văn An", overdue: 2, stage: "Reviewer xét duyệt" },
    { code: "REG-2026-00138", student: "Trần Thị Bình", overdue: 5, stage: "Cán bộ kiểm tra" },
    { code: "REG-2026-00131", student: "Lê Văn Cường", overdue: 8, stage: "Reviewer xét duyệt" }
  ];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bolder mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>Giám Sát SLA Hệ Thống</h2>
          <p className="text-muted mb-0">Kiểm soát cam kết thời gian xử lý hồ sơ và cảnh báo vi phạm SLA theo quy định</p>
        </div>
        <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7">
          <Download size={16} /> Xuất báo cáo SLA
        </button>
      </div>

      {/* Chỉ số SLA tổng quan */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="app-card-clean bg-white border p-3 text-center">
            <div className="text-muted fs-8 mb-1">Tổng theo dõi SLA</div>
            <div className="fw-bolder fs-2 text-dark">{slaData.totalTracked}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="app-card-clean bg-white border p-3 text-center">
            <div className="text-muted fs-8 mb-1">Đúng hạn cam kết</div>
            <div className="fw-bolder fs-2 text-success">{slaData.onTimeCount}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="app-card-clean bg-white border p-3 text-center">
            <div className="text-muted fs-8 mb-1">Quá hạn SLA</div>
            <div className="fw-bolder fs-2 text-danger">{slaData.overdueCount}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="app-card-clean bg-white border p-3 text-center">
            <div className="text-muted fs-8 mb-1">Tỷ lệ tuân thủ</div>
            <div className="fw-bolder fs-2" style={{ color: '#1d4ed8' }}>{slaData.onTimeRatePercentage}%</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Quy tắc SLA */}
        <div className="col-xl-7 col-12">
          <div className="app-card-clean bg-white border p-4">
            <div className="fw-bold fs-5 text-dark mb-3 d-flex align-items-center gap-2">
              <Clock size={18} className="text-muted" /> Quy Tắc SLA Đang Áp Dụng
            </div>
            <div className="d-flex flex-column gap-3">
              {slaRules.map((rule) => (
                <div key={rule.id} className="border rounded-3 p-3" style={{ borderColor: rule.critical ? '#fecaca' : '#e2e8f0', backgroundColor: rule.critical ? '#fff5f5' : '#fff' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-semibold fs-7 text-dark">{rule.name}</span>
                    {rule.critical && <span className="fw-semibold text-danger fs-8">⚠ Ngưỡng quan trọng</span>}
                  </div>
                  <div className="row g-2 fs-8 text-muted">
                    <div className="col-6">
                      <span>Hạn chót: <strong className="text-dark">{rule.targetHours}h</strong></span>
                    </div>
                    <div className="col-6">
                      <span>Cảnh báo sớm: <strong style={{ color: '#c0aa06' }}>{rule.warningHours}h</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vi phạm SLA gần đây */}
        <div className="col-xl-5 col-12">
          <div className="app-card-clean bg-white border p-4">
            <div className="fw-bold fs-5 text-dark mb-3 d-flex align-items-center gap-2">
              <AlertTriangle size={18} className="text-danger" /> Hồ Sơ Vi Phạm SLA
            </div>
            <div className="d-flex flex-column gap-2">
              {overdueList.map((item) => (
                <div key={item.code} className="d-flex align-items-center justify-content-between p-2 rounded-3 border" style={{ borderColor: '#fecaca', backgroundColor: '#fff5f5' }}>
                  <div>
                    <div className="fw-bold fs-7 text-danger">{item.code}</div>
                    <div className="text-muted fs-8">{item.student}</div>
                    <div className="text-muted fs-8">Giai đoạn: {item.stage}</div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bolder text-danger fs-6">+{item.overdue}h</div>
                    <div className="text-muted fs-8">Quá hạn</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <div className="fs-8 text-muted">
                Thời gian xử lý TB: <strong className="text-dark">{slaData.averageProcessingHours}h / hồ sơ</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
