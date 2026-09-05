import React, { useState, useEffect } from 'react';
import { UserCog, Plus, Trash2, RefreshCw, Search } from 'lucide-react';
import adminService from '../../../api/adminService';

export default function AdminUserRolesPage() {
  const [userRoles, setUserRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    userId: '',
    roleId: ''
  });

  const roleColors = {
    ADMIN: "#0f172a",
    OFFICER: "#2563eb",
    REVIEWER: "#026025",
    STUDENT: "#7c3aed"
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [urRes, uRes, rRes] = await Promise.all([
        adminService.getUserRoles(),
        adminService.getUsers(),
        adminService.getRoles()
      ]);
      if (urRes && Array.isArray(urRes)) setUserRoles(urRes);
      if (uRes && Array.isArray(uRes)) setUsers(uRes);
      if (rRes && Array.isArray(rRes)) setRoles(rRes);
    } catch (err) {
      console.error("Failed to load user-roles data:", err);
      showToast("Không thể tải danh sách gán vai trò", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAssign = () => {
    setFormData({
      userId: users.length > 0 ? users[0].userId : '',
      roleId: roles.length > 0 ? roles[0].roleId : ''
    });
    setShowAssignModal(true);
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await adminService.assignUserRole({
        userId: Number(formData.userId),
        roleId: Number(formData.roleId),
        assignedBy: 1
      });
      showToast("Gán vai trò cho người dùng thành công!");
      setShowAssignModal(false);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi khi gán vai trò", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveRole = async (userId, roleId, username, roleCode) => {
    if (username === 'admin' && roleCode === 'ADMIN') {
      alert("Không thể gỡ quyền ADMIN của tài khoản quản trị viên chính!");
      return;
    }
    if (!window.confirm(`Bạn có chắc muốn gỡ vai trò "${roleCode}" khỏi tài khoản "${username}"?`)) return;
    try {
      await adminService.removeUserRole(userId, roleId);
      showToast("Đã gỡ vai trò thành công!");
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi khi gỡ vai trò", "danger");
    }
  };

  const filteredUserRoles = userRoles.filter(ur => {
    const username = ur.user?.username || '';
    const fullName = ur.user?.fullName || '';
    const email = ur.user?.email || '';
    const roleCode = ur.role?.roleCode || '';

    const matchSearch = !searchTerm || 
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = !filterRole || roleCode === filterRole;

    return matchSearch && matchRole;
  });

  return (
    <div>
      {/* Toast alert */}
      {notification && (
        <div className={`alert alert-${notification.type} position-fixed top-0 end-0 m-4 shadow`} style={{ zIndex: 9999 }}>
          {notification.msg}
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Gán Quyền Người Dùng - Vai Trò (User-Role)</h2>
          <p className="text-muted mb-0">Quản lý ánh xạ chi tiết giữa từng tài khoản người dùng và vai trò đảm nhận</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadData}>
            <RefreshCw size={15} /> Làm mới
          </button>
          <button 
            className="btn btn-sm d-inline-flex align-items-center gap-1 fs-7" 
            style={{ backgroundColor: '#10b981', color: '#fff', borderColor: '#10b981' }}
            onClick={handleOpenAssign}
          >
            <Plus size={16} /> Gán vai trò mới
          </button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="app-card-clean bg-white border p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0"><Search size={14} className="text-muted" /></span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Tìm theo username, họ tên, email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select className="form-select form-select-sm" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="">Tất cả vai trò</option>
              <option value="ADMIN">ADMIN</option>
              <option value="OFFICER">OFFICER</option>
              <option value="REVIEWER">REVIEWER</option>
              <option value="STUDENT">STUDENT</option>
            </select>
          </div>
          <div className="col-md-2 text-end">
            <span className="badge bg-light text-dark p-2 w-100 fs-8">{filteredUserRoles.length} Gán quyền</span>
          </div>
        </div>
      </div>

      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>TÀI KHOẢN</th>
                <th>HỌ VÀ TÊN</th>
                <th>EMAIL / SĐT</th>
                <th>VAI TRÒ ĐƯỢC GÁN</th>
                <th>NGƯỜI THỰC HIỆN</th>
                <th>NGÀY GÁN</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" /> Đang tải danh sách phân quyền...
                  </td>
                </tr>
              ) : filteredUserRoles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">Không tìm thấy phân quyền nào phù hợp.</td>
                </tr>
              ) : (
                filteredUserRoles.map((ur, idx) => {
                  const roleCode = ur.role?.roleCode || 'UNKNOWN';
                  const username = ur.user?.username || '—';
                  const fullName = ur.user?.fullName || '—';
                  const email = ur.user?.email || '—';
                  const assignedBy = ur.assignedByNavigation?.username || (ur.assignedBy ? `Admin #${ur.assignedBy}` : 'Hệ thống');
                  const assignedAt = ur.assignedAt ? new Date(ur.assignedAt).toLocaleDateString('vi-VN') : '—';

                  return (
                    <tr key={idx} className="border-bottom border-light">
                      <td className="fw-bold"><code>{username}</code></td>
                      <td>{fullName}</td>
                      <td className="text-muted fs-8">{email}</td>
                      <td>
                        <span 
                          className="fw-bold fs-8 badge"
                          style={{ backgroundColor: roleColors[roleCode] || '#475569' }}
                        >
                          {roleCode}
                        </span>
                      </td>
                      <td className="text-muted fs-8">{assignedBy}</td>
                      <td className="text-muted fs-8">{assignedAt}</td>
                      <td className="text-end">
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          title="Gỡ vai trò"
                          onClick={() => handleRemoveRole(ur.userId, ur.roleId, username, roleCode)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Gán Vai Trò */}
      {showAssignModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Gán Vai Trò Cho Người Dùng</h5>
                <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)} />
              </div>
              <form onSubmit={handleAssignRole}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fs-7 fw-semibold">Chọn tài khoản người dùng *</label>
                    <select 
                      className="form-select form-select-sm"
                      required
                      value={formData.userId}
                      onChange={e => setFormData({ ...formData, userId: e.target.value })}
                    >
                      {users.map(u => (
                        <option key={u.userId} value={u.userId}>
                          {u.username} ({u.fullName})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label fs-7 fw-semibold">Chọn vai trò cần gán *</label>
                    <select 
                      className="form-select form-select-sm"
                      required
                      value={formData.roleId}
                      onChange={e => setFormData({ ...formData, roleId: e.target.value })}
                    >
                      {roles.map(r => (
                        <option key={r.roleId} value={r.roleId}>
                          {r.roleCode} - {r.roleName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowAssignModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-sm btn-success" disabled={actionLoading}>
                    {actionLoading ? 'Đang gán...' : 'Xác nhận gán'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
