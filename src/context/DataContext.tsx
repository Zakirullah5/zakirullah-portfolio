import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SiteDatabase,
  Project,
  Service,
  ServiceRate,
  Skill,
  Testimonial,
  MediaFile,
  HeroSettings,
  AboutSettings,
  ContactSettings,
  LogoSettings,
  ThemeSettings,
  SystemSettings
} from '../types/index.ts';
import { useAuth } from './AuthContext.tsx';

interface DataContextType {
  data: SiteDatabase | null;
  isLoading: boolean;
  isSaving: boolean;
  refreshData: () => Promise<void>;
  updateHero: (hero: Partial<HeroSettings>) => Promise<boolean>;
  updateAbout: (about: Partial<AboutSettings>) => Promise<boolean>;
  updateContact: (contact: Partial<ContactSettings>) => Promise<boolean>;
  updateLogos: (logos: Partial<LogoSettings>) => Promise<boolean>;
  updateTheme: (theme: Partial<ThemeSettings>) => Promise<boolean>;
  updateSystem: (system: Partial<SystemSettings>) => Promise<boolean>;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<boolean>;
  updateProject: (id: string, project: Partial<Project>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  addService: (service: Omit<Service, 'id'>) => Promise<boolean>;
  updateService: (id: string, service: Partial<Service>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  updateRates: (rates: ServiceRate[]) => Promise<boolean>;
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<boolean>;
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;
  addTestimonial: (test: Omit<Testimonial, 'id'>) => Promise<boolean>;
  updateTestimonial: (id: string, test: Partial<Testimonial>) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;
  uploadFile: (file: File) => Promise<{ success: boolean; url?: string; file?: MediaFile; error?: string }>;
  deleteFile: (id: string) => Promise<boolean>;
  publishChanges: () => Promise<boolean>;
  restoreBackup: (backupData: any) => Promise<boolean>;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { token } = useAuth();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (e) {
      console.error('Failed to load site content:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const updateSection = async (section: string, payload: any) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/section/${section}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await refreshData();
        showToast(`Saved ${section} changes as draft!`);
        return true;
      }
      return false;
    } catch (e) {
      console.error(`Error updating section ${section}:`, e);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateHero = (hero: Partial<HeroSettings>) => updateSection('hero', hero);
  const updateAbout = (about: Partial<AboutSettings>) => updateSection('about', about);
  const updateContact = (contact: Partial<ContactSettings>) => updateSection('contact', contact);
  const updateLogos = (logos: Partial<LogoSettings>) => updateSection('logos', logos);
  const updateTheme = (theme: Partial<ThemeSettings>) => updateSection('theme', theme);
  const updateSystem = (system: Partial<SystemSettings>) => updateSection('system', system);

  const addProject = async (project: Omit<Project, 'id' | 'createdAt'>) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(project)
      });
      if (res.ok) {
        await refreshData();
        showToast('New project added to portfolio!');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(project)
      });
      if (res.ok) {
        await refreshData();
        showToast('Project updated successfully!');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (res.ok) {
        await refreshData();
        showToast('Project removed from portfolio');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(service)
      });
      if (res.ok) {
        await refreshData();
        showToast('Service added successfully!');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateService = async (id: string, service: Partial<Service>) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(service)
      });
      if (res.ok) {
        await refreshData();
        showToast('Service updated successfully!');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (res.ok) {
        await refreshData();
        showToast('Service deleted');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateRates = async (rates: ServiceRate[]) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/rates', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ rates })
      });
      if (res.ok) {
        await refreshData();
        showToast('Pricing and rates updated!');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = async (skill: Omit<Skill, 'id'>) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(skill)
      });
      if (res.ok) {
        await refreshData();
        showToast('New skill added!');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateSkill = async (id: string, skill: Partial<Skill>) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(skill)
      });
      if (res.ok) {
        await refreshData();
        showToast('Skill updated!');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (res.ok) {
        await refreshData();
        showToast('Skill deleted');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const addTestimonial = async (test: Omit<Testimonial, 'id'>) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(test)
      });
      if (res.ok) {
        await refreshData();
        showToast('Testimonial added!');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateTestimonial = async (id: string, test: Partial<Testimonial>) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(test)
      });
      if (res.ok) {
        await refreshData();
        showToast('Testimonial updated!');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (res.ok) {
        await refreshData();
        showToast('Testimonial deleted');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!token) return { success: false, error: 'Unauthorized' };
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const json = await res.json();
      if (res.ok && json.success) {
        await refreshData();
        showToast(`Uploaded ${file.name} successfully!`);
        return { success: true, url: json.file.url, file: json.file };
      }
      return { success: false, error: json.message || 'Upload failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  };

  const deleteFile = async (id: string) => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (res.ok) {
        await refreshData();
        showToast('File deleted from server');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const publishChanges = async () => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: authHeaders
      });
      if (res.ok) {
        await refreshData();
        showToast('🚀 Live Website Updated! All changes are now public.');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const restoreBackup = async (backupData: any) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/restore', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(backupData)
      });
      if (res.ok) {
        await refreshData();
        showToast('Database restored successfully from backup!');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        isLoading,
        isSaving,
        refreshData,
        updateHero,
        updateAbout,
        updateContact,
        updateLogos,
        updateTheme,
        updateSystem,
        addProject,
        updateProject,
        deleteProject,
        addService,
        updateService,
        deleteService,
        updateRates,
        addSkill,
        updateSkill,
        deleteSkill,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        uploadFile,
        deleteFile,
        publishChanges,
        restoreBackup,
        toastMessage,
        setToastMessage
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
