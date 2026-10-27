import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { AdminHeader } from './AdminHeader.tsx';
import { AdminSidebar, AdminViewType } from './AdminSidebar.tsx';
import { DashboardView } from './views/DashboardView.tsx';
import { WebsiteOverviewView } from './views/WebsiteOverviewView.tsx';
import { HeroManagerView } from './views/HeroManagerView.tsx';
import { CVManagerView } from './views/CVManagerView.tsx';
import { AboutManagerView } from './views/AboutManagerView.tsx';
import { LogoManagerView } from './views/LogoManagerView.tsx';
import { PortfolioManagerView } from './views/PortfolioManagerView.tsx';
import { ImageManagerView } from './views/ImageManagerView.tsx';
import { VideoManagerView } from './views/VideoManagerView.tsx';
import { ServicesManagerView } from './views/ServicesManagerView.tsx';
import { PricingManagerView } from './views/PricingManagerView.tsx';
import { SkillsManagerView } from './views/SkillsManagerView.tsx';
import { TestimonialsManagerView } from './views/TestimonialsManagerView.tsx';
import { ContactManagerView } from './views/ContactManagerView.tsx';
import { ThemeManagerView } from './views/ThemeManagerView.tsx';
import { UploadManagerView } from './views/UploadManagerView.tsx';
import { LivePreviewView } from './views/LivePreviewView.tsx';
import { BackupRestoreView } from './views/BackupRestoreView.tsx';
import { SecurityView } from './views/SecurityView.tsx';
import { ActivityLogsView } from './views/ActivityLogsView.tsx';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  onNavigateToPortfolio: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigateToPortfolio }) => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const { toastMessage, setToastMessage } = useData();
  const { isDark } = useTheme();
  const [currentView, setCurrentView] = useState<AdminViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLivePreviewModalOpen, setIsLivePreviewModalOpen] = useState(false);

  // If not authenticated, prompt login
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${
        isDark ? 'bg-[#050711] text-white' : 'bg-slate-100 text-slate-900'
      }`}>
        <div className={`max-w-md p-8 rounded-3xl border shadow-2xl ${
          isDark ? 'bg-[#090e24] border-red-500/30' : 'bg-white border-slate-200'
        }`}>
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-display mb-2">
            Restricted Admin Area
          </h2>
          <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Authentication token required to access ZK Master Control Center.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onNavigateToPortfolio}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold ${
                isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              Back to Portfolio
            </button>
            <button
              onClick={openLoginModal}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            onSelectView={setCurrentView}
            onNavigateToPortfolio={onNavigateToPortfolio}
            onOpenLivePreview={() => setCurrentView('preview')}
          />
        );
      case 'overview':
        return (
          <WebsiteOverviewView
            onNavigateToPortfolio={onNavigateToPortfolio}
            onOpenLivePreview={() => setCurrentView('preview')}
          />
        );
      case 'hero':
        return <HeroManagerView />;
      case 'cv':
        return <CVManagerView />;
      case 'about':
        return <AboutManagerView />;
      case 'logo':
        return <LogoManagerView />;
      case 'portfolio':
        return <PortfolioManagerView />;
      case 'images':
        return <ImageManagerView />;
      case 'videos':
        return <VideoManagerView />;
      case 'services':
        return <ServicesManagerView />;
      case 'pricing':
        return <PricingManagerView />;
      case 'skills':
        return <SkillsManagerView />;
      case 'testimonials':
        return <TestimonialsManagerView />;
      case 'contact':
        return <ContactManagerView />;
      case 'theme':
        return <ThemeManagerView />;
      case 'uploads':
        return <UploadManagerView />;
      case 'preview':
        return <LivePreviewView onNavigateToPortfolio={onNavigateToPortfolio} />;
      case 'backup':
        return <BackupRestoreView />;
      case 'security':
        return <SecurityView />;
      case 'activities':
        return <ActivityLogsView />;
      default:
        return (
          <DashboardView
            onSelectView={setCurrentView}
            onNavigateToPortfolio={onNavigateToPortfolio}
            onOpenLivePreview={() => setCurrentView('preview')}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col antialiased admin-panel transition-colors duration-300 ${
      isDark ? 'bg-[#050711] text-slate-100' : 'bg-[#f1f5f9] text-slate-900'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl border text-xs font-semibold backdrop-blur-xl flex items-center gap-2 animate-in slide-in-from-bottom duration-300 ${
          isDark
            ? 'bg-[#0e163b]/95 border-cyan-400/40 text-cyan-200 shadow-[0_0_30px_rgba(6,182,212,0.35)]'
            : 'bg-white/95 border-blue-500/30 text-slate-800 shadow-2xl'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <AdminSidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenLivePreview={() => setCurrentView('preview')}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigateToPortfolio={onNavigateToPortfolio}
          onOpenLivePreview={() => setCurrentView('preview')}
          onSelectView={setCurrentView}
          currentViewTitle={currentView}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
