import React, { useState, useEffect } from 'react';
import { RotateCcw, RefreshCw, Eye } from 'lucide-react';
import adminService from '../../../api/adminService';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await adminService.getRequests();
      if (res && Array.isArray(res)) {
        setRequests(res);
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const defaultRequests = [
    { requestId: 1, requestCode: "REQ-2026-00045", requestType: "Gia hạn cư trú", createdByNavigation: { fullName: "Nguyễn Văn An" }, createdAt: "2026-09-02T10:00:00", status: "PENDING" },
    { requestId: 2, requestCode: "REQ-2026-00044", requestType: "Cập nhật địa chỉ", createdByNavigation: { fullName: "Trần Thị Bình" }, createdAt: "2026-09-01T14:30:00", status: "APPROVED" },
    { requestId: 3, requestCode: "REQ-2026-00043", requestType: "Thay đổi phòng trọ", createdByNavigation: { fullName: "Lê Văn Cường" }, createdAt: "2026-08-31T09:15:00", status: "REJECTED" }
  ];

  const displayList = requests.length > 0 ? requests : defaultRequests;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Quản Lý Yêu Cầu & Khiếu Nại</h2>
          <p className="text-muted mb-0">Các kiến nghị gia hạn, cập nhật địa chỉ hoặc thắc mắc từ sinh viên</p>
        </div>
        <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadRequests}>
          <RefreshCw size={15} /> Làm mới
        </button>
      </div>

      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>MÃ YÊU CẦU</th>
                <th>LOẠI YÊU CẦU</th>
                <th>NGƯỜI GỬI</th>
                <th>NGÀY GỬI</th>
                <th>TRẠNG THÁI</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" /> Đang tải yêu cầu...
                  </td>
                </tr>
              ) : (
                displayList.map((r) => {
                  const code = r.requestCode || `REQ-${r.requestId}`;
                  const type = r.requestType || 'Yêu cầu';
                  const sender = r.createdByNavigation?.fullName || r.student?.fullName || 'Sinh viên';
                  const date = r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '—';
                  const isApproved = r.status === 'APPROVED' || r.status === 'ĐÃ DUYỆT';
                  const isRejected = r.status === 'REJECTED' || r.status === 'TỪ CHỐI';

                  return (
                    <tr key={r.requestId} className="border-bottom border-light">
                      <td className="fw-bold"><code>{code}</code></td>
                      <td>{type}</td>
                      <td>{sender}</td>
                      <td className="text-muted fs-8">{date}</td>
                      <td>
                        <span className={`badge ${isApproved ? 'bg-success-subtle text-success' : (isRejected ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning')} fs-8`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => alert(`Chi tiết yêu cầu ${code}:\n${r.reason || 'Không có ghi chú thêm.'}`)}>
                          Chi tiết
                        </button>
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
