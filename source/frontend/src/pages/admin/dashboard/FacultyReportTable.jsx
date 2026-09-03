import React, { useState, useEffect } from 'react';
import { School, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';

export default function FacultyReportTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosClient.get('/Report/by-faculty');
        if (res && Array.isArray(res) && res.length > 0) {
          setData(res);
        } else {
          // Fallback mock
          setData([
            { faculty: "Công nghệ Thông tin", totalStudents: 450, offCampusStudents: 310, percentage: 68.8 },
            { faculty: "Quản trị Kinh doanh", totalStudents: 380, offCampusStudents: 240, percentage: 63.1 },
            { faculty: "Điện - Điện tử", totalStudents: 290, offCampusStudents: 185, percentage: 63.7 },
            { faculty: "Kinh tế & Kế toán", totalStudents: 220, offCampusStudents: 130, percentage: 59.0 },
            { faculty: "Ngoại ngữ", totalStudents: 180, offCampusStudents: 105, percentage: 58.3 }
          ]);
        }
      } catch (e) {
        setData([
          { faculty: "Công nghệ Thông tin", totalStudents: 450, offCampusStudents: 310, percentage: 68.8 },
          { faculty: "Quản trị Kinh doanh", totalStudents: 380, offCampusStudents: 240, percentage: 63.1 },
          { faculty: "Điện - Điện tử", totalStudents: 290, offCampusStudents: 185, percentage: 63.7 },
          { faculty: "Kinh tế & Kế toán", totalStudents: 220, offCampusStudents: 130, percentage: 59.0 },
          { faculty: "Ngoại ngữ", totalStudents: 180, offCampusStudents: 105, percentage: 58.3 }
        ]);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="app-card-clean p-4 h-100 bg-white border">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <div className="text-uppercase fw-bold text-muted fs-8" style={{ letterSpacing: '0.04em' }}>
            THỐNG KÊ THEO KHOA / VIỆN
          </div>
          <div className="fw-bold fs-5 text-dark">Tỷ lệ sinh viên ngoại trú</div>
        </div>
        <Link to="/admin/reports" className="link-action fs-8">
          Chi tiết <ArrowRight size={14} />
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-sm align-middle mb-0 fs-7">
          <thead className="bg-light">
            <tr className="text-muted" style={{ fontSize: '0.75rem' }}>
              <th className="py-2 border-0">Khoa / Viện</th>
              <th className="py-2 text-center border-0">Tổng SV</th>
              <th className="py-2 text-center border-0">Ngoại trú</th>
              <th className="py-2 text-end border-0">Tỷ lệ</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((row, idx) => (
              <tr key={idx} className="border-bottom border-light">
                <td className="py-2 fw-semibold text-dark d-flex align-items-center gap-2">
                  <School size={15} className="text-muted" />
                  <span>{row.faculty}</span>
                </td>
                <td className="py-2 text-center text-muted">{row.totalStudents}</td>
                <td className="py-2 text-center fw-bold text-dark">{row.offCampusStudents}</td>
                <td className="py-2 text-end text-success fw-bold">{row.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
