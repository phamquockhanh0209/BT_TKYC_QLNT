import React, { useState, useEffect } from 'react';
import { KeyRound, Plus, Edit2, Trash2, RefreshCw, Search } from 'lucide-react';
import adminService from '../../../api/adminService';

export default function AdminPermissionsPage() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModule, setFilterModule] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPerm, setSelectedPerm] = useState(null);
  const [formData, setFormData] = useState({ permissionCode: '', permissionName: '', description: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const moduleColors = {
    REGISTRATION: "#2563eb",
    DOCUMENT: "#7c3aed",
    USER: "#dc2626",
    REPORT: "#16a34a",
    SLA: "#d97706",
    AUDIT: "#0f172a",
    CONFIG: "#0891b2"
  };

  const loadPermissions = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPermissions();
      if (res && Array.isArray(res)) {
        setPermissions(res);
      }
    } catch (err) {
      console.error("Failed to load permissions:", err);
      showToast("Không thể tải danh sách quyền hạn", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    setFormData({ permissionCode: '', permissionName: '', description: '' });
    setShowAddModal(true);
  };

  const handleOpenEdit = (p) => {
    setSelectedPerm(p);
    setFormData({
      permissionCode: p.permissionCode,
      permissionName: p.permissionName,
      description: p.description || ''
    });
    setShowEditModal(true);
  };

  const handleCreatePerm = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await adminService.createPermission({
        permissionCode: formData.permissionCode.toUpperCase().trim(),
        permissionName: formData.permissionName.trim(),
        description: formData.description
      });
      showToast("Thêm quyền hạn mới thành công!");
      setShowAddModal(false);
      loadPermissions();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi tạo quyền hạn", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePerm = async (e) => {
    e.preventDefault();
    if (!selectedPerm) return;
    setActionLoading(true);
    try {
      await adminService.updatePermission(selectedPerm.permissionId, {
        permissionId: selectedPerm.permissionId,
        permissionCode: formData.permissionCode.toUpperCase().trim(),
        permissionName: formData.permissionName.trim(),
        description: formData.description
      });
      showToast("Cập nhật quyền hạn thành công!");
      setShowEditModal(false);
      loadPermissions();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi cập nhật quyền hạn", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePerm = async (p) => {
    if (!window.confirm(`Bạn có chắc muốn xóa quyền "${p.permissionName}" (${p.permissionCode})?`)) return;
    try {
      await adminService.deletePermission(p.permissionId);
      showToast("Đã xóa quyền hạn thành công!");
      loadPermissions();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi xóa quyền hạn", "danger");
    }
  };

  const defaultPermissions = [
    { permissionId: 1, permissionCode: "REGISTRATION_CREATE", permissionName: "Tạo mới hồ sơ ngoại trú", description: "Cho phép sinh viên tạo và nộp hồ sơ", rolePermissions: [{ role: { roleCode: "STUDENT" } }] },
    { permissionId: 2, permissionCode: "REGISTRATION_READ", permissionName: "Xem hồ sơ ngoại trú", description: "Xem danh sách và chi tiết hồ sơ", rolePermissions: [{ role: { roleCode: "ADMIN" } }, { role: { roleCode: "OFFICER" } }, { role: { roleCode: "REVIEWER" } }, { role: { roleCode: "STUDENT" } }] },
    { permissionId: 3, permissionCode: "REGISTRATION_PROCESS", permissionName: "Tiếp nhận và xử lý hồ sơ", description: "Cán bộ tiếp nhận và kiểm tra hồ sơ", rolePermissions: [{ role: { roleCode: "OFFICER" } }] },
    { permissionId: 4, permissionCode: "REGISTRATION_APPROVE", permissionName: "Phê duyệt hồ sơ", description: "Chuyên viên thẩm định phê duyệt hồ sơ", rolePermissions: [{ role: { roleCode: "REVIEWER" } }] },
    { permissionId: 5, permissionCode: "DOCUMENT_UPLOAD", permissionName: "Tải lên tài liệu", description: "Tải lên các tài liệu minh chứng cư trú", rolePermissions: [{ role: { roleCode: "STUDENT" } }, { role: { roleCode: "OFFICER" } }] },
    { permissionId: 6, permissionCode: "USER_MANAGE", permissionName: "Quản lý người dùng", description: "Toàn quyền quản trị tài khoản và vai trò", rolePermissions: [{ role: { roleCode: "ADMIN" } }] },
    { permissionId: 7, permissionCode: "REPORT_VIEW", permissionName: "Xem báo cáo thống kê", description: "Truy cập các biểu đồ và báo cáo", rolePermissions: [{ role: { roleCode: "ADMIN" } }, { role: { roleCode: "REVIEWER" } }] }
  ];

  const displayPerms = permissions.length > 0 ? permissions : defaultPermissions;

  const filteredPerms = displayPerms.filter(p => {
    const code = p.permissionCode || '';
    const name = p.permissionName || '';
    const desc = p.description || '';
    const matchSearch = !searchTerm || 
      code.toLowerCase().includes(searchTerm.toLowerCase()) || 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase());

    const module = code.split('_')[0];
    const matchModule = !filterModule || module === filterModule;

    return matchSearch && matchModule;
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
          <h2 className="fw-bold mb-1">Quản Lý Quyền Hạn (Permissions)</h2>
          <p className="text-muted mb-0">Ma trận phân quyền chi tiết cho từng hành động và phân hệ trong hệ thống</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadPermissions}>
            <RefreshCw size={15} /> Làm mới
          </button>
          <button 
            className="btn btn-sm d-inline-flex align-items-center gap-1 fs-7" 
            style={{ backgroundColor: '#1a0b7a', color: '#fff', borderColor: '#eff713' }}
            onClick={handleOpenAdd}
          >
            <Plus size={16} /> Thêm quyền mới
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
                placeholder="Tìm theo mã quyền, tên quyền..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select className="form-select form-select-sm" value={filterModule} onChange={e => setFilterModule(e.target.value)}>
              <option value="">Tất cả phân hệ (Modules)</option>
              <option value="REGISTRATION">REGISTRATION (Hồ sơ)</option>
              <option value="DOCUMENT">DOCUMENT (Tài liệu)</option>
              <option value="USER">USER (Người dùng)</option>
              <option value="REPORT">REPORT (Báo cáo)</option>
              <option value="SLA">SLA (Cam kết thời hạn)</option>
              <option value="CONFIG">CONFIG (Cấu hình)</option>
              <option value="AUDIT">AUDIT (Kiểm toán)</option>
            </select>
          </div>
          <div className="col-md-2 text-end">
            <span className="badge bg-light text-dark p-2 w-100 fs-8">{filteredPerms.length} Permissions</span>
          </div>
        </div>
      </div>

      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>PHÂN HỆ</th>
                <th>MÃ QUYỀN (CODE)</th>
                <th>TÊN QUYỀN HẠN</th>
                <th>MÔ TẢ</th>
                <th>VAI TRÒ ĐƯỢC GÁN</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" /> Đang tải quyền hạn...
                  </td>
                </tr>
              ) : filteredPerms.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">Không tìm thấy quyền hạn phù hợp.</td>
                </tr>
              ) : (
                filteredPerms.map((p) => {
                  const parts = (p.permissionCode || '').split('_');
                  const module = parts[0] || 'SYSTEM';
                  const assignedRoles = (p.rolePermissions || []).map(rp => rp.role?.roleCode).filter(Boolean);

                  return (
                    <tr key={p.permissionId} className="border-bottom border-light">
                      <td>
                        <span 
                          className="fw-bold fs-8 badge"
                          style={{ backgroundColor: moduleColors[module] || '#475569' }}
                        >
                          {module}
                        </span>
                      </td>
                      <td className="fw-bold"><code>{p.permissionCode}</code></td>
                      <td>{p.permissionName}</td>
                      <td className="text-muted fs-8">{p.description || '—'}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {assignedRoles.length > 0 ? (
                            assignedRoles.map((r, i) => (
                              <span key={i} className="badge bg-light text-dark border fs-8">
                                {r}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted fs-8">Chưa cấu hình</span>
                          )}
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-secondary" title="Sửa quyền" onClick={() => handleOpenEdit(p)}>
                            <Edit2 size={13} />
                          </button>
                          <button className="btn btn-outline-danger" title="Xóa quyền" onClick={() => handleDeletePerm(p)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm Quyền */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Thêm Quyền Hạn Mới</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} />
              </div>
              <form onSubmit={handleCreatePerm}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fs-7 fw-semibold">Mã quyền hạn (PermissionCode, ví dụ: REPORT_EXPORT) *</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm text-uppercase" 
                      required 
                      value={formData.permissionCode}
                      onChange={e => setFormData({ ...formData, permissionCode: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label fs-7 fw-semibold">Tên quyền hạn *</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      required 
                      value={formData.permissionName}
                      onChange={e => setFormData({ ...formData, permissionName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label fs-7 fw-semibold">Mô tả tác vụ</label>
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
                    {actionLoading ? 'Đang tạo...' : 'Tạo quyền hạn'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chỉnh Sửa Quyền */}
      {showEditModal && selectedPerm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Chỉnh Sửa Quyền Hạn: {selectedPerm.permissionCode}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} />
              </div>
              <form onSubmit={handleUpdatePerm}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fs-7 fw-semibold">Tên quyền hạn *</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      required 
                      value={formData.permissionName}
                      onChange={e => setFormData({ ...formData, permissionName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label fs-7 fw-semibold">Mô tả tác vụ</label>
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
