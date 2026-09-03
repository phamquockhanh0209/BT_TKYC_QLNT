import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OfficerHeader({ officerName = "Nguyễn Văn Cán Bộ", roleTitle = "Cán bộ tiếp nhận • Phòng Công tác sinh viên" }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-bottom px-4 py-3 sticky-top" style={{ zIndex: 1010, borderColor: 'var(--border-color)' }}>
      <div className="d-flex align-items-center justify-content-between">
        {/* Lời chào Cán bộ */}
        <div>
          <h1 className="fw-bold fs-3 mb-0" style={{ color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>
            Xin chào, {officerName} <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="text-muted fs-7 mb-0">
            {roleTitle}
          </p>
        </div>

        {/* Chuông thông báo & Profile Cán bộ */}
        <div className="d-flex align-items-center gap-4">
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

          {/* User profile dropdown trigger */}
          <div className="d-flex align-items-center gap-2 cursor-pointer" style={{ cursor: 'pointer' }}>
            <div 
              className="rounded-circle overflow-hidden border"
              style={{ width: '40px', height: '40px', borderColor: 'var(--border-color)' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" 
                alt="Avatar Cán bộ" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <span className="fw-semibold fs-7 text-dark d-none d-sm-inline">{officerName}</span>
            <ChevronDown size={16} className="text-muted" />
          </div>
        </div>
      </div>
    </header>
  );
}
