import React, { useState } from 'react';
import { PortfolioNavbar } from './PortfolioNavbar.tsx';
import { HeroSection } from './HeroSection.tsx';
import { AboutAndSkillsSection } from './AboutAndSkillsSection.tsx';
import { ServicesSection } from './ServicesSection.tsx';
import { PortfolioGallery } from './PortfolioGallery.tsx';
import { BottomSections } from './BottomSections.tsx';
import { PortfolioFooter } from './PortfolioFooter.tsx';
import { AdminLoginModal } from '../auth/AdminLoginModal.tsx';
import { BackgroundParticles } from '../3d/BackgroundParticles.tsx';
import { CustomCursor } from '../common/CustomCursor.tsx';
import { IntroStartupAnimation } from '../common/IntroStartupAnimation.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';

interface PublicPortfolioProps {
  onNavigateToAdmin: () => void;
}

export const PublicPortfolio: React.FC<PublicPortfolioProps> = ({ onNavigateToAdmin }) => {
  const { isLoginModalOpen, closeLoginModal, openLoginModal } = useAuth();
  const { isDark } = useTheme();
  const [showIntro, setShowIntro] = useState(() => {
    return sessionStorage.getItem('zk_intro_seen') !== 'true';
  });

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden relative flex flex-col transition-colors duration-300 selection:bg-purple-600 selection:text-white ${
      isDark ? 'bg-[#050711] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Cinematic Startup Loading Animation */}
      {showIntro && (
        <IntroStartupAnimation onComplete={() => setShowIntro(false)} />
      )}

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Ambient Canvas Background Particle Constellation */}
      <BackgroundParticles />

      {/* Navigation */}
      <PortfolioNavbar
        onOpenAdminModal={openLoginModal}
        onNavigateToAdmin={onNavigateToAdmin}
      />

      {/* Main Content Sections */}
      <main className="flex-1 relative z-10 w-full max-w-full overflow-x-hidden">
        <HeroSection />
        <AboutAndSkillsSection />
        <ServicesSection />
        <PortfolioGallery />
        <BottomSections
          onOpenAdminModal={openLoginModal}
          onNavigateToAdmin={onNavigateToAdmin}
        />
      </main>

      {/* Footer */}
      <PortfolioFooter />

      {/* Admin Login Modal (Glassmorphism Dialog) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSuccess={onNavigateToAdmin}
      />
    </div>
  );
};
