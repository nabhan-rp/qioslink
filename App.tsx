
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
  EyeOff, // NEW
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
  AlertTriangle // NEW
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
const APP_VERSION = "4.0.0 (Verification Update)";

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

// --- COMPONENTS ---
const VerificationBanner = ({ user, onVerifyClick }: { user: User, onVerifyClick: () => void }) => {
  if (user.isVerified !== false) return null; // Default undefined assumes verified (legacy)
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 shadow-sm flex justify-between items-center animate-in fade-in slide-in-from-top-2">
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

// --- DATA MOCK ---
const DEFAULT_MERCHANT_CONFIG: MerchantConfig = {
  merchantName: "Narpra Digital",
  merchantCode: "QP040887",
  qiospayApiKey: "",
  appSecretKey: "QlOS_SECRET_KEY_" + Math.random().toString(36).substring(7),
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
      enableNotifications: false,
      useSystemSmtp: false,
      requireEmailVerification: false
  }
};

const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', email:'admin@example.com', role: 'superadmin', merchantConfig: DEFAULT_MERCHANT_CONFIG, isVerified: true },
  { id: '2', username: 'merchant', email:'merchant@store.com', role: 'merchant', merchantConfig: { ...DEFAULT_MERCHANT_CONFIG, merchantName: "Warung Demo" }, isVerified: true }
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
  
  // Data State
  const [config, setConfig] = useState<MerchantConfig>(DEFAULT_MERCHANT_CONFIG);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  // UI Inputs
  const [tempAmount, setTempAmount] = useState<string>('');
  const [tempDesc, setTempDesc] = useState<string>('Payment');
  const [expiryMinutes, setExpiryMinutes] = useState<string>('');
  const [singleUse, setSingleUse] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Verification State
  const [otpCode, setOtpCode] = useState('');
  
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Account Settings Form
  const [accountForm, setAccountForm] = useState({
      username: '',
      email: '',
      password: '',
      newPassword: ''
  });

  // Login/Register Forms
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regError, setRegError] = useState('');

  // Public Link Mode
  const [isPublicMode, setIsPublicMode] = useState(false);
  const [publicData, setPublicData] = useState<any>(null);

  // --- INIT ---
  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    setAuthLoading(true);
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('pay')) {
        setIsPublicMode(true);
        setShowLanding(false);
        const token = params.get('pay');
        // ... (Public Logic same as before)
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

  const handleVerifyEmail = async () => {
      setApiLoading(true);
      if (IS_DEMO_MODE) {
          if (otpCode === '123456') {
             const updated = {...currentUser!, isVerified: true};
             loginSuccess(updated, false);
             alert("Email Verified (Demo)");
          } else {
             alert("Invalid Code (Demo: use 123456)");
          }
      } else {
          try {
             const res = await fetch(`${API_BASE}/verify_email.php`, {
                 method: 'POST', body: JSON.stringify({ user_id: currentUser?.id, code: otpCode })
             });
             const data = await res.json();
             if (data.success) {
                 const updated = {...currentUser!, isVerified: true};
                 loginSuccess(updated, false);
                 alert(data.message);
                 setOtpCode('');
             } else {
                 alert(data.message);
             }
          } catch(e) { alert("Connection Error"); }
      }
      setApiLoading(false);
  };

  const handleResendOtp = async () => {
      setApiLoading(true);
      if (IS_DEMO_MODE) { alert("New OTP Sent (Demo: 123456)"); }
      else {
          try {
             const res = await fetch(`${API_BASE}/resend_otp.php`, {
                 method: 'POST', body: JSON.stringify({ user_id: currentUser?.id })
             });
             const data = await res.json();
             if(data.success) alert(data.message);
             else alert("Failed: " + data.message + (currentUser?.supportEmail ? `. Contact: ${currentUser.supportEmail}` : ''));
          } catch(e) { alert("Connection Error"); }
      }
      setApiLoading(false);
  };

  const handleGenerateQR = async () => {
     if (currentUser?.isVerified === false) {
         return alert(`Action Blocked.\nPlease verify your email first.\nContact support: ${currentUser.supportEmail}`);
     }
     // ... (Existing Generate QR Logic) ...
     if (!tempAmount || isNaN(Number(tempAmount))) return; setApiLoading(true); setGeneratedQR(null); setGeneratedLink(null); if (IS_DEMO_MODE) { const qr = generateDynamicQR(config.qrisString, Number(tempAmount)); const token = Math.random().toString(36).substring(7); const link = `${window.location.origin}/?pay=${token}`; setTimeout(() => { setGeneratedQR(qr); setGeneratedLink(link); const newTrx: Transaction = { id: `TRX-${Date.now()}`, merchantId: currentUser?.id || '0', amount: Number(tempAmount), description: tempDesc, status: 'pending', createdAt: new Date().toISOString(), qrString: qr, paymentUrl: link }; setTransactions([newTrx, ...transactions]); setApiLoading(false); }, 800); } else { try { const res = await fetch(`${API_BASE}/create_payment.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ merchant_id: currentUser?.id, amount: Number(tempAmount), description: tempDesc, expiry_minutes: expiryMinutes ? parseInt(expiryMinutes) : 0, single_use: singleUse, api_key: config.appSecretKey }) }); const data = await res.json(); if (data.success) { setGeneratedQR(data.qr_string); setGeneratedLink(data.payment_url); const newTrx: Transaction = { id: data.trx_id, merchantId: currentUser?.id || '0', amount: Number(tempAmount), description: tempDesc, status: 'pending', createdAt: new Date().toISOString(), qrString: data.qr_string, paymentUrl: data.payment_url }; setTransactions([newTrx, ...transactions]); } else { alert("Failed: " + (data.message || "Unknown error")); } } catch (e) { alert("Connection Error. Check your API."); } finally { setApiLoading(false); } }
  };

  const loginSuccess = (user: User, redirect = true) => { 
    if (user.username === 'admin' && user.role !== 'superadmin') user.role = 'superadmin';
    
    // Check if verified status is present, if not assume true (legacy)
    if (user.isVerified === undefined) user.isVerified = true;

    setCurrentUser(user); 
    sessionStorage.setItem('qios_user', JSON.stringify(user)); 
    if (user.merchantConfig) setConfig(user.merchantConfig); 
    setAccountForm({ username: user.username, email: user.email || '', password: '', newPassword: '' }); 
    if (user.merchantConfig?.branding?.brandColor) document.documentElement.style.setProperty('--brand-color', user.merchantConfig.branding.brandColor); 
    
    if (redirect) {
        setShowLanding(false);
        if (user.role === 'user') setView('history'); 
        else setView('dashboard'); 
    }
  };

  const handleRegister = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      setRegError(''); 
      
      if (regPass !== regConfirmPass) {
          setRegError('Passwords do not match');
          return;
      }

      setApiLoading(true); 
      if (IS_DEMO_MODE) { 
          const newUser: User = { id: Date.now().toString(), username: regUser, email: regEmail, role: 'user', isVerified: true }; 
          loginSuccess(newUser); 
          setShowRegister(false); 
          alert('Registration Successful (Demo)'); 
          setApiLoading(false); 
      } else { 
          try { 
              const res = await fetch(`${API_BASE}/register.php`, { 
                  method: 'POST', headers: {'Content-Type': 'application/json'}, 
                  body: JSON.stringify({ username: regUser, email: regEmail, password: regPass, confirmPassword: regConfirmPass }) 
              }); 
              const data = await res.json(); 
              if (data.success) { 
                  alert('Registration successful! ' + (data.warning || 'Please login.')); 
                  setShowRegister(false); 
                  setLoginUser(regUser); 
              } else { 
                  setRegError(data.message || 'Registration failed'); 
              } 
          } catch (err) { setRegError('Connection Error'); } finally { setApiLoading(false); } 
      } 
  };

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setApiLoading(true);
      setLoginError('');
      // ... (Existing Login logic - Demo)
      if (IS_DEMO_MODE) {
          // ... Mock login logic
          loginSuccess(MOCK_USERS[0]);
          setApiLoading(false);
      } else {
          try {
             const res = await fetch(`${API_BASE}/login.php`, {
                 method: 'POST', body: JSON.stringify({ username: loginUser, password: loginPass })
             });
             const data = await res.json();
             if (data.success) loginSuccess(data.user);
             else setLoginError(data.message);
          } catch(e) { setLoginError('Connection Error'); }
          finally { setApiLoading(false); }
      }
  };
  
  // ... (Other handlers unchanged)
  const handleLogout = () => { setCurrentUser(null); sessionStorage.removeItem('qios_user'); setShowLanding(true); setTransactions([]); };

  // --- RENDERS ---
  if (isPublicMode) { /* ... Public Mode Render ... */ return <div>Public Page</div>; }
  
  // LOGIN FORM
  if (!currentUser && !showRegister && !showLanding) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
             <div className="bg-indigo-600 p-8 text-center relative">
                 <button onClick={()=>setShowLanding(true)} className="absolute top-4 left-4 text-white/50 hover:text-white"><X size={20}/></button>
                 <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
             </div>
             <div className="p-8">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-lg" value={loginUser} onChange={(e)=>setLoginUser(e.target.value)}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} required className="w-full px-4 py-3 border border-gray-200 rounded-lg pr-10" value={loginPass} onChange={(e)=>setLoginPass(e.target.value)}/>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    {loginError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center"><Lock size={16} className="mr-2"/>{loginError}</div>}
                    <button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold">{apiLoading?<Loader2 className="animate-spin"/>:'Login'}</button>
                    <div className="text-center text-sm"><span className="text-gray-500">New here? </span><button type="button" onClick={()=>{setShowRegister(true);}} className="text-indigo-600 font-bold hover:underline">Create Account</button></div>
                </form>
             </div>
          </div>
        </div>
      );
  }

  // REGISTER FORM
  if (!currentUser && showRegister) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-indigo-600 p-8 text-center relative">
                <button onClick={()=>{setShowRegister(false);setShowLanding(true);}} className="absolute top-4 left-4 text-white/50 hover:text-white"><X size={20}/></button>
                <h1 className="text-2xl font-bold text-white">Create Account</h1>
            </div>
            <div className="p-8">
               <form onSubmit={handleRegister} className="space-y-4">
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                       <input type="text" required className="w-full px-4 py-2 border border-gray-200 rounded-lg" value={regUser} onChange={e=>setRegUser(e.target.value)}/>
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                       <input type="email" required className="w-full px-4 py-2 border border-gray-200 rounded-lg" value={regEmail} onChange={e=>setRegEmail(e.target.value)}/>
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                       <div className="relative">
                           <input type={showPassword ? "text" : "password"} required className="w-full px-4 py-2 border border-gray-200 rounded-lg pr-10" value={regPass} onChange={e=>setRegPass(e.target.value)}/>
                           <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                       </div>
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                       <div className="relative">
                           <input type={showConfirmPassword ? "text" : "password"} required className="w-full px-4 py-2 border border-gray-200 rounded-lg pr-10" value={regConfirmPass} onChange={e=>setRegConfirmPass(e.target.value)}/>
                           <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                       </div>
                   </div>
                   {regError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{regError}</div>}
                   <button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold">{apiLoading?<Loader2 className="animate-spin"/>:'Sign Up'}</button>
               </form>
            </div>
          </div>
        </div>
      );
  }

  // --- MAIN DASHBOARD LAYOUT ---
  if (!currentUser && showLanding) return <div>Landing Page...</div>; // (Mock Landing return)
  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 xl:w-72'}`}>
          {/* ... Sidebar Content ... */}
          <div className="h-20 flex items-center px-6 border-b border-gray-100">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><QrCode size={24} /></div>
               <div className="lg:hidden xl:block"><h1 className="text-xl font-bold text-gray-800">QiosLink</h1></div>
             </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
               {/* Nav Items */}
               <button onClick={()=>setView('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${view==='dashboard'?'bg-indigo-600 text-white':'text-gray-500 hover:bg-indigo-50'}`}><LayoutDashboard size={20}/><span className="font-medium">Dashboard</span></button>
               <button onClick={()=>setView('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${view==='settings'?'bg-indigo-600 text-white':'text-gray-500 hover:bg-indigo-50'}`}><Settings size={20}/><span className="font-medium">Settings</span></button>
               {/* ... Other nav items ... */}
          </nav>
          <div className="p-4 border-t border-gray-100">
             <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg"><LogOut size={20} /><span className="lg:hidden xl:inline font-medium">Logout</span></button>
          </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10">
           <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"><Menu size={24} /></button>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{view.replace('_', ' ')}</h2>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{currentUser.username} ({currentUser.role})</span>
              {currentUser.isVerified ? <CheckCircle2 size={16} className="text-green-500"/> : <AlertTriangle size={16} className="text-yellow-500"/>}
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          <VerificationBanner user={currentUser} onVerifyClick={() => { setView('settings'); setSettingsTab('account'); }} />

          {view === 'settings' && (
             <div className="max-w-4xl mx-auto">
                 {/* Tabs */}
                 <div className="flex space-x-4 mb-6 border-b border-gray-200 overflow-x-auto">
                     <button onClick={() => setSettingsTab('config')} className={`pb-3 px-2 font-medium ${settingsTab === 'config' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Merchant Config</button>
                     <button onClick={() => setSettingsTab('account')} className={`pb-3 px-2 font-medium ${settingsTab === 'account' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Account & Verification</button>
                     {/* ... */}
                     <button onClick={() => setSettingsTab('smtp')} className={`pb-3 px-2 font-medium ${settingsTab === 'smtp' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>SMTP</button>
                 </div>

                 {/* ACCOUNT TAB WITH VERIFICATION */}
                 {settingsTab === 'account' && (
                     <div className="space-y-6">
                         {/* EMAIL VERIFICATION SECTION */}
                         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield size={20}/> Email Verification</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${currentUser.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {currentUser.isVerified ? 'Verified' : 'Not Verified'}
                                </div>
                                {!currentUser.isVerified && <span className="text-sm text-gray-500">Please verify to unlock full features.</span>}
                            </div>
                            
                            {!currentUser.isVerified && (
                                <div className="max-w-md space-y-3">
                                    <label className="block text-sm font-medium mb-1">Enter Verification Code (OTP)</label>
                                    <div className="flex gap-2">
                                        <input type="text" className="border p-2 rounded flex-1 tracking-widest text-center text-lg" placeholder="123456" maxLength={6} value={otpCode} onChange={e => setOtpCode(e.target.value)} />
                                        <button onClick={handleVerifyEmail} disabled={apiLoading || otpCode.length < 4} className="bg-green-600 text-white px-4 rounded font-bold hover:bg-green-700">{apiLoading ? <Loader2 className="animate-spin"/> : 'Verify'}</button>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Didn't get the code? <button onClick={handleResendOtp} disabled={apiLoading} className="text-indigo-600 font-bold hover:underline">Resend OTP</button>
                                    </div>
                                    <p className="text-xs text-red-400 mt-2">
                                       Problem? Contact support: {currentUser.supportEmail || 'admin@qioslink.com'}
                                    </p>
                                </div>
                            )}
                         </div>

                         {/* EDIT PROFILE */}
                         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                             <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><UserIcon size={20}/> Edit Profile</h3>
                             {/* ... Profile Form Fields ... */}
                         </div>
                     </div>
                 )}
                 
                 {/* SMTP TAB WITH "REQUIRE VERIFICATION" TOGGLE */}
                 {settingsTab === 'smtp' && (
                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                         <h3 className="text-lg font-bold mb-4">SMTP Configuration</h3>
                         {/* ... Existing Fields ... */}
                         <div className="mt-6 pt-6 border-t border-gray-100">
                            <h4 className="font-bold text-gray-800 mb-2">User Registration Policy</h4>
                            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                 <input 
                                     type="checkbox" 
                                     id="reqVerif" 
                                     className="h-4 w-4 text-indigo-600 rounded" 
                                     checked={config.smtp?.requireEmailVerification || false} 
                                     onChange={e => setConfig({...config, smtp: {...config.smtp!, requireEmailVerification: e.target.checked}})} 
                                 />
                                 <div>
                                     <label htmlFor="reqVerif" className="text-sm font-bold text-gray-700">Require Email Verification for New Users</label>
                                     <p className="text-xs text-gray-500">If checked, new users created under you must verify their email before using the dashboard. Requires working SMTP.</p>
                                 </div>
                             </div>
                             <div className="mt-4">
                                <button onClick={() => { /* Handle Save Config logic */ }} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700">Save Policy</button>
                             </div>
                         </div>
                     </div>
                 )}
             </div>
          )}

          {view === 'terminal' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-4">Payment Terminal</h3>
                  <p className="mb-4">Generate Link Logic...</p>
                  <button onClick={handleGenerateQR} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2">
                      <QrCode size={18} /> Generate Link
                  </button>
              </div>
          )}
          
          {/* ... Other Views ... */}

        </div>
      </main>
    </div>
  );
}
