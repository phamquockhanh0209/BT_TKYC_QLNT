import React, { useState, useEffect } from 'react';
import { Check, Info, AlertTriangle, RefreshCw } from 'lucide-react';

import authService from '../../../api/authService';
import studentService from '../../../api/studentService';
import axiosClient from '../../../api/axiosClient';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const user = authService.getCurrentUser();

      if (!user) {
        setNotifications([]);
        return;
      }

      // Lấy userId của tài khoản đang đăng nhập
      const userId =
        user?.userId ??
        user?.id ??
        user?.user?.userId ??
        user?.user?.id;

      if (!userId) {
        console.error('Không tìm thấy userId:', user);
        setNotifications([]);
        return;
      }

      // Lấy thông báo thật từ database
      const response = await axiosClient.get(
        `/Notification/user/${userId}`
      );

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      const list = data
        .map((item) => {
          const type = getNotificationType(item.notificationType);

          return {
            id: item.notificationId,
            type,
            title: item.title || 'Thông báo',
            content: item.message || '',
            time: formatDate(item.createdAt),
            read: item.isRead === true || item.isRead === 1,
          };
        })
        .sort((a, b) => {
          return new Date(b.rawCreatedAt || 0) - new Date(a.rawCreatedAt || 0);
        });

      setNotifications(list);
    } catch (err) {
      console.error('Lỗi nạp thông báo:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="container-fluid py-2">

      {/* HEADER */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Tất Cả Thông Báo
          </h2>

          <p className="text-muted mb-0">
            Cập nhật tin tức, kết quả xét duyệt và nhắc nhở từ Nhà trường
          </p>
        </div>

        <button
          className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
          onClick={loadNotifications}
        >
          <RefreshCw size={16} />
          Làm mới
        </button>
      </div>

      {/* NOTIFICATION LIST */}
      <div className="app-card-clean">

        {loading ? (
          <div className="py-5 text-center text-muted">
            <div
              className="spinner-border mb-2"
              role="status"
              style={{ color: 'var(--primary-color)' }}
            />

            <div>Đang tải thông báo...</div>
          </div>
        ) : notifications.length === 0 ? (

          <div className="py-5 text-center text-muted">
            <Info size={30} className="mb-2" />

            <div>
              Bạn chưa có thông báo nào.
            </div>
          </div>

        ) : (

          <div className="d-flex flex-column gap-3">

            {notifications.map((n) => (

              <div
                key={n.id}
                className={`p-3 border rounded-3 d-flex align-items-start gap-3 bg-white ${!n.read ? 'notification-unread' : ''
                  }`}
              >

                {/* ICON */}
                <div className={`notif-icon-box notif-icon-${n.type}`}>

                  {n.type === 'success' && (
                    <Check size={18} />
                  )}

                  {n.type === 'info' && (
                    <Info size={18} />
                  )}

                  {n.type === 'warning' && (
                    <AlertTriangle size={18} />
                  )}

                </div>

                {/* CONTENT */}
                <div className="flex-grow-1">

                  <div className="d-flex align-items-center justify-content-between mb-1">

                    <h6 className="fw-bold mb-0">
                      {n.title}
                    </h6>

                    <small className="text-muted">
                      {n.time}
                    </small>

                  </div>

                  <p className="text-muted mb-0 lh-sm fs-7">
                    {n.content}
                  </p>

                  {/* CHƯA ĐỌC */}
                  {!n.read && (
                    <div className="mt-2">
                      <span className="badge bg-warning text-dark">
                        Chưa đọc
                      </span>
                    </div>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
}


/**
 * Chuyển loại notification của backend
 * sang class/icon của frontend
 */
function getNotificationType(type) {
  switch (type) {
    case 'SUCCESS':
      return 'success';

    case 'WARNING':
      return 'warning';

    case 'ERROR':
      return 'warning';

    case 'INFO':
    default:
      return 'info';
  }
}


/**
 * Format ngày giờ
 */
function formatDate(value) {
  if (!value) {
    return 'Gần đây';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Gần đây';
  }

  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}