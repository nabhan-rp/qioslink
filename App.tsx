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
  X
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
import { MerchantConfig, ViewState, Transaction } from './types';
import { generateDynamicQR, formatRupiah } from './utils/qrisUtils';
import { QRCodeDisplay } from './components/QRCodeDisplay';

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
const DEFAULT_CONFIG: MerchantConfig = {
  merchantName: "Narpra Digital",
  merchantCode: "QP040887",
  apiKey: "**********",
  qrisString: "00020101021126670016COM.NOBUBANK.WWW01189360050300000907180214905487390387780303UMI51440014ID.CO.QRIS.WWW0215ID20254619920700303UMI5204581753033605802ID5914Narpra Digital6009INDRAMAYU61054521162070703A016304D424",
  callbackUrl: "https://your-domain.com/hooks/qiospay"
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [config, setConfig] = useState<MerchantConfig>(DEFAULT_CONFIG);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tempAmount, setTempAmount] = useState<string>('');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  
  // New States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isPublicMode, setIsPublicMode] = useState(false);
  const [publicData, setPublicData] = useState<{amount: number, note: string} | null>(null);

  // Mock Data for Charts
  const chartData = [
    { name: 'Mon', amt: 400000 },
    { name: 'Tue', amt: 300000 },
    { name: 'Wed', amt: 200000 },
    { name: 'Thu', amt: 278000 },
    { name: 'Fri', amt: 189000 },
    { name: 'Sat', amt: 239000 },
    { name: 'Sun', amt: 349000 },
  ];

  // Load from LocalStorage and Check URL Params
  useEffect(() => {
    // 1. Load Config
    const savedConfig = localStorage.getItem('qios_config');
    let currentConfig = DEFAULT_CONFIG;
    if (savedConfig) {
      currentConfig = JSON.parse(savedConfig);
      setConfig(currentConfig);
    }
    
    // 2. Load Mock Transactions
    if (transactions.length === 0) {
      setTransactions([
        { id: 'TRX-9981', amount: 50000, description: 'Web Hosting - Paket A', status: 'paid', createdAt: '2023-10-25 14:30', qrString: generateDynamicQR(currentConfig.qrisString, 50000) },
        { id: 'TRX-9982', amount: 150000, description: 'Topup Game', status: 'pending', createdAt: '2023-10-25 15:15', qrString: generateDynamicQR(currentConfig.qrisString, 150000) },
      ]);
    }

    // 3. Check for Public Payment Link (Query Params)
    // Example: ?amount=50000&note=PaymentForInvoice123
    const params = new URLSearchParams(window.location.search);
    const amountParam = params.get('amount');
    const noteParam = params.get('note');

    if (amountParam) {
      setIsPublicMode(true);
      const amount = parseInt(amountParam, 10);
      const qr = generateDynamicQR(currentConfig.qrisString, amount);
      setGeneratedQR(qr);
      setTempAmount(amount.toString());
      setPublicData({
        amount: amount,
        note: noteParam || 'Payment'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveConfig = () => {
    localStorage.setItem('qios_config', JSON.stringify(config));
    alert('Configuration saved successfully!');
  };

  const handleGenerateQR = () => {
    if (!tempAmount || isNaN(Number(tempAmount))) return;
    const dynamicString = generateDynamicQR(config.qrisString, Number(tempAmount));
    setGeneratedQR(dynamicString);
    
    // Add to mock history
    const newTrx: Transaction = {
      id: `TRX-${Math.floor(Math.random() * 10000)}`,
      amount: Number(tempAmount),
      description: 'Manual Generation via Dashboard',
      status: 'pending',
      createdAt: new Date().toLocaleString(),
      qrString: dynamicString
    };
    setTransactions(prev => [newTrx, ...prev]);
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

  const filteredTransactions = transactions.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.amount.toString().includes(searchQuery)
  );

  // --- PUBLIC MODE RENDER ---
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
             <p className="text-xs text-gray-400">
               Scan this QRIS with GoPay, OVO, Dana, LinkAja, ShopeePay, or Mobile Banking.
             </p>
             <div className="mt-4 text-xs text-gray-300 font-mono">
               Merchant ID: {config.merchantCode}
             </div>
          </div>
        </div>
        <div className="mt-8 text-gray-400 text-sm">
           Powered by <span className="font-semibold text-gray-600">QiosLink</span>
        </div>
      </div>
    );
  }

  // --- DASHBOARD MODE RENDER ---
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
                <p className="text-xs text-gray-500">Dynamic QR Engine</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <SidebarItem 
              active={view === 'dashboard'} 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
              onClick={() => setView('dashboard')} 
            />
            <SidebarItem 
              active={view === 'terminal'} 
              icon={<Smartphone size={20} />} 
              label="Payment Terminal" 
              onClick={() => setView('terminal')} 
            />
            <SidebarItem 
              active={view === 'history'} 
              icon={<History size={20} />} 
              label="Transactions" 
              onClick={() => setView('history')} 
            />
             <SidebarItem 
              active={view === 'integration'} 
              icon={<Code2 size={20} />} 
              label="Integration API" 
              onClick={() => setView('integration')} 
            />
            <SidebarItem 
              active={view === 'settings'} 
              icon={<Settings size={20} />} 
              label="Settings" 
              onClick={() => setView('settings')} 
            />
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
             <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
              {view === 'terminal' ? 'Payment Terminal' : view}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end hidden md:block">
              <span className="text-sm font-semibold text-gray-800">{config.merchantName}</span>
              <span className="text-xs text-gray-500">{config.merchantCode}</span>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
              {config.merchantName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          {/* VIEW: DASHBOARD */}
          {view === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-white/20 rounded-lg"><Wallet className="text-white" size={24} /></div>
                    <span className="text-indigo-100 text-sm font-medium">Today's Revenue</span>
                  </div>
                  <div className="text-3xl font-bold">Rp 2,450,000</div>
                  <div className="mt-2 text-indigo-100 text-sm flex items-center">
                    <CheckCircle2 size={16} className="mr-1" /> 12 Successful Transactions
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-100 rounded-lg"><CheckCircle2 className="text-green-600" size={24} /></div>
                    <span className="text-gray-500 text-sm font-medium">Success Rate</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">98.5%</div>
                  <div className="mt-2 text-green-600 text-sm font-medium">
                    +2.1% from last week
                  </div>
                </Card>

                <Card>
                   <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg"><History className="text-orange-600" size={24} /></div>
                    <span className="text-gray-500 text-sm font-medium">Pending</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">Rp 150,000</div>
                  <div className="mt-2 text-orange-600 text-sm font-medium">
                    3 transactions waiting
                  </div>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="h-96">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Overview</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="amt" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>

                 <Card className="h-96">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Transactions</h3>
                  <div className="overflow-y-auto h-[80%] pr-2">
                    {transactions.map((trx) => (
                      <button 
                        key={trx.id} 
                        onClick={() => setSelectedTransaction(trx)}
                        className="w-full text-left flex items-center justify-between p-4 mb-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${trx.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {trx.status === 'paid' ? <CheckCircle2 size={18} /> : <History size={18} />}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{trx.id}</div>
                            <div className="text-xs text-gray-500">{trx.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800">{formatRupiah(trx.amount)}</div>
                          <div className="text-xs text-gray-500">{trx.createdAt}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {view === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Merchant Configuration</h3>
                  <p className="text-sm text-gray-500">Configure your Qiospay / Nobu Bank credentials here.</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        value={config.merchantName}
                        onChange={(e) => setConfig({...config, merchantName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Code</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        value={config.merchantCode}
                        onChange={(e) => setConfig({...config, merchantCode: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      value={config.apiKey}
                      onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Static QR String (Source)</label>
                    <textarea 
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-xs text-gray-600"
                      value={config.qrisString}
                      onChange={(e) => setConfig({...config, qrisString: e.target.value})}
                      placeholder="00020101021126670016COM.NOBUBANK..."
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Copy the full string from your Qiospay dashboard. This will be used as the base for dynamic generation.
                    </p>
                  </div>

                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Callback URL (Webhook)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      value={config.callbackUrl}
                      onChange={(e) => setConfig({...config, callbackUrl: e.target.value})}
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={handleSaveConfig}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/30"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* VIEW: TERMINAL / PAYMENT GENERATOR */}
          {view === 'terminal' && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className="bg-indigo-600 text-white border-none">
                  <h3 className="text-xl font-bold mb-2">Generate Dynamic QR</h3>
                  <p className="text-indigo-100 text-sm">Create a specific amount QRIS for customer payment.</p>
                </Card>

                <Card>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Amount (Rp)</label>
                  <div className="relative mb-6">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                    <input 
                      type="number" 
                      className="w-full pl-12 pr-4 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all placeholder-gray-300"
                      placeholder="0"
                      value={tempAmount}
                      onChange={(e) => setTempAmount(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                     {[10000, 25000, 50000, 100000].map(amt => (
                       <button 
                        key={amt}
                        onClick={() => setTempAmount(amt.toString())}
                        className="py-2 px-3 bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:border-indigo-200"
                       >
                         {amt / 1000}k
                       </button>
                     ))}
                  </div>

                  <button 
                    onClick={handleGenerateQR}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
                  >
                    Generate QRIS
                  </button>
                </Card>
              </div>

              <div className="flex flex-col items-center justify-center space-y-6">
                {generatedQR ? (
                  <div className="animate-fade-in-up w-full max-w-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex justify-between items-center mb-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png" alt="QRIS" className="h-8 object-contain" />
                        <span className="font-bold text-gray-800">NMID: {config.merchantCode}</span>
                      </div>
                      
                      <div className="flex justify-center mb-6">
                        <QRCodeDisplay data={generatedQR} />
                      </div>

                      <div className="text-center space-y-1 border-t border-dashed border-gray-200 pt-4">
                        <p className="text-gray-500 text-sm">Total Payment</p>
                        <h2 className="text-3xl font-extrabold text-indigo-900">{formatRupiah(Number(tempAmount))}</h2>
                      </div>
                      
                      <div className="mt-6 flex space-x-3">
                         <button 
                          onClick={() => copyToClipboard(generatedQR)}
                          className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium text-sm transition-colors"
                         >
                           <Copy size={16} />
                           <span>Copy</span>
                         </button>
                         <button 
                          onClick={() => generatePaymentLink(null, Number(tempAmount))}
                          className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 font-medium text-sm transition-colors"
                         >
                           <Share2 size={16} />
                           <span>Share Link</span>
                         </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-12 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                    <QrCode size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">No QR Generated</h3>
                    <p className="text-sm text-gray-400">Enter an amount and click generate</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: INTEGRATION */}
          {view === 'integration' && (
             <div className="max-w-4xl mx-auto space-y-8">
               <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                 <div className="relative z-10">
                   <h2 className="text-3xl font-bold mb-4">Developer Integration</h2>
                   <p className="text-indigo-200 max-w-xl">
                     Integrate QiosLink Dynamic QRIS into your WHMCS, WooCommerce, or Custom Application. 
                     We provide a simple REST API wrapper logic you can host.
                   </p>
                 </div>
                 <Code2 className="absolute right-0 bottom-0 text-indigo-800 opacity-20 -mr-6 -mb-6" size={200} />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* PHP Example */}
                 <Card>
                   <div className="flex items-center space-x-3 mb-4">
                     <div className="bg-purple-100 p-2 rounded-lg text-purple-700 font-bold text-xs">PHP</div>
                     <h3 className="font-bold text-gray-800">WHMCS / Raw PHP Integration</h3>
                   </div>
                   <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                     <pre className="text-xs text-green-400 font-mono">
{`<?php
function generate_nobu_dynamic($amount) {
  $static_qr = "${config.qrisString.substring(0, 20)}...";
  
  // Logic to inject tag 54 (Amount)
  // Logic to recalc CRC16
  
  return $dynamic_qr_string;
}

// Usage
$qr = generate_nobu_dynamic(150000);
echo "<img src='https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=$qr'/>";
?>`}
                     </pre>
                   </div>
                   <p className="mt-4 text-sm text-gray-500">
                     Copy the `crc16` and `formatField` logic from our dashboard `utils/qrisUtils.ts` to your PHP backend to generate strings on the fly without external dependencies.
                   </p>
                 </Card>

                 {/* NodeJS Example */}
                 <Card>
                   <div className="flex items-center space-x-3 mb-4">
                     <div className="bg-green-100 p-2 rounded-lg text-green-700 font-bold text-xs">NodeJS</div>
                     <h3 className="font-bold text-gray-800">WooCommerce / Shopify App</h3>
                   </div>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                     <pre className="text-xs text-blue-400 font-mono">
{`import { generateDynamicQR } from './qios-sdk';

const staticString = process.env.QIOS_STATIC_QR;

app.post('/create-payment', (req, res) => {
  const { amount } = req.body;
  
  // Generate on server side
  const qrData = generateDynamicQR(staticString, amount);
  
  res.json({
    success: true,
    qr_string: qrData,
    qr_image: \`https://api.qrserver.com/...\`
  });
});`}
                     </pre>
                   </div>
                   <p className="mt-4 text-sm text-gray-500">
                     For Node environments, you can use the exact TypeScript logic used in this dashboard.
                   </p>
                 </Card>
               </div>
               
               <Card>
                 <h3 className="font-bold text-gray-800 mb-4">Webhook Configuration</h3>
                 <p className="text-sm text-gray-600 mb-4">
                   Since Qiospay sends callbacks to a single URL, you need a router script to handle multiple dynamic payments.
                 </p>
                 <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                   <strong>Tip:</strong> Use the "Reference ID" (RRN) in the callback to match against your database of generated amounts and timestamps.
                 </div>
               </Card>
             </div>
          )}

          {/* VIEW: HISTORY */}
          {view === 'history' && (
            <Card>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="text-lg font-bold text-gray-800">Transaction History</h3>
                <div className="relative w-full md:w-64">
                   <input 
                     type="text" 
                     placeholder="Search transactions..."
                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                      <th className="pb-3 pl-2">ID</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Amount</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredTransactions.map((trx) => (
                      <tr 
                        key={trx.id} 
                        onClick={() => setSelectedTransaction(trx)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <td className="py-4 pl-2 font-mono text-xs text-indigo-600 font-bold group-hover:underline">{trx.id}</td>
                        <td className="py-4 text-sm text-gray-700">{trx.description}</td>
                        <td className="py-4 text-xs text-gray-500">{trx.createdAt}</td>
                        <td className="py-4 text-sm font-bold text-gray-800 text-right">{formatRupiah(trx.amount)}</td>
                        <td className="py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            trx.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {trx.status}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                           <button 
                             onClick={(e) => {
                               e.stopPropagation(); // Prevent row click
                               setSelectedTransaction(trx);
                             }}
                             className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                             title="View Details"
                           >
                             <Eye size={18} />
                           </button>
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400 text-sm">
                          No transactions found matching "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
}