import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, CheckCircle2 } from 'lucide-react';
import adminService from '../../../api/adminService';

export default function AdminConfigPage() {
  const [configList, setConfigList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formConfig, setFormConfig] = useState({
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

  const loadConfigurations = async () => {
    setLoading(true);
    try {
      const res = await adminService.getConfigurations();
      if (res && Array.isArray(res)) {
        setConfigList(res);
        const newForm = { ...formConfig };
        res.forEach(item => {
          if (item.configKey === 'SLA_OFFICER_HOURS') newForm.slaOfficerHours = Number(item.configValue) || 48;
          if (item.configKey === 'SLA_REVIEWER_HOURS') newForm.slaReviewerHours = Number(item.configValue) || 72;
          if (item.configKey === 'SLA_SUPPLEMENT_HOURS') newForm.slaSupplementHours = Number(item.configValue) || 120;
          if (item.configKey === 'MAX_DOCUMENT_SIZE_MB') newForm.maxDocumentSizeMB = Number(item.configValue) || 10;
          if (item.configKey === 'ALLOWED_DOCUMENT_TYPES') newForm.allowedDocumentTypes = item.configValue || "pdf,jpg,jpeg,png";
          if (item.configKey === 'SYSTEM_EMAIL') newForm.systemEmail = item.configValue || "ngoaitru@tkyc.edu.vn";
          if (item.configKey === 'NOTIFICATION_ENABLED') newForm.notificationEnabled = item.configValue === 'true';
          if (item.configKey === 'AUTO_EXPIRE_DAYS') newForm.autoExpireDays = Number(item.configValue) || 365;
        });
        setFormConfig(newForm);
      }
    } catch (err) {
      console.error("Failed to load configurations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigurations();
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleChange = (key, value) => {
    setFormConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payloadMap = [
        { key: 'SLA_OFFICER_HOURS', val: String(formConfig.slaOfficerHours), type: 'INT', desc: 'Thời hạn cán bộ xử lý hồ sơ' },
        { key: 'SLA_REVIEWER_HOURS', val: String(formConfig.slaReviewerHours), type: 'INT', desc: 'Thời hạn chuyên viên thẩm định hồ sơ' },
        { key: 'SLA_SUPPLEMENT_HOURS', val: String(formConfig.slaSupplementHours), type: 'INT', desc: 'Thời hạn sinh viên nộp bổ sung' },
        { key: 'MAX_DOCUMENT_SIZE_MB', val: String(formConfig.maxDocumentSizeMB), type: 'INT', desc: 'Dung lượng tệp tài liệu tối đa' },
        { key: 'ALLOWED_DOCUMENT_TYPES', val: String(formConfig.allowedDocumentTypes), type: 'STRING', desc: 'Định dạng tệp cho phép tải lên' },
        { key: 'SYSTEM_EMAIL', val: String(formConfig.systemEmail), type: 'STRING', desc: 'Email hệ thống gửi thông báo' },
        { key: 'NOTIFICATION_ENABLED', val: String(formConfig.notificationEnabled), type: 'BOOL', desc: 'Kích hoạt thông báo tự động' },
        { key: 'AUTO_EXPIRE_DAYS', val: String(formConfig.autoExpireDays), type: 'INT', desc: 'Thời hạn hiệu lực hồ sơ tính theo ngày' }
      ];

      for (const item of payloadMap) {
        const existing = configList.find(c => c.configKey === item.key);
        if (existing) {
          await adminService.updateConfiguration(existing.configurationId, {
            configurationId: existing.configurationId,
            configKey: item.key,
            configValue: item.val,
            dataType: item.type,
            description: item.desc,
            updatedBy: 1
          });
        } else {
          await adminService.createConfiguration({
            configKey: item.key,
            configValue: item.val,
            dataType: item.type,
            description: item.desc,
            updatedBy: 1
          });
        }
      }

      showToast("Lưu cấu hình hệ thống vào CSDL thành công!");
      loadConfigurations();
    } catch (err) {
      console.error("Save config error:", err);
      showToast(err.response?.data?.message || "Lỗi khi lưu cấu hình", "danger");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Toast alert */}
      {notification && (
        <div className={`alert alert-${notification.type} position-fixed top-0 end-0 m-4 shadow`} style={{ zIndex: 9999 }}>
          {notification.msg}
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Cấu Hình Hệ Thống</h2>
          <p className="text-muted mb-0">Thiết lập tham số hoạt động, ngưỡng SLA và quy chuẩn tài liệu trong toàn hệ thống</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7"
            onClick={loadConfigurations}
          >
            <RefreshCw size={15} /> Khôi phục
          </button>
          <button 
            className="btn btn-success d-inline-flex align-items-center gap-1 fs-7 fw-semibold"
            style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={16} /> {saving ? 'Đang lưu CSDL...' : 'Lưu cấu hình'}
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* SLA Configuration */}
        <div className="col-xl-6 col-12">
          <div className="app-card-clean bg-white border p-4 h-100">
            <div className="fw-bold fs-5 text-dark mb-3 d-flex align-items-center gap-2">
              <span>⏱</span> Cấu Hình Ngưỡng SLA
            </div>
            <div className="d-flex flex-column gap-3">
              <div>
                <label className="form-label fs-7 fw-semibold text-dark">Thời hạn Cán bộ xử lý hồ sơ (giờ)</label>
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  value={formConfig.slaOfficerHours} 
                  onChange={e => handleChange('slaOfficerHours', e.target.value)} 
                />
                <div className="text-muted fs-8 mt-1">Hạn tối đa từ khi sinh viên nộp đến khi Cán bộ chuyển sang Reviewer.</div>
              </div>

              <div>
                <label className="form-label fs-7 fw-semibold text-dark">Thời hạn Chuyên viên xét duyệt (giờ)</label>
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  value={formConfig.slaReviewerHours} 
                  onChange={e => handleChange('slaReviewerHours', e.target.value)} 
                />
                <div className="text-muted fs-8 mt-1">Hạn tối đa để Chuyên viên đưa ra quyết định phê duyệt hoặc từ chối.</div>
              </div>

              <div>
                <label className="form-label fs-7 fw-semibold text-dark">Hạn chót bổ sung giấy tờ (giờ)</label>
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  value={formConfig.slaSupplementHours} 
                  onChange={e => handleChange('slaSupplementHours', e.target.value)} 
                />
                <div className="text-muted fs-8 mt-1">Thời gian sinh viên được phép nộp lại giấy tờ khi có yêu cầu bổ sung.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload & Document Rules */}
        <div className="col-xl-6 col-12">
          <div className="app-card-clean bg-white border p-4 h-100">
            <div className="fw-bold fs-5 text-dark mb-3 d-flex align-items-center gap-2">
              <span>📄</span> Quy Chuẩn Tải Lên Minh Chứng
            </div>
            <div className="d-flex flex-column gap-3">
              <div>
                <label className="form-label fs-7 fw-semibold text-dark">Dung lượng tệp tối đa (MB)</label>
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  value={formConfig.maxDocumentSizeMB} 
                  onChange={e => handleChange('maxDocumentSizeMB', e.target.value)} 
                />
                <div className="text-muted fs-8 mt-1">Giới hạn kích thước mỗi tài liệu tải lên hệ thống.</div>
              </div>

              <div>
                <label className="form-label fs-7 fw-semibold text-dark">Định dạng tệp cho phép</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  value={formConfig.allowedDocumentTypes} 
                  onChange={e => handleChange('allowedDocumentTypes', e.target.value)} 
                />
                <div className="text-muted fs-8 mt-1">Phân tách bằng dấu phẩy (ví dụ: pdf,jpg,jpeg,png).</div>
              </div>

              <div>
                <label className="form-label fs-7 fw-semibold text-dark">Thời hạn hiệu lực hồ sơ mặc định (ngày)</label>
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  value={formConfig.autoExpireDays} 
                  onChange={e => handleChange('autoExpireDays', e.target.value)} 
                />
                <div className="text-muted fs-8 mt-1">Thời hạn hết hạn ngoại trú nếu không gia hạn (mặc định 1 năm học).</div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification & Communication */}
        <div className="col-12">
          <div className="app-card-clean bg-white border p-4">
            <div className="fw-bold fs-5 text-dark mb-3 d-flex align-items-center gap-2">
              <span>🔔</span> Thông Báo & Tương Tác
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fs-7 fw-semibold text-dark">Email hệ thống gửi thông báo</label>
                <input 
                  type="email" 
                  className="form-control form-control-sm" 
                  value={formConfig.systemEmail} 
                  onChange={e => handleChange('systemEmail', e.target.value)} 
                />
                <div className="text-muted fs-8 mt-1">Địa chỉ hòm thư gửi email tự động cho sinh viên.</div>
              </div>

              <div className="col-md-6 d-flex flex-column justify-content-center">
                <div className="form-check form-switch mt-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="notifSwitch" 
                    checked={formConfig.notificationEnabled} 
                    onChange={e => handleChange('notificationEnabled', e.target.checked)} 
                  />
                  <label className="form-check-label fs-7 fw-semibold" htmlFor="notifSwitch">
                    Kích hoạt hệ thống thông báo tức thời (In-app notifications)
                  </label>
                </div>
                <div className="text-muted fs-8 mt-1">Gửi thông báo trên chuông thông báo mỗi khi hồ sơ đổi trạng thái.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
