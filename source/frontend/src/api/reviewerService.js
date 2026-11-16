import axiosClient from './axiosClient';

export const reviewerService = {
  /**
   * Lấy danh sách hàng đợi xét duyệt (hỗ trợ lọc status, search)
   * @param {Object} params - { status, search }
   */
  async getReviewQueue(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    const queryString = query.toString();
    return await axiosClient.get(`/Registration${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Lấy chi tiết hồ sơ ngoại trú
   * @param {number|string} id
   */
  async getRegistrationDetail(id) {
    return await axiosClient.get(`/Registration/${id}`);
  },

  /**
   * Thực hiện hành động thẩm định hồ sơ (PASS, REQUEST_INFO, REJECT)
   * @param {number|string} id
   * @param {Object} data - { action, note, approverId }
   */
  async submitReviewAction(id, data) {
    return await axiosClient.post(`/Registration/${id}/review-action`, data);
  },

  /**
   * Cập nhật kết quả kiểm tra một tài liệu
   * @param {number|string} documentId
   * @param {string} status - VALID, APPROVED hoặc REJECTED
   */
  async verifyDocument(documentId, status, note) {
    return await axiosClient.put(`/Document/${documentId}/verify`, {
      documentStatus: status,
      note
    });
  },

  /**
   * Lấy danh sách phê duyệt
   */
  async getApprovals() {
    return await axiosClient.get('/Approval');
  },

  /**
   * Lấy các phiên bản tài liệu
   * @param {number|string} documentId
   */
  async getDocumentVersions(documentId) {
    return await axiosClient.get(`/DocumentVersion/document/${documentId}`);
  },

  /**
   * Lấy danh sách hồ sơ đã xử lý (ACTIVE, APPROVED hoặc REJECTED)
   */
  async getProcessedRegistrations(params = {}) {
    const res = await axiosClient.get('/Registration');
    if (Array.isArray(res)) {
      return res.filter(r => r.status === 'ACTIVE' || r.status === 'APPROVED' || r.status === 'REJECTED');
    }
    return [];
  },

  /**
   * Lấy danh sách yêu cầu kiến nghị của sinh viên
   */
  async getRequests(params = {}) {
    return await axiosClient.get('/Request');
  },

  /**
   * Phê duyệt yêu cầu kiến nghị (RENEWAL / CHANGE_ADDRESS / TERMINATION)
   */
  async approveRequest(id) {
    return await axiosClient.post(`/Request/${id}/approve`);
  },

  /**
   * Từ chối yêu cầu kiến nghị
   */
  async rejectRequest(id, reason) {
    return await axiosClient.post(`/Request/${id}/reject`, { reason });
  },

  /**
   * Cập nhật trạng thái yêu cầu (APPROVED, REJECTED)
   */
  async updateRequest(id, data) {
    return await axiosClient.put(`/Request/${id}`, data);
  },

  /**
   * Lấy dữ liệu báo cáo thống kê cho Reviewer
   */
  async getOverview() {
    return await axiosClient.get('/Report/overview');
  },

  async getSlaPerformance() {
    return await axiosClient.get('/Report/sla-performance');
  },

  async getStatsByFaculty() {
    return await axiosClient.get('/Report/by-faculty');
  },

  async getStatsByStatus() {
    return await axiosClient.get('/Report/by-status');
  }
};

export default reviewerService;
