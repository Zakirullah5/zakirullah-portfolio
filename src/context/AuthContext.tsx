import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/index.ts';

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
        const res = await fetch('/api/admin/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('zk_admin_user', JSON.stringify(data.user));
        } else {
          // Token expired or invalid
          setToken(null);
          setUser(null);
          localStorage.removeItem('zk_admin_token');
          localStorage.removeItem('zk_admin_user');
        }
      } catch (e) {
        console.error('Auth verification error:', e);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [token]);

  const login = async (email: string, pass: string, remember: boolean) => {
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        if (remember) {
          localStorage.setItem('zk_admin_token', data.token);
          localStorage.setItem('zk_admin_user', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('zk_admin_token', data.token);
          sessionStorage.setItem('zk_admin_user', JSON.stringify(data.user));
          localStorage.setItem('zk_admin_token', data.token);
          localStorage.setItem('zk_admin_user', JSON.stringify(data.user));
        }
        setIsLoginModalOpen(false);
        return { success: true };
      } else {
        const errMsg = data.message || 'Invalid email or password';
        setError(errMsg);
        return { success: false, error: errMsg };
      }
    } catch (e: any) {
      const errMsg = e.message || 'Network error while logging in';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/admin/logout', {
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
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Failed to update password' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  };

  const changeEmail = async (currentPassword: string, newEmail: string) => {
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const res = await fetch('/api/admin/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newEmail })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (user) {
          const updatedUser = { ...user, email: data.email };
          setUser(updatedUser);
          localStorage.setItem('zk_admin_user', JSON.stringify(updatedUser));
        }
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Failed to update login email' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  };

  const updateProfile = async (profileData: Partial<AdminUser>) => {
    if (!token) return false;
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('zk_admin_user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch {
      return false;
    }
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
