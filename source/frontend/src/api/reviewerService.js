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
  }
};

export default reviewerService;
