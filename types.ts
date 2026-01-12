import React from 'react';

export type UserRole = 'superadmin' | 'merchant' | 'cs' | 'user';

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  merchantConfig?: MerchantConfig;
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
  useSystemSmtp?: boolean; // NEW: Option to use Superadmin's SMTP
}

export interface MerchantConfig {
  merchantName: string;
  merchantCode: string; // From Qiospay Dashboard (e.g., QP040887)
  qiospayApiKey: string; // From Qiospay Dashboard (for Callback Validation)
  appSecretKey: string; // Internal Key for WHMCS/Woo Integration
  qrisString: string; 
  callbackUrl?: string;
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
  paymentUrl?: string; // NEW: The shareable link
  expiresAt?: string;  // NEW: When the link expires
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export type ViewState = 'dashboard' | 'terminal' | 'settings' | 'integration' | 'history' | 'users' | 'links';