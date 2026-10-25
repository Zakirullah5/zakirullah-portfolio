import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { DataProvider } from './context/DataContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { PublicPortfolio } from './components/portfolio/PublicPortfolio.tsx';
import { AdminPanel } from './components/admin/AdminPanel.tsx';
import { AdminLoginModal } from './components/auth/AdminLoginModal.tsx';

function MainRouter() {
  const { isAuthenticated, openLoginModal } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<'portfolio' | 'admin'>(() => {
    return window.location.hash.startsWith('#admin') ? 'admin' : 'portfolio';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.startsWith('#admin')) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('portfolio');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = '#admin';
    setCurrentRoute('admin');
  };

  const navigateToPortfolio = () => {
    window.location.hash = '#home';
    setCurrentRoute('portfolio');
  };

  return (
    <>
      {currentRoute === 'admin' ? (
        <AdminPanel onNavigateToPortfolio={navigateToPortfolio} />
      ) : (
        <PublicPortfolio onNavigateToAdmin={navigateToAdmin} />
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <MainRouter />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
