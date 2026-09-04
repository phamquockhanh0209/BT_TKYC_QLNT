import React from 'react';
import { MapPin, User, Phone, ShieldCheck, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HouseIllustration from '../../../components/common/HouseIllustration';

export default function CurrentResidenceCard({
  residenceName = "Nhà trọ Minh Anh — Phòng 203",
  address = "123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
  landlordName = "Nguyễn Văn Minh",
  landlordPhone = "09xx xxx xxx",
  status = "ACTIVE",
  contractStartDate = "01/09/2026",
  contractEndDate = "01/09/2027",
  daysRemaining = 286
}) {
  return (
    <div className="app-card-clean mb-4">
      {/* Tiêu đề mục */}
      <div className="text-uppercase fw-bold text-muted mb-2" style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}>
        NƠI Ở HIỆN TẠI
      </div>

      <div className="row align-items-center g-4">
        {/* Cột trái: Thông tin nơi ở */}
        <div className="col-lg-7 col-md-12">
          <h2 className="fw-bold fs-3 mb-3" style={{ color: 'var(--text-dark)' }}>
            {residenceName}
          </h2>

          <div className="d-flex flex-column gap-2 mb-3">
            {/* Địa chỉ */}
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted d-flex align-items-center" style={{ width: '20px' }}>
                <MapPin size={18} />
              </span>
              <span className="text-muted text-nowrap" style={{ width: '130px', fontSize: '0.92rem' }}>
                Địa chỉ
              </span>
              <span className="fw-semibold text-dark fs-7">
                {address}
              </span>
            </div>

            {/* Chủ trọ */}
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted d-flex align-items-center" style={{ width: '20px' }}>
                <User size={18} />
              </span>
              <span className="text-muted text-nowrap" style={{ width: '130px', fontSize: '0.92rem' }}>
                Chủ trọ
              </span>
              <span className="fw-semibold text-dark fs-7">
                {landlordName}
              </span>
            </div>

            {/* Điện thoại */}
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted d-flex align-items-center" style={{ width: '20px' }}>
                <Phone size={18} />
              </span>
              <span className="text-muted text-nowrap" style={{ width: '130px', fontSize: '0.92rem' }}>
                Điện thoại
              </span>
              <span className="fw-semibold text-dark fs-7">
                {landlordPhone}
              </span>
            </div>

            {/* Trạng thái hồ sơ */}
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted d-flex align-items-center" style={{ width: '20px' }}>
                <ShieldCheck size={18} />
              </span>
              <span className="text-muted text-nowrap" style={{ width: '130px', fontSize: '0.92rem' }}>
                Trạng thái hồ sơ
              </span>
              <span>
                <span className={`badge-pill-custom ${['APPROVED', 'ACTIVE'].includes(status) ? 'badge-active' : status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'}`}>
                  {status === 'SUBMITTED' ? 'CHỜ XÁC NHẬN' : status === 'PROCESSING' ? 'ĐANG XỬ LÝ' : status === 'APPROVED' ? 'ĐÃ DUYỆT' : status === 'ACTIVE' ? 'ĐANG HOẠT ĐỘNG' : status}
                </span>
              </span>
            </div>

            {/* Thời hạn hợp đồng */}
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted d-flex align-items-center" style={{ width: '20px' }}>
                <Calendar size={18} />
              </span>
              <span className="text-muted text-nowrap" style={{ width: '130px', fontSize: '0.92rem' }}>
                Thời hạn hợp đồng
              </span>
              <span className="fw-semibold text-dark fs-7">
                {contractStartDate} – {contractEndDate} 
                <span className="mx-2">•</span>
                <span style={{ color: '#d97706', fontWeight: 600 }}>Còn {daysRemaining} ngày</span>
              </span>
            </div>
          </div>

          {/* Link Xem chi tiết nơi ở */}
          <div className="pt-2">
            <Link to="/residence" className="link-action">
              Xem chi tiết nơi ở <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Cột phải: Bản vẽ kiến trúc nhà trọ */}
        <div className="col-lg-5 col-md-12 text-center">
          <div className="p-2 rounded-3 bg-light border border-light">
            <HouseIllustration height="190px" />
          </div>
        </div>
      </div>
    </div>
  );
}
