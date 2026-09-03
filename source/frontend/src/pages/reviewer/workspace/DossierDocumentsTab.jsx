import React from 'react';
import { FileCheck2, Eye, Download, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function DossierDocumentsTab() {
  const docs = [
    {
      id: 1,
      title: "Hợp đồng thuê nhà trọ (Có chữ ký 2 bên)",
      type: "RENTAL_CONTRACT",
      status: "Hợp lệ",
      uploadDate: "03/09/2026 10:25",
      size: "2.4 MB"
    },
    {
      id: 2,
      title: "Giấy xác nhận thông tin cư trú (Mẫu CT07)",
      type: "RESIDENCE_CONFIRMATION",
      status: "Hợp lệ",
      uploadDate: "03/09/2026 10:28",
      size: "1.1 MB"
    },
    {
      id: 3,
      title: "Căn cước công dân Chủ trọ (Mặt trước & Mặt sau)",
      type: "LANDLORD_ID",
      status: "Hợp lệ",
      uploadDate: "03/09/2026 10:29",
      size: "3.5 MB"
    },
    {
      id: 4,
      title: "Ảnh chụp số nhà và không gian phòng trọ",
      type: "HOUSE_IMAGE",
      status: "Hợp lệ",
      uploadDate: "03/09/2026 10:30",
      size: "4.2 MB"
    }
  ];

  return (
    <div className="d-flex flex-column gap-3">
      {docs.map((doc) => (
        <div key={doc.id} className="app-card-clean p-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{ width: '40px', height: '40px', backgroundColor: '#e6f4ea', color: '#137333' }}
            >
              <FileCheck2 size={22} />
            </div>
            <div>
              <div className="fw-bold fs-7 text-dark">{doc.title}</div>
              <small className="text-muted fs-8">
                Tải lên: {doc.uploadDate} • {doc.size}
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success px-2 py-1 fs-8 d-inline-flex align-items-center gap-1">
              <CheckCircle2 size={12} /> {doc.status}
            </span>
            <button type="button" className="btn btn-sm btn-outline-secondary p-1" title="Xem tài liệu">
              <Eye size={16} />
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary p-1" title="Tải xuống">
              <Download size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
