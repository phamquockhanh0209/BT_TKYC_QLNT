import React, { useEffect, useState } from 'react';
import { Camera, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../api/authService';
import studentService from '../../../api/studentService';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAvatarChange = async event => {
    const file = event.target.files?.[0];
    if (!file || !student) return;
    setUploading(true);
    setError('');
    try {
      const updatedStudent = await studentService.uploadAvatar(student.studentId, file);
      setStudent(updatedStudent);
    } catch (uploadError) {
      setError(uploadError?.response?.data?.message || 'Không thể tải ảnh đại diện lên.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    studentService.getStudentByCode(user?.student?.studentCode || user?.username)
      .then(setStudent)
      .catch(err => setError(err?.response?.data?.message || 'Không thể tải hồ sơ sinh viên.'));
  }, []);

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
              {student?.avatarPath ? <img
                src={`http://localhost:5005${student.avatarPath}`}
                alt="Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              /> : <span className="fw-bold text-primary">{student?.fullName?.split(' ').pop()?.charAt(0) || 'SV'}</span>}
            </div>
            <label className="btn btn-sm d-inline-flex align-items-center gap-2 mb-2" style={{ color: '#0f172a', borderColor: '#0f172a' }}>
              <Camera size={15} /> {uploading ? 'Đang tải ảnh...' : 'Đổi ảnh đại diện'}
              <input type="file" hidden accept=".jpg,.jpeg,.png,.webp" onChange={handleAvatarChange} disabled={uploading} />
            </label>
            <h4 className="fw-bold mb-1">{student?.fullName || 'Đang tải...'}</h4>
            <p className="text-muted mb-3">MSSV: {student?.studentCode || '—'}</p>
            <span className="badge-pill-custom badge-active">SINH VIÊN ĐANG THEO HỌC</span>

            <hr className="my-4" />
            <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-inline-flex align-items-center justify-content-center gap-2">
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>
        </div>

        <div className="col-lg-8 col-12">
          <div className="app-card-clean mb-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <h5 className="fw-bold mb-3">Thông Tin Học Vụ (Đồng bộ từ Database)</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="text-muted fs-7">Họ và tên</div>
                <div className="fw-semibold">{student?.fullName || '—'}</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted fs-7">Mã số sinh viên</div>
                <div className="fw-semibold">{student?.studentCode || '—'}</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted fs-7">Khoa đào tạo</div>
                <div className="fw-semibold">{student?.faculty || '—'}</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted fs-7">Lớp chuyên ngành</div>
                <div className="fw-semibold">{student?.className || '—'}</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted fs-7">Email sinh viên</div>
                <div className="fw-semibold">{student?.email || '—'}</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted fs-7">Số điện thoại liên hệ</div>
                <div className="fw-semibold">{student?.phone || '—'}</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted fs-7">Ngày sinh</div>
                <div className="fw-semibold">{student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('vi-VN') : '—'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
