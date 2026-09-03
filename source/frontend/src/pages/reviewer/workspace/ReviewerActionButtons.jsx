import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, MessageSquare } from 'lucide-react';

export default function ReviewerActionButtons({ onApprove, onRequestInfo, onReject, onAddNote }) {
  return (
    <div className="app-card-clean p-3">
      {/* Tiêu đề mục */}
      <div className="text-uppercase fw-bold text-muted fs-8 mb-3" style={{ letterSpacing: '0.04em' }}>
        HÀNH ĐỘNG
      </div>

      <div className="d-flex flex-column gap-2">
        {/* Nút 1: Phê duyệt hồ sơ */}
        <button
          type="button"
          onClick={onApprove}
          className="btn text-white fw-bold py-2 d-flex align-items-center justify-content-center gap-2 shadow-xs"
          style={{ backgroundColor: 'var(--primary-color)', fontSize: '0.88rem' }}
        >
          <CheckCircle2 size={18} /> Phê duyệt hồ sơ
        </button>

        {/* Nút 2: Yêu cầu bổ sung */}
        <button
          type="button"
          onClick={onRequestInfo}
          className="btn text-white fw-bold py-2 d-flex align-items-center justify-content-center gap-2"
          style={{ backgroundColor: '#d97706', fontSize: '0.88rem' }}
        >
          <AlertCircle size={18} /> Yêu cầu bổ sung
        </button>

        {/* Nút 3: Từ chối hồ sơ */}
        <button
          type="button"
          onClick={onReject}
          className="btn text-white fw-bold py-2 d-flex align-items-center justify-content-center gap-2"
          style={{ backgroundColor: '#dc2626', fontSize: '0.88rem' }}
        >
          <XCircle size={18} /> Từ chối hồ sơ
        </button>

        {/* Nút 4: Gửi ghi chú */}
        <button
          type="button"
          onClick={onAddNote}
          className="btn btn-outline-secondary py-2 d-flex align-items-center justify-content-center gap-2 fs-7 fw-semibold"
        >
          <MessageSquare size={16} /> Gửi ghi chú
        </button>
      </div>
    </div>
  );
}
