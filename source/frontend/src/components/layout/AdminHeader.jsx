import React from 'react';
import { Bell, ChevronDown, Activity, RefreshCw, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../api/authService';

export default function AdminHeader({ adminName = "System Administrator", roleTitle = "Super Admin" }) {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

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

          {/* User profile & Logout */}
          <div className="d-flex align-items-center gap-2 border-start ps-3" style={{ borderColor: 'var(--border-color)' }}>
            <div 
              className="rounded-circle overflow-hidden border d-flex align-items-center justify-content-center text-white fw-bold fs-7"
              style={{ width: '38px', height: '38px', backgroundColor: '#0f172a' }}
            >
              AD
            </div>
            <div className="d-none d-sm-block text-start lh-1">
              <div className="fw-bold fs-7 text-dark">{currentUser?.fullName || adminName}</div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>{currentUser?.role || roleTitle}</small>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-2 d-inline-flex align-items-center gap-1 fs-8"
              onClick={() => authService.logout()}
              title="Đăng xuất"
            >
              <LogOut size={14} /> Thoát
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
