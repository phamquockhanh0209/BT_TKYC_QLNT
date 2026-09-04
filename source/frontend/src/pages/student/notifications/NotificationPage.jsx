import React, { useState, useEffect } from 'react';
import { Check, Info, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import authService from '../../../api/authService';
import studentService from '../../../api/studentService';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      const code = user?.username || user?.student?.studentCode;

      if (!code) return;

      const student = await studentService.getStudentByCode(code);
      if (!student?.studentId) return;

      const registrations = await studentService.getRegistrationsByStudent(student.studentId);
      const regList = Array.isArray(registrations) ? registrations : [];

      const list = [];

      // Sinh thông báo từ danh sách hồ sơ thật
      regList.forEach((reg, index) => {
        const codeStr = reg.registrationCode || `HS-${reg.registrationId}`;
        const addr = reg.addresses?.[0];
        const addrStr = addr ? `${addr.addressLine}, ${addr.ward}` : '';
        const dateStr = reg.submittedAt ? new Date(reg.submittedAt).toLocaleDateString('vi-VN') : 'Gần đây';

        if (reg.status === 'SUBMITTED') {
          list.push({
            id: `sub-${reg.registrationId}`,
            type: 'info',
            title: 'Hồ sơ ngoại trú đang chờ xét duyệt',
            content: `Hồ sơ đăng ký ngoại trú mã ${codeStr} tại ${addrStr || 'địa chỉ đăng ký'} đã được nộp thành công và đang chờ cán bộ xét duyệt.`,
            time: dateStr,
            read: false
          });
        } else if (reg.status === 'PROCESSING' || reg.status === 'UNDER_REVIEW') {
          list.push({
            id: `pro-${reg.registrationId}`,
            type: 'info',
            title: 'Hồ sơ ngoại trú đang được xử lý',
            content: `Cán bộ đang tiến hành thẩm định thông tin và đối chiếu giấy tờ của hồ sơ ${codeStr}.`,
            time: dateStr,
            read: false
          });
        } else if (reg.status === 'APPROVED' || reg.status === 'ACTIVE') {
          list.push({
            id: `app-${reg.registrationId}`,
            type: 'success',
            title: 'Hồ sơ ngoại trú đã được phê duyệt',
            content: `Hồ sơ đăng ký ngoại trú mã ${codeStr} đã được cán bộ CTSV xét duyệt thành công.`,
            time: dateStr,
            read: true
          });
        } else if (reg.status === 'REJECTED') {
          list.push({
            id: `rej-${reg.registrationId}`,
            type: 'warning',
            title: 'Hồ sơ ngoại trú cần bổ sung / bị từ chối',
            content: `Hồ sơ ${codeStr} chưa đạt yêu cầu: ${reg.rejectionReason || 'Vui lòng kiểm tra lại giấy tờ và liên hệ cán bộ phụ trách.'}`,
            time: dateStr,
            read: false
          });
        }

        // Thông báo giấy tờ
        const docCount = reg.documents?.length || 0;
        if (docCount > 0) {
          list.push({
            id: `doc-${reg.registrationId}`,
            type: 'info',
            title: 'Tiếp nhận giấy tờ đính kèm',
            content: `Hệ thống đã ghi nhận ${docCount}/4 tài liệu đính kèm cho hồ sơ ${codeStr}. Vui lòng theo dõi trạng thái xác thực.`,
            time: dateStr,
            read: true
          });
        }
      });

      // Nếu chưa có hồ sơ nào
      if (list.length === 0) {
        list.push({
          id: 'welcome',
          type: 'warning',
          title: 'Nhắc nhở khai báo ngoại trú',
          content: 'Bạn chưa có hồ sơ đăng ký ngoại trú trong hệ thống. Vui lòng thực hiện khai báo nơi ở theo quy định của Nhà trường.',
          time: 'Hôm nay',
          read: false
        });
      }

      setNotifications(list);
    } catch (err) {
      console.error('Lỗi nạp thông báo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Tất Cả Thông Báo</h2>
          <p className="text-muted mb-0">Cập nhật tin tức, kết quả xét duyệt và nhắc nhở từ Nhà trường</p>
        </div>
        <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1" onClick={loadNotifications}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </div>

      <div className="app-card-clean">
        {loading ? (
          <div className="py-5 text-center text-muted">
            <div className="spinner-border mb-2" role="status" style={{ color: 'var(--primary-color)' }} />
            <div>Đang tải thông báo...</div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {notifications.map((n) => (
              <div key={n.id} className="p-3 border rounded-3 d-flex align-items-start gap-3 bg-white">
                <div className={`notif-icon-box notif-icon-${n.type}`}>
                  {n.type === 'success' && <Check size={18} />}
                  {n.type === 'info' && <Info size={18} />}
                  {n.type === 'warning' && <AlertTriangle size={18} />}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <h6 className="fw-bold mb-0">{n.title}</h6>
                    <small className="text-muted">{n.time}</small>
                  </div>
                  <p className="text-muted mb-0 lh-sm fs-7">{n.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

