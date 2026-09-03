import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  FileSpreadsheet, 
  RotateCcw, 
  Shield, 
  KeyRound, 
  UserCog, 
  Clock, 
  TrendingUp, 
  Settings, 
  History, 
  LogOut,
  Sliders
} from 'lucide-react';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navGroups = [
    {
      group: "HỆ THỐNG",
      items: [
        { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { to: '/admin/reports', label: 'Báo cáo & Thống kê', icon: <TrendingUp size={18} /> },
        { to: '/admin/sla', label: 'Giám sát SLA', icon: <Clock size={18} />, badge: 18, badgeColor: '#dc2626' }
      ]
    },
    {
      group: "QUẢN LÝ DỮ LIỆU",
      items: [
        { to: '/admin/users', label: 'Người dùng', icon: <Users size={18} /> },
        { to: '/admin/students', label: 'Sinh viên', icon: <GraduationCap size={18} /> },
        { to: '/admin/registrations', label: 'Hồ sơ ngoại trú', icon: <FileSpreadsheet size={18} />, badge: 42, badgeColor: '#d97706' },
        { to: '/admin/requests', label: 'Yêu cầu & Khiếu nại', icon: <RotateCcw size={18} /> }
      ]
    },
    {
      group: "PHÂN QUYỀN & BẢO MẬT",
      items: [
        { to: '/admin/roles', label: 'Vai trò (Roles)', icon: <Shield size={18} /> },
        { to: '/admin/permissions', label: 'Quyền hạn (Permissions)', icon: <KeyRound size={18} /> },
        { to: '/admin/user-roles', label: 'Gán quyền User-Role', icon: <UserCog size={18} /> }
      ]
    },
    {
      group: "VẬN HÀNH & KIỂM TOÁN",
      items: [
        { to: '/admin/config', label: 'Cấu hình hệ thống', icon: <Settings size={18} /> },
        { to: '/admin/audit', label: 'Audit Log (Kiểm toán)', icon: <History size={18} /> }
      ]
    }
  ];

  return (
    <aside 
      className="d-flex flex-column flex-shrink-0 text-white min-vh-100" 
      style={{ 
        width: '270px', 
        backgroundColor: '#0f172a', /* Dark slate navy enterprise theme */
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        overflowY: 'auto' 
      }}
    >
      {/* 1. Header Logo Admin */}
      <div className="p-3 border-bottom d-flex align-items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="lh-sm">
          <div className="fw-bolder text-uppercase tracking-wider text-white" style={{ fontSize: '0.88rem', letterSpacing: '0.05em' }}>
            QL NGOẠI TRÚ ADMIN
          </div>
          <small className="text-secondary2" style={{ fontSize: '0.68rem', color: '#efeff1b4' }}>
            Bảng điều khiển quản lý hệ thống
          </small>
        </div>
      </div>

      {/* 2. Menu phân nhóm */}
      <div className="p-3 flex-grow-1">
        {navGroups.map((grp, gIdx) => (
          <div key={gIdx} className="mb-3">
            <div className="text-uppercase fw-bold fs-8 mb-2 px-3" style={{ color: '#64748b', letterSpacing: '0.08em' }}>
              {grp.group}
            </div>
            <nav className="nav nav-pills flex-column gap-1">
              {grp.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center justify-content-between py-2 px-3 rounded-2 fw-semibold text-decoration-none ${
                      isActive ? 'admin-active-link' : 'admin-hover-link'
                    }`
                  }
                  style={{ fontSize: '0.86rem', color: '#cbd5e1' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ opacity: 0.9 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span 
                      className="fw-bold"
                      style={{ color: item.badgeColor, fontSize: '0.7rem' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}

        {/* Nút Đăng xuất */}
        <hr className="my-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <button 
          onClick={handleLogout} 
          className="btn btn-link nav-link d-flex align-items-center gap-2 py-2 px-3 rounded-2 fs-7 fw-semibold text-start w-100 admin-hover-link text-decoration-none"
          style={{ color: '#f87171' }}
        >
          <LogOut size={18} />
          <span>Đăng xuất hệ thống</span>
        </button>
      </div>

      <style>{`
        .admin-active-link {
          background-color: transparent !important;
          color: #fbbf24 !important;
          box-shadow: none;
        }
        .admin-hover-link:hover {
          background-color: transparent !important;
          color: #ffffff !important;
        }
      `}</style>
    </aside>
  );
}
