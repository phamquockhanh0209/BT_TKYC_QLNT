import React, { useState } from 'react';
import { Shield, Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminRolesPage() {
  const roles = [
    { id: 1, name: "ADMIN", displayName: "Quản trị viên hệ thống", description: "Toàn quyền quản lý hệ thống, người dùng, cấu hình và dữ liệu", userCount: 1, color: "#0f172a" },
    { id: 2, name: "OFFICER", displayName: "Cán bộ tiếp nhận hồ sơ", description: "Tiếp nhận, kiểm tra giấy tờ và chuyển hồ sơ lên Reviewer", userCount: 5, color: "#2563eb" },
    { id: 3, name: "REVIEWER", displayName: "Chuyên viên xét duyệt", description: "Thẩm định chuyên sâu và ra quyết định phê duyệt hoặc từ chối", userCount: 3, color: "#16a34a" },
    { id: 4, name: "STUDENT", displayName: "Sinh viên", description: "Khai báo nơi ở, nộp hồ sơ và theo dõi tiến trình xét duyệt", userCount: 1248, color: "#7c3aed" }
  ];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản Lý Vai Trò (Roles)</h2>
          <p className="text-muted mb-0">Định nghĩa các vai trò trong hệ thống và danh sách quyền hạn tương ứng</p>
        </div>
        <button className="btn btn-sm d-inline-flex align-items-center gap-1 fs-7" style={{ backgroundColor: '#06087b', color: '#fff', borderColor: '#d5f718' }}>
          <Plus size={16} /> Thêm vai trò mới
        </button>
      </div>

      <div className="row g-3">
        {roles.map((role) => (
          <div key={role.id} className="col-xl-6 col-12">
            <div className="app-card-clean bg-white border h-100 p-4">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-2 text-white fw-bold"
                    style={{ width: '46px', height: '46px', backgroundColor: role.color, fontSize: '0.75rem', letterSpacing: '0.03em' }}
                  >
                    <Shield size={22} />
                  </div>
                  <div>
                    <div className="fw-bold fs-5 text-dark">{role.displayName}</div>
                    <code className="text-muted fs-8">{role.name}</code>
                  </div>
                </div>
                <div className="d-flex gap-1">
                  <button className="btn btn-sm btn-outline-secondary" title="Sửa vai trò">
                    <Edit2 size={14} />
                  </button>
                  {role.name !== 'ADMIN' && (
                    <button className="btn btn-sm btn-outline-danger" title="Xóa vai trò">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-muted fs-7 mb-3">{role.description}</p>

              <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
                <span className="text-muted fs-8">Số người dùng được gán vai trò này:</span>
                <span className="fw-bold fs-6" style={{ color: role.color }}>{role.userCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
