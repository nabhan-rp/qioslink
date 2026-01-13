
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
  Rocket
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
const APP_VERSION = "4.3.2 (Mobile UX Fix)";

const getEnv = () => {
  try {
    // @ts-ignore
    return import.meta.env || {};
  } catch {
    return {};
  }
};

const env = getEnv();
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
              <span className="font-bold text-xl tracking-tight text-gray-800">QiosLink <span className="text-indigo-600 text-xs px-1 border border-indigo-200 rounded">v4</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
              <a href="#features" className="hover:text-indigo-600 transition-colors" title="View Key Features">Features</a>
              <a href="#hosting" className="hover:text-indigo-600 transition-colors text-indigo-600 font-bold" title="Hosting Partners">Hosting Partner</a>
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
                Self-Hosted & White Label.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Convert Nobu/Qiospay static QRIS into a dynamic payment gateway. Compatible with WHMCS, WooCommerce, and Shopify. Now runs on any hosting including Free Hosting!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <button onClick={onRegister} className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2">
                Create Account <ArrowRight size={18} />
              </button>
              <a href="#hosting" className="w-full sm:w-auto px-8 py-4 text-base font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-all flex items-center justify-center gap-2">
                <Cloud size={20} /> View Hosting Partners
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-400">
                v4.3 Update: Fixed SMTP for InfinityFree/Byet/MyOwnFreeHost.
            </p>
          </div>
        </section>

        {/* HOSTING PARTNER SECTION */}
        <section id="hosting" className="py-20 bg-gradient-to-b from-gray-900 to-indigo-900 text-white relative overflow-hidden">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                 <div className="inline-block px-3 py-1 bg-indigo-500/30 rounded-full text-indigo-200 text-xs font-bold mb-4 border border-indigo-500/50">OFFICIAL INFRASTRUCTURE PARTNER</div>
                 <h2 className="text-3xl md:text-5xl font-bold mb-6">Powered by JajanServer</h2>
                 <p className="text-indigo-100 max-w-2xl mx-auto text-lg mb-12">
                     QiosLink is optimized to run on JajanServer ecosystem. Whether you are testing with a free account or running a high-traffic business, we have the right server for you.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                     <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-indigo-400 transition-all text-left flex flex-col hover:transform hover:-translate-y-1">
                         <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                             <Zap size={24} className="text-white" />
                         </div>
                         <h3 className="text-2xl font-bold mb-2">Free Hosting</h3>
                         <p className="text-gray-300 text-sm mb-6 flex-1">
                             Perfect for testing QiosLink. Get free subdomain (jajanserver.com) and cPanel access without cost.
                         </p>
                         <ul className="space-y-2 mb-8 text-sm text-gray-300">
                             <li className="flex gap-2"><Check size={16} className="text-green-400"/> Unlimited Bandwidth</li>
                             <li className="flex gap-2"><Check size={16} className="text-green-400"/> Free SSL Certificate</li>
                             <li className="flex gap-2"><Check size={16} className="text-green-400"/> Instant Activation</li>
                         </ul>
                         <a href="https://freehosting.jajanserver.com" target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-white text-gray-900 font-bold rounded-lg text-center hover:bg-gray-100 transition-colors">
                             Claim Free Account
                         </a>
                     </div>
                     <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 border border-indigo-400 shadow-2xl text-left flex flex-col relative transform md:scale-105">
                         <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm">RECOMMENDED</div>
                         <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                             <Rocket size={24} className="text-white" />
                         </div>
                         <h3 className="text-2xl font-bold mb-2">Premium Cloud</h3>
                         <p className="text-indigo-100 text-sm mb-6 flex-1">
                             High performance NVMe SSD servers for production use. Located in Indonesia/Singapore for low latency.
                         </p>
                         <ul className="space-y-2 mb-8 text-sm text-indigo-100">
                             <li className="flex gap-2"><Check size={16} className="text-yellow-300"/> 99.9% Uptime SLA</li>
                             <li className="flex gap-2"><Check size={16} className="text-yellow-300"/> Priority WHMCS Support</li>
                             <li className="flex gap-2"><Check size={16} className="text-yellow-300"/> Daily Auto Backup</li>
                         </ul>
                         <a href="https://www.jajanserver.com" target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-yellow-400 text-yellow-900 font-bold rounded-lg text-center hover:bg-yellow-300 transition-colors shadow-lg">
                             View Premium Plans
                         </a>
                     </div>
                 </div>
                 <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-indigo-300">
                     <a href="https://dash.jajanserver.com" className="hover:text-white transition-colors flex items-center gap-1">Client Area <ExternalLink size={12}/></a>
                     <span>•</span>
                     <a href="http://cpanel.jajanserver.biz.id" className="hover:text-white transition-colors flex items-center gap-1">VistaPanel Login <ExternalLink size={12}/></a>
                     <span>•</span>
                     <span>Reseller Domain: jajanserver.biz.id</span>
                 </div>
             </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-gray-50/50" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 id="features-heading" className="text-3xl font-bold text-gray-900">Why QiosLink?</h2>
              <p className="text-gray-500 mt-4">The ultimate self-hosted payment solution.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Server className="text-indigo-600" size={24} />,
                  title: "Self Hosted",
                  desc: "Host it on JajanServer or your own VPS. Supports cPanel, DirectAdmin, and even Free Hosting providers."
                },
                {
                  icon: <Palette className="text-blue-600" size={24} />,
                  title: "White Label Branding",
                  desc: "Use your own logo, brand colors, and Custom Domain (CNAME). Make it look like your own bank."
                },
                {
                  icon: <Code2 className="text-purple-600" size={24} />,
                  title: "Easy Integration",
                  desc: "Ready-to-use modules for WHMCS and WooCommerce. JSON API available for custom apps."
                }
              ].map((f, i) => (
                <article key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6" aria-hidden="true">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <QrCode size={18} />
             </div>
             <span className="font-bold text-gray-900">QiosLink</span>
          </div>
          <p className="text-sm text-gray-500">
            Open Source Project by <a href="https://github.com/nabhan-rp" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">Nabhan Rafli</a>. 
            Sponsored by <a href="https://www.jajanserver.com" target="_blank" className="text-indigo-600 font-bold hover:underline">JajanServer</a>.
          </p>
        </div>
      </footer>
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

const TransactionModal = ({ transaction, onClose, onCopyLink, branding }: any) => {
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
          <div className="flex gap-3 pt-2">
            <button onClick={() => onCopyLink(transaction)} className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors border border-gray-200"><LinkIcon size={18} /><span>Copy Link</span></button>
            <button onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(transaction.qrString)}`, '_blank')} className="flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"><Download size={18} /></button>
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
  smtp: { host: 'smtp.gmail.com', port: '587', user: 'your-email@gmail.com', pass: 'app-password', secure: 'tls', fromName: 'QiosLink Notification', fromEmail: 'no-reply@qioslink.com', enableNotifications: false, useSystemSmtp: false, requireEmailVerification: false }
};

const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', email:'admin@example.com', role: 'superadmin', merchantConfig: DEFAULT_MERCHANT_CONFIG, isVerified: true },
  { id: '2', username: 'merchant', email:'merchant@store.com', role: 'merchant', merchantConfig: { ...DEFAULT_MERCHANT_CONFIG, merchantName: "Warung Demo" }, isVerified: true }
];

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [view, setView] = useState<ViewState>('dashboard');
  const [settingsTab, setSettingsTab] = useState<'config' | 'account' | 'branding' | 'smtp'>('config');
  // Sidebar state: Default false on mobile (handled by media query logic usually, but here default true for desktop)
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

  // Handle Resize for Sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { initialize(); }, []);

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

  // ... (ALL ACTION HANDLERS REMAIN THE SAME) ...
  const handleVerifyEmail = async () => { setApiLoading(true); if (IS_DEMO_MODE) { if (otpCode === '123456') { const updated = {...currentUser!, isVerified: true}; loginSuccess(updated, false); alert("Verified"); } else alert("Invalid"); } else { try { const res = await fetch(`${API_BASE}/verify_email.php`, { method: 'POST', body: JSON.stringify({ user_id: currentUser?.id, code: otpCode }) }); const data = await res.json(); if (data.success) { const updated = {...currentUser!, isVerified: true}; loginSuccess(updated, false); alert(data.message); setOtpCode(''); } else alert(data.message); } catch(e) { alert("Connection Error"); } } setApiLoading(false); };
  const handleManualVerifyUser = async (targetUserId: string) => { if(!confirm("Verify user?")) return; setApiLoading(true); if(IS_DEMO_MODE) { setUsers(users.map(u => u.id === targetUserId ? {...u, isVerified: true} : u)); alert("Verified"); } else { try { const res = await fetch(`${API_BASE}/manage_users.php?action=verify`, { method: 'POST', body: JSON.stringify({ id: targetUserId }) }); const data = await res.json(); if(data.success) { alert("Success"); fetchUsers(); } else alert(data.message); } catch(e) { alert("Error"); } } setApiLoading(false); };
  const handleResendOtp = async () => { setApiLoading(true); if (IS_DEMO_MODE) alert("OTP: 123456"); else { try { const res = await fetch(`${API_BASE}/resend_otp.php`, { method: 'POST', body: JSON.stringify({ user_id: currentUser?.id }) }); const data = await res.json(); alert(data.message || (data.success ? "OTP Sent" : "Failed")); } catch(e) { alert("Error"); } } setApiLoading(false); };
  const handleUpdateConfig = async () => { setApiLoading(true); if (currentUser) { const updatedUser = { ...currentUser, merchantConfig: config }; if (IS_DEMO_MODE) { setCurrentUser(updatedUser); sessionStorage.setItem('qios_user', JSON.stringify(updatedUser)); alert('Saved'); } else { try { const res = await fetch(`${API_BASE}/update_config.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ user_id: currentUser.id, config: config }) }); const data = await res.json(); if (data.success) { setCurrentUser(updatedUser); sessionStorage.setItem('qios_user', JSON.stringify(updatedUser)); alert('Saved'); } else alert(data.message); } catch (e) { alert('Error'); } } } setApiLoading(false); };
  const handleTestEmail = async () => { if (!config.smtp) return alert("Configure SMTP first"); setApiLoading(true); if (IS_DEMO_MODE) { setTimeout(() => { alert(`Sent to ${config.smtp?.fromEmail}`); setApiLoading(false); }, 1500); } else { try { const res = await fetch(`${API_BASE}/test_smtp.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ config: config.smtp, recipient: currentUser?.email || config.smtp.fromEmail }) }); const data = await res.json(); alert(data.message); } catch(e) { alert("Failed"); } finally { setApiLoading(false); } } };
  const handleUpdateAccount = () => { if (!accountForm.username) return alert("Username required"); if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmNewPassword) return alert("Passwords do not match"); const updatedUser = { ...currentUser!, username: accountForm.username, email: accountForm.email }; setCurrentUser(updatedUser); sessionStorage.setItem('qios_user', JSON.stringify(updatedUser)); alert("Updated"); setAccountForm({...accountForm, password: '', newPassword: '', confirmNewPassword: ''}); };
  const handleGenerateQR = async () => { if (currentUser?.isVerified === false) return alert("Verify email first."); if (!tempAmount || isNaN(Number(tempAmount))) return; setApiLoading(true); setGeneratedQR(null); setGeneratedLink(null); if (IS_DEMO_MODE) { const qr = generateDynamicQR(config.qrisString, Number(tempAmount)); const token = Math.random().toString(36).substring(7); const link = `${window.location.origin}/?pay=${token}`; setTimeout(() => { setGeneratedQR(qr); setGeneratedLink(link); setTransactions([{ id: `TRX-${Date.now()}`, merchantId: currentUser?.id || '0', amount: Number(tempAmount), description: tempDesc, status: 'pending', createdAt: new Date().toISOString(), qrString: qr, paymentUrl: link }, ...transactions]); setApiLoading(false); }, 800); } else { try { const res = await fetch(`${API_BASE}/create_payment.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ merchant_id: currentUser?.id, amount: Number(tempAmount), description: tempDesc, expiry_minutes: expiryMinutes ? parseInt(expiryMinutes) : 0, single_use: singleUse, api_key: config.appSecretKey }) }); const data = await res.json(); if (data.success) { setGeneratedQR(data.qr_string); setGeneratedLink(data.payment_url); setTransactions([{ id: data.trx_id, merchantId: currentUser?.id || '0', amount: Number(tempAmount), description: tempDesc, status: 'pending', createdAt: new Date().toISOString(), qrString: data.qr_string, paymentUrl: data.payment_url }, ...transactions]); } else alert(data.message); } catch (e) { alert("Error"); } finally { setApiLoading(false); } } };
  const handleRevokeLink = async (trx: Transaction) => { if (currentUser?.isVerified === false) return alert("Verify email first."); if (!confirm("Cancel link?")) return; if (IS_DEMO_MODE) { /* @ts-ignore */ setTransactions(transactions.map(t => t.id === trx.id ? {...t, status: 'cancelled'} : t)); alert("Revoked"); } else { try { const res = await fetch(`${API_BASE}/revoke_link.php`, { method: 'POST', body: JSON.stringify({ trx_id: trx.id }) }); const data = await res.json(); if (data.success) { fetchTransactions(currentUser!); alert("Revoked"); } else alert(data.message); } catch(e) { alert("Error"); } } };
  const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); alert("Copied!"); };
  const fetchTransactions = async (user: User) => { if (IS_DEMO_MODE) { const savedTx = localStorage.getItem('qios_transactions'); if (savedTx) setTransactions(JSON.parse(savedTx)); else setTransactions(Array(5).fill(0).map((_, i) => ({ id: `TRX-DEMO-${1000+i}`, merchantId: user.id, amount: 10000 + (i * 5000), description: `Demo ${i+1}`, status: i % 2 === 0 ? 'paid' : 'pending', createdAt: new Date().toISOString(), qrString: user.merchantConfig?.qrisString || '', paymentUrl: window.location.origin + '/?pay=demo' + i }))); return; } try { const res = await fetch(`${API_BASE}/get_data.php?user_id=${user.id}&role=${user.role}`); const data = await res.json(); if (data.success && data.transactions) setTransactions(data.transactions); } catch (e) { console.error(e); } };
  const fetchUsers = async () => { if (IS_DEMO_MODE) { const savedUsers = localStorage.getItem('qios_users'); setUsers([...MOCK_USERS, ...(savedUsers ? JSON.parse(savedUsers) : []).filter((u:User) => !MOCK_USERS.find(m => m.id === u.id))]); return; } try { const res = await fetch(`${API_BASE}/manage_users.php?action=list`); const data = await res.json(); if (data.success && data.users) setUsers(data.users); } catch (e) { console.error(e); } };
  const loginSuccess = (user: User, redirect = true) => { if (user.username === 'admin' && user.role !== 'superadmin') user.role = 'superadmin'; if (user.isVerified === undefined) user.isVerified = true; setCurrentUser(user); sessionStorage.setItem('qios_user', JSON.stringify(user)); if (user.merchantConfig) setConfig(user.merchantConfig); setAccountForm({ username: user.username, email: user.email || '', password: '', newPassword: '', confirmNewPassword: '' }); if (user.merchantConfig?.branding?.brandColor) document.documentElement.style.setProperty('--brand-color', user.merchantConfig.branding.brandColor); setView(user.role === 'user' ? 'history' : 'dashboard'); if (redirect) setShowLanding(false); fetchTransactions(user); if (['superadmin', 'merchant', 'cs'].includes(user.role)) fetchUsers(); };
  const handleLogin = async (e: React.FormEvent) => { e.preventDefault(); setLoginError(''); setApiLoading(true); if (IS_DEMO_MODE) { let allUsers = [...users]; const savedUsers = localStorage.getItem('qios_users'); if (savedUsers) { const parsed = JSON.parse(savedUsers); allUsers = [...MOCK_USERS, ...parsed.filter((u:User) => !MOCK_USERS.find(m => m.id === u.id))]; } const foundUser = allUsers.find(u => u.username === loginUser); if (loginUser === 'admin' && loginPass === 'admin') loginSuccess(MOCK_USERS[0]); else if (foundUser && loginPass === foundUser.username) loginSuccess(foundUser); else setLoginError('Invalid (Demo: user=pass)'); setApiLoading(false); } else { try { const res = await fetch(`${API_BASE}/login.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: loginUser, password: loginPass }) }); const text = await res.text(); if (!text || text.trim() === '') throw new Error("Empty Response"); let data; try { data = JSON.parse(text); } catch (e) { throw new Error(`Invalid JSON: ${text.substring(0, 100)}...`); } if (data.success) loginSuccess(data.user); else setLoginError(data.message || 'Login failed'); } catch (err: any) { setLoginError(err.message || 'Connection Error'); } finally { setApiLoading(false); } } };
  const handleRegister = async (e: React.FormEvent) => { e.preventDefault(); setRegError(''); if (regPass !== regConfirmPass) { setRegError('Mismatch'); return; } setApiLoading(true); if (IS_DEMO_MODE) { const newUser: User = { id: Date.now().toString(), username: regUser, email: regEmail, role: 'user', isVerified: true }; const currentUsers = JSON.parse(localStorage.getItem('qios_users') || '[]'); currentUsers.push(newUser); localStorage.setItem('qios_users', JSON.stringify(currentUsers)); loginSuccess(newUser); setShowRegister(false); alert('Success (Demo)'); setApiLoading(false); } else { try { const res = await fetch(`${API_BASE}/register.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: regUser, email: regEmail, password: regPass, confirmPassword: regConfirmPass }) }); const text = await res.text(); let data; try { data = JSON.parse(text); } catch(e) { throw new Error(text.substring(0, 50)); } if (data.success) { alert('Success! ' + (data.warning || 'Please login.')); setShowRegister(false); setLoginUser(regUser); } else setRegError(data.message || 'Failed'); } catch (err: any) { setRegError(err.message || 'Error'); } finally { setApiLoading(false); } } };
  const handleUserManagementSubmit = async (e: React.FormEvent) => { e.preventDefault(); setApiLoading(true); if (!currentUser) return; const payloadConfig = userFormData.role === 'merchant' ? { merchantName: userFormData.merchantName, merchantCode: userFormData.merchantCode, qiospayApiKey: userFormData.apiKey, appSecretKey: 'QIOS_SECRET_' + Math.random().toString(36).substring(7), qrisString: userFormData.qrisString } : null; if (IS_DEMO_MODE) { alert('Saved (Demo)'); } else { try { const res = await fetch(`${API_BASE}/manage_users.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ action: editingUser ? 'update' : 'create', id: editingUser?.id, username: userFormData.username, email: userFormData.email, password: userFormData.password, role: userFormData.role, config: payloadConfig, creator_role: currentUser.role }) }); const data = await res.json(); if(data.success) { fetchUsers(); alert('Saved'); } else alert(data.message); } catch(e) { alert('Error'); } } setApiLoading(false); setUserModalOpen(false); };
  const handleLogout = () => { setCurrentUser(null); sessionStorage.removeItem('qios_user'); setShowLanding(true); setTransactions([]); };

  if (isPublicMode) {
     const brandColor = config.branding?.brandColor || '#4f46e5';
     const logo = config.branding?.logoUrl;
     if (publicData?.error) { return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full"><AlertCircle className="mx-auto text-red-500 mb-4" size={48} /><h2 className="text-xl font-bold text-gray-800">Invalid Link</h2><p className="text-gray-500 mt-2">{publicData.error}</p></div></div> }
     const isPaid = publicData?.status === 'paid';
     const isExpired = publicData?.status === 'expired' || publicData?.status === 'cancelled';
     return ( <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"><div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 text-center space-y-6 relative overflow-hidden">{isPaid && <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center animate-in fade-in"><CheckCircle2 className="text-green-500 mb-4" size={64} /><h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2><p className="text-gray-500 mt-2">Thank you for your payment.</p><p className="font-bold text-lg mt-4">{formatRupiah(publicData.amount)}</p></div>}{isExpired && <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center animate-in fade-in"><Ban className="text-red-500 mb-4" size={64} /><h2 className="text-2xl font-bold text-gray-800">Link Expired</h2><p className="text-gray-500 mt-2">This payment link is no longer active.</p></div>}<div className="flex justify-center mb-2">{logo ? <img src={logo} alt="Merchant Logo" className="h-16 w-auto object-contain" /> : <div style={{backgroundColor: brandColor}} className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"><QrCode size={32} /></div>}</div><div><h1 className="text-2xl font-bold text-gray-800">{config.merchantName || publicData?.merchant_name}</h1><p className="text-gray-500 text-sm mt-1">{publicData?.description}</p>{publicData?.expires_at && <p className="text-xs text-orange-500 font-bold mt-2 flex justify-center items-center gap-1"><Clock size={12}/> Expires: {new Date(publicData.expires_at).toLocaleString()}</p>}</div><div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative"><div className="flex justify-center">{generatedQR && <QRCodeDisplay data={generatedQR} width={220} logoUrl={logo} />}</div></div><div style={{color: brandColor}} className="text-4xl font-extrabold">{formatRupiah(Number(tempAmount))}</div></div>{config.branding?.customDomain && <p className="mt-8 text-gray-400 text-xs">Powered by {config.branding.customDomain}</p>}</div> );
  }
  
  if (showLanding && !currentUser) { return <LandingPage onLogin={() => setShowLanding(false)} onRegister={() => { setShowLanding(false); setShowRegister(true); }} />; }
  
  // LOGIN SCREEN
  if (!currentUser) { 
      if (showRegister) { return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"><div className="bg-indigo-600 p-8 text-center relative"><button onClick={()=>{setShowRegister(false);setShowLanding(true);}} className="absolute top-4 left-4 text-white/50 hover:text-white"><X size={20}/></button><h1 className="text-2xl font-bold text-white">Create Account</h1></div><div className="p-8"><form onSubmit={handleRegister} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Username</label><input type="text" required className="w-full px-4 py-2 border border-gray-200 rounded-lg" value={regUser} onChange={e=>setRegUser(e.target.value)}/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input type="email" required className="w-full px-4 py-2 border border-gray-200 rounded-lg" value={regEmail} onChange={e=>setRegEmail(e.target.value)}/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><div className="relative"><input type={showPassword ? "text" : "password"} required className="w-full px-4 py-2 border border-gray-200 rounded-lg pr-10" value={regPass} onChange={e=>setRegPass(e.target.value)}/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label><div className="relative"><input type={showConfirmPassword ? "text" : "password"} required className="w-full px-4 py-2 border border-gray-200 rounded-lg pr-10" value={regConfirmPass} onChange={e=>setRegConfirmPass(e.target.value)}/><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>{regError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{regError}</div>}<button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold">{apiLoading?<Loader2 className="animate-spin"/>:'Sign Up'}</button></form></div></div></div>; } 
      return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"><div className="bg-indigo-600 p-8 text-center relative"><button onClick={()=>setShowLanding(true)} className="absolute top-4 left-4 text-white/50 hover:text-white"><X size={20}/></button><h1 className="text-2xl font-bold text-white">Welcome Back</h1></div><div className="p-8"><form onSubmit={handleLogin} className="space-y-6"><div><label className="block text-sm font-medium text-gray-700 mb-2">Username</label><input type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-lg" value={loginUser} onChange={(e)=>setLoginUser(e.target.value)}/></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Password</label><div className="relative"><input type={showPassword ? "text" : "password"} required className="w-full px-4 py-3 border border-gray-200 rounded-lg pr-10" value={loginPass} onChange={(e)=>setLoginPass(e.target.value)}/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div></div>{loginError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center"><Lock size={16} className="mr-2"/>{loginError}</div>}<button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold">{apiLoading?<Loader2 className="animate-spin"/>:'Login'}</button><div className="text-center text-sm"><span className="text-gray-500">New here? </span><button type="button" onClick={()=>{setShowRegister(true);}} className="text-indigo-600 font-bold hover:underline">Create Account</button></div></form></div></div></div>; 
  }

  // --- DASHBOARD LAYOUT (FIXED OVERLAY SIDEBAR FOR MOBILE) ---
  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <TransactionModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} onCopyLink={(t: Transaction) => copyToClipboard(t.paymentUrl || '')} branding={config.branding} />
      
      {/* USER MODAL */}
      {isUserModalOpen && ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in"> <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"><div className="bg-indigo-600 p-4 text-white flex justify-between items-center"><h3 className="font-bold">{editingUser?'Edit User':'Add New User'}</h3><button onClick={()=>setUserModalOpen(false)}><X size={20}/></button></div><form onSubmit={handleUserManagementSubmit} className="p-6 space-y-4"><div><label className="block text-sm font-medium mb-1">Role</label><select className="w-full border p-2 rounded" value={userFormData.role} onChange={e=>setUserFormData({...userFormData,role:e.target.value as UserRole})}>{currentUser.role==='superadmin'&&<><option value="user">User</option><option value="merchant">Merchant</option><option value="cs">CS</option><option value="superadmin">Super Admin</option></>}{currentUser.role==='merchant'&&<><option value="user">User</option><option value="cs">CS</option></>}{currentUser.role==='cs'&&<option value="user">User</option>}</select></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Username</label><input type="text" required className="w-full border p-2 rounded" value={userFormData.username} onChange={e=>setUserFormData({...userFormData,username:e.target.value})}/></div><div><label className="block text-sm font-medium mb-1">Password</label><input type={editingUser?"text":"password"} required={!editingUser} className="w-full border p-2 rounded" value={userFormData.password} onChange={e=>setUserFormData({...userFormData,password:e.target.value})} placeholder={editingUser?"Blank to keep":"Password"}/></div></div><div><label className="block text-sm font-medium mb-1">Email Address</label><input type="email" className="w-full border p-2 rounded" value={userFormData.email} onChange={e=>setUserFormData({...userFormData,email:e.target.value})} placeholder="user@example.com"/></div>{(userFormData.role==='merchant'||userFormData.role==='superadmin')&&<div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3"><p className="text-xs font-bold text-gray-500 uppercase">Merchant Config</p><input type="text" className="w-full border p-2 rounded text-sm" value={userFormData.merchantName} onChange={e=>setUserFormData({...userFormData,merchantName:e.target.value})} placeholder="Merchant Name"/><textarea className="w-full border p-2 rounded text-xs" rows={2} value={userFormData.qrisString} onChange={e=>setUserFormData({...userFormData,qrisString:e.target.value})} placeholder="QRIS String"/></div>}<button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700">{apiLoading?<Loader2 className="animate-spin"/>:'Save User'}</button></form></div> </div> )}
      
      {/* MOBILE OVERLAY BACKGROUND (Closes sidebar when clicked) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><QrCode size={24} /></div>
              <div><h1 className="text-xl font-bold text-gray-800">QiosLink</h1><p className="text-xs text-gray-500">{currentUser.username}</p></div>
            </div>
            {/* CLOSE BUTTON FOR MOBILE */}
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-red-500">
                <X size={24} />
            </button>
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

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
              {/* HAMBURGER MENU BUTTON (Visible on Mobile) */}
              <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg lg:hidden text-gray-700">
                <Menu size={28} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 capitalize truncate">{view.replace('_', ' ')}</h2>
          </div>
          <div className="flex items-center gap-2">{currentUser.isVerified ? <CheckCircle2 size={16} className="text-green-500"/> : <AlertTriangle size={16} className="text-yellow-500"/>}</div>
        </header>
        
        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 pb-20">
          <VerificationBanner user={currentUser} onVerifyClick={() => { setView('settings'); setSettingsTab('account'); }} />
          
          {view === 'dashboard' && <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none"><div className="flex justify-between items-start"><div><p className="text-indigo-100 font-medium">Total Transactions</p><h3 className="text-4xl font-bold mt-2">{transactions.length}</h3></div><div className="bg-white/20 p-2 rounded-lg"><Wallet className="text-white" size={24}/></div></div></Card><Card><p className="text-gray-500 font-medium">Total Revenue (Demo)</p><h3 className="text-3xl font-bold text-gray-800 mt-2">{formatRupiah(transactions.reduce((acc, curr) => acc + (curr.status === 'paid' ? Number(curr.amount) : 0), 0))}</h3></Card><Card><p className="text-gray-500 font-medium">Pending</p><h3 className="text-3xl font-bold text-orange-600 mt-2">{transactions.filter(t => t.status === 'pending').length}</h3></Card></div><Card className="h-80"><h3 className="font-bold text-gray-700 mb-4">Transaction Volume</h3><ResponsiveContainer width="100%" height="100%"><AreaChart data={transactions.slice(0, 10).reverse()}><defs><linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e7ff" /><XAxis dataKey="createdAt" hide /><YAxis hide /><RechartsTooltip /><Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorAmt)" /></AreaChart></ResponsiveContainer></Card></div>}
          {view === 'terminal' && <div className="flex flex-col lg:flex-row gap-8"><Card className="flex-1"><h3 className="text-lg font-bold text-gray-800 mb-4">Create Payment Link</h3><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-600 mb-1">Amount (IDR)</label><div className="relative"><span className="absolute left-3 top-3 text-gray-400 font-bold">Rp</span><input type="number" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800" placeholder="0" value={tempAmount} onChange={(e) => setTempAmount(e.target.value)} /></div></div><div><label className="block text-sm font-medium text-gray-600 mb-1">Description (Optional)</label><input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" value={tempDesc} onChange={e=>setTempDesc(e.target.value)} placeholder="e.g. Order #123" /></div><div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3"><p className="text-xs font-bold text-gray-500 uppercase">Advanced Options</p><div><label className="block text-sm font-medium text-gray-600 mb-1">Expiry Time (Minutes)</label><input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white" value={expiryMinutes} onChange={e=>setExpiryMinutes(e.target.value)} placeholder="e.g. 60 (Leave empty for no expiry)" /></div><div className="flex items-center gap-2"><input type="checkbox" id="singleUse" checked={singleUse} onChange={e=>setSingleUse(e.target.checked)} className="h-4 w-4 text-indigo-600 rounded" /><label htmlFor="singleUse" className="text-sm text-gray-700">One-time Use (Link expires after payment)</label></div></div><button onClick={handleGenerateQR} disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2">{apiLoading ? <Loader2 className="animate-spin" size={24}/> : <><QrCode size={20} /><span>Generate Payment Link</span></>}</button></div></Card><Card className="flex-1 flex flex-col items-center justify-center bg-gray-50 border-dashed border-2 border-gray-200">{generatedQR ? <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300 w-full"><div className="flex justify-center"><QRCodeDisplay data={generatedQR} width={200} logoUrl={config.branding?.logoUrl} /></div><div><h2 className="text-3xl font-extrabold text-indigo-900">{formatRupiah(Number(tempAmount))}</h2><p className="text-sm text-gray-500 mt-1">{tempDesc}</p></div>{generatedLink && <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-2 text-left"><div className="flex-1 truncate text-xs text-gray-500 font-mono">{generatedLink}</div><button onClick={() => copyToClipboard(generatedLink)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded"><Copy size={16}/></button><a href={generatedLink} target="_blank" className="text-gray-500 hover:bg-gray-50 p-2 rounded"><ExternalLink size={16}/></a></div>}</div> : <div className="text-center text-gray-400 py-12"><QrCode size={48} className="mx-auto mb-4 opacity-50" /><p>Generate to create QR & Link</p></div>}</Card></div>}
          
          {/* ... SETTINGS TAB (Keep existing content, just ensuring it fits) ... */}
          {view === 'settings' && (
             <div className="max-w-4xl mx-auto w-full">
                 <div className="flex space-x-4 mb-6 border-b border-gray-200 overflow-x-auto pb-2">
                     <button onClick={() => setSettingsTab('config')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'config' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Merchant Config</button>
                     <button onClick={() => setSettingsTab('account')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'account' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Account</button>
                     {['merchant', 'superadmin'].includes(currentUser.role) && (
                        <>
                           <button onClick={() => setSettingsTab('branding')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'branding' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Branding</button>
                           <button onClick={() => setSettingsTab('smtp')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'smtp' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>SMTP</button>
                        </>
                     )}
                 </div>
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
                 {settingsTab === 'account' && (
                     <div className="space-y-6">
                         <Card>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield size={20}/> Email Verification</h3>
                            <div className="flex items-center gap-4 mb-4"><div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${currentUser.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{currentUser.isVerified ? 'Verified' : 'Not Verified'}</div>{!currentUser.isVerified && <span className="text-sm text-gray-500">Please verify to unlock full features.</span>}</div>
                            {!currentUser.isVerified && ( <div className="max-w-md space-y-3"><label className="block text-sm font-medium mb-1">Enter Verification Code (OTP)</label><div className="flex gap-2"><input type="text" className="border p-2 rounded flex-1 tracking-widest text-center text-lg" placeholder="123456" maxLength={6} value={otpCode} onChange={e => setOtpCode(e.target.value)} /><button onClick={handleVerifyEmail} disabled={apiLoading || otpCode.length < 4} className="bg-green-600 text-white px-4 rounded font-bold hover:bg-green-700">{apiLoading ? <Loader2 className="animate-spin"/> : 'Verify'}</button></div><div className="text-sm text-gray-500">Didn't get the code? <button onClick={handleResendOtp} disabled={apiLoading} className="text-indigo-600 font-bold hover:underline">Resend OTP</button></div><p className="text-xs text-red-400 mt-2">Problem? Contact support: {currentUser.supportEmail || 'admin@qioslink.com'}</p></div> )}
                         </Card>
                         <Card>
                             <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><UserIcon size={20}/> Edit Profile</h3>
                             <div className="space-y-4 max-w-lg">
                                 <div><label className="block text-sm font-medium mb-1">Username</label><input type="text" className="w-full border p-2 rounded bg-gray-50" value={accountForm.username} onChange={e => setAccountForm({...accountForm, username: e.target.value})} /></div>
                                 <div><label className="block text-sm font-medium mb-1">Email Address</label><input type="email" className="w-full border p-2 rounded" value={accountForm.email} onChange={e => setAccountForm({...accountForm, email: e.target.value})} /></div>
                                 <div className="pt-4 border-t border-gray-100"><h4 className="font-bold text-gray-800 mb-4">Change Password</h4><div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Current Password</label><div className="relative"><input type={showCurrentPass ? "text" : "password"} className="w-full border p-2 rounded pr-10" value={accountForm.password} onChange={e => setAccountForm({...accountForm, password: e.target.value})} placeholder="Leave blank to keep current" /><button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">{showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div><div><label className="block text-sm font-medium mb-1">New Password</label><div className="relative"><input type={showNewPass ? "text" : "password"} className="w-full border p-2 rounded pr-10" value={accountForm.newPassword} onChange={e => setAccountForm({...accountForm, newPassword: e.target.value})} /><button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">{showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div><div><label className="block text-sm font-medium mb-1">Confirm New Password</label><div className="relative"><input type={showConfirmNewPass ? "text" : "password"} className="w-full border p-2 rounded pr-10" value={accountForm.confirmNewPassword} onChange={e => setAccountForm({...accountForm, confirmNewPassword: e.target.value})} /><button type="button" onClick={() => setShowConfirmNewPass(!showConfirmNewPass)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">{showConfirmNewPass ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{accountForm.newPassword && accountForm.newPassword !== accountForm.confirmNewPassword && ( <p className="text-xs text-red-500 mt-1">Passwords do not match</p> )}</div></div></div>
                                 <button onClick={handleUpdateAccount} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700">Update Profile</button>
                             </div>
                         </Card>
                     </div>
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
                                   <p className="text-xs text-gray-400 mt-1">Common ports: <strong>587</strong> (TLS), <strong>465</strong> (SSL), 25 (None)</p>
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
             </div>
          )}
          {view === 'history' && <Card><div className="flex justify-between items-center mb-6"><div className="relative max-w-sm w-full"><Search className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder="Search ID or Amount..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div><button onClick={() => fetchTransactions(currentUser!)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><ArrowRight size={18} className="rotate-90" /></button></div><div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="border-b border-gray-100 text-gray-500 text-sm"><th className="py-4 font-medium">Transaction ID</th><th className="py-4 font-medium">Date</th><th className="py-4 font-medium">Amount</th><th className="py-4 font-medium">Status</th><th className="py-4 font-medium text-right">Action</th></tr></thead><tbody className="text-sm">{transactions.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-gray-400">No transactions found</td></tr> : transactions.filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase())).map((t) => (<tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"><td className="py-4 font-medium text-gray-800">{t.id}</td><td className="py-4 text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td><td className="py-4 font-bold text-gray-800">{formatRupiah(Number(t.amount))}</td><td className="py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${t.status === 'paid' ? 'bg-green-100 text-green-700' : t.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{t.status}</span></td><td className="py-4 text-right"><button onClick={() => setSelectedTransaction(t)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors"><Eye size={18} /></button></td></tr>))}</tbody></table></div></Card>}
          {view === 'users' && ['superadmin', 'merchant', 'cs'].includes(currentUser.role) && <Card><div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg">User Management</h3><button onClick={() => { setEditingUser(null); setUserFormData({username:'', email:'', password:'', role: currentUser.role === 'cs' ? 'user' : 'user', merchantName:'', merchantCode:'', apiKey:'', qrisString:''}); setUserModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"><Plus size={18} /><span>Add User</span></button></div><table className="w-full text-left"><thead className="bg-gray-50"><tr><th className="px-4 py-3">Username</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{users.map(u => (<tr key={u.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium">{u.username}</td><td className="px-4 py-3 text-gray-500 text-sm">{u.email || '-'}</td><td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 text-xs rounded-full uppercase font-bold">{u.role}</span></td><td className="px-4 py-3">{u.isVerified?<span className="text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Verified</span>:<span className="text-yellow-600 text-xs font-bold flex items-center gap-1"><AlertTriangle size={12}/> Pending</span>}</td><td className="px-4 py-3">{(currentUser.role === 'superadmin' || (currentUser.role === 'merchant' && ['cs','user'].includes(u.role))) && (<div className="flex space-x-2">{!u.isVerified && <button onClick={() => handleManualVerifyUser(u.id)} title="Verify Manually" className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><Check size={16} /></button>}<button onClick={() => { setEditingUser(u); setUserFormData({...userFormData, username: u.username, email: u.email || '', role: u.role}); setUserModalOpen(true); }} className="text-indigo-600"><Pencil size={18} /></button></div>)}</td></tr>))}</tbody></table></Card>}
          {view === 'links' && <Card><div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg">Active Payment Links</h3><button onClick={()=>fetchTransactions(currentUser!)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"><RefreshCw size={18}/></button></div><div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="border-b border-gray-100 text-gray-500 text-sm"><th className="py-4 font-medium">Created At</th><th className="py-4 font-medium">Amount</th><th className="py-4 font-medium">Description</th><th className="py-4 font-medium">Link</th><th className="py-4 font-medium">Status</th><th className="py-4 font-medium text-right">Action</th></tr></thead><tbody className="text-sm">{transactions.filter(t => t.paymentUrl).map((t) => (<tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"><td className="py-4 text-gray-500">{new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString()}</td><td className="py-4 font-bold text-gray-800">{formatRupiah(Number(t.amount))}</td><td className="py-4 text-gray-600 max-w-[150px] truncate">{t.description}</td><td className="py-4"><button onClick={() => copyToClipboard(t.paymentUrl || '')} className="flex items-center gap-1 text-indigo-600 hover:underline text-xs"><LinkIcon size={12}/> Copy Link</button></td><td className="py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${t.status === 'paid' ? 'bg-green-100 text-green-700' : t.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>{t.status}</span></td><td className="py-4 text-right flex justify-end gap-2">{t.status === 'pending' && <button onClick={() => handleRevokeLink(t)} title="Revoke/Cancel Link" className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Ban size={18} /></button>}<button onClick={() => { setGeneratedQR(t.qrString); setGeneratedLink(t.paymentUrl || ''); setTempAmount(t.amount.toString()); setTempDesc(t.description); setView('terminal'); }} title="View QR" className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg"><Eye size={18} /></button></td></tr>))}</tbody></table></div></Card>}
          {view === 'integration' && <Card><h3 className="text-xl font-bold mb-4">Integration API</h3><p className="text-gray-500 mb-6">Use these endpoints to integrate QiosLink with your custom application.</p><div className="bg-gray-900 rounded-xl p-6 text-gray-300 font-mono text-sm overflow-x-auto"><p className="text-green-400">// Create Dynamic Payment (With Options)</p><p>POST {window.location.origin}/api/create_payment.php</p><p className="mb-4">Content-Type: application/json</p><pre>{`{\n  "merchant_id": "${currentUser.id}",\n  "api_key": "${config.appSecretKey || 'YOUR_APP_SECRET_KEY'}",\n  "amount": 10000,\n  "description": "Invoice #123",\n  "expiry_minutes": 60, // Optional: Expire in 60 mins\n  "single_use": true,   // Optional: Link becomes invalid after payment\n  "callback_url": "https://your-site.com/webhook"\n}`}</pre></div></Card>}
        </div>
      </main>
    </div>
  );
}
