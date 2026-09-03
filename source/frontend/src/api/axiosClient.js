import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5005/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động gắn Bearer Token nếu người dùng đã đăng nhập
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi tập trung (401 -> chuyển về login)
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
