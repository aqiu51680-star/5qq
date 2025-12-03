
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../scr/context/AppContext';
import { Role } from '../types';
import { ToastContainer, ToastMessage } from '../components/Toast';

export const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login, currentUser, appContent } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration: 3000 }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
        const success = await login(identifier, password);
        if (success) {
          addToast('Đăng nhập thành công!', 'success');
          setTimeout(() => {
            if (identifier.includes('admin')) {
               navigate('/admin/dashboard');
            } else {
               navigate('/user/home');
            }
          }, 500);
        } else {
          const msg = 'Tên đăng nhập hoặc mật khẩu không chính xác';
          setError(msg);
          addToast(msg, 'error');
        }
    } catch (e: any) {
        setError(e.message);
        addToast(e.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4" style={{
        backgroundImage: appContent.authBgImage ? `url(${appContent.authBgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }}>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className={`w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 space-y-8 ${appContent.authBgImage ? 'border-2 border-white/70 backdrop-blur-lg' : 'border border-gray-100'}`}>
        <div className="text-center">
          <h1 className={`font-bold mb-3 ${appContent.authTitleSize || 'text-4xl'}`} style={{ color: appContent.authTitleColor || '#1e3a8a' }}>
              {appContent.authTitle || 'CEVA'}
          </h1>
          <p className="text-gray-500 font-medium text-lg">{appContent.authSubtitle || 'Chào mừng quay lại'}</p>
        </div>

        {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Tên đăng nhập hoặc Số điện thoại</label>
            <input 
              type="text" 
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50 hover:bg-white"
              placeholder="Nhập tên đăng nhập của bạn"
              required 
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50 hover:bg-white"
              placeholder="••••••••"
              required 
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading} className="w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all transform disabled:opacity-60" style={{ backgroundColor: appContent.authPrimaryColor || '#3b82f6' }}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="text-center text-sm border-t border-gray-200 pt-6">
          <p className="text-gray-600">Chưa có tài khoản? <Link to="/auth/register" className="font-bold hover:underline transition-colors" style={{ color: appContent.authPrimaryColor || '#3b82f6' }}>Đăng ký ngay</Link></p>
        </div>
      </div>
    </div>
  );
};

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '', fullName: '', phoneNumber: '', password: '', confirmPassword: '', referralCode: '', inviteCode: ''
  });
  const { register, registrationCodes, appContent } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration: 3000 }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      const msg = "Mật khẩu không khớp";
      setError(msg);
      addToast(msg, 'error');
      setIsLoading(false);
      return;
    }

    // Validate referral code is required and is 6 digits
    if (!formData.referralCode || !formData.referralCode.trim()) {
      const msg = "Mã giới thiệu là bắt buộc";
      setError(msg);
      addToast(msg, 'error');
      setIsLoading(false);
      return;
    }

    if (!/^\d{6}$/.test(formData.referralCode.trim())) {
      const msg = "Mã giới thiệu phải là 6 chữ số";
      setError(msg);
      addToast(msg, 'error');
      setIsLoading(false);
      return;
    }

    try {
      await register(formData);
      addToast('Đăng ký tài khoản thành công!', 'success');
      setTimeout(() => {
        navigate('/auth');
      }, 500);
    } catch (e: any) {
      const msg = e.message || 'Lỗi đăng ký tài khoản';
      setError(msg);
      addToast(msg, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4" style={{
        backgroundImage: appContent.authBgImage ? `url(${appContent.authBgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }}>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className={`w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 space-y-8 ${appContent.authBgImage ? 'border-2 border-white/70 backdrop-blur-lg' : 'border border-gray-100'}`}>
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: appContent.authPrimaryColor || '#3b82f6' }}>Tạo tài khoản</h1>
          <p className="text-gray-500 text-sm mt-2">Tham gia cùng chúng tôi ngay hôm nay!</p>
        </div>

        {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Tên đăng nhập" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50 hover:bg-white" 
            value={formData.username}
            onChange={e => setFormData({...formData, username: e.target.value})} disabled={isLoading} required />
          <input type="text" placeholder="Họ và tên" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50 hover:bg-white" 
            value={formData.fullName}
            onChange={e => setFormData({...formData, fullName: e.target.value})} disabled={isLoading} required />
          <input type="text" placeholder="Số điện thoại" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50 hover:bg-white" 
            value={formData.phoneNumber}
            onChange={e => setFormData({...formData, phoneNumber: e.target.value})} disabled={isLoading} required />
          <input type="password" placeholder="Mật khẩu" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50 hover:bg-white" 
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})} disabled={isLoading} required />
          <input type="password" placeholder="Xác nhận mật khẩu" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50 hover:bg-white" 
            value={formData.confirmPassword}
            onChange={e => setFormData({...formData, confirmPassword: e.target.value})} disabled={isLoading} required />
          
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Mã giới thiệu (6 chữ số) <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="Nhập mã 6 chữ số" 
              maxLength={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50 hover:bg-white" 
              value={formData.referralCode}
              onChange={e => setFormData({...formData, referralCode: e.target.value.replace(/\D/g, '')})} 
              disabled={isLoading}
              required 
            />
            <p className="text-xs text-gray-500 mt-1">Mã giới thiệu do admin cấp. Vui lòng nhập đúng 6 chữ số.</p>
          </div>

          <button type="submit" disabled={isLoading} className="w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all transform disabled:opacity-60" style={{ backgroundColor: appContent.authPrimaryColor || '#3b82f6' }}>
            {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>
        </form>
        <div className="text-center text-sm border-t border-gray-200 pt-6">
          <Link to="/auth" className="font-bold hover:underline transition-colors" style={{ color: appContent.authPrimaryColor || '#3b82f6' }}>Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};
