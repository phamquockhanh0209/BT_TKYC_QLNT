import React, { useState } from 'react';
import { History, Search, Download, Filter } from 'lucide-react';

export default function AdminAuditPage() {
  const [filterModule, setFilterModule] = useState('');

  const logs = [
    { id: 1, timestamp: "03/09/2026 19:42:15", user: "admin", role: "ADMIN", module: "AUTH", action: "LOGIN_SUCCESS", detail: "Đăng nhập từ IP 192.168.1.10", ip: "192.168.1.10", result: "SUCCESS" },
    { id: 2, timestamp: "03/09/2026 19:35:08", user: "reviewer01", role: "REVIEWER", module: "REGISTRATION", action: "APPROVE_REGISTRATION", detail: "Phê duyệt hồ sơ REG-2026-00156 của Nguyễn Văn An", ip: "192.168.1.15", result: "SUCCESS" },
    { id: 3, timestamp: "03/09/2026 19:20:31", user: "officer01", role: "OFFICER", module: "REGISTRATION", action: "PROCESS_REGISTRATION", detail: "Tiếp nhận và chuyển trạng thái hồ sơ REG-2026-00155", ip: "192.168.1.12", result: "SUCCESS" },
    { id: 4, timestamp: "03/09/2026 18:50:42", user: "student01", role: "STUDENT", module: "DOCUMENT", action: "UPLOAD_DOCUMENT", detail: "Tải lên Hợp đồng thuê nhà HĐ-REG156.pdf (2.4 MB)", ip: "113.161.78.22", result: "SUCCESS" },
    { id: 5, timestamp: "03/09/2026 16:10:00", user: "system_sla", role: "SYSTEM", module: "SLA_TRACKING", action: "SLA_VIOLATION_ALERT", detail: "Cảnh báo SLA 72h: REG-2026-00142, REG-2026-00138", ip: "127.0.0.1", result: "WARNING" },
    { id: 6, timestamp: "03/09/2026 14:30:15", user: "officer02", role: "OFFICER", module: "REGISTRATION", action: "REQUEST_SUPPLEMENT", detail: "Yêu cầu bổ sung giấy tờ hồ sơ REG-2026-00144 - thiếu CT07", ip: "192.168.1.13", result: "SUCCESS" },
    { id: 7, timestamp: "03/09/2026 11:05:20", user: "reviewer01", role: "REVIEWER", module: "REGISTRATION", action: "REJECT_REGISTRATION", detail: "Từ chối hồ sơ REG-2026-00140 — địa chỉ ngoài địa bàn cho phép", ip: "192.168.1.15", result: "SUCCESS" },
    { id: 8, timestamp: "03/09/2026 09:15:00", user: "admin", role: "ADMIN", module: "USER", action: "CREATE_USER", detail: "Tạo tài khoản mới officer03@tkyc.edu.vn với vai trò OFFICER", ip: "192.168.1.10", result: "SUCCESS" }
  ];

  const resultColor = (result) => {
    if (result === 'SUCCESS') return '#16a34a';
    if (result === 'WARNING') return '#ca8a04';
    if (result === 'FAILED') return '#dc2626';
    return '#64748b';
  };

  const moduleColors = {
    AUTH: "#7c3aed", REGISTRATION: "#2563eb", DOCUMENT: "#0891b2",
    SLA_TRACKING: "#d97706", USER: "#dc2626", SYSTEM: "#0f172a"
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Audit Log — Nhật Ký Kiểm Toán Hệ Thống</h2>
          <p className="text-muted mb-0">Ghi nhận toàn bộ hành động của người dùng và hệ thống để phục vụ kiểm tra và giám sát</p>
        </div>
        <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7">
          <Download size={16} /> Xuất Log
        </button>
      </div>

      {/* Thanh lọc */}
      <div className="app-card-clean bg-white border p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0"><Search size={14} className="text-muted" /></span>
              <input type="text" className="form-control border-start-0" placeholder="Tên người dùng, hành động, chi tiết..." />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select form-select-sm" value={filterModule} onChange={e => setFilterModule(e.target.value)}>
              <option value="">Tất cả phân hệ</option>
              <option>AUTH</option>
              <option>REGISTRATION</option>
              <option>DOCUMENT</option>
              <option>USER</option>
              <option>SLA_TRACKING</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select form-select-sm">
              <option value="">Tất cả kết quả</option>
              <option>SUCCESS</option>
              <option>WARNING</option>
              <option>FAILED</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-sm w-100" style={{ backgroundColor: '#0f172a', color: '#fff' }}>
              <Filter size={14} /> Lọc
            </button>
          </div>
        </div>
      </div>

      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>THỜI GIAN</th>
                <th>NGƯỜI DÙNG</th>
                <th>VAI TRÒ</th>
                <th>PHÂN HỆ</th>
                <th>HÀNH ĐỘNG</th>
                <th>CHI TIẾT TÁC VỤ</th>
                <th>ĐỊA CHỈ IP</th>
                <th className="text-end">KẾT QUẢ</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-bottom border-light">
                  <td className="text-muted fs-8 text-nowrap">{log.timestamp}</td>
                  <td className="fw-bold"><code>{log.user}</code></td>
                  <td>
                    <span className="fw-semibold fs-8 text-secondary">{log.role}</span>
                  </td>
                  <td>
                    <span 
                      className="fw-bold fs-8"
                      style={{ 
                        color: moduleColors[log.module] || '#64748b'
                      }}
                    >
                      {log.module}
                    </span>
                  </td>
                  <td className="fs-8 fw-semibold"><code>{log.action}</code></td>
                  <td className="text-muted fs-8" style={{ maxWidth: '260px' }}>
                    <span title={log.detail}>{log.detail.length > 60 ? log.detail.slice(0, 60) + '...' : log.detail}</span>
                  </td>
                  <td className="text-muted fs-8">{log.ip}</td>
                  <td className="text-end">
                    <span className="fw-semibold fs-8" style={{ color: resultColor(log.result) }}>{log.result}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-3 py-2 border-top d-flex align-items-center justify-content-between fs-8 text-muted">
          <span>Hiển thị 8 bản ghi gần nhất. Hệ thống lưu trữ tối đa 90 ngày log.</span>
          <div className="d-flex gap-1">
            <button className="btn btn-sm btn-outline-secondary">‹ Trước</button>
            <button className="btn btn-sm btn-outline-secondary">Sau ›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
