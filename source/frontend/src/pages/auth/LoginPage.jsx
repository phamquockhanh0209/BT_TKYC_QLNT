import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, BookOpen } from 'lucide-react';
import authService from '../../api/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', remember: true });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await authService.login(form.username, form.password);
      const role = res?.role || 'STUDENT';

      // Tự động điều hướng theo phân quyền
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'OFFICER') {
        navigate('/officer/dashboard');
      } else if (role === 'REVIEWER') {
        navigate('/reviewer/workspace');
      } else {
        navigate('/overview');
      }
    } catch (err) {
      console.error('Login error:', err);
      const serverMsg = err?.response?.data?.message;
      if (serverMsg) {
        setErrorMsg(serverMsg);
      } else if (err?.code === 'ERR_NETWORK') {
        setErrorMsg('Không thể kết nối đến máy chủ Backend (Port 5005). Vui lòng kiểm tra dịch vụ.');
      } else {
        setErrorMsg('Tên đăng nhập hoặc mật khẩu không chính xác.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Outer card wrapper */}
      <div style={styles.card}>

        {/* ===== LEFT — Login Form ===== */}
        <div style={styles.formSide}>
          <div style={styles.formInner}>

            {/* Logo */}
            <div style={styles.logoRow}>
              <div style={styles.logoDot} />
              <span style={styles.logoText}>Quản Lý Ngoại Trú</span>
            </div>

            <h2 style={styles.formTitle}>TRANG ĐĂNG NHẬP</h2>
            <p style={styles.formSub}>Nhập thông tin tài khoản của bạn để tiếp tục</p>

            {/* Thông báo lỗi nếu đăng nhập thất bại */}
            {errorMsg && (
              <div style={styles.alertError}>
                <AlertCircle size={17} style={{ minWidth: 17, marginTop: 2 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Username / MSSV */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Tên đăng nhập / Email</label>
                <div style={styles.inputWrap}>
                  <Mail size={17} style={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Input your user ID or Email"
                    value={form.username}
                    onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                    required
                    style={styles.input}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Mật khẩu</label>
                <div style={styles.inputWrap}>
                  <Lock size={17} style={styles.inputIcon} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Input your password"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    required
                    style={{ ...styles.input, paddingRight: '44px' }}
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(v => !v)} 
                    style={styles.eyeBtn} 
                    title={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div style={styles.optRow}>
                <label style={styles.rememberLabel}>
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={e => setForm(p => ({ ...p, remember: e.target.checked }))}
                    style={{ marginRight: '7px', accentColor: '#2563eb' }}
                  />
                  Ghi nhớ đăng nhập
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Vui lòng liên hệ phòng Công tác sinh viên hoặc Quản trị viên để đặt lại mật khẩu.'); }} style={styles.forgotLink}>
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading} style={styles.loginBtn}>
                {loading ? (
                  <span style={styles.spinner} />
                ) : (
                  <>
                    <LogIn size={18} style={{ marginRight: '8px' }} />
                    ĐĂNG NHẬP
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

        {/* ===== RIGHT — Welcome Panel ===== */}
        <div style={styles.welcomeSide}>
          {/* Dark overlay so text stays readable over the photo */}
          <div style={styles.imageOverlay} />

          {/* Decorative blobs */}
          <div style={{ ...styles.blob, ...styles.blobTL }} />
          <div style={{ ...styles.blob, ...styles.blobBR }} />

          {/* Content */}
          <div style={styles.welcomeContent}>
            <div style={styles.iconCircle}>
              <BookOpen size={40} color="#c0c000" />
            </div>

            <h1 style={styles.welcomeTitle}>XIN CHÀO!</h1>
            <h3 style={styles.welcomeSystem}>Hệ thống Quản lý Ngoại trú</h3>
            <p style={styles.welcomeDesc}>
              Nhập thông tin của bạn để bắt đầu hành trình cùng chúng tôi
            </p>

            {/* Feature badges */}
            <div style={styles.featureRow}>
              <span style={styles.featureBadge}>Sinh viên</span>
              <span style={styles.featureBadge}>Cán bộ</span>
              <span style={styles.featureBadge}>Reviewer</span>
              <span style={styles.featureBadge}>Admin</span>
            </div>

            <p style={styles.welcomeFooter}>Trường Đại học GTVT cơ sở 2 · Cổng thông tin nội bộ</p>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; }
        button:not(:disabled):hover { filter: brightness(1.06); }
      `}</style>
    </div>
  );
}

/* ── Inline styles ── */
const BLUE = '#2563eb';
const DARK_BLUE = '#1e3a8a';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'url(/anh_nen_dang_nhap.jpg) center center / cover no-repeat',
    padding: '24px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    display: 'flex',
    width: '100%',
    maxWidth: '920px',
    minHeight: '560px',
    borderRadius: '24px',
    boxShadow: '0 30px 80px rgba(37,99,235,0.22), 0 8px 30px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    backgroundColor: '#ffffff'
  },

  /* ── Form side (left) ── */
  formSide: {
    flex: '1',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px',
    position: 'relative'
  },
  formInner: { width: '100%', maxWidth: '340px' },

  logoRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '26px' },
  logoDot: { width: '10px', height: '10px', borderRadius: '50%', background: BLUE },
  logoText: { fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.06em', color: '#64748b', textTransform: 'uppercase' },

  formTitle: { fontSize: '2rem', fontWeight: 800, color: '#021239', marginBottom: '6px', lineHeight: 1.2, fontFamily: "'Times New Roman', Times, serif" },
  formSub: { fontSize: '0.85rem', color: '#94a3b8', marginBottom: '28px' },

  alertError: {
    display: 'flex', alignItems: 'flex-start', gap: '8px',
    backgroundColor: '#fef2f2', border: '1px solid #fecaca',
    color: '#b91c1c', padding: '10px 12px', borderRadius: '8px',
    fontSize: '0.82rem', marginBottom: '18px', lineHeight: 1.4
  },

  fieldGroup: { marginBottom: '18px' },
  label: { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '7px', letterSpacing: '0.02em' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '14px', color: '#94a3b8', pointerEvents: 'none' },
  input: {
    width: '100%', padding: '12px 14px 12px 44px',
    border: '1.5px solid #cbd5e1', borderRadius: '10px',
    fontSize: '0.88rem', color: '#1e293b', backgroundColor: '#f8fafc',
    transition: 'border 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box'
  },
  eyeBtn: {
    position: 'absolute', right: '14px', background: 'none', border: 'none',
    cursor: 'pointer', color: '#94a3b8', padding: '4px', lineHeight: 1
  },

  optRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '26px' },
  rememberLabel: { display: 'flex', alignItems: 'center', fontSize: '0.82rem', color: '#64748b', cursor: 'pointer', margin: 0 },
  forgotLink: { fontSize: '0.82rem', color: BLUE, fontWeight: 600, textDecoration: 'none' },

  loginBtn: {
    width: '100%', padding: '13px', border: 'none', borderRadius: '10px',
    background: `linear-gradient(135deg, ${BLUE} 0%, ${DARK_BLUE} 100%)`,
    color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(37,99,235,0.35)', transition: 'filter 0.2s'
  },
  spinner: {
    width: '18px', height: '18px', border: '2.5px solid rgba(255,255,255,0.4)',
    borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block'
  },

  /* ── Welcome side (right) ── */
  welcomeSide: {
    flex: '1',
    position: 'relative',
    backgroundImage: 'url(/anhnendangnhap.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: '48px 36px'
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(160deg, rgba(15,23,42,0.6) 0%, rgba(30,58,138,0.78) 60%, rgba(15,23,42,0.88) 100%)',
    zIndex: 1
  },
  blob: {
    position: 'absolute', borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    filter: 'blur(2px)',
    zIndex: 1
  },
  blobTL: { width: '260px', height: '260px', top: '-80px', left: '-80px' },
  blobBR: { width: '300px', height: '300px', bottom: '-100px', right: '-100px' },

  welcomeContent: {
    position: 'relative', zIndex: 2, width: '100%', maxWidth: '440px',
    textAlign: 'center', color: '#ffffff',
  },
  iconCircle: {
    width: '80px', height: '80px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.35)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
  },
  welcomeTitle: {
    fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em', margin: '0 0 8px', lineHeight: 1.15,
  },
  welcomeSystem: {
    fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', opacity: 0.95, margin: '0 0 16px', lineHeight: 1.4,
  },
  welcomeDesc: {
    fontSize: '0.88rem', fontWeight: 400, opacity: 0.9, lineHeight: 1.7, margin: '0 auto 26px', maxWidth: '380px',
    textShadow: '0 1px 6px rgba(0,0,0,0.4)'
  },
  featureRow: { display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '26px' },
  featureBadge: {
    padding: '4px 12px', borderRadius: '20px',
    background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)',
    fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.02em',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },
  welcomeFooter: { fontSize: '0.72rem', opacity: 0.7, letterSpacing: '0.04em', textTransform: 'uppercase' }
};