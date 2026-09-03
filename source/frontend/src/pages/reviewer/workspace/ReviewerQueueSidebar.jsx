import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';

export default function ReviewerQueueSidebar({ selectedCode = "REG-2026-00156", onSelectRegistration }) {
  const [searchTerm, setSearchTerm] = useState('');

  const queueItems = [
    {
      id: 1,
      code: "REG-2026-00156",
      studentName: "Nguyễn Văn An",
      studentCode: "2021001234",
      submittedDate: "03/09/2026 10:30",
      status: "CHỜ XÉT DUYỆT",
      statusType: "warning"
    },
    {
      id: 2,
      code: "REG-2026-00155",
      studentName: "Trần Thị Bình",
      studentCode: "2021001235",
      submittedDate: "03/09/2026 09:15",
      status: "CHỜ XÉT DUYỆT",
      statusType: "warning"
    },
    {
      id: 3,
      code: "REG-2026-00154",
      studentName: "Lê Văn Cường",
      studentCode: "2021001236",
      submittedDate: "02/09/2026 16:45",
      status: "YÊU CẦU BỔ SUNG",
      statusType: "info"
    },
    {
      id: 4,
      code: "REG-2026-00153",
      studentName: "Phạm Thị Dung",
      studentCode: "2021001237",
      submittedDate: "02/09/2026 14:20",
      status: "CHỜ XÉT DUYỆT",
      statusType: "warning"
    },
    {
      id: 5,
      code: "REG-2026-00152",
      studentName: "Hoàng Văn Em",
      studentCode: "2021001238",
      submittedDate: "01/09/2026 11:05",
      status: "QUÁ HẠN",
      statusType: "danger"
    }
  ];

  return (
    <div className="app-card-clean p-3 d-flex flex-column h-100" style={{ minHeight: '650px' }}>
      {/* Tiêu đề cột hàng đợi */}
      <div className="text-uppercase fw-bold text-dark fs-7 mb-3" style={{ letterSpacing: '0.04em' }}>
        DANH SÁCH CHỜ XÉT DUYỆT
      </div>

      {/* Ô tìm kiếm & Icon lọc */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0 text-muted p-2">
            <Search size={15} />
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0 fs-8"
            placeholder="Tìm theo MSSV, họ tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-outline-secondary p-2 d-flex align-items-center justify-content-center">
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* Danh sách các thẻ hồ sơ cuộn dọc */}
      <div className="d-flex flex-column gap-2 flex-grow-1 overflow-auto pe-1">
        {queueItems.map((item) => {
          const isSelected = item.code === selectedCode;
          return (
            <div
              key={item.id}
              onClick={() => onSelectRegistration && onSelectRegistration(item)}
              className={`p-3 rounded-3 border cursor-pointer transition position-relative ${
                isSelected ? 'bg-light border-success shadow-xs' : 'bg-white'
              }`}
              style={{ 
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--primary-color) !important' : 'var(--border-color)' 
              }}
            >
              {/* Header card: Mã hồ sơ + Badge trạng thái */}
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fw-bold fs-7" style={{ color: isSelected ? 'var(--primary-color)' : '#334155' }}>
                  {item.code}
                </span>
                {item.statusType === 'warning' && (
                  <span className="badge fw-bold px-2 py-1" style={{ backgroundColor: '#fef3c7', color: '#b45309', fontSize: '0.68rem' }}>
                    {item.status}
                  </span>
                )}
                {item.statusType === 'info' && (
                  <span className="badge fw-bold px-2 py-1" style={{ backgroundColor: '#e0e7ff', color: '#3730a3', fontSize: '0.68rem' }}>
                    {item.status}
                  </span>
                )}
                {item.statusType === 'danger' && (
                  <span className="badge fw-bold px-2 py-1" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '0.68rem' }}>
                    {item.status}
                  </span>
                )}
              </div>

              {/* Tên sinh viên */}
              <div className="d-flex align-items-center justify-content-between">
                <div className={`fw-bold fs-7 ${isSelected ? 'text-success' : 'text-dark'}`} style={{ color: isSelected ? 'var(--primary-color) !important' : undefined }}>
                  {item.studentName}
                </div>
                <ChevronRight size={16} className="text-muted" />
              </div>

              {/* MSSV & Ngày nộp */}
              <div className="text-muted fs-8 mt-1">
                MSSV: {item.studentCode}
              </div>
              <div className="text-muted fs-8">
                Nộp: {item.submittedDate}
              </div>
            </div>
          );
        })}
      </div>

      {/* Phân trang dưới cùng */}
      <div className="pt-3 mt-2 border-top d-flex align-items-center justify-content-center gap-1" style={{ borderColor: 'var(--border-color)' }}>
        <button type="button" className="btn btn-sm btn-outline-secondary p-1">
          <ChevronLeft size={14} />
        </button>
        <button type="button" className="btn btn-sm btn-success fw-bold px-2 py-1" style={{ backgroundColor: 'var(--primary-color)', fontSize: '0.75rem' }}>
          1
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary px-2 py-1" style={{ fontSize: '0.75rem' }}>2</button>
        <button type="button" className="btn btn-sm btn-outline-secondary px-2 py-1" style={{ fontSize: '0.75rem' }}>3</button>
        <span className="text-muted px-1 fs-8">...</span>
        <button type="button" className="btn btn-sm btn-outline-secondary px-2 py-1" style={{ fontSize: '0.75rem' }}>4</button>
        <button type="button" className="btn btn-sm btn-outline-secondary p-1">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
