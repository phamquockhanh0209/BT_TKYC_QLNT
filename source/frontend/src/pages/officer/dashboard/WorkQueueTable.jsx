import React, { useState } from 'react';
import { Search, RotateCcw, Eye, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function WorkQueueTable({ onProcess }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedFaculty, setSelectedFaculty] = useState('ALL');

  const rows = [
    {
      id: 1,
      code: "REG-2026-00156",
      studentName: "Nguyễn Văn An",
      studentCode: "2021001234",
      faculty: "Khoa CNTT",
      submittedDate: "03/09/2026",
      submittedTime: "10:30",
      status: "CHỜ XỬ LÝ",
      statusType: "pending",
      slaText: "Còn 1 ngày (04/09)",
      slaType: "normal"
    },
    {
      id: 2,
      code: "REG-2026-00155",
      studentName: "Trần Thị Bình",
      studentCode: "2021001235",
      faculty: "Khoa Kinh tế",
      submittedDate: "03/09/2026",
      submittedTime: "09:15",
      status: "CHỜ XỬ LÝ",
      statusType: "pending",
      slaText: "Còn 2 ngày (05/09)",
      slaType: "normal"
    },
    {
      id: 3,
      code: "REG-2026-00154",
      studentName: "Lê Văn Cường",
      studentCode: "2021001236",
      faculty: "Khoa Điện",
      submittedDate: "02/09/2026",
      submittedTime: "16:45",
      status: "YÊU CẦU BỔ SUNG",
      statusType: "info",
      slaText: "Quá hạn (01/09)",
      slaType: "overdue"
    },
    {
      id: 4,
      code: "REG-2026-00153",
      studentName: "Phạm Thị Dung",
      studentCode: "2021001237",
      faculty: "Khoa CNTT",
      submittedDate: "02/09/2026",
      submittedTime: "14:20",
      status: "CHỜ XỬ LÝ",
      statusType: "pending",
      slaText: "Còn 3 ngày (06/09)",
      slaType: "normal"
    },
    {
      id: 5,
      code: "REG-2026-00152",
      studentName: "Hoàng Văn Em",
      studentCode: "2021001238",
      faculty: "Khoa Cơ khí",
      submittedDate: "01/09/2026",
      submittedTime: "11:05",
      status: "QUÁ HẠN",
      statusType: "danger",
      slaText: "Quá hạn (31/08)",
      slaType: "overdue"
    }
  ];

  return (
    <div className="app-card-clean mb-4">
      {/* Tiêu đề bảng công việc */}
      <h3 className="fw-bold fs-5 mb-3 text-uppercase" style={{ color: 'var(--text-dark)', letterSpacing: '0.04em' }}>
        DANH SÁCH HỒ SƠ CẦN XỬ LÝ
      </h3>

      {/* Thanh công cụ tìm kiếm và lọc */}
      <div className="row g-2 align-items-center mb-3">
        {/* Ô tìm kiếm */}
        <div className="col-lg-4 col-md-12">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0 fs-7"
              placeholder="Tìm kiếm theo MSSV, họ tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Dropdown Trạng thái */}
        <div className="col-lg-2 col-sm-4">
          <select 
            className="form-select fs-7" 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">Trạng thái</option>
            <option value="CHỜ XỬ LÝ">Chờ xử lý</option>
            <option value="YÊU CẦU BỔ SUNG">Yêu cầu bổ sung</option>
            <option value="QUÁ HẠN">Quá hạn</option>
          </select>
        </div>

        {/* Dropdown Khoa/Viện */}
        <div className="col-lg-2 col-sm-4">
          <select 
            className="form-select fs-7"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            <option value="ALL">Khoa/Viện</option>
            <option value="Khoa CNTT">Khoa CNTT</option>
            <option value="Khoa Kinh tế">Khoa Kinh tế</option>
            <option value="Khoa Điện">Khoa Điện</option>
            <option value="Khoa Cơ khí">Khoa Cơ khí</option>
          </select>
        </div>

        {/* Dropdown Ngày nộp */}
        <div className="col-lg-2 col-sm-4">
          <select className="form-select fs-7">
            <option value="ALL">Ngày nộp</option>
            <option value="TODAY">Hôm nay</option>
            <option value="WEEK">Tuần này</option>
          </select>
        </div>

        {/* Nút Làm mới */}
        <div className="col-lg-2 col-sm-12 text-lg-end">
          <button 
            type="button" 
            className="btn btn-outline-secondary fs-7 d-inline-flex align-items-center gap-1 w-100 justify-content-center"
          >
            <RotateCcw size={15} /> Làm mới
          </button>
        </div>
      </div>

      {/* Bảng hồ sơ */}
      <div className="table-responsive">
        <table className="table align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0 6px' }}>
          <thead className="bg-light">
            <tr className="text-muted" style={{ fontSize: '0.78rem', letterSpacing: '0.03em' }}>
              <th className="py-2 ps-3 border-0">Mã hồ sơ</th>
              <th className="py-2 border-0">Sinh viên</th>
              <th className="py-2 border-0">Khoa/Viện</th>
              <th className="py-2 border-0">Ngày nộp</th>
              <th className="py-2 border-0">Trạng thái</th>
              <th className="py-2 border-0">SLA</th>
              <th className="py-2 pe-3 text-end border-0">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-bottom border-light">
                {/* Mã hồ sơ */}
                <td className="ps-3 py-3 fw-bold text-dark fs-7">
                  {row.code}
                </td>

                {/* Sinh viên */}
                <td className="py-3">
                  <div className="fw-bold text-dark fs-7 lh-sm">{row.studentName}</div>
                  <small className="text-muted fs-8">{row.studentCode}</small>
                </td>

                {/* Khoa/Viện */}
                <td className="py-3 text-muted fs-7">
                  {row.faculty}
                </td>

                {/* Ngày nộp */}
                <td className="py-3 fs-7">
                  <div className="text-dark fw-medium lh-sm">{row.submittedDate}</div>
                  <small className="text-muted fs-8">{row.submittedTime}</small>
                </td>

                {/* Trạng thái */}
                <td className="py-3">
                  {row.statusType === 'pending' && (
                    <span 
                      className="badge fw-bold px-2 py-1 text-uppercase" 
                      style={{ backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '4px', fontSize: '0.72rem' }}
                    >
                      {row.status}
                    </span>
                  )}
                  {row.statusType === 'info' && (
                    <span 
                      className="badge fw-bold px-2 py-1 text-uppercase" 
                      style={{ backgroundColor: '#e0e7ff', color: '#3730a3', borderRadius: '4px', fontSize: '0.72rem' }}
                    >
                      {row.status}
                    </span>
                  )}
                  {row.statusType === 'danger' && (
                    <span 
                      className="badge fw-bold px-2 py-1 text-uppercase" 
                      style={{ backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px', fontSize: '0.72rem' }}
                    >
                      {row.status}
                    </span>
                  )}
                </td>

                {/* SLA */}
                <td className="py-3 fw-semibold fs-7" style={{ color: row.slaType === 'overdue' ? '#dc2626' : '#16a34a' }}>
                  {row.slaText}
                </td>

                {/* Thao tác: Nút Xem + Nút Xử lý */}
                <td className="pe-3 py-3 text-end">
                  <div className="d-inline-flex align-items-center gap-2">
                    <button 
                      type="button" 
                      className="btn btn-sm btn-outline-secondary p-1 rounded-2" 
                      title="Xem trước hồ sơ"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-sm text-white fw-bold px-3 py-1 rounded-2"
                      style={{ backgroundColor: 'var(--primary-color)', fontSize: '0.8rem' }}
                      onClick={() => onProcess && onProcess(row)}
                    >
                      Xử lý
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between pt-3 mt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
        <div className="text-muted fs-7 mb-2 mb-sm-0">
          Hiển thị 1 - 5 trong 24 hồ sơ
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Pagination buttons */}
          <div className="btn-group btn-group-sm" role="group">
            <button type="button" className="btn btn-outline-secondary p-1">
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="btn btn-success fw-bold" style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
              1
            </button>
            <button type="button" className="btn btn-outline-secondary">2</button>
            <button type="button" className="btn btn-outline-secondary">3</button>
            <button type="button" className="btn btn-outline-secondary disabled">...</button>
            <button type="button" className="btn btn-outline-secondary">5</button>
            <button type="button" className="btn btn-outline-secondary p-1">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Items per page */}
          <select className="form-select form-select-sm" style={{ width: '100px' }} defaultValue="5">
            <option value="5">5 / trang</option>
            <option value="10">10 / trang</option>
            <option value="20">20 / trang</option>
          </select>
        </div>
      </div>
    </div>
  );
}
