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
  Package
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

// --- Constants ---
const APP_VERSION = "2.3.0";

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

// --- Default Data ---
const DEFAULT_MERCHANT_CONFIG: MerchantConfig = {
  merchantName: "Narpra Digital",
  merchantCode: "QP040887",
  apiKey: "**********",
  qrisString: "00020101021126670016COM.NOBUBANK.WWW01189360050300000907180214905487390387780303UMI51440014ID.CO.QRIS.WWW0215ID20254619920700303UMI5204581753033605802ID5914Narpra Digital6009INDRAMAYU61054521162070703A016304D424",
  callbackUrl: "https://your-domain.com/callback.php"
};

// --- Mock Users for 4 Roles ---
const MOCK_USERS: User[] = [
  {
    id: 'super-01',
    username: 'dev_admin',
    role: 'superadmin',
    merchantConfig: DEFAULT_MERCHANT_CONFIG
  },
  {
    id: 'merchant-01',
    username: 'merchant_user',
    role: 'merchant',
    merchantConfig: { ...DEFAULT_MERCHANT_CONFIG, merchantName: "Warung Kopi Digital" }
  },
  {
    id: 'cs-01',
    username: 'cs_support',
    role: 'cs',
    // CS sees data but doesn't have their own payment config usually
  },
  {
    id: 'user-01',
    username: 'member_budi',
    role: 'user',
    // End user doesn't have config, they only have transaction history
  }
];

// --- Main App ---

export default function App() {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // App State
  const [view, setView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Integration Tab State
  const [integrationTab, setIntegrationTab] = useState<'php' | 'node' | 'whmcs' | 'woo'>('php');
  
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

  // --- Initialization ---
  useEffect(() => {
    // 1. Check Public Payment Link URL Params first
    const params = new URLSearchParams(window.location.search);
    const amountParam = params.get('amount');
    const noteParam = params.get('note');

    if (amountParam) {
      setIsPublicMode(true);
      const amount = parseInt(amountParam, 10);
      const qr = generateDynamicQR(DEFAULT_MERCHANT_CONFIG.qrisString, amount);
      setGeneratedQR(qr);
      setTempAmount(amount.toString());
      setPublicData({
        amount: amount,
        note: noteParam || 'Payment'
      });
      setAuthLoading(false);
      return; 
    }

    // 2. Load LocalStorage Data (Mock DB)
    const savedConfig = localStorage.getItem('qios_config');
    if (savedConfig) setConfig(JSON.parse(savedConfig));

    const savedTx = localStorage.getItem('qios_transactions');
    if (savedTx) {
      setTransactions(JSON.parse(savedTx));
    } else {
      // Init Mock Transactions
      setTransactions([
        { id: 'TRX-101', merchantId: 'super-01', amount: 50000, description: 'Server Maintenance', status: 'paid', createdAt: '2023-10-25 14:30', qrString: '' },
        { id: 'TRX-102', merchantId: 'merchant-01', customerId: 'user-01', amount: 25000, description: 'Kopi Susu Gula Aren', status: 'paid', createdAt: '2023-10-25 15:15', qrString: '' },
        { id: 'TRX-103', merchantId: 'merchant-01', amount: 150000, description: 'Paket Catering', status: 'pending', createdAt: '2023-10-26 09:00', qrString: '' },
      ]);
    }

    // 3. Check Session
    const sessionUser = sessionStorage.getItem('qios_user');
    if (sessionUser) {
      const user = JSON.parse(sessionUser);
      setCurrentUser(user);
      // Determine default view based on role
      if (user.role === 'user') setView('my_orders');
      else setView('dashboard');
    }

    setAuthLoading(false);
  }, []);

  // --- Handlers ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Mock Login Logic
    // In real app, this hits PHP backend
    const foundUser = users.find(u => u.username === loginUser);
    
    // Simple password check (demo: password same as username)
    if (foundUser && loginPass === foundUser.username) {
      setCurrentUser(foundUser);
      sessionStorage.setItem('qios_user', JSON.stringify(foundUser));
      
      if (foundUser.merchantConfig) {
        setConfig(foundUser.merchantConfig);
      }

      // Redirect logic based on role
      if (foundUser.role === 'user') setView('my_orders');
      else setView('dashboard');

    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('qios_user');
    setView('dashboard');
  };

  const handleSaveConfig = () => {
    // Only Superadmin and Merchant can save config
    if (currentUser && (currentUser.role === 'superadmin' || currentUser.role === 'merchant')) {
      const updatedUser = { ...currentUser, merchantConfig: config };
      setCurrentUser(updatedUser);
      sessionStorage.setItem('qios_user', JSON.stringify(updatedUser));
      alert('Configuration saved successfully!');
    }
  };

  const handleGenerateQR = () => {
    setAmountError('');
    if (!tempAmount) {
      setAmountError('Please enter an amount.');
      return;
    }
    const amountNum = Number(tempAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setAmountError('Please enter a valid amount greater than 0.');
      return;
    }

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
    // 1. Superadmin: Sees ALL transactions
    if (currentUser.role === 'superadmin') return true;
    
    // 2. CS: Sees ALL transactions (Support role)
    if (currentUser.role === 'cs') return true;

    // 3. Merchant: Sees only their OWN SALES
    if (currentUser.role === 'merchant') return t.merchantId === currentUser.id;

    // 4. User: Sees only their OWN PURCHASES
    if (currentUser.role === 'user') return t.customerId === currentUser.id;

    return false;
  });

  const filteredTransactions = visibleTransactions.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.amount.toString().includes(searchQuery)
  );

  const chartData = [
    { name: 'Mon', amt: 400000 },
    { name: 'Tue', amt: 300000 },
    { name: 'Wed', amt: 200000 },
    { name: 'Thu', amt: 278000 },
    { name: 'Fri', amt: 189000 },
    { name: 'Sat', amt: 239000 },
    { name: 'Sun', amt: 349000 },
  ];

  // ---------------- RENDER ----------------

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  // 1. PUBLIC PAYMENT PAGE
  // ... (Same as before) ...
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

  // 2. LOGIN PAGE (Same as before)
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-colors shadow-lg shadow-indigo-500/30"
              >
                Login
              </button>

              <div className="text-center text-xs text-gray-400 mt-4 border-t pt-4">
                <p className="mb-1 font-semibold">Demo Accounts (Pass = Username):</p>
                <div className="grid grid-cols-2 gap-2 text-left px-2">
                  <span>• dev_admin (Super)</span>
                  <span>• merchant_user</span>
                  <span>• cs_support</span>
                  <span>• member_budi (User)</span>
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
                <p className="text-xs text-gray-500">
                   {currentUser.role === 'superadmin' && 'Dev Mode'}
                   {currentUser.role === 'merchant' && 'Merchant'}
                   {currentUser.role === 'cs' && 'Support'}
                   {currentUser.role === 'user' && 'Member'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            
            {/* Common for Admin/Merchant/CS */}
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

            {/* Merchant & Superadmin Only */}
            {['superadmin', 'merchant'].includes(currentUser.role) && (
              <SidebarItem 
                active={view === 'terminal'} 
                icon={<Smartphone size={20} />} 
                label="Payment Terminal" 
                onClick={() => setView('terminal')} 
              />
            )}

            {/* Superadmin Only */}
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
            
            {/* User Only */}
            {currentUser.role === 'user' && (
               <SidebarItem 
                active={view === 'my_orders'} 
                icon={<ShoppingBag size={20} />} 
                label="My Orders" 
                onClick={() => setView('my_orders')} 
              />
            )}

            {/* Settings (Except User) */}
            {currentUser.role !== 'user' && (
              <SidebarItem 
                active={view === 'settings'} 
                icon={<Settings size={20} />} 
                label="Settings" 
                onClick={() => setView('settings')} 
              />
            )}

          </nav>

          {/* Footer */}
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
          
          {/* VIEW: DASHBOARD & OTHERS (Skipped for brevity, same as previous) ... */}
          {/* ... */}
          {view === 'dashboard' && (
             <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/20 rounded-lg"><Wallet className="text-white" size={24} /></div>
                      <span className="text-indigo-100 text-sm font-medium">Total Revenue</span>
                    </div>
                    <div className="text-3xl font-bold">Rp {visibleTransactions.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}</div>
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

          {view === 'history' && (
             <Card>
                <div className="flex justify-between mb-4"><h3 className="font-bold">Transaction History</h3></div>
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="border-b"><th className="pb-2">ID</th><th className="pb-2">Desc</th><th className="pb-2">Amount</th><th className="pb-2">Status</th></tr></thead>
                  <tbody>{filteredTransactions.map(t => (
                     <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 text-sm">{t.id}</td>
                        <td className="py-3 text-sm">{t.description}</td>
                        <td className="py-3 font-bold">{formatRupiah(t.amount)}</td>
                        <td className="py-3"><span className={`px-2 py-1 rounded text-xs ${t.status==='paid'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{t.status}</span></td>
                     </tr>
                  ))}</tbody>
                </table>
                </div>
             </Card>
          )}

          {view === 'terminal' && (
             <div className="max-w-md mx-auto">
               <Card>
                  <h3 className="font-bold mb-4">Manual QR Generation</h3>
                  <input type="number" value={tempAmount} onChange={e=>setTempAmount(e.target.value)} className="w-full border p-2 rounded mb-4" placeholder="Amount" />
                  <button onClick={handleGenerateQR} className="w-full bg-indigo-600 text-white py-2 rounded">Generate</button>
                  {generatedQR && <div className="mt-4 flex justify-center"><QRCodeDisplay data={generatedQR} /></div>}
               </Card>
             </div>
          )}
          
          {view === 'settings' && (
             <div className="max-w-2xl mx-auto">
               <Card>
                 <h3 className="font-bold mb-4">Settings</h3>
                 <div className="space-y-4">
                    <div><label className="block text-sm">Merchant Name</label><input type="text" className="w-full border p-2 rounded" value={config.merchantName} onChange={e=>setConfig({...config, merchantName:e.target.value})} /></div>
                    <div><label className="block text-sm">Static QR String</label><textarea className="w-full border p-2 rounded text-xs font-mono" rows={3} value={config.qrisString} onChange={e=>setConfig({...config, qrisString:e.target.value})} /></div>
                    <button onClick={handleSaveConfig} className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
                 </div>
               </Card>
             </div>
          )}

          {view === 'users' && currentUser.role === 'superadmin' && (
            <Card>
              <h3 className="font-bold mb-4">User List</h3>
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
                     Download ready-to-use modules for WHMCS and WooCommerce.
                   </p>
                 </div>
                 <Code2 className="absolute right-0 bottom-0 text-indigo-800 opacity-20 -mr-6 -mb-6" size={200} />
               </div>

               {/* Tabs */}
               <div className="flex space-x-4 border-b border-gray-200 overflow-x-auto">
                  <button onClick={() => setIntegrationTab('php')} className={`pb-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 ${integrationTab === 'php' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>PHP API</button>
                  <button onClick={() => setIntegrationTab('node')} className={`pb-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 ${integrationTab === 'node' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Node.js</button>
                  <button onClick={() => setIntegrationTab('whmcs')} className={`pb-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 ${integrationTab === 'whmcs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>WHMCS Module</button>
                  <button onClick={() => setIntegrationTab('woo')} className={`pb-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 ${integrationTab === 'woo' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>WooCommerce</button>
               </div>

               <div className="min-h-[300px]">
                 {integrationTab === 'php' && (
                    <Card>
                      <h3 className="font-bold text-gray-800 mb-2">Backend API Code</h3>
                      <p className="text-sm text-gray-500 mb-4">Core files for your cPanel/Shared Hosting.</p>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-white text-xs font-mono">
                         See `backend_php.txt` for the updated code supporting external callbacks.
                      </div>
                    </Card>
                 )}

                 {integrationTab === 'node' && (
                    <Card>
                      <h3 className="font-bold text-gray-800 mb-2">Node.js / JS Integration</h3>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
{`// Generate QR logic is in utils/qrisUtils.ts`}
                      </pre>
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
                             This module connects your WHMCS to this QiosLink Engine. It supports auto-check status via Callback Forwarding.
                          </p>
                          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4 text-sm">
                             <strong>Installation:</strong><br/>
                             1. Download `module_whmcs.txt`.<br/>
                             2. Create folder `/modules/gateways/qioslink/`.<br/>
                             3. Follow instructions inside the text file.
                          </div>
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
                             Accept QRIS payments on your WordPress store. Requires QiosLink backend to be running.
                          </p>
                          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4 text-sm">
                             <strong>Installation:</strong><br/>
                             1. Download `module_woocommerce.txt`.<br/>
                             2. Save as `woo-qioslink.php`.<br/>
                             3. Upload to `/wp-content/plugins/` and activate.
                          </div>
                          <button className="flex items-center space-x-2 text-purple-600 font-bold hover:underline">
                             <Download size={16}/> <span>Download module_woocommerce.txt</span>
                          </button>
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