import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);

    // Demo routing theo role
    if (form.username === 'admin') navigate('/admin/dashboard');
    else if (form.username === 'officer') navigate('/officer/dashboard');
    else if (form.username === 'reviewer') navigate('/reviewer/workspace');
    else navigate('/overview');
  };

  return (
    <div style={styles.page}>
      {/* Outer card wrapper */}
      <div style={styles.card}>

        {/* ===== LEFT — Login Form ===== */}
        <div style={styles.formSide}>
          <div style={styles.formInner}>

            <h2 style={styles.formTitle}>Đăng nhập hệ thống</h2>
            <p style={styles.formSub}>Nhập thông tin tài khoản của bạn để tiếp tục</p>

            <form onSubmit={handleLogin}>
              {/* Username */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Tên đăng nhập / Email</label>
                <div style={styles.inputWrap}>
                  <Mail size={17} style={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Nhập tên đăng nhập hoặc email..."
                    value={form.username}
                    onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                    required
                    style={styles.input}
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
                    placeholder="Nhập mật khẩu..."
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    required
                    style={{ ...styles.input, paddingRight: '44px' }}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} style={styles.eyeBtn}>
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
                <a href="#" style={styles.forgotLink}>Quên mật khẩu?</a>
              </div>

              {/* Submit */}
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

          {/* Decorative blobs (kept subtle, on top of overlay) */}
          <div style={{ ...styles.blob, ...styles.blobTL }} />
          <div style={{ ...styles.blob, ...styles.blobBR }} />

          {/* Content */}
          <div style={styles.welcomeContent}>
            

            <h1 style={styles.welcomeTitle}>CHÀO MỪNG!</h1>
            <h3 style={styles.welcomeSystem}>Hệ thống Quản lý Ngoại trú</h3>
            <p style={styles.welcomeDesc}>
              Nền tảng số hóa quản lý khai báo nơi ở ngoại trú dành cho sinh viên,
              cán bộ tiếp nhận và hội đồng thẩm định.
            </p>

            {/* Feature badges */}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; }
        button:not(:disabled):hover { filter: brightness(1.08); }
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
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  card: {
    display: 'flex',
    width: '100%',
    maxWidth: '920px',
    minHeight: '560px',
    borderRadius: '24px',
    boxShadow: '0 30px 80px rgba(37,99,235,0.18), 0 8px 30px rgba(0,0,0,0.12)',
    overflow: 'hidden'
  },

  /* ── Form side (left) ── */
  formSide: {
    flex: '1',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px'
  },
  formInner: { width: '100%', maxWidth: '340px' },

  logoRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' },
  logoDot: { width: '10px', height: '10px', borderRadius: '50%', background: BLUE },
  logoText: { fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.06em', color: '#64748b', textTransform: 'uppercase' },

  formTitle: { fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', lineHeight: 1.2 },
  formSub: { fontSize: '0.85rem', color: '#94a3b8', marginBottom: '30px' },

  fieldGroup: { marginBottom: '18px' },
  label: { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '7px', letterSpacing: '0.02em' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '14px', color: '#94a3b8', pointerEvents: 'none' },
  input: {
    width: '100%', padding: '12px 14px 12px 44px',
    border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '0.88rem', color: '#1e293b', backgroundColor: '#f8fafc',
    transition: 'border 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box'
  },
  eyeBtn: {
    position: 'absolute', right: '14px', background: 'none', border: 'none',
    cursor: 'pointer', color: '#94a3b8', padding: '4px', lineHeight: 1
  },

  optRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '26px' },
  rememberLabel: { display: 'flex', alignItems: 'center', fontSize: '0.82rem', color: '#64748b', cursor: 'pointer' },
  forgotLink: { fontSize: '0.82rem', color: BLUE, fontWeight: 600, textDecoration: 'none' },

  /* Fixed: was mistakenly set to a background-image (making the button look broken).
     Now a proper solid blue gradient like the reference. */
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

  hintBox: {
    marginTop: '24px', padding: '14px 16px',
    background: '#f0f9ff', border: '1px solid #bae6fd',
    borderRadius: '10px', fontSize: '0.76rem', lineHeight: 1.7
  },
  hintTitle: { fontWeight: 700, color: BLUE, marginBottom: '4px' },
  
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
    background: 'linear-gradient(160deg, rgba(15,23,42,0.55) 0%, rgba(30,58,138,0.75) 60%, rgba(15,23,42,0.85) 100%)',
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
    position: 'relative', zIndex: 2, width: '100%', maxWidth: '520px',
    textAlign: 'center', color: '#ffffff', fontFamily: "'Times New Roman', Times, serif",
  },

  iconCircle: {
    width: '84px', height: '84px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.16)', border: '2px solid rgba(255,255,255,0.35)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 22px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
  },

  welcomeTitle: {
    fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em', margin: '0 0 8px', lineHeight: 1.15,
  },
  welcomeSystem: {
    fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', opacity: 0.95, margin: '0 0 18px', lineHeight: 1.4,
  },
  welcomeDesc: {
    fontSize: '0.95rem', fontWeight: 400, opacity: 0.9, lineHeight: 1.7, margin: '0 auto 28px', maxWidth: '420px',
    textShadow: '0 1px 6px rgba(0,0,0,0.4)'
  },

  featureRow: { display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '28px' },
  featureBadge: {
    padding: '5px 14px', borderRadius: '20px',
    background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.4)',
    fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.02em',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },

  welcomeFooter: { fontSize: '0.72rem', opacity: 0.7, letterSpacing: '0.04em', textTransform: 'uppercase' }
};