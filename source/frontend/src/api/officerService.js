import axiosClient from './axiosClient';

/**
 * Service kết nối dữ liệu dành cho Cán bộ Quản lý (Officer Portal)
 */
export const officerService = {
  /**
   * Lấy báo cáo tổng quan số lượng hồ sơ, sinh viên, tỷ lệ duyệt
   */
  async getDashboardOverview() {
    return await axiosClient.get('/Report/overview');
  },

  /**
   * Thống kê hồ sơ theo trạng thái (SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, v.v.)
   */
  async getStatsByStatus() {
    return await axiosClient.get('/Report/by-status');
  },

  /**
   * Thống kê hiệu suất SLA xử lý hồ sơ (trung bình giờ, quá hạn)
   */
  async getSlaPerformance() {
    return await axiosClient.get('/Report/sla-performance');
  },

  /**
   * Lấy danh sách hàng đợi / hồ sơ ngoại trú
   * @param {Object} params - { status, search }
   */
  async getWorkQueue(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    const queryString = query.toString();
    return await axiosClient.get(`/Registration${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Lấy chi tiết một hồ sơ ngoại trú kèm thông tin sinh viên, nơi ở, chủ trọ, giấy tờ
   * @param {number|string} id
   */
  async getRegistrationDetail(id) {
    return await axiosClient.get(`/Registration/${id}`);
  },

  /**
   * Xử lý phê duyệt hồ sơ: APPROVE (Duyệt chính thức), REQUEST_INFO (Yêu cầu bổ sung), REJECT (Từ chối)
   * @param {number|string} id
   * @param {Object} data - { action: 'APPROVE'|'REQUEST_INFO'|'REJECT', note, approverId }
   */
  async processRegistration(id, data) {
    return await axiosClient.post(`/Registration/${id}/review-action`, data);
  },

  /**
   * Lấy danh sách sinh viên toàn trường
   */
  async getStudents() {
    return await axiosClient.get('/Student');
  },

  /**
   * Lấy danh sách chủ trọ trên địa bàn
   */
  async getLandlords() {
    return await axiosClient.get('/Landlord');
  },

  /**
   * Lấy danh sách các yêu cầu của sinh viên (gia hạn, đổi phòng, khiếu nại)
   */
  async getRequests() {
    return await axiosClient.get('/Request');
  },

  /**
   * Cập nhật / xử lý một yêu cầu
   * @param {number|string} id
   * @param {Object} data
   */
  async updateRequest(id, data) {
    return await axiosClient.put(`/Request/${id}`, data);
  },

  /**
   * Thống kê sinh viên ngoại trú theo Khoa
   */
  async getStatsByFaculty() {
    return await axiosClient.get('/Report/by-faculty');
  },

  /**
   * Thống kê sinh viên ngoại trú theo Vị trí (Quận/Huyện, Phường/Xã)
   */
  async getStatsByLocation() {
    return await axiosClient.get('/Report/by-location');
  }
};

export default officerService;
