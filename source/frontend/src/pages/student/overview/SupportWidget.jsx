import React from 'react';
import { Headphones, ArrowRight } from 'lucide-react';

export default function SupportWidget() {
  return (
    <div className="app-card-clean" style={{ backgroundColor: '#fcfdfa', border: '1px dashed var(--border-color)' }}>
      <div className="d-flex align-items-start gap-3">
        <div 
          className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
          style={{ width: '40px', height: '40px', backgroundColor: 'var(--badge-active-bg)', color: 'var(--primary-color)' }}
        >
          <Headphones size={22} />
        </div>

        <div className="flex-grow-1">
          <h6 className="fw-bold mb-1" style={{ color: 'var(--text-dark)' }}>
            Cần hỗ trợ?
          </h6>
          <p className="text-muted mb-2 lh-sm" style={{ fontSize: '0.84rem' }}>
            Liên hệ phòng Công tác Sinh viên để được hỗ trợ thủ tục ngoại trú.
          </p>
          <a 
            href="mailto:ctsv@truong.edu.vn" 
            className="link-action" 
            style={{ fontSize: '0.85rem' }}
          >
            Liên hệ ngay <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
