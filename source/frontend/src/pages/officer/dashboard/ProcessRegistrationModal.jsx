import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CheckCircle2, AlertCircle, XCircle, FileText, User } from 'lucide-react';

export default function ProcessRegistrationModal({ show, onHide, registration, onApprove, onRequestInfo, onReject }) {
  const [note, setNote] = useState('');

  if (!registration) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title className="fw-bold fs-5">
          Xử lý hồ sơ: <span style={{ color: 'var(--primary-color)' }}>{registration.code}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Tóm tắt thông tin sinh viên & hồ sơ */}
        <div className="p-3 bg-light rounded-3 mb-3 border">
          <div className="row g-2 fs-7">
            <div className="col-sm-6">
              <span className="text-muted">Sinh viên:</span> <strong>{registration.studentName}</strong> ({registration.studentCode})
            </div>
            <div className="col-sm-6">
              <span className="text-muted">Khoa/Viện:</span> <strong>{registration.faculty}</strong>
            </div>
            <div className="col-sm-6">
              <span className="text-muted">Ngày nộp:</span> {registration.submittedDate} {registration.submittedTime}
            </div>
            <div className="col-sm-6">
              <span className="text-muted">Trạng thái hiện tại:</span> <span className="badge bg-warning text-dark">{registration.status}</span>
            </div>
          </div>
        </div>

        {/* Danh sách giấy tờ cần kiểm tra */}
        <div className="mb-3">
          <div className="fw-bold fs-7 mb-2 text-uppercase text-muted">Giấy tờ minh chứng đính kèm</div>
          <div className="d-flex flex-column gap-2 fs-7">
            <div className="p-2 border rounded d-flex align-items-center justify-content-between bg-white">
              <span>📄 1. Hợp đồng thuê nhà (Có chữ ký 2 bên)</span>
              <span className="badge bg-success">Hợp lệ</span>
            </div>
            <div className="p-2 border rounded d-flex align-items-center justify-content-between bg-white">
              <span>📄 2. Giấy xác nhận tạm trú CT07</span>
              <span className="badge bg-success">Hợp lệ</span>
            </div>
            <div className="p-2 border rounded d-flex align-items-center justify-content-between bg-white">
              <span>📄 3. Căn cước công dân Chủ trọ</span>
              <span className="badge bg-success">Hợp lệ</span>
            </div>
          </div>
        </div>

        {/* Ý kiến xử lý của cán bộ */}
        <div className="mb-3">
          <label className="form-label fw-bold fs-7 text-muted text-uppercase">Ghi chú / Lý do (nếu yêu cầu bổ sung hoặc từ chối)</label>
          <textarea 
            className="form-control fs-7" 
            rows="3" 
            placeholder="Nhập nội dung phản hồi cho sinh viên..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </Modal.Body>

      <Modal.Footer className="border-top d-flex align-items-center justify-content-between">
        <Button variant="outline-secondary" size="sm" onClick={onHide}>
          Đóng
        </Button>
        <div className="d-flex align-items-center gap-2">
          <Button 
            variant="outline-danger" 
            size="sm"
            className="d-inline-flex align-items-center gap-1"
            onClick={() => { onReject && onReject(registration, note); onHide(); }}
          >
            <XCircle size={16} /> Từ chối
          </Button>
          <Button 
            variant="outline-primary" 
            size="sm"
            className="d-inline-flex align-items-center gap-1"
            onClick={() => { onRequestInfo && onRequestInfo(registration, note); onHide(); }}
          >
            <AlertCircle size={16} /> Yêu cầu bổ sung
          </Button>
          <Button 
            variant="success" 
            size="sm"
            style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
            className="d-inline-flex align-items-center gap-1 fw-bold"
            onClick={() => { onApprove && onApprove(registration, note); onHide(); }}
          >
            <CheckCircle2 size={16} /> Phê duyệt
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
