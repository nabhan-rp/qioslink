
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
  ScanFace,
  Phone,
  Facebook,
  Chrome,
  Fingerprint,
  ToggleLeft,
  ToggleRight
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
import { MerchantConfig, ViewState, Transaction, User, UserRole, SmtpConfig, AuthConfig } from './types';
import { generateDynamicQR, formatRupiah } from './utils/qrisUtils';
import { QRCodeDisplay } from './components/QRCodeDisplay';

// --- CONFIGURATION ---
const APP_VERSION = "4.8.3 (Enterprise Beta)";

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

// --- DEFAULT AUTH CONFIG ---
const DEFAULT_AUTH_CONFIG: AuthConfig = {
    verifyEmail: true,
    verifyWhatsapp: false,
    verifyKyc: false,
    waProvider: 'fonnte',
    loginMethod: 'standard', // standard (email/pass), whatsapp_otp, hybrid
    waLoginScope: 'universal_except_admin',
    allowedRoles: ['user'],
    allowedSpecificUsers: [],
    twoFactorLogic: 'user_opt_in',
    socialLogin: {
        google: false,
        github: false,
        facebook: false
    }
};

// --- COMPONENT: VERIFICATION BANNER ---
const VerificationBanner = ({ user, onVerifyClick }: { user: User, onVerifyClick: () => void }) => {
  const needsEmail = user.merchantConfig?.auth?.verifyEmail && !user.isVerified;
  const needsPhone = user.merchantConfig?.auth?.verifyWhatsapp && !user.isPhoneVerified;
  
  if (!needsEmail && !needsPhone) return null; 
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-center animate-in fade-in slide-in-from-top-2 gap-4">
      <div className="flex items-center gap-3">
        <AlertTriangle size={24} />
        <div>
           <p className="font-bold">Account Verification Required</p>
           <p className="text-sm">
               {needsEmail && needsPhone ? "Please verify your Email and WhatsApp." : 
                needsEmail ? "Please verify your Email Address." : "Please verify your WhatsApp Number."}
           </p>
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
  // ... (No changes to Landing Page code) ...
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navbar */}
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

      <main>
        {/* Hero Section */}
        <section id="home" className="relative pt-32 pb-20 overflow-hidden" aria-labelledby="hero-heading">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-6 border border-indigo-200 animate-in fade-in slide-in-from-bottom-4 duration-700 uppercase tracking-wide">
              <Zap size={12} fill="currentColor" /> Universal SMTP Engine Added
            </div>
            <h1 id="hero-heading" className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 leading-tight">
              Dynamic QRIS Engine. <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Self-Hosted & SaaS Ready.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Convert Nobu/Qiospay static QRIS into a dynamic payment gateway. Use our Cloud SaaS instantly or self-host it on your own server.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <button onClick={onRegister} className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2">
                Start Using Cloud <ArrowRight size={18} />
              </button>
              <a href="#options" className="w-full sm:w-auto px-8 py-4 text-base font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-all flex items-center justify-center gap-2">
                <HardDrive size={20} /> Self-Host Options
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-400">
                Compatible with WHMCS, WooCommerce, and Shopify.
            </p>
          </div>
        </section>
        {/* ... (Keep existing Landing Page sections) ... */}
      </main>
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <QrCode size={18} />
                 </div>
                 <span className="font-bold text-gray-900">QiosLink</span>
             </div>
             <p className="text-sm text-gray-500">
                &copy; 2026 Open Source Project by <a href="https://github.com/nabhan-rp" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">Nabhan Rafli</a>. 
                Licensed under MIT. Sponsored by <a href="https://www.jajanserver.com" target="_blank" className="text-indigo-600 font-bold hover:underline">JajanServer</a>.
             </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium">
              <a href="https://qioslink-demo.orgz.top/?i=1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
                  <PlayCircle size={16} /> Live Demo
              </a>
              <a href="https://bayar.jajanan.online" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
                  <Cloud size={16} /> Cloud Service
              </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ... (Keep existing Helper Components: SidebarItem, Card, TransactionModal) ...
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
  kyc: { enabled: false, provider: 'manual', manualContactType: 'whatsapp', manualContactValue: '628123456789' },
  auth: DEFAULT_AUTH_CONFIG // Default Auth Config
};

const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', email:'admin@example.com', phone:'628123456789', role: 'superadmin', merchantConfig: DEFAULT_MERCHANT_CONFIG, isVerified: true, isPhoneVerified: true, isKycVerified: true, twoFactorEnabled: false },
  { id: '2', username: 'merchant', email:'merchant@store.com', phone:'628987654321', role: 'merchant', merchantConfig: { ...DEFAULT_MERCHANT_CONFIG, merchantName: "Warung Demo" }, isVerified: true, isPhoneVerified: false, isKycVerified: false, twoFactorEnabled: false }
];

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [view, setView] = useState<ViewState>('dashboard');
  const [settingsTab, setSettingsTab] = useState<'config' | 'account' | 'branding' | 'smtp' | 'kyc' | 'auth'>('config');
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
  const [accountForm, setAccountForm] = useState({ username: '', email: '', phone: '', password: '', newPassword: '', confirmNewPassword: '' });
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isUserAuthModalOpen, setUserAuthModalOpen] = useState(false); 
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
  
  const [loginMode, setLoginMode] = useState<'standard' | 'whatsapp' | 'social'>('standard'); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { initialize(); }, []);

  // Use Effect to sync global login method with local state
  useEffect(() => {
      if (MOCK_USERS[0].merchantConfig?.auth?.loginMethod === 'whatsapp_otp') {
          setLoginMode('whatsapp');
      }
  }, []);

  // --- REFRESH SESSION ON TAB CHANGE (Fix Sync Issue) ---
  useEffect(() => {
      if (!IS_DEMO_MODE && currentUser && (view === 'settings' || view === 'dashboard')) {
          refreshSession();
      }
  }, [view]);

  const refreshSession = async () => {
      if (!currentUser) return;
      try {
          // Fetch user list (since admin can see it) OR specific profile logic
          // For simplicity, we reuse manage_users.php logic if role is high enough, 
          // OR we just rely on page refresh. 
          // BETTER: Re-fetch the current user's profile specifically.
          
          // Since we don't have a dedicated /me endpoint in the simple bundle,
          // We will search for ourselves in the 'manage_users' list if we have access.
          if (['superadmin', 'merchant', 'cs'].includes(currentUser.role)) {
              const res = await fetch(`${API_BASE}/manage_users.php?action=list`);
              const data = await res.json();
              if (data.success && data.users) {
                  const me = data.users.find((u: User) => u.id === currentUser.id);
                  if (me) {
                      // Update Session Storage & State
                      // Merge with existing merchantConfig to not lose local changes
                      const updatedUser = { ...me, merchantConfig: me.merchantConfig || currentUser.merchantConfig };
                      sessionStorage.setItem('qios_user', JSON.stringify(updatedUser));
                      setCurrentUser(updatedUser);
                  }
              }
          }
      } catch (e) {
          console.error("Failed to refresh session", e);
      }
  };

  // ... (Keep existing Initialize and Poll Logic) ...
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

  const handlePublicCheck = async (silent = false) => {
      // Validasi data awal
      if (!publicData?.trx_id || !publicData?.merchant_id) {
          if(!silent) alert("Please wait for payment details to load fully.");
          return;
      }
      
      if (IS_DEMO_MODE) {
          if (!silent) alert("Check Status Demo");
          return;
      }
      
      if (!silent) setIsCheckingPublic(true);
      try {
          // 1. Trigger Check Mutation
          const res = await fetch(`${API_BASE}/check_mutation.php`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ 
                  trx_id: publicData.trx_id, 
                  merchant_id: publicData.merchant_id 
              })
          });
          
          if(!res.ok) throw new Error(`Server Error: ${res.status}`);
          
          // 2. Refresh Status
          const params = new URLSearchParams(window.location.search);
          const token = params.get('pay');
          if (token) {
               const resDetails = await fetch(`${API_BASE}/get_payment_details.php?token=${token}`);
               const data = await resDetails.json();
               if (data.success) {
                   setPublicData(data.data);
                   if (data.data.status === 'paid' && !silent) {
                       alert("Payment Confirmed!");
                   } else if (data.data.status === 'pending' && !silent) {
                       alert("Payment not received yet. Please try again in a few seconds.");
                   }
               }
          }
      } catch (e: any) {
          if (!silent) {
              console.error("Auto check failed", e);
              alert("Check Failed: " + e.message);
          }
      } finally {
          if (!silent) setIsCheckingPublic(false);
      }
  };

  const handleCheckStatus = async (trx: Transaction) => {
      if(IS_DEMO_MODE) {
          setTransactions(transactions.map(t => t.id === trx.id ? {...t, status: 'paid'} : t));
          alert("Status Updated (Demo)");
          setSelectedTransaction(null);
          return;
      }
      
      setApiLoading(true);
      try {
          const res = await fetch(`${API_BASE}/check_mutation.php`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ trx_id: trx.id, merchant_id: trx.merchantId })
          });
          const data = await res.json();
          if(data.status === 'success') {
              alert(data.message);
              fetchTransactions(currentUser!); // Refresh list
              setSelectedTransaction(null);
          } else {
              alert(data.message || 'Status still pending or not found in mutation');
          }
      } catch(e) {
          alert("Error checking mutation");
      } finally {
          setApiLoading(false);
      }
  };
  
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
  
  const handleVerifyEmail = async () => { setApiLoading(true); if (IS_DEMO_MODE) { if (otpCode === '123456') { const updated = {...currentUser!, isVerified: true}; loginSuccess(updated, false); alert("Verified"); } else alert("Invalid"); } else { try { const res = await fetch(`${API_BASE}/verify_email.php`, { method: 'POST', body: JSON.stringify({ user_id: currentUser?.id, code: otpCode }) }); const data = await res.json(); if (data.success) { const updated = {...currentUser!, isVerified: true}; loginSuccess(updated, false); alert(data.message); setOtpCode(''); } else alert(data.message); } catch(e) { alert("Connection Error"); } } setApiLoading(false); };
  const handleResendOtp = async () => { setApiLoading(true); if (IS_DEMO_MODE) alert("OTP: 123456"); else { try { const res = await fetch(`${API_BASE}/resend_otp.php`, { method: 'POST', body: JSON.stringify({ user_id: currentUser?.id }) }); const data = await res.json(); alert(data.message || (data.success ? "OTP Sent" : "Failed")); } catch(e) { alert("Error"); } } setApiLoading(false); };
  
  const handleStartDiditKyc = async () => {
      setApiLoading(true);
      try {
          const res = await fetch(`${API_BASE}/create_kyc_session.php`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ user_id: currentUser?.id })
          });
          const data = await res.json();
          
          if (data.success && data.verification_url) {
              window.location.href = data.verification_url;
          } else {
              // ENHANCED ALERT: Show detail error from backend debug
              const errorDetail = data.debug ? "\nDetail: " + JSON.stringify(data.debug) : "";
              alert("Failed to start KYC: " + (data.message || "Unknown error") + errorDetail);
          }
      } catch (e) {
          alert("Didit.me is not configured properly or connection failed.");
      } finally {
          setApiLoading(false);
      }
  };

  const handleLogout = () => { setCurrentUser(null); sessionStorage.removeItem('qios_user'); setShowLanding(true); setTransactions([]); };
  const handleLogin = async (e: React.FormEvent) => { e.preventDefault(); setLoginError(''); setApiLoading(true); if (IS_DEMO_MODE) { let allUsers = [...users]; const savedUsers = localStorage.getItem('qios_users'); if (savedUsers) { const parsed = JSON.parse(savedUsers); allUsers = [...MOCK_USERS, ...parsed.filter((u:User) => !MOCK_USERS.find(m => m.id === u.id))]; } const foundUser = allUsers.find(u => u.username === loginUser); if (loginUser === 'admin' && loginPass === 'admin') loginSuccess(MOCK_USERS[0]); else if (foundUser && loginPass === foundUser.username) loginSuccess(foundUser); else setLoginError('Invalid (Demo: user=pass)'); setApiLoading(false); } else { try { const res = await fetch(`${API_BASE}/login.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: loginUser, password: loginPass }) }); const text = await res.text(); if (!text || text.trim() === '') throw new Error("Empty Response"); let data; try { data = JSON.parse(text); } catch (e) { throw new Error(`Invalid JSON: ${text.substring(0, 100)}...`); } if (data.success) loginSuccess(data.user); else setLoginError(data.message || 'Login failed'); } catch (err: any) { setLoginError(err.message || 'Connection Error'); } finally { setApiLoading(false); } } };
  const handleRegister = async (e: React.FormEvent) => { e.preventDefault(); setRegError(''); if (regPass !== regConfirmPass) { setRegError('Mismatch'); return; } setApiLoading(true); if (IS_DEMO_MODE) { const newUser: User = { id: Date.now().toString(), username: regUser, email: regEmail, role: 'user', isVerified: true }; const currentUsers = JSON.parse(localStorage.getItem('qios_users') || '[]'); currentUsers.push(newUser); localStorage.setItem('qios_users', JSON.stringify(currentUsers)); loginSuccess(newUser); setShowRegister(false); alert('Success (Demo)'); setApiLoading(false); } else { try { const res = await fetch(`${API_BASE}/register.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: regUser, email: regEmail, password: regPass, confirmPassword: regConfirmPass }) }); const text = await res.text(); let data; try { data = JSON.parse(text); } catch(e) { throw new Error(text.substring(0, 50)); } if (data.success) { alert('Success! ' + (data.warning || 'Please login.')); setShowRegister(false); setLoginUser(regUser); } else setRegError(data.message || 'Failed'); } catch (err: any) { setRegError(err.message || 'Error'); } finally { setApiLoading(false); } } };
  const handleManualVerifyUser = async (targetUserId: string) => { if(!confirm("Verify user?")) return; setApiLoading(true); if(IS_DEMO_MODE) { setUsers(users.map(u => u.id === targetUserId ? {...u, isVerified: true} : u)); alert("Verified"); } else { try { const res = await fetch(`${API_BASE}/manage_users.php?action=verify`, { method: 'POST', body: JSON.stringify({ id: targetUserId }) }); const data = await res.json(); if(data.success) { alert("Success"); fetchUsers(); } else alert(data.message); } catch(e) { alert("Error"); } } setApiLoading(false); };
  const handleDeleteUser = async (targetUser: User) => { if (currentUser?.id === targetUser.id) return alert("You cannot delete your own account."); if (!confirm(`Are you sure you want to delete user "${targetUser.username}"? This action cannot be undone.`)) return; setApiLoading(true); if (IS_DEMO_MODE) { setUsers(users.filter(u => u.id !== targetUser.id)); const savedUsers = JSON.parse(localStorage.getItem('qios_users') || '[]'); const newSaved = savedUsers.filter((u: User) => u.id !== targetUser.id); localStorage.setItem('qios_users', JSON.stringify(newSaved)); alert("User deleted (Demo)"); } else { try { const res = await fetch(`${API_BASE}/manage_users.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ action: 'delete', id: targetUser.id }) }); const data = await res.json(); if (data.success) { alert("User deleted successfully"); fetchUsers(); } else { alert("Failed to delete: " + data.message); } } catch (e) { alert("Connection Error"); } } setApiLoading(false); };
  const handleUserManagementSubmit = async (e: React.FormEvent) => { e.preventDefault(); setApiLoading(true); if (!currentUser) return; const payloadConfig = userFormData.role === 'merchant' ? { merchantName: userFormData.merchantName, merchantCode: userFormData.merchantCode, qiospayApiKey: userFormData.apiKey, appSecretKey: 'QIOS_SECRET_' + Math.random().toString(36).substring(7), qrisString: userFormData.qrisString } : null; if (IS_DEMO_MODE) { alert('Saved (Demo)'); } else { try { const res = await fetch(`${API_BASE}/manage_users.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ action: editingUser ? 'update' : 'create', id: editingUser?.id, username: userFormData.username, email: userFormData.email, password: userFormData.password, role: userFormData.role, config: payloadConfig, creator_role: currentUser.role }) }); const data = await res.json(); if(data.success) { fetchUsers(); alert('Saved'); } else alert(data.message); } catch(e) { alert('Error'); } } setApiLoading(false); setUserModalOpen(false); };
  
  // NEW: Update User Auth Security (Wa Login / 2FA per user)
  const handleUserAuthUpdate = async (userId: string, waEnabled: boolean, twoFaEnabled: boolean) => {
      setApiLoading(true);
      if(IS_DEMO_MODE) {
          setUsers(users.map(u => u.id === userId ? {...u, waLoginEnabled: waEnabled, twoFactorEnabled: twoFaEnabled} : u));
          alert("Auth Settings Updated (Demo)");
      } else {
          // Implement backend endpoint for this
          alert("Backend endpoint for updating per-user auth settings is needed.");
      }
      setApiLoading(false);
      setUserAuthModalOpen(false);
  };

  const handleUpdateAccount = async () => { 
    if (!accountForm.username) return alert("Username required"); 
    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmNewPassword) return alert("Passwords do not match"); 
    setApiLoading(true); 
    const updatedUser = { ...currentUser!, username: accountForm.username, email: accountForm.email, phone: accountForm.phone };
    if (IS_DEMO_MODE) { 
        setCurrentUser(updatedUser); 
        sessionStorage.setItem('qios_user', JSON.stringify(updatedUser)); 
        const savedUsers = JSON.parse(localStorage.getItem('qios_users') || '[]');
        const existingIndex = savedUsers.findIndex((u: User) => u.id === updatedUser.id);
        let newUsersList;
        if (existingIndex >= 0) { savedUsers[existingIndex] = updatedUser; newUsersList = savedUsers; } else { newUsersList = [...savedUsers, updatedUser]; }
        localStorage.setItem('qios_users', JSON.stringify(newUsersList));
        alert("Profile Updated (Demo)"); 
        setAccountForm({...accountForm, password: '', newPassword: '', confirmNewPassword: ''});
    } else { 
        try { 
            const payload = { action: 'update', id: currentUser!.id, username: accountForm.username, email: accountForm.email, phone: accountForm.phone, role: currentUser!.role, config: currentUser!.merchantConfig, password: accountForm.newPassword ? accountForm.newPassword : undefined };
            const res = await fetch(`${API_BASE}/manage_users.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) }); 
            const data = await res.json(); 
            if (data.success) { setCurrentUser(updatedUser); sessionStorage.setItem('qios_user', JSON.stringify(updatedUser)); alert("Profile Updated Successfully"); setAccountForm({...accountForm, password: '', newPassword: '', confirmNewPassword: ''}); } else { alert("Update failed: " + data.message); } 
        } catch (e) { alert('Connection Error'); } 
    } 
    setApiLoading(false); 
  };
  // ... (Rest of existing handler functions) ...
  const handleTestEmail = async () => { if (!config.smtp) return alert("Configure SMTP first"); setApiLoading(true); if (IS_DEMO_MODE) { setTimeout(() => { alert(`Sent to ${config.smtp?.fromEmail}`); setApiLoading(false); }, 1500); } else { try { const res = await fetch(`${API_BASE}/test_smtp.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ config: config.smtp, recipient: currentUser?.email || config.smtp.fromEmail }) }); const data = await res.json(); alert(data.message); } catch(e) { alert("Failed"); } finally { setApiLoading(false); } } };
  const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); alert("Copied!"); };
  const fetchTransactions = async (user: User) => { if (IS_DEMO_MODE) { const savedTx = localStorage.getItem('qios_transactions'); if (savedTx) setTransactions(JSON.parse(savedTx)); else setTransactions(Array(5).fill(0).map((_, i) => ({ id: `TRX-DEMO-${1000+i}`, merchantId: user.id, amount: 10000 + (i * 5000), description: `Demo ${i+1}`, status: i % 2 === 0 ? 'paid' : 'pending', createdAt: new Date().toISOString(), qrString: user.merchantConfig?.qrisString || '', paymentUrl: window.location.origin + '/?pay=demo' + i }))); return; } try { const res = await fetch(`${API_BASE}/get_data.php?user_id=${user.id}&role=${user.role}`); const data = await res.json(); if (data.success && data.transactions) setTransactions(data.transactions); } catch (e) { console.error(e); } };
  const fetchUsers = async () => { if (IS_DEMO_MODE) { const savedUsers = localStorage.getItem('qios_users'); setUsers([...MOCK_USERS, ...(savedUsers ? JSON.parse(savedUsers) : []).filter((u:User) => !MOCK_USERS.find(m => m.id === u.id))]); return; } try { const res = await fetch(`${API_BASE}/manage_users.php?action=list`); const data = await res.json(); if (data.success && data.users) setUsers(data.users); } catch (e) { console.error(e); } };
  const loginSuccess = (user: User, redirect = true) => { if (user.username === 'admin' && user.role !== 'superadmin') user.role = 'superadmin'; if (user.isVerified === undefined) user.isVerified = true; setCurrentUser(user); sessionStorage.setItem('qios_user', JSON.stringify(user)); if (user.merchantConfig) setConfig(user.merchantConfig); setAccountForm({ username: user.username, email: user.email || '', phone: user.phone || '', password: '', newPassword: '', confirmNewPassword: '' }); if (user.merchantConfig?.branding?.brandColor) document.documentElement.style.setProperty('--brand-color', user.merchantConfig.branding.brandColor); setView(user.role === 'user' ? 'history' : 'dashboard'); if (redirect) setShowLanding(false); fetchTransactions(user); if (['superadmin', 'merchant', 'cs'].includes(user.role)) fetchUsers(); };
  const handleRevokeLink = async (trx: Transaction) => { if (currentUser?.isVerified === false) return alert("Verify email first."); if (!confirm("Cancel link?")) return; if (IS_DEMO_MODE) { /* @ts-ignore */ setTransactions(transactions.map(t => t.id === trx.id ? {...t, status: 'cancelled'} : t)); alert("Revoked"); } else { try { const res = await fetch(`${API_BASE}/revoke_link.php`, { method: 'POST', body: JSON.stringify({ trx_id: trx.id }) }); const data = await res.json(); if (data.success) { fetchTransactions(currentUser!); alert("Revoked"); } else alert(data.message); } catch(e) { alert("Error"); } } };
  const handleGenerateQR = async () => { if (currentUser?.isVerified === false) return alert("Verify email first."); if (!tempAmount || isNaN(Number(tempAmount))) return; setApiLoading(true); setGeneratedQR(null); setGeneratedLink(null); if (IS_DEMO_MODE) { const qr = generateDynamicQR(config.qrisString, Number(tempAmount)); const token = Math.random().toString(36).substring(7); const link = `${window.location.origin}/?pay=${token}`; setTimeout(() => { setGeneratedQR(qr); setGeneratedLink(link); setTransactions([{ id: `TRX-${Date.now()}`, merchantId: currentUser?.id || '0', amount: Number(tempAmount), description: tempDesc, status: 'pending', createdAt: new Date().toISOString(), qrString: qr, paymentUrl: link }, ...transactions]); setApiLoading(false); }, 800); } else { try { const res = await fetch(`${API_BASE}/create_payment.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ merchant_id: currentUser?.id, amount: Number(tempAmount), description: tempDesc, expiry_minutes: expiryMinutes ? parseInt(expiryMinutes) : 0, single_use: singleUse, api_key: config.appSecretKey }) }); const data = await res.json(); if (data.success) { setGeneratedQR(data.qr_string); setGeneratedLink(data.payment_url); setTransactions([{ id: data.trx_id, merchantId: currentUser?.id || '0', amount: Number(tempAmount), description: tempDesc, status: 'pending', createdAt: new Date().toISOString(), qrString: data.qr_string, paymentUrl: data.payment_url }, ...transactions]); } else alert(data.message); } catch (e) { alert("Error"); } finally { setApiLoading(false); } } };

  // ... (Keep existing Public Render Logic) ...
  if (isPublicMode) {
     const brandColor = config.branding?.brandColor || '#4f46e5';
     const logo = config.branding?.logoUrl;
     if (publicData?.error) { return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full"><AlertCircle className="mx-auto text-red-500 mb-4" size={48} /><h2 className="text-xl font-bold text-gray-800">Invalid Link</h2><p className="text-gray-500 mt-2">{publicData.error}</p></div></div> }
     const isPaid = publicData?.status === 'paid';
     const isExpired = publicData?.status === 'expired' || publicData?.status === 'cancelled';
     return ( 
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 text-center space-y-6 relative overflow-hidden">
                {isPaid && <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center animate-in fade-in"><CheckCircle2 className="text-green-500 mb-4" size={64} /><h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2><p className="text-gray-500 mt-2">Thank you for your payment.</p><p className="font-bold text-lg mt-4">{formatRupiah(publicData.amount)}</p></div>}
                {isExpired && <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center animate-in fade-in"><Ban className="text-red-500 mb-4" size={64} /><h2 className="text-2xl font-bold text-gray-800">Link Expired</h2><p className="text-gray-500 mt-2">This payment link is no longer active.</p></div>}
                <div className="flex justify-center mb-2">{logo ? <img src={logo} alt="Merchant Logo" className="h-16 w-auto object-contain" /> : <div style={{backgroundColor: brandColor}} className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"><QrCode size={32} /></div>}</div>
                <div><h1 className="text-2xl font-bold text-gray-800">{config.merchantName || publicData?.merchant_name}</h1><p className="text-gray-500 text-sm mt-1">{publicData?.description}</p>{publicData?.expires_at && <p className="text-xs text-orange-500 font-bold mt-2 flex justify-center items-center gap-1"><Clock size={12}/> Expires: {new Date(publicData.expires_at).toLocaleString()}</p>}</div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative"><div className="flex justify-center">{generatedQR && <QRCodeDisplay data={generatedQR} width={220} logoUrl={logo} />}</div></div>
                <div style={{color: brandColor}} className="text-4xl font-extrabold">{formatRupiah(Number(tempAmount))}</div>
                
                {/* NEW: PUBLIC ACTION BUTTONS */}
                {!isPaid && !isExpired && (
                    <div className="flex flex-col gap-3 w-full mt-4 animate-in fade-in slide-in-from-bottom-4">
                        {/* Check Status Button (Sync) */}
                        <button 
                            onClick={() => handlePublicCheck(false)} 
                            disabled={isCheckingPublic}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isCheckingPublic ? <Loader2 className="animate-spin" size={20}/> : <RefreshCw size={20}/>}
                            <span>Check Payment Status</span>
                        </button>
                        
                        {/* Download QR Button */}
                        {generatedQR && (
                            <a 
                                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(generatedQR)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                            >
                                <Download size={20}/>
                                <span>Download QR Image</span>
                            </a>
                        )}
                    </div>
                )}
            </div>
            {config.branding?.customDomain && <p className="mt-8 text-gray-400 text-xs">Powered by {config.branding.customDomain}</p>}
        </div> 
     );
  }
  
  // ... (Keep login/register render) ...
  if (showLanding && !currentUser) { return <LandingPage onLogin={() => setShowLanding(false)} onRegister={() => { setShowLanding(false); setShowRegister(true); }} />; }
  if (!currentUser) { 
      // ... (Register/Login Forms) ...
      if (showRegister) { return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"><div className="bg-indigo-600 p-8 text-center relative"><button onClick={()=>{setShowRegister(false);setShowLanding(true);}} className="absolute top-4 left-4 text-white/50 hover:text-white"><X size={20}/></button><h1 className="text-2xl font-bold text-white">Create Account</h1></div><div className="p-8"><form onSubmit={handleRegister} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Username</label><input type="text" required className="w-full px-4 py-2 border border-gray-200 rounded-lg" value={regUser} onChange={e=>setRegUser(e.target.value)}/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input type="email" required className="w-full px-4 py-2 border border-gray-200 rounded-lg" value={regEmail} onChange={e=>setRegEmail(e.target.value)}/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><div className="relative"><input type={showPassword ? "text" : "password"} required className="w-full px-4 py-2 border border-gray-200 rounded-lg pr-10" value={regPass} onChange={e=>setRegPass(e.target.value)}/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label><div className="relative"><input type={showConfirmNewPass ? "text" : "password"} required className="w-full px-4 py-2 border border-gray-200 rounded-lg pr-10" value={regConfirmPass} onChange={e=>setRegConfirmPass(e.target.value)}/><button type="button" onClick={() => setShowConfirmNewPass(!showConfirmNewPass)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">{showConfirmNewPass ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>{regError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{regError}</div>}<button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold">{apiLoading?<Loader2 className="animate-spin"/>:'Sign Up'}</button></form></div></div></div>; } 
      
      // --- LOGIN SCREEN UPDATE ---
      return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="bg-indigo-600 p-8 text-center relative">
                  <button onClick={()=>setShowLanding(true)} className="absolute top-4 left-4 text-white/50 hover:text-white"><X size={20}/></button>
                  <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                  
                  {/* AUTH TOGGLE IF ENABLED */}
                  {(MOCK_USERS[0].merchantConfig?.auth?.loginMethod === 'hybrid' || MOCK_USERS[0].merchantConfig?.auth?.loginMethod === 'whatsapp_otp') && (
                      <div className="flex justify-center gap-2 mt-4 bg-indigo-700/50 p-1 rounded-lg inline-flex">
                          <button onClick={() => setLoginMode('standard')} className={`px-3 py-1 text-xs font-bold rounded ${loginMode === 'standard' ? 'bg-white text-indigo-700' : 'text-indigo-200 hover:text-white'}`}>Email</button>
                          <button onClick={() => setLoginMode('whatsapp')} className={`px-3 py-1 text-xs font-bold rounded ${loginMode === 'whatsapp' ? 'bg-white text-indigo-700' : 'text-indigo-200 hover:text-white'}`}>WhatsApp</button>
                      </div>
                  )}
              </div>
              <div className="p-8">
                  {loginMode === 'standard' && (
                      <form onSubmit={handleLogin} className="space-y-6">
                          <div><label className="block text-sm font-medium text-gray-700 mb-2">Username</label><input type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-lg" value={loginUser} onChange={(e)=>setLoginUser(e.target.value)}/></div>
                          <div><label className="block text-sm font-medium text-gray-700 mb-2">Password</label><div className="relative"><input type={showPassword ? "text" : "password"} required className="w-full px-4 py-3 border border-gray-200 rounded-lg pr-10" value={loginPass} onChange={(e)=>setLoginPass(e.target.value)}/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div></div>
                          {loginError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center"><Lock size={16} className="mr-2"/>{loginError}</div>}
                          <button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold">{apiLoading?<Loader2 className="animate-spin"/>:'Login'}</button>
                      </form>
                  )}
                  {loginMode === 'whatsapp' && (
                      <div className="space-y-6">
                          <div><label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label><div className="flex gap-2"><div className="px-3 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 font-bold">+62</div><input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg" placeholder="812345678" /></div></div>
                          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2"><Send size={18}/> Send OTP</button>
                      </div>
                  )}
                  
                  {/* SOCIAL LOGIN */}
                  {(MOCK_USERS[0].merchantConfig?.auth?.socialLogin?.google || MOCK_USERS[0].merchantConfig?.auth?.socialLogin?.github || MOCK_USERS[0].merchantConfig?.auth?.socialLogin?.facebook) && (
                      <>
                          <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div></div>
                          <div className="grid grid-cols-3 gap-3">
                              {MOCK_USERS[0].merchantConfig?.auth?.socialLogin?.google && <button className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Chrome size={20} className="text-red-500"/></button>}
                              {MOCK_USERS[0].merchantConfig?.auth?.socialLogin?.github && <button className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Github size={20}/></button>}
                              {MOCK_USERS[0].merchantConfig?.auth?.socialLogin?.facebook && <button className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Facebook size={20} className="text-blue-600"/></button>}
                          </div>
                      </>
                  )}

                  <div className="text-center text-sm mt-6"><span className="text-gray-500">New here? </span><button type="button" onClick={()=>{setShowRegister(true);}} className="text-indigo-600 font-bold hover:underline">Create Account</button></div>
              </div>
          </div>
      </div>
      ); 
  }

  // ... (Main Return) ...
  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <TransactionModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} onCopyLink={(t: Transaction) => copyToClipboard(t.paymentUrl || '')} branding={config.branding} onCheckStatus={handleCheckStatus} />
      
      {/* USER MODALS ... */}
      {isUserModalOpen && ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in"> <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"><div className="bg-indigo-600 p-4 text-white flex justify-between items-center"><h3 className="font-bold">{editingUser?'Edit User':'Add New User'}</h3><button onClick={()=>setUserModalOpen(false)}><X size={20}/></button></div><form onSubmit={handleUserManagementSubmit} className="p-6 space-y-4"><div><label className="block text-sm font-medium mb-1">Role</label><select className="w-full border p-2 rounded" value={userFormData.role} onChange={e=>setUserFormData({...userFormData,role:e.target.value as UserRole})}>{currentUser.role==='superadmin'&&<><option value="user">User</option><option value="merchant">Merchant</option><option value="cs">CS</option><option value="superadmin">Super Admin</option></>}{currentUser.role==='merchant'&&<><option value="user">User</option><option value="cs">CS</option></>}{currentUser.role==='cs'&&<option value="user">User</option>}</select></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Username</label><input type="text" required className="w-full border p-2 rounded" value={userFormData.username} onChange={e=>setUserFormData({...userFormData,username:e.target.value})}/></div><div><label className="block text-sm font-medium mb-1">Password</label><input type={editingUser?"text":"password"} required={!editingUser} className="w-full border p-2 rounded" value={userFormData.password} onChange={e=>setUserFormData({...userFormData,password:e.target.value})} placeholder={editingUser?"Blank to keep":"Password"}/></div></div><div><label className="block text-sm font-medium mb-1">Email Address</label><input type="email" className="w-full border p-2 rounded" value={userFormData.email} onChange={e=>setUserFormData({...userFormData,email:e.target.value})} placeholder="user@example.com"/></div>{(userFormData.role==='merchant'||userFormData.role==='superadmin')&&<div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3"><p className="text-xs font-bold text-gray-500 uppercase">Merchant Config</p><input type="text" className="w-full border p-2 rounded text-sm" value={userFormData.merchantName} onChange={e=>setUserFormData({...userFormData,merchantName:e.target.value})} placeholder="Merchant Name"/><textarea className="w-full border p-2 rounded text-xs" rows={2} value={userFormData.qrisString} onChange={e=>setUserFormData({...userFormData,qrisString:e.target.value})} placeholder="QRIS String"/></div>}<button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700">{apiLoading?<Loader2 className="animate-spin"/>:'Save User'}</button></form></div> </div> )}
      {isUserAuthModalOpen && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                  <div className="bg-indigo-600 p-4 text-white flex justify-between items-center"><h3 className="font-bold">Security Settings</h3><button onClick={()=>setUserAuthModalOpen(false)}><X size={20}/></button></div>
                  <div className="p-6 space-y-4">
                      <p className="text-sm text-gray-500 mb-2">Manage security for <strong>{editingUser.username}</strong></p>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2"><Phone size={18}/> <span className="text-sm font-medium">Allow Login via WhatsApp</span></div>
                          <button onClick={()=>handleUserAuthUpdate(editingUser.id, !editingUser.waLoginEnabled, !!editingUser.twoFactorEnabled)} className={`${editingUser.waLoginEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                              {editingUser.waLoginEnabled ? <ToggleRight size={28}/> : <ToggleLeft size={28}/>}
                          </button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2"><Fingerprint size={18}/> <span className="text-sm font-medium">Force 2FA (WhatsApp)</span></div>
                          <button onClick={()=>handleUserAuthUpdate(editingUser.id, !!editingUser.waLoginEnabled, !editingUser.twoFactorEnabled)} className={`${editingUser.twoFactorEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                              {editingUser.twoFactorEnabled ? <ToggleRight size={28}/> : <ToggleLeft size={28}/>}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* SIDEBAR & MAIN LAYOUT ... */}
      {isSidebarOpen && ( <div className="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity" onClick={() => setSidebarOpen(false)} /> )}
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        {/* ... Sidebar Content ... */}
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><QrCode size={24} /></div>
              <div><h1 className="text-xl font-bold text-gray-800">QiosLink</h1><p className="text-xs text-gray-500">{currentUser.username}</p></div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-red-500"><X size={24} /></button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
             <SidebarItem active={view === 'dashboard'} icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => { setView('dashboard'); if(window.innerWidth < 1024) setSidebarOpen(false); }} />
             <SidebarItem active={view === 'history'} icon={<History size={20} />} label="Transactions" onClick={() => { setView('history'); if(window.innerWidth < 1024) setSidebarOpen(false); }} />
             {['superadmin', 'merchant'].includes(currentUser.role) && <SidebarItem active={view === 'terminal'} icon={<Smartphone size={20} />} label="Terminal" onClick={() => { setView('terminal'); if(window.innerWidth < 1024) setSidebarOpen(false); }} />}
             {['superadmin', 'merchant', 'cs'].includes(currentUser.role) && <SidebarItem active={view === 'users'} icon={<Users size={20} />} label="Users" onClick={() => { setView('users'); if(window.innerWidth < 1024) setSidebarOpen(false); }} />}
             {['superadmin', 'merchant'].includes(currentUser.role) && <SidebarItem active={view === 'links'} icon={<LinkIcon size={20} />} label="Payment Links" onClick={() => { setView('links'); if(window.innerWidth < 1024) setSidebarOpen(false); }} />}
             {currentUser.role === 'superadmin' && <SidebarItem active={view === 'integration'} icon={<Code2 size={20} />} label="Integration" onClick={() => { setView('integration'); if(window.innerWidth < 1024) setSidebarOpen(false); }} />}
             <SidebarItem active={view === 'settings'} icon={<Settings size={20} />} label="Settings & Profile" onClick={() => { setView('settings'); if(window.innerWidth < 1024) setSidebarOpen(false); }} />
          </nav>
          <div className="p-4 border-t border-gray-100"><button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg"><LogOut size={20} /><span className="font-medium">Logout</span></button></div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* ... Header ... */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg lg:hidden text-gray-700">
                <Menu size={28} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 capitalize truncate">{view.replace('_', ' ')}</h2>
          </div>
          <div className="flex items-center gap-3">
              {currentUser.isVerified ? <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full"><CheckCircle2 size={12}/> Email</span> : <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-full"><AlertTriangle size={12}/> Email</span>}
              {currentUser.isPhoneVerified ? <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full"><Phone size={12}/> WA</span> : null}
              {currentUser.isKycVerified ? <span className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-full"><ScanFace size={12}/> KYC</span> : null}
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 pb-20">
          <VerificationBanner user={currentUser} onVerifyClick={() => { setView('settings'); setSettingsTab('account'); }} />
          
          {/* ... (Keep existing views: dashboard, terminal, history, etc) ... */}
          {view === 'dashboard' && <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none"><div className="flex justify-between items-start"><div><p className="text-indigo-100 font-medium">Total Transactions</p><h3 className="text-4xl font-bold mt-2">{transactions.length}</h3></div><div className="bg-white/20 p-2 rounded-lg"><Wallet className="text-white" size={24}/></div></div></Card><Card><p className="text-gray-500 font-medium">Total Revenue {IS_DEMO_MODE ? '(Demo)' : ''}</p><h3 className="text-3xl font-bold text-gray-800 mt-2">{formatRupiah(transactions.reduce((acc, curr) => acc + (curr.status === 'paid' ? Number(curr.amount) : 0), 0))}</h3></Card><Card><p className="text-gray-500 font-medium">Pending</p><h3 className="text-3xl font-bold text-orange-600 mt-2">{transactions.filter(t => t.status === 'pending').length}</h3></Card></div><Card className="h-80"><h3 className="font-bold text-gray-700 mb-4">Transaction Volume</h3><ResponsiveContainer width="100%" height="100%"><AreaChart data={transactions.slice(0, 10).reverse()}><defs><linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e7ff" /><XAxis dataKey="createdAt" hide /><YAxis hide /><RechartsTooltip /><Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorAmt)" /></AreaChart></ResponsiveContainer></Card></div>}
          {view === 'terminal' && <div className="flex flex-col lg:flex-row gap-8"><Card className="flex-1"><h3 className="text-lg font-bold text-gray-800 mb-4">Create Payment Link</h3><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-600 mb-1">Amount (IDR)</label><div className="relative"><span className="absolute left-3 top-3 text-gray-400 font-bold">Rp</span><input type="number" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800" placeholder="0" value={tempAmount} onChange={(e) => setTempAmount(e.target.value)} /></div></div><div><label className="block text-sm font-medium text-gray-600 mb-1">Description (Optional)</label><input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" value={tempDesc} onChange={e=>setTempDesc(e.target.value)} placeholder="e.g. Order #123" /></div><div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3"><p className="text-xs font-bold text-gray-500 uppercase">Advanced Options</p><div><label className="block text-sm font-medium text-gray-600 mb-1">Expiry Time (Minutes)</label><input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white" value={expiryMinutes} onChange={e=>setExpiryMinutes(e.target.value)} placeholder="e.g. 60 (Leave empty for no expiry)" /></div><div className="flex items-center gap-2"><input type="checkbox" id="singleUse" checked={singleUse} onChange={e=>setSingleUse(e.target.checked)} className="h-4 w-4 text-indigo-600 rounded" /><label htmlFor="singleUse" className="text-sm text-gray-700">One-time Use (Link expires after payment)</label></div></div><button onClick={handleGenerateQR} disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2">{apiLoading ? <Loader2 className="animate-spin" size={24}/> : <><QrCode size={20} /><span>Generate Payment Link</span></>}</button></div></Card><Card className="flex-1 flex flex-col items-center justify-center bg-gray-50 border-dashed border-2 border-gray-200">{generatedQR ? <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300 w-full"><div className="flex justify-center"><QRCodeDisplay data={generatedQR} width={200} logoUrl={config.branding?.logoUrl} /></div><div><h2 className="text-3xl font-extrabold text-indigo-900">{formatRupiah(Number(tempAmount))}</h2><p className="text-sm text-gray-500 mt-1">{tempDesc}</p></div>{generatedLink && <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-2 text-left"><div className="flex-1 truncate text-xs text-gray-500 font-mono">{generatedLink}</div><button onClick={() => copyToClipboard(generatedLink)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded"><Copy size={16}/></button><a href={generatedLink} target="_blank" className="text-gray-500 hover:bg-gray-50 p-2 rounded"><ExternalLink size={16}/></a></div>}</div> : <div className="text-center text-gray-400 py-12"><QrCode size={48} className="mx-auto mb-4 opacity-50" /><p>Generate to create QR & Link</p></div>}</Card></div>}
          
          {/* --- SETTINGS TAB (UPDATED) --- */}
          {view === 'settings' && (
             <div className="max-w-4xl mx-auto w-full">
                 {/* ... (Settings Navigation) ... */}
                 <div className="flex space-x-4 mb-6 border-b border-gray-200 overflow-x-auto pb-2">
                     <button onClick={() => setSettingsTab('config')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'config' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Merchant Config</button>
                     <button onClick={() => setSettingsTab('account')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'account' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Account</button>
                     {['merchant', 'superadmin'].includes(currentUser.role) && (
                        <>
                           <button onClick={() => setSettingsTab('branding')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'branding' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Branding</button>
                           <button onClick={() => setSettingsTab('smtp')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'smtp' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>SMTP</button>
                           <button onClick={() => setSettingsTab('kyc')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'kyc' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>KYC Config</button>
                           <button onClick={() => setSettingsTab('auth')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${settingsTab === 'auth' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}><Shield size={14}/> Auth & Security</button>
                        </>
                     )}
                 </div>

                 {/* ... (Existing Tabs: config, branding, smtp) ... */}
                 {settingsTab === 'config' && (
                     <Card>
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Settings size={20}/> Core Configuration</h3>
                         <div className="space-y-4">
                             <div><label className="block text-sm font-medium mb-1">Merchant Name</label><input type="text" className="w-full border p-2 rounded" value={config.merchantName} onChange={e => setConfig({...config, merchantName: e.target.value})} disabled={currentUser.role === 'user'} /></div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Qiospay Merchant Code</label><input type="text" className="w-full border p-2 rounded" value={config.merchantCode} onChange={e => setConfig({...config, merchantCode: e.target.value})} disabled={currentUser.role === 'user'} placeholder="e.g. QP001" /></div><div><label className="block text-sm font-medium mb-1">Qiospay API Key</label><div className="relative"><input type="password" className="w-full border p-2 rounded pr-10" value={config.qiospayApiKey || ''} onChange={e => setConfig({...config, qiospayApiKey: e.target.value})} disabled={currentUser.role === 'user'} /><Key size={16} className="absolute right-3 top-3 text-gray-400" /></div></div></div>
                             <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200"><label className="block text-sm font-bold text-yellow-800 mb-1">QiosLink Secret Key (Internal)</label><div className="flex gap-2"><input type="text" readOnly className="w-full bg-white border border-yellow-300 p-2 rounded text-gray-600 font-mono" value={config.appSecretKey || 'Not Generated'} /><button onClick={() => setConfig({...config, appSecretKey: 'QIOS_SEC_' + Math.random().toString(36).substring(2, 12).toUpperCase()})} className="px-3 bg-white border border-yellow-300 rounded hover:bg-yellow-100 text-yellow-700"><RefreshCw size={16}/></button></div></div>
                             <div><label className="block text-sm font-medium mb-1">Default Callback URL (Optional)</label><input type="text" className="w-full border p-2 rounded" value={config.callbackUrl || ''} onChange={e => setConfig({...config, callbackUrl: e.target.value})} placeholder="https://your-website.com/callback" disabled={currentUser.role === 'user'} /><p className="text-xs text-gray-400 mt-1">Used if no callback URL is provided in the API request.</p></div>
                             <div><label className="block text-sm font-medium mb-1">Static QRIS Data (000201...)</label><textarea rows={4} className="w-full border p-2 rounded font-mono text-xs" value={config.qrisString} onChange={e => setConfig({...config, qrisString: e.target.value})} disabled={currentUser.role === 'user'} /></div>
                             {currentUser.role !== 'user' && <button onClick={handleUpdateConfig} disabled={apiLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2">{apiLoading ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Save Configuration</button>}
                         </div>
                     </Card>
                 )}
                 {settingsTab === 'branding' && (
                     <Card>
                         <div className="flex justify-between items-start mb-6"><div><h3 className="text-lg font-bold flex items-center gap-2"><Palette size={20}/> Whitelabel Branding</h3><p className="text-sm text-gray-500">Customize how your payment page looks.</p></div><div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">Merchant Feature</div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Custom Domain (CNAME)</label><input type="text" placeholder="e.g. pay.mystore.com" className="w-full border p-2 rounded" value={config.branding?.customDomain || ''} onChange={e => setConfig({...config, branding: {...config.branding, customDomain: e.target.value}})} /><p className="text-xs text-gray-400 mt-1">Point your domain CNAME to <code>{window.location.host}</code></p></div><div><label className="block text-sm font-medium mb-1">Brand Color</label><div className="flex items-center gap-2"><input type="color" className="h-10 w-10 border p-1 rounded" value={config.branding?.brandColor || '#4f46e5'} onChange={e => setConfig({...config, branding: {...config.branding, brandColor: e.target.value}})} /><input type="text" className="border p-2 rounded w-full" value={config.branding?.brandColor || '#4f46e5'} onChange={e => setConfig({...config, branding: {...config.branding, brandColor: e.target.value}})} /></div></div><div><label className="block text-sm font-medium mb-1">Logo URL</label><input type="text" placeholder="https://..." className="w-full border p-2 rounded" value={config.branding?.logoUrl || ''} onChange={e => setConfig({...config, branding: {...config.branding, logoUrl: e.target.value}})} /></div><button onClick={handleUpdateConfig} className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 mt-4">Save Branding</button></div><div className="bg-gray-100 p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center min-h-[300px]"><p className="text-xs font-bold text-gray-400 uppercase mb-4">Payment Page Preview</p><div className="bg-white p-6 rounded-2xl shadow-lg w-64 text-center"><div className="flex justify-center mb-3">{config.branding?.logoUrl ? <img src={config.branding.logoUrl} className="h-8 w-auto" /> : <div style={{backgroundColor: config.branding?.brandColor || '#4f46e5'}} className="w-8 h-8 rounded-lg flex items-center justify-center text-white"><QrCode size={16}/></div>}</div><div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-300">QR CODE</div><div style={{color: config.branding?.brandColor || '#4f46e5'}} className="font-bold text-xl">Rp 50.000</div></div></div></div>
                     </Card>
                 )}
                 {settingsTab === 'smtp' && (
                     <Card>
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Mail size={20}/> SMTP Configuration</h3>
                         <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 flex gap-3"><div className="text-blue-600"><AlertCircle size={20}/></div><div className="text-sm text-blue-800"><strong>Universal SMTP</strong><br/>Compatible with Gmail, Zoho, and Free Hosting (Socket based, No Library required).</div></div>
                         <div className="mb-6 p-4 border border-indigo-100 rounded-lg bg-indigo-50/50">
                             <div className="flex items-center gap-2"><input type="checkbox" id="useSystemSmtp" className="h-5 w-5 text-indigo-600 rounded" checked={config.smtp?.useSystemSmtp || false} onChange={e => setConfig({...config, smtp: {...config.smtp!, useSystemSmtp: e.target.checked}})} /><div><label htmlFor="useSystemSmtp" className="text-base font-medium text-gray-900 cursor-pointer">Use System Default SMTP</label><p className="text-sm text-gray-500">If enabled, the system will use the Superadmin's email server to send your notifications.</p></div></div>
                         </div>
                         <div className={`space-y-4 transition-opacity duration-200 ${config.smtp?.useSystemSmtp ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div><label className="block text-sm font-medium mb-1">SMTP Host</label><input type="text" className="w-full border p-2 rounded" value={config.smtp?.host || ''} onChange={e => setConfig({...config, smtp: {...config.smtp!, host: e.target.value}})} placeholder="smtp.gmail.com" /></div>
                                 <div>
                                   <label className="block text-sm font-medium mb-1">SMTP Port</label>
                                   <input type="text" className="w-full border p-2 rounded" value={config.smtp?.port || ''} onChange={e => setConfig({...config, smtp: {...config.smtp!, port: e.target.value}})} placeholder="587" />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium mb-1">Encryption Protocol</label>
                                    <select className="w-full border p-2 rounded bg-white" value={config.smtp?.secure || 'tls'} onChange={e => setConfig({...config, smtp: {...config.smtp!, secure: e.target.value as any}})}>
                                        <option value="tls">TLS (Recommended)</option>
                                        <option value="ssl">SSL</option>
                                        <option value="none">None</option>
                                    </select>
                                 </div>
                                 <div><label className="block text-sm font-medium mb-1">Username</label><input type="text" className="w-full border p-2 rounded" value={config.smtp?.user || ''} onChange={e => setConfig({...config, smtp: {...config.smtp!, user: e.target.value}})} placeholder="email@gmail.com" /></div>
                                 <div><label className="block text-sm font-medium mb-1">Password</label><input type="password" className="w-full border p-2 rounded" value={config.smtp?.pass || ''} onChange={e => setConfig({...config, smtp: {...config.smtp!, pass: e.target.value}})} placeholder="App Password" /></div>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div><label className="block text-sm font-medium mb-1">From Email</label><input type="email" className="w-full border p-2 rounded" value={config.smtp?.fromEmail || ''} onChange={e => setConfig({...config, smtp: {...config.smtp!, fromEmail: e.target.value}})} placeholder="no-reply@domain.com" /></div>
                                <div><label className="block text-sm font-medium mb-1">From Name</label><input type="text" className="w-full border p-2 rounded" value={config.smtp?.fromName || ''} onChange={e => setConfig({...config, smtp: {...config.smtp!, fromName: e.target.value}})} placeholder="My Store" /></div>
                             </div>
                         </div>
                         <div className="mt-6 pt-6 border-t border-gray-100">
                            <h4 className="font-bold text-gray-800 mb-2">User Registration Policy</h4>
                            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200"><input type="checkbox" id="reqVerif" className="h-4 w-4 text-indigo-600 rounded" checked={config.smtp?.requireEmailVerification || false} onChange={e => setConfig({...config, smtp: {...config.smtp!, requireEmailVerification: e.target.checked}})} /><div><label htmlFor="reqVerif" className="text-sm font-bold text-gray-700">Require Email Verification for New Users</label><p className="text-xs text-gray-500">If checked, new users created under you must verify their email before using the dashboard.</p></div></div>
                         </div>
                         <div className="flex gap-4 pt-4 border-t border-gray-100 mt-4">
                             <button onClick={handleUpdateConfig} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2"><Save size={18}/> Save Settings</button>
                             <button onClick={handleTestEmail} disabled={apiLoading || config.smtp?.useSystemSmtp} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 flex items-center gap-2 border border-gray-200">{apiLoading ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>} Test Email</button>
                         </div>
                     </Card>
                 )}

                 {/* --- KYC CONFIG (UPDATED) --- */}
                 {settingsTab === 'kyc' && (
                     <Card>
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ScanFace size={20}/> KYC Configuration</h3>
                         <div className="mb-6 p-4 border border-indigo-100 rounded-lg bg-indigo-50/50">
                             <div className="flex items-center gap-2">
                                 <input type="checkbox" id="enableKyc" className="h-5 w-5 text-indigo-600 rounded" checked={config.kyc?.enabled || false} onChange={e => setConfig({...config, kyc: {...config.kyc!, enabled: e.target.checked}})} />
                                 <div><label htmlFor="enableKyc" className="text-base font-medium text-gray-900 cursor-pointer">Enable Identity Verification System</label><p className="text-sm text-gray-500">If enabled, users will see an option to verify their identity.</p></div>
                             </div>
                         </div>
                         
                         {config.kyc?.enabled && (
                            <div className="animate-in fade-in slide-in-from-top-4">
                                <div className="space-y-4">
                                     <div>
                                         <label className="block text-sm font-medium mb-1">Verification Provider</label>
                                         <select className="w-full border p-2 rounded bg-white" value={config.kyc?.provider || 'manual'} onChange={e => setConfig({...config, kyc: {...config.kyc!, provider: e.target.value as any}})}>
                                             <option value="manual">Manual (Contact Admin)</option>
                                             <option value="didit">Didit.me (Automated)</option>
                                         </select>
                                     </div>

                                     {/* MANUAL PROVIDER CONFIG (NEW) */}
                                     {config.kyc?.provider === 'manual' && (
                                         <div className="mt-4 space-y-4 border-t pt-4 animate-in fade-in">
                                             <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                                 <h4 className="font-bold text-gray-800 mb-2">Manual Verification Contact</h4>
                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                     <div>
                                                         <label className="block text-sm font-medium mb-1">Contact Method</label>
                                                         <select className="w-full border p-2 rounded bg-white" value={config.kyc?.manualContactType || 'whatsapp'} onChange={e => setConfig({...config, kyc: {...config.kyc!, manualContactType: e.target.value as any}})}>
                                                             <option value="whatsapp">WhatsApp</option>
                                                             <option value="email">Email</option>
                                                         </select>
                                                     </div>
                                                     <div>
                                                         <label className="block text-sm font-medium mb-1">Contact Value (Number/Email)</label>
                                                         <input type="text" className="w-full border p-2 rounded" value={config.kyc?.manualContactValue || ''} onChange={e => setConfig({...config, kyc: {...config.kyc!, manualContactValue: e.target.value}})} placeholder={config.kyc?.manualContactType === 'email' ? 'admin@example.com' : '628123456789'} />
                                                     </div>
                                                 </div>
                                                 <p className="text-xs text-yellow-800 mt-2">When users click "Verify Identity", they will be redirected to this contact.</p>
                                             </div>
                                         </div>
                                     )}

                                     {/* DIDIT.ME PROVIDER CONFIG (UPDATED) */}
                                     {config.kyc?.provider === 'didit' && (
                                         <div className="mt-4 space-y-4 border-t pt-4 animate-in fade-in">
                                             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4 flex gap-3 items-start">
                                                 <div className="text-blue-600 mt-1"><AlertCircle size={20}/></div>
                                                 <div className="text-sm text-blue-800">
                                                     <p className="font-bold mb-1">Didit.me Integration</p>
                                                     <p className="mb-2">Enter your App ID, API Key, and Webhook Secret from the Didit Dashboard.</p>
                                                     <a href="https://business.didit.me" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-700 font-bold hover:underline">
                                                         Go to Didit Console <ExternalLink size={12}/>
                                                     </a>
                                                 </div>
                                             </div>

                                             <div className="bg-white border p-4 rounded-lg shadow-sm">
                                                 <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">API Credentials</h4>
                                                 <div className="space-y-4">
                                                     {/* APP ID INPUT */}
                                                     <div>
                                                         <label className="block text-sm font-medium mb-1">App ID</label>
                                                         <input type="text" className="w-full border p-2 rounded" value={config.kyc?.diditAppId || ''} onChange={e => setConfig({...config, kyc: {...config.kyc!, diditAppId: e.target.value}})} placeholder="Enter Didit App ID"/>
                                                     </div>
                                                     {/* API KEY INPUT */}
                                                     <div>
                                                         <label className="block text-sm font-medium mb-1">API Key</label>
                                                         <input type="password" className="w-full border p-2 rounded" value={config.kyc?.diditApiKey || ''} onChange={e => setConfig({...config, kyc: {...config.kyc!, diditApiKey: e.target.value}})} placeholder="Enter Didit API Key"/>
                                                     </div>
                                                     {/* WEBHOOK SECRET INPUT */}
                                                     <div>
                                                         <label className="block text-sm font-medium mb-1">Webhook Secret</label>
                                                         <input type="password" className="w-full border p-2 rounded" value={config.kyc?.diditWebhookSecret || ''} onChange={e => setConfig({...config, kyc: {...config.kyc!, diditWebhookSecret: e.target.value}})} placeholder="Enter Webhook Secret"/>
                                                     </div>
                                                     
                                                     <div className="pt-2">
                                                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Webhook URL (Callback)</label>
                                                         <div className="flex gap-2">
                                                             <input type="text" readOnly className="w-full bg-gray-50 border p-2 rounded text-gray-600 font-mono text-xs" value={window.location.origin + "/api/kyc_callback.php"} />
                                                             <button onClick={() => copyToClipboard(window.location.origin + "/api/kyc_callback.php")} className="px-3 bg-gray-100 border rounded hover:bg-gray-200 text-gray-600"><Copy size={16}/></button>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     )}
                                </div>
                            </div>
                         )}
                         <button onClick={handleUpdateConfig} disabled={apiLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 mt-4">{apiLoading ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Save KYC Settings</button>
                     </Card>
                 )}

                 {/* ... (Auth Tab) ... */}
                 {settingsTab === 'auth' && (
                     <div className="space-y-6 animate-in fade-in">
                         {/* 1. VERIFICATION METHODS */}
                         <Card>
                             <h3 className="text-lg font-bold mb-4">Verification Methods</h3>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border cursor-pointer hover:bg-indigo-50 transition-colors">
                                     <input type="checkbox" checked={config.auth?.verifyEmail} onChange={e => setConfig({...config, auth: {...config.auth!, verifyEmail: e.target.checked}})} className="h-5 w-5 text-indigo-600"/>
                                     <span className="font-medium">Verify Email</span>
                                 </label>
                                 <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border cursor-pointer hover:bg-indigo-50 transition-colors">
                                     <input type="checkbox" checked={config.auth?.verifyWhatsapp} onChange={e => setConfig({...config, auth: {...config.auth!, verifyWhatsapp: e.target.checked}})} className="h-5 w-5 text-indigo-600"/>
                                     <span className="font-medium">Verify WhatsApp</span>
                                 </label>
                                 <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border cursor-pointer hover:bg-indigo-50 transition-colors">
                                     <input type="checkbox" checked={config.kyc?.enabled} onChange={e => setConfig({...config, kyc: {...config.kyc!, enabled: e.target.checked}})} className="h-5 w-5 text-indigo-600"/>
                                     <span className="font-medium">Verify KYC (Identity)</span>
                                 </label>
                             </div>
                         </Card>

                         {/* 2. LOGIN LOGIC */}
                         <Card>
                             <h3 className="text-lg font-bold mb-4">Login Logic</h3>
                             <div className="space-y-4">
                                 <div>
                                     <label className="block text-sm font-medium mb-1">Authentication Method</label>
                                     <select className="w-full border p-2 rounded bg-white" value={config.auth?.loginMethod || 'standard'} onChange={e => setConfig({...config, auth: {...config.auth!, loginMethod: e.target.value as any}})}>
                                         <option value="standard">Standard (Email + Password)</option>
                                         <option value="whatsapp_otp">WhatsApp OTP Only (Passwordless)</option>
                                         <option value="hybrid">Hybrid (Both Available)</option>
                                     </select>
                                 </div>
                                 
                                 {(config.auth?.loginMethod !== 'standard') && (
                                     <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 animate-in fade-in">
                                         <label className="block text-sm font-medium mb-2">WhatsApp Login Scope</label>
                                         <select className="w-full border p-2 rounded bg-white mb-4" value={config.auth?.waLoginScope || 'universal_except_admin'} onChange={e => setConfig({...config, auth: {...config.auth!, waLoginScope: e.target.value as any}})}>
                                             <option value="universal_except_admin">Universal (Except Admin)</option>
                                             <option value="role_based">Role Based (Specific Roles)</option>
                                             <option value="specific_users">Specific Users (By Username)</option>
                                             <option value="all_users_dangerous">All Users incl. Admin (DANGEROUS)</option>
                                         </select>
                                         
                                         {/* Role Based Configuration UI */}
                                         {config.auth?.waLoginScope === 'role_based' && (
                                             <div className="space-y-2 pl-2 border-l-4 border-indigo-200">
                                                 <p className="text-xs font-bold text-gray-500 uppercase mb-2">Select Allowed Roles:</p>
                                                 {['superadmin', 'merchant', 'cs', 'user'].map((role) => (
                                                     <label key={role} className="flex items-center gap-2 cursor-pointer">
                                                         <input 
                                                             type="checkbox" 
                                                             checked={config.auth?.allowedRoles?.includes(role as UserRole)} 
                                                             onChange={(e) => {
                                                                 const currentRoles = config.auth?.allowedRoles || [];
                                                                 if(e.target.checked) {
                                                                     setConfig({...config, auth: {...config.auth!, allowedRoles: [...currentRoles, role as UserRole]}});
                                                                 } else {
                                                                     setConfig({...config, auth: {...config.auth!, allowedRoles: currentRoles.filter(r => r !== role)}});
                                                                 }
                                                             }}
                                                             className="h-4 w-4 text-indigo-600 rounded" 
                                                         />
                                                         <span className="text-sm capitalize">{role}</span>
                                                     </label>
                                                 ))}
                                             </div>
                                         )}

                                         {/* Specific User Configuration UI */}
                                         {config.auth?.waLoginScope === 'specific_users' && (
                                             <div className="space-y-2">
                                                 <label className="block text-xs font-bold text-gray-500 uppercase">Allowed Usernames (Comma Separated)</label>
                                                 <textarea 
                                                     className="w-full border p-2 rounded text-sm h-24 font-mono"
                                                     placeholder="admin, budi, siska_99"
                                                     value={config.auth?.allowedSpecificUsers?.join(', ') || ''}
                                                     onChange={(e) => {
                                                         const users = e.target.value.split(',').map(u => u.trim()).filter(u => u !== '');
                                                         setConfig({...config, auth: {...config.auth!, allowedSpecificUsers: users}});
                                                     }}
                                                 />
                                                 <p className="text-xs text-gray-400">Enter usernames manually here, or use the User Management table to toggle specific permissions.</p>
                                             </div>
                                         )}

                                         {config.auth?.waLoginScope === 'all_users_dangerous' && (
                                             <p className="text-red-600 text-xs font-bold flex items-center gap-1"><AlertTriangle size={12}/> Warning: If WhatsApp API fails, Admin cannot login!</p>
                                         )}
                                     </div>
                                 )}

                                 <div>
                                     <label className="block text-sm font-medium mb-1">Two-Factor Authentication (2FA)</label>
                                     <select className="w-full border p-2 rounded bg-white" value={config.auth?.twoFactorLogic || 'user_opt_in'} onChange={e => setConfig({...config, auth: {...config.auth!, twoFactorLogic: e.target.value as any}})}>
                                         <option value="disabled">Disabled</option>
                                         <option value="user_opt_in">User Defined (Opt-in via Settings)</option>
                                         <option value="admin_forced">Admin Forced (Mandatory for All)</option>
                                     </select>
                                     {config.auth?.twoFactorLogic === 'admin_forced' && (
                                         <p className="text-red-500 text-xs mt-1 font-bold flex items-center gap-1">
                                             <AlertTriangle size={12}/> Warning: This applies to SUPERADMIN as well. Ensure WhatsApp Gateway is active to avoid lockout.
                                         </p>
                                     )}
                                 </div>
                             </div>
                         </Card>

                         {/* 3. WHATSAPP GATEWAY */}
                         <Card>
                             <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Phone size={20}/> WhatsApp Gateway</h3>
                             <div className="space-y-4">
                                 <div>
                                     <label className="block text-sm font-medium mb-1">Provider</label>
                                     <select className="w-full border p-2 rounded bg-white" value={config.auth?.waProvider || 'fonnte'} onChange={e => setConfig({...config, auth: {...config.auth!, waProvider: e.target.value as any}})}>
                                         <option value="fonnte">Unofficial (Fonnte) - Easiest</option>
                                         <option value="meta">Official (Meta Cloud API) - Enterprise</option>
                                     </select>
                                 </div>

                                 {config.auth?.waProvider === 'fonnte' ? (
                                     <div>
                                         <label className="block text-sm font-medium mb-1">Fonnte Token</label>
                                         <div className="flex gap-2">
                                             <input type="password" className="w-full border p-2 rounded" value={config.auth?.fonnteToken || ''} onChange={e => setConfig({...config, auth: {...config.auth!, fonnteToken: e.target.value}})} placeholder="Enter Fonnte Token" />
                                             <a href="https://fonnte.com" target="_blank" className="px-3 py-2 bg-gray-100 rounded text-gray-600 text-sm hover:bg-gray-200 whitespace-nowrap">Get Token</a>
                                         </div>
                                     </div>
                                 ) : (
                                     <div className="space-y-3 p-4 bg-gray-50 rounded border">
                                         <div><label className="block text-xs font-bold text-gray-500 uppercase">App ID</label><input type="text" className="w-full border p-2 rounded" value={config.auth?.metaAppId} onChange={e => setConfig({...config, auth: {...config.auth!, metaAppId: e.target.value}})}/></div>
                                         <div><label className="block text-xs font-bold text-gray-500 uppercase">Phone Number ID</label><input type="text" className="w-full border p-2 rounded" value={config.auth?.metaPhoneId} onChange={e => setConfig({...config, auth: {...config.auth!, metaPhoneId: e.target.value}})}/></div>
                                         <div><label className="block text-xs font-bold text-gray-500 uppercase">Access Token</label><input type="password" className="w-full border p-2 rounded" value={config.auth?.metaToken} onChange={e => setConfig({...config, auth: {...config.auth!, metaToken: e.target.value}})}/></div>
                                     </div>
                                 )}
                             </div>
                         </Card>

                         {/* 4. SOCIAL LOGIN */}
                         <Card>
                             <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Globe size={20}/> Social Login (OAuth)</h3>
                             <div className="space-y-6">
                                 {/* Google */}
                                 <div className="border rounded-xl p-4">
                                     <div className="flex items-center justify-between mb-4">
                                         <div className="flex items-center gap-2 font-bold text-gray-700"><Chrome size={20} className="text-red-500"/> Google Login</div>
                                         <input type="checkbox" className="toggle h-6 w-10" checked={config.auth?.socialLogin?.google} onChange={e => setConfig({...config, auth: {...config.auth!, socialLogin: {...config.auth!.socialLogin, google: e.target.checked}}})} />
                                     </div>
                                     {config.auth?.socialLogin?.google && (
                                         <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                                             <input type="text" className="border p-2 rounded text-sm" placeholder="Client ID" value={config.auth?.socialLogin?.googleClientId} onChange={e => setConfig({...config, auth: {...config.auth!, socialLogin: {...config.auth!.socialLogin, googleClientId: e.target.value}}})} />
                                             <input type="password" className="border p-2 rounded text-sm" placeholder="Client Secret" value={config.auth?.socialLogin?.googleClientSecret} onChange={e => setConfig({...config, auth: {...config.auth!, socialLogin: {...config.auth!.socialLogin, googleClientSecret: e.target.value}}})} />
                                         </div>
                                     )}
                                 </div>

                                 {/* Facebook */}
                                 <div className="border rounded-xl p-4">
                                     <div className="flex items-center justify-between mb-4">
                                         <div className="flex items-center gap-2 font-bold text-gray-700"><Facebook size={20} className="text-blue-600"/> Facebook Login</div>
                                         <input type="checkbox" className="toggle h-6 w-10" checked={config.auth?.socialLogin?.facebook} onChange={e => setConfig({...config, auth: {...config.auth!, socialLogin: {...config.auth!.socialLogin, facebook: e.target.checked}}})} />
                                     </div>
                                     {config.auth?.socialLogin?.facebook && (
                                         <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                                             <input type="text" className="border p-2 rounded text-sm" placeholder="App ID" value={config.auth?.socialLogin?.facebookAppId} onChange={e => setConfig({...config, auth: {...config.auth!, socialLogin: {...config.auth!.socialLogin, facebookAppId: e.target.value}}})} />
                                             <input type="password" className="border p-2 rounded text-sm" placeholder="App Secret" value={config.auth?.socialLogin?.facebookAppSecret} onChange={e => setConfig({...config, auth: {...config.auth!, socialLogin: {...config.auth!.socialLogin, facebookAppSecret: e.target.value}}})} />
                                         </div>
                                     )}
                                 </div>

                                 {/* Github */}
                                 <div className="border rounded-xl p-4">
                                     <div className="flex items-center justify-between mb-4">
                                         <div className="flex items-center gap-2 font-bold text-gray-700"><Github size={20}/> Github Login</div>
                                         <input type="checkbox" className="toggle h-6 w-10" checked={config.auth?.socialLogin?.github} onChange={e => setConfig({...config, auth: {...config.auth!, socialLogin: {...config.auth!.socialLogin, github: e.target.checked}}})} />
                                     </div>
                                     {config.auth?.socialLogin?.github && (
                                         <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                                             <input type="text" className="border p-2 rounded text-sm" placeholder="Client ID" value={config.auth?.socialLogin?.githubClientId} onChange={e => setConfig({...config, auth: {...config.auth!, socialLogin: {...config.auth!.socialLogin, githubClientId: e.target.value}}})} />
                                             <input type="password" className="border p-2 rounded text-sm" placeholder="Client Secret" value={config.auth?.socialLogin?.githubClientSecret} onChange={e => setConfig({...config, auth: {...config.auth!, socialLogin: {...config.auth!.socialLogin, githubClientSecret: e.target.value}}})} />
                                         </div>
                                     )}
                                 </div>
                             </div>
                         </Card>

                         <button onClick={handleUpdateConfig} disabled={apiLoading} className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-2">
                             {apiLoading ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Save All Security Settings
                         </button>
                     </div>
                 )}
             </div>
          )}
          
          {/* --- ACCOUNT TAB (UPDATED MANUAL BUTTON) --- */}
          {view === 'settings' && settingsTab === 'account' && (
             <div className="space-y-6">
                 {/* ... (Existing Verification List) ... */}
                 <Card>
                    {/* ... */}
                    {!currentUser.isKycVerified && config.kyc?.enabled && ( 
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 animate-in fade-in">
                            <p className="text-sm text-blue-800 mb-3">Upgrade your account security and limits by verifying your identity.</p>
                            <button 
                                onClick={
                                    config.kyc?.provider === 'didit' 
                                        ? handleStartDiditKyc 
                                        : () => {
                                            const type = config.kyc?.manualContactType || 'whatsapp';
                                            const value = config.kyc?.manualContactValue || '628123456789';
                                            let url = '#';
                                            if (type === 'whatsapp') {
                                                url = `https://wa.me/${value.replace(/[^0-9]/g,'')}?text=Halo%20Admin,%20saya%20${currentUser.username}%20(ID:${currentUser.id})%20ingin%20verifikasi%20KYC%20manual.`;
                                            } else {
                                                url = `mailto:${value}?subject=KYC%20Verification%20Request%20(${currentUser.username})&body=Hello%20Admin,%20I%20want%20to%20verify%20my%20account%20(ID:${currentUser.id}).`;
                                            }
                                            window.open(url, '_blank');
                                        }
                                } 
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                            >
                                <ScanFace size={18}/> 
                                {config.kyc?.provider === 'didit' ? 'Start Automated Verification' : 'Contact Admin for Verification'}
                            </button>
                        </div> 
                    )}
                 </Card>
                 {/* ... (Existing Profile Form) ... */}
             </div>
          )}
          {/* ... (Rest of views) ... */}
        </div>
      </main>
    </div>
  );
}
