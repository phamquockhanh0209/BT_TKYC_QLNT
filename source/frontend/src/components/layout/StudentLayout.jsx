import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';

export default function StudentLayout() {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Header Điều hướng trên cùng */}
      <StudentNavbar />

      {/* Nội dung chính các trang */}
      <main className="flex-grow-1 py-4">
        <div className="container-fluid px-lg-4 px-3">
          <Outlet />
        </div>
      </main>

      {/* Footer giản dị thanh lịch */}
      <footer className="border-top py-3 text-center text-muted" style={{ fontSize: '0.8rem', backgroundColor: '#ffffff' }}>
        <div className="container">
          Hệ thống Quản lý Sinh viên Ngoại trú & Xác thực Nơi ở (TKYC) © 2026
        </div>
      </footer>
    </div>
  );
}
