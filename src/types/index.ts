export interface Project {
  id: string;
  title: string;
  category: 
    | 'Logo Design'
    | '3D Logo'
    | 'Animated Logo'
    | 'AI Video'
    | 'Advertisement Video'
    | 'Graphic Design'
    | 'Banner Design'
    | 'CV Design'
    | 'Image Editing'
    | 'Video Editing'
    | 'Other Projects';
  description: string;
  imageUrl: string;
  videoUrl?: string;
  client?: string;
  order: number;
  published: boolean;
  featured?: boolean;
  tags?: string[];
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  price: number;
  currency: 'USD' | 'PKR';
  discount?: number;
  show: boolean;
  order: number;
}

export interface ServiceRate {
  id: string;
  serviceName: string;
  category: string;
  ratePKR: number;
  rateUSD: number;
  deliveryTime: string;
  revisionLimit: string;
  popular?: boolean;
}

export interface Skill {
  id: string;
  title: string;
  category: 'Design' | '3D & Animation' | 'Video & AI' | 'Branding & Social' | 'Other';
  icon: string;
  proficiency: number; // 0 - 100
  visible: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  review: string;
  rating: number; // 1-5
  show: boolean;
  date?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'logo' | 'document';
  format: string;
  sizeBytes: number;
  dimensions?: string;
  createdAt: string;
}

export interface LogoSettings {
  headerLogoUrl: string;
  footerLogoUrl: string;
  faviconUrl: string;
  threeDLogoUrl: string;
  animatedLogoUrl: string;
  introVideoUrl?: string;
  logoDimensions: { width: number; height: number };
}

export interface HeroSettings {
  greeting: string;
  name: string;
  professionalTitle: string;
  creativeSlogan: string;
  description: string;
  profileImageUrl: string;
  backgroundImageUrl: string;
  threeDLogoUrl: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  whatsappNumber: string;
  freelanceStatusText: string;
}

export interface AboutSettings {
  bioParagraph1: string;
  bioParagraph2: string;
  profileImageUrl: string;
  name: string;
  location: string;
  experience: string;
  availability: string;
  signatureImageUrl?: string;
}

export interface ContactSettings {
  whatsappNumber: string;
  whatsappLink: string;
  email: string;
  alternativeEmail: string;
  location: string;
  country: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
    linkedin: string;
  };
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentGold: string;
  backgroundColor: string;
  fontFamily: string;
  enableAnimations: boolean;
  soundEffects: boolean;
  lightDarkMode: 'dark' | 'light';
}

export interface SystemSettings {
  websiteStatus: boolean;
  maintenanceMode: boolean;
  autoBackup: boolean;
  emailNotifications: boolean;
  livePreview: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  location: string;
  avatar: string;
  lastLogin?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  category: string;
  details: string;
  timestamp: string;
  user: string;
}

export interface SiteDatabase {
  admin: AdminUser;
  hero: HeroSettings;
  about: AboutSettings;
  contact: ContactSettings;
  logos: LogoSettings;
  theme: ThemeSettings;
  system: SystemSettings;
  projects: Project[];
  services: Service[];
  rates: ServiceRate[];
  skills: Skill[];
  testimonials: Testimonial[];
  media: MediaFile[];
  activities: ActivityLog[];
  lastPublishedAt: string;
  isDraft: boolean;
}
