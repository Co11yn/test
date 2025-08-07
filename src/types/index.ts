export interface Application {
  id: string;
  name: string;
  createdAt: string;
}

export interface LicenseKey {
  id: string;
  applicationId: string;
  key: string;
  status: 'pending' | 'active' | 'banned';
  durationDays: number;
  expirationDate: string;
  activatedAt?: string;
  createdAt: string;
}

export interface Admin {
  username: string;
  password: string;
}