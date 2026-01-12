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
  Check
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
import { MerchantConfig, ViewState, Transaction, User, UserRole } from './types';
import { generateDynamicQR, formatRupiah } from './utils/qrisUtils';
import { QRCodeDisplay } from './components/QRCodeDisplay';

// --- CONFIGURATION ---
const APP_VERSION = "3.0.0 (Landing & Registration)";

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

// --- LANDING PAGE COMPONENT ---
const LandingPage = ({ onLogin, onRegister }: { onLogin: () => void, onRegister: () => void }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <QrCode size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">QiosLink</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
              <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
              <a href="#integration" className="hover:text-indigo-600 transition-colors">Integration</a>
              <a href="#benefits" className="hover:text-indigo-600 transition-colors">Benefits</a>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onLogin} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                Log In
              </button>
              <button onClick={onRegister} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-lg shadow-indigo-500/30">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-6 border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap size={12} fill="currentColor" /> v3.0 Now Available
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Accept Payments <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Without Limits.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Transform your static QRIS into a dynamic payment engine. Integrate with WHMCS, WooCommerce, and custom apps in seconds. No more manual verification.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <button onClick={onRegister} className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2">
              Start for Free <ArrowRight size={18} />
            </button>
            <button onClick={onLogin} className="w-full sm:w-auto px-8 py-4 text-base font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-all flex items-center justify-center gap-2">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Smartphone className="text-indigo-600" size={24} />,
                title: "Dynamic QRIS",
                desc: "Convert static QRIS codes into dynamic amounts automatically. Reduce payment errors to zero."
              },
              {
                icon: <Globe className="text-blue-600" size={24} />,
                title: "Web Hooks",
                desc: "Real-time callbacks to your applications. Works with any platform that accepts JSON webhooks."
              },
              {
                icon: <BarChart3 className="text-purple-600" size={24} />,
                title: "Instant Analytics",
                desc: "Monitor your revenue streams with beautiful, real-time dashboards and transaction history."
              }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credits / Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <QrCode size={18} />
             </div>
             <span className="font-bold text-gray-900">QiosLink</span>
          </div>
          <p className="text-sm text-gray-500">
            Open Source Project by <a href="https://github.com/nabhan-rp" target="_blank" className="text-indigo-600 hover:underline font-medium">Nabhan Rizqi</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

// --- COMPONENTS ---
// Re-using Sidebar, Card, etc. from original code but refined
const SidebarItem = ({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}`}>
    <div className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`}>{icon}</div>
    <span className="font-medium">{label}</span>
  </button>
);

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>{children}</div>
);

const TransactionModal = ({ transaction, onClose, onCopyLink }: any) => {
  if (!transaction) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><X size={20} className="text-gray-600" /></button>
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h3 className="font-bold text-lg">Transaction Details</h3>
          <p className="text-indigo-200 text-sm">{transaction.id}</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center">
             <div className="mb-4 transform scale-90"><QRCodeDisplay data={transaction.qrString} width={200} /></div>
             <div className="text-2xl font-bold text-gray-800">{formatRupiah(transaction.amount)}</div>
             <div className={`px-3 py-1 rounded-full text-xs font-medium mt-2 ${transaction.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{transaction.status.toUpperCase()}</div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => onCopyLink(transaction)} className="flex-1 flex items-center justify-center space-x-2 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition-colors"><LinkIcon size={18} /><span>Copy Link</span></button>
            <button onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(transaction.qrString)}`, '_blank')} className="flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"><Download size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DATA MOCK ---
const DEFAULT_MERCHANT_CONFIG: MerchantConfig = {
  merchantName: "Narpra Digital",
  merchantCode: "QP040887",
  apiKey: "**********",
  qrisString: "00020101021126670016COM.NOBUBANK.WWW01189360050300000907180214905487390387780303UMI51440014ID.CO.QRIS.WWW0215ID20254619920700303UMI5204581753033605802ID5914Narpra Digital6009INDRAMAYU61054521162070703A016304D424",
  callbackUrl: "https://your-domain.com/callback.php"
};

const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', role: 'superadmin', merchantConfig: DEFAULT_MERCHANT_CONFIG },
  { id: '2', username: 'merchant', role: 'merchant', merchantConfig: { ...DEFAULT_MERCHANT_CONFIG, merchantName: "Warung Demo" } }
];

// --- MAIN APP ---

export default function App() {
  // Navigation State
  const [showLanding, setShowLanding] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  
  // App State
  const [view, setView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [integrationTab, setIntegrationTab] = useState<'php' | 'node' | 'whmcs' | 'woo' | 'shopify'>('php');
  
  // Data State
  const [config, setConfig] = useState<MerchantConfig>(DEFAULT_MERCHANT_CONFIG);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  // UI Inputs
  const [tempAmount, setTempAmount] = useState<string>('');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [amountError, setAmountError] = useState('');
  
  // User Management
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
    role: 'user' as UserRole, // Default
    merchantName: '',
    merchantCode: '',
    apiKey: '',
    qrisString: ''
  });
  
  // Login/Register Forms
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regError, setRegError] = useState('');

  // Public Link Mode
  const [isPublicMode, setIsPublicMode] = useState(false);
  const [publicData, setPublicData] = useState<{amount: number, note: string} | null>(null);

  // --- INIT ---
  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    setAuthLoading(true);

    const params = new URLSearchParams(window.location.search);
    if (params.get('amount')) {
      setIsPublicMode(true);
      setShowLanding(false);
      const amount = parseInt(params.get('amount')!, 10);
      setGeneratedQR(generateDynamicQR(DEFAULT_MERCHANT_CONFIG.qrisString, amount));
      setTempAmount(amount.toString());
      setPublicData({ amount, note: params.get('note') || 'Payment' });
      setAuthLoading(false);
      return; 
    }

    const sessionUser = sessionStorage.getItem('qios_user');
    if (sessionUser) {
      const user = JSON.parse(sessionUser);
      loginSuccess(user, false); // Don't redirect, just set state
      setShowLanding(false);
    }

    setAuthLoading(false);
  };

  // --- API / ACTIONS ---
  const fetchTransactions = async (user: User) => {
    if (IS_DEMO_MODE) {
      const savedTx = localStorage.getItem('qios_transactions');
      if (savedTx) setTransactions(JSON.parse(savedTx));
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/get_data.php?user_id=${user.id}&role=${user.role}`);
      const data = await res.json();
      if (data.success && data.transactions) setTransactions(data.transactions);
    } catch (e) { console.error(e); }
  };

  const fetchUsers = async () => {
    if (IS_DEMO_MODE) {
      const savedUsers = localStorage.getItem('qios_users');
      if (savedUsers) setUsers(JSON.parse(savedUsers));
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/manage_users.php?action=list`);
      const data = await res.json();
      if (data.success && data.users) setUsers(data.users);
    } catch (e) { console.error(e); }
  };

  const loginSuccess = (user: User, redirect = true) => {
    setCurrentUser(user);
    sessionStorage.setItem('qios_user', JSON.stringify(user));
    if (user.merchantConfig) setConfig(user.merchantConfig);
    
    // Redirect logic
    if (user.role === 'user') setView('history'); // Users go to history
    else setView('dashboard');

    if (redirect) setShowLanding(false);

    fetchTransactions(user);
    if (['superadmin', 'merchant', 'cs'].includes(user.role)) fetchUsers();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setApiLoading(true);

    if (IS_DEMO_MODE) {
      // Mock Login logic
      let allUsers = [...users];
      const savedUsers = localStorage.getItem('qios_users');
      if (savedUsers) allUsers = [...allUsers, ...JSON.parse(savedUsers)];

      const foundUser = allUsers.find(u => u.username === loginUser);
      if (foundUser && loginPass === foundUser.username) {
         loginSuccess(foundUser);
      } else {
         setLoginError('Invalid username or password (Demo: use same pass as username)');
      }
      setApiLoading(false);
    } else {
      try {
        const res = await fetch(`${API_BASE}/login.php`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ username: loginUser, password: loginPass })
        });
        const data = await res.json();
        if (data.success) loginSuccess(data.user);
        else setLoginError(data.message || 'Login failed');
      } catch (err: any) {
        setLoginError('Connection Error');
      } finally {
        setApiLoading(false);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setApiLoading(true);

    if (IS_DEMO_MODE) {
      // Demo Register
      const newUser: User = { id: Date.now().toString(), username: regUser, role: 'user' };
      const currentUsers = JSON.parse(localStorage.getItem('qios_users') || '[]');
      currentUsers.push(newUser);
      localStorage.setItem('qios_users', JSON.stringify(currentUsers));
      
      // Auto login
      loginSuccess(newUser);
      setShowRegister(false);
      alert('Registration Successful (Demo Mode)');
      setApiLoading(false);
    } else {
      try {
        const res = await fetch(`${API_BASE}/register.php`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ username: regUser, password: regPass })
        });
        const data = await res.json();
        if (data.success) {
          alert('Registration successful! Please login.');
          setShowRegister(false);
          setLoginUser(regUser); // Prefill login
        } else {
          setRegError(data.message || 'Registration failed');
        }
      } catch (err) {
        setRegError('Connection Error');
      } finally {
        setApiLoading(false);
      }
    }
  };

  const handleUserManagementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);

    // Permission Check logic handled in UI render, here just verify
    if (!currentUser) return;

    // Payload construction
    const payloadConfig = userFormData.role === 'merchant' ? {
       merchantName: userFormData.merchantName,
       merchantCode: userFormData.merchantCode,
       apiKey: userFormData.apiKey,
       qrisString: userFormData.qrisString
    } : null;

    if (IS_DEMO_MODE) {
       let updatedUsers = [...users];
       if (editingUser) {
         updatedUsers = updatedUsers.map(u => u.id === editingUser.id ? { ...u, username: userFormData.username, role: userFormData.role, merchantConfig: payloadConfig || undefined } : u);
       } else {
         updatedUsers.push({ id: Date.now().toString(), username: userFormData.username, role: userFormData.role, merchantConfig: payloadConfig || undefined });
       }
       setUsers(updatedUsers);
       localStorage.setItem('qios_users', JSON.stringify(updatedUsers));
       alert('Saved (Demo)');
    } else {
       // Production API call to manage_users.php
       try {
        const res = await fetch(`${API_BASE}/manage_users.php`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
             action: editingUser ? 'update' : 'create',
             id: editingUser?.id,
             username: userFormData.username,
             password: userFormData.password,
             role: userFormData.role,
             config: payloadConfig,
             creator_role: currentUser.role // Send creator role for validation backend
          })
        });
        const data = await res.json();
        if(data.success) { fetchUsers(); alert('Saved'); } else alert(data.message);
       } catch(e) { alert('Error'); }
    }
    setApiLoading(false);
    setUserModalOpen(false);
  };

  // --- VIEW LOGIC ---
  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('qios_user');
    setShowLanding(true);
    setTransactions([]);
  };

  // --- RENDER ---

  // 1. PUBLIC PAYMENT (Highest Priority)
  if (isPublicMode && generatedQR) {
     // ... (Existing Code for Public Page) ...
     return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
         <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 text-center space-y-6">
          <div className="flex justify-center mb-2">
             <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <QrCode size={32} />
             </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{config.merchantName}</h1>
            <p className="text-gray-500 text-sm mt-1">{publicData?.note}</p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 relative">
             <div className="flex justify-center">
                <QRCodeDisplay data={generatedQR} width={220} />
             </div>
          </div>
          <div className="text-4xl font-extrabold text-indigo-900">{formatRupiah(Number(tempAmount))}</div>
        </div>
      </div>
    );
  }

  // 2. LANDING PAGE
  if (showLanding && !currentUser) {
    return <LandingPage onLogin={() => setShowLanding(false)} onRegister={() => { setShowLanding(false); setShowRegister(true); }} />;
  }

  // 3. AUTH PAGES (Login / Register)
  if (!currentUser) {
    if (showRegister) {
      // REGISTER VIEW
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-indigo-600 p-8 text-center relative">
               <button onClick={() => {setShowRegister(false); setShowLanding(true);}} className="absolute top-4 left-4 text-white/50 hover:text-white"><X size={20}/></button>
               <h1 className="text-2xl font-bold text-white">Create Account</h1>
               <p className="text-indigo-200 mt-2">Join QiosLink Today</p>
            </div>
            <div className="p-8">
               <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-lg" value={regUser} onChange={e=>setRegUser(e.target.value)} placeholder="Choose a username" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="password" required className="w-full px-4 py-3 border border-gray-200 rounded-lg" value={regPass} onChange={e=>setRegPass(e.target.value)} placeholder="Choose a password" />
                  </div>
                  {regError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{regError}</div>}
                  <button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold">{apiLoading ? <Loader2 className="animate-spin"/> : 'Sign Up'}</button>
                  <div className="text-center text-sm">
                     <span className="text-gray-500">Already have an account? </span>
                     <button type="button" onClick={() => setShowRegister(false)} className="text-indigo-600 font-bold hover:underline">Login</button>
                  </div>
               </form>
            </div>
          </div>
        </div>
      );
    }
    
    // LOGIN VIEW
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-indigo-600 p-8 text-center relative">
             <button onClick={() => setShowLanding(true)} className="absolute top-4 left-4 text-white/50 hover:text-white"><X size={20}/></button>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-indigo-200 mt-2">Sign in to your dashboard</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-lg" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="password" required className="w-full px-4 py-3 border border-gray-200 rounded-lg" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} />
              </div>
              {loginError && (<div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center"><Lock size={16} className="mr-2" /> {loginError}</div>)}
              <button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold">{apiLoading ? <Loader2 className="animate-spin" /> : 'Login'}</button>
              <div className="text-center text-sm">
                  <span className="text-gray-500">New here? </span>
                  <button type="button" onClick={() => {setShowRegister(true);}} className="text-indigo-600 font-bold hover:underline">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 4. MAIN APP (Dashboard)
  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      
      {/* Transaction Modal */}
      <TransactionModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} onCopyLink={(t: Transaction) => {/* logic */}} />

      {/* User Management Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
             <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button onClick={() => setUserModalOpen(false)}><X size={20}/></button>
             </div>
             <form onSubmit={handleUserManagementSubmit} className="p-6 space-y-4">
                {/* ROLE SELECTION LOGIC BASED ON HIERARCHY */}
                <div>
                   <label className="block text-sm font-medium mb-1">Role</label>
                   <select className="w-full border p-2 rounded" value={userFormData.role} onChange={e=>setUserFormData({...userFormData, role: e.target.value as UserRole})}>
                      {/* Superadmin can see everything */}
                      {currentUser.role === 'superadmin' && (
                        <>
                          <option value="user">User</option>
                          <option value="merchant">Merchant</option>
                          <option value="cs">CS</option>
                          <option value="superadmin">Super Admin</option>
                        </>
                      )}
                      {/* Merchant can add CS or User */}
                      {currentUser.role === 'merchant' && (
                        <>
                          <option value="user">User (Customer)</option>
                          <option value="cs">CS (Staff)</option>
                        </>
                      )}
                      {/* CS can only add User */}
                      {currentUser.role === 'cs' && (
                        <option value="user">User (Customer)</option>
                      )}
                   </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium mb-1">Username</label>
                      <input type="text" required className="w-full border p-2 rounded" value={userFormData.username} onChange={e=>setUserFormData({...userFormData, username: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <input type={editingUser ? "text" : "password"} required={!editingUser} className="w-full border p-2 rounded" value={userFormData.password} onChange={e=>setUserFormData({...userFormData, password: e.target.value})} placeholder={editingUser ? "Blank to keep" : "Password"} />
                   </div>
                </div>

                {/* Only show Merchant Config inputs if creating a Merchant or Superadmin */}
                {(userFormData.role === 'merchant' || userFormData.role === 'superadmin') && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                     <p className="text-xs font-bold text-gray-500 uppercase">Merchant Config</p>
                     <input type="text" className="w-full border p-2 rounded text-sm" value={userFormData.merchantName} onChange={e=>setUserFormData({...userFormData, merchantName: e.target.value})} placeholder="Merchant Name" />
                     <div className="grid grid-cols-2 gap-2">
                       <input type="text" className="w-full border p-2 rounded text-sm" value={userFormData.merchantCode} onChange={e=>setUserFormData({...userFormData, merchantCode: e.target.value})} placeholder="Merchant ID" />
                       <input type="text" className="w-full border p-2 rounded text-sm" value={userFormData.apiKey} onChange={e=>setUserFormData({...userFormData, apiKey: e.target.value})} placeholder="API Key" />
                     </div>
                     <textarea className="w-full border p-2 rounded text-xs" rows={2} value={userFormData.qrisString} onChange={e=>setUserFormData({...userFormData, qrisString: e.target.value})} placeholder="QRIS String" />
                  </div>
                )}
                <button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700">{apiLoading ? <Loader2 className="animate-spin"/> : 'Save User'}</button>
             </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 xl:w-72'}`}>
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center px-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><QrCode size={24} /></div>
              <div className="lg:hidden xl:block"><h1 className="text-xl font-bold text-gray-800">QiosLink</h1><p className="text-xs text-gray-500">{currentUser.username} ({currentUser.role})</p></div>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
             {/* General Access */}
             <SidebarItem active={view === 'dashboard'} icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setView('dashboard')} />
             <SidebarItem active={view === 'history'} icon={<History size={20} />} label={currentUser.role === 'user' ? "My History" : "Transactions"} onClick={() => setView('history')} />
             
             {/* Merchant/Admin Only */}
             {['superadmin', 'merchant'].includes(currentUser.role) && <SidebarItem active={view === 'terminal'} icon={<Smartphone size={20} />} label="Terminal" onClick={() => setView('terminal')} />}
             
             {/* User Management (Available to Merchant too now) */}
             {['superadmin', 'merchant', 'cs'].includes(currentUser.role) && <SidebarItem active={view === 'users'} icon={<Users size={20} />} label="Users" onClick={() => setView('users')} />}
             
             {currentUser.role === 'superadmin' && <SidebarItem active={view === 'integration'} icon={<Code2 size={20} />} label="Integration" onClick={() => setView('integration')} />}
             
             {['superadmin', 'merchant'].includes(currentUser.role) && <SidebarItem active={view === 'settings'} icon={<Settings size={20} />} label="Settings" onClick={() => setView('settings')} />}
          </nav>
          <div className="p-4 border-t border-gray-100">
             <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg"><LogOut size={20} /><span className="lg:hidden xl:inline font-medium">Logout</span></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"><Menu size={24} /></button>
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{view.replace('_', ' ')}</h2>
          {currentUser.role === 'user' && (
             <button className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold hover:bg-indigo-200" onClick={()=>window.open('https://wa.me/62812345678?text=Upgrade+Merchant', '_blank')}>Upgrade to Merchant</button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          {view === 'dashboard' && (
             <div className="space-y-6">
               <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
                  <div className="text-3xl font-bold mb-2">Welcome, {currentUser.username}!</div>
                  <p className="text-indigo-100">Role: {currentUser.role.toUpperCase()}</p>
               </Card>
             </div>
          )}

          {view === 'users' && ['superadmin', 'merchant', 'cs'].includes(currentUser.role) && (
            <Card>
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg">User Management</h3>
                 <button onClick={() => { setEditingUser(null); setUserFormData({username:'', password:'', role: currentUser.role === 'cs' ? 'user' : 'user', merchantName:'', merchantCode:'', apiKey:'', qrisString:''}); setUserModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"><Plus size={18} /><span>Add {currentUser.role === 'merchant' ? 'Staff/User' : 'User'}</span></button>
              </div>
              <table className="w-full text-left">
                 <thead className="bg-gray-50"><tr><th className="px-4 py-3">Username</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Actions</th></tr></thead>
                 <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                         <td className="px-4 py-3 font-medium">{u.username}</td>
                         <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 text-xs rounded-full uppercase font-bold">{u.role}</span></td>
                         <td className="px-4 py-3">
                           {/* Logic: Superadmin edits all. Merchant edits CS/User. CS edits none (only adds). */}
                           {(currentUser.role === 'superadmin' || (currentUser.role === 'merchant' && ['cs','user'].includes(u.role))) && (
                             <div className="flex space-x-2">
                               <button onClick={() => { setEditingUser(u); setUserFormData({...userFormData, username: u.username, role: u.role}); setUserModalOpen(true); }} className="text-indigo-600"><Pencil size={18} /></button>
                               <button onClick={() => {/* delete logic */}} className="text-red-600"><Trash2 size={18} /></button>
                             </div>
                           )}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
            </Card>
          )}

          {/* Placeholder for other views to avoid compilation errors */}
          {view === 'history' && <Card><h3>Transaction History</h3><p className="text-gray-500">List of transactions...</p></Card>}
          {view === 'terminal' && <Card><h3>Payment Terminal</h3><p className="text-gray-500">QR Generator...</p></Card>}
          {view === 'settings' && <Card><h3>Settings</h3><p className="text-gray-500">Configuration...</p></Card>}
          {view === 'integration' && <Card><h3>Integration</h3><p className="text-gray-500">API Docs...</p></Card>}
        </div>
      </main>
    </div>
  );
}