import React from 'react';
import { Outlet } from 'react-router-dom';
import OfficerSidebar from './OfficerSidebar';
import OfficerHeader from './OfficerHeader';

export default function OfficerLayout() {
  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Cột Sidebar bên trái (Fixed) */}
      <OfficerSidebar />

      {/* Vùng nội dung chính bên phải */}
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        <OfficerHeader />

        <main className="flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
