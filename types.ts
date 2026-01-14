
import React from 'react';

export type UserRole = 'superadmin' | 'merchant' | 'cs' | 'user';

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  merchantConfig?: MerchantConfig;
  creatorId?: string;       
  isVerified?: boolean;     // Email Verified
  isKycVerified?: boolean;  // KYC Verified (New)
  supportEmail?: string;    
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
  requireEmailVerification?: boolean; 
}

// NEW: Konfigurasi KYC (Didit.me)
export interface KycConfig {
  provider: 'manual' | 'didit';
  diditClientId?: string;
  diditClientSecret?: string;
  diditCallbackUrl?: string; // Optional override
}

export interface MerchantConfig {
  merchantName: string;
  merchantCode: string; 
  qiospayApiKey: string; 
  appSecretKey: string; 
  qrisString: string; 
  callbackUrl?: string; 
  branding?: WhitelabelConfig;
  smtp?: SmtpConfig;
  kyc?: KycConfig; // Added KYC Config
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
