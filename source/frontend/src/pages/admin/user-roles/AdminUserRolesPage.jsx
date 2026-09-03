import React from 'react';
import { UserCog, Plus, Trash2 } from 'lucide-react';

export default function AdminUserRolesPage() {
  const assignments = [
    { id: 1, username: "admin", fullName: "Quản trị viên hệ thống", email: "admin@tkyc.edu.vn", currentRoles: ["ADMIN"], assignedDate: "01/01/2026" },
    { id: 2, username: "officer01", fullName: "Nguyễn Văn Cán Bộ", email: "officer01@tkyc.edu.vn", currentRoles: ["OFFICER"], assignedDate: "15/07/2026" },
    { id: 3, username: "officer02", fullName: "Lê Thị Hồng", email: "officer02@tkyc.edu.vn", currentRoles: ["OFFICER"], assignedDate: "15/07/2026" },
    { id: 4, username: "reviewer01", fullName: "Trần Văn Xét Duyệt", email: "reviewer01@tkyc.edu.vn", currentRoles: ["REVIEWER"], assignedDate: "20/07/2026" },
    { id: 5, username: "student01", fullName: "Nguyễn Văn An", email: "2021001234@sv.tkyc.edu.vn", currentRoles: ["STUDENT"], assignedDate: "01/09/2026" }
  ];

  const roleColors = {
    ADMIN: "#0f172a",
    OFFICER: "#2563eb",
    REVIEWER: "#026025",
    STUDENT: "#7c3aed"
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Gán Quyền User-Role</h2>
          <p className="text-muted mb-0">Quản lý ánh xạ giữa tài khoản người dùng và vai trò của họ trong hệ thống</p>
        </div>
        <button className="btn btn-sm d-inline-flex align-items-center gap-1 fs-7" style={{ backgroundColor: '#10b981', color: '#fff', borderColor: '#10b981' }}>
          <Plus size={16} /> Gán vai trò mới
        </button>
      </div>

      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>TÀI KHOẢN</th>
                <th>HỌ VÀ TÊN</th>
                <th>EMAIL</th>
                <th>VAI TRÒ HIỆN TẠI</th>
                <th>NGÀY GÁN</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-bottom border-light">
                  <td className="fw-bold"><code>{a.username}</code></td>
                  <td>{a.fullName}</td>
                  <td className="text-muted fs-8">{a.email}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {a.currentRoles.map((role) => (
                        <span 
                          key={role} 
                          className="fw-bold fs-8"
                          style={{ color: roleColors[role] }}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-muted fs-8">{a.assignedDate}</td>
                  <td className="text-end d-flex gap-1 justify-content-end">
                    <button className="btn btn-sm btn-outline-secondary">Đổi vai trò</button>
                    {a.username !== 'admin' && (
                      <button className="btn btn-sm btn-outline-danger" title="Hủy gán quyền">
                        <Trash2 size={14} />
                      </button>
                    )}
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
