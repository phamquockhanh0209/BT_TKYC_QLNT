import React from 'react';
import { Outlet } from 'react-router-dom';
import ReviewerSidebar from './ReviewerSidebar';
import ReviewerHeader from './ReviewerHeader';

export default function ReviewerLayout() {
  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Cột Sidebar bên trái (Fixed) */}
      <ReviewerSidebar />

      {/* Vùng không gian xét duyệt chính bên phải */}
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        <ReviewerHeader />

        <main className="flex-grow-1 p-3 p-xl-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
