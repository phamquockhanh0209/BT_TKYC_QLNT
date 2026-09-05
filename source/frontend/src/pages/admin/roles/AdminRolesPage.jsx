import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import adminService from '../../../api/adminService';

export default function AdminRolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({ roleCode: '', roleName: '', description: '', status: 'ACTIVE' });
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const roleColors = {
    ADMIN: "#0f172a",
    OFFICER: "#2563eb",
    REVIEWER: "#16a34a",
    STUDENT: "#7c3aed"
  };

  const loadRoles = async () => {
    setLoading(true);
    try {
      const res = await adminService.getRoles();
      if (res && Array.isArray(res)) {
        setRoles(res);
      }
    } catch (err) {
      console.error("Failed to load roles:", err);
      showToast("Không thể tải danh sách vai trò", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    setFormData({ roleCode: '', roleName: '', description: '', status: 'ACTIVE' });
    setShowAddModal(true);
  };

  const handleOpenEdit = (role) => {
    setSelectedRole(role);
    setFormData({
      roleCode: role.roleCode,
      roleName: role.roleName,
      description: role.description || '',
      status: role.status || 'ACTIVE'
    });
    setShowEditModal(true);
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await adminService.createRole({
        roleCode: formData.roleCode.toUpperCase().trim(),
        roleName: formData.roleName.trim(),
        description: formData.description,
        status: formData.status
      });
      showToast("Thêm vai trò mới thành công!");
      setShowAddModal(false);
      loadRoles();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi khi tạo vai trò", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    setActionLoading(true);
    try {
      await adminService.updateRole(selectedRole.roleId, {
        roleId: selectedRole.roleId,
        roleCode: formData.roleCode.toUpperCase().trim(),
        roleName: formData.roleName.trim(),
        description: formData.description,
        status: formData.status
      });
      showToast("Cập nhật vai trò thành công!");
      setShowEditModal(false);
      loadRoles();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi khi cập nhật vai trò", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRole = async (role) => {
    if (!window.confirm(`Bạn có chắc muốn xóa vai trò "${role.roleName}" (${role.roleCode})?`)) return;
    try {
      await adminService.deleteRole(role.roleId);
      showToast("Đã xóa vai trò thành công!");
      loadRoles();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi khi xóa vai trò", "danger");
    }
  };

  const defaultRoles = [
    { roleId: 1, roleCode: "ADMIN", roleName: "Quản trị viên hệ thống", description: "Toàn quyền quản lý hệ thống, người dùng, cấu hình và dữ liệu", userRoles: [1] },
    { roleId: 2, roleCode: "OFFICER", roleName: "Cán bộ tiếp nhận hồ sơ", description: "Tiếp nhận, kiểm tra giấy tờ và chuyển hồ sơ lên Reviewer", userRoles: [1, 2] },
    { roleId: 3, roleCode: "REVIEWER", roleName: "Chuyên viên xét duyệt", description: "Thẩm định chuyên sâu và ra quyết định phê duyệt hoặc từ chối", userRoles: [1] },
    { roleId: 4, roleCode: "STUDENT", roleName: "Sinh viên", description: "Khai báo nơi ở, nộp hồ sơ và theo dõi tiến trình xét duyệt", userRoles: [1] }
  ];

  const displayRoles = roles.length > 0 ? roles : defaultRoles;

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
          <h2 className="fw-bold mb-1">Quản Lý Vai Trò (Roles)</h2>
          <p className="text-muted mb-0">Định nghĩa các vai trò trong hệ thống và danh sách người dùng được phân bổ</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadRoles}>
            <RefreshCw size={15} /> Làm mới
          </button>
          <button 
            className="btn btn-sm d-inline-flex align-items-center gap-1 fs-7" 
            style={{ backgroundColor: '#06087b', color: '#fff', borderColor: '#d5f718' }}
            onClick={handleOpenAdd}
          >
            <Plus size={16} /> Thêm vai trò mới
          </button>
        </div>
      </div>

      <div className="row g-3">
        {loading ? (
          <div className="col-12 text-center py-5 text-muted">
            <span className="spinner-border spinner-border-sm me-2" role="status" /> Đang tải danh sách vai trò...
          </div>
        ) : (
          displayRoles.map((role) => {
            const color = roleColors[role.roleCode] || "#475569";
            const userCount = role.userRoles?.length || 0;
            return (
              <div key={role.roleId} className="col-xl-6 col-12">
                <div className="app-card-clean bg-white border h-100 p-4">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div 
                        className="d-flex align-items-center justify-content-center rounded-2 text-white fw-bold"
                        style={{ width: '46px', height: '46px', backgroundColor: color, fontSize: '0.75rem', letterSpacing: '0.03em' }}
                      >
                        <Shield size={22} />
                      </div>
                      <div>
                        <div className="fw-bold fs-5 text-dark">{role.roleName}</div>
                        <code className="text-muted fs-8">{role.roleCode}</code>
                      </div>
                    </div>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-secondary" title="Sửa vai trò" onClick={() => handleOpenEdit(role)}>
                        <Edit2 size={14} />
                      </button>
                      {role.roleCode !== 'ADMIN' && (
                        <button className="btn btn-sm btn-outline-danger" title="Xóa vai trò" onClick={() => handleDeleteRole(role)}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-muted fs-7 mb-3">{role.description || 'Không có mô tả chi tiết.'}</p>

                  <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
                    <span className="text-muted fs-8">Số người dùng được gán vai trò này:</span>
                    <span className="fw-bold fs-6" style={{ color }}>{userCount} người dùng</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Thêm Vai trò */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Thêm Vai Trò Mới</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} />
              </div>
              <form onSubmit={handleCreateRole}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fs-7 fw-semibold">Mã vai trò (RoleCode, ví dụ: OFFICER_ASSISTANT) *</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm text-uppercase" 
                      required 
                      value={formData.roleCode}
                      onChange={e => setFormData({ ...formData, roleCode: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label fs-7 fw-semibold">Tên hiển thị vai trò *</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      required 
                      value={formData.roleName}
                      onChange={e => setFormData({ ...formData, roleName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label fs-7 fw-semibold">Mô tả chức năng</label>
                    <textarea 
                      className="form-control form-control-sm" 
                      rows="3" 
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowAddModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-sm btn-primary" disabled={actionLoading}>
                    {actionLoading ? 'Đang tạo...' : 'Tạo vai trò'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chỉnh Sửa Vai trò */}
      {showEditModal && selectedRole && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Chỉnh Sửa Vai Trò: {selectedRole.roleCode}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} />
              </div>
              <form onSubmit={handleUpdateRole}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fs-7 fw-semibold">Tên hiển thị vai trò *</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      required 
                      value={formData.roleName}
                      onChange={e => setFormData({ ...formData, roleName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label fs-7 fw-semibold">Mô tả chức năng</label>
                    <textarea 
                      className="form-control form-control-sm" 
                      rows="3" 
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
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
