import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileCheck, 
  CheckCheck, 
  Clock, 
  FileEdit, 
  AlertCircle, 
  FileText, 
  BarChart3, 
  HelpCircle, 
  Bell, 
  LogOut,
  Scale
} from 'lucide-react';
import BuildingIllustration from '../common/BuildingIllustration';

export default function ReviewerSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { to: '/reviewer/workspace', label: 'Hồ sơ chờ xét duyệt', icon: <FileCheck size={18} />, badge: 18, badgeColor: '#163828' },
    { to: '/reviewer/processed', label: 'Hồ sơ đã xử lý', icon: <CheckCheck size={18} /> },
    { to: '/reviewer/requests', label: 'Yêu cầu chờ duyệt', icon: <Clock size={18} />, badge: 7, badgeColor: '#16a34a' },
    { to: '/reviewer/additional-info', label: 'Hồ sơ cần bổ sung', icon: <FileEdit size={18} /> },
    { to: '/reviewer/overdue', label: 'Hồ sơ quá hạn', icon: <AlertCircle size={18} /> },
    { to: '/reviewer/reports', label: 'Báo cáo', icon: <FileText size={18} /> },
    { to: '/reviewer/stats', label: 'Thống kê', icon: <BarChart3 size={18} /> },
  ];

  return (
    <aside 
      className="d-flex flex-column flex-shrink-0 bg-white border-end min-vh-100" 
      style={{ width: '260px', borderColor: 'var(--border-color)', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}
    >
      {/* 1. Logo & Tên Cổng Reviewer */}
      <div className="p-3 border-bottom d-flex align-items-center gap-2" style={{ borderColor: 'var(--border-color)' }}>
        <div 
          className="d-flex align-items-center justify-content-center text-white rounded-2 flex-shrink-0"
          style={{ width: '36px', height: '36px', backgroundColor: 'var(--primary-color)' }}
        >
          <ShieldCheck size={22} />
        </div>
        <div className="lh-sm">
          <div className="fw-bolder text-uppercase" style={{ color: 'var(--primary-color)', fontSize: '0.85rem', letterSpacing: '0.04em' }}>
            QL NGOẠI TRÚ
          </div>
          <small className="text-muted" style={{ fontSize: '0.68rem' }}>
            HỆ THỐNG QUẢN LÝ SINH VIÊN NGOẠI TRÚ
          </small>
        </div>
      </div>

      {/* 2. Thẻ Vai trò Reviewer */}
      <div className="px-3 pt-3">
        <div className="p-2 px-3 rounded-3 bg-light border d-flex align-items-center gap-2" style={{ borderColor: 'var(--border-color)' }}>
          <div className="text-muted">
            <Scale size={20} />
          </div>
          <div className="lh-1">
            <div className="fw-bold fs-7 text-dark">Không gian xét duyệt</div>
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>Reviewer</small>
          </div>
        </div>
      </div>

      {/* 3. Danh sách Menu điều hướng */}
      <div className="p-3 flex-grow-1">
        <nav className="nav nav-pills flex-column gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center justify-content-between py-2 px-3 rounded-2 fw-semibold text-decoration-none ${
                  isActive ? 'reviewer-active-link' : 'text-secondary reviewer-hover-link'
                }`
              }
              style={{ fontSize: '0.88rem' }}
            >
              <div className="d-flex align-items-center gap-2">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span 
                  className="badge rounded-pill text-white fw-bold"
                  style={{ backgroundColor: item.badgeColor, fontSize: '0.72rem', padding: '3px 7px' }}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Nhóm Hướng dẫn, Thông báo & Đăng xuất */}
        <hr className="my-3 text-muted opacity-25" />
        <div className="d-flex flex-column gap-1">
          <a href="#" className="nav-link d-flex align-items-center gap-2 py-2 px-3 text-secondary reviewer-hover-link rounded-2 fs-7 fw-semibold">
            <HelpCircle size={18} />
            <span>Hướng dẫn</span>
          </a>
          <NavLink to="/reviewer/notifications" className="nav-link d-flex align-items-center justify-content-between py-2 px-3 text-secondary reviewer-hover-link rounded-2 fs-7 fw-semibold">
            <div className="d-flex align-items-center gap-2">
              <Bell size={18} />
              <span>Thông báo</span>
            </div>
            <span className="badge rounded-pill bg-danger text-white fw-bold" style={{ fontSize: '0.7rem' }}>5</span>
          </NavLink>
          <button 
            onClick={handleLogout} 
            className="btn btn-link nav-link d-flex align-items-center gap-2 py-2 px-3 text-secondary reviewer-hover-link rounded-2 fs-7 fw-semibold text-start w-100"
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* 4. Bản vẽ Sketch Tòa nhà trường học ở đáy Sidebar */}
      <div className="px-3 pb-2 pt-1 border-top bg-light" style={{ borderColor: 'var(--border-color)' }}>
        <BuildingIllustration height="95px" />
      </div>

      {/* Style riêng cho Reviewer Sidebar */}
      <style>{`
        .reviewer-active-link {
          background-color: var(--primary-color) !important;
          color: #ffffff !important;
        }
        .reviewer-hover-link:hover {
          background-color: #f1f5f2;
          color: var(--primary-color) !important;
        }
      `}</style>
    </aside>
  );
}
