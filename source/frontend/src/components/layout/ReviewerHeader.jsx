import React from 'react';
import { Menu, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../api/authService';

export default function ReviewerHeader({ reviewerName = "Trần Văn Xét Duyệt", roleName = "Reviewer" }) {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const displayName = currentUser?.fullName || reviewerName;

  return (
    <header className="bg-white border-bottom px-4 py-3 sticky-top" style={{ zIndex: 1010, borderColor: 'var(--border-color)' }}>
      <div className="d-flex align-items-center justify-content-between">
        {/* Hamburger & Tiêu đề Không gian xét duyệt */}
        <div className="d-flex align-items-center gap-3">
          <button type="button" className="btn btn-link p-1 text-secondary text-decoration-none d-none d-lg-block">
            <Menu size={22} />
          </button>
          <div>
            <h1 className="fw-bold fs-3 mb-0" style={{ color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>
              Không gian xét duyệt
            </h1>
            <p className="text-muted fs-7 mb-0">
              Rà soát hồ sơ kỹ lưỡng - Đảm bảo thông tin chính xác
            </p>
          </div>
        </div>

        {/* Chuông thông báo & Profile Reviewer */}
        <div className="d-flex align-items-center gap-3">
          {/* Chuông thông báo */}
          <button 
            type="button" 
            className="btn btn-link p-1 text-secondary position-relative text-decoration-none"
            onClick={() => navigate('/reviewer/notifications')}
          >
            <Bell size={22} />
            <span 
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-white"
              style={{ backgroundColor: '#ef4444', fontSize: '0.65rem' }}
            >
              5
            </span>
          </button>

          {/* User profile & Logout */}
          <div className="d-flex align-items-center gap-2 border-start ps-3" style={{ borderColor: 'var(--border-color)' }}>
            <div 
              className="rounded-circle overflow-hidden border d-flex align-items-center justify-content-center text-white fw-bold fs-7"
              style={{ width: '38px', height: '38px', backgroundColor: '#1e3a8a' }}
            >
              {displayName.split(' ').pop()?.charAt(0) || 'RV'}
            </div>
            <div className="d-none d-sm-block text-start lh-1">
              <div className="fw-bold fs-7 text-dark">{displayName}</div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>{currentUser?.role || roleName}</small>
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
