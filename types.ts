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
  status: 'pending' | 'paid' | 'expired';
  createdAt: string;
  qrString: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export type ViewState = 'dashboard' | 'terminal' | 'settings' | 'integration' | 'history' | 'users' | 'my_orders';
