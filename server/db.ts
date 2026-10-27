import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { SiteDatabase, AdminUser, ActivityLog, MediaFile } from '../src/types/index.ts';
import { INITIAL_DATABASE } from './initialData.ts';

dotenv.config();

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Password hashing helpers using PBKDF2 (100,000 iterations, sha512)
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const passwordSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, passwordSalt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt: passwordSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

interface AuthStorage {
  adminEmail: string;
  passwordHash: string;
  salt: string;
  activeSessions: { token: string; createdAt: string; expiresAt: string }[];
}

// Initialize Auth
function initAuth(): AuthStorage {
  if (fs.existsSync(AUTH_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
      if (data && data.adminEmail && data.passwordHash && data.salt) {
        return data;
      }
    } catch {
      // Fallback if corrupt
    }
  }

  // Initial setup credentials from environment or defaults: zakir1kb@gmail.com / khan@123
  const defaultEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'zakir1kb@gmail.com').trim().toLowerCase();
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'khan@123';
  const { hash, salt } = hashPassword(defaultPassword);
  const authData: AuthStorage = {
    adminEmail: defaultEmail,
    passwordHash: hash,
    salt: salt,
    activeSessions: []
  };

  fs.writeFileSync(AUTH_FILE, JSON.stringify(authData, null, 2), 'utf-8');
  return authData;
}

// Initialize Database
let cachedDB: SiteDatabase | null = null;
let cachedAuth: AuthStorage | null = null;

export function getAuth(): AuthStorage {
  if (!cachedAuth) {
    cachedAuth = initAuth();
  }
  return cachedAuth;
}

export function saveAuth(auth: AuthStorage): void {
  cachedAuth = auth;
  fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2), 'utf-8');
}

export function getDatabase(): SiteDatabase {
  if (cachedDB) {
    if (!cachedDB.inquiries) cachedDB.inquiries = JSON.parse(JSON.stringify(INITIAL_DATABASE.inquiries || []));
    if (!cachedDB.notifications) cachedDB.notifications = JSON.parse(JSON.stringify(INITIAL_DATABASE.notifications || []));
    return cachedDB;
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      cachedDB = JSON.parse(raw);
      if (!cachedDB!.inquiries) cachedDB!.inquiries = JSON.parse(JSON.stringify(INITIAL_DATABASE.inquiries || []));
      if (!cachedDB!.notifications) cachedDB!.notifications = JSON.parse(JSON.stringify(INITIAL_DATABASE.notifications || []));
      return cachedDB!;
    } catch (e) {
      console.error('Failed reading database file, loading initial database:', e);
    }
  }

  // Save initial database
  cachedDB = JSON.parse(JSON.stringify(INITIAL_DATABASE));
  saveDatabase(cachedDB!);
  return cachedDB!;
}

export function saveDatabase(data: SiteDatabase): void {
  cachedDB = data;
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function addNotification(title: string, message: string, type: 'inquiry' | 'activity' | 'system' | 'cv' = 'activity', link?: string): void {
  const db = getDatabase();
  if (!db.notifications) db.notifications = [];
  const newNotif = {
    id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    title,
    message,
    type,
    timestamp: new Date().toISOString(),
    read: false,
    link
  };
  db.notifications.unshift(newNotif);
  if (db.notifications.length > 50) {
    db.notifications = db.notifications.slice(0, 50);
  }
  saveDatabase(db);
}

export function addActivity(action: string, category: string, details: string, user: string = 'Zakirullah'): void {
  const db = getDatabase();
  const newActivity: ActivityLog = {
    id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    action,
    category,
    details,
    timestamp: 'Just now',
    user
  };
  db.activities.unshift(newActivity);
  // Keep max 50 activities
  if (db.activities.length > 50) {
    db.activities = db.activities.slice(0, 50);
  }
  saveDatabase(db);
}

export function createSessionToken(email: string): string {
  const secret = process.env.SESSION_SECRET || 'zk_portfolio_secret_key_8f93e18a927cb0441d8e5f2a1b9c7e3';
  const randomBytes = crypto.randomBytes(32).toString('hex');
  const signature = crypto.createHmac('sha256', secret).update(`${email}:${randomBytes}`).digest('hex');
  const token = `${randomBytes}.${signature}`;

  const auth = getAuth();
  const now = new Date();
  const expires = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days expiration

  // Clean up any already expired sessions
  auth.activeSessions = auth.activeSessions.filter((s) => new Date(s.expiresAt).getTime() > now.getTime());

  auth.activeSessions.push({
    token,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString()
  });

  // Limit max concurrent sessions per admin
  if (auth.activeSessions.length > 25) {
    auth.activeSessions = auth.activeSessions.slice(-25);
  }

  saveAuth(auth);
  return token;
}

export function validateSessionToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const auth = getAuth();
  const now = new Date().toISOString();

  // Find matching session
  const session = auth.activeSessions.find((s) => s.token === token && s.expiresAt > now);
  if (!session) return false;

  // If token is in signed format <random>.<signature>, verify cryptographic HMAC integrity
  if (token.includes('.')) {
    const [randomBytes, signature] = token.split('.');
    const secret = process.env.SESSION_SECRET || 'zk_portfolio_secret_key_8f93e18a927cb0441d8e5f2a1b9c7e3';
    const expectedSig = crypto.createHmac('sha256', secret).update(`${auth.adminEmail}:${randomBytes}`).digest('hex');
    try {
      if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSig, 'hex'))) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}

export function revokeSessionToken(token: string): void {
  const auth = getAuth();
  auth.activeSessions = auth.activeSessions.filter((s) => s.token !== token);
  saveAuth(auth);
}
