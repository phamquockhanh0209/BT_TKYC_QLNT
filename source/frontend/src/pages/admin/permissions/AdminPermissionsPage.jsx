import React from 'react';
import { KeyRound, Plus } from 'lucide-react';

export default function AdminPermissionsPage() {
  const permissions = [
    { id: 1, module: "REGISTRATION", action: "CREATE", description: "Tạo mới hồ sơ khai báo ngoại trú", roles: ["STUDENT"] },
    { id: 2, module: "REGISTRATION", action: "READ", description: "Xem danh sách và chi tiết hồ sơ", roles: ["ADMIN", "OFFICER", "REVIEWER", "STUDENT"] },
    { id: 3, module: "REGISTRATION", action: "PROCESS", description: "Tiếp nhận, chuyển trạng thái hồ sơ", roles: ["OFFICER"] },
    { id: 4, module: "REGISTRATION", action: "APPROVE", description: "Phê duyệt hoặc từ chối chính thức hồ sơ", roles: ["REVIEWER"] },
    { id: 5, module: "DOCUMENT", action: "UPLOAD", description: "Tải lên giấy tờ minh chứng", roles: ["STUDENT", "OFFICER"] },
    { id: 6, module: "DOCUMENT", action: "VERIFY", description: "Xác minh tính hợp lệ của giấy tờ", roles: ["OFFICER", "REVIEWER"] },
    { id: 7, module: "USER", action: "MANAGE", description: "Tạo, sửa, xóa tài khoản người dùng", roles: ["ADMIN"] },
    { id: 8, module: "REPORT", action: "VIEW", description: "Xem báo cáo thống kê hệ thống", roles: ["ADMIN", "REVIEWER"] },
    { id: 9, module: "SLA", action: "MANAGE", description: "Cấu hình quy tắc và ngưỡng SLA", roles: ["ADMIN"] },
    { id: 10, module: "AUDIT", action: "READ", description: "Đọc nhật ký kiểm toán hệ thống", roles: ["ADMIN"] }
  ];

  const moduleColors = {
    REGISTRATION: "#2563eb",
    DOCUMENT: "#7c3aed",
    USER: "#dc2626",
    REPORT: "#16a34a",
    SLA: "#d97706",
    AUDIT: "#0f172a"
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản Lý Quyền Hạn (Permissions)</h2>
          <p className="text-muted mb-0">Ma trận phân quyền chi tiết cho từng hành động và phân hệ trong hệ thống</p>
        </div>
        <button className="btn btn-sm d-inline-flex align-items-center gap-1 fs-7" style={{ backgroundColor: '#1a0b7a', color: '#fff', borderColor: '#eff713' }}>
          <Plus size={16} /> Thêm quyền mới
        </button>
      </div>

      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>PHÂN HỆ</th>
                <th>HÀNH ĐỘNG</th>
                <th>MÔ TẢ QUYỀN</th>
                <th>VAI TRÒ CÓ QUYỀN NÀY</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p) => (
                <tr key={p.id} className="border-bottom border-light">
                  <td>
                    <span 
                      className="fw-bold fs-8"
                      style={{ color: moduleColors[p.module] }}
                    >
                      {p.module}
                    </span>
                  </td>
                  <td><code className="fw-bold">{p.action}</code></td>
                  <td className="text-muted">{p.description}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {p.roles.map((role) => (
                        <span key={role} className="fw-semibold text-secondary fs-8">{role}</span>
                      ))}
                    </div>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-secondary">Sửa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
