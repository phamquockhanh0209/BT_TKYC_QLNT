import React from 'react';
import { Menu, Bell, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ReviewerHeader({ reviewerName = "Trần Văn Xét Duyệt", roleName = "Reviewer" }) {
  const navigate = useNavigate();

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
        <div className="d-flex align-items-center gap-4">
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

          {/* User profile dropdown trigger */}
          <div className="d-flex align-items-center gap-2 cursor-pointer" style={{ cursor: 'pointer' }}>
            <div 
              className="rounded-circle overflow-hidden border"
              style={{ width: '40px', height: '40px', borderColor: 'var(--border-color)' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" 
                alt="Avatar Reviewer" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="d-none d-sm-block text-start lh-1">
              <div className="fw-bold fs-7 text-dark">{reviewerName}</div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>{roleName}</small>
            </div>
            <ChevronDown size={16} className="text-muted" />
          </div>
        </div>
      </div>
    </header>
  );
}
