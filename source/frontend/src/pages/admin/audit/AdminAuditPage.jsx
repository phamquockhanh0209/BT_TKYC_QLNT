import React, { useState, useEffect } from 'react';
import { History, Search, Download, RefreshCw } from 'lucide-react';
import adminService from '../../../api/adminService';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const [filterResult, setFilterResult] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAuditLogs();
      if (res && Array.isArray(res)) {
        setLogs(res);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const moduleColors = {
    AUTH: "#7c3aed",
    REGISTRATION: "#2563eb",
    DOCUMENT: "#0891b2",
    SLA_TRACKING: "#d97706",
    USER: "#dc2626",
    CONFIG: "#10b981",
    SYSTEM: "#0f172a"
  };

  const defaultLogs = [
    { auditLogId: 1, createdAt: "2026-09-03T19:42:15", user: { username: "admin" }, entityType: "AUTH", action: "LOGIN_SUCCESS", oldValue: null, newValue: "Đăng nhập từ IP 192.168.1.10", ipAddress: "192.168.1.10" },
    { auditLogId: 2, createdAt: "2026-09-03T19:35:08", user: { username: "reviewer01" }, entityType: "REGISTRATION", action: "APPROVE_REGISTRATION", oldValue: "PENDING_REVIEW", newValue: "APPROVED", ipAddress: "192.168.1.15" },
    { auditLogId: 3, createdAt: "2026-09-03T19:20:31", user: { username: "officer01" }, entityType: "REGISTRATION", action: "PROCESS_REGISTRATION", oldValue: "SUBMITTED", newValue: "PENDING_REVIEW", ipAddress: "192.168.1.12" },
    { auditLogId: 4, createdAt: "2026-09-03T18:50:42", user: { username: "student01" }, entityType: "DOCUMENT", action: "UPLOAD_DOCUMENT", oldValue: null, newValue: "Hợp đồng thuê nhà.pdf", ipAddress: "113.161.78.22" },
    { auditLogId: 5, createdAt: "2026-09-03T16:10:00", user: { username: "system_sla" }, entityType: "SLA_TRACKING", action: "SLA_VIOLATION_ALERT", oldValue: null, newValue: "Cảnh báo quá hạn hồ sơ", ipAddress: "127.0.0.1" }
  ];

  const displayLogs = logs.length > 0 ? logs : defaultLogs;

  const filteredLogs = displayLogs.filter(l => {
    const username = l.user?.username || l.userName || '';
    const action = l.action || '';
    const details = l.newValue || l.details || '';
    const ip = l.ipAddress || '';
    const entityType = l.entityType || 'SYSTEM';

    const matchSearch = !searchTerm ||
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ip.includes(searchTerm);

    const matchModule = !filterModule || entityType === filterModule;

    const isWarning = action.includes('ALERT') || action.includes('WARN');
    const isFailed = action.includes('FAIL') || action.includes('REJECT');
    const result = isFailed ? 'FAILED' : (isWarning ? 'WARNING' : 'SUCCESS');
    const matchResult = !filterResult || result === filterResult;

    return matchSearch && matchModule && matchResult;
  });

  const handleExport = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Audit Log — Nhật Ký Kiểm Toán Hệ Thống</h2>
          <p className="text-muted mb-0">Ghi nhận toàn bộ hành động người dùng và tiến trình hệ thống phục vụ thanh tra, kiểm toán</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadLogs}>
            <RefreshCw size={15} /> Làm mới
          </button>
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={handleExport}>
            <Download size={16} /> Xuất JSON
          </button>
        </div>
      </div>

      {/* Thanh lọc */}
      <div className="app-card-clean bg-white border p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0"><Search size={14} className="text-muted" /></span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Tên người dùng, tác vụ, IP..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select form-select-sm" value={filterModule} onChange={e => setFilterModule(e.target.value)}>
              <option value="">Tất cả phân hệ</option>
              <option value="AUTH">AUTH (Đăng nhập / Xác thực)</option>
              <option value="REGISTRATION">REGISTRATION (Hồ sơ)</option>
              <option value="DOCUMENT">DOCUMENT (Tài liệu)</option>
              <option value="USER">USER (Tài khoản)</option>
              <option value="SLA_TRACKING">SLA_TRACKING (Thời hạn)</option>
              <option value="CONFIG">CONFIG (Cấu hình)</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select form-select-sm" value={filterResult} onChange={e => setFilterResult(e.target.value)}>
              <option value="">Tất cả kết quả</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="WARNING">WARNING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
          <div className="col-md-2 text-end">
            <span className="badge bg-light text-dark p-2 w-100 fs-8">{filteredLogs.length} Bản ghi</span>
          </div>
        </div>
      </div>

      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>ID</th>
                <th>THỜI GIAN</th>
                <th>NGƯỜI DÙNG</th>
                <th>PHÂN HỆ</th>
                <th>HÀNH ĐỘNG</th>
                <th>CHI TIẾT THAY ĐỔI</th>
                <th>ĐỊA CHỈ IP</th>
                <th className="text-end">KẾT QUẢ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" /> Đang tải nhật ký kiểm toán...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">Không tìm thấy nhật ký kiểm toán phù hợp.</td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const id = log.auditLogId || log.id;
                  const username = log.user?.username || log.userName || (log.userId ? `User #${log.userId}` : 'Hệ thống');
                  const entity = log.entityType || 'SYSTEM';
                  const time = log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : '—';
                  const isWarning = log.action?.includes('ALERT') || log.action?.includes('WARN');
                  const isFailed = log.action?.includes('FAIL') || log.action?.includes('REJECT');
                  const status = isFailed ? 'FAILED' : (isWarning ? 'WARNING' : 'SUCCESS');

                  return (
                    <tr key={id} className="border-bottom border-light">
                      <td className="text-muted fs-8">#{id}</td>
                      <td className="text-muted fs-8">{time}</td>
                      <td className="fw-bold"><code>{username}</code></td>
                      <td>
                        <span 
                          className="fw-bold fs-8 badge"
                          style={{ backgroundColor: moduleColors[entity] || '#475569' }}
                        >
                          {entity}
                        </span>
                      </td>
                      <td className="fw-semibold text-dark">{log.action}</td>
                      <td className="text-muted fs-8" style={{ maxWidth: '280px' }}>
                        {log.oldValue && <span className="text-danger text-decoration-line-through me-1">{log.oldValue}</span>}
                        <span>{log.newValue || log.details || '—'}</span>
                      </td>
                      <td className="text-muted fs-8">{log.ipAddress || '127.0.0.1'}</td>
                      <td className="text-end">
                        <span className={`badge ${status === 'SUCCESS' ? 'bg-success text-white' : (status === 'WARNING' ? 'bg-warning text-dark' : 'bg-danger text-white')} fs-8`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
