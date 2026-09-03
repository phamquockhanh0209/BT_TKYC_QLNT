import React, { useState } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';

export default function AdminConfigPage() {
  const [config, setConfig] = useState({
    slaOfficerHours: 48,
    slaReviewerHours: 72,
    slaSupplementHours: 120,
    maxDocumentSizeMB: 10,
    allowedDocumentTypes: "pdf,jpg,jpeg,png",
    systemEmail: "ngoaitru@tkyc.edu.vn",
    notificationEnabled: true,
    autoExpireEnabled: true,
    autoExpireDays: 365
  });

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    alert("✅ Đã lưu cấu hình hệ thống thành công!\n\n(Trong thực tế sẽ gọi PATCH /api/Config hoặc PUT /api/SystemSettings)");
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Cấu Hình Hệ Thống</h2>
          <p className="text-muted mb-0">Thiết lập tham số hoạt động của hệ thống quản lý ngoại trú</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} /> Đặt lại mặc định
          </button>
          <button 
            className="btn d-inline-flex align-items-center gap-1 fs-7 fw-semibold"
            style={{ backgroundColor: '#10b981', color: '#fff', borderColor: '#10b981' }}
            onClick={handleSave}
          >
            <Save size={16} /> Lưu cấu hình
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* SLA Configuration */}
        <div className="col-xl-6 col-12">
          <div className="app-card-clean bg-white border p-4">
            <div className="fw-bold fs-5 text-dark mb-3 d-flex align-items-center gap-2">
              <span>⏱</span> Cấu Hình Ngưỡng SLA
            </div>
            <div className="d-flex flex-column gap-3">
              <div>
                <label className="form-label fs-7 fw-semibold text-dark">Thời hạn Cán bộ xử lý hồ sơ (giờ)</label>
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  value={config.slaOfficerHours}
                  onChange={e => handleChange('slaOfficerHours', e.target.value)}
                />
                <div className="form-text">Sau {config.slaOfficerHours}h cán bộ chưa xử lý sẽ bị cảnh báo vi phạm SLA</div>
              </div>
              <div>
                <label className="form-label fs-7 fw-semibold text-dark">Thời hạn Reviewer xét duyệt chính thức (giờ)</label>
                <input 
                  type="number" 
                  className="form-control form-control-sm"
                  value={config.slaReviewerHours}
                  onChange={e => handleChange('slaReviewerHours', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label fs-7 fw-semibold text-dark">Thời hạn sinh viên bổ sung giấy tờ (giờ)</label>
                <input 
                  type="number" 
                  className="form-control form-control-sm"
                  value={config.slaSupplementHours}
                  onChange={e => handleChange('slaSupplementHours', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Document Configuration */}
        <div className="col-xl-6 col-12">
          <div className="app-card-clean bg-white border p-4">
            <div className="fw-bold fs-5 text-dark mb-3 d-flex align-items-center gap-2">
              <span>📄</span> Cấu Hình Tải Lên Tài Liệu
            </div>
            <div className="d-flex flex-column gap-3">
              <div>
                <label className="form-label fs-7 fw-semibold text-dark">Kích thước tệp tối đa (MB)</label>
                <input 
                  type="number" 
                  className="form-control form-control-sm"
                  value={config.maxDocumentSizeMB}
                  onChange={e => handleChange('maxDocumentSizeMB', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label fs-7 fw-semibold text-dark">Định dạng tệp chấp nhận</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm"
                  value={config.allowedDocumentTypes}
                  onChange={e => handleChange('allowedDocumentTypes', e.target.value)}
                />
                <div className="form-text">Phân cách bởi dấu phẩy, ví dụ: pdf,jpg,png</div>
              </div>
              <div>
                <label className="form-label fs-7 fw-semibold text-dark">Email hệ thống gửi thông báo</label>
                <input 
                  type="email" 
                  className="form-control form-control-sm"
                  value={config.systemEmail}
                  onChange={e => handleChange('systemEmail', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Settings */}
        <div className="col-12">
          <div className="app-card-clean bg-white border p-4">
            <div className="fw-bold fs-5 text-dark mb-3 d-flex align-items-center gap-2">
              <span>⚙️</span> Tùy Chọn Vận Hành Hệ Thống
            </div>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="d-flex align-items-center justify-content-between p-3 border rounded-3">
                  <div>
                    <div className="fw-semibold fs-7 text-dark">Gửi Email Thông Báo</div>
                    <div className="text-muted fs-8">Tự động gửi email cho sinh viên và cán bộ khi trạng thái hồ sơ thay đổi</div>
                  </div>
                  <div className="form-check form-switch ms-3">
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      checked={config.notificationEnabled}
                      onChange={e => handleChange('notificationEnabled', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center justify-content-between p-3 border rounded-3">
                  <div>
                    <div className="fw-semibold fs-7 text-dark">Tự Động Hết Hạn Hồ Sơ</div>
                    <div className="text-muted fs-8">Hồ sơ sẽ tự động chuyển sang EXPIRED sau {config.autoExpireDays} ngày</div>
                  </div>
                  <div className="form-check form-switch ms-3">
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      checked={config.autoExpireEnabled}
                      onChange={e => handleChange('autoExpireEnabled', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center justify-content-between p-3 border rounded-3">
                  <div>
                    <div className="fw-semibold fs-7 text-dark">Hồ sơ tự hết hạn sau (ngày)</div>
                    <div className="text-muted fs-8">Hạn mặc định kể từ ngày được phê duyệt</div>
                  </div>
                  <input 
                    type="number" 
                    className="form-control form-control-sm ms-3"
                    style={{ width: '80px' }}
                    value={config.autoExpireDays}
                    onChange={e => handleChange('autoExpireDays', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
