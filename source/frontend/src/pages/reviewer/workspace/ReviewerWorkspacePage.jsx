import React, { useState } from 'react';
import { FileText, Files, History, RefreshCw } from 'lucide-react';
import ReviewerQueueSidebar from './ReviewerQueueSidebar';
import DossierDetailCard from './DossierDetailCard';
import DossierResidenceInfo from './DossierResidenceInfo';
import DossierDocumentsTab from './DossierDocumentsTab';
import DossierHistoryTab from './DossierHistoryTab';
import ReviewerTimelineWidget from './ReviewerTimelineWidget';
import ReviewerGuideWidget from './ReviewerGuideWidget';
import ReviewerActionButtons from './ReviewerActionButtons';

/**
 * Trang Không gian xét duyệt hồ sơ dành cho Reviewer (Review Workspace)
 * Bố cục 3 Cột: Hàng đợi bên trái (2.8) - Không gian soi hồ sơ ở giữa (6.2) - Hành động & Tiến trình bên phải (3)
 */
export default function ReviewerWorkspacePage() {
  const [selectedReg, setSelectedReg] = useState({
    code: "REG-2026-00156",
    studentName: "Nguyễn Văn An",
    studentCode: "2021001234",
    faculty: "Công nghệ thông tin",
    className: "20CNTT01",
    phone: "09xx xxx xxx",
    email: "nguyenvanan@gmail.com",
    submittedDate: "03/09/2026 10:30",
    status: "CHỜ XÉT DUYỆT"
  });

  const [activeTab, setActiveTab] = useState('INFO'); // 'INFO' | 'DOCS' | 'HISTORY' | 'REQUESTS'

  const handleSelectRegistration = (item) => {
    setSelectedReg({
      ...selectedReg,
      code: item.code,
      studentName: item.studentName,
      studentCode: item.studentCode,
      status: item.status,
      submittedDate: item.submittedDate
    });
  };

  const handleApprove = () => {
    alert(`[Reviewer] Đã phê duyệt chính thức hồ sơ ${selectedReg.code}! Hồ sơ chuyển sang trạng thái ACTIVE.`);
  };

  const handleRequestInfo = () => {
    const reason = prompt(`Nhập lý do yêu cầu sinh viên ${selectedReg.studentName} bổ sung giấy tờ:`);
    if (reason) {
      alert(`Đã gửi yêu cầu bổ sung cho ${selectedReg.code}: "${reason}"`);
    }
  };

  const handleReject = () => {
    const reason = prompt(`Nhập lý do từ chối hồ sơ ${selectedReg.code}:`);
    if (reason) {
      alert(`Đã từ chối hồ sơ ${selectedReg.code}. Lý do: "${reason}"`);
    }
  };

  const handleAddNote = () => {
    const note = prompt(`Nhập ghi chú nội bộ cho hồ sơ ${selectedReg.code}:`);
    if (note) {
      alert(`Đã lưu ghi chú cho hồ sơ: "${note}"`);
    }
  };

  return (
    <div className="reviewer-workspace-wrapper">
      <div className="row g-3">
        {/* === CỘT 1 (Trái): Danh sách chờ xét duyệt === */}
        <div className="col-xl-3 col-lg-4 col-12">
          <ReviewerQueueSidebar 
            selectedCode={selectedReg.code}
            onSelectRegistration={handleSelectRegistration}
          />
        </div>

        {/* === CỘT 2 (Giữa): Bàn soi chi tiết hồ sơ & Giấy tờ === */}
        <div className="col-xl-6 col-lg-8 col-12">
          {/* Thông tin sinh viên & Thông tin hồ sơ */}
          <DossierDetailCard 
            code={selectedReg.code}
            studentName={selectedReg.studentName}
            studentCode={selectedReg.studentCode}
            faculty={selectedReg.faculty}
            className={selectedReg.className}
            phone={selectedReg.phone}
            email={selectedReg.email}
            submittedDate={selectedReg.submittedDate}
            status={selectedReg.status}
          />

          {/* 4 Tabs làm việc */}
          <div className="d-flex align-items-center gap-1 border-bottom mb-3" style={{ borderColor: 'var(--border-color)' }}>
            <button
              type="button"
              onClick={() => setActiveTab('INFO')}
              className={`btn btn-link text-decoration-none py-2 px-3 fw-bold fs-7 d-inline-flex align-items-center gap-2 ${
                activeTab === 'INFO' ? 'text-success border-bottom border-2 border-success' : 'text-secondary'
              }`}
              style={{ color: activeTab === 'INFO' ? 'var(--primary-color) !important' : undefined }}
            >
              <FileText size={16} /> Thông tin hồ sơ
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('DOCS')}
              className={`btn btn-link text-decoration-none py-2 px-3 fw-bold fs-7 d-inline-flex align-items-center gap-2 ${
                activeTab === 'DOCS' ? 'text-success border-bottom border-2 border-success' : 'text-secondary'
              }`}
              style={{ color: activeTab === 'DOCS' ? 'var(--primary-color) !important' : undefined }}
            >
              <Files size={16} /> Giấy tờ đính kèm
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('HISTORY')}
              className={`btn btn-link text-decoration-none py-2 px-3 fw-bold fs-7 d-inline-flex align-items-center gap-2 ${
                activeTab === 'HISTORY' ? 'text-success border-bottom border-2 border-success' : 'text-secondary'
              }`}
              style={{ color: activeTab === 'HISTORY' ? 'var(--primary-color) !important' : undefined }}
            >
              <History size={16} /> Lịch sử xử lý
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('REQUESTS')}
              className={`btn btn-link text-decoration-none py-2 px-3 fw-bold fs-7 d-inline-flex align-items-center gap-2 ${
                activeTab === 'REQUESTS' ? 'text-success border-bottom border-2 border-success' : 'text-secondary'
              }`}
              style={{ color: activeTab === 'REQUESTS' ? 'var(--primary-color) !important' : undefined }}
            >
              <RefreshCw size={16} /> Yêu cầu bổ sung
            </button>
          </div>

          {/* Nội dung theo Tab đang chọn */}
          {activeTab === 'INFO' && <DossierResidenceInfo />}
          {activeTab === 'DOCS' && <DossierDocumentsTab />}
          {activeTab === 'HISTORY' && <DossierHistoryTab />}
          {activeTab === 'REQUESTS' && (
            <div className="app-card-clean p-4 text-center text-muted fs-7">
              Chưa có yêu cầu bổ sung nào được tạo cho đợt xét duyệt này.
            </div>
          )}
        </div>

        {/* === CỘT 3 (Phải): Tiến trình + Tài liệu hướng dẫn + Quyết định xét duyệt === */}
        <div className="col-xl-3 col-lg-12 col-12">
          {/* 1. Tiến trình xử lý (Vertical Stepper) */}
          <ReviewerTimelineWidget />

          {/* 2. Tài liệu hướng dẫn (PDF) */}
          <ReviewerGuideWidget />

          {/* 3. Khối Nút Hành Động Quyết Định */}
          <ReviewerActionButtons 
            onApprove={handleApprove}
            onRequestInfo={handleRequestInfo}
            onReject={handleReject}
            onAddNote={handleAddNote}
          />
        </div>
      </div>
    </div>
  );
}
