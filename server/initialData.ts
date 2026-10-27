import { SiteDatabase } from '../src/types/index.ts';

export const INITIAL_DATABASE: SiteDatabase = {
  admin: {
    id: 'admin_1',
    email: 'zakir1kb@gmail.com',
    name: 'Zakirullah',
    role: 'Administrator',
    phone: '03439179353',
    location: 'Pakistan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    lastLogin: new Date().toISOString()
  },
  hero: {
    greeting: "Hello, I'm",
    name: 'ZAKIRULLAH',
    professionalTitle: 'Graphic Designer | Logo Creator | 3D Animator | AI Video Creator | Video Editor',
    creativeSlogan: 'Turning Imagination Into Extraordinary Digital Experiences.',
    description: 'I create stunning designs, 3D logos, engaging videos and modern branding solutions that help your business grow and stand out.',
    profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    threeDLogoUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
    primaryButtonText: 'Explore Portfolio',
    primaryButtonLink: '#portfolio',
    secondaryButtonText: 'Contact Me',
    secondaryButtonLink: '#contact',
    whatsappNumber: '03439179353',
    freelanceStatusText: 'Available for Freelance'
  },
  about: {
    bioParagraph1: "Hi, I'm Zakirullah, a passionate Graphic Designer, Video Editor and Creative Artist from Pakistan. I have years of experience in designing logos, banners, videos and branding solutions.",
    bioParagraph2: "I love turning ideas into creative and professional visuals that make an impact. My aim is to elevate your brand presence with top-tier aesthetic precision.",
    profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    name: 'Zakirullah',
    location: 'Tangi, Charsadda, Pakistan',
    experience: '3+ Years',
    availability: 'Available',
    signatureImageUrl: ''
  },
  contact: {
    whatsappNumber: '03439179353',
    whatsappLink: 'https://wa.me/923439179353',
    email: 'zakir1kb@gmail.com',
    alternativeEmail: 'zakirullah5@gmail.com',
    location: 'Tangi, Charsadda, Pakistan',
    country: 'Pakistan',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
      tiktok: 'https://tiktok.com',
      linkedin: 'https://linkedin.com'
    }
  },
  logos: {
    headerLogoUrl: '',
    footerLogoUrl: '',
    faviconUrl: '',
    threeDLogoUrl: '',
    animatedLogoUrl: '',
    introVideoUrl: '',
    logoDimensions: { width: 180, height: 50 }
  },
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentGold: '#eab308',
    backgroundColor: '#050711',
    fontFamily: 'Plus Jakarta Sans',
    enableAnimations: true,
    soundEffects: false,
    lightDarkMode: 'dark'
  },
  system: {
    websiteStatus: true,
    maintenanceMode: false,
    autoBackup: true,
    emailNotifications: true,
    livePreview: true
  },
  projects: [
    {
      id: 'proj_1',
      title: '3D Gold ZK Crown Emblem',
      category: '3D Logo',
      description: 'Futuristic metallic 3D shield and royal crown emblem with custom bevels and cinematic glow.',
      imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
      client: 'Creative Studio Brand',
      order: 1,
      published: true,
      featured: true,
      tags: ['3D Logo', 'Metallic', 'Cinema 4D'],
      createdAt: '2025-04-20T10:00:00.000Z'
    },
    {
      id: 'proj_2',
      title: 'Cyberpunk Animated Logo',
      category: 'Animated Logo',
      description: 'High-octane neon glitch particle reveal for esports and gaming streaming organization.',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-996-large.mp4',
      client: 'Apex Gaming',
      order: 2,
      published: true,
      featured: true,
      tags: ['Animation', 'After Effects', 'Glitch'],
      createdAt: '2025-04-21T11:00:00.000Z'
    },
    {
      id: 'proj_3',
      title: 'AI Cinematic Universe Video',
      category: 'AI Video',
      description: 'Sci-fi atmospheric video generated with generative AI workflows, custom camera motions and color grading.',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
      client: 'Cosmic Media',
      order: 3,
      published: true,
      featured: true,
      tags: ['AI Video', 'Runway', 'Midjourney'],
      createdAt: '2025-04-22T14:30:00.000Z'
    },
    {
      id: 'proj_4',
      title: 'Fresh Glow Juice Commercial',
      category: 'Advertisement Video',
      description: 'Dynamic 3D product motion splash advertisement with 50% promo graphics for social ads.',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
      client: 'Vital Splash Co.',
      order: 4,
      published: true,
      featured: true,
      tags: ['Commercial', 'Product Ad', '3D Motion'],
      createdAt: '2025-04-23T09:15:00.000Z'
    },
    {
      id: 'proj_5',
      title: 'GROW NET Fiber ISP Campaign',
      category: 'Banner Design',
      description: 'Ultra-fast internet ISP social media and outdoor billboard high-contrast marketing banner.',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      client: 'Grow Net Telecom',
      order: 5,
      published: true,
      featured: false,
      tags: ['Banner', 'Photoshop', 'Advertising'],
      createdAt: '2025-04-24T16:00:00.000Z'
    },
    {
      id: 'proj_6',
      title: 'Executive Minimalist CV / Resume',
      category: 'CV Design',
      description: 'Modern two-column typography resume template built for Silicon Valley tech roles.',
      imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
      client: 'CareerPro Services',
      order: 6,
      published: true,
      featured: false,
      tags: ['CV Design', 'Print Design', 'Typography'],
      createdAt: '2025-04-25T12:00:00.000Z'
    },
    {
      id: 'proj_7',
      title: 'Luxury Monogram Logo Design',
      category: 'Logo Design',
      description: 'Minimalist luxury aesthetic geometric monogram branding for real estate & fashion clients.',
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
      client: 'Aura Luxe Real Estate',
      order: 7,
      published: true,
      featured: false,
      tags: ['Vector', 'Illustrator', 'Branding'],
      createdAt: '2025-04-26T08:00:00.000Z'
    },
    {
      id: 'proj_8',
      title: 'Cyberpunk Retouching & Color Grade',
      category: 'Image Editing',
      description: 'Complex frequency separation, digital matte painting, and neon lighting composite.',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      client: 'Neon Art Mag',
      order: 8,
      published: true,
      featured: false,
      tags: ['Retouching', 'Photoshop', 'Composite'],
      createdAt: '2025-04-26T09:30:00.000Z'
    }
  ],
  services: [
    {
      id: 'serv_1',
      title: 'Logo Design',
      description: 'Custom creative, minimalist, and vector brand identity logos with complete source files.',
      icon: 'Shield',
      price: 10,
      currency: 'USD',
      discount: 0,
      show: true,
      order: 1
    },
    {
      id: 'serv_2',
      title: '3D Logo Design',
      description: 'Photorealistic metallic, chrome, and glass 3D embossed logo rendering in high resolution.',
      icon: 'Box',
      price: 20,
      currency: 'USD',
      discount: 10,
      show: true,
      order: 2
    },
    {
      id: 'serv_3',
      title: 'Animated Logo',
      description: 'Cinematic video intros, neon glow reveals, glitch particles, and motion logo idents.',
      icon: 'PlayCircle',
      price: 25,
      currency: 'USD',
      discount: 0,
      show: true,
      order: 3
    },
    {
      id: 'serv_4',
      title: 'AI Video Creation',
      description: 'Cutting-edge AI generated cinematic videos, generative storytelling, and voiceover synchronization.',
      icon: 'Sparkles',
      price: 30,
      currency: 'USD',
      discount: 15,
      show: true,
      order: 4
    },
    {
      id: 'serv_5',
      title: 'Advertisement Video',
      description: 'High-converting social media ads, TikTok/Reels commercials, and 8K product showcase promos.',
      icon: 'Film',
      price: 40,
      currency: 'USD',
      discount: 20,
      show: true,
      order: 5
    },
    {
      id: 'serv_6',
      title: 'Graphic Design',
      description: 'Banners, flyers, social media kits, business cards, posters, and corporate brand stationery.',
      icon: 'Palette',
      price: 10,
      currency: 'USD',
      discount: 0,
      show: true,
      order: 6
    },
    {
      id: 'serv_7',
      title: 'Video Editing',
      description: 'Professional YouTube, podcast, gaming, cinematic documentary, and wedding video post-production.',
      icon: 'Video',
      price: 15,
      currency: 'USD',
      discount: 0,
      show: true,
      order: 7
    },
    {
      id: 'serv_8',
      title: 'Banner Design',
      description: 'High-impact web advertising banners, Google Display ads, shop flex boards and billboards.',
      icon: 'Layout',
      price: 12,
      currency: 'USD',
      discount: 0,
      show: true,
      order: 8
    }
  ],
  rates: [
    {
      id: 'rate_1',
      serviceName: 'Logo Design',
      category: 'Branding',
      ratePKR: 2800,
      rateUSD: 10,
      deliveryTime: '24 Hours',
      revisionLimit: 'Unlimited',
      popular: true
    },
    {
      id: 'rate_2',
      serviceName: '3D Logo Design',
      category: '3D Art',
      ratePKR: 5600,
      rateUSD: 20,
      deliveryTime: '24-48 Hours',
      revisionLimit: 'Unlimited',
      popular: true
    },
    {
      id: 'rate_3',
      serviceName: 'Animated Logo',
      category: 'Animation',
      ratePKR: 7000,
      rateUSD: 25,
      deliveryTime: '48 Hours',
      revisionLimit: '5 Revisions',
      popular: false
    },
    {
      id: 'rate_4',
      serviceName: 'Logo Intro Video',
      category: 'Video',
      ratePKR: 8500,
      rateUSD: 30,
      deliveryTime: '24-48 Hours',
      revisionLimit: 'Unlimited',
      popular: false
    },
    {
      id: 'rate_5',
      serviceName: 'AI Video Creation',
      category: 'AI',
      ratePKR: 8500,
      rateUSD: 30,
      deliveryTime: '48-72 Hours',
      revisionLimit: '3 Revisions',
      popular: true
    },
    {
      id: 'rate_6',
      serviceName: 'Advertisement Video',
      category: 'Commercial',
      ratePKR: 11200,
      rateUSD: 40,
      deliveryTime: '3-4 Days',
      revisionLimit: 'Unlimited',
      popular: false
    },
    {
      id: 'rate_7',
      serviceName: 'Graphic Design',
      category: 'Graphics',
      ratePKR: 2800,
      rateUSD: 10,
      deliveryTime: '12-24 Hours',
      revisionLimit: 'Unlimited',
      popular: false
    },
    {
      id: 'rate_8',
      serviceName: 'Banner Design',
      category: 'Graphics',
      ratePKR: 3500,
      rateUSD: 12,
      deliveryTime: '24 Hours',
      revisionLimit: 'Unlimited',
      popular: false
    },
    {
      id: 'rate_9',
      serviceName: 'CV / Resume Design',
      category: 'Print & Digital',
      ratePKR: 2500,
      rateUSD: 9,
      deliveryTime: '12 Hours',
      revisionLimit: 'Unlimited',
      popular: false
    },
    {
      id: 'rate_10',
      serviceName: 'Video Editing',
      category: 'Post-Production',
      ratePKR: 4200,
      rateUSD: 15,
      deliveryTime: '24 Hours',
      revisionLimit: 'Unlimited',
      popular: true
    }
  ],
  skills: [
    { id: 'sk_1', title: 'Logo Design', category: 'Design', icon: 'Shield', proficiency: 98, visible: true, order: 1 },
    { id: 'sk_2', title: '3D Logo', category: '3D & Animation', icon: 'Box', proficiency: 95, visible: true, order: 2 },
    { id: 'sk_3', title: 'Animation', category: '3D & Animation', icon: 'Sparkles', proficiency: 92, visible: true, order: 3 },
    { id: 'sk_4', title: 'AI Video', category: 'Video & AI', icon: 'Video', proficiency: 90, visible: true, order: 4 },
    { id: 'sk_5', title: 'Video Editing', category: 'Video & AI', icon: 'Film', proficiency: 96, visible: true, order: 5 },
    { id: 'sk_6', title: 'Graphic Design', category: 'Design', icon: 'Palette', proficiency: 99, visible: true, order: 6 },
    { id: 'sk_7', title: 'Banner Design', category: 'Design', icon: 'Layout', proficiency: 94, visible: true, order: 7 },
    { id: 'sk_8', title: 'CV Design', category: 'Design', icon: 'FileText', proficiency: 93, visible: true, order: 8 },
    { id: 'sk_9', title: 'Image Editing', category: 'Design', icon: 'Image', proficiency: 97, visible: true, order: 9 },
    { id: 'sk_10', title: 'Social Media', category: 'Branding & Social', icon: 'Share2', proficiency: 95, visible: true, order: 10 },
    { id: 'sk_11', title: 'Branding', category: 'Branding & Social', icon: 'Crown', proficiency: 94, visible: true, order: 11 },
    { id: 'sk_12', title: 'Animated Logo Design', category: '3D & Animation', icon: 'PlayCircle', proficiency: 91, visible: true, order: 12 },
    { id: 'sk_13', title: 'Logo Intro Videos', category: 'Video & AI', icon: 'Clapperboard', proficiency: 94, visible: true, order: 13 },
    { id: 'sk_14', title: 'AI Video Creation', category: 'Video & AI', icon: 'Bot', proficiency: 89, visible: true, order: 14 },
    { id: 'sk_15', title: 'Advertising Video', category: 'Video & AI', icon: 'Tv', proficiency: 92, visible: true, order: 15 },
    { id: 'sk_16', title: 'Cinematic Video', category: 'Video & AI', icon: 'Camera', proficiency: 90, visible: true, order: 16 },
    { id: 'sk_17', title: '8K Advertisement Video', category: 'Video & AI', icon: 'Monitor', proficiency: 88, visible: true, order: 17 },
    { id: 'sk_18', title: 'Shop Banner Design', category: 'Design', icon: 'ShoppingBag', proficiency: 95, visible: true, order: 18 },
    { id: 'sk_19', title: 'Motion Graphics', category: '3D & Animation', icon: 'Layers', proficiency: 91, visible: true, order: 19 },
    { id: 'sk_20', title: 'Business Card Design', category: 'Branding & Social', icon: 'CreditCard', proficiency: 96, visible: true, order: 20 },
    { id: 'sk_21', title: 'YouTube Thumbnail', category: 'Branding & Social', icon: 'Youtube', proficiency: 99, visible: true, order: 21 },
    { id: 'sk_22', title: 'Social Media Design', category: 'Branding & Social', icon: 'Instagram', proficiency: 97, visible: true, order: 22 },
    { id: 'sk_23', title: 'Brand Identity', category: 'Branding & Social', icon: 'Award', proficiency: 95, visible: true, order: 23 },
    { id: 'sk_24', title: 'Flyer & Poster Design', category: 'Design', icon: 'FileText', proficiency: 94, visible: true, order: 24 },
    { id: 'sk_25', title: 'Product Advertisement', category: 'Video & AI', icon: 'Zap', proficiency: 93, visible: true, order: 25 },
    { id: 'sk_26', title: 'Photo Retouching', category: 'Design', icon: 'Wand2', proficiency: 96, visible: true, order: 26 },
    { id: 'sk_27', title: 'AI Image Generation', category: 'Video & AI', icon: 'Cpu', proficiency: 92, visible: true, order: 27 },
    { id: 'sk_28', title: '2D Logo Animation', category: '3D & Animation', icon: 'Film', proficiency: 90, visible: true, order: 28 },
    { id: 'sk_29', title: '3D Product Rendering', category: '3D & Animation', icon: 'Box', proficiency: 88, visible: true, order: 29 },
    { id: 'sk_30', title: 'Logo Mockup', category: 'Design', icon: 'Layout', proficiency: 97, visible: true, order: 30 },
    { id: 'sk_31', title: 'Intro & Outro Design', category: 'Video & AI', icon: 'Play', proficiency: 92, visible: true, order: 31 },
    { id: 'sk_32', title: 'YouTube Branding', category: 'Branding & Social', icon: 'Tv', proficiency: 95, visible: true, order: 32 },
    { id: 'sk_33', title: 'TikTok Editing', category: 'Video & AI', icon: 'Smartphone', proficiency: 98, visible: true, order: 33 },
    { id: 'sk_34', title: 'Instagram Reels', category: 'Video & AI', icon: 'Instagram', proficiency: 98, visible: true, order: 34 },
    { id: 'sk_35', title: 'Facebook Reels', category: 'Video & AI', icon: 'Facebook', proficiency: 95, visible: true, order: 35 },
    { id: 'sk_36', title: 'Slideshow Videos', category: 'Video & AI', icon: 'Images', proficiency: 92, visible: true, order: 36 },
    { id: 'sk_37', title: 'Wedding Invitation', category: 'Design', icon: 'Heart', proficiency: 93, visible: true, order: 37 },
    { id: 'sk_38', title: 'Restaurant Menu', category: 'Design', icon: 'Utensils', proficiency: 91, visible: true, order: 38 },
    { id: 'sk_39', title: 'Visiting Card', category: 'Branding & Social', icon: 'Contact', proficiency: 95, visible: true, order: 39 },
    { id: 'sk_40', title: 'ID Card', category: 'Design', icon: 'BadgeCheck', proficiency: 90, visible: true, order: 40 },
    { id: 'sk_41', title: 'Certificate Design', category: 'Design', icon: 'Award', proficiency: 92, visible: true, order: 41 },
    { id: 'sk_42', title: 'Product Mockup', category: 'Design', icon: 'Package', proficiency: 94, visible: true, order: 42 },
    { id: 'sk_43', title: 'Packaging Design', category: 'Design', icon: 'BoxSelect', proficiency: 89, visible: true, order: 43 },
    { id: 'sk_44', title: 'Typography Design', category: 'Design', icon: 'Type', proficiency: 93, visible: true, order: 44 },
    { id: 'sk_45', title: 'AI Voiceover', category: 'Video & AI', icon: 'Mic', proficiency: 87, visible: true, order: 45 },
    { id: 'sk_46', title: 'Promotional Graphics', category: 'Design', icon: 'Megaphone', proficiency: 96, visible: true, order: 46 },
    { id: 'sk_47', title: 'Facebook & Instagram Ads', category: 'Branding & Social', icon: 'Target', proficiency: 95, visible: true, order: 47 },
    { id: 'sk_48', title: 'Social Media Content', category: 'Branding & Social', icon: 'Globe', proficiency: 94, visible: true, order: 48 },
    { id: 'sk_49', title: 'Color Grading', category: 'Video & AI', icon: 'Sun', proficiency: 91, visible: true, order: 49 },
    { id: 'sk_50', title: 'Audio Noise Reduction', category: 'Video & AI', icon: 'Volume2', proficiency: 88, visible: true, order: 50 },
    { id: 'sk_51', title: 'VFX Compositing', category: '3D & Animation', icon: 'Sparkle', proficiency: 86, visible: true, order: 51 },
    { id: 'sk_52', title: 'Podcast Video Editing', category: 'Video & AI', icon: 'Headphones', proficiency: 93, visible: true, order: 52 },
    { id: 'sk_53', title: 'Vector Tracing', category: 'Design', icon: 'PenTool', proficiency: 98, visible: true, order: 53 },
    { id: 'sk_54', title: 'E-commerce Product Photo Retouch', category: 'Design', icon: 'ShoppingBag', proficiency: 97, visible: true, order: 54 },
    { id: 'sk_55', title: 'Subtitles & Closed Captions', category: 'Video & AI', icon: 'Subtitles', proficiency: 95, visible: true, order: 55 },
    { id: 'sk_56', title: 'Brand Style Guide', category: 'Branding & Social', icon: 'BookOpen', proficiency: 92, visible: true, order: 56 }
  ],
  testimonials: [
    {
      id: 'test_1',
      name: 'Ahmed Khan',
      role: 'Business Owner',
      company: 'Khan Global Logistics',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      review: 'Zakirullah did an amazing job! His designs are creative, professional and delivered on time. Highly Recommended!',
      rating: 5,
      show: true,
      date: '2025-04-18'
    },
    {
      id: 'test_2',
      name: 'Sarah Jenkins',
      role: 'Marketing Director',
      company: 'Apex Media USA',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      review: 'The 3D animated logo and advertisement videos Zakirullah made for our product launch exceeded all expectations. Fast communication and top-tier quality!',
      rating: 5,
      show: true,
      date: '2025-04-20'
    },
    {
      id: 'test_3',
      name: 'Bilal Farooq',
      role: 'E-commerce Founder',
      company: 'Trendify Pakistan',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      review: 'Working with Zakirullah has been a game-changer. The social media banners and promotional video edits generated tremendous engagement for us.',
      rating: 5,
      show: true,
      date: '2025-04-24'
    }
  ],
  media: [
    {
      id: 'med_1',
      name: 'logo_2025.png',
      url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=400&q=80',
      type: 'logo',
      format: 'png',
      sizeBytes: 2516582,
      dimensions: '1024x1024',
      createdAt: '2025-04-26T08:15:00.000Z'
    },
    {
      id: 'med_2',
      name: 'banner_grow_net.jpg',
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      format: 'jpeg',
      sizeBytes: 1887436,
      dimensions: '1920x1080',
      createdAt: '2025-04-25T14:22:00.000Z'
    },
    {
      id: 'med_3',
      name: 'video_intro.mp4',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-996-large.mp4',
      type: 'video',
      format: 'mp4',
      sizeBytes: 13212057,
      dimensions: '1920x1080',
      createdAt: '2025-04-24T18:40:00.000Z'
    },
    {
      id: 'med_4',
      name: 'portfolio_3d.jpg',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      format: 'jpeg',
      sizeBytes: 3355443,
      dimensions: '2048x1536',
      createdAt: '2025-04-23T11:05:00.000Z'
    }
  ],
  activities: [
    {
      id: 'act_1',
      action: 'New project added',
      category: 'Portfolio',
      details: 'Added "3D Gold ZK Crown Emblem" in 3D Logo category',
      timestamp: '2 minutes ago',
      user: 'Zakirullah'
    },
    {
      id: 'act_2',
      action: 'Image updated',
      category: 'Hero Section',
      details: 'Replaced hero background glow composition',
      timestamp: '12 minutes ago',
      user: 'Zakirullah'
    },
    {
      id: 'act_3',
      action: 'Service price updated',
      category: 'Pricing',
      details: 'Updated rate for AI Video Creation ($30 / 8,500 PKR)',
      timestamp: '25 minutes ago',
      user: 'Zakirullah'
    },
    {
      id: 'act_4',
      action: 'New image uploaded',
      category: 'Media',
      details: 'Uploaded "logo_2025.png" to Media Library',
      timestamp: '1 hour ago',
      user: 'Zakirullah'
    },
    {
      id: 'act_5',
      action: 'Website settings changed',
      category: 'Appearance',
      details: 'Updated accent neon cyan and gold gradients',
      timestamp: '2 hours ago',
      user: 'Zakirullah'
    }
  ],
  inquiries: [
    {
      id: 'inq_1',
      name: 'Ahmed Khan',
      email: 'ahmed.k@example.com',
      phone: '03001234567',
      service: '3D Logo Animation',
      message: 'Hello Zakirullah, I need a high-end 3D metallic gold animated logo for our brand launch next week.',
      createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 'inq_2',
      name: 'Sarah Williams',
      email: 'sarah.w@creativeagency.com',
      phone: '+44 7700 900077',
      service: 'Video Editing',
      message: 'Looking for a skilled video editor for our client social media reels and ad commercials.',
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      read: false
    }
  ],
  notifications: [
    {
      id: 'notif_1',
      title: 'New Client Inquiry: Ahmed Khan',
      message: 'Requested 3D Logo Animation service (Contact: ahmed.k@example.com)',
      type: 'inquiry',
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      read: false,
      link: 'contact'
    },
    {
      id: 'notif_2',
      title: 'New Client Inquiry: Sarah Williams',
      message: 'Requested Video Editing for social media reels & ad campaigns',
      type: 'inquiry',
      timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      read: false,
      link: 'contact'
    },
    {
      id: 'notif_3',
      title: 'CV / Resume Feature Active',
      message: 'Portfolio CV download button is configured and ready for uploads',
      type: 'cv',
      timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      read: true,
      link: 'cv'
    }
  ],
  lastPublishedAt: new Date().toISOString(),
  isDraft: false
};
