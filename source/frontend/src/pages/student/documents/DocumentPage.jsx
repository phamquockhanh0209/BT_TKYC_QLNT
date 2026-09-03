import React from 'react';
import { Upload, FileCheck, Eye, Download } from 'lucide-react';

export default function DocumentPage() {
  const documents = [
    { id: 1, name: "Hợp đồng thuê nhà trọ", type: "RENTAL_CONTRACT", status: "APPROVED", updateDate: "16/08/2026" },
    { id: 2, name: "Giấy xác nhận tạm trú (CT07)", type: "RESIDENCE_CONFIRMATION", status: "APPROVED", updateDate: "16/08/2026" },
    { id: 3, name: "CCCD Chủ trọ (2 mặt)", type: "LANDLORD_ID", status: "APPROVED", updateDate: "16/08/2026" },
    { id: 4, name: "Ảnh chụp cổng & số nhà trọ", type: "HOUSE_IMAGE", status: "APPROVED", updateDate: "16/08/2026" },
  ];

  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Giấy Tờ Minh Chứng (4/4)</h2>
          <p className="text-muted mb-0">Hồ sơ giấy tờ pháp lý phục vụ xác minh ngoại trú</p>
        </div>
        <button className="btn btn-success d-inline-flex align-items-center gap-2" style={{ backgroundColor: 'var(--primary-color)' }}>
          <Upload size={18} /> Tải lên tài liệu mới
        </button>
      </div>

      <div className="row g-4">
        {documents.map((doc) => (
          <div key={doc.id} className="col-md-6 col-12">
            <div className="app-card-clean d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="notif-icon-box notif-icon-success">
                  <FileCheck size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{doc.name}</h6>
                  <small className="text-muted">Cập nhật: {doc.updateDate}</small>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge-pill-custom badge-active">{doc.status}</span>
                <button className="btn btn-sm btn-outline-secondary p-1" title="Xem">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
