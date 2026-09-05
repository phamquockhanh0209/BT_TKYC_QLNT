import axiosClient from './axiosClient';

const adminService = {
  // ==========================================
  // 1. Quản lý Người dùng (Users)
  // ==========================================
  getUsers: () => axiosClient.get('/User'),
  getUserById: (id) => axiosClient.get(`/User/${id}`),
  createUser: (data) => axiosClient.post('/User', data),
  updateUser: (id, data) => axiosClient.put(`/User/${id}`, data),
  deleteUser: (id) => axiosClient.delete(`/User/${id}`),

  // ==========================================
  // 2. Quản lý Vai trò (Roles)
  // ==========================================
  getRoles: () => axiosClient.get('/Role'),
  getRoleById: (id) => axiosClient.get(`/Role/${id}`),
  createRole: (data) => axiosClient.post('/Role', data),
  updateRole: (id, data) => axiosClient.put(`/Role/${id}`, data),
  deleteRole: (id) => axiosClient.delete(`/Role/${id}`),

  // ==========================================
  // 3. Quản lý Quyền hạn (Permissions)
  // ==========================================
  getPermissions: () => axiosClient.get('/Permission'),
  getPermissionById: (id) => axiosClient.get(`/Permission/${id}`),
  createPermission: (data) => axiosClient.post('/Permission', data),
  updatePermission: (id, data) => axiosClient.put(`/Permission/${id}`, data),
  deletePermission: (id) => axiosClient.delete(`/Permission/${id}`),

  // ==========================================
  // 4. Gán quyền User-Role (UserRoles)
  // ==========================================
  getUserRoles: () => axiosClient.get('/UserRole'),
  getUserRole: (userId, roleId) => axiosClient.get(`/UserRole/${userId}/${roleId}`),
  assignUserRole: (data) => axiosClient.post('/UserRole', data),
  updateUserRole: (userId, roleId, data) => axiosClient.put(`/UserRole/${userId}/${roleId}`, data),
  removeUserRole: (userId, roleId) => axiosClient.delete(`/UserRole/${userId}/${roleId}`),

  // ==========================================
  // 5. Nhật ký kiểm toán (Audit Logs)
  // ==========================================
  getAuditLogs: () => axiosClient.get('/AuditLog'),
  getAuditLogById: (id) => axiosClient.get(`/AuditLog/${id}`),
  getAuditLogsByEntity: (entityType, entityId) => axiosClient.get(`/AuditLog/entity/${entityType}/${entityId}`),
  createAuditLog: (data) => axiosClient.post('/AuditLog', data),

  // ==========================================
  // 6. Cấu hình Hệ thống (Configurations)
  // ==========================================
  getConfigurations: () => axiosClient.get('/Configuration'),
  getConfigurationById: (id) => axiosClient.get(`/Configuration/${id}`),
  getConfigurationByKey: (key) => axiosClient.get(`/Configuration/key/${key}`),
  createConfiguration: (data) => axiosClient.post('/Configuration', data),
  updateConfiguration: (id, data) => axiosClient.put(`/Configuration/${id}`, data),
  deleteConfiguration: (id) => axiosClient.delete(`/Configuration/${id}`),

  // ==========================================
  // 7. Báo cáo & Thống kê (Reports)
  // ==========================================
  getOverview: () => axiosClient.get('/Report/overview'),
  getStatsByFaculty: () => axiosClient.get('/Report/by-faculty'),
  getStatsByClass: () => axiosClient.get('/Report/by-class'),
  getStatsByLocation: () => axiosClient.get('/Report/by-location'),
  getStatsByStatus: () => axiosClient.get('/Report/by-status'),
  getStatsByTime: (params) => axiosClient.get('/Report/by-time', { params }),
  getSlaPerformance: () => axiosClient.get('/Report/sla-performance'),

  // ==========================================
  // 8. Dữ liệu Hệ thống: Hồ sơ, Yêu cầu, Sinh viên
  // ==========================================
  getRegistrations: (params) => axiosClient.get('/Registration', { params }),
  getRegistrationById: (id) => axiosClient.get(`/Registration/${id}`),
  getRequests: (params) => axiosClient.get('/Request', { params }),
  getRequestById: (id) => axiosClient.get(`/Request/${id}`),
  getStudents: (params) => axiosClient.get('/Student', { params }),
  getStudentById: (id) => axiosClient.get(`/Student/${id}`),
  getLandlords: () => axiosClient.get('/Landlord')
};

export default adminService;
