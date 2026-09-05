import React, { useState, useEffect } from 'react';
import { Download, BarChart2, MapPin, Building, RotateCcw, FileText } from 'lucide-react';
import officerService from '../../../api/officerService';

export default function OfficerReportsPage() {
  const [facultyStats, setFacultyStats] = useState([]);
  const [locationStats, setLocationStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [facData, locData] = await Promise.all([
        officerService.getStatsByFaculty().catch(() => []),
        officerService.getStatsByLocation().catch(() => [])
      ]);
      setFacultyStats(Array.isArray(facData) ? facData : []);
      setLocationStats(Array.isArray(locData) ? locData : []);
    } catch (err) {
      console.error('Lỗi tải báo cáo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportPoliceCSV = () => {
    if (locationStats.length === 0) return;
    const headers = ['Tỉnh / Thành phố', 'Quận / Huyện', 'Phường / Xã', 'Số lượng sinh viên tạm trú'];
    const rows = locationStats.map(l => [
      `"${l.province || 'TP. Hồ Chí Minh'}"`,
      `"${l.district || ''}"`,
      `"${l.ward || ''}"`,
      l.studentCount || l.totalStudents || 1
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bao_cao_gui_cong_an_phuong_xa_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Báo Cáo & Thống Kê Ngoại Trú</h2>
          <p className="text-muted mb-0">Báo cáo phân bố sinh viên theo Khoa, Khu vực và trích xuất dữ liệu cho Công an địa phương</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button 
            type="button" 
            onClick={handleExportPoliceCSV}
            className="btn btn-success d-inline-flex align-items-center gap-1 fs-7"
            style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
          >
            <Download size={16} /> Xuất DS gửi Công an địa phương
          </button>
          <button type="button" onClick={loadData} className="btn btn-outline-secondary fs-7 d-inline-flex align-items-center gap-1">
            <RotateCcw size={15} /> Làm mới
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Cột 1: Phân bố theo Khoa */}
        <div className="col-lg-6 col-12">
          <div className="app-card-clean h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0 fs-6 text-uppercase d-flex align-items-center gap-2">
                <Building size={18} className="text-primary" /> Phân bố theo Khoa / Viện
              </h5>
              <span className="badge bg-light text-muted border">{facultyStats.length} khoa</span>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr className="text-muted fs-8">
                    <th>TÊN KHOA</th>
                    <th className="text-center">SỐ SINH VIÊN</th>
                    <th className="text-center">TỶ LỆ</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted fs-8">Đang tải...</td>
                    </tr>
                  ) : facultyStats.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted fs-8">Chưa có dữ liệu thống kê khoa.</td>
                    </tr>
                  ) : (
                    facultyStats.map((f, idx) => (
                      <tr key={idx}>
                        <td className="fw-semibold fs-7">{f.facultyName || f.faculty || 'Khoa chưa định danh'}</td>
                        <td className="text-center fw-bold fs-7 text-primary">{f.studentCount || f.total || 0}</td>
                        <td className="text-center fs-7 text-muted">
                          {f.percentage ? `${f.percentage}%` : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cột 2: Phân bố theo Địa bàn & Trích xuất Công an */}
        <div className="col-lg-6 col-12">
          <div className="app-card-clean h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0 fs-6 text-uppercase d-flex align-items-center gap-2">
                <MapPin size={18} className="text-success" /> Mật độ sinh viên theo Địa bàn (Phường/Xã)
              </h5>
              <span className="badge bg-light text-muted border">{locationStats.length} khu vực</span>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr className="text-muted fs-8">
                    <th>QUẬN / HUYỆN</th>
                    <th>PHƯỜNG / XÃ</th>
                    <th className="text-center">SỐ SINH VIÊN</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted fs-8">Đang tải...</td>
                    </tr>
                  ) : locationStats.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted fs-8">Chưa có dữ liệu địa bàn.</td>
                    </tr>
                  ) : (
                    locationStats.map((loc, idx) => (
                      <tr key={idx}>
                        <td className="fw-semibold fs-7">{loc.district || '—'}</td>
                        <td className="fs-7 text-dark">{loc.ward || '—'}</td>
                        <td className="text-center fw-bold fs-7 text-success">{loc.studentCount || loc.total || 1}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
