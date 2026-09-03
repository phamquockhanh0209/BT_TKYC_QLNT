import React from 'react';
import { User, Mail, Phone, BookOpen, Key, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Tài Khoản Sinh Viên</h2>
        <p className="text-muted mb-0">Thông tin cá nhân từ hệ thống đào tạo SIS & cài đặt tài khoản</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4 col-12">
          <div className="app-card-clean text-center p-4">
            <div className="rounded-circle overflow-hidden mx-auto mb-3 border" style={{ width: '90px', height: '90px' }}>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h4 className="fw-bold mb-1">Nguyễn Văn An</h4>
            <p className="text-muted mb-3">MSSV: 2021001234</p>
            <span className="badge-pill-custom badge-active">SINH VIÊN ĐANG THEO HỌC</span>

            <hr className="my-4" />
            <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-inline-flex align-items-center justify-content-center gap-2">
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>
        </div>

        <div className="col-lg-8 col-12">
          <div className="app-card-clean mb-4">
            <h5 className="fw-bold mb-3">Thông Tin Học Vụ (Đồng bộ từ SIS)</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="text-muted fs-7">Họ và tên</div>
                <div className="fw-semibold">Nguyễn Văn An</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted fs-7">Mã số sinh viên</div>
                <div className="fw-semibold">2021001234</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted fs-7">Khoa đào tạo</div>
                <div className="fw-semibold">Công nghệ Thông tin</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted fs-7">Lớp chuyên ngành</div>
                <div className="fw-semibold">D21CNTT01</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted fs-7">Email sinh viên</div>
                <div className="fw-semibold">an.nguyen@student.edu.vn</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted fs-7">Số điện thoại liên hệ</div>
                <div className="fw-semibold">0901234001</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
