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
  Loader2
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
const APP_VERSION = "2.6.0 (Demo Feature Update)";
// Set this to TRUE to fix "Server connection failed" on localhost
const IS_DEMO_MODE = true; 
const API_BASE = './api'; 

// --- Components ---

const SidebarItem = ({ 
  active, 
  icon, 
  label, 
  onClick 
}: { 
  active: boolean; 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
        : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`}>
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </button>
);

const Card = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

const TransactionModal = ({ 
  transaction, 
  onClose, 
  onCopyLink 
}: { 
  transaction: Transaction | null; 
  onClose: () => void; 
  onCopyLink: (t: Transaction) => void; 
}) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>

        <div className="bg-indigo-600 p-6 text-white text-center">
          <h3 className="font-bold text-lg">Transaction Details</h3>
          <p className="text-indigo-200 text-sm">{transaction.id}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center">
             <div className="mb-4 transform scale-90">
                <QRCodeDisplay data={transaction.qrString} width={200} />
             </div>
             <div className="text-2xl font-bold text-gray-800">{formatRupiah(transaction.amount)}</div>
             <div className={`px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                transaction.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {transaction.status.toUpperCase()}
              </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-800">{transaction.createdAt}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Description</span>
              <span className="font-medium text-gray-800">{transaction.description}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
               <span className="text-gray-500">QR String</span>
               <button 
                onClick={() => {
                  navigator.clipboard.writeText(transaction.qrString);
                  alert('QR String copied!');
                }}
                className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center"
               >
                 <Copy size={12} className="mr-1" /> Copy
               </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => onCopyLink(transaction)}
              className="flex-1 flex items-center justify-center space-x-2 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition-colors"
            >
              <LinkIcon size={18} />
              <span>Copy Payment Link</span>
            </button>
             <button 
              onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(transaction.qrString)}`, '_blank')}
              className="flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Default Data for Fallback ---
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

// --- Main App ---

export default function App() {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  
  // App State
  const [view, setView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Integration Tab State
  const [integrationTab, setIntegrationTab] = useState<'php' | 'node' | 'whmcs' | 'woo' | 'shopify'>('php');
  
  // Data State
  const [config, setConfig] = useState<MerchantConfig>(DEFAULT_MERCHANT_CONFIG);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  // UI State
  const [tempAmount, setTempAmount] = useState<string>('');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [amountError, setAmountError] = useState('');
  
  // Login Form State
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Public Link Mode State
  const [isPublicMode, setIsPublicMode] = useState(false);
  const [publicData, setPublicData] = useState<{amount: number, note: string} | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    setAuthLoading(true);

    // 1. Check Public Payment Link URL Params
    const params = new URLSearchParams(window.location.search);
    const amountParam = params.get('amount');
    const noteParam = params.get('note');

    if (amountParam) {
      setIsPublicMode(true);
      const amount = parseInt(amountParam, 10);
      const qr = generateDynamicQR(DEFAULT_MERCHANT_CONFIG.qrisString, amount);
      setGeneratedQR(qr);
      setTempAmount(amount.toString());
      setPublicData({ amount, note: noteParam || 'Payment' });
      setAuthLoading(false);
      return; 
    }

    // 2. Check Session Persistence
    const sessionUser = sessionStorage.getItem('qios_user');
    if (sessionUser) {
      const user = JSON.parse(sessionUser);
      setCurrentUser(user);
      if (user.merchantConfig) setConfig(user.merchantConfig);
      
      if (user.role === 'user') setView('my_orders');
      else setView('dashboard');

      // Fetch fresh data if connected to API
      if (!IS_DEMO_MODE) {
        fetchTransactions(user);
      } else {
        // Load mock transactions
        const savedTx = localStorage.getItem('qios_transactions');
        if (savedTx) setTransactions(JSON.parse(savedTx));
      }
    }

    setAuthLoading(false);
  };

  // --- API HELPER ---
  const fetchTransactions = async (user: User) => {
    try {
      const res = await fetch(`${API_BASE}/get_data.php?user_id=${user.id}&role=${user.role}`);
      const data = await res.json();
      if (data.success && data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (e) {
      console.error("Failed to fetch transactions", e);
    }
  };

  // --- HANDLERS ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setApiLoading(true);

    if (IS_DEMO_MODE) {
      // MOCK LOGIN
      const foundUser = users.find(u => u.username === loginUser);
      if (foundUser && loginPass === foundUser.username) {
         loginSuccess(foundUser);
      } else {
         setLoginError('Invalid username or password');
      }
      setApiLoading(false);
    } else {
      // REAL API LOGIN
      try {
        const res = await fetch(`${API_BASE}/login.php`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ username: loginUser, password: loginPass })
        });
        
        // Handle if response is not JSON (e.g., PHP error HTML)
        const text = await res.text();
        let data;
        try {
           data = JSON.parse(text);
        } catch(e) {
           throw new Error("Server Error: " + text.substring(0, 100));
        }

        if (data.success) {
           loginSuccess(data.user);
        } else {
           setLoginError(data.message || 'Login failed');
        }
      } catch (err: any) {
        setLoginError('Connection Error: ' + err.message);
      } finally {
        setApiLoading(false);
      }
    }
  };

  const loginSuccess = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('qios_user', JSON.stringify(user));
    if (user.merchantConfig) {
      setConfig(user.merchantConfig);
    }
    if (user.role === 'user') setView('my_orders');
    else setView('dashboard');
    
    if(!IS_DEMO_MODE) fetchTransactions(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('qios_user');
    setView('dashboard');
    setTransactions([]);
  };

  const handleSaveConfig = async () => {
    if (!currentUser) return;
    setApiLoading(true);

    if (IS_DEMO_MODE) {
      const updatedUser = { ...currentUser, merchantConfig: config };
      setCurrentUser(updatedUser);
      sessionStorage.setItem('qios_user', JSON.stringify(updatedUser));
      alert('Config Saved (Local Demo)');
      setApiLoading(false);
    } else {
      try {
        const res = await fetch(`${API_BASE}/update_config.php`, {
           method: 'POST',
           body: JSON.stringify({ user_id: currentUser.id, config: config })
        });
        const data = await res.json();
        if(data.success) {
           const updatedUser = { ...currentUser, merchantConfig: config };
           setCurrentUser(updatedUser);
           sessionStorage.setItem('qios_user', JSON.stringify(updatedUser));
           alert('Configuration saved to Database!');
        } else {
           alert('Failed to save: ' + data.message);
        }
      } catch (e) {
        alert('Connection failed');
      } finally {
        setApiLoading(false);
      }
    }
  };

  const handleGenerateQR = async () => {
    setAmountError('');
    if (!tempAmount) {
      setAmountError('Please enter an amount.');
      return;
    }
    const amountNum = Number(tempAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setAmountError('Please enter a valid amount.');
      return;
    }

    if (IS_DEMO_MODE) {
       // Demo Logic
       const dynamicString = generateDynamicQR(config.qrisString, amountNum);
       setGeneratedQR(dynamicString);
       const newTrx: Transaction = {
         id: `TRX-${Math.floor(Math.random() * 10000)}`,
         merchantId: currentUser?.id || 'unknown',
         amount: amountNum,
         description: 'Manual Generation',
         status: 'pending',
         createdAt: new Date().toLocaleString(),
         qrString: dynamicString
       };
       const newTxList = [newTrx, ...transactions];
       setTransactions(newTxList);
       localStorage.setItem('qios_transactions', JSON.stringify(newTxList));
    } else {
       // Production Logic
       setApiLoading(true);
       try {
         const res = await fetch(`${API_BASE}/create_payment.php`, {
           method: 'POST',
           body: JSON.stringify({
             merchant_id: currentUser?.id,
             amount: amountNum,
             description: 'Manual Terminal Gen'
           })
         });
         const data = await res.json();
         if(data.success && data.transaction) {
            setGeneratedQR(data.transaction.qrString);
            setTransactions([data.transaction, ...transactions]);
         } else {
            setAmountError(data.message || 'Generation failed');
         }
       } catch (e) {
         setAmountError('Server connection failed');
       } finally {
         setApiLoading(false);
       }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  const generatePaymentLink = (t: Transaction | null, amt?: number) => {
    const amount = t ? t.amount : amt;
    const note = t ? t.description : 'Payment';
    if (!amount) return;
    
    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}?amount=${amount}&note=${encodeURIComponent(note)}`;
    
    navigator.clipboard.writeText(link);
    alert('Public Payment Link copied to clipboard!\nShare this URL with your customer.');
  };

  // --- Logic: Who sees what? ---
  const visibleTransactions = transactions.filter(t => {
    if (!currentUser) return false;
    if (currentUser.role === 'superadmin') return true;
    if (currentUser.role === 'cs') return true;
    if (currentUser.role === 'merchant') return t.merchantId == currentUser.id; // loose equality for string/int mix
    if (currentUser.role === 'user') return t.customerId == currentUser.id;
    return false;
  });

  const filteredTransactions = visibleTransactions.filter(t => 
    (t.id && t.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    t.amount.toString().includes(searchQuery)
  );

  // ---------------- RENDER ----------------

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-indigo-600" /></div>;

  // 1. PUBLIC PAYMENT PAGE
  if (isPublicMode && generatedQR) {
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
          <div>
             <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Payment</p>
             <div className="text-4xl font-extrabold text-indigo-900">{formatRupiah(Number(tempAmount))}</div>
          </div>
          <div className="pt-4 border-t border-gray-100">
             <p className="text-xs text-gray-400">Scan this QRIS with GoPay, OVO, Dana, LinkAja, ShopeePay, or Mobile Banking.</p>
             <div className="mt-4 text-xs text-gray-300 font-mono">Merchant ID: {config.merchantCode}</div>
          </div>
        </div>
        <div className="mt-8 text-gray-400 text-sm">Powered by <span className="font-semibold text-gray-600">QiosLink</span></div>
      </div>
    );
  }

  // 2. LOGIN PAGE
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="bg-indigo-600 p-8 text-center">
             <div className="inline-flex p-3 bg-white/20 rounded-xl mb-4 text-white">
              <Shield size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">QiosLink Login</h1>
            <p className="text-indigo-200 mt-2">Secure Payment Platform</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input 
                  type="password" 
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              
              {loginError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                   <Lock size={16} className="mr-2" /> {loginError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={apiLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-colors shadow-lg shadow-indigo-500/30 flex justify-center items-center"
              >
                {apiLoading ? <Loader2 className="animate-spin" /> : 'Login'}
              </button>

              <div className="text-center text-xs text-gray-400 mt-4 border-t pt-4">
                <p className="mb-1 font-semibold">{IS_DEMO_MODE ? 'Demo Accounts:' : 'Default Production Accounts:'}</p>
                <div className="grid grid-cols-2 gap-2 text-left px-2">
                  <span>• admin (Pass: admin)</span>
                  <span>• merchant (Pass: merchant)</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 3. MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      
      {/* Modals */}
      <TransactionModal 
        transaction={selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
        onCopyLink={(t) => generatePaymentLink(t)}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 xl:w-72'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <QrCode size={24} />
              </div>
              <div className={`lg:hidden xl:block overflow-hidden transition-all duration-300`}>
                <h1 className="text-xl font-bold text-gray-800">QiosLink</h1>
                <p className="text-xs text-gray-500 truncate">
                   {currentUser.username} ({currentUser.role})
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            
            {['superadmin', 'merchant', 'cs'].includes(currentUser.role) && (
              <>
                <SidebarItem 
                  active={view === 'dashboard'} 
                  icon={<LayoutDashboard size={20} />} 
                  label="Dashboard" 
                  onClick={() => setView('dashboard')} 
                />
                 <SidebarItem 
                  active={view === 'history'} 
                  icon={<History size={20} />} 
                  label="Transactions" 
                  onClick={() => setView('history')} 
                />
              </>
            )}

            {['superadmin', 'merchant'].includes(currentUser.role) && (
              <SidebarItem 
                active={view === 'terminal'} 
                icon={<Smartphone size={20} />} 
                label="Payment Terminal" 
                onClick={() => setView('terminal')} 
              />
            )}

            {currentUser.role === 'superadmin' && (
              <>
                <SidebarItem 
                  active={view === 'users'} 
                  icon={<Users size={20} />} 
                  label="User Management" 
                  onClick={() => setView('users')} 
                />
                <SidebarItem 
                  active={view === 'integration'} 
                  icon={<Code2 size={20} />} 
                  label="Integration API" 
                  onClick={() => setView('integration')} 
                />
              </>
            )}
            
            {currentUser.role === 'user' && (
               <SidebarItem 
                active={view === 'my_orders'} 
                icon={<ShoppingBag size={20} />} 
                label="My Orders" 
                onClick={() => setView('my_orders')} 
              />
            )}

            {currentUser.role !== 'user' && (
              <SidebarItem 
                active={view === 'settings'} 
                icon={<Settings size={20} />} 
                label="Settings" 
                onClick={() => setView('settings')} 
              />
            )}

          </nav>

          <div className="p-4 border-t border-gray-100">
             <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
             >
              <LogOut size={20} />
              <span className="lg:hidden xl:inline font-medium">Logout</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu size={24} className="text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 capitalize">
              {view.replace('_', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {!IS_DEMO_MODE && (
               <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                  <Server size={12} className="mr-1"/> LIVE
               </span>
            )}
            <div className="flex flex-col items-end hidden md:block">
              <span className="text-sm font-semibold text-gray-800">{currentUser.username}</span>
              <span className="text-xs text-gray-500 uppercase">{currentUser.role}</span>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold uppercase
              ${currentUser.role === 'superadmin' ? 'bg-purple-600' : 
                currentUser.role === 'merchant' ? 'bg-indigo-600' :
                currentUser.role === 'cs' ? 'bg-orange-500' : 'bg-green-500'
              }`}>
              {currentUser.username.charAt(0)}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          {/* VIEW: DASHBOARD */}
          {view === 'dashboard' && (
             <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/20 rounded-lg"><Wallet className="text-white" size={24} /></div>
                      <span className="text-indigo-100 text-sm font-medium">Total Revenue</span>
                    </div>
                    <div className="text-3xl font-bold">Rp {visibleTransactions.reduce((acc, t) => acc + Number(t.amount), 0).toLocaleString()}</div>
                 </Card>
                 <Card>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-green-100 rounded-lg"><CheckCircle2 className="text-green-600" size={24} /></div>
                      <span className="text-gray-500 text-sm font-medium">Transactions</span>
                    </div>
                    <div className="text-3xl font-bold">{visibleTransactions.length}</div>
                 </Card>
                 <Card>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-orange-100 rounded-lg"><History className="text-orange-600" size={24} /></div>
                      <span className="text-gray-500 text-sm font-medium">Pending</span>
                    </div>
                    <div className="text-3xl font-bold">{visibleTransactions.filter(t => t.status === 'pending').length}</div>
                 </Card>
               </div>
             </div>
          )}

          {/* VIEW: HISTORY */}
          {view === 'history' && (
             <Card>
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold">Transaction History</h3>
                   <button onClick={() => fetchTransactions(currentUser)} className="text-sm text-indigo-600 hover:underline">Refresh Data</button>
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="border-b"><th className="pb-2">ID</th><th className="pb-2">Desc</th><th className="pb-2">Amount</th><th className="pb-2">Status</th><th className="pb-2">Date</th></tr></thead>
                  <tbody>{filteredTransactions.length === 0 ? <tr><td colSpan={5} className="py-4 text-center text-gray-500">No transactions found</td></tr> : filteredTransactions.map(t => (
                     <tr key={t.id} onClick={()=>setSelectedTransaction(t)} className="border-b last:border-0 hover:bg-gray-50 cursor-pointer transition-colors">
                        <td className="py-3 text-sm font-mono text-gray-500">{t.id}</td>
                        <td className="py-3 text-sm">{t.description}</td>
                        <td className="py-3 font-bold">{formatRupiah(Number(t.amount))}</td>
                        <td className="py-3"><span className={`px-2 py-1 rounded text-xs uppercase font-bold ${t.status==='paid'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{t.status}</span></td>
                        <td className="py-3 text-xs text-gray-400">{t.createdAt}</td>
                     </tr>
                  ))}</tbody>
                </table>
                </div>
             </Card>
          )}

          {/* VIEW: TERMINAL */}
          {view === 'terminal' && (
             <div className="max-w-md mx-auto">
               <Card>
                  <h3 className="font-bold mb-4">Manual QR Generation</h3>
                  <input type="number" value={tempAmount} onChange={e=>setTempAmount(e.target.value)} className="w-full border p-2 rounded mb-4" placeholder="Amount (e.g., 10000)" />
                  {amountError && <p className="text-red-500 text-sm mb-2">{amountError}</p>}
                  
                  <button onClick={handleGenerateQR} disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded flex justify-center">
                     {apiLoading ? <Loader2 className="animate-spin" /> : 'Generate Dynamic QR'}
                  </button>
                  
                  {generatedQR && (
                     <div className="mt-6 flex flex-col items-center animate-in fade-in">
                        <QRCodeDisplay data={generatedQR} />
                        <p className="mt-2 text-sm text-gray-500">Scan to simulate payment</p>
                        
                        {/* BUTTON COPY LINK ADDED HERE */}
                        <div className="mt-4 w-full">
                           <button 
                             onClick={() => generatePaymentLink(null, Number(tempAmount))}
                             className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition-colors border border-indigo-200"
                           >
                             <LinkIcon size={18} />
                             <span>Copy Payment Link</span>
                           </button>
                           <p className="text-xs text-center text-indigo-400 mt-2">
                             Share this link to accept payment from anywhere (Ratapay Style)
                           </p>
                        </div>
                     </div>
                  )}
               </Card>
             </div>
          )}
          
          {/* VIEW: SETTINGS */}
          {view === 'settings' && (
             <div className="max-w-2xl mx-auto">
               <Card>
                 <h3 className="font-bold mb-4">Merchant Settings</h3>
                 <div className="space-y-4">
                    {/* Merchant Name */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Merchant Name</label>
                      <input type="text" className="w-full border p-2 rounded" value={config.merchantName} onChange={e=>setConfig({...config, merchantName:e.target.value})} />
                    </div>

                    {/* RESTORED: Merchant Code (QRIS Merchant ID) & API Key */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Merchant Code (ID)</label>
                          <input type="text" className="w-full border p-2 rounded" value={config.merchantCode} onChange={e=>setConfig({...config, merchantCode:e.target.value})} placeholder="e.g. QP040887" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">API Key</label>
                          <div className="relative">
                              <input type="password" className="w-full border p-2 rounded" value={config.apiKey} onChange={e=>setConfig({...config, apiKey:e.target.value})} placeholder="Secret Key" />
                          </div>
                      </div>
                    </div>

                    {/* QR String */}
                    <div>
                       <label className="block text-sm font-medium mb-1">Static QR String (From Nobu/Qiospay)</label>
                       <textarea className="w-full border p-2 rounded text-xs font-mono bg-gray-50" rows={4} value={config.qrisString} onChange={e=>setConfig({...config, qrisString:e.target.value})} />
                       <p className="text-xs text-gray-400 mt-1">Starts with 000201...</p>
                    </div>
                    
                    {/* Callback URL (Optional but useful to see) */}
                    <div>
                       <label className="block text-sm font-medium mb-1">Callback URL (Read Only)</label>
                       <input type="text" readOnly className="w-full border p-2 rounded bg-gray-100 text-gray-500 text-sm" value={window.location.origin + '/api/callback.php'} />
                       <p className="text-xs text-gray-400 mt-1">Copy this to your Qiospay Dashboard</p>
                    </div>

                    <button onClick={handleSaveConfig} disabled={apiLoading} className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center">
                       {apiLoading && <Loader2 className="animate-spin mr-2" size={16}/>} Save Configuration
                    </button>
                 </div>
               </Card>
             </div>
          )}

          {/* VIEW: USERS */}
          {view === 'users' && currentUser.role === 'superadmin' && (
            <Card>
              <h3 className="font-bold mb-4">User Management (Read-Only Demo)</h3>
              <p className="text-sm text-gray-500 mb-4">To manage users, please use phpMyAdmin on your hosting directly.</p>
              <ul>{users.map(u => <li key={u.id} className="border-b py-2 flex justify-between"><span>{u.username}</span><span className="text-gray-500">{u.role}</span></li>)}</ul>
            </Card>
          )}

          {/* VIEW: INTEGRATION */}
          {view === 'integration' && (
             <div className="max-w-4xl mx-auto space-y-8">
               <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                 <div className="relative z-10">
                   <h2 className="text-3xl font-bold mb-4">Developer Integration</h2>
                   <p className="text-indigo-200 max-w-xl">
                     Connect your WHMCS, WooCommerce, or Custom Apps to this QiosLink Server.
                   </p>
                 </div>
                 <Code2 className="absolute right-0 bottom-0 text-indigo-800 opacity-20 -mr-6 -mb-6" size={200} />
               </div>

               {/* Tabs */}
               <div className="flex space-x-4 border-b border-gray-200 overflow-x-auto">
                  <button onClick={() => setIntegrationTab('php')} className={`pb-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 ${integrationTab === 'php' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>PHP API</button>
                  <button onClick={() => setIntegrationTab('whmcs')} className={`pb-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 ${integrationTab === 'whmcs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>WHMCS</button>
                  <button onClick={() => setIntegrationTab('woo')} className={`pb-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 ${integrationTab === 'woo' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>WooCommerce</button>
                  <button onClick={() => setIntegrationTab('shopify')} className={`pb-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 ${integrationTab === 'shopify' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}>Shopify</button>
               </div>

               <div className="min-h-[300px]">
                 {integrationTab === 'php' && (
                    <Card>
                      <h3 className="font-bold text-gray-800 mb-2">Backend API Status</h3>
                      {IS_DEMO_MODE ? (
                         <div className="p-3 bg-yellow-50 text-yellow-800 rounded border border-yellow-200 text-sm">
                            ⚠️ You are running in DEMO MODE (LocalStorage).<br/>
                            To enable real API integration, set <code>IS_DEMO_MODE = false</code> in <code>App.tsx</code> and upload the PHP files.
                         </div>
                      ) : (
                         <div className="p-3 bg-green-50 text-green-800 rounded border border-green-200 text-sm">
                            ✅ PRODUCTION MODE ACTIVE. App is trying to connect to <code>{API_BASE}</code>.
                         </div>
                      )}
                      
                      <p className="text-sm text-gray-500 mt-4 mb-2">API Endpoint for External Apps:</p>
                      <code className="block bg-gray-900 text-white p-3 rounded text-xs font-mono">
                         POST {window.location.origin}/api/create_payment.php
                      </code>
                    </Card>
                 )}

                 {integrationTab === 'whmcs' && (
                    <div className="space-y-4 animate-in fade-in">
                       <Card>
                          <div className="flex items-center space-x-3 mb-4">
                             <div className="bg-blue-100 p-2 rounded-lg text-blue-700"><Package size={20}/></div>
                             <div>
                                <h3 className="font-bold text-gray-800">WHMCS Gateway Module</h3>
                                <p className="text-xs text-gray-500">Gateway Version 1.1</p>
                             </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                             Connect WHMCS to QiosLink with auto-check status via Callback Forwarding.
                          </p>
                          <button className="flex items-center space-x-2 text-blue-600 font-bold hover:underline">
                             <Download size={16}/> <span>Download module_whmcs.txt</span>
                          </button>
                       </Card>
                    </div>
                 )}

                 {integrationTab === 'woo' && (
                    <div className="space-y-4 animate-in fade-in">
                       <Card>
                          <div className="flex items-center space-x-3 mb-4">
                             <div className="bg-purple-100 p-2 rounded-lg text-purple-700"><ShoppingBag size={20}/></div>
                             <div>
                                <h3 className="font-bold text-gray-800">WooCommerce Plugin</h3>
                                <p className="text-xs text-gray-500">WP Plugin Version 1.0</p>
                             </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                             Accept QRIS payments on WordPress. Requires QiosLink backend.
                          </p>
                          <button className="flex items-center space-x-2 text-purple-600 font-bold hover:underline">
                             <Download size={16}/> <span>Download module_woocommerce.txt</span>
                          </button>
                       </Card>
                    </div>
                 )}

                 {integrationTab === 'shopify' && (
                    <div className="space-y-4 animate-in fade-in">
                       <Card>
                          <div className="flex items-center space-x-3 mb-4">
                             <div className="bg-green-100 p-2 rounded-lg text-green-700"><ShoppingCart size={20}/></div>
                             <div>
                                <h3 className="font-bold text-gray-800">Shopify Bridge</h3>
                                <p className="text-xs text-gray-500">API Bridge for Manual Payment</p>
                             </div>
                          </div>
                          <div className="bg-orange-50 border border-orange-200 p-3 rounded mb-4">
                             <p className="text-xs text-orange-800">
                                <strong>Note:</strong> Shopify is a SaaS platform and does not allow uploading PHP files. 
                                This integration uses a "Relay Script" hosted on your QiosLink server to talk to Shopify API.
                             </p>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                             Download the Bridge Script (`shopify_relay.php`) and upload it to your hosting (same place as callback.php).
                          </p>
                          <button className="flex items-center space-x-2 text-green-600 font-bold hover:underline">
                             <Download size={16}/> <span>Download module_shopify.txt</span>
                          </button>
                          <div className="mt-2">
                             <button className="flex items-center space-x-2 text-gray-500 text-sm hover:underline">
                                <FileCode size={14}/> <span>Read README_SHOPIFY.txt</span>
                             </button>
                          </div>
                       </Card>
                    </div>
                 )}
               </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
}