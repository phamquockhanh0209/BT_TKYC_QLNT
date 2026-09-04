import React, { useEffect, useState } from 'react';
import { CheckCircle, FileText, Plus, Upload } from 'lucide-react';
import authService from '../../../api/authService';
import studentService from '../../../api/studentService';

const emptyForm = { addressLine: '', ward: '', district: '', province: '', startDate: '', expiryDate: '', landlordFullName: '', landlordPhone: '', landlordIdentityNumber: '', roomNumber: '', note: '' };
const draftKey = 'student-registration-draft';
const documentTypes = [
  ['RENTAL_CONTRACT', 'Hợp đồng thuê nhà trọ'],
  ['RESIDENCE_CONFIRMATION', 'Giấy xác nhận tạm trú (CT07)'],
  ['LANDLORD_ID', 'CCCD chủ trọ (2 mặt)'],
  ['HOUSE_IMAGE', 'Ảnh cổng và số nhà trọ']
];
const dateText = value => value ? new Date(value).toLocaleDateString('vi-VN') : '—';
const statusText = value => ({ APPROVED: 'Đã duyệt', ACTIVE: 'Đang hiệu lực', SUBMITTED: 'Chờ xét duyệt', PROCESSING: 'Đang xử lý', REJECTED: 'Từ chối' }[value] || value || '—');

export default function RegistrationPage() {
  const [student, setStudent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState({});
  const [showWizard, setShowWizard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadData = async () => {
    const user = authService.getCurrentUser();
    const code = user?.student?.studentCode || user?.username;
    if (!code) throw new Error('Không xác định được mã số sinh viên.');
    const studentData = await studentService.getStudentByCode(code);
    setStudent(studentData);
    const data = await studentService.getRegistrationsByStudent(studentData.studentId);
    setRegistrations(Array.isArray(data) ? data : []);
  };
  useEffect(() => {
    let draft = null;
    try { draft = JSON.parse(localStorage.getItem(draftKey) || 'null'); } catch { localStorage.removeItem(draftKey); }
    if (draft) { setForm(draft.form || emptyForm); setStep(draft.step || 0); setShowWizard(Boolean(draft.showWizard)); }
    loadData().catch(error => setMessage({ type: 'danger', text: error?.response?.data?.message || error.message })).finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (showWizard) localStorage.setItem(draftKey, JSON.stringify({ form, step, showWizard }));
  }, [form, step, showWizard]);

  const update = event => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const validate = () => {
    if (step === 1 && ['province', 'district', 'ward', 'addressLine', 'startDate', 'expiryDate'].some(key => !form[key])) return 'Vui lòng nhập đầy đủ thông tin địa chỉ và thời hạn.';
    if (step === 2 && ['landlordFullName', 'landlordPhone', 'landlordIdentityNumber', 'roomNumber'].some(key => !form[key])) return 'Vui lòng nhập đầy đủ thông tin chủ trọ.';
    if (step === 3 && documentTypes.some(([type]) => !files[type])) return 'Vui lòng chọn đủ 4 giấy tờ minh chứng.';
    return '';
  };
  const next = () => { const error = validate(); if (error) setMessage({ type: 'danger', text: error }); else { setMessage({ type: '', text: '' }); setStep(value => value + 1); } };
  const previous = () => { setMessage({ type: '', text: '' }); setStep(value => value - 1); };
  const submit = async event => {
    event.preventDefault(); const error = validate();
    if (error || !student) { setMessage({ type: 'danger', text: error || 'Thiếu thông tin sinh viên.' }); return; }
    setSubmitting(true); setMessage({ type: '', text: '' });
    try {
      const result = await studentService.submitFullRegistration({ ...form, studentId: student.studentId, studentCode: student.studentCode });
      await Promise.all(documentTypes.map(([type]) => studentService.uploadDocument(files[type], result.registrationId, type)));
      setMessage({ type: 'success', text: `Nộp hồ sơ thành công. Mã hồ sơ: ${result.registrationCode || result.registrationId}.` });
      setForm(emptyForm); setFiles({}); setStep(0); setShowWizard(false); localStorage.removeItem(draftKey); await loadData();
    } catch (errorResponse) { setMessage({ type: 'danger', text: errorResponse?.response?.data?.message || 'Không thể nộp hồ sơ. Vui lòng thử lại.' }); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="container-fluid py-5 text-center text-muted">Đang tải dữ liệu hồ sơ...</div>;
  return <div className="container-fluid py-2">
    <div className="d-flex align-items-center justify-content-between mb-4"><div><h2 className="fw-bold mb-1">Quản lý Hồ sơ Ngoại trú</h2><p className="text-muted mb-0">Theo dõi và khai báo nơi ở ngoại trú</p></div><button className="btn btn-success d-inline-flex align-items-center gap-2" onClick={() => { setShowWizard(true); setStep(0); setMessage({ type: '', text: '' }); }} style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}><Plus size={18} /> Khai báo hồ sơ mới</button></div>
    {message.text && <div className={`alert alert-${message.type}`}>{message.type === 'success' && <CheckCircle size={17} className="me-2" />}{message.text}</div>}
    <div className="app-card-clean mb-4"><div className="table-responsive"><table className="table align-middle mb-0"><thead><tr className="text-muted" style={{ fontSize: '0.8rem' }}><th>MÃ HỒ SƠ</th><th>ĐỊA CHỈ</th><th>NGÀY NỘP</th><th>TRẠNG THÁI</th></tr></thead><tbody>{registrations.length ? registrations.map(registration => { const address = registration.addresses?.[0]; return <tr key={registration.registrationId}><td className="fw-bold">{registration.registrationCode || `#${registration.registrationId}`}</td><td>{[address?.addressLine, address?.ward, address?.district, address?.province].filter(Boolean).join(', ') || 'Chưa cập nhật'}</td><td>{dateText(registration.submittedAt)}</td><td><span className="badge-pill-custom badge-active">{statusText(registration.status)}</span></td></tr>; }) : <tr><td colSpan="4" className="text-center py-4 text-muted">Bạn chưa có hồ sơ ngoại trú nào.</td></tr>}</tbody></table></div></div>
    {showWizard && <div className="app-card-clean"><h4 className="fw-bold mb-4">Khai báo hồ sơ mới</h4><div className="d-flex flex-wrap gap-2 mb-4">{['Thông tin sinh viên', 'Địa chỉ ngoại trú', 'Chủ trọ', 'Giấy tờ & xác nhận'].map((label, index) => <span key={label} className={`badge p-2 ${index <= step ? 'bg-primary' : 'bg-light text-muted'}`}>{index + 1}. {label}</span>)}</div><form onSubmit={submit}>
      {step === 0 && <div className="row g-3">{[['Họ và tên', student?.fullName], ['MSSV', student?.studentCode], ['Khoa', student?.faculty], ['Lớp', student?.className], ['Email', student?.email], ['Số điện thoại', student?.phone], ['Ngày sinh', dateText(student?.dateOfBirth)]].map(([label, value]) => <div className="col-md-6" key={label}><label className="text-muted small">{label}</label><input className="form-control bg-light" value={value || '—'} readOnly /></div>)}</div>}
      {step === 1 && <div className="row g-3">{[['province', 'Tỉnh / Thành phố'], ['district', 'Quận / Huyện'], ['ward', 'Phường / Xã'], ['addressLine', 'Địa chỉ cụ thể']].map(([name, label]) => <div className="col-md-6" key={name}><label className="form-label">{label}</label><input className="form-control" name={name} value={form[name]} onChange={update} /></div>)}<div className="col-md-6"><label className="form-label">Ngày bắt đầu</label><input type="date" className="form-control" name="startDate" value={form.startDate} onChange={update} /></div><div className="col-md-6"><label className="form-label">Ngày kết thúc</label><input type="date" className="form-control" name="expiryDate" value={form.expiryDate} onChange={update} /></div></div>}
      {step === 2 && <div className="row g-3">{[['landlordFullName', 'Họ tên chủ trọ'], ['landlordPhone', 'Số điện thoại'], ['landlordIdentityNumber', 'Số CCCD'], ['roomNumber', 'Số phòng / Khu vực']].map(([name, label]) => <div className="col-md-6" key={name}><label className="form-label">{label}</label><input className="form-control" name={name} value={form[name]} onChange={update} /></div>)}<div className="col-12"><label className="form-label">Ghi chú</label><textarea className="form-control" name="note" value={form.note} onChange={update} rows="2" /></div></div>}
      {step === 3 && <div className="row g-3">{documentTypes.map(([type, label]) => <div className="col-md-6" key={type}><label className="form-label">{label}</label><input type="file" className="form-control" accept=".pdf,.jpg,.jpeg,.png" onChange={event => setFiles(previous => ({ ...previous, [type]: event.target.files?.[0] || null }))} />{files[type] && <small className="text-success"><FileText size={14} /> {files[type].name}</small>}</div>)}<div className="col-12"><p className="mb-1 fw-semibold">Xác nhận thông tin</p><p className="mb-1">{form.addressLine}, {form.ward}, {form.district}, {form.province}</p><p className="mb-0">Chủ trọ: {form.landlordFullName} · Phòng {form.roomNumber}</p></div></div>}
      <div className="d-flex justify-content-between mt-4"><button type="button" className="btn btn-outline-secondary" disabled={step === 0 || submitting} onClick={previous}>Quay lại</button>{step < 3 ? <button type="button" className="btn btn-primary" onClick={next}>Tiếp tục</button> : <button type="submit" className="btn btn-success" disabled={submitting}>{submitting ? 'Đang gửi...' : <><Upload size={16} /> Xác nhận & Nộp hồ sơ</>}</button>}</div>
    </form></div>}
  </div>;
}
