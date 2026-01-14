
import React from 'react';

export type UserRole = 'superadmin' | 'merchant' | 'cs' | 'user';

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  merchantConfig?: MerchantConfig;
  creatorId?: string;       // NEW: Grouping logic
  isVerified?: boolean;     // NEW: Email Verification Status
  supportEmail?: string;    // NEW: Contact person (Creator's email)
}

export interface WhitelabelConfig {
  customDomain?: string;
  brandColor?: string;
  logoUrl?: string;
  faviconUrl?: string;
  footerText?: string;
}

export interface SmtpConfig {
  host: string;
  port: string;
  user: string;
  pass: string;
  secure: 'tls' | 'ssl' | 'none';
  fromName: string;
  fromEmail: string;
  enableNotifications: boolean;
  useSystemSmtp?: boolean; 
  requireEmailVerification?: boolean; // NEW: Toggle for Email Verification Requirement
}

export interface MerchantConfig {
  merchantName: string;
  merchantCode: string; 
  qiospayApiKey: string; 
  appSecretKey: string; 
  qrisString: string; 
  callbackUrl?: string; // RESTORED: Default callback URL for UI
  branding?: WhitelabelConfig;
  smtp?: SmtpConfig;
}

export interface Transaction {
  id: string;
  merchantId: string;
  customerId?: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  createdAt: string;
  qrString: string;
  paymentUrl?: string; 
  expiresAt?: string; 
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export type ViewState = 'dashboard' | 'terminal' | 'settings' | 'integration' | 'history' | 'users' | 'links';
