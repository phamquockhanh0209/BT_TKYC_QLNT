import axiosClient from './axiosClient';

export const studentService = {
  /**
   * Lấy thông tin sinh viên theo MSSV (StudentCode)
   * @param {string} studentCode
   */
  async getStudentByCode(studentCode) {
    return await axiosClient.get(`/Student/by-code/${studentCode}`);
  },

  async uploadAvatar(studentId, file) {
    const formData = new FormData();
    formData.append('file', file);
    return await axiosClient.post(`/Student/${studentId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Lấy danh sách hồ sơ ngoại trú của một sinh viên
   * @param {number|string} studentId
   */
  async getRegistrationsByStudent(studentId) {
    return await axiosClient.get(`/Registration/student/${studentId}`);
  },

  /**
   * Lấy phiên bản tài liệu theo DocumentId
   * @param {number|string} documentId
   */
  async getDocumentVersions(documentId) {
    return await axiosClient.get(`/DocumentVersion/document/${documentId}`);
  },

  /**
   * Nộp hồ sơ đăng ký ngoại trú hoàn chỉnh (gồm địa chỉ, chủ trọ, SLA)
   * @param {Object} data
   */
  async submitFullRegistration(data) {
    return await axiosClient.post('/Registration/submit-full', data);
  },

  /**
   * Tải tài liệu đính kèm (hợp đồng thuê trọ, giấy tạm trú...)
   * @param {File} file
   * @param {number|string} registrationId
   */
  async uploadDocument(file, registrationId, documentType) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('RegistrationId', registrationId);
    if (documentType) formData.append('DocumentType', documentType);

    return await axiosClient.post('/Document/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Lấy danh sách yêu cầu gắn với một hồ sơ đăng ký
   * @param {number|string} registrationId
   */
  async getRequestsByRegistration(registrationId) {
    return await axiosClient.get(`/Request/registration/${registrationId}`);
  },

  /**
   * Tạo yêu cầu mới (gia hạn, khiếu nại, thay đổi...)
   * @param {Object} data
   */
  async createRequest(data) {
    return await axiosClient.post('/Request', data);
  }
};

export default studentService;
