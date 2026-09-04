import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, ShieldCheck, LogOut } from 'lucide-react';
import authService from '../../api/authService';

export default function StudentNavbar({ studentName = "Nguyễn Văn An", roleName = "Sinh viên", notificationCount = 3 }) {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const displayStudentName = currentUser?.student?.fullName || currentUser?.fullName || studentName;
  const displayRoleName = currentUser?.student?.className
    ? `Lớp ${currentUser.student.className} · ${currentUser.student.studentCode || currentUser.username}`
    : roleName;

  return (
    <header className="sticky-top bg-white border-bottom shadow-xs" style={{ zIndex: 1020, borderColor: 'var(--border-color)' }}>
      <div className="container-fluid px-lg-4 px-3">
        <div className="d-flex align-items-center justify-content-between py-2" style={{ minHeight: '68px' }}>
          
          {/* Logo & Tên Hệ thống */}
          <div 
            className="d-flex align-items-center gap-2 cursor-pointer text-decoration-none" 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/overview')}
          >
            <div 
              className="d-flex align-items-center justify-content-center text-white rounded-2"
              style={{ width: '38px', height: '38px', backgroundColor: 'var(--primary-color)' }}
            >
              <ShieldCheck size={24} />
            </div>
            <div className="lh-sm">
              <div className="fw-bolder fs-6 tracking-wide" style={{ color: 'var(--primary-color)', letterSpacing: '0.04em' }}>
                QL NGOẠI TRÚ
              </div>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                Dành cho sinh viên
              </small>
            </div>
          </div>

          {/* Thanh Menu điều hướng Tabs */}
          <nav className="d-none d-md-flex align-items-center gap-1 gap-lg-3">
            <NavLink 
              to="/overview" 
              className={({ isActive }) => 
                `nav-tab-link px-2 py-3 fw-bold text-decoration-none position-relative ${isActive ? 'active-tab' : 'text-secondary'}`
              }
            >
              TỔNG QUAN
            </NavLink>
            <NavLink 
              to="/registration" 
              className={({ isActive }) => 
                `nav-tab-link px-2 py-3 fw-semibold text-decoration-none position-relative ${isActive ? 'active-tab' : 'text-secondary'}`
              }
            >
              HỒ SƠ NGOẠI TRÚ
            </NavLink>
            <NavLink 
              to="/residence" 
              className={({ isActive }) => 
                `nav-tab-link px-2 py-3 fw-semibold text-decoration-none position-relative ${isActive ? 'active-tab' : 'text-secondary'}`
              }
            >
              NƠI Ở HIỆN TẠI
            </NavLink>
            <NavLink 
              to="/documents" 
              className={({ isActive }) => 
                `nav-tab-link px-2 py-3 fw-semibold text-decoration-none position-relative ${isActive ? 'active-tab' : 'text-secondary'}`
              }
            >
              GIẤY TỜ
            </NavLink>
            <NavLink 
              to="/requests" 
              className={({ isActive }) => 
                `nav-tab-link px-2 py-3 fw-semibold text-decoration-none position-relative ${isActive ? 'active-tab' : 'text-secondary'}`
              }
            >
              YÊU CẦU
            </NavLink>
            <NavLink 
              to="/notifications" 
              className={({ isActive }) => 
                `nav-tab-link px-2 py-3 fw-semibold text-decoration-none position-relative d-inline-flex align-items-center gap-1 ${isActive ? 'active-tab' : 'text-secondary'}`
              }
            >
              THÔNG BÁO
              {notificationCount > 0 && (
                <span 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center text-white" 
                  style={{ width: '18px', height: '18px', fontSize: '0.65rem', backgroundColor: '#d97706', fontWeight: 700 }}
                >
                  {notificationCount}
                </span>
              )}
            </NavLink>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `nav-tab-link px-2 py-3 fw-semibold text-decoration-none position-relative ${isActive ? 'active-tab' : 'text-secondary'}`
              }
            >
              TÀI KHOẢN
            </NavLink>
          </nav>

          {/* Chuông & Thông tin cá nhân sinh viên */}
          <div className="d-flex align-items-center gap-3">
            {/* Chuông thông báo */}
            <button 
              type="button" 
              className="btn btn-link p-1 text-secondary position-relative text-decoration-none"
              onClick={() => navigate('/notifications')}
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                  style={{ fontSize: '0.65rem', backgroundColor: '#f59e0b !important' }}
                >
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Avatar & Tên & Đăng xuất */}
            <div className="d-flex align-items-center gap-2">
              <div 
                className="d-flex align-items-center gap-2 cursor-pointer" 
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/profile')}
                title="Xem hồ sơ cá nhân"
              >
                <div 
                  className="rounded-circle overflow-hidden border d-flex align-items-center justify-content-center bg-light text-primary fw-bold"
                  style={{ width: '38px', height: '38px', borderColor: 'var(--border-color)', fontSize: '0.85rem' }}
                >
                  {displayStudentName ? displayStudentName.split(' ').pop()?.charAt(0) : 'SV'}
                </div>
                <div className="d-none d-sm-block lh-sm text-end">
                  <div className="fw-bold fs-7 text-dark">{displayStudentName}</div>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>{displayRoleName}</small>
                </div>
              </div>

              {/* Nút Đăng xuất */}
              <button
                type="button"
                className="btn btn-sm btn-outline-danger ms-1 d-inline-flex align-items-center gap-1"
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                onClick={() => authService.logout()}
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut size={14} />
                <span className="d-none d-md-inline">Đăng xuất</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Style phụ cho Tab underline */}
      <style>{`
        .nav-tab-link {
          font-size: 0.85rem;
          letter-spacing: 0.03em;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .nav-tab-link:hover {
          color: var(--primary-color) !important;
        }
        .nav-tab-link.active-tab {
          color: var(--primary-color) !important;
          border-bottom-color: var(--primary-color);
        }
      `}</style>
    </header>
  );
}
