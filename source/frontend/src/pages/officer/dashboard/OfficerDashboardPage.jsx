import React, { useState, useEffect } from 'react';
import OfficerStatCards from './OfficerStatCards';
import WorkQueueTable from './WorkQueueTable';
import StatusDistributionChart from './StatusDistributionChart';
import SlaUrgentWidget from './SlaUrgentWidget';
import OfficerQuickActions from './OfficerQuickActions';
import ProcessRegistrationModal from './ProcessRegistrationModal';
import officerService from '../../../api/officerService';
import authService from '../../../api/authService';

/**
 * Trang Tổng quan Cán bộ Quản lý (Officer Work Queue Dashboard)
 * Kết nối dữ liệu thật từ Backend API
 */
export default function OfficerDashboardPage() {
  const [items, setItems] = useState([]);
  const [statusStats, setStatusStats] = useState([]);
  const [selectedReg, setSelectedReg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedFaculty, setSelectedFaculty] = useState('ALL');

  // Nạp dữ liệu
  const loadData = async () => {
    try {
      setLoading(true);
      const [queueData, statusData] = await Promise.all([
        officerService.getWorkQueue(),
        officerService.getStatsByStatus().catch(() => [])
      ]);

      const list = Array.isArray(queueData) ? queueData : [];
      setItems(list);
      setStatusStats(Array.isArray(statusData) ? statusData : []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu Officer Dashboard:', err);
      setMessage({ type: 'danger', text: 'Không thể tải dữ liệu từ máy chủ.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Tính các chỉ số cho 4 Thẻ đầu trang
  const totalRegistrations = items.length;
  const pendingCount = items.filter(i => ['SUBMITTED', 'UNDER_REVIEW', 'PROCESSING'].includes(i.status)).length;
  const additionalInfoCount = items.filter(i => i.status === 'REJECTED').length;
  const overdueItems = items.filter(i => {
    const sla = i.slaTrackings?.[0];
    return sla && sla.dueAt && new Date(sla.dueAt) < new Date() && i.status !== 'APPROVED';
  });
  const overdueCount = overdueItems.length;

  // Xử lý khi bấm nút "Xử lý" tại 1 hồ sơ
  const handleProcessClick = async (reg) => {
    try {
      // Nạp chi tiết hồ sơ đầy đủ
      const detail = await officerService.getRegistrationDetail(reg.registrationId);
      setSelectedReg(detail);
      setShowModal(true);
    } catch {
      setSelectedReg(reg);
      setShowModal(true);
    }
  };

  // 1. Phê duyệt chính thức cấp trường (APPROVE)
  const handleApprove = async (reg, note) => {
    try {
      setSubmitting(true);
      const user = authService.getCurrentUser();
      await officerService.processRegistration(reg.registrationId, {
        action: 'APPROVE',
        note: note || 'Hồ sơ đạt chuẩn quy định, Cán bộ Quản lý phê duyệt chính thức.',
        approverId: user?.userId
      });

      setMessage({ 
        type: 'success', 
        text: `Đã phê duyệt chính thức hồ sơ ${reg.registrationCode || `#${reg.registrationId}`} thành công!` 
      });
      setShowModal(false);
      await loadData();
    } catch (err) {
      console.error('Lỗi phê duyệt:', err);
      alert(err?.response?.data?.message || 'Không thể phê duyệt hồ sơ.');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Yêu cầu sinh viên bổ sung (REQUEST_INFO)
  const handleRequestInfo = async (reg, note) => {
    try {
      setSubmitting(true);
      const user = authService.getCurrentUser();
      await officerService.processRegistration(reg.registrationId, {
        action: 'REQUEST_INFO',
        note: note,
        approverId: user?.userId
      });

      setMessage({ 
        type: 'warning', 
        text: `Đã gửi yêu cầu bổ sung giấy tờ cho hồ sơ ${reg.registrationCode || `#${reg.registrationId}`}.` 
      });
      setShowModal(false);
      await loadData();
    } catch (err) {
      console.error('Lỗi yêu cầu bổ sung:', err);
      alert(err?.response?.data?.message || 'Không thể gửi yêu cầu bổ sung.');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Từ chối hồ sơ (REJECT)
  const handleReject = async (reg, note) => {
    try {
      setSubmitting(true);
      const user = authService.getCurrentUser();
      await officerService.processRegistration(reg.registrationId, {
        action: 'REJECT',
        note: note,
        approverId: user?.userId
      });

      setMessage({ 
        type: 'danger', 
        text: `Đã từ chối hồ sơ ${reg.registrationCode || `#${reg.registrationId}`}.` 
      });
      setShowModal(false);
      await loadData();
    } catch (err) {
      console.error('Lỗi từ chối:', err);
      alert(err?.response?.data?.message || 'Không thể từ chối hồ sơ.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="officer-dashboard-wrapper">
      {/* Thông báo thao tác */}
      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show mb-3`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
        </div>
      )}

      {/* 1. Hàng 4 Card chỉ số công việc trên cùng */}
      <OfficerStatCards 
        totalRegistrations={totalRegistrations}
        pendingCount={pendingCount}
        additionalInfoCount={additionalInfoCount}
        overdueCount={overdueCount}
      />

      {/* 2. Bố cục 2 Cột chính: Hàng đợi hồ sơ cần xử lý & Thống kê/SLA/Thao tác */}
      <div className="row g-4">
        {/* === CỘT TRÁI (8 phần): Hàng đợi hồ sơ cần xử lý === */}
        <div className="col-xl-8 col-12">
          <WorkQueueTable 
            items={items}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedFaculty={selectedFaculty}
            onFacultyChange={setSelectedFaculty}
            onRefresh={loadData}
            onProcess={handleProcessClick}
          />
        </div>

        {/* === CỘT PHẢI (4 phần): Biểu đồ tròn + SLA + Thao tác nhanh === */}
        <div className="col-xl-4 col-12">
          {/* Thống kê theo trạng thái (Biểu đồ tròn) */}
          <StatusDistributionChart data={statusStats} />

          {/* Hồ sơ SLA sắp hoặc quá hạn */}
          <SlaUrgentWidget items={overdueItems.length > 0 ? overdueItems : items.filter(i => ['SUBMITTED', 'UNDER_REVIEW'].includes(i.status))} />

          {/* 4 Nút thao tác nhanh */}
          <OfficerQuickActions />
        </div>
      </div>

      {/* Modal Xử lý / Phê duyệt hồ sơ */}
      <ProcessRegistrationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        registration={selectedReg}
        onApprove={handleApprove}
        onRequestInfo={handleRequestInfo}
        onReject={handleReject}
        submitting={submitting}
      />
    </div>
  );
}
