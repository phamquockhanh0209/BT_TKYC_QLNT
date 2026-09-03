import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import axiosClient from '../../../api/axiosClient';

export default function SlaHealthWidget() {
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
        if (res && res.totalTracked !== undefined) {
          setSlaData(res);
        }
      } catch (e) {
        // use default fallback
      }
    }
    fetchSla();
  }, []);

  return (
    <div className="app-card-clean p-4 h-100 bg-white border">
      <div className="text-uppercase fw-bold text-muted fs-8 mb-1" style={{ letterSpacing: '0.04em' }}>
        CHỈ SỐ CAM KẾT SLA
      </div>
      <div className="fw-bold fs-5 text-dark mb-3">Hiệu suất giải quyết hồ sơ</div>

      <div className="d-flex align-items-center gap-3 mb-3 p-3 rounded-3" style={{ backgroundColor: '#f0fdf4', border: '1px solid #dcfce7' }}>
        <div 
          className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
          style={{ width: '48px', height: '48px', backgroundColor: '#16a34a', color: '#ffffff' }}
        >
          <ShieldCheck size={24} />
        </div>
        <div>
          <div className="text-muted fs-8">Tỷ lệ xử lý đúng hạn cam kết</div>
          <div className="fw-bolder fs-2" style={{ color: '#011857' }}>
            {slaData.onTimeRatePercentage}%
          </div>
        </div>
      </div>

      <div className="row g-2 fs-7">
        <div className="col-6">
          <div className="p-2 border rounded bg-light">
            <div className="text-muted fs-8">Đúng hạn</div>
            <div className="fw-bold text-success fs-6">{slaData.onTimeCount} hồ sơ</div>
          </div>
        </div>
        <div className="col-6">
          <div className="p-2 border rounded bg-light">
            <div className="text-muted fs-8">Quá hạn</div>
            <div className="fw-bold text-danger fs-6">{slaData.overdueCount} hồ sơ</div>
          </div>
        </div>
        <div className="col-12 mt-2">
          <div className="d-flex align-items-center justify-content-between text-muted fs-8">
            <span>Thời gian xử lý trung bình:</span>
            <strong className="text-dark">{slaData.averageProcessingHours} giờ / hồ sơ</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
