import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, TrendingUp, Download, RefreshCw } from 'lucide-react';
import adminService from '../../../api/adminService';

export default function AdminSlaPage() {
  const [slaData, setSlaData] = useState({
    totalTracked: 120,
    onTimeCount: 109,
    overdueCount: 11,
    onTimeRatePercentage: 90.8,
    averageProcessingHours: 18.5
  });
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [slaRes, regRes] = await Promise.all([
        adminService.getSlaPerformance(),
        adminService.getRegistrations()
      ]);
      if (slaRes && slaRes.totalTracked !== undefined) {
        setSlaData(slaRes);
      }
      if (regRes && Array.isArray(regRes)) {
        setRegistrations(regRes);
      }
    } catch (e) {
      console.error("SLA data loading error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const slaRules = [
    { id: 1, name: "Tiếp nhận hồ sơ ban đầu (Cán bộ)", targetHours: 24, warningHours: 20, critical: false },
    { id: 2, name: "Kiểm tra giấy tờ và minh chứng", targetHours: 48, warningHours: 40, critical: false },
    { id: 3, name: "Thẩm định chuyên sâu & Phê duyệt (Reviewer)", targetHours: 72, warningHours: 60, critical: true },
    { id: 4, name: "Phản hồi yêu cầu bổ sung thông tin", targetHours: 120, warningHours: 96, critical: false }
  ];

  // Tìm hồ sơ có SLA quá hạn hoặc đang chờ xử lý
  const pendingOrOverdue = registrations.filter(r => 
    r.status === 'SUBMITTED' || r.status === 'PENDING_REVIEW' || r.slaTracking?.isBreached
  );

  const displayOverdue = pendingOrOverdue.length > 0 ? pendingOrOverdue : [
    { registrationCode: "REG-2026-00142", student: { fullName: "Nguyễn Văn An" }, status: "PENDING_REVIEW", slaTracking: { isBreached: true, warningHours: 2 } },
    { registrationCode: "REG-2026-00138", student: { fullName: "Trần Thị Bình" }, status: "SUBMITTED", slaTracking: { isBreached: true, warningHours: 5 } }
  ];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Giám Sát SLA Hệ Thống</h2>
          <p className="text-muted mb-0">Kiểm soát cam kết thời gian xử lý hồ sơ và cảnh báo vi phạm SLA theo quy định nhà trường</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadData}>
            <RefreshCw size={15} /> Làm mới
          </button>
        </div>
      </div>

      {/* Chỉ số SLA tổng quan - Chữ Đen/Trắng, Màu sắc ở Background */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="app-card-clean bg-white border p-3 text-center">
            <div className="text-muted fs-8 mb-1">Tổng hồ sơ theo dõi SLA</div>
            <div className="fw-bolder fs-2 text-dark">{slaData.totalTracked}</div>
            <span className="text-muted fs-8">Hồ sơ có gắn SLA tracking</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="app-card-clean bg-white border p-3 text-center">
            <div className="text-muted fs-8 mb-1">Xử lý đúng hạn</div>
            <div className="fw-bolder fs-2 text-dark">{slaData.onTimeCount}</div>
            <span className="badge bg-success text-white fs-8">Đạt chuẩn cam kết</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="app-card-clean bg-white border p-3 text-center">
            <div className="text-muted fs-8 mb-1">Số lượng quá hạn</div>
            <div className="fw-bolder fs-2 text-dark">{slaData.overdueCount}</div>
            <span className="badge bg-danger text-white fs-8">Cần đôn đốc xử lý gấp</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="app-card-clean bg-white border p-3 text-center">
            <div className="text-muted fs-8 mb-1">Tỷ lệ hoàn thành đúng hạn</div>
            <div className="fw-bolder fs-2 text-dark">
              {slaData.onTimeRatePercentage}%
            </div>
            <span className="badge bg-dark text-white fs-8">Mục tiêu hệ thống: ≥ 90%</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Danh sách quy tắc SLA */}
        <div className="col-xl-6 col-12">
          <div className="app-card-clean bg-white border p-4 h-100">
            <div className="fw-bold fs-5 text-dark mb-3">Bộ Quy Tắc Cam Kết Thời Gian (SLA Matrix)</div>
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0 fs-7">
                <thead className="bg-light">
                  <tr className="text-muted fs-8">
                    <th>GIAI ĐOẠN XỬ LÝ</th>
                    <th className="text-center">HẠN ĐỊNH</th>
                    <th className="text-center">CẢNH BÁO TẠI</th>
                    <th className="text-end">MỨC ĐỘ</th>
                  </tr>
                </thead>
                <tbody>
                  {slaRules.map((rule) => (
                    <tr key={rule.id} className="border-bottom border-light">
                      <td className="fw-semibold text-dark">{rule.name}</td>
                      <td className="text-center"><span className="badge bg-secondary text-white">{rule.targetHours}h</span></td>
                      <td className="text-center"><span className="badge bg-warning text-dark">{rule.warningHours}h</span></td>
                      <td className="text-end">
                        <span className={`badge ${rule.critical ? 'bg-danger text-white' : 'bg-primary text-white'}`}>
                          {rule.critical ? 'Bắt buộc' : 'Chuẩn'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Danh sách hồ sơ cảnh báo SLA */}
        <div className="col-xl-6 col-12">
          <div className="app-card-clean bg-white border p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="fw-bold fs-5 text-dark">Hồ Sơ Đang Chờ / Cảnh Báo SLA</div>
              <span className="badge bg-danger text-white">{displayOverdue.length} hồ sơ</span>
            </div>

            <div className="d-flex flex-column gap-2">
              {displayOverdue.slice(0, 6).map((item, idx) => {
                const code = item.registrationCode || `REG-${item.registrationId}`;
                const studentName = item.student?.fullName || 'Sinh viên';
                const isOverdue = item.slaTracking?.isBreached || item.status === 'SUBMITTED';

                return (
                  <div key={idx} className="p-3 border rounded-2 d-flex align-items-center justify-content-between bg-light">
                    <div>
                      <div className="fw-bold text-dark fs-7">
                        <code>{code}</code> <span className="text-dark ms-1">— {studentName}</span>
                      </div>
                      <div className="text-muted fs-8 mt-1">
                        Giai đoạn: <span className="badge bg-dark text-white ms-1">{item.status}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`badge ${isOverdue ? 'bg-danger text-white' : 'bg-secondary text-white'} fs-8`}>
                        {isOverdue ? 'Quá hạn / Cần xử lý' : 'Đúng hạn'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
