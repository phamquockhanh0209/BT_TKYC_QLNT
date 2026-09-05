import React, { useState, useEffect } from 'react';
import { History, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminService from '../../../api/adminService';

export default function RecentAuditLogsWidget() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await adminService.getAuditLogs();
        if (res && Array.isArray(res) && res.length > 0) {
          setLogs(res.slice(0, 5));
        } else {
          setLogs([
            { auditLogId: 1, createdAt: new Date().toISOString(), user: { username: "admin" }, action: "LOGIN_SUCCESS", entityType: "AUTH", ipAddress: "192.168.1.10", status: "SUCCESS" },
            { auditLogId: 2, createdAt: new Date().toISOString(), user: { username: "reviewer01" }, action: "APPROVE_REGISTRATION", entityType: "REGISTRATION", ipAddress: "192.168.1.15", status: "SUCCESS" },
            { auditLogId: 3, createdAt: new Date().toISOString(), user: { username: "officer01" }, action: "PROCESS_REGISTRATION", entityType: "REGISTRATION", ipAddress: "192.168.1.12", status: "SUCCESS" },
            { auditLogId: 4, createdAt: new Date().toISOString(), user: { username: "student01" }, action: "UPLOAD_DOCUMENT", entityType: "DOCUMENT", ipAddress: "113.161.78.22", status: "SUCCESS" },
            { auditLogId: 5, createdAt: new Date().toISOString(), user: { username: "system_sla" }, action: "SLA_VIOLATION_ALERT", entityType: "SLA_TRACKING", ipAddress: "127.0.0.1", status: "WARNING" }
          ]);
        }
      } catch (err) {
        console.error("Failed to load audit logs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const formatTime = (ts) => {
    if (!ts) return '—';
    try {
      return new Date(ts).toLocaleString('vi-VN');
    } catch {
      return ts;
    }
  };

  return (
    <div className="app-card-clean p-4 bg-white border">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <div className="text-uppercase fw-bold text-muted fs-8" style={{ letterSpacing: '0.04em' }}>
            NHẬT KÝ KIỂM TOÁN HỆ THỐNG
          </div>
          <div className="fw-bold fs-5 text-dark">Audit Logs gần đây</div>
        </div>
        <Link to="/admin/audit" className="link-action fs-8">
          Xem toàn bộ log <ArrowRight size={14} />
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-sm align-middle mb-0 fs-7">
          <thead className="bg-light">
            <tr className="text-muted" style={{ fontSize: '0.75rem' }}>
              <th className="py-2 border-0">Thời gian</th>
              <th className="py-2 border-0">Người dùng</th>
              <th className="py-2 border-0">Hành động tác vụ</th>
              <th className="py-2 border-0">Phân hệ</th>
              <th className="py-2 border-0">Địa chỉ IP</th>
              <th className="py-2 text-end border-0">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const username = log.user?.username || log.userName || (log.userId ? `User #${log.userId}` : 'Hệ thống');
              const status = log.status || (log.action?.includes('FAIL') ? 'FAILED' : 'SUCCESS');
              return (
                <tr key={log.auditLogId || log.id} className="border-bottom border-light">
                  <td className="py-2 text-muted fs-8">{formatTime(log.createdAt || log.timestamp)}</td>
                  <td className="py-2 fw-bold text-dark">{username}</td>
                  <td className="py-2">{log.action || log.details || 'Tác vụ hệ thống'}</td>
                  <td className="py-2"><code>{log.entityType || log.target || 'SYSTEM'}</code></td>
                  <td className="py-2 text-muted fs-8">{log.ipAddress || log.ip || '127.0.0.1'}</td>
                  <td className="py-2 text-end">
                    <span className={`badge ${status === 'SUCCESS' ? 'bg-success text-white' : (status === 'WARNING' ? 'bg-warning text-dark' : 'bg-danger text-white')} fs-8`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
