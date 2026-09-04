import React from 'react';
import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../api/authService';

export default function OfficerHeader({ officerName = "Nguyễn Văn Cán Bộ", roleTitle = "Cán bộ tiếp nhận • Phòng Công tác sinh viên" }) {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const displayName = currentUser?.fullName || officerName;

  return (
    <header className="bg-white border-bottom px-4 py-3 sticky-top" style={{ zIndex: 1010, borderColor: 'var(--border-color)' }}>
      <div className="d-flex align-items-center justify-content-between">
        {/* Lời chào Cán bộ */}
        <div>
          <h1 className="fw-bold fs-3 mb-0" style={{ color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>
            Xin chào, {displayName} <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="text-muted fs-7 mb-0">
            {roleTitle}
          </p>
        </div>

        {/* Chuông thông báo & Profile Cán bộ */}
        <div className="d-flex align-items-center gap-3">
          {/* Chuông thông báo */}
          <button 
            type="button" 
            className="btn btn-link p-1 text-secondary position-relative text-decoration-none"
            onClick={() => navigate('/officer/notifications')}
          >
            <Bell size={22} />
            <span 
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-white"
              style={{ backgroundColor: '#ef4444', fontSize: '0.65rem' }}
            >
              3
            </span>
          </button>

          {/* User profile & Logout */}
          <div className="d-flex align-items-center gap-2 border-start ps-3" style={{ borderColor: 'var(--border-color)' }}>
            <div 
              className="rounded-circle overflow-hidden border d-flex align-items-center justify-content-center text-white fw-bold fs-7"
              style={{ width: '38px', height: '38px', backgroundColor: '#137333' }}
            >
              {displayName.split(' ').pop()?.charAt(0) || 'CB'}
            </div>
            <span className="fw-semibold fs-7 text-dark d-none d-sm-inline">{displayName}</span>
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
