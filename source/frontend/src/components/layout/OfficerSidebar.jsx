import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutGrid, 
  FileText, 
  CheckCircle2, 
  Users, 
  MapPin, 
  Files, 
  Clock, 
  Bell, 
  BarChart2, 
  HelpCircle, 
  LogOut,
  UserCheck
} from 'lucide-react';
import BuildingIllustration from '../common/BuildingIllustration';

export default function OfficerSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { to: '/officer/dashboard', label: 'Tổng quan', icon: <LayoutGrid size={18} /> },
    { to: '/officer/registrations', label: 'Hồ sơ ngoại trú', icon: <FileText size={18} />, badge: 24, badgeColor: '#ef4444' },
    { to: '/officer/requests', label: 'Yêu cầu', icon: <CheckCircle2 size={18} />, badge: 8, badgeColor: '#ef4444' },
    { to: '/officer/students', label: 'Sinh viên', icon: <Users size={18} /> },
    { to: '/officer/landlords', label: 'Địa chỉ & Chủ trọ', icon: <MapPin size={18} /> },
    { to: '/officer/documents', label: 'Giấy tờ', icon: <Files size={18} /> },
    { to: '/officer/sla', label: 'SLA & Quá hạn', icon: <Clock size={18} />, badge: 5, badgeColor: '#f97316' },
    { to: '/officer/notifications', label: 'Thông báo', icon: <Bell size={18} />, badge: 3, badgeColor: '#f97316' },
    { to: '/officer/reports', label: 'Báo cáo', icon: <BarChart2 size={18} /> },
  ];

  return (
    <aside 
      className="d-flex flex-column flex-shrink-0 bg-white border-end min-vh-100" 
      style={{ width: '260px', borderColor: 'var(--border-color)', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}
    >
      {/* 1. Logo & Tên Cổng cán bộ */}
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

      {/* 2. Thẻ Vai trò Cán bộ tiếp nhận */}
      <div className="px-3 pt-3">
        <div className="p-2 px-3 rounded-3 bg-light border d-flex align-items-center gap-2" style={{ borderColor: 'var(--border-color)' }}>
          <div className="text-muted">
            <UserCheck size={20} />
          </div>
          <div className="lh-1">
            <div className="fw-bold fs-7 text-dark">Cán bộ tiếp nhận</div>
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>Phòng Công tác sinh viên</small>
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
                  isActive ? 'officer-active-link' : 'text-secondary officer-hover-link'
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

        {/* Nhóm Hướng dẫn & Đăng xuất */}
        <hr className="my-3 text-muted opacity-25" />
        <div className="d-flex flex-column gap-1">
          <a href="#" className="nav-link d-flex align-items-center gap-2 py-2 px-3 text-secondary officer-hover-link rounded-2 fs-7 fw-semibold">
            <HelpCircle size={18} />
            <span>Hướng dẫn</span>
          </a>
          <button 
            onClick={handleLogout} 
            className="btn btn-link nav-link d-flex align-items-center gap-2 py-2 px-3 text-secondary officer-hover-link rounded-2 fs-7 fw-semibold text-start w-100"
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* 4. Bản vẽ Sketch Tòa nhà ở đáy Sidebar */}
      <div className="px-3 pb-2 pt-1 border-top bg-light" style={{ borderColor: 'var(--border-color)' }}>
        <BuildingIllustration height="100px" />
      </div>

      {/* Style riêng cho Sidebar */}
      <style>{`
        .officer-active-link {
          background-color: var(--primary-color) !important;
          color: #ffffff !important;
        }
        .officer-hover-link:hover {
          background-color: #f1f5f2;
          color: var(--primary-color) !important;
        }
      `}</style>
    </aside>
  );
}
