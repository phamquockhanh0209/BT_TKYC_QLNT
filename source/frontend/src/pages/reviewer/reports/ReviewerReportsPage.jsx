import React, { useState, useEffect } from 'react';
import { FileText, Download, RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import reviewerService from '../../../api/reviewerService';

export default function ReviewerReportsPage() {
  const [overview, setOverview] = useState(null);
  const [statusStats, setStatusStats] = useState([]);
  const [slaData, setSlaData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ovRes, stRes, slaRes] = await Promise.allSettled([
        reviewerService.getOverview(),
        reviewerService.getStatsByStatus(),
        reviewerService.getSlaPerformance()
      ]);
      if (ovRes.status === 'fulfilled') setOverview(ovRes.value);
      if (stRes.status === 'fulfilled' && Array.isArray(stRes.value)) setStatusStats(stRes.value);
      if (slaRes.status === 'fulfilled') setSlaData(slaRes.value);
    } catch (err) {
      console.error("Failed to load reports:", err);
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
          <h2 className="fw-bold mb-1 text-dark">Báo Cáo Thẩm Định & Xét Duyệt</h2>
          <p className="text-muted mb-0">Biên bản thẩm định hồ sơ ngoại trú định kỳ gửi Ban Giám hiệu và Phòng Công tác Sinh viên</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadData}>
            <RefreshCw size={15} /> Làm mới
          </button>
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={() => window.print()}>
            <Download size={16} /> Xuất Báo Cáo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3">
        <div className="col-md-3">
          <div className="app-card-clean bg-white border p-3 text-center">
            <div className="text-muted fs-8 mb-1">Tổng hồ sơ ngoại trú</div>
            <div className="fw-bolder fs-2 text-dark">{overview?.totalRegistrations || 0}</div>
            <span className="text-muted fs-8">Ghi nhận toàn trường</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="app-card-clean bg-white border p-3 text-center">
            <div className="text-muted fs-8 mb-1">Tỷ lệ phê duyệt</div>
            <div className="fw-bolder fs-2 text-dark">{overview?.approvalRatePercentage || 0}%</div>
            <span className="badge bg-success text-white fs-8">Đạt chỉ tiêu</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="app-card-clean bg-white border p-3 text-center">
            <div className="text-muted fs-8 mb-1">Hồ sơ chờ thẩm định</div>
            <div className="fw-bolder fs-2 text-dark">{overview?.pendingReviewRegistrations || 0}</div>
            <span className="badge bg-warning text-dark fs-8">Cần xử lý</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="app-card-clean bg-white border p-3 text-center">
            <div className="text-muted fs-8 mb-1">Quá hạn SLA</div>
            <div className="fw-bolder fs-2 text-dark">{overview?.overdueRegistrations || 0}</div>
            <span className="badge bg-danger text-white fs-8">Cảnh báo vi phạm</span>
          </div>
        </div>
      </div>

      {/* Phân bổ kết quả xét duyệt */}
      <div className="app-card-clean bg-white border p-4">
        <div className="fw-bold fs-5 text-dark mb-3">Phân Bổ Chi Tiết Theo Trạng Thái Hồ Sơ</div>
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>TRẠNG THÁI</th>
                <th className="text-center">SỐ LƯỢNG</th>
                <th className="text-center">TỶ LỆ</th>
                <th className="text-end">ĐÁNH GIÁ CHUYÊN VIÊN</th>
              </tr>
            </thead>
            <tbody>
              {statusStats.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">Đang tổng hợp số liệu...</td>
                </tr>
              ) : (
                statusStats.map((st, idx) => {
                  const isApproved = st.status === 'APPROVED';
                  const isPending = st.status === 'PENDING_REVIEW' || st.status === 'SUBMITTED';
                  const isRejected = st.status === 'REJECTED';

                  return (
                    <tr key={idx} className="border-bottom border-light">
                      <td>
                        <span className="fw-bold text-dark">
                          <code>{st.status}</code>
                        </span>
                      </td>
                      <td className="text-center fw-bold text-dark">{st.count}</td>
                      <td className="text-center">
                        <span className="badge bg-dark text-white">{st.percentage}%</span>
                      </td>
                      <td className="text-end">
                        {isApproved && <span className="badge bg-success text-white">Đủ điều kiện cấp phép cư trú</span>}
                        {isPending && <span className="badge bg-warning text-dark">Đang trong tiến trình kiểm tra</span>}
                        {isRejected && <span className="badge bg-danger text-white">Không đáp ứng yêu cầu</span>}
                        {!isApproved && !isPending && !isRejected && <span className="badge bg-secondary text-white">Bản nháp / Lưu trữ</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
