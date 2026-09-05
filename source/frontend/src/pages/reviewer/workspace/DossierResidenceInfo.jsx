import React from 'react';
import { 
  MapPin, 
  Compass, 
  Building2, 
  Home, 
  DoorClosed, 
  User, 
  Phone, 
  CreditCard, 
  Calendar, 
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function DossierResidenceInfo({ registration = null }) {
  const address = registration?.addresses?.[0];
  const landlord = address?.landlord;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const calcDuration = (start, end) => {
    if (!start || !end) return '—';
    const diff = new Date(end) - new Date(start);
    const months = Math.round(diff / (1000 * 60 * 60 * 24 * 30));
    return `${months} tháng (${Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))} ngày)`;
  };

  const addressLine = address?.addressLine || 'Chưa cập nhật';
  const ward = address?.ward || '—';
  const district = address?.district || '—';
  const province = address?.province || '—';

  return (
    <div className="d-flex flex-column gap-3">
      {/* 1. THÔNG TIN NƠI Ở */}
      <div className="app-card-clean p-3">
        <div className="text-uppercase fw-bold text-muted fs-8 mb-3" style={{ letterSpacing: '0.04em' }}>
          THÔNG TIN NƠI Ở NGOẠI TRÚ
        </div>

        <div className="row g-3 fs-7">
          <div className="col-md-6 col-12">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <MapPin size={14} /> Số nhà / Tên đường
            </div>
            <div className="fw-semibold text-dark mt-1">{addressLine}</div>
          </div>
          <div className="col-md-3 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Compass size={14} /> Phường / Xã
            </div>
            <div className="fw-semibold text-dark mt-1">{ward}</div>
          </div>
          <div className="col-md-3 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Compass size={14} /> Quận / Huyện
            </div>
            <div className="fw-semibold text-dark mt-1">{district}</div>
          </div>

          <div className="col-md-4 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Building2 size={14} /> Tỉnh / Thành phố
            </div>
            <div className="fw-semibold text-dark mt-1">{province}</div>
          </div>
          <div className="col-md-4 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Home size={14} /> Loại cư trú
            </div>
            <div className="fw-semibold text-dark mt-1">{address?.addressType || 'Tạm trú ngoại trú'}</div>
          </div>
          <div className="col-md-4 col-12">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <DoorClosed size={14} /> Ghi chú phòng
            </div>
            <div className="fw-semibold text-dark mt-1">{landlord?.note || '—'}</div>
          </div>
        </div>
      </div>

      {/* 2. THÔNG TIN CHỦ TRỌ */}
      <div className="app-card-clean p-3">
        <div className="text-uppercase fw-bold text-muted fs-8 mb-3" style={{ letterSpacing: '0.04em' }}>
          THÔNG TIN CHỦ TRỌ
        </div>

        <div className="row g-3 fs-7">
          <div className="col-md-4 col-12">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <User size={14} /> Họ và tên chủ trọ
            </div>
            <div className="fw-semibold text-dark mt-1">{landlord?.fullName || 'Chưa cập nhật'}</div>
          </div>
          <div className="col-md-4 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Phone size={14} /> Số điện thoại
            </div>
            <div className="fw-semibold text-dark mt-1">{landlord?.phone || '—'}</div>
          </div>
          <div className="col-md-4 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <CreditCard size={14} /> Số CCCD / CMND
            </div>
            <div className="fw-semibold text-dark mt-1">{landlord?.identityNumber || '—'}</div>
          </div>
        </div>
      </div>

      {/* 3. THỜI GIAN THUÊ */}
      <div className="app-card-clean p-3">
        <div className="text-uppercase fw-bold text-muted fs-8 mb-3" style={{ letterSpacing: '0.04em' }}>
          THỜI HẠN THUÊ TRỌ
        </div>

        <div className="row g-3 fs-7">
          <div className="col-md-4 col-12">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Calendar size={14} /> Ngày bắt đầu
            </div>
            <div className="fw-semibold text-dark mt-1">{formatDate(registration?.startDate)}</div>
          </div>
          <div className="col-md-4 col-12">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Calendar size={14} /> Ngày kết thúc
            </div>
            <div className="fw-semibold text-dark mt-1">{formatDate(registration?.expiryDate)}</div>
          </div>
          <div className="col-md-4 col-12">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Clock size={14} /> Tổng thời hạn
            </div>
            <div className="fw-semibold text-dark mt-1">{calcDuration(registration?.startDate, registration?.expiryDate)}</div>
          </div>
        </div>
      </div>

      {/* 4. LÝ DO TỪ CHỐI / YÊU CẦU BỔ SUNG (NẾU CÓ) */}
      {registration?.rejectionReason && (
        <div className="p-3 rounded-3 border" style={{ backgroundColor: '#fffbf0', borderColor: '#fef3c7' }}>
          <div className="text-uppercase fw-bold fs-8 mb-2 d-flex align-items-center gap-1" style={{ color: '#92400e', letterSpacing: '0.04em' }}>
            <AlertTriangle size={15} /> GHI CHÚ XÉT DUYỆT / LÝ DO TỪ CHỐI
          </div>
          <p className="mb-0 text-dark fs-7 lh-sm">
            "{registration.rejectionReason}"
          </p>
        </div>
      )}
    </div>
  );
}

