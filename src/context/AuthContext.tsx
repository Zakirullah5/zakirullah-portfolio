import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/index.ts';
import { apiUrl } from '../utils/api.ts';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (email: string, pass: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  changeEmail: (currentPass: string, newEmail: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (profile: Partial<AdminUser>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_ADMIN: AdminUser = {
  id: 'admin_1',
  email: 'zakir1kb@gmail.com',
  name: 'Zakirullah',
  role: 'Administrator',
  phone: '03439179353',
  location: 'Pakistan',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  lastLogin: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('zk_admin_token'));
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('zk_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(apiUrl('/api/admin/me'), {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('zk_admin_user', JSON.stringify(data.user));
        } else if (res.status === 401 || res.status === 403) {
          // Token explicitly rejected by server
          setToken(null);
          setUser(null);
          localStorage.removeItem('zk_admin_token');
          localStorage.removeItem('zk_admin_user');
        } else {
          // 404 or server unavailable (GitHub Pages static host) -> preserve local login
          const saved = localStorage.getItem('zk_admin_user');
          if (saved) {
            setUser(JSON.parse(saved));
          }
        }
      } catch {
        // Network error / static host -> preserve local user
        const saved = localStorage.getItem('zk_admin_user');
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [token]);

  const login = async (email: string, pass: string, remember: boolean) => {
    setError(null);
    let serverAttempted = false;

    try {
      const res = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      serverAttempted = true;
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('zk_admin_token', data.token);
          localStorage.setItem('zk_admin_user', JSON.stringify(data.user));
          setIsLoginModalOpen(false);
          return { success: true };
        }
      } else if (res.status === 401) {
        const data = await res.json().catch(() => ({}));
        const errMsg = data.message || 'Invalid email or password';
        setError(errMsg);
        return { success: false, error: errMsg };
      }
    } catch {
      // Server not running / static host
    }

    // Static GitHub Pages / Offline fallback:
    // Check against credentials (stored or default)
    let savedPass = localStorage.getItem('zk_admin_offline_pass') || 'khan@123';
    let savedEmail = localStorage.getItem('zk_admin_offline_email') || 'zakir1kb@gmail.com';

    const normalizedInputEmail = email.toLowerCase().trim();
    const normalizedSavedEmail = savedEmail.toLowerCase().trim();

    if (normalizedInputEmail === normalizedSavedEmail && pass === savedPass) {
      const offlineToken = 'zk_offline_' + Date.now();
      const offlineUser: AdminUser = {
        ...DEFAULT_ADMIN,
        email: savedEmail,
        lastLogin: new Date().toISOString()
      };
      setToken(offlineToken);
      setUser(offlineUser);
      localStorage.setItem('zk_admin_token', offlineToken);
      localStorage.setItem('zk_admin_user', JSON.stringify(offlineUser));
      setIsLoginModalOpen(false);
      return { success: true };
    }

    const errMsg = 'Invalid email or password';
    setError(errMsg);
    return { success: false, error: errMsg };
  };

  const logout = async () => {
    try {
      if (token && !token.startsWith('zk_offline_')) {
        await fetch(apiUrl('/api/admin/logout'), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch {
      // Continue client cleanup
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('zk_admin_token');
    localStorage.removeItem('zk_admin_user');
    sessionStorage.removeItem('zk_admin_token');
    sessionStorage.removeItem('zk_admin_user');
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!token) return { success: false, message: 'Not authenticated' };

    try {
      const res = await fetch(apiUrl('/api/admin/change-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('zk_admin_offline_pass', newPassword);
          return { success: true, message: data.message };
        }
      }
    } catch {
      // Offline fallback
    }

    // Fallback for static host
    const currentPass = localStorage.getItem('zk_admin_offline_pass') || 'khan@123';
    if (oldPassword !== currentPass) {
      return { success: false, message: 'Current password is incorrect' };
    }
    localStorage.setItem('zk_admin_offline_pass', newPassword);
    return { success: true, message: 'Password updated successfully!' };
  };

  const changeEmail = async (currentPassword: string, newEmail: string) => {
    if (!token) return { success: false, message: 'Not authenticated' };

    try {
      const res = await fetch(apiUrl('/api/admin/change-email'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newEmail })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('zk_admin_offline_email', data.email);
          if (user) {
            const updatedUser = { ...user, email: data.email };
            setUser(updatedUser);
            localStorage.setItem('zk_admin_user', JSON.stringify(updatedUser));
          }
          return { success: true, message: data.message };
        }
      }
    } catch {
      // Offline fallback
    }

    const currentPass = localStorage.getItem('zk_admin_offline_pass') || 'khan@123';
    if (currentPassword !== currentPass) {
      return { success: false, message: 'Password verification failed' };
    }
    localStorage.setItem('zk_admin_offline_email', newEmail);
    if (user) {
      const updatedUser = { ...user, email: newEmail };
      setUser(updatedUser);
      localStorage.setItem('zk_admin_user', JSON.stringify(updatedUser));
    }
    return { success: true, message: 'Login email updated successfully!' };
  };

  const updateProfile = async (profileData: Partial<AdminUser>) => {
    if (!token) return false;
    try {
      const res = await fetch(apiUrl('/api/admin/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('zk_admin_user', JSON.stringify(data.user));
          return true;
        }
      }
    } catch {
      // Offline fallback
    }

    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('zk_admin_user', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        error,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        login,
        logout,
        changePassword,
        changeEmail,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
