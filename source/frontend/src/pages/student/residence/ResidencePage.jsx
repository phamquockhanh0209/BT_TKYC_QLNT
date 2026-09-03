import React from 'react';
import { MapPin, User, Phone, Edit, RefreshCw } from 'lucide-react';
import HouseIllustration from '../../../components/common/HouseIllustration';

export default function ResidencePage() {
  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Thông Tin Nơi Ở Hiện Tại</h2>
          <p className="text-muted mb-0">Chi tiết nhà trọ, chủ nhà và thông tin đăng ký tạm trú</p>
        </div>
        <button className="btn btn-outline-success d-inline-flex align-items-center gap-2">
          <RefreshCw size={16} /> Báo chuyển trọ
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="app-card-clean mb-4">
            <h4 className="fw-bold mb-3">Nhà trọ Minh Anh — Phòng 203</h4>
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="text-muted fs-7">Số nhà / Đường</div>
                <div className="fw-semibold">123 Nguyễn Văn Linh</div>
              </div>
              <div className="col-sm-6">
                <div className="text-muted fs-7">Phường / Xã</div>
                <div className="fw-semibold">Hải Châu 1</div>
              </div>
              <div className="col-sm-6">
                <div className="text-muted fs-7">Quận / Huyện</div>
                <div className="fw-semibold">Hải Châu</div>
              </div>
              <div className="col-sm-6">
                <div className="text-muted fs-7">Tỉnh / Thành phố</div>
                <div className="fw-semibold">Đà Nẵng</div>
              </div>
            </div>
            <hr className="my-3 text-muted opacity-25" />
            <h5 className="fw-bold fs-6 mb-2">Thông tin chủ trọ</h5>
            <p className="mb-1"><strong>Họ và tên:</strong> Nguyễn Văn Minh</p>
            <p className="mb-1"><strong>Số điện thoại:</strong> 09xx xxx xxx</p>
            <p className="mb-0"><strong>Căn cước công dân:</strong> 07908500xxxx</p>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="app-card-clean text-center">
            <h5 className="fw-bold fs-6 mb-3">Hình ảnh mô phỏng nhà</h5>
            <HouseIllustration height="180px" />
          </div>
        </div>
      </div>
    </div>
  );
}
