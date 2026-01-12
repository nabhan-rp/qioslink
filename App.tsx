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
  Check,
  User as UserIcon,
  Palette,
  CreditCard,
  Mail,
  Send,
  Github
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
const APP_VERSION = "3.5.0 (Open Source Edition)";

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
      <nav aria-label="Main Navigation" className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <QrCode size={20} aria-hidden="true" />
              </div>
              <span className="font-bold text-xl tracking-tight">QiosLink</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
              <a href="#features" className="hover:text-indigo-600 transition-colors" title="View Key Features">Features</a>
              <a href="#integration" className="hover:text-indigo-600 transition-colors" title="Integration Guides">Integration</a>
              <a href="https://github.com/nabhan-rp/qioslink" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                <Github size={16} /> Open Source
              </a>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onLogin} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors" aria-label="Login to Dashboard">
                Log In
              </button>
              <button onClick={onRegister} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-lg shadow-indigo-500/30" aria-label="Register New Account">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative pt-32 pb-20 overflow-hidden" aria-labelledby="hero-heading">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-6 border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Github size={12} fill="currentColor" /> 100% Free & Open Source
            </div>
            {/* Primary Heading for SEO */}
            <h1 id="hero-heading" className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Dynamic QRIS Engine. <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Self-Hosted & White Label.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Convert Nobu/Qiospay static QRIS into a dynamic payment gateway. Install on your own server (cPanel/VPS), use your own domain, and control your data.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <button onClick={onRegister} className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2">
                Install Now <ArrowRight size={18} />
              </button>
              <a href="https://github.com/nabhan-rp/qioslink" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 text-base font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-all flex items-center justify-center gap-2">
                <Github size={20} /> View on GitHub
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-400">
                Compatible with WHMCS, WooCommerce, and Custom PHP Apps.
            </p>
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
                  desc: "Host it on your own server (cPanel, XAMPP, VPS). No monthly subscription fees to 3rd party SaaS."
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
            Open Source Project by <a href="https://github.com/nabhan-rp" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">Nabhan Rafli</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

// --- COMPONENTS ---
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

// --- DATA MOCK ---
const DEFAULT_MERCHANT_CONFIG: MerchantConfig = {
  merchantName: "Narpra Digital",
  merchantCode: "QP040887",
  apiKey: "",
  qrisString: "00020101021126670016COM.NOBUBANK.WWW01189360050300000907180214905487390387780303UMI51440014ID.CO.QRIS.WWW0215ID20254619920700303UMI5204581753033605802ID5914Narpra Digital6009INDRAMAYU61054521162070703A016304D424",
  callbackUrl: "https://your-domain.com/callback.php",
  branding: {
    brandColor: '#4f46e5',
    customDomain: ''
  },
  smtp: {
      host: 'smtp.gmail.com',
      port: '587',
      user: 'your-email@gmail.com',
      pass: 'app-password',
      secure: 'tls',
      fromName: 'QiosLink Notification',
      fromEmail: 'no-reply@qioslink.com',
      enableNotifications: false
  }
};

const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', email:'admin@example.com', role: 'superadmin', merchantConfig: DEFAULT_MERCHANT_CONFIG },
  { id: '2', username: 'merchant', email:'merchant@store.com', role: 'merchant', merchantConfig: { ...DEFAULT_MERCHANT_CONFIG, merchantName: "Warung Demo" } }
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
  const [settingsTab, setSettingsTab] = useState<'config' | 'account' | 'branding' | 'smtp'>('config');
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
  
  // Account Settings Form
  const [accountForm, setAccountForm] = useState({
      username: '',
      email: '',
      password: '',
      newPassword: ''
  });

  // User Management Modal
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
    role: 'user' as UserRole,
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
  
  // Whitelabel Detected State
  const [detectedBranding, setDetectedBranding] = useState<any>(null);

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
      loginSuccess(user, false); 
      setShowLanding(false);
    }

    setAuthLoading(false);
  };

  // --- ACTIONS ---

  const handleUpdateConfig = async () => {
      setApiLoading(true);
      if (currentUser) {
          const updatedUser = { ...currentUser, merchantConfig: config };
          
          if (IS_DEMO_MODE) {
              setCurrentUser(updatedUser);
              sessionStorage.setItem('qios_user', JSON.stringify(updatedUser));
              alert('Configuration Saved (Demo)');
          } else {
              try {
                  const res = await fetch(`${API_BASE}/update_config.php`, {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({
                          user_id: currentUser.id,
                          config: config
                      })
                  });
                  const data = await res.json();
                  if (data.success) {
                      setCurrentUser(updatedUser);
                      sessionStorage.setItem('qios_user', JSON.stringify(updatedUser));
                      alert('Configuration Saved to Database');
                  } else {
                      alert('Failed to save: ' + (data.message || 'Unknown error'));
                  }
              } catch (e) {
                  alert('Connection Error while saving config');
              }
          }
      }
      setApiLoading(false);
  };

  const handleTestEmail = async () => {
     if (!config.smtp) return alert("Please configure SMTP settings first");
     setApiLoading(true);
     if (IS_DEMO_MODE) {
         setTimeout(() => {
             alert(`[DEMO] Test Email Sent to ${config.smtp?.fromEmail} using ${config.smtp?.host}`);
             setApiLoading(false);
         }, 1500);
     } else {
         try {
             const res = await fetch(`${API_BASE}/test_smtp.php`, {
                 method: 'POST',
                 headers: {'Content-Type': 'application/json'},
                 body: JSON.stringify({
                     config: config.smtp,
                     recipient: currentUser?.email || config.smtp.fromEmail
                 })
             });
             const data = await res.json();
             alert(data.message);
         } catch(e) {
             alert("Failed to send test email");
         } finally {
             setApiLoading(false);
         }
     }
  };

  const handleUpdateAccount = () => {
      if (!accountForm.username) return alert("Username required");
      
      const updatedUser = { ...currentUser!, username: accountForm.username, email: accountForm.email };
      setCurrentUser(updatedUser);
      sessionStorage.setItem('qios_user', JSON.stringify(updatedUser));
      alert("Account Updated Successfully");
      setAccountForm({...accountForm, password: '', newPassword: ''});
  };

  const handleGenerateQR = async () => {
    if (!tempAmount || isNaN(Number(tempAmount))) return;
    
    setApiLoading(true);

    if (IS_DEMO_MODE) {
        // DEMO MODE (Client Side Only)
        const qr = generateDynamicQR(config.qrisString, Number(tempAmount));
        setGeneratedQR(qr);
        const newTrx: Transaction = {
            id: `TRX-${Date.now()}`,
            merchantId: currentUser?.id || '0',
            amount: Number(tempAmount),
            description: 'Manual Generation',
            status: 'pending',
            createdAt: new Date().toISOString(),
            qrString: qr
        };
        setTransactions([newTrx, ...transactions]);
        setApiLoading(false);
    } else {
        // PRODUCTION MODE (Connect to Backend to ensure Callback works)
        try {
            const res = await fetch(`${API_BASE}/create_payment.php`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    merchant_id: currentUser?.id,
                    amount: Number(tempAmount),
                    description: 'Dashboard Manual Gen',
                    api_key: config.apiKey // SENDING API KEY FOR VALIDATION
                })
            });
            const data = await res.json();
            
            if (data.success) {
                setGeneratedQR(data.qr_string);
                const newTrx: Transaction = {
                    id: data.trx_id,
                    merchantId: currentUser?.id || '0',
                    amount: Number(tempAmount),
                    description: 'Dashboard Manual Gen',
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    qrString: data.qr_string
                };
                setTransactions([newTrx, ...transactions]);
            } else {
                alert("Failed: " + (data.message || "Unknown error"));
            }
        } catch (e) {
            alert("Connection Error. Check your API.");
        } finally {
            setApiLoading(false);
        }
    }
  };

  const fetchTransactions = async (user: User) => {
    if (IS_DEMO_MODE) {
      const savedTx = localStorage.getItem('qios_transactions');
      if (savedTx) {
          setTransactions(JSON.parse(savedTx));
      } else {
          // Generate dummy data if empty
          const dummies: Transaction[] = Array(5).fill(0).map((_, i) => ({
             id: `TRX-DEMO-${1000+i}`,
             merchantId: user.id,
             amount: 10000 + (i * 5000),
             description: `Demo Transaction ${i+1}`,
             status: i % 2 === 0 ? 'paid' : 'pending',
             createdAt: new Date().toISOString(),
             qrString: user.merchantConfig?.qrisString || ''
          }));
          setTransactions(dummies);
      }
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
    
    // Initialize forms
    setAccountForm({
        username: user.username,
        email: user.email || '',
        password: '',
        newPassword: ''
    });

    if (user.merchantConfig?.branding?.brandColor) {
        document.documentElement.style.setProperty('--brand-color', user.merchantConfig.branding.brandColor);
    }
    
    if (user.role === 'user') setView('history'); 
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
      const newUser: User = { id: Date.now().toString(), username: regUser, role: 'user', email: '' };
      const currentUsers = JSON.parse(localStorage.getItem('qios_users') || '[]');
      currentUsers.push(newUser);
      localStorage.setItem('qios_users', JSON.stringify(currentUsers));
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
          setLoginUser(regUser); 
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
    if (!currentUser) return;
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
             creator_role: currentUser.role 
          })
        });
        const data = await res.json();
        if(data.success) { fetchUsers(); alert('Saved'); } else alert(data.message);
       } catch(e) { alert('Error'); }
    }
    setApiLoading(false);
    setUserModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('qios_user');
    setShowLanding(true);
    setTransactions([]);
  };

  // --- RENDER ---

  // 1. PUBLIC PAYMENT VIEW (Has Whitelabel Logic)
  if (isPublicMode && generatedQR) {
     const brandColor = config.branding?.brandColor || '#4f46e5';
     const logo = config.branding?.logoUrl;

     return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
         <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 text-center space-y-6">
          <div className="flex justify-center mb-2">
             {logo ? (
                 <img src={logo} alt="Merchant Logo" className="h-16 w-auto object-contain" />
             ) : (
                <div style={{backgroundColor: brandColor}} className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <QrCode size={32} />
                </div>
             )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{config.merchantName}</h1>
            <p className="text-gray-500 text-sm mt-1">{publicData?.note}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative">
             <div className="flex justify-center">
                <QRCodeDisplay data={generatedQR} width={220} logoUrl={logo} />
             </div>
          </div>
          <div style={{color: brandColor}} className="text-4xl font-extrabold">{formatRupiah(Number(tempAmount))}</div>
        </div>
        {config.branding?.customDomain && (
            <p className="mt-8 text-gray-400 text-xs">Powered by {config.branding.customDomain}</p>
        )}
      </div>
    );
  }

  // 2. LANDING PAGE
  if (showLanding && !currentUser) {
    return <LandingPage onLogin={() => setShowLanding(false)} onRegister={() => { setShowLanding(false); setShowRegister(true); }} />;
  }

  // 3. AUTH PAGES
  if (!currentUser) {
    if (showRegister) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-indigo-600 p-8 text-center relative">
               <button onClick={() => {setShowRegister(false); setShowLanding(true);}} className="absolute top-4 left-4 text-white/50 hover:text-white"><X size={20}/></button>
               <h1 className="text-2xl font-bold text-white">Create Account</h1>
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
               </form>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-indigo-600 p-8 text-center relative">
             <button onClick={() => setShowLanding(true)} className="absolute top-4 left-4 text-white/50 hover:text-white"><X size={20}/></button>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
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

  // 4. MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <TransactionModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} onCopyLink={(t: Transaction) => {/* logic */}} branding={config.branding} />

      {/* User Management Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
             <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button onClick={() => setUserModalOpen(false)}><X size={20}/></button>
             </div>
             <form onSubmit={handleUserManagementSubmit} className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-medium mb-1">Role</label>
                   <select className="w-full border p-2 rounded" value={userFormData.role} onChange={e=>setUserFormData({...userFormData, role: e.target.value as UserRole})}>
                      {currentUser.role === 'superadmin' && (<><option value="user">User</option><option value="merchant">Merchant</option><option value="cs">CS</option><option value="superadmin">Super Admin</option></>)}
                      {currentUser.role === 'merchant' && (<><option value="user">User</option><option value="cs">CS</option></>)}
                      {currentUser.role === 'cs' && (<option value="user">User</option>)}
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
                {(userFormData.role === 'merchant' || userFormData.role === 'superadmin') && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                     <p className="text-xs font-bold text-gray-500 uppercase">Merchant Config</p>
                     <input type="text" className="w-full border p-2 rounded text-sm" value={userFormData.merchantName} onChange={e=>setUserFormData({...userFormData, merchantName: e.target.value})} placeholder="Merchant Name" />
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
              <div className="lg:hidden xl:block"><h1 className="text-xl font-bold text-gray-800">QiosLink</h1><p className="text-xs text-gray-500">{currentUser.username}</p></div>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
             <SidebarItem active={view === 'dashboard'} icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setView('dashboard')} />
             <SidebarItem active={view === 'history'} icon={<History size={20} />} label="Transactions" onClick={() => setView('history')} />
             {['superadmin', 'merchant'].includes(currentUser.role) && <SidebarItem active={view === 'terminal'} icon={<Smartphone size={20} />} label="Terminal" onClick={() => setView('terminal')} />}
             {['superadmin', 'merchant', 'cs'].includes(currentUser.role) && <SidebarItem active={view === 'users'} icon={<Users size={20} />} label="Users" onClick={() => setView('users')} />}
             {currentUser.role === 'superadmin' && <SidebarItem active={view === 'integration'} icon={<Code2 size={20} />} label="Integration" onClick={() => setView('integration')} />}
             <SidebarItem active={view === 'settings'} icon={<Settings size={20} />} label="Settings & Profile" onClick={() => setView('settings')} />
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
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          {/* DASHBOARD VIEW (RESTORED) */}
          {view === 'dashboard' && (
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-indigo-100 font-medium">Total Transactions</p>
                            <h3 className="text-4xl font-bold mt-2">{transactions.length}</h3>
                         </div>
                         <div className="bg-white/20 p-2 rounded-lg"><Wallet className="text-white" size={24}/></div>
                      </div>
                   </Card>
                   <Card>
                      <p className="text-gray-500 font-medium">Total Revenue (Demo)</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-2">{formatRupiah(transactions.reduce((acc, curr) => acc + (curr.status === 'paid' ? Number(curr.amount) : 0), 0))}</h3>
                   </Card>
                   <Card>
                      <p className="text-gray-500 font-medium">Pending</p>
                      <h3 className="text-3xl font-bold text-orange-600 mt-2">{transactions.filter(t => t.status === 'pending').length}</h3>
                   </Card>
                </div>
                <Card className="h-80">
                   <h3 className="font-bold text-gray-700 mb-4">Transaction Volume</h3>
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={transactions.slice(0, 10).reverse()}>
                         <defs><linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e7ff" />
                         <XAxis dataKey="createdAt" hide />
                         <YAxis hide />
                         <RechartsTooltip />
                         <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorAmt)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </Card>
             </div>
          )}

          {/* TERMINAL VIEW (RESTORED) */}
          {view === 'terminal' && (
             <div className="flex flex-col lg:flex-row gap-8">
               <Card className="flex-1">
                 <h3 className="text-lg font-bold text-gray-800 mb-4">QR Generator</h3>
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-600 mb-1">Amount (IDR)</label>
                     <div className="relative">
                       <span className="absolute left-3 top-3 text-gray-400 font-bold">Rp</span>
                       <input type="number" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800" placeholder="0" value={tempAmount} onChange={(e) => setTempAmount(e.target.value)} />
                     </div>
                   </div>
                   <button onClick={handleGenerateQR} disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2">
                     {apiLoading ? <Loader2 className="animate-spin" size={24}/> : <><QrCode size={20} /><span>Generate QRIS</span></>}
                   </button>
                 </div>
               </Card>
               <Card className="flex-1 flex flex-col items-center justify-center bg-gray-50 border-dashed border-2 border-gray-200">
                  {generatedQR ? (
                     <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <QRCodeDisplay data={generatedQR} width={256} logoUrl={config.branding?.logoUrl} />
                        <div>
                           <p className="text-sm text-gray-500 mb-1">Scan to Pay</p>
                           <h2 className="text-3xl font-extrabold text-indigo-900">{formatRupiah(Number(tempAmount))}</h2>
                        </div>
                     </div>
                  ) : (
                     <div className="text-center text-gray-400 py-12">
                        <QrCode size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Enter amount to generate QRIS</p>
                     </div>
                  )}
               </Card>
             </div>
          )}

          {/* HISTORY VIEW (RESTORED) */}
          {view === 'history' && (
             <Card>
                <div className="flex justify-between items-center mb-6">
                   <div className="relative max-w-sm w-full">
                      <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="text" placeholder="Search ID or Amount..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                   </div>
                   <button onClick={() => fetchTransactions(currentUser!)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><ArrowRight size={18} className="rotate-90" /></button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="border-b border-gray-100 text-gray-500 text-sm">
                            <th className="py-4 font-medium">Transaction ID</th>
                            <th className="py-4 font-medium">Date</th>
                            <th className="py-4 font-medium">Amount</th>
                            <th className="py-4 font-medium">Status</th>
                            <th className="py-4 font-medium text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="text-sm">
                         {transactions.length === 0 ? (
                            <tr><td colSpan={5} className="py-8 text-center text-gray-400">No transactions found</td></tr>
                         ) : (
                            transactions.filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase())).map((t) => (
                               <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                  <td className="py-4 font-medium text-gray-800">{t.id}</td>
                                  <td className="py-4 text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                                  <td className="py-4 font-bold text-gray-800">{formatRupiah(Number(t.amount))}</td>
                                  <td className="py-4">
                                     <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${t.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{t.status}</span>
                                  </td>
                                  <td className="py-4 text-right">
                                     <button onClick={() => setSelectedTransaction(t)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors"><Eye size={18} /></button>
                                  </td>
                               </tr>
                            ))
                         )}
                      </tbody>
                   </table>
                </div>
             </Card>
          )}
          
          {/* USER MANAGEMENT (Already Implemented correctly above) */}
          {view === 'users' && ['superadmin', 'merchant', 'cs'].includes(currentUser.role) && (
            <Card>
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg">User Management</h3>
                 <button onClick={() => { setEditingUser(null); setUserFormData({username:'', password:'', role: currentUser.role === 'cs' ? 'user' : 'user', merchantName:'', merchantCode:'', apiKey:'', qrisString:''}); setUserModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"><Plus size={18} /><span>Add User</span></button>
              </div>
              <table className="w-full text-left">
                 <thead className="bg-gray-50"><tr><th className="px-4 py-3">Username</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Actions</th></tr></thead>
                 <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                         <td className="px-4 py-3 font-medium">{u.username}</td>
                         <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 text-xs rounded-full uppercase font-bold">{u.role}</span></td>
                         <td className="px-4 py-3">
                           {(currentUser.role === 'superadmin' || (currentUser.role === 'merchant' && ['cs','user'].includes(u.role))) && (
                             <div className="flex space-x-2">
                               <button onClick={() => { setEditingUser(u); setUserFormData({...userFormData, username: u.username, role: u.role}); setUserModalOpen(true); }} className="text-indigo-600"><Pencil size={18} /></button>
                             </div>
                           )}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
            </Card>
          )}

          {/* SETTINGS VIEW (NEW: WITH SMTP) */}
          {view === 'settings' && (
             <div className="max-w-4xl mx-auto">
                 {/* Tabs */}
                 <div className="flex space-x-4 mb-6 border-b border-gray-200 overflow-x-auto">
                     <button onClick={() => setSettingsTab('config')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'config' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Merchant Config</button>
                     <button onClick={() => setSettingsTab('account')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'account' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Account Profile</button>
                     {['merchant', 'superadmin'].includes(currentUser.role) && (
                        <>
                           <button onClick={() => setSettingsTab('branding')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'branding' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Branding</button>
                           <button onClick={() => setSettingsTab('smtp')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${settingsTab === 'smtp' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>SMTP / Email</button>
                        </>
                     )}
                 </div>

                 {/* TAB 1: Config */}
                 {settingsTab === 'config' && (
                     <Card>
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Settings size={20}/> Core Configuration</h3>
                         <div className="space-y-4">
                             <div>
                                 <label className="block text-sm font-medium mb-1">Merchant Name</label>
                                 <input type="text" className="w-full border p-2 rounded" value={config.merchantName} onChange={e => setConfig({...config, merchantName: e.target.value})} disabled={currentUser.role === 'user'} />
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Merchant Code / ID</label>
                                    <input type="text" className="w-full border p-2 rounded" value={config.merchantCode} onChange={e => setConfig({...config, merchantCode: e.target.value})} disabled={currentUser.role === 'user'} placeholder="e.g. QP001" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">API Key (Internal)</label>
                                    <input type="password" className="w-full border p-2 rounded" value={config.apiKey} onChange={e => setConfig({...config, apiKey: e.target.value})} disabled={currentUser.role === 'user'} placeholder="Secret Key" />
                                </div>
                             </div>

                             <div>
                                 <label className="block text-sm font-medium mb-1">Static QRIS Data (000201...)</label>
                                 <textarea rows={4} className="w-full border p-2 rounded font-mono text-xs" value={config.qrisString} onChange={e => setConfig({...config, qrisString: e.target.value})} disabled={currentUser.role === 'user'} />
                             </div>
                             <div className="pt-4 border-t border-gray-100">
                                <label className="block text-sm font-medium mb-1">Callback URL (Webhook)</label>
                                <div className="flex gap-2">
                                    <input type="text" readOnly className="w-full bg-gray-50 border p-2 rounded text-gray-500" value={config.callbackUrl || `${window.location.origin}/callback.php`} />
                                    <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"><Copy size={18}/></button>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Paste this in your Qiospay Dashboard.</p>
                             </div>
                             {currentUser.role !== 'user' && <button onClick={handleUpdateConfig} disabled={apiLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2">{apiLoading ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Save Configuration</button>}
                         </div>
                     </Card>
                 )}

                 {/* TAB 2: Account Profile */}
                 {settingsTab === 'account' && (
                     <Card>
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><UserIcon size={20}/> Edit Profile</h3>
                         <div className="space-y-4 max-w-lg">
                             <div>
                                 <label className="block text-sm font-medium mb-1">Username</label>
                                 <input type="text" className="w-full border p-2 rounded bg-gray-50" value={accountForm.username} onChange={e => setAccountForm({...accountForm, username: e.target.value})} />
                             </div>
                             <div>
                                 <label className="block text-sm font-medium mb-1">Email Address</label>
                                 <input type="email" className="w-full border p-2 rounded" value={accountForm.email} onChange={e => setAccountForm({...accountForm, email: e.target.value})} />
                             </div>
                             <div className="pt-4 border-t border-gray-100">
                                 <label className="block text-sm font-medium mb-1">Change Password</label>
                                 <input type="password" placeholder="New Password (Optional)" className="w-full border p-2 rounded mb-2" value={accountForm.newPassword} onChange={e => setAccountForm({...accountForm, newPassword: e.target.value})} />
                             </div>
                             <button onClick={handleUpdateAccount} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700">Update Profile</button>
                         </div>
                     </Card>
                 )}

                 {/* TAB 3: Branding */}
                 {settingsTab === 'branding' && (
                     <Card>
                         <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2"><Palette size={20}/> Whitelabel Branding</h3>
                                <p className="text-sm text-gray-500">Customize how your payment page looks.</p>
                            </div>
                            <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">Merchant Feature</div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-4">
                                 <div>
                                     <label className="block text-sm font-medium mb-1">Custom Domain (CNAME)</label>
                                     <input type="text" placeholder="e.g. pay.mystore.com" className="w-full border p-2 rounded" value={config.branding?.customDomain || ''} onChange={e => setConfig({...config, branding: {...config.branding, customDomain: e.target.value}})} />
                                     <p className="text-xs text-gray-400 mt-1">Point your domain CNAME to <code>{window.location.host}</code></p>
                                 </div>
                                 <div>
                                     <label className="block text-sm font-medium mb-1">Brand Color</label>
                                     <div className="flex items-center gap-2">
                                        <input type="color" className="h-10 w-10 border p-1 rounded" value={config.branding?.brandColor || '#4f46e5'} onChange={e => setConfig({...config, branding: {...config.branding, brandColor: e.target.value}})} />
                                        <input type="text" className="border p-2 rounded w-full" value={config.branding?.brandColor || '#4f46e5'} onChange={e => setConfig({...config, branding: {...config.branding, brandColor: e.target.value}})} />
                                     </div>
                                 </div>
                                 <div>
                                     <label className="block text-sm font-medium mb-1">Logo URL</label>
                                     <input type="text" placeholder="https://..." className="w-full border p-2 rounded" value={config.branding?.logoUrl || ''} onChange={e => setConfig({...config, branding: {...config.branding, logoUrl: e.target.value}})} />
                                 </div>
                                 <button onClick={handleUpdateConfig} className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 mt-4">Save Branding</button>
                             </div>

                             {/* Preview */}
                             <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center min-h-[300px]">
                                 <p className="text-xs font-bold text-gray-400 uppercase mb-4">Payment Page Preview</p>
                                 <div className="bg-white p-6 rounded-2xl shadow-lg w-64 text-center">
                                     <div className="flex justify-center mb-3">
                                         {config.branding?.logoUrl ? (
                                            <img src={config.branding.logoUrl} className="h-8 w-auto" />
                                         ) : (
                                            <div style={{backgroundColor: config.branding?.brandColor || '#4f46e5'}} className="w-8 h-8 rounded-lg flex items-center justify-center text-white"><QrCode size={16}/></div>
                                         )}
                                     </div>
                                     <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-300">QR CODE</div>
                                     <div style={{color: config.branding?.brandColor || '#4f46e5'}} className="font-bold text-xl">Rp 50.000</div>
                                 </div>
                             </div>
                         </div>
                     </Card>
                 )}

                 {/* TAB 4: SMTP (NEW) */}
                 {settingsTab === 'smtp' && (
                     <Card>
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Mail size={20}/> SMTP Configuration</h3>
                         <div className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                     <label className="block text-sm font-medium mb-1">SMTP Host</label>
                                     <input type="text" placeholder="smtp.gmail.com" className="w-full border p-2 rounded" value={config.smtp?.host || ''} onChange={e => setConfig({...config, smtp: {...config.smtp!, host: e.target.value}})} />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-medium mb-1">SMTP Port</label>
                                     <input type="text" placeholder="587" className="w-full border p-2 rounded" value={config.smtp?.port || ''} onChange={e => setConfig({...config, smtp: {...config.smtp!, port: e.target.value}})} />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-medium mb-1">Username</label>
                                     <input type="text" className="w-full border p-2 rounded" value={config.smtp?.user || ''} onChange={e => setConfig({...config, smtp: {...config.smtp!, user: e.target.value}})} />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-medium mb-1">Password</label>
                                     <input type="password" className="w-full border p-2 rounded" value={config.smtp?.pass || ''} onChange={e => setConfig({...config, smtp: {...config.smtp!, pass: e.target.value}})} />
                                 </div>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                     <label className="block text-sm font-medium mb-1">Encryption</label>
                                     <select className="w-full border p-2 rounded" value={config.smtp?.secure || 'tls'} onChange={e => setConfig({...config, smtp: {...config.smtp!, secure: e.target.value as any}})}>
                                         <option value="tls">TLS</option>
                                         <option value="ssl">SSL</option>
                                         <option value="none">None</option>
                                     </select>
                                 </div>
                                 <div>
                                     <label className="block text-sm font-medium mb-1">From Email</label>
                                     <input type="email" placeholder="no-reply@domain.com" className="w-full border p-2 rounded" value={config.smtp?.fromEmail || ''} onChange={e => setConfig({...config, smtp: {...config.smtp!, fromEmail: e.target.value}})} />
                                 </div>
                             </div>

                             <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2">
                                 <input type="checkbox" id="enableNotif" className="h-4 w-4 text-indigo-600 rounded" checked={config.smtp?.enableNotifications || false} onChange={e => setConfig({...config, smtp: {...config.smtp!, enableNotifications: e.target.checked}})} />
                                 <label htmlFor="enableNotif" className="text-sm font-medium text-gray-700">Send me an email notification when a payment is received.</label>
                             </div>

                             <div className="flex gap-4 pt-4 border-t border-gray-100">
                                 <button onClick={handleUpdateConfig} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2"><Save size={18}/> Save Settings</button>
                                 <button onClick={handleTestEmail} disabled={apiLoading} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 flex items-center gap-2 border border-gray-200">
                                    {apiLoading ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>} Test Email
                                 </button>
                             </div>
                         </div>
                     </Card>
                 )}
             </div>
          )}

          {/* INTEGRATION VIEW (RESTORED) */}
          {view === 'integration' && (
             <Card>
                <h3 className="text-xl font-bold mb-4">Integration API</h3>
                <p className="text-gray-500 mb-6">Use these endpoints to integrate QiosLink with your custom application.</p>
                <div className="bg-gray-900 rounded-xl p-6 text-gray-300 font-mono text-sm overflow-x-auto">
                    <p className="text-green-400">// Create Dynamic Payment</p>
                    <p>POST {window.location.origin}/api/create_payment.php</p>
                    <p className="mb-4">Content-Type: application/json</p>
                    <pre>{`{
  "merchant_id": "${currentUser.id}",
  "api_key": "${config.apiKey || 'YOUR_API_KEY'}",
  "amount": 10000,
  "description": "Order #123",
  "external_id": "INV-123",
  "callback_url": "https://your-site.com/webhook"
}`}</pre>
                </div>
             </Card>
          )}

        </div>
      </main>
    </div>
  );
}