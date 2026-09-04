import axiosClient from './axiosClient';

const AUTH_TOKEN_KEY = 'token';
const AUTH_USER_KEY = 'user';

export const authService = {
  /**
   * Đăng nhập hệ thống (Student với MSSV, hoặc Officer/Reviewer/Admin)
   * @param {string} username - MSSV hoặc tên đăng nhập
   * @param {string} password - Mật khẩu
   */
  async login(username, password) {
    const response = await axiosClient.post('/Auth/login', {
      username: username.trim(),
      password: password
    });

    if (response && response.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response));
    }

    return response;
  },

  /**
   * Đăng xuất khỏi hệ thống
   */
  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = '/login';
  },

  /**
   * Lấy thông tin người dùng đang đăng nhập
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(AUTH_USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  /**
   * Lấy Token JWT hiện tại
   */
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  isAuthenticated() {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Lấy danh sách tài khoản sinh viên mẫu theo quy tắc MSSV
   */
  async getStudentAccounts() {
    return await axiosClient.get('/SeedData/student-accounts');
  }
};

export default authService;
