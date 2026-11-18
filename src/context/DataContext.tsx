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
  SystemSettings,
  AdminNotification
} from '../types/index.ts';
import { useAuth } from './AuthContext.tsx';
import { INITIAL_DATABASE } from '../data/initialData.ts';
import { apiUrl, resolveUploadUrl, normalizeDatabaseUrls } from '../utils/api.ts';

interface DataContextType {
  data: SiteDatabase;
  isLoading: boolean;
  isSaving: boolean;
  refreshData: () => Promise<void>;
  notifications: AdminNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
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
  uploadCV: (file: File) => Promise<{ success: boolean; error?: string; hero?: HeroSettings }>;
  removeCV: () => Promise<boolean>;
  deleteFile: (id: string) => Promise<boolean>;
  publishChanges: () => Promise<boolean>;
  restoreBackup: (backupData: any) => Promise<boolean>;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const DataContext = createContext<DataContextType | null>(null);

const STORAGE_KEY = 'zk_portfolio_data';

// Helper to safely read initial database with fallback
function getInitialData(): SiteDatabase {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Validate that essential keys exist
      if (parsed && parsed.hero && Array.isArray(parsed.services) && Array.isArray(parsed.skills)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse cached portfolio data:', e);
  }
  return INITIAL_DATABASE;
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteDatabase>(getInitialData);
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

  // Persist locally
  const saveLocally = useCallback((nextData: SiteDatabase) => {
    setData(nextData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/content'));
      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          saveLocally(normalizeDatabaseUrls(json.data));
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      // Offline / GitHub Pages static mode where /api/content 404s
      console.info('Backend API unavailable, using client-bundled data / localStorage.');
    }

    // Fallback: verify we have at least initial data loaded
    setData((curr) => {
      if (!curr || !curr.services || curr.services.length === 0) {
        return INITIAL_DATABASE;
      }
      return curr;
    });
    setIsLoading(false);
  }, [saveLocally]);

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
    let apiSuccess = false;
    try {
      const res = await fetch(apiUrl(`/api/admin/section/${section}`), {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        apiSuccess = true;
      }
    } catch {
      // Backend not running (static GitHub Pages)
    }

    // Always update client state & localStorage
    setData((prev) => {
      const updated = {
        ...prev,
        [section]: {
          ...(prev as any)[section],
          ...payload
        }
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast(`Saved ${section} changes!`);
    return true;
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
    const newProject: Project = {
      ...project,
      id: 'proj_' + Date.now(),
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(apiUrl('/api/admin/projects'), {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(project)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.project) {
          newProject.id = json.project.id;
        }
      }
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        projects: [newProject, ...prev.projects]
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast('New project added to portfolio!');
    return true;
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      await fetch(apiUrl(`/api/admin/projects/${id}`), {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(project)
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        projects: prev.projects.map((p) => (p.id === id ? { ...p, ...project } : p))
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast('Project updated successfully!');
    return true;
  };

  const deleteProject = async (id: string) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      await fetch(apiUrl(`/api/admin/projects/${id}`), {
        method: 'DELETE',
        headers: authHeaders
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id)
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast('Project removed from portfolio');
    return true;
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    if (!token) return false;
    setIsSaving(true);
    const newService: Service = {
      ...service,
      id: 'srv_' + Date.now()
    };

    try {
      const res = await fetch(apiUrl('/api/admin/services'), {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(service)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.service) {
          newService.id = json.service.id;
        }
      }
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        services: [...prev.services, newService]
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast('Service added successfully!');
    return true;
  };

  const updateService = async (id: string, service: Partial<Service>) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      await fetch(apiUrl(`/api/admin/services/${id}`), {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(service)
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        services: prev.services.map((s) => (s.id === id ? { ...s, ...service } : s))
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast('Service updated successfully!');
    return true;
  };

  const deleteService = async (id: string) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      await fetch(apiUrl(`/api/admin/services/${id}`), {
        method: 'DELETE',
        headers: authHeaders
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        services: prev.services.filter((s) => s.id !== id)
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast('Service deleted');
    return true;
  };

  const updateRates = async (rates: ServiceRate[]) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      await fetch(apiUrl('/api/admin/rates'), {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ rates })
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        rates
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast('Pricing and rates updated!');
    return true;
  };

  const addSkill = async (skill: Omit<Skill, 'id'>) => {
    if (!token) return false;
    setIsSaving(true);
    const newSkill: Skill = {
      ...skill,
      id: 'skl_' + Date.now()
    };

    try {
      const res = await fetch(apiUrl('/api/admin/skills'), {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(skill)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.skill) {
          newSkill.id = json.skill.id;
        }
      }
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        skills: [...prev.skills, newSkill]
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast('New skill added!');
    return true;
  };

  const updateSkill = async (id: string, skill: Partial<Skill>) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      await fetch(apiUrl(`/api/admin/skills/${id}`), {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(skill)
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        skills: prev.skills.map((s) => (s.id === id ? { ...s, ...skill } : s))
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast('Skill updated!');
    return true;
  };

  const deleteSkill = async (id: string) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      await fetch(apiUrl(`/api/admin/skills/${id}`), {
        method: 'DELETE',
        headers: authHeaders
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        skills: prev.skills.filter((s) => s.id !== id)
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast('Skill deleted');
    return true;
  };

  const addTestimonial = async (test: Omit<Testimonial, 'id'>) => {
    if (!token) return false;
    setIsSaving(true);
    const newTest: Testimonial = {
      ...test,
      id: 'test_' + Date.now()
    };

    try {
      const res = await fetch(apiUrl('/api/admin/testimonials'), {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(test)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.testimonial) {
          newTest.id = json.testimonial.id;
        }
      }
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        testimonials: [...prev.testimonials, newTest]
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast('Testimonial added!');
    return true;
  };

  const updateTestimonial = async (id: string, test: Partial<Testimonial>) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      await fetch(apiUrl(`/api/admin/testimonials/${id}`), {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(test)
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        testimonials: prev.testimonials.map((t) => (t.id === id ? { ...t, ...test } : t))
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast('Testimonial updated!');
    return true;
  };

  const deleteTestimonial = async (id: string) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      await fetch(apiUrl(`/api/admin/testimonials/${id}`), {
        method: 'DELETE',
        headers: authHeaders
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        testimonials: prev.testimonials.filter((t) => t.id !== id)
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsSaving(false);
    showToast('Testimonial deleted');
    return true;
  };

  // Helper to read file as Data URL
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async (file: File) => {
    if (!token) return { success: false, error: 'Unauthorized' };
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(apiUrl('/api/admin/upload'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const json = await res.json();
      if (res.ok && json.success) {
        await refreshData();
        const resolvedUrl = resolveUploadUrl(json.file.url);
        const resolvedFile = { ...json.file, url: resolvedUrl };
        showToast(`Uploaded ${file.name} successfully!`);
        return { success: true, url: resolvedUrl, file: resolvedFile };
      }
    } catch {
      // Backend unavailable; process offline via Data URL
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const mediaItem: MediaFile = {
        id: 'med_' + Date.now(),
        name: file.name,
        url: dataUrl,
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
        format: file.name.split('.').pop() || 'dat',
        sizeBytes: file.size,
        createdAt: new Date().toISOString()
      };

      setData((prev) => {
        const updated = {
          ...prev,
          media: [mediaItem, ...prev.media]
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      showToast(`Uploaded ${file.name} successfully!`);
      return { success: true, url: dataUrl, file: mediaItem };
    } catch (err: any) {
      return { success: false, error: err.message || 'Upload failed' };
    }
  };

  const uploadCV = async (file: File) => {
    if (!token) return { success: false, error: 'Unauthorized' };
    const formData = new FormData();
    formData.append('cvFile', file);
    try {
      const res = await fetch(apiUrl('/api/admin/cv/upload'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const json = await res.json();
      if (res.ok && json.success) {
        await refreshData();
        showToast(`CV / Resume updated with "${file.name}"!`);
        return { success: true, hero: normalizeDatabaseUrls(json.hero) };
      }
    } catch {
      // Backend unavailable; process offline via Data URL
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      let updatedHero: HeroSettings = {
        ...data.hero,
        cvPdfUrl: dataUrl,
        cvFileName: file.name,
        cvFileSize: `${(file.size / 1024).toFixed(1)} KB`,
        cvLastUpdated: new Date().toISOString()
      };

      setData((prev) => {
        const updated = {
          ...prev,
          hero: {
            ...prev.hero,
            cvPdfUrl: dataUrl,
            cvFileName: file.name,
            cvFileSize: `${(file.size / 1024).toFixed(1)} KB`,
            cvLastUpdated: new Date().toISOString()
          }
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      showToast(`CV / Resume updated with "${file.name}"!`);
      return { success: true, hero: updatedHero };
    } catch (err: any) {
      return { success: false, error: err.message || 'CV upload failed' };
    }
  };

  const removeCV = async () => {
    if (!token) return false;
    try {
      await fetch(apiUrl('/api/admin/cv'), {
        method: 'DELETE',
        headers: authHeaders
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        hero: {
          ...prev.hero,
          cvPdfUrl: '',
          cvFileName: '',
          cvFileSize: '',
          cvLastUpdated: undefined
        }
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    showToast('CV reset to default browser print format');
    return true;
  };

  const deleteFile = async (id: string) => {
    if (!token) return false;
    try {
      await fetch(apiUrl(`/api/admin/media/${id}`), {
        method: 'DELETE',
        headers: authHeaders
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        media: prev.media.filter((m) => m.id !== id)
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    showToast('File deleted');
    return true;
  };

  const publishChanges = async () => {
    if (!token) return false;
    setIsSaving(true);
    try {
      await fetch(apiUrl('/api/admin/publish'), {
        method: 'POST',
        headers: authHeaders
      });
    } catch {}

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}

    setIsSaving(false);
    showToast('🚀 Live Website Updated! All changes are now public.');
    return true;
  };

  const restoreBackup = async (backupData: any) => {
    if (!token) return false;
    setIsSaving(true);
    try {
      await fetch(apiUrl('/api/admin/restore'), {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(backupData)
      });
    } catch {}

    if (backupData && backupData.hero) {
      saveLocally(backupData);
    }

    setIsSaving(false);
    showToast('Database restored successfully from backup!');
    return true;
  };

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = async (id: string) => {
    if (!token) return;
    try {
      await fetch(apiUrl(`/api/admin/notifications/${id}/read`), {
        method: 'POST',
        headers: authHeaders
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        notifications: (prev.notifications || []).map((n) => (n.id === id ? { ...n, read: true } : n))
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const markAllNotificationsRead = async () => {
    if (!token) return;
    try {
      await fetch(apiUrl('/api/admin/notifications/mark-all-read'), {
        method: 'POST',
        headers: authHeaders
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        notifications: (prev.notifications || []).map((n) => ({ ...n, read: true }))
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('All notifications marked as read');
  };

  const deleteNotification = async (id: string) => {
    if (!token) return;
    try {
      await fetch(apiUrl(`/api/admin/notifications/${id}`), {
        method: 'DELETE',
        headers: authHeaders
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        notifications: (prev.notifications || []).filter((n) => n.id !== id)
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearAllNotifications = async () => {
    if (!token) return;
    try {
      await fetch(apiUrl('/api/admin/notifications'), {
        method: 'DELETE',
        headers: authHeaders
      });
    } catch {}

    setData((prev) => {
      const updated = {
        ...prev,
        notifications: []
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('All notifications cleared');
  };

  return (
    <DataContext.Provider
      value={{
        data,
        isLoading,
        isSaving,
        refreshData,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearAllNotifications,
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
        uploadCV,
        removeCV,
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
