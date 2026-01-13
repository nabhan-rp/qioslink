
import React from 'react';

export type UserRole = 'superadmin' | 'merchant' | 'cs' | 'user';

export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;           // NEW: WhatsApp Number
  role: UserRole;
  merchantConfig?: MerchantConfig;
  creatorId?: string;       
  isVerified?: boolean;     // Email Verified
  isPhoneVerified?: boolean;// NEW: WhatsApp Verified
  isKycVerified?: boolean;  // KYC Verified
  twoFactorEnabled?: boolean; // NEW: 2FA Status
  waLoginEnabled?: boolean;   // NEW: Specific Permission
  authProvider?: 'local' | 'google' | 'github' | 'facebook'; // NEW: Login Provider
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

export interface KycConfig {
  enabled: boolean; 
  provider: 'manual' | 'didit';
  diditClientId?: string;
  diditClientSecret?: string;
  diditCallbackUrl?: string; 
}

// NEW: WhatsApp & Social Login Configuration
export interface AuthConfig {
  // Verification Columns
  verifyEmail: boolean;
  verifyWhatsapp: boolean;
  verifyKyc: boolean;

  // WhatsApp Gateway Config
  waProvider: 'fonnte' | 'meta';
  fonnteToken?: string;
  metaAppId?: string;
  metaPhoneId?: string;
  metaToken?: string;

  // WhatsApp Login Logic
  loginMethod: 'standard' | 'whatsapp_otp' | 'hybrid'; // Standard = Email/Pass, Hybrid = Both
  waLoginScope: 'universal_except_admin' | 'role_based' | 'specific_users' | 'all_users_dangerous';
  allowedRoles?: UserRole[]; // If scope is role_based
  allowedSpecificUsers?: string[]; // If scope is specific_users (store Usernames)

  // 2FA Logic
  twoFactorLogic: 'disabled' | 'admin_forced' | 'user_opt_in';
  
  // Social Login Config
  socialLogin: {
    google: boolean;
    googleClientId?: string;
    googleClientSecret?: string;
    github: boolean;
    githubClientId?: string;
    githubClientSecret?: string;
    facebook: boolean;
    facebookAppId?: string;
    facebookAppSecret?: string;
  }
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
  kyc?: KycConfig;
  auth?: AuthConfig; // NEW: Auth Configuration
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
