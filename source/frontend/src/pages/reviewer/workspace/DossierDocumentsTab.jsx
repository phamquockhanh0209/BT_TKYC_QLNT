import React, { useState } from 'react';
import { FileCheck2, Eye, Download, CheckCircle2, AlertTriangle, Clock, FileX, X } from 'lucide-react';
import reviewerService from '../../../api/reviewerService';

const REQUIRED_DOCS = [
  { type: 'RENTAL_CONTRACT', title: 'Hợp đồng thuê nhà trọ (Có chữ ký 2 bên)' },
  { type: 'RESIDENCE_CONFIRMATION', title: 'Giấy xác nhận thông tin cư trú (Mẫu CT07)' },
  { type: 'LANDLORD_ID', title: 'Căn cước công dân Chủ trọ (Mặt trước & Mặt sau)' },
  { type: 'HOUSE_IMAGE', title: 'Ảnh chụp số nhà và không gian phòng trọ' },
];

export default function DossierDocumentsTab({ documents = [], onDocumentVerified }) {
  const [previewFile, setPreviewFile] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);

  const API_URL = 'http://localhost:5005';

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const getDocStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'VALID':
        return (
          <span className="badge bg-success px-2 py-1 fs-8 d-inline-flex align-items-center gap-1">
            <CheckCircle2 size={12} /> Hợp lệ
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge bg-danger px-2 py-1 fs-8 d-inline-flex align-items-center gap-1">
            <AlertTriangle size={12} /> Cần nộp lại
          </span>
        );
      default:
        return (
          <span className="badge px-2 py-1 fs-8 d-inline-flex align-items-center gap-1" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            <Clock size={12} /> Chờ kiểm tra
          </span>
        );
    }
  };

  const handleOpenPreview = (fileUrl, title) => {
    if (!fileUrl) return;
    const fullUrl = `${API_URL}/${fileUrl.replace(/^\//, '')}`;
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileUrl);
    const isPdf = /\.pdf$/i.test(fileUrl);

    if (isImage || isPdf) {
      setPreviewFile({ url: fullUrl, title, isImage, isPdf });
    } else {
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleVerify = async (document, status) => {
    if (!document?.documentId) return;
    try {
      setVerifyingId(document.documentId);
      await reviewerService.verifyDocument(document.documentId, status);
      onDocumentVerified?.();
    } catch (error) {
      alert(error?.response?.data?.message || 'Không thể cập nhật trạng thái tài liệu.');
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      {REQUIRED_DOCS.map((spec, index) => {
        const doc = documents.find(d => d.documentType === spec.type);
        const version = doc?.documentVersions?.find(item => item.isCurrent) || doc?.documentVersions?.[0];
        const isUploaded = Boolean(version?.filePath);
        const uploadDate = version?.uploadedAt || doc?.createdAt;

        return (
          <div key={spec.type} className="app-card-clean p-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div 
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundColor: isUploaded ? '#e6f4ea' : '#f1f5f9', 
                  color: isUploaded ? '#137333' : '#64748b' 
                }}
              >
                {isUploaded ? <FileCheck2 size={22} /> : <FileX size={22} />}
              </div>
              <div>
                <div className="fw-bold fs-7 text-dark">{spec.title}</div>
                <small className="text-muted fs-8">
                  {isUploaded ? (
                    <>Tệp: <strong>{version.fileName}</strong> • Nộp: {formatDate(uploadDate)}</>
                  ) : (
                    <span className="text-warning">Chưa nộp tài liệu này</span>
                  )}
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {isUploaded ? (
                <>
                  {getDocStatusBadge(doc?.documentStatus)}
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-primary p-1 px-2 d-inline-flex align-items-center gap-1 fs-8" 
                    title="Xem trước tài liệu"
                    onClick={() => handleOpenPreview(version.filePath, spec.title)}
                  >
                    <Eye size={15} /> Xem
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success p-1 px-2 fs-8"
                    onClick={() => handleVerify(doc, 'VALID')}
                    disabled={verifyingId === doc.documentId}
                  >
                    Hợp lệ
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger p-1 px-2 fs-8"
                    onClick={() => handleVerify(doc, 'REJECTED')}
                    disabled={verifyingId === doc.documentId}
                  >
                    Nộp lại
                  </button>
                  <a
                    href={`${API_URL}/${version.filePath.replace(/^\//, '')}`}
                    download={version.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-secondary p-1"
                    title="Tải xuống tệp gốc"
                  >
                    <Download size={15} />
                  </a>
                </>
              ) : (
                <span className="badge bg-light text-muted border px-2 py-1 fs-8">
                  Thiếu
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Modal Preview ảnh / PDF */}
      {previewFile && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: '850px' }}>
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title fw-bold text-truncate">{previewFile.title}</h6>
                <button type="button" className="btn-close" onClick={() => setPreviewFile(null)}></button>
              </div>
              <div className="modal-body p-2 text-center" style={{ maxHeight: '75vh', overflow: 'auto' }}>
                {previewFile.isImage && (
                  <img
                    src={previewFile.url}
                    alt={previewFile.title}
                    className="img-fluid rounded border"
                    style={{ maxHeight: '70vh', objectFit: 'contain' }}
                  />
                )}
                {previewFile.isPdf && (
                  <iframe
                    src={previewFile.url}
                    title={previewFile.title}
                    style={{ width: '100%', height: '65vh', border: 'none' }}
                  />
                )}
              </div>
              <div className="modal-footer py-1">
                <a
                  href={previewFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary"
                >
                  Mở trong tab mới
                </a>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setPreviewFile(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

