import React from 'react';
import { 
  MapPin, 
  Compass, 
  Building2, 
  Home, 
  DoorClosed, 
  Maximize2, 
  Users, 
  User, 
  Phone, 
  CreditCard, 
  Shield, 
  Calendar, 
  Clock 
} from 'lucide-react';

export default function DossierResidenceInfo({
  address = "123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
  district = "Hải Châu",
  province = "Đà Nẵng",
  residenceType = "Nhà trọ",
  roomNumber = "Phòng 203",
  area = "25",
  occupants = "2",
  landlordName = "Nguyễn Văn Minh",
  landlordPhone = "09xx xxx xxx",
  landlordId = "201234567890",
  landlordRelation = "Chủ nhà trọ",
  startDate = "01/09/2026",
  endDate = "01/09/2027",
  duration = "12 tháng",
  officerNote = "Hồ sơ đã được kiểm tra bước đầu. Sinh viên cung cấp đầy đủ giấy tờ cơ bản.",
  officerAuthor = "Nguyễn Văn Cán Bộ (03/09/2026 11:15)"
}) {
  return (
    <div className="d-flex flex-column gap-4">
      {/* 1. THÔNG TIN NƠI Ở */}
      <div className="app-card-clean p-3">
        <div className="text-uppercase fw-bold text-muted fs-8 mb-3" style={{ letterSpacing: '0.04em' }}>
          THÔNG TIN NƠI Ở
        </div>

        <div className="row g-3 fs-7">
          <div className="col-md-5 col-12">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <MapPin size={14} /> Địa chỉ
            </div>
            <div className="fw-semibold text-dark mt-1">{address}</div>
          </div>
          <div className="col-md-3 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Compass size={14} /> Quận/Huyện
            </div>
            <div className="fw-semibold text-dark mt-1">{district}</div>
          </div>
          <div className="col-md-4 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Building2 size={14} /> Thành phố
            </div>
            <div className="fw-semibold text-dark mt-1">{province}</div>
          </div>

          <div className="col-md-3 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Home size={14} /> Loại hình
            </div>
            <div className="fw-semibold text-dark mt-1">{residenceType}</div>
          </div>
          <div className="col-md-3 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <DoorClosed size={14} /> Phòng/Phòng trọ
            </div>
            <div className="fw-semibold text-dark mt-1">{roomNumber}</div>
          </div>
          <div className="col-md-3 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Maximize2 size={14} /> Diện tích (m²)
            </div>
            <div className="fw-semibold text-dark mt-1">{area}</div>
          </div>
          <div className="col-md-3 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Users size={14} /> Số người ở
            </div>
            <div className="fw-semibold text-dark mt-1">{occupants}</div>
          </div>
        </div>
      </div>

      {/* 2. THÔNG TIN CHỦ TRỌ */}
      <div className="app-card-clean p-3">
        <div className="text-uppercase fw-bold text-muted fs-8 mb-3" style={{ letterSpacing: '0.04em' }}>
          THÔNG TIN CHỦ TRỌ
        </div>

        <div className="row g-3 fs-7">
          <div className="col-md-3 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <User size={14} /> Họ tên
            </div>
            <div className="fw-semibold text-dark mt-1">{landlordName}</div>
          </div>
          <div className="col-md-3 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Phone size={14} /> SĐT
            </div>
            <div className="fw-semibold text-dark mt-1">{landlordPhone}</div>
          </div>
          <div className="col-md-3 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <CreditCard size={14} /> CMND/CCCD
            </div>
            <div className="fw-semibold text-dark mt-1">{landlordId}</div>
          </div>
          <div className="col-md-3 col-6">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Shield size={14} /> Quan hệ
            </div>
            <div className="fw-semibold text-dark mt-1">{landlordRelation}</div>
          </div>
        </div>
      </div>

      {/* 3. THỜI GIAN THUÊ */}
      <div className="app-card-clean p-3">
        <div className="text-uppercase fw-bold text-muted fs-8 mb-3" style={{ letterSpacing: '0.04em' }}>
          THỜI GIAN THUÊ
        </div>

        <div className="row g-3 fs-7">
          <div className="col-md-4 col-12">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Calendar size={14} /> Ngày bắt đầu
            </div>
            <div className="fw-semibold text-dark mt-1">{startDate}</div>
          </div>
          <div className="col-md-4 col-12">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Calendar size={14} /> Ngày kết thúc
            </div>
            <div className="fw-semibold text-dark mt-1">{endDate}</div>
          </div>
          <div className="col-md-4 col-12">
            <div className="text-muted fs-8 d-flex align-items-center gap-1">
              <Clock size={14} /> Thời hạn
            </div>
            <div className="fw-semibold text-dark mt-1">{duration}</div>
          </div>
        </div>
      </div>

      {/* 4. GHI CHÚ CỦA CÁN BỘ TIẾP NHẬN */}
      <div className="p-3 rounded-3 border" style={{ backgroundColor: '#fffbf0', borderColor: '#fef3c7' }}>
        <div className="text-uppercase fw-bold fs-8 mb-2" style={{ color: '#92400e', letterSpacing: '0.04em' }}>
          GHI CHÚ CỦA CÁN BỘ TIẾP NHẬN
        </div>
        <p className="mb-2 text-dark fs-7 lh-sm">
          {officerNote}
        </p>
        <small className="text-muted fs-8">
          - {officerAuthor}
        </small>
      </div>
    </div>
  );
}
