import React, { useState } from 'react';
import { User } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, UserPlus, LogIn, AlertCircle, Lock, Database, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { DEFAULT_SUPER_ADMIN } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-teal-600 p-8 text-center">
          <div className="inline-flex p-3 bg-teal-500 rounded-xl mb-4 shadow-inner">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-slate-600 mb-6">
            To reset your password, please contact your <strong>System Administrator</strong>.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-500 mb-6">
            Admins can reset passwords directly from the User Management dashboard.
          </div>
          <Link to="/login" className="text-teal-600 font-medium hover:underline">
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export const LoginPage: React.FC<AuthProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // 1. Check Super Admin Logic (Allow Super Admin to login via main portal too)
    const storedSuperAdmin = JSON.parse(localStorage.getItem('fh_super_admin') || 'null');
    const saUser = storedSuperAdmin ? storedSuperAdmin.username : DEFAULT_SUPER_ADMIN.username;
    const saPass = storedSuperAdmin ? storedSuperAdmin.password : DEFAULT_SUPER_ADMIN.password;
    
    if (cleanUsername.toLowerCase() === saUser.toLowerCase()) {
      if (cleanPassword === saPass) {
        onLogin({ username: saUser, role: 'admin' });
        navigate('/admin/dashboard');
        return;
      } else {
        setError('Incorrect password.');
        return;
      }
    }

    // 2. Check Registered Users
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('fh_users') || '[]');
    } catch (e) {
      console.error("Error parsing users", e);
      users = [];
    }
    
    // Find user by username first
    const user = users.find((u: any) => u && u.username && u.username.toLowerCase() === cleanUsername.toLowerCase());
    
    // Also allow 'user'/'user' for demo if no users exist
    if (cleanUsername === 'user' && cleanPassword === 'user' && users.length === 0) {
       onLogin({ username: 'user', role: 'user' });
       navigate('/dashboard');
       return;
    }

    if (user) {
      // Check Password
      if (String(user.password) === cleanPassword) {
        onLogin({ username: user.username, role: user.role || 'user' });
        navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
      } else {
        setError('Incorrect password. Please try again.');
      }
    } else {
      setError(`Account '${cleanUsername}' not found.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-teal-600 p-8 text-center">
          <div className="inline-flex p-3 bg-teal-500 rounded-xl mb-4 shadow-inner">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Learner Portal</h1>
          <p className="text-teal-100 mt-2">Sign in to access your training</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-sm text-teal-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link to="/admin/login" className="text-xs text-slate-400 hover:text-slate-600">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminLoginPage: React.FC<AuthProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // 1. Check Super Admin Logic First
    const storedSuperAdmin = JSON.parse(localStorage.getItem('fh_super_admin') || 'null');
    const saUser = storedSuperAdmin ? storedSuperAdmin.username : DEFAULT_SUPER_ADMIN.username;
    const saPass = storedSuperAdmin ? storedSuperAdmin.password : DEFAULT_SUPER_ADMIN.password;
    
    if (cleanUsername.toLowerCase() === saUser.toLowerCase()) {
      if (cleanPassword === saPass) {
        onLogin({ username: saUser, role: 'admin' });
        navigate('/admin/dashboard');
        return;
      } else {
        setError('Incorrect password for Super Admin.');
        return;
      }
    }

    // 2. Check Dynamic Admins from Local Storage
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('fh_users') || '[]');
    } catch (e) {
      console.error("Error parsing users", e);
      users = [];
    }
    
    // Search for user by username (case-insensitive)
    const foundUser = users.find((u: any) => 
      u && u.username && u.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (foundUser) {
      // User found, verify password
      if (String(foundUser.password) === cleanPassword) {
        // Password correct, verify role
        if (foundUser.role === 'admin') {
          onLogin({ username: foundUser.username, role: 'admin' });
          navigate('/admin/dashboard');
        } else {
           setError(`Access Denied: '${foundUser.username}' is a Learner. Please use the Learner Login.`);
        }
      } else {
        setError('Incorrect password. Please check for typos.'); 
      }
    } else {
      setError(`Account '${cleanUsername}' does not exist in the system.`); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-slate-800 p-8 text-center border-b border-slate-700">
          <div className="inline-flex p-3 bg-slate-700 rounded-xl mb-4 shadow-inner ring-1 ring-slate-600">
            <Lock className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Console</h1>
          <p className="text-slate-400 mt-2">Restricted Access</p>
        </div>
        
        <div className="p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Admin ID</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                placeholder="Enter admin ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Authenticate
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
             <Link to="/login" className="text-sm text-slate-500 hover:text-slate-800">
              &larr; Back to Learner Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC<AuthProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (cleanUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    // Check Super Admin collision
    const storedSuperAdmin = JSON.parse(localStorage.getItem('fh_super_admin') || 'null');
    const saUser = storedSuperAdmin ? storedSuperAdmin.username : DEFAULT_SUPER_ADMIN.username;
    if (cleanUsername.toLowerCase() === saUser.toLowerCase()) {
       setError('This username is reserved.');
       return;
    }

    // Save to local storage mock DB
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('fh_users') || '[]');
    } catch (e) {
      users = [];
    }
    
    // Check for existing user (case-insensitive)
    if (users.find((u: any) => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      setError('Username already exists');
      return;
    }

    users.push({ username: cleanUsername, password: cleanPassword, role: 'user' });
    localStorage.setItem('fh_users', JSON.stringify(users));
    
    onLogin({ username: cleanUsername, role: 'user' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-800 p-8 text-center">
          <div className="inline-flex p-3 bg-slate-700 rounded-xl mb-4 shadow-inner">
            <UserPlus className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-300 mt-2">Join the quality assurance team</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                placeholder="Choose a strong password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Register
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 font-medium hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};