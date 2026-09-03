import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      {/* Cột Sidebar Quản trị viên (Fixed) */}
      <AdminSidebar />

      {/* Vùng Bảng điều khiển Console bên phải */}
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        <AdminHeader />

        <main className="flex-grow-1 p-3 p-xl-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
