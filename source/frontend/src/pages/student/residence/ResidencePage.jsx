import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import authService from '../../../api/authService';
import studentService from '../../../api/studentService';
import HouseIllustration from '../../../components/common/HouseIllustration';

export default function ResidencePage() {
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const user = authService.getCurrentUser();
      const code = user?.student?.studentCode || user?.username;
      const student = await studentService.getStudentByCode(code);
      if (!student?.studentId) return;
      const registrations = await studentService.getRegistrationsByStudent(student.studentId);
      const list = Array.isArray(registrations) ? registrations : [];
      setRegistration(
        list.find(item => ['APPROVED', 'ACTIVE', 'UNDER_REVIEW', 'PROCESSING', 'SUBMITTED'].includes(item.status)) ||
        list[0] ||
        null
      );
    };
    load().catch(err => setError(err?.response?.data?.message || 'Không thể tải thông tin nơi ở.')).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container-fluid py-5 text-center text-muted">Đang tải thông tin nơi ở...</div>;
  if (error) return <div className="container-fluid py-2"><div className="alert alert-danger">{error}</div></div>;
  const address = registration?.addresses?.[0];
  const landlord = address?.landlord;
  const houseImageDocument = registration?.documents?.find(document =>
    document.documentType === 'HOUSE_IMAGE' &&
    (['APPROVED', 'VALID'].includes(document.documentStatus) || registration.status === 'APPROVED')
  );
  const houseImageVersion = houseImageDocument?.documentVersions?.[0];
  const houseImagePath = houseImageVersion?.filePath || houseImageDocument?.filePath;
  const houseImageUrl = houseImagePath
    ? (houseImagePath.startsWith('http') ? houseImagePath : `http://localhost:5005${houseImagePath.startsWith('/') ? '' : '/'}${houseImagePath}`)
    : undefined;
  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Thông Tin Nơi Ở Hiện Tại</h2>
          <p className="text-muted mb-0">Chi tiết nhà trọ, chủ nhà và thông tin đăng ký tạm trú</p>
        </div>
        <button className="btn btn-outline-success d-inline-flex align-items-center gap-2" onClick={() => window.location.assign('/registration')}>
          <RefreshCw size={16} /> Báo chuyển trọ
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="app-card-clean mb-4">
            <h4 className="fw-bold mb-3">{address?.addressLine || 'Chưa có nơi ở hiện tại'}</h4>
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="text-muted fs-7">Số nhà / Đường</div>
                <div className="fw-semibold">{address?.addressLine || '—'}</div>
              </div>
              <div className="col-sm-6">
                <div className="text-muted fs-7">Phường / Xã</div>
                <div className="fw-semibold">{address?.ward || '—'}</div>
              </div>
              <div className="col-sm-6">
                <div className="text-muted fs-7">Quận / Huyện</div>
                <div className="fw-semibold">{address?.district || '—'}</div>
              </div>
              <div className="col-sm-6">
                <div className="text-muted fs-7">Tỉnh / Thành phố</div>
                <div className="fw-semibold">{address?.province || '—'}</div>
              </div>
            </div>
            <hr className="my-3 text-muted opacity-25" />
            <h5 className="fw-bold fs-6 mb-2">Thông tin chủ trọ</h5>
            <p className="mb-1"><strong>Họ và tên:</strong> {landlord?.fullName || '—'}</p>
            <p className="mb-1"><strong>Số điện thoại:</strong> {landlord?.phone || '—'}</p>
            <p className="mb-0"><strong>Căn cước công dân:</strong> {landlord?.identityNumber || '—'}</p>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="app-card-clean text-center">
            <h5 className="fw-bold fs-6 mb-3">Ảnh chụp cổng và số nhà trọ</h5>
            <HouseIllustration height="180px" imageUrl={houseImageUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
