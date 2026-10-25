import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  getDatabase,
  saveDatabase,
  getAuth,
  saveAuth,
  hashPassword,
  verifyPassword,
  createSessionToken,
  validateSessionToken,
  revokeSessionToken,
  addActivity
} from './server/db.ts';

// Initialize environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Security Middleware: Set HTTP Security Headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// JSON and URL-encoded Body Parsers with safe payload limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory with safe headers
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res, filePath) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'");
    }
  }
}));

// Configure Multer for Safe File Uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.mp4', '.webm', '.pdf', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Security Alert: Unsupported file extension ${ext}. Allowed: ${allowedExtensions.join(', ')}`));
    }
  }
});

// ================= RATE LIMITING / BRUTE-FORCE PROTECTION =================
interface LoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}
const loginAttempts = new Map<string, LoginAttempt>();

function checkLoginRateLimit(ip: string): { allowed: boolean; waitMinutes?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (!attempt) return { allowed: true };

  // Check if locked
  if (attempt.lockedUntil && attempt.lockedUntil > now) {
    const waitMinutes = Math.ceil((attempt.lockedUntil - now) / (60 * 1000));
    return { allowed: false, waitMinutes };
  }

  // Reset if last attempt was more than 15 minutes ago
  if (now - attempt.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const attempt = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
  attempt.count += 1;
  attempt.lastAttempt = now;

  // Lock account from this IP for 15 minutes after 5 failed attempts
  if (attempt.count >= 5) {
    attempt.lockedUntil = now + 15 * 60 * 1000;
  }

  loginAttempts.set(ip, attempt);
}

function clearLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

// ================= AUTHENTICATION MIDDLEWARE =================
function authenticateAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized: Admin authentication token required' });
    return;
  }

  const token = authHeader.substring(7).trim();
  if (!validateSessionToken(token)) {
    res.status(401).json({ success: false, message: 'Unauthorized: Session invalid, expired, or tampered' });
    return;
  }

  next();
}

// ================= AUTH ROUTES =================

// Admin Login with Brute-Force Rate Limiting
app.post('/api/admin/login', (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const rateLimit = checkLoginRateLimit(clientIp);

  if (!rateLimit.allowed) {
    res.status(429).json({
      success: false,
      message: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${rateLimit.waitMinutes} minute(s).`
    });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ success: false, message: 'Email and password are required' });
    return;
  }

  const auth = getAuth();
  const db = getDatabase();

  const normalizedInputEmail = email.toLowerCase().trim();
  const normalizedStoredEmail = auth.adminEmail.toLowerCase().trim();

  if (normalizedInputEmail !== normalizedStoredEmail) {
    recordFailedLogin(clientIp);
    res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    return;
  }

  const isValid = verifyPassword(password, auth.passwordHash, auth.salt);
  if (!isValid) {
    recordFailedLogin(clientIp);
    res.status(401).json({ success: false, message: 'Incorrect password. Please verify credentials.' });
    return;
  }

  // Clear failed attempts upon successful login
  clearLoginAttempts(clientIp);

  const token = createSessionToken(auth.adminEmail);
  db.admin.lastLogin = new Date().toISOString();
  saveDatabase(db);
  addActivity('Admin Logged In', 'Authentication', `Successful login from ${email} (IP: ${clientIp})`);

  res.json({
    success: true,
    token,
    user: db.admin
  });
});

// Verify Current Session
app.get('/api/admin/me', authenticateAdmin, (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json({
    success: true,
    user: db.admin
  });
});

// Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    revokeSessionToken(token);
  }
  addActivity('Admin Logged Out', 'Authentication', 'Session terminated securely');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Change Password
app.post('/api/admin/change-password', authenticateAdmin, (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword || typeof oldPassword !== 'string' || typeof newPassword !== 'string') {
    res.status(400).json({ success: false, message: 'Current password and new password are required' });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    return;
  }

  const auth = getAuth();
  if (!verifyPassword(oldPassword, auth.passwordHash, auth.salt)) {
    res.status(400).json({ success: false, message: 'Current password does not match' });
    return;
  }

  const { hash, salt } = hashPassword(newPassword);
  auth.passwordHash = hash;
  auth.salt = salt;
  saveAuth(auth);

  addActivity('Password Changed', 'Security', 'Admin master password updated securely');
  res.json({ success: true, message: 'Password changed successfully' });
});

// Update Admin Profile
app.put('/api/admin/profile', authenticateAdmin, (req: Request, res: Response) => {
  const db = getDatabase();
  const { name, phone, location, avatar, email } = req.body;

  if (email && typeof email === 'string') {
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      res.status(400).json({ success: false, message: 'Invalid email address format' });
      return;
    }
    const auth = getAuth();
    auth.adminEmail = trimmedEmail;
    saveAuth(auth);
    db.admin.email = trimmedEmail;
  }

  if (name && typeof name === 'string') db.admin.name = name.trim();
  if (phone && typeof phone === 'string') db.admin.phone = phone.trim();
  if (location && typeof location === 'string') db.admin.location = location.trim();
  if (avatar && typeof avatar === 'string') db.admin.avatar = avatar.trim();

  saveDatabase(db);
  addActivity('Profile Updated', 'Settings', 'Admin personal profile information updated');
  res.json({ success: true, user: db.admin });
});

// ================= CONTENT & CMS ROUTES =================

// Public and Admin Content Fetch with Anti-Caching Headers
app.get('/api/content', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.json({
    success: true,
    data: db
  });
});

// Update Specific Website Section (Hero, About, Contact, Logos, Theme, System)
app.put('/api/admin/section/:section', authenticateAdmin, (req: Request, res: Response) => {
  const { section } = req.params;
  const db = getDatabase();

  const validSections = ['hero', 'about', 'contact', 'logos', 'theme', 'system'];
  if (!validSections.includes(section) || !(section in db)) {
    res.status(400).json({ success: false, message: `Invalid section: ${section}` });
    return;
  }

  // Update section and auto-publish so live site updates immediately
  (db as any)[section] = { ...(db as any)[section], ...req.body };
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity(`Updated ${section.toUpperCase()}`, 'Content Control', `Modified and published ${section} section content`);
  res.json({ success: true, data: (db as any)[section], isDraft: db.isDraft, lastPublishedAt: db.lastPublishedAt });
});

// Portfolio Projects CRUD
app.post('/api/admin/projects', authenticateAdmin, (req: Request, res: Response) => {
  const db = getDatabase();
  const newProject = {
    id: 'proj_' + Date.now(),
    order: db.projects.length + 1,
    published: true,
    createdAt: new Date().toISOString(),
    ...req.body
  };

  db.projects.unshift(newProject);
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('New Project Added', 'Portfolio', `Added project "${newProject.title}" in ${newProject.category}`);
  res.json({ success: true, project: newProject });
});

app.put('/api/admin/projects/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.projects.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }

  db.projects[index] = { ...db.projects[index], ...req.body };
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Project Updated', 'Portfolio', `Updated project "${db.projects[index].title}"`);
  res.json({ success: true, project: db.projects[index] });
});

app.delete('/api/admin/projects/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const proj = db.projects.find((p) => p.id === id);
  db.projects = db.projects.filter((p) => p.id !== id);
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Project Deleted', 'Portfolio', `Deleted project "${proj ? proj.title : id}"`);
  res.json({ success: true, message: 'Project deleted' });
});

// Services CRUD
app.post('/api/admin/services', authenticateAdmin, (req: Request, res: Response) => {
  const db = getDatabase();
  const newService = {
    id: 'serv_' + Date.now(),
    order: db.services.length + 1,
    show: true,
    ...req.body
  };

  db.services.push(newService);
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Service Added', 'Services', `Added service "${newService.title}"`);
  res.json({ success: true, service: newService });
});

app.put('/api/admin/services/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.services.findIndex((s) => s.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Service not found' });
    return;
  }

  db.services[index] = { ...db.services[index], ...req.body };
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Service Updated', 'Services', `Updated service "${db.services[index].title}"`);
  res.json({ success: true, service: db.services[index] });
});

app.delete('/api/admin/services/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const serv = db.services.find((s) => s.id === id);
  db.services = db.services.filter((s) => s.id !== id);
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Service Deleted', 'Services', `Deleted service "${serv ? serv.title : id}"`);
  res.json({ success: true, message: 'Service deleted' });
});

// Service Rates Management
app.put('/api/admin/rates', authenticateAdmin, (req: Request, res: Response) => {
  const db = getDatabase();
  if (Array.isArray(req.body.rates)) {
    db.rates = req.body.rates;
  } else if (req.body.id) {
    const idx = db.rates.findIndex((r) => r.id === req.body.id);
    if (idx !== -1) {
      db.rates[idx] = { ...db.rates[idx], ...req.body };
    } else {
      db.rates.push(req.body);
    }
  }
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Service Rates Updated', 'Pricing', 'Updated dynamic service prices and delivery terms');
  res.json({ success: true, rates: db.rates });
});

// Skills CRUD
app.post('/api/admin/skills', authenticateAdmin, (req: Request, res: Response) => {
  const db = getDatabase();
  const newSkill = {
    id: 'sk_' + Date.now(),
    order: db.skills.length + 1,
    visible: true,
    ...req.body
  };
  db.skills.push(newSkill);
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Skill Added', 'Skills', `Added skill "${newSkill.title}"`);
  res.json({ success: true, skill: newSkill });
});

app.put('/api/admin/skills/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const idx = db.skills.findIndex((s) => s.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: 'Skill not found' });
    return;
  }
  db.skills[idx] = { ...db.skills[idx], ...req.body };
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Skill Updated', 'Skills', `Updated skill "${db.skills[idx].title}"`);
  res.json({ success: true, skill: db.skills[idx] });
});

app.delete('/api/admin/skills/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const sk = db.skills.find((s) => s.id === id);
  db.skills = db.skills.filter((s) => s.id !== id);
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Skill Deleted', 'Skills', `Deleted skill "${sk ? sk.title : id}"`);
  res.json({ success: true, message: 'Skill deleted' });
});

// Testimonials CRUD
app.post('/api/admin/testimonials', authenticateAdmin, (req: Request, res: Response) => {
  const db = getDatabase();
  const newTestimonial = {
    id: 'test_' + Date.now(),
    show: true,
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.testimonials.unshift(newTestimonial);
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Testimonial Added', 'Testimonials', `Added review by "${newTestimonial.name}"`);
  res.json({ success: true, testimonial: newTestimonial });
});

app.put('/api/admin/testimonials/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const idx = db.testimonials.findIndex((t) => t.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: 'Testimonial not found' });
    return;
  }
  db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Testimonial Updated', 'Testimonials', `Updated review by "${db.testimonials[idx].name}"`);
  res.json({ success: true, testimonial: db.testimonials[idx] });
});

app.delete('/api/admin/testimonials/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const test = db.testimonials.find((t) => t.id === id);
  db.testimonials = db.testimonials.filter((t) => t.id !== id);
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Testimonial Deleted', 'Testimonials', `Deleted testimonial by "${test ? test.name : id}"`);
  res.json({ success: true, message: 'Testimonial deleted' });
});

// File Upload Endpoint with Anti-Malware Content Verification
app.post('/api/admin/upload', authenticateAdmin, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }

  const file = req.file;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  let fileType: 'image' | 'video' | 'logo' | 'document' = 'image';

  // SVG Security Sanitation Check
  if (ext === 'svg') {
    try {
      const content = fs.readFileSync(file.path, 'utf-8');
      if (/<script/i.test(content) || /javascript:/i.test(content) || /onload/i.test(content)) {
        fs.unlinkSync(file.path);
        res.status(400).json({ success: false, message: 'Security Alert: Malicious SVG content detected.' });
        return;
      }
    } catch {
      // Ignore read error
    }
  }

  if (['mp4', 'webm', 'mov'].includes(ext)) {
    fileType = 'video';
  } else if (file.originalname.toLowerCase().includes('logo')) {
    fileType = 'logo';
  } else if (['pdf', 'doc', 'docx'].includes(ext)) {
    fileType = 'document';
  }

  const fileUrl = `/uploads/${file.filename}`;
  const mediaItem = {
    id: 'med_' + Date.now(),
    name: file.originalname,
    url: fileUrl,
    type: fileType,
    format: ext,
    sizeBytes: file.size,
    createdAt: new Date().toISOString()
  };

  const db = getDatabase();
  db.media.unshift(mediaItem);
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('File Uploaded', 'Media Library', `Uploaded ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
  res.json({
    success: true,
    file: mediaItem
  });
});

// Convert / Pin Uploaded Media Directly as Portfolio Project
app.post('/api/admin/media/:id/to-project', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, category } = req.body;
  const db = getDatabase();
  const mediaItem = db.media.find((m) => m.id === id);

  if (!mediaItem) {
    res.status(404).json({ success: false, message: 'Media item not found' });
    return;
  }

  const isVideo = mediaItem.type === 'video';
  const newProject = {
    id: 'proj_' + Date.now(),
    title: (title && typeof title === 'string') ? title.trim() : mediaItem.name.replace(/\.[^/.]+$/, ''),
    category: (category && typeof category === 'string') ? category : (isVideo ? 'Video Editing' : 'Graphic Design'),
    description: `Professional ${mediaItem.type} production & branding showcase: ${mediaItem.name}`,
    imageUrl: isVideo
      ? 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80'
      : mediaItem.url,
    videoUrl: isVideo ? mediaItem.url : undefined,
    client: 'Client Commission',
    order: db.projects.length + 1,
    published: true,
    featured: true,
    createdAt: new Date().toISOString()
  };

  db.projects.unshift(newProject as any);
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Media Promoted to Project', 'Portfolio', `Promoted "${newProject.title}" to public portfolio project`);
  res.json({ success: true, project: newProject });
});

// Delete Media File with Path Traversal Protection
app.delete('/api/admin/media/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const fileItem = db.media.find((m) => m.id === id);

  if (fileItem) {
    if (fileItem.url.startsWith('/uploads/')) {
      const fileName = path.basename(fileItem.url);
      const safePath = path.resolve(UPLOADS_DIR, fileName);

      // Verify the file path strictly stays within UPLOADS_DIR (Path Traversal Protection)
      if (safePath.startsWith(UPLOADS_DIR) && fs.existsSync(safePath)) {
        try {
          fs.unlinkSync(safePath);
        } catch (e) {
          console.error('Error removing file:', e);
        }
      }
    }
    db.media = db.media.filter((m) => m.id !== id);
    db.isDraft = false;
    db.lastPublishedAt = new Date().toISOString();
    saveDatabase(db);
    addActivity('File Deleted', 'Media Library', `Deleted media file ${fileItem.name}`);
  }

  res.json({ success: true, message: 'File deleted successfully' });
});

// Explicit Publish Changes
app.post('/api/admin/publish', authenticateAdmin, (_req: Request, res: Response) => {
  const db = getDatabase();
  db.isDraft = false;
  db.lastPublishedAt = new Date().toISOString();
  saveDatabase(db);

  addActivity('Changes Published', 'System', 'Published all draft changes to the live public website');
  res.json({
    success: true,
    message: 'All changes published successfully to live portfolio',
    lastPublishedAt: db.lastPublishedAt
  });
});

// Backup: Download JSON
app.get('/api/admin/backup', authenticateAdmin, (_req: Request, res: Response) => {
  const db = getDatabase();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=zakirullah_backup_${Date.now()}.json`);
  res.send(JSON.stringify(db, null, 2));
});

// Restore: Upload JSON
app.post('/api/admin/restore', authenticateAdmin, (req: Request, res: Response) => {
  const backupData = req.body;
  if (!backupData || !backupData.hero || !backupData.projects) {
    res.status(400).json({ success: false, message: 'Invalid backup JSON file structure' });
    return;
  }

  saveDatabase(backupData);
  addActivity('Database Restored', 'System', 'Restored website data from backup file');
  res.json({ success: true, message: 'Website restored from backup successfully!' });
});

// Activities
app.get('/api/admin/activities', authenticateAdmin, (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, activities: db.activities });
});

// Public Client Contact & Inquiry Submission Endpoint
app.post('/api/contact/inquiry', (req: Request, res: Response) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ success: false, message: 'Your name is required.' });
    return;
  }

  const cleanName = name.trim().slice(0, 100);
  const cleanEmail = (typeof email === 'string' ? email.trim() : '').slice(0, 100);
  const cleanPhone = (typeof phone === 'string' ? phone.trim() : '').slice(0, 50);
  const cleanService = (typeof service === 'string' ? service.trim() : 'General Inquiry').slice(0, 100);
  const cleanMessage = (typeof message === 'string' ? message.trim() : '').slice(0, 1000);

  addActivity(
    `New Inquiry: ${cleanName}`,
    'Client Inquiry',
    `Service: ${cleanService} | Contact: ${cleanEmail || cleanPhone || 'WhatsApp'} | Message: ${cleanMessage.substring(0, 150)}...`,
    cleanName
  );

  res.json({
    success: true,
    message: 'Thank you! Your inquiry has been sent to Zakirullah. We will respond shortly.'
  });
});

// Global Error Handling Middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred'
  });
});

// ================= FRONTEND / VITE SERVER MOUNT =================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // In dev: mount Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}

startServer();
