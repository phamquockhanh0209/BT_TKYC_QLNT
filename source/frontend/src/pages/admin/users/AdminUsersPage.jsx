import React from 'react';
import { UserPlus, Search, Shield } from 'lucide-react';

export default function AdminUsersPage() {
  const users = [
    { id: 1, username: "admin", fullName: "Quản trị viên hệ thống", role: "ADMIN", status: "ACTIVE", lastLogin: "03/09/2026 19:42" },
    { id: 2, username: "officer01", fullName: "Nguyễn Văn Cán Bộ", role: "OFFICER", status: "ACTIVE", lastLogin: "03/09/2026 19:20" },
    { id: 3, username: "reviewer01", fullName: "Trần Văn Xét Duyệt", role: "REVIEWER", status: "ACTIVE", lastLogin: "03/09/2026 19:35" },
    { id: 4, username: "student01", fullName: "Nguyễn Văn An", role: "STUDENT", status: "ACTIVE", lastLogin: "03/09/2026 18:50" }
  ];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản Lý Người Dùng & Tài Khoản</h2>
          <p className="text-muted mb-0">Quản trị danh sách tài khoản, mật khẩu và trạng thái hoạt động trong hệ thống</p>
        </div>
        <button className="btn btn-success d-inline-flex align-items-center gap-1 fs-7" style={{ backgroundColor: '#090278', borderColor: '#dbfa13' }}>
          <UserPlus size={16} /> Thêm người dùng mới
        </button>
      </div>

      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>TÊN ĐĂNG NHẬP</th>
                <th>HỌ VÀ TÊN</th>
                <th>VAI TRÒ</th>
                <th>TRẠNG THÁI</th>
                <th>ĐĂNG NHẬP GẦN NHẤT</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-bottom border-light">
                  <td className="fw-bold"><code>{u.username}</code></td>
                  <td>{u.fullName}</td>
                  <td>
                    <span className="fw-semibold fs-8" style={{ color: u.role === 'ADMIN' ? '#1f2937' : (u.role === 'OFFICER' ? '#2563eb' : (u.role === 'REVIEWER' ? '#15803d' : '#64748b')) }}>
                      {u.role}
                    </span>
                  </td>
                  <td><span className="fw-semibold fs-8 text-success">Hoạt động</span></td>
                  <td className="text-muted fs-8">{u.lastLogin}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-secondary">Chỉnh sửa</button>
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
