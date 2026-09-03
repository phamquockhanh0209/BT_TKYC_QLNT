import React from 'react';
import { Search, UserCheck } from 'lucide-react';

export default function OfficerStudentsPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Tra Cứu Thông Tin Sinh Viên</h2>
        <p className="text-muted mb-0">Dữ liệu hồ sơ sinh viên đồng bộ từ hệ thống đào tạo SIS</p>
      </div>

      <div className="app-card-clean">
        <div className="input-group mb-3" style={{ maxWidth: '400px' }}>
          <span className="input-group-text bg-white"><Search size={16} /></span>
          <input type="text" className="form-control" placeholder="Tìm theo Mã SV, họ tên hoặc lớp..." />
        </div>
        <p className="text-muted fs-7 mb-0">Hiển thị danh sách sinh viên nội trú/ngoại trú và lịch sử cư trú qua các năm học.</p>
      </div>
    </div>
  );
}
