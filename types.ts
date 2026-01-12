import React from 'react';

export type UserRole = 'superadmin' | 'merchant' | 'cs' | 'user';

export interface User {
  id: string;
  username: string;
  email?: string; // Added email
  role: UserRole;
  merchantConfig?: MerchantConfig; // Only for merchant & superadmin
}

export interface WhitelabelConfig {
  customDomain?: string; // e.g., pay.merchant.com
  brandColor?: string; // Hex code
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
  merchantCode: string; // e.g., QP040887
  apiKey: string;
  qrisString: string; // The long string starting with 000201...
  callbackUrl?: string;
  branding?: WhitelabelConfig; // Added branding config
  smtp?: SmtpConfig; // Added SMTP config
}

export interface Transaction {
  id: string;
  merchantId: string; // To link transaction to specific merchant
  customerId?: string; // To link to specific registered end-user
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