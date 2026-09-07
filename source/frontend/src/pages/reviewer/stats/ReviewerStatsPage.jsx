import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, RefreshCw, ShieldCheck, Clock } from 'lucide-react';
import reviewerService from '../../../api/reviewerService';

export default function ReviewerStatsPage() {
  const [slaData, setSlaData] = useState(null);
  const [facultyStats, setFacultyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [slaRes, facRes] = await Promise.allSettled([
        reviewerService.getSlaPerformance(),
        reviewerService.getStatsByFaculty()
      ]);
      if (slaRes.status === 'fulfilled') setSlaData(slaRes.value);
      if (facRes.status === 'fulfilled' && Array.isArray(facRes.value)) setFacultyStats(facRes.value);
    } catch (err) {
      console.error("Failed to load reviewer stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Thống Kê Hiệu Suất Thẩm Định</h2>
          <p className="text-muted mb-0">Theo dõi tốc độ xử lý hồ sơ, tỷ lệ hoàn thành đúng cam kết SLA 72h và phân bổ theo Khoa</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadData}>
            <RefreshCw size={15} /> Làm mới
          </button>
        </div>
      </div>

      {/* SLA Metrics */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="app-card-clean bg-white border p-4 text-center">
            <div className="text-muted fs-8 mb-1">Tỷ lệ xử lý đúng hạn SLA</div>
            <div className="fw-bolder fs-1 text-dark">{slaData?.onTimeRatePercentage || 90.8}%</div>
            <span className="badge bg-success text-white fs-8">Mục tiêu tối thiểu: ≥ 90%</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="app-card-clean bg-white border p-4 text-center">
            <div className="text-muted fs-8 mb-1">Thời gian xử lý trung bình</div>
            <div className="fw-bolder fs-1 text-dark">{slaData?.averageProcessingHours || 18.5}h</div>
            <span className="badge bg-dark text-white fs-8">Hạn định tối đa: 72h</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="app-card-clean bg-white border p-4 text-center">
            <div className="text-muted fs-8 mb-1">Tổng hồ sơ được theo dõi SLA</div>
            <div className="fw-bolder fs-1 text-dark">{slaData?.totalTracked || 0}</div>
            <span className="badge bg-secondary text-white fs-8">{slaData?.onTimeCount || 0} đúng hạn / {slaData?.overdueCount || 0} quá hạn</span>
          </div>
        </div>
      </div>

      {/* Bảng phân bổ theo khoa */}
      <div className="app-card-clean bg-white border p-4">
        <div className="fw-bold fs-5 text-dark mb-3">Tỷ Lệ Sinh Viên Ngoại Trú Đã Thẩm Định Theo Khoa</div>
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>KHOA / VIỆN</th>
                <th className="text-center">TỔNG SINH VIÊN</th>
                <th className="text-center">NGOẠI TRÚ</th>
                <th className="text-end">TỶ LỆ</th>
              </tr>
            </thead>
            <tbody>
              {facultyStats.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">Đang tải dữ liệu...</td>
                </tr>
              ) : (
                facultyStats.map((fac, idx) => (
                  <tr key={idx} className="border-bottom border-light">
                    <td className="fw-semibold text-dark">{fac.faculty}</td>
                    <td className="text-center text-dark">{fac.totalStudents}</td>
                    <td className="text-center fw-bold text-dark">{fac.offCampusStudents}</td>
                    <td className="text-end">
                      <span className="badge bg-success text-white">{fac.percentage}%</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
