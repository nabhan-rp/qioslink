import React from 'react';

export interface MerchantConfig {
  merchantName: string;
  merchantCode: string; // e.g., QP040887
  apiKey: string;
  qrisString: string; // The long string starting with 000201...
  callbackUrl?: string;
}

export interface Transaction {
  id: string;
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

export type ViewState = 'dashboard' | 'terminal' | 'settings' | 'integration' | 'history';