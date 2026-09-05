import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CheckCircle2, AlertCircle, XCircle, FileText, User, MapPin, Eye, ExternalLink } from 'lucide-react';

const DOC_TYPES = {
  RENTAL_CONTRACT: '1. Hợp đồng thuê nhà (Có chữ ký 2 bên)',
  RESIDENCE_CONFIRMATION: '2. Giấy xác nhận tạm trú CT07',
  LANDLORD_ID: '3. Căn cước công dân Chủ trọ',
  HOUSE_IMAGE: '4. Ảnh chụp cổng / số nhà nơi ở ngoại trú'
};

const STATUS_LABELS = {
  SUBMITTED: 'CHỜ XỬ LÝ',
  UNDER_REVIEW: 'ĐANG XÉT DUYỆT',
  PROCESSING: 'ĐANG XỬ LÝ',
  APPROVED: 'ĐÃ DUYỆT',
  ACTIVE: 'ĐANG HIỆU LỰC',
  REJECTED: 'BỔ SUNG / TỪ CHỐI',
  DRAFT: 'BẢN NHÁP',
};

export default function ProcessRegistrationModal({ 
  show, 
  onHide, 
  registration, 
  onApprove, 
  onRequestInfo, 
  onReject,
  submitting = false
}) {
  const [note, setNote] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  if (!registration) return null;

  const student = registration.student || {};
  const address = registration.addresses?.[0] || {};
  const landlord = address.landlord || {};
  const documents = registration.documents || [];

  const handlePreview = (doc) => {
    const version = doc.documentVersions?.[0];
    const path = version?.filePath || doc.filePath;
    if (path) {
      const fullUrl = path.startsWith('http') ? path : `http://localhost:5005${path.startsWith('/') ? '' : '/'}${path}`;
      setPreviewDoc({ url: fullUrl, name: version?.fileName || doc.documentType });
    } else {
      alert('Tài liệu chưa có tệp đính kèm khả dụng.');
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold fs-5">
            Xử lý & Phê duyệt cấp trường: <span style={{ color: 'var(--primary-color)' }}>{registration.registrationCode || `#${registration.registrationId}`}</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          {/* Tóm tắt thông tin sinh viên */}
          <div className="p-3 bg-light rounded-3 mb-3 border">
            <div className="row g-2 fs-7">
              <div className="col-sm-6">
                <span className="text-muted">Sinh viên:</span> <strong>{student.fullName || '—'}</strong> ({student.studentCode || '—'})
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Khoa/Lớp:</span> <strong>{student.faculty || '—'}</strong> / {student.className || '—'}
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Email / SĐT:</span> {student.email || '—'} • {student.phone || '—'}
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Trạng thái hồ sơ:</span> <span className="badge text-dark text-uppercase" style={{ backgroundColor: '#fef3c7' }}>{STATUS_LABELS[registration.status] || 'CHƯA XÁC ĐỊNH'}</span>
              </div>
            </div>
          </div>

          {/* Thông tin nơi ở & chủ trọ */}
          <div className="p-3 bg-white rounded-3 mb-3 border">
            <div className="fw-bold fs-7 mb-2 text-uppercase text-muted d-flex align-items-center gap-1">
              <MapPin size={15} /> Địa chỉ ngoại trú & Chủ trọ
            </div>
            <div className="row g-2 fs-7">
              <div className="col-12">
                <span className="text-muted">Địa chỉ:</span> <strong>{[address.addressLine, address.ward, address.district, address.province].filter(Boolean).join(', ') || 'Chưa cập nhật'}</strong>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Chủ trọ:</span> <strong>{landlord.fullName || 'Chưa có thông tin'}</strong>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Số điện thoại:</span> <strong>{landlord.phone || '—'}</strong>
              </div>
            </div>
          </div>

          {/* Danh sách giấy tờ cần kiểm tra */}
          <div className="mb-3">
            <div className="fw-bold fs-7 mb-2 text-uppercase text-muted d-flex align-items-center gap-1">
              <FileText size={15} /> Giấy tờ minh chứng đính kèm ({documents.length}/4)
            </div>
            <div className="d-flex flex-column gap-2 fs-7">
              {['RENTAL_CONTRACT', 'RESIDENCE_CONFIRMATION', 'LANDLORD_ID', 'HOUSE_IMAGE'].map(type => {
                const doc = documents.find(d => d.documentType === type);
                const hasFile = doc && doc.documentVersions && doc.documentVersions.length > 0;

                return (
                  <div key={type} className="p-2 border rounded d-flex align-items-center justify-content-between bg-white">
                    <div className="d-flex align-items-center gap-2">
                      <span>📄 {DOC_TYPES[type] || type}</span>
                      {hasFile ? (
                        <span className="badge bg-success" style={{ fontSize: '0.7rem' }}>Đã tải lên</span>
                      ) : (
                        <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>Chưa có</span>
                      )}
                    </div>
                    {hasFile && (
                      <button 
                        type="button" 
                        onClick={() => handlePreview(doc)}
                        className="btn btn-sm btn-link text-decoration-none d-inline-flex align-items-center gap-1 p-0 fs-8 fw-semibold"
                      >
                        <Eye size={14} /> Xem tệp
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ý kiến xử lý của cán bộ */}
          <div className="mb-2">
            <label className="form-label fw-bold fs-7 text-muted text-uppercase">
              Ý kiến / Ghi chú phản hồi (Bắt buộc nếu từ chối hoặc yêu cầu bổ sung)
            </label>
            <textarea 
              className="form-control fs-7" 
              rows="3" 
              placeholder="Nhập nội dung ý kiến hoặc lý do phê duyệt/từ chối..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </Modal.Body>

        <Modal.Footer className="border-top d-flex align-items-center justify-content-between">
          <Button variant="outline-secondary" size="sm" onClick={onHide} disabled={submitting}>
            Đóng
          </Button>
          <div className="d-flex align-items-center gap-2">
            <Button 
              variant="outline-danger" 
              size="sm"
              className="d-inline-flex align-items-center gap-1"
              disabled={submitting}
              onClick={() => {
                if (!note.trim()) { alert('Vui lòng nhập lý do từ chối.'); return; }
                onReject && onReject(registration, note);
              }}
            >
              <XCircle size={16} /> Từ chối
            </Button>
            <Button 
              variant="outline-primary" 
              size="sm"
              className="d-inline-flex align-items-center gap-1"
              disabled={submitting}
              onClick={() => {
                if (!note.trim()) { alert('Vui lòng nhập yêu cầu bổ sung.'); return; }
                onRequestInfo && onRequestInfo(registration, note);
              }}
            >
              <AlertCircle size={16} /> Yêu cầu bổ sung
            </Button>
            <Button 
              variant="success" 
              size="sm"
              style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
              className="d-inline-flex align-items-center gap-1 fw-bold"
              disabled={submitting}
              onClick={() => {
                onApprove && onApprove(registration, note.trim() || 'Hồ sơ đạt yêu cầu quy định, phê duyệt chính thức.');
              }}
            >
              <CheckCircle2 size={16} /> {submitting ? 'Đang duyệt...' : 'Phê duyệt cấp trường'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Modal Xem trước tài liệu */}
      {previewDoc && (
        <Modal show={true} onHide={() => setPreviewDoc(null)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title className="fs-6 fw-bold">Xem tài liệu: {previewDoc.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center p-3">
            {previewDoc.url.toLowerCase().endsWith('.pdf') ? (
              <iframe src={previewDoc.url} title="preview" style={{ width: '100%', height: '500px', border: 'none' }} />
            ) : (
              <img src={previewDoc.url} alt="preview" style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }} />
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
