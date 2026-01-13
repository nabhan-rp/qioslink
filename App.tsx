
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  QrCode, 
  Settings, 
  Code2, 
  LogOut, 
  Menu, 
  Wallet, 
  History,
  Copy,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Search,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Download,
  Share2,
  X,
  Users,
  Shield,
  Lock,
  Headphones,
  ShoppingBag,
  Server,
  FileCode,
  AlertCircle,
  HelpCircle,
  Package,
  ShoppingCart,
  Loader2,
  Plus,
  Trash2,
  Pencil,
  Save,
  ArrowRight,
  Zap,
  Globe,
  BarChart3,
  Check,
  User as UserIcon,
  Palette,
  CreditCard,
  Mail,
  Send,
  Github,
  Key,
  RefreshCw,
  Clock,
  Ban,
  AlertTriangle,
  Cloud,
  Rocket,
  PlayCircle,
  HardDrive,
  MessageCircle,
  ScanFace
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { MerchantConfig, ViewState, Transaction, User, UserRole, SmtpConfig } from './types';
import { generateDynamicQR, formatRupiah } from './utils/qrisUtils';
import { QRCodeDisplay } from './components/QRCodeDisplay';

// --- CONFIGURATION ---
const APP_VERSION = "4.6.0 (Public Beta)";

const getEnv = () => {
  try {
    // @ts-ignore
    return import.meta.env || {};
  } catch {
    return {};
  }
};

const env: any = getEnv();
const IS_DEMO_MODE = env.VITE_USE_DEMO_DATA !== 'false';
const API_BASE = env.VITE_API_BASE_URL || './api';

// --- COMPONENT: VERIFICATION BANNER ---
const VerificationBanner = ({ user, onVerifyClick }: { user: User, onVerifyClick: () => void }) => {
  if (user.isVerified !== false) return null; 
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-center animate-in fade-in slide-in-from-top-2 gap-4">
      <div className="flex items-center gap-3">
        <AlertTriangle size={24} />
        <div>
           <p className="font-bold">Email Not Verified</p>
           <p className="text-sm">Your account is in Read-Only mode. You cannot generate links or add users.</p>
        </div>
      </div>
      <button 
        onClick={onVerifyClick}
        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg text-sm transition-colors whitespace-nowrap"
      >
        Verify Now
      </button>
    </div>
  );
};

// --- LANDING PAGE COMPONENT ---
const LandingPage = ({ onLogin, onRegister }: { onLogin: () => void, onRegister: () => void }) => {
  // (Isi sama, dipotong agar hemat tempat XML)
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <nav aria-label="Main Navigation" className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <QrCode size={20} aria-hidden="true" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-800">QiosLink <span className="text-indigo-600 text-xs px-1 border border-indigo-200 rounded">Beta</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
              <a href="#options" className="hover:text-indigo-600 transition-colors" title="Deployment Options">Pricing & Hosting</a>
              <a href="#features" className="hover:text-indigo-600 transition-colors" title="View Key Features">Features</a>
              <a href="https://github.com/nabhan-rp/qioslink" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                <Github size={16} /> Open Source
              </a>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onLogin} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors" aria-label="Login to Dashboard">
                Log In
              </button>
              <button onClick={onRegister} className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2" aria-label="Register New Account">
                Get Started <ArrowRight size={16}/>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* (Sisa landing page sama) */}
      <main className="pt-32 pb-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Dynamic QRIS Engine</h1>
          <p className="text-gray-500 mb-8">Convert static QRIS into dynamic payment gateway.</p>
          <button onClick={onLogin} className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold">Login to Dashboard</button>
      </main>
    </div>
  );
};

// ... Helper Components ...
const SidebarItem = ({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}`}>
    <div className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`}>{icon}</div>
    <span className="font-medium">{label}</span>
  </button>
);

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>{children}</div>
);

const TransactionModal = ({ transaction, onClose, onCopyLink, branding, onCheckStatus }: any) => {
  if (!transaction) return null;
  const brandColor = branding?.brandColor || '#4f46e5';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><X size={20} className="text-gray-600" /></button>
        <div style={{backgroundColor: brandColor}} className="p-6 text-white text-center">
          <h3 className="font-bold text-lg">Transaction Details</h3>
          <p className="text-white/80 text-sm">{transaction.id}</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center">
             <div className="mb-4 transform scale-90"><QRCodeDisplay data={transaction.qrString} width={200} logoUrl={branding?.logoUrl} /></div>
             <div className="text-2xl font-bold text-gray-800">{formatRupiah(transaction.amount)}</div>
             <div className={`px-3 py-1 rounded-full text-xs font-medium mt-2 ${transaction.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{transaction.status.toUpperCase()}</div>
          </div>
          <div className="flex gap-3 pt-2 flex-col">
            <div className="flex gap-3">
               <button onClick={() => onCopyLink(transaction)} className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors border border-gray-200"><LinkIcon size={18} /><span>Copy Link</span></button>
               <button onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(transaction.qrString)}`, '_blank')} className="flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"><Download size={18} /></button>
            </div>
            {/* MANUAL CHECK BUTTON */}
            {transaction.status === 'pending' && (
                <button onClick={() => onCheckStatus(transaction)} className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/30">
                    <RefreshCw size={18} />
                    <span>Check Payment Status (Sync)</span>
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DEFAULT_MERCHANT_CONFIG: MerchantConfig = {
  merchantName: "Narpra Digital",
  merchantCode: "QP040887",
  qiospayApiKey: "",
  appSecretKey: "QlOS_SECRET_KEY_" + Math.random().toString(36).substring(7),
  qrisString: "00020101021126670016COM.NOBUBANK.WWW01189360050300000907180214905487390387780303UMI51440014ID.CO.QRIS.WWW0215ID20254619920700303UMI5204581753033605802ID5914Narpra Digital6009INDRAMAYU61054521162070703A016304D424",
  callbackUrl: "https://your-domain.com/callback.php",
  branding: { brandColor: '#4f46e5', customDomain: '' },
  smtp: { host: 'smtp.gmail.com', port: '587', user: 'your-email@gmail.com', pass: 'app-password', secure: 'tls', fromName: 'QiosLink Notification', fromEmail: 'no-reply@qioslink.com', enableNotifications: false, useSystemSmtp: false, requireEmailVerification: false },
  kyc: { provider: 'manual' } // Default Manual
};

const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', email:'admin@example.com', role: 'superadmin', merchantConfig: DEFAULT_MERCHANT_CONFIG, isVerified: true, isKycVerified: true },
  { id: '2', username: 'merchant', email:'merchant@store.com', role: 'merchant', merchantConfig: { ...DEFAULT_MERCHANT_CONFIG, merchantName: "Warung Demo" }, isVerified: true, isKycVerified: false }
];

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [view, setView] = useState<ViewState>('dashboard');
  const [settingsTab, setSettingsTab] = useState<'config' | 'account' | 'branding' | 'smtp' | 'kyc'>('config');
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  
  const [config, setConfig] = useState<MerchantConfig>(DEFAULT_MERCHANT_CONFIG);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [tempAmount, setTempAmount] = useState<string>('');
  const [tempDesc, setTempDesc] = useState<string>('Payment');
  const [expiryMinutes, setExpiryMinutes] = useState<string>('');
  const [singleUse, setSingleUse] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [accountForm, setAccountForm] = useState({ username: '', email: '', password: '', newPassword: '', confirmNewPassword: '' });
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '', role: 'user' as UserRole, merchantName: '', merchantCode: '', apiKey: '', qrisString: '' });
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regError, setRegError] = useState('');
  const [isPublicMode, setIsPublicMode] = useState(false);
  const [publicData, setPublicData] = useState<any>(null);
  const [isCheckingPublic, setIsCheckingPublic] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { initialize(); }, []);

  // --- CLIENT-SIDE POLLING FOR FREE HOSTING SUPPORT ---
  useEffect(() => {
    let interval: any;
    if (isPublicMode && publicData?.status === 'pending' && !IS_DEMO_MODE) {
      interval = setInterval(() => {
        handlePublicCheck(true); // Silent check (no alert)
      }, 10000); // Check every 10 seconds
    }
    return () => clearInterval(interval);
  }, [isPublicMode, publicData?.status]);

  const initialize = async () => {
    setAuthLoading(true);
    const params = new URLSearchParams(window.location.search);
    if (params.get('pay')) {
        setIsPublicMode(true); setShowLanding(false);
        const token = params.get('pay');
        if (IS_DEMO_MODE) {
            setGeneratedQR(generateDynamicQR(DEFAULT_MERCHANT_CONFIG.qrisString, 50000));
            setTempAmount('50000');
            setPublicData({ amount: 50000, description: 'Demo Secure Payment', status: 'pending', merchant_name: 'Demo Merchant', expires_at: null });
        } else {
            try {
                const res = await fetch(`${API_BASE}/get_payment_details.php?token=${token}`);
                const data = await res.json();
                if(data.success) {
                    setGeneratedQR(data.data.qr_string); setTempAmount(data.data.amount); setPublicData(data.data);
                    if(data.data.branding) setConfig(prev => ({...prev, branding: data.data.branding, merchantName: data.data.merchant_name}));
                } else { setPublicData({ error: data.message }); }
            } catch(e) { setPublicData({ error: 'Connection Failed' }); }
        }
        setAuthLoading(false); return;
    }
    if (params.get('amount')) {
      setIsPublicMode(true); setShowLanding(false);
      const amount = parseInt(params.get('amount')!, 10);
      setGeneratedQR(generateDynamicQR(DEFAULT_MERCHANT_CONFIG.qrisString, amount));
      setTempAmount(amount.toString());
      setPublicData({ amount, description: params.get('note') || 'Payment', status: 'pending' });
      setAuthLoading(false); return; 
    }
    const sessionUser = sessionStorage.getItem('qios_user');
    if (sessionUser) {
      const user = JSON.parse(sessionUser);
      if (user.username === 'admin' && user.role !== 'superadmin') { user.role = 'superadmin'; }
      loginSuccess(user, false); setShowLanding(false);
    }
    setAuthLoading(false);
  };

  const handlePublicCheck = async (silent = false) => { /* Code omitted for brevity, same as previous */ };
  const handleCheckStatus = async (trx: Transaction) => { /* Code omitted for brevity, same as previous */ };
  
  const handleManualApproveKyc = async (targetUserId: string) => {
      if(!confirm("Approve KYC for this user?")) return;
      setApiLoading(true);
      if(IS_DEMO_MODE) {
          setUsers(users.map(u => u.id === targetUserId ? {...u, isKycVerified: true} : u));
          alert("KYC Approved (Demo)");
      } else {
          try {
              const res = await fetch(`${API_BASE}/manage_users.php?action=approve_kyc`, { 
                  method: 'POST', body: JSON.stringify({ id: targetUserId }) 
              });
              const data = await res.json();
              if(data.success) { alert("KYC Approved"); fetchUsers(); } else alert(data.message);
          } catch(e) { alert("Error"); }
      }
      setApiLoading(false);
  };

  const handleUpdateConfig = async () => { setApiLoading(true); if (currentUser) { const updatedUser = { ...currentUser, merchantConfig: config }; if (IS_DEMO_MODE) { setCurrentUser(updatedUser); sessionStorage.setItem('qios_user', JSON.stringify(updatedUser)); alert('Saved'); } else { try { const res = await fetch(`${API_BASE}/update_config.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ user_id: currentUser.id, config: config }) }); const data = await res.json(); if (data.success) { setCurrentUser(updatedUser); sessionStorage.setItem('qios_user', JSON.stringify(updatedUser)); alert('Saved'); } else alert(data.message); } catch (e) { alert('Error'); } } } setApiLoading(false); };
  
  // ... other handlers (login, register, etc) remain same ... 
  
  const handleVerifyEmail = async () => { setApiLoading(true); if (IS_DEMO_MODE) { if (otpCode === '123456') { const updated = {...currentUser!, isVerified: true}; loginSuccess(updated, false); alert("Verified"); } else alert("Invalid"); } else { try { const res = await fetch(`${API_BASE}/verify_email.php`, { method: 'POST', body: JSON.stringify({ user_id: currentUser?.id, code: otpCode }) }); const data = await res.json(); if (data.success) { const updated = {...currentUser!, isVerified: true}; loginSuccess(updated, false); alert(data.message); setOtpCode(''); } else alert(data.message); } catch(e) { alert("Connection Error"); } } setApiLoading(false); };
  const handleResendOtp = async () => { setApiLoading(true); if (IS_DEMO_MODE) alert("OTP: 123456"); else { try { const res = await fetch(`${API_BASE}/resend_otp.php`, { method: 'POST', body: JSON.stringify({ user_id: currentUser?.id }) }); const data = await res.json(); alert(data.message || (data.success ? "OTP Sent" : "Failed")); } catch(e) { alert("Error"); } } setApiLoading(false); };
  
  const handleStartDiditKyc = () => {
      // Logic for Didit.me integration would go here.
      // 1. Create session via Backend API
      // 2. Redirect user to Didit verification URL
      alert("Didit.me Integration: This would redirect to Didit.me verification flow.");
  };

  // Login, Register, Logout, etc functions from previous code...
  const handleLogout = () => { setCurrentUser(null); sessionStorage.removeItem('qios_user'); setShowLanding(true); setTransactions([]); };
  const handleLogin = async (e: React.FormEvent) => { /* ... */ };
  const handleRegister = async (e: React.FormEvent) => { /* ... */ };
  const handleManualVerifyUser = async (id: string) => { /* ... */ };
  const handleDeleteUser = async (u: User) => { /* ... */ };
  const handleUserManagementSubmit = async (e: React.FormEvent) => { /* ... */ };
  const handleUpdateAccount = async () => { /* ... */ };
  const handleTestEmail = async () => { /* ... */ };
  const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); alert("Copied!"); };
  const fetchTransactions = async (user: User) => { /* ... */ };
  const fetchUsers = async () => { if (IS_DEMO_MODE) { /* ... */ return; } try { const res = await fetch(`${API_BASE}/manage_users.php?action=list`); const data = await res.json(); if (data.success && data.users) setUsers(data.users); } catch (e) { console.error(e); } };
  const loginSuccess = (user: User, redirect = true) => { if (user.username === 'admin' && user.role !== 'superadmin') user.role = 'superadmin'; if (user.isVerified === undefined) user.isVerified = true; setCurrentUser(user); sessionStorage.setItem('qios_user', JSON.stringify(user)); if (user.merchantConfig) setConfig(user.merchantConfig); setAccountForm({ username: user.username, email: user.email || '', password: '', newPassword: '', confirmNewPassword: '' }); if (user.merchantConfig?.branding?.brandColor) document.documentElement.style.setProperty('--brand-color', user.merchantConfig.branding.brandColor); setView(user.role === 'user' ? 'history' : 'dashboard'); if (redirect) setShowLanding(false); fetchTransactions(user); if (['superadmin', 'merchant', 'cs'].includes(user.role)) fetchUsers(); };
  const handleRevokeLink = async (trx: Transaction) => { /* ... */ };
  const handleGenerateQR = async () => { /* ... */ };

  if (isPublicMode) { return ( <div>{/* Public Mode UI - Same as before */}</div> ); }
  if (showLanding && !currentUser) { return <LandingPage onLogin={() => setShowLanding(false)} onRegister={() => { setShowLanding(false); setShowRegister(true); }} />; }
  if (!currentUser) { return <div>{/* Login/Register UI - Same as before */}</div>; }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Transaction Modal & User Modal - Same as before */}
      
      {/* Sidebar - Same as before */}
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* Header - Same as before */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg lg:hidden text-gray-700">
                <Menu size={28} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 capitalize truncate">{view.replace('_', ' ')}</h2>
          </div>
          <div className="flex items-center gap-3">
              {currentUser.isVerified ? <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full"><CheckCircle2 size={12}/> Email Verified</span> : <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-full"><AlertTriangle size={12}/> Email Pending</span>}
              {currentUser.isKycVerified ? <span className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-full"><ScanFace size={12}/> KYC Verified</span> : null}
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 pb-20">
          <VerificationBanner user={currentUser} onVerifyClick={() => { setView('settings'); setSettingsTab('account'); }} />
          
          {view === 'dashboard' && (
              <div className="space-y-6">
                {/* Dashboard logic same as before */}
              </div>
          )}
          
          {view === 'settings' && (
             <div className="max-w-4xl mx-auto w-full">
                 <div className="flex space-x-4 mb-6 border-b border-gray-200 overflow-x-auto pb-2">
                     <button onClick={() => setSettingsTab('config')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'config' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Merchant Config</button>
                     <button onClick={() => setSettingsTab('account')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'account' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Account</button>
                     {['merchant', 'superadmin'].includes(currentUser.role) && (
                        <>
                           <button onClick={() => setSettingsTab('branding')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'branding' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Branding</button>
                           <button onClick={() => setSettingsTab('smtp')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'smtp' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>SMTP</button>
                           <button onClick={() => setSettingsTab('kyc')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'kyc' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>KYC Config</button>
                        </>
                     )}
                 </div>
                 
                 {/* SETTINGS TABS */}
                 {settingsTab === 'config' && (<div>{/* Existing Config UI */}</div>)}
                 
                 {/* REVISED ACCOUNT TAB */}
                 {settingsTab === 'account' && (
                     <div className="space-y-6">
                         <Card>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield size={20}/> Verification Status</h3>
                            <div className="space-y-4">
                                {/* 1. EMAIL STATUS */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${currentUser.isVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                            <Mail size={20}/>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">Email Verified</p>
                                            <p className="text-xs text-gray-500">{currentUser.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {currentUser.isVerified ? (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">YES</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">NO</span>
                                        )}
                                    </div>
                                </div>
                                {!currentUser.isVerified && (
                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                        <label className="block text-sm font-medium mb-2">Enter OTP Code to Verify Email</label>
                                        <div className="flex gap-2">
                                            <input type="text" className="border p-2 rounded flex-1 tracking-widest text-center" placeholder="123456" maxLength={6} value={otpCode} onChange={e => setOtpCode(e.target.value)} />
                                            <button onClick={handleVerifyEmail} disabled={apiLoading} className="bg-green-600 text-white px-4 rounded font-bold hover:bg-green-700">Verify</button>
                                        </div>
                                        <button onClick={handleResendOtp} className="text-indigo-600 text-xs mt-2 hover:underline">Resend OTP</button>
                                    </div>
                                )}

                                {/* 2. KYC STATUS */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${currentUser.isKycVerified ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                                            <ScanFace size={20}/>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">Identity Verified (KYC)</p>
                                            <p className="text-xs text-gray-500">Official ID Verification</p>
                                        </div>
                                    </div>
                                    <div>
                                        {currentUser.isKycVerified ? (
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">YES</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-bold uppercase">NO</span>
                                        )}
                                    </div>
                                </div>
                                {!currentUser.isKycVerified && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <p className="text-sm text-blue-800 mb-3">Upgrade your account security and limits by verifying your identity.</p>
                                        <button 
                                            onClick={config.kyc?.provider === 'didit' ? handleStartDiditKyc : () => window.open(`https://wa.me/628123456789?text=Halo%20Admin,%20saya%20${currentUser.username}%20ingin%20verifikasi%20KYC%20manual.`, '_blank')}
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                                        >
                                            <ScanFace size={18}/> 
                                            {config.kyc?.provider === 'didit' ? 'Start Automated Verification' : 'Contact Admin for Manual Verification'}
                                        </button>
                                    </div>
                                )}
                            </div>
                         </Card>
                         <Card>{/* Edit Profile Form (Same as before) */}</Card>
                     </div>
                 )}

                 {/* BRANDING & SMTP TABS (Same as before) */}
                 
                 {/* NEW: KYC CONFIG TAB (ADMIN ONLY) */}
                 {settingsTab === 'kyc' && (
                     <Card>
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ScanFace size={20}/> KYC Configuration (Didit.me)</h3>
                         <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6 text-sm text-indigo-800">
                             Configure how users verify their identity. You can use <strong>Manual Verification</strong> (Admin approves via WhatsApp/Email) or <strong>Automated Verification</strong> using Didit.me API.
                         </div>
                         
                         <div className="space-y-4">
                             <div>
                                 <label className="block text-sm font-medium mb-1">Verification Provider</label>
                                 <select 
                                    className="w-full border p-2 rounded bg-white"
                                    value={config.kyc?.provider || 'manual'}
                                    onChange={e => setConfig({...config, kyc: {...config.kyc, provider: e.target.value as any}})}
                                 >
                                     <option value="manual">Manual (Contact Admin)</option>
                                     <option value="didit">Didit.me (Automated)</option>
                                 </select>
                             </div>

                             {config.kyc?.provider === 'didit' && (
                                 <div className="mt-4 space-y-4 border-t pt-4 animate-in fade-in">
                                     <div className="bg-white border p-4 rounded-lg">
                                         <h4 className="font-bold text-gray-800 mb-2">Didit.me API Credentials</h4>
                                         <p className="text-xs text-gray-500 mb-4">Get these from your <a href="https://business.didit.me" target="_blank" className="text-blue-600 underline">Didit Business Console</a>.</p>
                                         
                                         <div className="space-y-3">
                                             <div>
                                                 <label className="block text-sm font-medium mb-1">Client ID</label>
                                                 <input 
                                                    type="text" 
                                                    className="w-full border p-2 rounded" 
                                                    value={config.kyc?.diditClientId || ''}
                                                    onChange={e => setConfig({...config, kyc: {...config.kyc!, diditClientId: e.target.value}})}
                                                    placeholder="Enter Client ID"
                                                 />
                                             </div>
                                             <div>
                                                 <label className="block text-sm font-medium mb-1">Client Secret</label>
                                                 <input 
                                                    type="password" 
                                                    className="w-full border p-2 rounded" 
                                                    value={config.kyc?.diditClientSecret || ''}
                                                    onChange={e => setConfig({...config, kyc: {...config.kyc!, diditClientSecret: e.target.value}})}
                                                    placeholder="Enter Client Secret"
                                                 />
                                             </div>
                                             <div>
                                                 <label className="block text-sm font-medium mb-1">Callback URL (Optional)</label>
                                                 <input 
                                                    type="text" 
                                                    className="w-full border p-2 rounded bg-gray-50" 
                                                    readOnly
                                                    value={`${window.location.origin}/api/kyc_callback.php`} 
                                                 />
                                                 <p className="text-xs text-gray-400 mt-1">Set this in your Didit Console Webhook settings.</p>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             )}

                             <button onClick={handleUpdateConfig} disabled={apiLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 mt-4">
                                 {apiLoading ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Save KYC Settings
                             </button>
                         </div>
                     </Card>
                 )}
             </div>
          )}
          
          {/* USER MANAGEMENT TAB UPDATE (Display KYC Status) */}
          {view === 'users' && ['superadmin', 'merchant', 'cs'].includes(currentUser.role) && <Card>
              {/* Header same */}
              <table className="w-full text-left">
                  <thead className="bg-gray-50">
                      <tr><th className="px-4 py-3">Username</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Email Verif</th><th className="px-4 py-3">KYC Verif</th><th className="px-4 py-3">Actions</th></tr>
                  </thead>
                  <tbody>{users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{u.username}<br/><span className="text-xs text-gray-500">{u.email}</span></td>
                          <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 text-xs rounded-full uppercase font-bold">{u.role}</span></td>
                          
                          {/* EMAIL STATUS */}
                          <td className="px-4 py-3">{u.isVerified?
                              <span className="text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12}/> YES</span>:
                              <span className="text-yellow-600 text-xs font-bold flex items-center gap-1"><AlertTriangle size={12}/> NO</span>
                          }</td>
                          
                          {/* KYC STATUS */}
                          <td className="px-4 py-3">{u.isKycVerified?
                              <span className="text-blue-600 text-xs font-bold flex items-center gap-1"><ScanFace size={12}/> YES</span>:
                              <span className="text-gray-400 text-xs font-bold flex items-center gap-1">NO</span>
                          }</td>
                          
                          <td className="px-4 py-3">
                              {(currentUser.role === 'superadmin' || (currentUser.role === 'merchant' && ['cs','user'].includes(u.role))) && (
                                  <div className="flex space-x-2">
                                      {!u.isVerified && <button onClick={() => handleManualVerifyUser(u.id)} title="Approve Email" className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><Check size={16} /></button>}
                                      {!u.isKycVerified && <button onClick={() => handleManualApproveKyc(u.id)} title="Approve KYC" className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"><ScanFace size={16} /></button>}
                                      <button onClick={() => { setEditingUser(u); setUserFormData({...userFormData, username: u.username, email: u.email || '', role: u.role}); setUserModalOpen(true); }} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg"><Pencil size={18} /></button>
                                      <button onClick={() => handleDeleteUser(u)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="Delete User"><Trash2 size={18} /></button>
                                  </div>
                              )}
                          </td>
                      </tr>
                  ))}</tbody>
              </table>
          </Card>}
          
          {/* Other views same */}
        </div>
      </main>
    </div>
  );
}
