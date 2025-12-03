
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../scr/context/AppContext';
import { Role } from '../types';

export const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login, currentUser, appContent } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const success = await login(identifier, password);
        if (success) {
          if (identifier.includes('admin')) {
             navigate('/admin/dashboard');
          } else {
             navigate('/user/home');
          }
        } else {
          setError('Invalid credentials');
        }
    } catch (e: any) {
        setError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6" style={{
        backgroundImage: appContent.authBgImage ? `url(${appContent.authBgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }}>
      <div className={`w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 ${appContent.authBgImage ? 'border border-white/50' : ''}`}>
        <div className="text-center">
          <h1 className={`font-bold mb-2 ${appContent.authTitleSize || 'text-3xl'}`} style={{ color: appContent.authTitleColor || '#1e3a8a' }}>
              {appContent.authTitle || 'TEST'}
          </h1>
          <p className="text-gray-500 font-medium">{appContent.authSubtitle || 'Welcome Back'}</p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded text-sm text-center font-medium animate-pulse">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Username or Phone</label>
            <input 
              type="text" 
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Enter your username"
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="w-full text-white py-3.5 rounded-lg font-bold shadow-lg hover:opacity-90 transition-opacity transform active:scale-95" style={{ backgroundColor: appContent.authPrimaryColor || '#2563eb' }}>
            Login
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-500">Don't have an account? <Link to="/auth/register" className="font-bold hover:underline" style={{ color: appContent.authPrimaryColor || '#2563eb' }}>Register</Link></p>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!formData.inviteCode || !formData.inviteCode.trim()) {
       setError("Invitation Code is required");
       return;
    }

    // Validate Invite Code validity
    const isValidCode = registrationCodes.find(rc => rc.code === formData.inviteCode.trim() && rc.status === 'UNUSED');
    if (!isValidCode) {
      setError("Invalid or already used Invitation Code. Please contact admin.");
      return;
    }

    try {
      await register(formData);
      navigate('/auth');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6" style={{
        backgroundImage: appContent.authBgImage ? `url(${appContent.authBgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }}>
      <div className={`w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 ${appContent.authBgImage ? 'border border-white/50' : ''}`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: appContent.authPrimaryColor || '#2563eb' }}>Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join us today!</p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded text-sm text-center font-medium animate-pulse">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Username" className="w-full p-3 border rounded-lg focus:ring-2 outline-none transition-all" 
            style={{ borderColor: '#e5e7eb', '--tw-ring-color': appContent.authPrimaryColor } as any}
            onChange={e => setFormData({...formData, username: e.target.value})} required />
          <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg focus:ring-2 outline-none transition-all" 
            style={{ borderColor: '#e5e7eb', '--tw-ring-color': appContent.authPrimaryColor } as any}
            onChange={e => setFormData({...formData, fullName: e.target.value})} required />
          <input type="text" placeholder="Phone Number" className="w-full p-3 border rounded-lg focus:ring-2 outline-none transition-all" 
            style={{ borderColor: '#e5e7eb', '--tw-ring-color': appContent.authPrimaryColor } as any}
            onChange={e => setFormData({...formData, phoneNumber: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg focus:ring-2 outline-none transition-all" 
            style={{ borderColor: '#e5e7eb', '--tw-ring-color': appContent.authPrimaryColor } as any}
            onChange={e => setFormData({...formData, password: e.target.value})} required />
          <input type="password" placeholder="Confirm Password" className="w-full p-3 border rounded-lg focus:ring-2 outline-none transition-all" 
            style={{ borderColor: '#e5e7eb', '--tw-ring-color': appContent.authPrimaryColor } as any}
            onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
          
          <div className="grid grid-cols-2 gap-3">
             <input type="text" placeholder="Referral Code (Optional)" className="w-full p-3 border rounded-lg focus:ring-2 outline-none transition-all" 
               style={{ borderColor: '#e5e7eb', '--tw-ring-color': appContent.authPrimaryColor } as any}
               onChange={e => setFormData({...formData, referralCode: e.target.value})} />
             <input type="text" placeholder="Invite Code (Required)" className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 outline-none transition-all" 
               style={{ borderColor: appContent.authPrimaryColor || '#93c5fd', '--tw-ring-color': appContent.authPrimaryColor } as any}
               onChange={e => setFormData({...formData, inviteCode: e.target.value})} required />
          </div>

          <button type="submit" className="w-full text-white py-3 rounded-lg font-bold mt-2 shadow-lg hover:opacity-90 transition-all transform active:scale-95" style={{ backgroundColor: appContent.authPrimaryColor || '#2563eb' }}>
            Register
          </button>
        </form>
        <div className="text-center text-sm">
          <Link to="/auth" className="font-bold hover:underline" style={{ color: appContent.authPrimaryColor || '#2563eb' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};
