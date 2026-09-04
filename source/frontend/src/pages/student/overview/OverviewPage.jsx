import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeBanner from './WelcomeBanner';
import CurrentResidenceCard from './CurrentResidenceCard';
import RegistrationStepper from './RegistrationStepper';
import RecentActivityTable from './RecentActivityTable';
import NotificationWidget from './NotificationWidget';
import QuickActionsWidget from './QuickActionsWidget';
import SupportWidget from './SupportWidget';
import authService from '../../../api/authService';
import studentService from '../../../api/studentService';

/**
 * Trang Tổng quan Sinh viên — kết nối dữ liệu thật từ API
 */
export default function OverviewPage() {
  const navigate = useNavigate();

  const [studentInfo, setStudentInfo] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 1. Lấy user từ localStorage (đã lưu khi login)
        const currentUser = authService.getCurrentUser();
        const mssv = currentUser?.student?.studentCode || currentUser?.username;

        if (!mssv) {
          setError('Không xác định được MSSV. Vui lòng đăng nhập lại.');
          return;
        }

        // 2. Gọi API lấy thông tin sinh viên theo MSSV
        const svInfo = await studentService.getStudentByCode(mssv);
        setStudentInfo(svInfo);

        // 3. Gọi API lấy danh sách hồ sơ ngoại trú
        if (svInfo?.studentId) {
          const regs = await studentService.getRegistrationsByStudent(svInfo.studentId);
          setRegistrations(Array.isArray(regs) ? regs : []);
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu overview:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Lấy hồ sơ đang hiệu lực (ưu tiên APPROVED > ACTIVE > SUBMITTED)
  const activeReg =
    registrations.find(r => r.status === 'APPROVED') ||
    registrations.find(r => r.status === 'ACTIVE') ||
    registrations.find(r => r.status === 'SUBMITTED') ||
    null;

  const latestAddress = activeReg?.addresses?.[0] || null;
  const latestLandlord = latestAddress?.landlord || null;

  // --- Props cho WelcomeBanner ---
  const registrationStatus = activeReg ? activeReg.status : 'CHƯA ĐĂNG KÝ';
  const documentCount = activeReg?.documents?.length ?? 0;
  const documentRatio = activeReg ? `${documentCount}/4` : '0/4';
  const pendingCount = registrations.filter(
    r => r.status === 'SUBMITTED' || r.status === 'PROCESSING'
  ).length;

  // --- Helpers ---
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const calcDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const diff = new Date(endDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const residenceName = latestAddress
    ? latestAddress.addressLine || 'Nơi ở ngoại trú'
    : 'Chưa có thông tin nơi ở';

  const fullAddress = latestAddress
    ? [latestAddress.addressLine, latestAddress.ward, latestAddress.district, latestAddress.province]
        .filter(Boolean)
        .join(', ')
    : '—';

  // --- Loading / Error ---
  if (loading) {
    return (
      <div className="overview-page-wrapper d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="text-center text-muted">
          <div className="spinner-border mb-3" role="status" style={{ color: 'var(--primary-color)' }} />
          <div>Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overview-page-wrapper">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="overview-page-wrapper">
      {/* Banner lời chào — dữ liệu thật */}
      <WelcomeBanner
        studentName={studentInfo?.fullName || '—'}
        studentCode={studentInfo?.studentCode || '—'}
        faculty={studentInfo?.faculty || '—'}
        className={studentInfo?.className || '—'}
        registrationStatus={registrationStatus}
        documentRatio={documentRatio}
        pendingRequestsCount={pendingCount}
      />

      {/* Bố cục 2 Cột: 8 : 4 */}
      <div className="row g-4">
        {/* === CỘT TRÁI (8) === */}
        <div className="col-lg-8 col-12">

          {/* Card Nơi ở hiện tại hoặc CTA đăng ký mới */}
          {activeReg ? (
            <CurrentResidenceCard
              residenceName={residenceName}
              address={fullAddress}
              landlordName={latestLandlord?.fullName || '—'}
              landlordPhone={latestLandlord?.phone || '—'}
              status={activeReg.status}
              contractStartDate={formatDate(activeReg.startDate)}
              contractEndDate={formatDate(activeReg.expiryDate || latestAddress?.endDate)}
              daysRemaining={calcDaysRemaining(activeReg.expiryDate || latestAddress?.endDate)}
            />
          ) : (
            <div className="app-card-clean mb-4 text-center py-5">
              <h5 className="fw-bold mb-2">Chưa có hồ sơ ngoại trú</h5>
              <p className="text-muted mb-4">
                Bạn chưa đăng ký khai báo nơi ở ngoại trú. Hãy nộp hồ sơ để hoàn thiện thủ tục.
              </p>
              <button
                className="btn btn-success px-4"
                style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                onClick={() => navigate('/registration')}
              >
                + Khai báo ngoại trú ngay
              </button>
            </div>
          )}

          {/* Thanh tiến trình hồ sơ */}
          <RegistrationStepper />

          {/* Bảng Lịch sử hoạt động */}
          <RecentActivityTable />
        </div>

        {/* === CỘT PHẢI (4) === */}
        <div className="col-lg-4 col-12">
          <NotificationWidget />
          <QuickActionsWidget />
          <SupportWidget />
        </div>
      </div>
    </div>
  );
}
