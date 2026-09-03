import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Student Layout & Pages
import StudentLayout from '../components/layout/StudentLayout';

// Admin Layout & Pages
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboardPage from '../pages/admin/dashboard/AdminDashboardPage';
import AdminUsersPage from '../pages/admin/users/AdminUsersPage';
import AdminStudentsPage from '../pages/admin/students/AdminStudentsPage';
import AdminRegistrationsPage from '../pages/admin/registrations/AdminRegistrationsPage';
import AdminRequestsPage from '../pages/admin/requests/AdminRequestsPage';
import AdminRolesPage from '../pages/admin/roles/AdminRolesPage';
import AdminPermissionsPage from '../pages/admin/permissions/AdminPermissionsPage';
import AdminUserRolesPage from '../pages/admin/user-roles/AdminUserRolesPage';
import AdminSlaPage from '../pages/admin/sla/AdminSlaPage';
import AdminReportsPage from '../pages/admin/reports/AdminReportsPage';
import AdminConfigPage from '../pages/admin/config/AdminConfigPage';
import AdminAuditPage from '../pages/admin/audit/AdminAuditPage';
import OverviewPage from '../pages/student/overview/OverviewPage';
import RegistrationPage from '../pages/student/registration/RegistrationPage';
import ResidencePage from '../pages/student/residence/ResidencePage';
import DocumentPage from '../pages/student/documents/DocumentPage';
import RequestPage from '../pages/student/requests/RequestPage';
import NotificationPage from '../pages/student/notifications/NotificationPage';
import ProfilePage from '../pages/student/profile/ProfilePage';

// Officer Layout & Pages
import OfficerLayout from '../components/layout/OfficerLayout';
import OfficerDashboardPage from '../pages/officer/dashboard/OfficerDashboardPage';
import OfficerRegistrationsPage from '../pages/officer/registrations/OfficerRegistrationsPage';
import OfficerRequestsPage from '../pages/officer/requests/OfficerRequestsPage';
import OfficerStudentsPage from '../pages/officer/students/OfficerStudentsPage';
import OfficerLandlordsPage from '../pages/officer/landlords/OfficerLandlordsPage';
import OfficerDocumentsPage from '../pages/officer/documents/OfficerDocumentsPage';
import OfficerSlaPage from '../pages/officer/sla/OfficerSlaPage';
import OfficerNotificationsPage from '../pages/officer/notifications/OfficerNotificationsPage';
import OfficerReportsPage from '../pages/officer/reports/OfficerReportsPage';

// Reviewer Layout & Pages
import ReviewerLayout from '../components/layout/ReviewerLayout';
import ReviewerWorkspacePage from '../pages/reviewer/workspace/ReviewerWorkspacePage';
import ReviewerProcessedPage from '../pages/reviewer/processed/ReviewerProcessedPage';
import ReviewerRequestsPage from '../pages/reviewer/requests/ReviewerRequestsPage';
import ReviewerAdditionalInfoPage from '../pages/reviewer/additional-info/ReviewerAdditionalInfoPage';
import ReviewerOverduePage from '../pages/reviewer/overdue/ReviewerOverduePage';
import ReviewerReportsPage from '../pages/reviewer/reports/ReviewerReportsPage';
import ReviewerStatsPage from '../pages/reviewer/stats/ReviewerStatsPage';

// Auth Page
import LoginPage from '../pages/auth/LoginPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Trang Đăng nhập */}
      <Route path="/login" element={<LoginPage />} />

      {/* 1. Cổng thông tin Sinh viên (Student Portal) */}
      <Route element={<StudentLayout />}>
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/residence" element={<ResidencePage />} />
        <Route path="/documents" element={<DocumentPage />} />
        <Route path="/requests" element={<RequestPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* 2. Cổng tác nghiệp Cán bộ (Officer Work Queue Portal) */}
      <Route path="/officer" element={<OfficerLayout />}>
        <Route index element={<Navigate to="/officer/dashboard" replace />} />
        <Route path="dashboard" element={<OfficerDashboardPage />} />
        <Route path="registrations" element={<OfficerRegistrationsPage />} />
        <Route path="requests" element={<OfficerRequestsPage />} />
        <Route path="students" element={<OfficerStudentsPage />} />
        <Route path="landlords" element={<OfficerLandlordsPage />} />
        <Route path="documents" element={<OfficerDocumentsPage />} />
        <Route path="sla" element={<OfficerSlaPage />} />
        <Route path="notifications" element={<OfficerNotificationsPage />} />
        <Route path="reports" element={<OfficerReportsPage />} />
      </Route>

      {/* 3. Cổng không gian xét duyệt (Reviewer Workspace Portal) */}
      <Route path="/reviewer" element={<ReviewerLayout />}>
        <Route index element={<Navigate to="/reviewer/workspace" replace />} />
        <Route path="workspace" element={<ReviewerWorkspacePage />} />
        <Route path="processed" element={<ReviewerProcessedPage />} />
        <Route path="requests" element={<ReviewerRequestsPage />} />
        <Route path="additional-info" element={<ReviewerAdditionalInfoPage />} />
        <Route path="overdue" element={<ReviewerOverduePage />} />
        <Route path="reports" element={<ReviewerReportsPage />} />
        <Route path="stats" element={<ReviewerStatsPage />} />
      </Route>

      {/* 4. Cổng Quản trị Hệ thống (Admin System Console) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="registrations" element={<AdminRegistrationsPage />} />
        <Route path="requests" element={<AdminRequestsPage />} />
        <Route path="roles" element={<AdminRolesPage />} />
        <Route path="permissions" element={<AdminPermissionsPage />} />
        <Route path="user-roles" element={<AdminUserRolesPage />} />
        <Route path="sla" element={<AdminSlaPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="config" element={<AdminConfigPage />} />
        <Route path="audit" element={<AdminAuditPage />} />
      </Route>

      {/* Mặc định chuyển hướng tới /overview */}
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}
