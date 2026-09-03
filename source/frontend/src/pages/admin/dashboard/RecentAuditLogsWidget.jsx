import React from 'react';
import { History, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentAuditLogsWidget() {
  const logs = [
    { id: 1, time: "03/09/2026 19:42", user: "admin", action: "Đăng nhập hệ thống", target: "AUTH", ip: "192.168.1.10", status: "SUCCESS" },
    { id: 2, time: "03/09/2026 19:35", user: "reviewer01", action: "Phê duyệt hồ sơ REG-2026-00156", target: "REGISTRATION", ip: "192.168.1.15", status: "SUCCESS" },
    { id: 3, time: "03/09/2026 19:20", user: "officer01", action: "Tiếp nhận hồ sơ REG-2026-00155", target: "REGISTRATION", ip: "192.168.1.12", status: "SUCCESS" },
    { id: 4, time: "03/09/2026 18:50", user: "student01", action: "Tải lên tài liệu Hợp đồng thuê", target: "DOCUMENT", ip: "113.161.78.22", status: "SUCCESS" },
    { id: 5, time: "03/09/2026 16:10", user: "system_sla", action: "Cảnh báo vi phạm hạn SLA 72h", target: "SLA_TRACKING", ip: "127.0.0.1", status: "WARNING" }
  ];

  return (
    <div className="app-card-clean p-4 bg-white border">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <div className="text-uppercase fw-bold text-muted fs-8" style={{ letterSpacing: '0.04em' }}>
            NHẬT KÝ KIỂM TOÁN HỆ THỐNG
          </div>
          <div className="fw-bold fs-5 text-dark">Audit Logs gần đây</div>
        </div>
        <Link to="/admin/audit" className="link-action fs-8">
          Xem toàn bộ log <ArrowRight size={14} />
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-sm align-middle mb-0 fs-7">
          <thead className="bg-light">
            <tr className="text-muted" style={{ fontSize: '0.75rem' }}>
              <th className="py-2 border-0">Thời gian</th>
              <th className="py-2 border-0">Người dùng</th>
              <th className="py-2 border-0">Hành động tác vụ</th>
              <th className="py-2 border-0">Phân hệ</th>
              <th className="py-2 border-0">Địa chỉ IP</th>
              <th className="py-2 text-end border-0">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-bottom border-light">
                <td className="py-2 text-muted fs-8">{log.time}</td>
                <td className="py-2 fw-bold text-dark">{log.user}</td>
                <td className="py-2">{log.action}</td>
                <td className="py-2"><code>{log.target}</code></td>
                <td className="py-2 text-muted fs-8">{log.ip}</td>
                <td className="py-2 text-end">
                  <span className={`fw-semibold fs-8 ${log.status === 'SUCCESS' ? 'text-success' : 'text-warning'}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
