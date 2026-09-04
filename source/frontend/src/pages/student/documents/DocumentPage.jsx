import React, { useEffect, useState } from 'react';
import { Upload, FileCheck, Eye } from 'lucide-react';
import authService from '../../../api/authService';
import studentService from '../../../api/studentService';

export default function DocumentPage() {
  const API_URL = 'http://localhost:5005';
  const requiredDocuments = [
    ['RENTAL_CONTRACT', 'Hợp đồng thuê nhà trọ'],
    ['RESIDENCE_CONFIRMATION', 'Giấy xác nhận tạm trú (CT07)'],
    ['LANDLORD_ID', 'CCCD chủ trọ (2 mặt)'],
    ['HOUSE_IMAGE', 'Ảnh chụp cổng và số nhà trọ']
  ];
  const documentStatus = value => ({ APPROVED: 'Đã duyệt', VALID: 'Đã duyệt', PENDING: 'Chờ xác nhận', UPLOADED: 'Đã tải lên' }[value] || value || 'Chưa nộp');

  const [documents, setDocuments] = useState([]);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const user = authService.getCurrentUser();
      const code = user?.student?.studentCode || user?.username;
      const student = await studentService.getStudentByCode(code);
      const registrations = await studentService.getRegistrationsByStudent(student.studentId);
      const current = registrations.find(item => ['APPROVED', 'ACTIVE', 'SUBMITTED', 'PROCESSING'].includes(item.status));
      setRegistration(current || null);
      if (current?.documents?.length) {
        const withVersions = await Promise.all(current.documents.map(async document => {
          try {
            const versions = await studentService.getDocumentVersions(document.documentId);
            return { ...document, version: Array.isArray(versions) ? versions[0] : null };
          } catch { return { ...document, version: null }; }
        }));
        setDocuments(withVersions);
      }
    };
    load().catch(err => setError(err?.response?.data?.message || 'Không thể tải giấy tờ của hồ sơ.')).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container-fluid py-5 text-center text-muted">Đang tải giấy tờ...</div>;
  if (error) return <div className="container-fluid py-2"><div className="alert alert-danger">{error}</div></div>;
  const findDocument = type => documents.find(document => document.documentType === type);
  const uploadedCount = requiredDocuments.filter(([type]) => findDocument(type)?.version).length;

  return <div className="container-fluid py-2">
    <div className="d-flex align-items-center justify-content-between mb-4"><div><h2 className="fw-bold mb-1">Giấy Tờ Minh Chứng ({uploadedCount}/4)</h2><p className="text-muted mb-0">{registration ? `Hồ sơ ${registration.registrationCode || `#${registration.registrationId}`}` : 'Chưa có hồ sơ ngoại trú để tải giấy tờ'}</p></div><button className="btn btn-success d-inline-flex align-items-center gap-2" onClick={() => window.location.assign('/registration')} style={{ backgroundColor: 'var(--primary-color)' }}><Upload size={18} /> Tải lên tài liệu mới</button></div>
    {!registration ? <div className="app-card-clean text-center py-5 text-muted">Bạn chưa có hồ sơ ngoại trú. Hãy khai báo hồ sơ trước khi tải giấy tờ.</div> : <div className="row g-4">{requiredDocuments.map(([type, name]) => { const document = findDocument(type); const file = document?.version; return <div key={type} className="col-md-6 col-12"><div className="app-card-clean d-flex align-items-center justify-content-between"><div className="d-flex align-items-center gap-3"><div className="notif-icon-box notif-icon-success"><FileCheck size={20} /></div><div><h6 className="fw-bold mb-1">{name}</h6><small className="text-muted">{file ? `Tệp: ${file.fileName}` : 'Chưa nộp tài liệu'}</small></div></div><div className="d-flex align-items-center gap-2"><span className="badge-pill-custom badge-active">{documentStatus(document?.documentStatus)}</span>{file && <button className="btn btn-sm btn-outline-secondary p-1" title="Xem tài liệu" onClick={() => window.open(`${API_URL}/${file.filePath.replace(/^\//, '')}`, '_blank', 'noopener,noreferrer')}><Eye size={16} /></button>}</div></div></div>; })}</div>}
  </div>;
}
