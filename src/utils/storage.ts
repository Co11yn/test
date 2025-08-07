import { Application, LicenseKey, Admin } from '../types';

const STORAGE_KEYS = {
  ADMIN: 'license_admin',
  APPLICATIONS: 'license_applications',
  KEYS: 'license_keys',
  IS_LOGGED_IN: 'license_is_logged_in'
};

// Initialize default admin
const defaultAdmin: Admin = {
  username: 'admin',
  password: 'adidas1337'
};

export const storage = {
  // Admin functions
  getAdmin(): Admin {
    const stored = localStorage.getItem(STORAGE_KEYS.ADMIN);
    return stored ? JSON.parse(stored) : defaultAdmin;
  },

  setAdmin(admin: Admin): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
  },

  getIsLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  },

  setIsLoggedIn(isLoggedIn: boolean): void {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn.toString());
  },

  // Applications functions
  getApplications(): Application[] {
    const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return stored ? JSON.parse(stored) : [];
  },

  saveApplications(applications: Application[]): void {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  },

  addApplication(application: Application): void {
    const applications = this.getApplications();
    applications.push(application);
    this.saveApplications(applications);
  },

  updateApplication(id: string, updates: Partial<Application>): void {
    const applications = this.getApplications();
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates };
      this.saveApplications(applications);
    }
  },

  deleteApplication(id: string): void {
    const applications = this.getApplications().filter(app => app.id !== id);
    this.saveApplications(applications);
    
    // Also delete all keys for this application
    const keys = this.getLicenseKeys().filter(key => key.applicationId !== id);
    this.saveLicenseKeys(keys);
  },

  // License keys functions
  getLicenseKeys(): LicenseKey[] {
    const stored = localStorage.getItem(STORAGE_KEYS.KEYS);
    return stored ? JSON.parse(stored) : [];
  },

  saveLicenseKeys(keys: LicenseKey[]): void {
    localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(keys));
  },

  addLicenseKey(key: LicenseKey): void {
    const keys = this.getLicenseKeys();
    keys.push(key);
    this.saveLicenseKeys(keys);
  },

  updateLicenseKey(id: string, updates: Partial<LicenseKey>): void {
    const keys = this.getLicenseKeys();
    const index = keys.findIndex(key => key.id === id);
    if (index !== -1) {
      keys[index] = { ...keys[index], ...updates };
      this.saveLicenseKeys(keys);
    }
  },

  deleteLicenseKey(id: string): void {
    const keys = this.getLicenseKeys().filter(key => key.id !== id);
    this.saveLicenseKeys(keys);
  },

  activateLicenseKey(keyString: string): { success: boolean; message: string; key?: LicenseKey } {
    const keys = this.getLicenseKeys();
    const keyIndex = keys.findIndex(key => key.key === keyString && key.status === 'pending');
    
    if (keyIndex === -1) {
      return { success: false, message: 'Key not found or already activated' };
    }

    const key = keys[keyIndex];
    const now = new Date();
    const expirationDate = new Date(now.getTime() + key.durationDays * 24 * 60 * 60 * 1000);
    
    keys[keyIndex] = {
      ...key,
      status: 'active',
      activatedAt: now.toISOString(),
      expirationDate: expirationDate.toISOString()
    };
    
    this.saveLicenseKeys(keys);
    return { success: true, message: 'Key activated successfully', key: keys[keyIndex] };
  },

  validateLicenseKey(keyString: string): { valid: boolean; message: string; key?: LicenseKey } {
    const keys = this.getLicenseKeys();
    const key = keys.find(k => k.key === keyString);
    
    if (!key) {
      return { valid: false, message: 'Key not found' };
    }

    if (key.status === 'banned') {
      return { valid: false, message: 'Key is banned', key };
    }

    if (key.status === 'pending') {
      return { valid: false, message: 'Key is pending activation', key };
    }

    if (key.status === 'active') {
      const now = new Date();
      const expiration = new Date(key.expirationDate);
      
      if (now > expiration) {
        return { valid: false, message: 'Key has expired', key };
      }
      
      return { valid: true, message: 'Key is valid', key };
    }

    return { valid: false, message: 'Invalid key status', key };
  }
};