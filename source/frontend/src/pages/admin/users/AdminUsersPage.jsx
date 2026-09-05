import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Shield, Edit2, Trash2, Check, X, RefreshCw } from 'lucide-react';
import adminService from '../../../api/adminService';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    passwordHash: '',
    fullName: '',
    email: '',
    phone: '',
    status: 'ACTIVE',
    roleId: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        adminService.getUsers(),
        adminService.getRoles()
      ]);
      if (usersRes && Array.isArray(usersRes)) setUsers(usersRes);
      if (rolesRes && Array.isArray(rolesRes)) setRoles(rolesRes);
    } catch (err) {
      console.error("Failed to load users:", err);
      showToast("Không thể tải danh sách người dùng", "danger");
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

  const handleOpenAdd = () => {
    setFormData({
      username: '',
      passwordHash: '',
      fullName: '',
      email: '',
      phone: '',
      status: 'ACTIVE',
      roleId: roles.length > 0 ? roles[0].roleId : ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    const assignedRoleId = user.userRoleUsers && user.userRoleUsers.length > 0 
      ? user.userRoleUsers[0].roleId 
      : '';
    setFormData({
      username: user.username,
      passwordHash: user.passwordHash || '',
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      status: user.status || 'ACTIVE',
      roleId: assignedRoleId
    });
    setShowEditModal(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const newUser = await adminService.createUser({
        username: formData.username,
        passwordHash: formData.passwordHash || '123456',
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        status: formData.status
      });

      if (newUser && newUser.userId && formData.roleId) {
        try {
          await adminService.assignUserRole({
            userId: newUser.userId,
            roleId: Number(formData.roleId),
            assignedBy: 1
          });
        } catch (roleErr) {
          console.warn("Could not auto-assign role:", roleErr);
        }
      }

      showToast("Thêm tài khoản người dùng thành công!");
      setShowAddModal(false);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi tạo tài khoản", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await adminService.updateUser(selectedUser.userId, {
        userId: selectedUser.userId,
        username: formData.username,
        passwordHash: formData.passwordHash,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        status: formData.status
      });

      showToast("Cập nhật thông tin tài khoản thành công!");
      setShowEditModal(false);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi cập nhật tài khoản", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${user.username}"?`)) return;
    try {
      await adminService.deleteUser(user.userId);
      showToast("Đã xóa người dùng thành công!");
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi xóa tài khoản", "danger");
    }
  };

  // Lọc danh sách
  const filteredUsers = users.filter(u => {
    const matchSearch = !searchTerm || 
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const userRoleCodes = (u.userRoleUsers || []).map(ur => ur.role?.roleCode);
    const matchRole = !filterRole || userRoleCodes.includes(filterRole);
    const matchStatus = !filterStatus || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const getRoleBadge = (user) => {
    const assigned = user.userRoleUsers || [];
    if (assigned.length === 0) return <span className="badge bg-secondary text-white">Chưa gán</span>;
    return (
      <div className="d-flex flex-wrap gap-1">
        {assigned.map((ur, idx) => {
          const code = ur.role?.roleCode || 'USER';
          const bg = code === 'ADMIN' ? '#0f172a' : (code === 'OFFICER' ? '#1d4ed8' : (code === 'REVIEWER' ? '#15803d' : '#7e22ce'));
          return (
            <span key={idx} className="badge text-white" style={{ backgroundColor: bg, fontWeight: 600 }}>
              {code}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {/* Toast alert */}
      {notification && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show position-fixed top-0 end-0 m-4 shadow`} style={{ zIndex: 9999 }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Quản Lý Người Dùng & Tài Khoản</h2>
          <p className="text-muted mb-0">Quản trị danh sách tài khoản, thông tin cá nhân và phân quyền hệ thống</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadData}>
            <RefreshCw size={15} /> Làm mới
          </button>
          <button 
            className="btn btn-dark d-inline-flex align-items-center gap-1 fs-7 fw-semibold" 
            onClick={handleOpenAdd}
          >
            <UserPlus size={16} /> Thêm người dùng mới
          </button>
        </div>
      </div>

      {/* Bộ lọc tìm kiếm */}
      <div className="app-card-clean bg-white border p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0"><Search size={14} className="text-muted" /></span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Tìm theo tên đăng nhập, họ tên, email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select form-select-sm" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="">Tất cả vai trò</option>
              <option value="ADMIN">ADMIN</option>
              <option value="OFFICER">OFFICER</option>
              <option value="REVIEWER">REVIEWER</option>
              <option value="STUDENT">STUDENT</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select form-select-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">ACTIVE (Hoạt động)</option>
              <option value="INACTIVE">INACTIVE (Khóa)</option>
            </select>
          </div>
          <div className="col-md-1 text-end">
            <span className="badge bg-light text-dark p-2 w-100 fs-8">{filteredUsers.length} Users</span>
          </div>
        </div>
      </div>

      {/* Bảng người dùng */}
      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>ID</th>
                <th>TÊN ĐĂNG NHẬP</th>
                <th>HỌ VÀ TÊN</th>
                <th>EMAIL / SĐT</th>
                <th>VAI TRÒ</th>
                <th>TRẠNG THÁI</th>
                <th>ĐĂNG NHẬP GẦN NHẤT</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" /> Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">Không tìm thấy người dùng phù hợp.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.userId} className="border-bottom border-light">
                    <td className="text-muted fs-8">#{u.userId}</td>
                    <td className="fw-bold"><code>{u.username}</code></td>
                    <td>{u.fullName || '—'}</td>
                    <td>
                      <div className="text-dark">{u.email || '—'}</div>
                      <div className="text-muted fs-8">{u.phone || ''}</div>
                    </td>
                    <td>{getRoleBadge(u)}</td>
                    <td>
                      <span className={`badge ${u.status === 'ACTIVE' ? 'bg-success text-white' : 'bg-secondary text-white'} fs-8`}>
                        {u.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="text-muted fs-8">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary" title="Sửa thông tin" onClick={() => handleOpenEdit(u)}>
                          <Edit2 size={13} />
                        </button>
                        {u.username !== 'admin' && (
                          <button className="btn btn-outline-danger" title="Xóa tài khoản" onClick={() => handleDeleteUser(u)}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm Người Dùng */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Thêm Người Dùng Mới</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} />
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fs-7 fw-semibold">Tên đăng nhập (Username) *</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      required 
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label fs-7 fw-semibold">Mật khẩu *</label>
                    <input 
                      type="password" 
                      className="form-control form-control-sm" 
                      required 
                      placeholder="Mặc định: 123456"
                      value={formData.passwordHash}
                      onChange={e => setFormData({ ...formData, passwordHash: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label fs-7 fw-semibold">Họ và tên *</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      required 
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fs-7 fw-semibold">Email</label>
                      <input 
                        type="email" 
                        className="form-control form-control-sm" 
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fs-7 fw-semibold">Số điện thoại</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm" 
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fs-7 fw-semibold">Vai trò gán</label>
                      <select 
                        className="form-select form-select-sm"
                        value={formData.roleId}
                        onChange={e => setFormData({ ...formData, roleId: e.target.value })}
                      >
                        {roles.map(r => (
                          <option key={r.roleId} value={r.roleId}>{r.roleCode} - {r.roleName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label fs-7 fw-semibold">Trạng thái</label>
                      <select 
                        className="form-select form-select-sm"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowAddModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-sm btn-primary" disabled={actionLoading}>
                    {actionLoading ? 'Đang tạo...' : 'Tạo người dùng'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chỉnh Sửa Người Dùng */}
      {showEditModal && selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Chỉnh Sửa Người Dùng: {selectedUser.username}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} />
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fs-7 fw-semibold">Tên đăng nhập</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      required 
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label fs-7 fw-semibold">Họ và tên *</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      required 
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fs-7 fw-semibold">Email</label>
                      <input 
                        type="email" 
                        className="form-control form-control-sm" 
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fs-7 fw-semibold">Số điện thoại</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm" 
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label fs-7 fw-semibold">Trạng thái hoạt động</label>
                    <select 
                      className="form-select form-select-sm"
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="ACTIVE">ACTIVE (Hoạt động)</option>
                      <option value="INACTIVE">INACTIVE (Khóa)</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowEditModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-sm btn-primary" disabled={actionLoading}>
                    {actionLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
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
