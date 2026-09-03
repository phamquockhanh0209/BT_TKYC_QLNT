import React from 'react';
import { Bell, ChevronDown, Activity, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminHeader({ adminName = "System Administrator", roleTitle = "Super Admin" }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-bottom px-4 py-3 sticky-top" style={{ zIndex: 1010, borderColor: 'var(--border-color)' }}>
      <div className="d-flex align-items-center justify-content-between">
        {/* Tiêu đề & Trạng thái kết nối Server */}
        <div className="d-flex align-items-center gap-3">
          <div>
            <h1 className="fw-bolder fs-1 mb-0" style={{ color: 'var(--h1)', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0,01em' }}>
              TỔNG QUAN HỆ THỐNG
            </h1>
          </div>
        </div>

        {/* Thao tác góc phải */}
        <div className="d-flex align-items-center gap-3">
          {/* Nút Refresh */}
          <button 
            type="button" 
            onClick={() => window.location.reload()}
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7"
            title="Tải lại dữ liệu hệ thống"
          >
            <RefreshCw size={14} /> Làm mới
          </button>

          {/* Chuông thông báo */}
          <button 
            type="button" 
            className="btn btn-link p-1 text-secondary position-relative text-decoration-none"
          >
            <Bell size={20} />
            <span 
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: '0.65rem' }}
            >
              18
            </span>
          </button>

          {/* User profile dropdown trigger */}
          <div className="d-flex align-items-center gap-2 cursor-pointer border-start ps-3" style={{ cursor: 'pointer', borderColor: 'var(--border-color)' }}>
            <div 
              className="rounded-circle overflow-hidden border d-flex align-items-center justify-content-center text-white fw-bold fs-7"
              style={{ width: '38px', height: '38px', backgroundColor: '#0f172a' }}
            >
              AD
            </div>
            <div className="d-none d-sm-block text-start lh-1">
              <div className="fw-bold fs-7 text-dark">{adminName}</div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>{roleTitle}</small>
            </div>
            <ChevronDown size={16} className="text-muted" />
          </div>
        </div>
      </div>
    </header>
  );
}
