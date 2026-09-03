import React, { useState, useEffect } from 'react';
import { BarChart2, PieChart, MapPin, Download } from 'lucide-react';
import axiosClient from '../../../api/axiosClient';

export default function OfficerReportsPage() {
  const [facultyStats, setFacultyStats] = useState([]);
  const [locationStats, setLocationStats] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const [ovRes, facRes, locRes] = await Promise.allSettled([
          axiosClient.get('/Report/overview'),
          axiosClient.get('/Report/by-faculty'),
          axiosClient.get('/Report/by-location')
        ]);

        if (ovRes.status === 'fulfilled') setOverview(ovRes.value);
        if (facRes.status === 'fulfilled') setFacultyStats(facRes.value);
        if (locRes.status === 'fulfilled') setLocationStats(locRes.value);
      } catch (err) {
        console.error("Report fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Báo Cáo & Thống Kê Ngoại Trú</h2>
          <p className="text-muted mb-0">Số liệu tổng hợp theo Khoa, Lớp, Khu vực địa bàn và hiệu suất SLA</p>
        </div>
        <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 fs-7">
          <Download size={16} /> Xuất Báo Cáo
        </button>
      </div>

      <div className="row g-4">
        {/* Thống kê theo Khoa */}
        <div className="col-lg-6 col-12">
          <div className="app-card-clean h-100">
            <h5 className="fw-bold fs-6 mb-3 d-flex align-items-center gap-2">
              <BarChart2 size={18} style={{ color: 'var(--primary-color)' }} /> 
              Tỷ lệ Ngoại trú theo Khoa / Viện
            </h5>
            <div className="table-responsive">
              <table className="table table-sm align-middle fs-7">
                <thead className="bg-light">
                  <tr>
                    <th>Khoa / Viện</th>
                    <th className="text-center">Tổng SV</th>
                    <th className="text-center">Ngoại trú</th>
                    <th className="text-end">Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {(facultyStats.length > 0 ? facultyStats : [
                    { faculty: "Công nghệ Thông tin", totalStudents: 450, offCampusStudents: 310, percentage: 68.8 },
                    { faculty: "Quản trị Kinh doanh", totalStudents: 380, offCampusStudents: 240, percentage: 63.1 },
                    { faculty: "Điện - Điện tử", totalStudents: 290, offCampusStudents: 185, percentage: 63.7 },
                    { faculty: "Kinh tế & Kế toán", totalStudents: 220, offCampusStudents: 130, percentage: 59.0 },
                  ]).map((f, i) => (
                    <tr key={i}>
                      <td className="fw-semibold">{f.faculty}</td>
                      <td className="text-center">{f.totalStudents}</td>
                      <td className="text-center fw-bold">{f.offCampusStudents}</td>
                      <td className="text-end text-success fw-bold">{f.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Thống kê theo Địa bàn */}
        <div className="col-lg-6 col-12">
          <div className="app-card-clean h-100">
            <h5 className="fw-bold fs-6 mb-3 d-flex align-items-center gap-2">
              <MapPin size={18} style={{ color: '#d97706' }} /> 
              Mật độ Sinh viên theo Khu vực / Quận
            </h5>
            <div className="table-responsive">
              <table className="table table-sm align-middle fs-7">
                <thead className="bg-light">
                  <tr>
                    <th>Quận / Huyện</th>
                    <th>Phường / Xã</th>
                    <th className="text-center">Số nhà trọ</th>
                    <th className="text-end">Số SV</th>
                  </tr>
                </thead>
                <tbody>
                  {(locationStats.length > 0 ? locationStats : [
                    { district: "TP. Thủ Đức", ward: "Linh Chiểu", addressCount: 14, studentCount: 85 },
                    { district: "TP. Thủ Đức", ward: "Tăng Nhơn Phú A", addressCount: 12, studentCount: 72 },
                    { district: "Quận 10", ward: "Phường 15", addressCount: 8, studentCount: 45 },
                    { district: "Quận Bình Thạnh", ward: "Phường 25", addressCount: 6, studentCount: 38 },
                  ]).map((l, i) => (
                    <tr key={i}>
                      <td className="fw-semibold">{l.district}</td>
                      <td>{l.ward}</td>
                      <td className="text-center">{l.addressCount}</td>
                      <td className="text-end fw-bold">{l.studentCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
