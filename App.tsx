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
  ToggleRight,
  HelpCircle as QuestionMark,
  MinusCircle
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
const APP_VERSION = "4.8.9 (Enterprise Stable)";

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

// --- HELPER: CHECK BOOLEAN LOOSELY ---
const isTrue = (val: any) => val === true || val === '1' || val === 1 || val === 'true';

// --- DEFAULT AUTH CONFIG ---
const DEFAULT_AUTH_CONFIG: AuthConfig = {
    verifyEmail: true,
    verifyWhatsapp: false,
    verifyKyc: false,
    waProvider: 'fonnte',
    loginMethod: 'standard',
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
  const needsEmail = user.merchantConfig?.auth?.verifyEmail && !isTrue(user.isVerified);
  const needsPhone = user.merchantConfig?.auth?.verifyWhatsapp && !isTrue(user.isPhoneVerified);
  
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

// --- LANDING PAGE COMPONENT (RESTORED V4.8 DESIGN) ---
const LandingPage = ({ onLogin, onRegister }: { onLogin: () => void, onRegister: () => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <a href="#options" className="hover:text-indigo-600 transition-colors">Pricing & Hosting</a>
              <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
              <a href="https://github.com/nabhan-rp/qioslink" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                <Github size={16} /> Open Source
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button onClick={onLogin} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Log In</button>
              <button onClick={onRegister} className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2">
                Get Started <ArrowRight size={16}/>
              </button>
            </div>

            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
            <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top-2 shadow-xl">
                <div className="px-4 pt-2 pb-6 space-y-2">
                    <a href="#options" onClick={()=>setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg">Pricing & Hosting</a>
                    <a href="#features" onClick={()=>setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg">Features</a>
                    <button onClick={() => { setMobileMenuOpen(false); onLogin(); }} className="w-full text-center px-4 py-3 text-sm font-bold text-gray-600 border border-gray-200 rounded-xl mt-2">Log In</button>
                    <button onClick={() => { setMobileMenuOpen(false); onRegister(); }} className="w-full text-center px-4 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg mt-2">Get Started</button>
                </div>
            </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-6 border border-indigo-200 animate-in fade-in slide-in-from-bottom-4 duration-700 uppercase tracking-wide">
              <Zap size={12} fill="currentColor" /> UNIVERSAL SMTP ENGINE ADDED
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 leading-tight">
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

        {/* FEATURES GRID (V4.8 Design) */}
        <section id="features" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">What's New in v4.8</h2>
                    <p className="mt-4 text-gray-500">Major security and usability updates for enterprise needs.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6"><ScanFace size={24}/></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Automated KYC</h3>
                        <p className="text-gray-500">Verify merchant identities instantly using Didit.me integration. Support for ID Cards and Liveness check.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6"><Globe size={24}/></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Social Login</h3>
                        <p className="text-gray-500">Seamless login experience using Google, Facebook, and GitHub accounts. Zero friction onboarding.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6"><Phone size={24}/></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">WhatsApp 2FA</h3>
                        <p className="text-gray-500">Secure your dashboard with OTP sent via WhatsApp. Supports passwordless login flow.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* PRICING/DEPLOYMENT OPTIONS (V4.8 Design) */}
        <section id="options" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-4"><span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Choose Your Deployment</span></div>
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Cloud Service vs Self-Hosted</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">Use QiosLink directly as a service (SaaS) or host the source code yourself on JajanServer infrastructure.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {/* Cloud SaaS Card */}
                    <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col hover:scale-105 transition-transform duration-300 shadow-2xl shadow-indigo-900/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Cloud size={120}/></div>
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-6 backdrop-blur-sm"><Cloud size={24} className="text-white"/></div>
                        <h3 className="text-2xl font-bold mb-1">Cloud SaaS</h3>
                        <p className="text-indigo-200 text-sm font-mono mb-6">bayar.jajanan.online</p>
                        <p className="text-indigo-100 mb-8 flex-grow leading-relaxed">The easiest way to start. No installation needed. Register account, input your QRIS, and start accepting payments instantly. Multi-tenant support included.</p>
                        <ul className="space-y-3 mb-8 text-sm font-medium text-indigo-100">
                            <li className="flex items-center gap-2"><Check size={16} className="text-yellow-400"/> Zero Maintenance</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-yellow-400"/> Instant Activation</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-yellow-400"/> Free & Pro Plans</li>
                        </ul>
                        <button onClick={onRegister} className="w-full py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">Register Now</button>
                    </div>

                    {/* Self Host Free Card */}
                    <div className="bg-white rounded-3xl p-8 text-gray-800 relative overflow-hidden flex flex-col border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Server size={120}/></div>
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-6 text-emerald-600"><Zap size={24}/></div>
                        <h3 className="text-2xl font-bold mb-1">Self-Host (Free)</h3>
                        <p className="text-gray-400 text-sm font-mono mb-6">freehosting.jajanserver.com</p>
                        <p className="text-gray-500 mb-8 flex-grow leading-relaxed">Perfect for students, testing, or small projects. Get a free subdomain and cPanel to host the QiosLink source code yourself.</p>
                        <ul className="space-y-3 mb-8 text-sm font-medium text-gray-500">
                            <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500"/> 0 Cost / Lifetime</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500"/> Free SSL Certificate</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500"/> Open Source Control</li>
                        </ul>
                        <a href="https://freehosting.jajanserver.com/" target="_blank" rel="noreferrer" className="w-full py-4 bg-white border border-emerald-500 text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-colors text-center">Get Free Host</a>
                    </div>

                    {/* Self Host Paid Card */}
                    <div className="bg-white rounded-3xl p-8 text-gray-800 relative overflow-hidden flex flex-col border border-gray-200 hover:border-yellow-400 transition-colors">
                        <div className="absolute top-4 right-4"><span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded border border-yellow-200">ENTERPRISE</span></div>
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-6 text-yellow-600"><Rocket size={24}/></div>
                        <h3 className="text-2xl font-bold mb-1">Self-Host (Paid)</h3>
                        <p className="text-gray-400 text-sm font-mono mb-6">jajanserver.com</p>
                        <p className="text-gray-500 mb-8 flex-grow leading-relaxed">For serious businesses. High-performance NVMe cloud hosting to run your QiosLink instance with maximum speed and uptime.</p>
                        <ul className="space-y-3 mb-8 text-sm font-medium text-gray-500">
                            <li className="flex items-center gap-2"><Check size={16} className="text-yellow-500"/> 99.9% Uptime SLA</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-yellow-500"/> Priority Support</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-yellow-500"/> Daily Backups</li>
                        </ul>
                        <a href="https://jajanserver.com/" target="_blank" rel="noreferrer" className="w-full py-4 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-colors text-center shadow-lg shadow-yellow-500/20">View Plans</a>
                    </div>
                </div>

                <div className="text-center mb-16 pt-8 border-t border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why QiosLink?</h2>
                    <p className="text-gray-500">The ultimate payment solution.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6"><Server size={24}/></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Self Hosted</h3>
                        <p className="text-gray-500 leading-relaxed">Host it on JajanServer or your own VPS. Supports cPanel, DirectAdmin, and even Free Hosting providers.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6"><Palette size={24}/></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">White Label Branding</h3>
                        <p className="text-gray-500 leading-relaxed">Use your own logo, brand colors, and Custom Domain (CNAME). Make it look like your own bank.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6"><Code2 size={24}/></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Integration</h3>
                        <p className="text-gray-500 leading-relaxed">Ready-to-use modules for WHMCS and WooCommerce. JSON API available for custom apps.</p>
                    </div>
                </div>
            </div>
        </section>
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
                &copy; 2026 Open Source Project by <a href="https://github.com/nabhan-rp" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">Nabhan Rafli</a>. Licensed under MIT. Sponsored by <a href="https://www.jajanserver.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-bold">JajanServer</a>.
             </p>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
              <a href="https://qioslink-demo.orgz.top/?i=1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"><PlayCircle size={16}/> Live Demo</a>
              <a href="https://bayar.jajanan.online/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"><Cloud size={16}/> Cloud Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ... (Helper Components: SidebarItem, Card, TransactionModal - Keeping Existing) ...
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
  // ... (States remain the same) ...
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
  const [systemConfig, setSystemConfig] = useState<AuthConfig>(DEFAULT_AUTH_CONFIG);
  const [loginMode, setLoginMode] = useState<'standard' | 'whatsapp' | 'social'>('standard'); 
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [forgotStep, setForgotStep] = useState<'input' | 'method' | 'verify' | 'reset'>('input');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotMethods, setForgotMethods] = useState<{has_wa: boolean, phone_masked: string, has_email: boolean, email_masked: string} | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'wa' | 'email'>('email');
  const [forgotOtp, setForgotOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { initialize(); }, []);

  useEffect(() => {
      if (systemConfig?.loginMethod === 'whatsapp_otp') {
          setLoginMode('whatsapp');
      }
  }, [systemConfig]); 

  // --- REFRESH SESSION ON TAB CHANGE (Fix Sync Issue) ---
  useEffect(() => {
      if (!IS_DEMO_MODE && currentUser && (view === 'settings' || view === 'dashboard')) {
          refreshSession();
      }
  }, [view]);

  const refreshSession = async () => {
      if (!currentUser) return;
      try {
          // BUG FIX 2: Use new endpoint specifically for refreshing user data
          // This works for ALL roles (including 'user')
          const res = await fetch(`${API_BASE}/refresh_user.php`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ user_id: currentUser.id })
          });
          const data = await res.json();
          if (data.success && data.user) {
              const updatedUser = { ...data.user, merchantConfig: data.user.merchantConfig || currentUser.merchantConfig };
              sessionStorage.setItem('qios_user', JSON.stringify(updatedUser));
              setCurrentUser(updatedUser);
          }
      } catch (e) {
          console.error("Failed to refresh session", e);
      }
  };

  // ... (Keep existing Initialize and Poll Logic) ...
  useEffect(() => {
    let interval: any;
    if (isPublicMode && publicData?.status === 'pending' && !IS_DEMO_MODE) {
      interval = setInterval(() => {
        handlePublicCheck(true); // Silent check (no alert)
      }, 10000); 
    }
    return () => clearInterval(interval);
  }, [isPublicMode, publicData?.status]);

  const initialize = async () => {
    setAuthLoading(true);
    if (IS_DEMO_MODE) {
        const savedSysConfig = localStorage.getItem('qios_system_config');
        if (savedSysConfig) {
            setSystemConfig(JSON.parse(savedSysConfig));
        } else {
            const mockAdminConfig = MOCK_USERS.find(u => u.role === 'superadmin')?.merchantConfig?.auth;
            if(mockAdminConfig) setSystemConfig(mockAdminConfig);
        }
        const savedUsers = localStorage.getItem('qios_users');
        if (savedUsers) {
            const parsed = JSON.parse(savedUsers);
            const combined = [...MOCK_USERS, ...parsed.filter((u:User) => !MOCK_USERS.find(m => m.id === u.id))];
            setUsers(combined);
        }
    } else {
        try {
            const res = await fetch(`${API_BASE}/get_public_config.php`);
            const data = await res.json();
            if (data.success && data.config) {
                setSystemConfig(data.config);
            }
        } catch (e) {
            console.error("Failed to load public config", e);
        }
    }

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
      // ... (No changes here)
      if (!publicData?.trx_id || !publicData?.merchant_id) return;
      if (IS_DEMO_MODE) return;
      if (!silent) setIsCheckingPublic(true);
      try {
          const res = await fetch(`${API_BASE}/check_mutation.php`, {
              method: 'POST', headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ trx_id: publicData.trx_id, merchant_id: publicData.merchant_id })
          });
          const params = new URLSearchParams(window.location.search);
          const token = params.get('pay');
          if (token) {
               const resDetails = await fetch(`${API_BASE}/get_payment_details.php?token=${token}`);
               const data = await resDetails.json();
               if (data.success) {
                   setPublicData(data.data);
                   if (data.data.status === 'paid' && !silent) alert("Payment Confirmed!");
               }
          }
      } catch (e: any) { if (!silent) alert("Check Failed: " + e.message); } finally { if (!silent) setIsCheckingPublic(false); }
  };

  const handleCheckStatus = async (trx: Transaction) => {
      if(IS_DEMO_MODE) {
          setTransactions(transactions.map(t => t.id === trx.id ? {...t, status: 'paid'} : t));
          alert("Status Updated (Demo)"); setSelectedTransaction(null); return;
      }
      setApiLoading(true);
      try {
          const res = await fetch(`${API_BASE}/check_mutation.php`, {
              method: 'POST', headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ trx_id: trx.id, merchant_id: trx.merchantId })
          });
          const data = await res.json();
          if(data.status === 'success') { alert(data.message); fetchTransactions(currentUser!); setSelectedTransaction(null); } 
          else { alert(data.message || 'Status still pending'); }
      } catch(e) { alert("Error checking mutation"); } finally { setApiLoading(false); }
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

  const handleUpdateConfig = async () => { 
      setApiLoading(true); 
      if (currentUser) { 
          const updatedUser = { ...currentUser, merchantConfig: config }; 
          if (IS_DEMO_MODE) { 
              setCurrentUser(updatedUser); 
              sessionStorage.setItem('qios_user', JSON.stringify(updatedUser)); 
              if (currentUser.role === 'superadmin' && config.auth) {
                  localStorage.setItem('qios_system_config', JSON.stringify(config.auth));
                  setSystemConfig(config.auth); 
              }
              alert('Saved'); 
          } else { 
              try { 
                  const res = await fetch(`${API_BASE}/update_config.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ user_id: currentUser.id, config: config }) }); 
                  const text = await res.text();
                  try {
                      const data = JSON.parse(text); 
                      if (data.success) { 
                          setCurrentUser(updatedUser); 
                          sessionStorage.setItem('qios_user', JSON.stringify(updatedUser)); 
                          alert('Saved'); 
                      } else alert(data.message); 
                  } catch(e) { alert("Invalid JSON response: " + text); }
              } catch (e) { alert('Connection Error'); } 
          } 
      } 
      setApiLoading(false); 
  };
  
  // ... (Other handlers like verifyEmail, resendOtp, etc. remain the same) ...
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
              const errorDetail = data.debug ? "\nDetail: " + JSON.stringify(data.debug) : "";
              alert("Failed to start KYC: " + (data.message || "Unknown error") + errorDetail);
          }
      } catch (e) {
          alert("Didit.me is not configured properly or connection failed.");
      } finally {
          setApiLoading(false);
      }
  };

  // ... (Forgot Password Handlers - truncated for brevity) ...
  const handleForgotCheck = async (e: React.FormEvent) => { e.preventDefault(); setApiLoading(true); if(IS_DEMO_MODE) { setTimeout(() => { setForgotMethods({has_wa: true, phone_masked: "081****789", has_email: true, email_masked: "ad***@example.com"}); setForgotStep('method'); setApiLoading(false); }, 500); } else { try { const res = await fetch(`${API_BASE}/forgot_password.php?action=check`, { method: 'POST', body: JSON.stringify({ identifier: forgotIdentifier }) }); const data = await res.json(); if(data.success) { setForgotMethods(data.methods); setForgotStep('method'); if(!data.methods.has_wa) setSelectedMethod('email'); } else alert(data.message); } catch(e) { alert("Connection error"); } finally { setApiLoading(false); } } };
  const handleForgotSend = async () => { setApiLoading(true); if(IS_DEMO_MODE) { if(selectedMethod === 'wa') { alert("OTP: 123456 (Demo)"); setForgotStep('verify'); } else { alert("Link sent to email (Demo)"); setShowForgotPass(false); setForgotStep('input'); } setApiLoading(false); } else { try { const res = await fetch(`${API_BASE}/forgot_password.php?action=send`, { method: 'POST', body: JSON.stringify({ identifier: forgotIdentifier, method: selectedMethod }) }); const data = await res.json(); if(data.success) { if(selectedMethod === 'wa') { setForgotStep('verify'); } else { alert(data.message); setShowForgotPass(false); setForgotStep('input'); } } else alert(data.message); } catch(e) { alert("Error"); } finally { setApiLoading(false); } } };
  const handleForgotVerify = async () => { setApiLoading(true); if(IS_DEMO_MODE) { if(forgotOtp === '123456') { setForgotStep('reset'); setResetToken('demo-token'); } else alert('Invalid OTP'); setApiLoading(false); } else { try { const res = await fetch(`${API_BASE}/forgot_password.php?action=verify`, { method: 'POST', body: JSON.stringify({ identifier: forgotIdentifier, otp: forgotOtp }) }); const data = await res.json(); if(data.success) { setResetToken(data.token); setForgotStep('reset'); } else alert(data.message); } catch(e) { alert("Error"); } finally { setApiLoading(false); } } };
  const handleForgotReset = async (e: React.FormEvent) => { e.preventDefault(); if(newPass !== confirmNewPass) return alert("Password mismatch"); setApiLoading(true); if(IS_DEMO_MODE) { alert("Password Reset Success (Demo)"); setShowForgotPass(false); setForgotStep('input'); setForgotIdentifier(''); setApiLoading(false); } else { try { const res = await fetch(`${API_BASE}/forgot_password.php?action=reset`, { method: 'POST', body: JSON.stringify({ token: resetToken, password: newPass }) }); const data = await res.json(); if(data.success) { alert("Password changed successfully. Please login."); setShowForgotPass(false); setForgotStep('input'); setForgotIdentifier(''); } else alert(data.message); } catch(e) { alert("Error"); } finally { setApiLoading(false); } } };

  const handleLogout = () => { setCurrentUser(null); sessionStorage.removeItem('qios_user'); setShowLanding(true); setTransactions([]); };
  const handleLogin = async (e: React.FormEvent) => { e.preventDefault(); setLoginError(''); setApiLoading(true); if (IS_DEMO_MODE) { let allUsers = [...users]; const savedUsers = localStorage.getItem('qios_users'); if (savedUsers) { const parsed = JSON.parse(savedUsers); allUsers = [...MOCK_USERS, ...parsed.filter((u:User) => !MOCK_USERS.find(m => m.id === u.id))]; } const foundUser = allUsers.find(u => u.username === loginUser); if (loginUser === 'admin' && loginPass === 'admin') loginSuccess(MOCK_USERS[0]); else if (foundUser && loginPass === foundUser.username) loginSuccess(foundUser); else setLoginError('Invalid (Demo: user=pass)'); setApiLoading(false); } else { try { const res = await fetch(`${API_BASE}/login.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: loginUser, password: loginPass }) }); const text = await res.text(); if (!text || text.trim() === '') throw new Error("Empty Response"); let data; try { data = JSON.parse(text); } catch (e) { throw new Error(`Invalid JSON: ${text.substring(0, 100)}...`); } if (data.success) loginSuccess(data.user); else setLoginError(data.message || 'Login failed'); } catch (err: any) { setLoginError(err.message || 'Connection Error'); } finally { setApiLoading(false); } } };
  const handleRegister = async (e: React.FormEvent) => { e.preventDefault(); setRegError(''); if (regPass !== regConfirmPass) { setRegError('Mismatch'); return; } setApiLoading(true); if (IS_DEMO_MODE) { const newUser: User = { id: Date.now().toString(), username: regUser, email: regEmail, role: 'user', isVerified: true }; const currentUsers = JSON.parse(localStorage.getItem('qios_users') || '[]'); currentUsers.push(newUser); localStorage.setItem('qios_users', JSON.stringify(currentUsers)); loginSuccess(newUser); setShowRegister(false); alert('Success (Demo)'); setApiLoading(false); } else { try { const res = await fetch(`${API_BASE}/register.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: regUser, email: regEmail, password: regPass, confirmPassword: regConfirmPass }) }); const text = await res.text(); let data; try { data = JSON.parse(text); } catch(e) { throw new Error(text.substring(0, 50)); } if (data.success) { alert('Success! ' + (data.warning || 'Please login.')); setShowRegister(false); setLoginUser(regUser); } else setRegError(data.message || 'Failed'); } catch (err: any) { setRegError(err.message || 'Error'); } finally { setApiLoading(false); } } };
  const handleManualVerifyUser = async (targetUserId: string) => { if(!confirm("Verify user?")) return; setApiLoading(true); if(IS_DEMO_MODE) { setUsers(users.map(u => u.id === targetUserId ? {...u, isVerified: true} : u)); alert("Verified"); } else { try { const res = await fetch(`${API_BASE}/manage_users.php?action=verify`, { method: 'POST', body: JSON.stringify({ id: targetUserId }) }); const data = await res.json(); if(data.success) { alert("Success"); fetchUsers(); } else alert(data.message); } catch(e) { alert("Error"); } } setApiLoading(false); };
  const handleDeleteUser = async (targetUser: User) => { if (currentUser?.id === targetUser.id) return alert("You cannot delete your own account."); if (!confirm(`Are you sure you want to delete user "${targetUser.username}"? This action cannot be undone.`)) return; setApiLoading(true); if (IS_DEMO_MODE) { setUsers(users.filter(u => u.id !== targetUser.id)); const savedUsers = JSON.parse(localStorage.getItem('qios_users') || '[]'); const newSaved = savedUsers.filter((u: User) => u.id !== targetUser.id); localStorage.setItem('qios_users', JSON.stringify(newSaved)); alert("User deleted (Demo)"); } else { try { const res = await fetch(`${API_BASE}/manage_users.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ action: 'delete', id: targetUser.id }) }); const data = await res.json(); if (data.success) { alert("User deleted successfully"); fetchUsers(); } else { alert("Failed to delete: " + data.message); } } catch (e) { alert("Connection Error"); } } setApiLoading(false); };
  const handleUserManagementSubmit = async (e: React.FormEvent) => { e.preventDefault(); setApiLoading(true); if (!currentUser) return; const payloadConfig = userFormData.role === 'merchant' ? { merchantName: userFormData.merchantName, merchantCode: userFormData.merchantCode, qiospayApiKey: userFormData.apiKey, appSecretKey: 'QIOS_SECRET_' + Math.random().toString(36).substring(7), qrisString: userFormData.qrisString } : null; if (IS_DEMO_MODE) { alert('Saved (Demo)'); } else { try { const res = await fetch(`${API_BASE}/manage_users.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ action: editingUser ? 'update' : 'create', id: editingUser?.id, username: userFormData.username, email: userFormData.email, password: userFormData.password, role: userFormData.role, config: payloadConfig, creator_role: currentUser.role }) }); const data = await res.json(); if(data.success) { fetchUsers(); alert('Saved'); } else alert(data.message); } catch(e) { alert('Error'); } } setApiLoading(false); setUserModalOpen(false); };
  const handleUserAuthUpdate = async (userId: string, waEnabled: boolean, twoFaEnabled: boolean) => { setApiLoading(true); if(IS_DEMO_MODE) { setUsers(users.map(u => u.id === userId ? {...u, waLoginEnabled: waEnabled, twoFactorEnabled: twoFaEnabled} : u)); alert("Auth Settings Updated (Demo)"); } else { alert("Backend endpoint for updating per-user auth settings is needed."); } setApiLoading(false); setUserAuthModalOpen(false); };
  const handleUpdateAccount = async () => { if (!accountForm.username) return alert("Username required"); if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmNewPassword) return alert("Passwords do not match"); setApiLoading(true); const updatedUser = { ...currentUser!, username: accountForm.username, email: accountForm.email, phone: accountForm.phone }; if (IS_DEMO_MODE) { setCurrentUser(updatedUser); sessionStorage.setItem('qios_user', JSON.stringify(updatedUser)); const savedUsers = JSON.parse(localStorage.getItem('qios_users') || '[]'); const existingIndex = savedUsers.findIndex((u: User) => u.id === updatedUser.id); let newUsersList; if (existingIndex >= 0) { savedUsers[existingIndex] = updatedUser; newUsersList = savedUsers; } else { newUsersList = [...savedUsers, updatedUser]; } localStorage.setItem('qios_users', JSON.stringify(newUsersList)); alert("Profile Updated (Demo)"); setAccountForm({...accountForm, password: '', newPassword: '', confirmNewPassword: ''}); } else { try { const payload = { action: 'update', id: currentUser!.id, username: accountForm.username, email: accountForm.email, phone: accountForm.phone, role: currentUser!.role, config: currentUser!.merchantConfig, password: accountForm.newPassword ? accountForm.newPassword : undefined }; const res = await fetch(`${API_BASE}/manage_users.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) }); const data = await res.json(); if (data.success) { setCurrentUser(updatedUser); sessionStorage.setItem('qios_user', JSON.stringify(updatedUser)); alert("Profile Updated Successfully"); setAccountForm({...accountForm, password: '', newPassword: '', confirmNewPassword: ''}); } else { alert("Update failed: " + data.message); } } catch (e) { alert('Connection Error'); } } setApiLoading(false); };
  const handleTestEmail = async () => { if (!config.smtp) return alert("Configure SMTP first"); setApiLoading(true); if (IS_DEMO_MODE) { setTimeout(() => { alert(`Sent to ${config.smtp?.fromEmail}`); setApiLoading(false); }, 1500); } else { try { const res = await fetch(`${API_BASE}/test_smtp.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ config: config.smtp, recipient: currentUser?.email || config.smtp.fromEmail }) }); const data = await res.json(); alert(data.message); } catch(e) { alert("Failed"); } finally { setApiLoading(false); } } };
  const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); alert("Copied!"); };
  const fetchTransactions = async (user: User) => { if (IS_DEMO_MODE) { const savedTx = localStorage.getItem('qios_transactions'); if (savedTx) setTransactions(JSON.parse(savedTx)); else setTransactions(Array(5).fill(0).map((_, i) => ({ id: `TRX-DEMO-${1000+i}`, merchantId: user.id, amount: 10000 + (i * 5000), description: `Demo ${i+1}`, status: i % 2 === 0 ? 'paid' : 'pending', createdAt: new Date().toISOString(), qrString: user.merchantConfig?.qrisString || '', paymentUrl: window.location.origin + '/?pay=demo' + i }))); return; } try { const res = await fetch(`${API_BASE}/get_data.php?user_id=${user.id}&role=${user.role}`); const data = await res.json(); if (data.success && data.transactions) setTransactions(data.transactions); } catch (e) { console.error(e); } };
  const fetchUsers = async () => { if (IS_DEMO_MODE) { const savedUsers = localStorage.getItem('qios_users'); setUsers([...MOCK_USERS, ...(savedUsers ? JSON.parse(savedUsers) : []).filter((u:User) => !MOCK_USERS.find(m => m.id === u.id))]); return; } try { const res = await fetch(`${API_BASE}/manage_users.php?action=list`); const data = await res.json(); if (data.success && data.users) setUsers(data.users); } catch (e) { console.error(e); } };
  const loginSuccess = (user: User, redirect = true) => { if (user.username === 'admin' && user.role !== 'superadmin') user.role = 'superadmin'; if (user.isVerified === undefined) user.isVerified = true; setCurrentUser(user); sessionStorage.setItem('qios_user', JSON.stringify(user)); if (user.merchantConfig) setConfig(user.merchantConfig); setAccountForm({ username: user.username, email: user.email || '', phone: user.phone || '', password: '', newPassword: '', confirmNewPassword: '' }); if (user.merchantConfig?.branding?.brandColor) document.documentElement.style.setProperty('--brand-color', user.merchantConfig.branding.brandColor); setView(user.role === 'user' ? 'history' : 'dashboard'); if (redirect) setShowLanding(false); fetchTransactions(user); if (['superadmin', 'merchant', 'cs'].includes(user.role)) fetchUsers(); };
  const handleRevokeLink = async (trx: Transaction) => { if (currentUser?.isVerified === false) return alert("Verify email first."); if (!confirm("Cancel link?")) return; if (IS_DEMO_MODE) { /* @ts-ignore */ setTransactions(transactions.map(t => t.id === trx.id ? {...t, status: 'cancelled'} : t)); alert("Revoked"); } else { try { const res = await fetch(`${API_BASE}/revoke_link.php`, { method: 'POST', body: JSON.stringify({ trx_id: trx.id }) }); const data = await res.json(); if (data.success) { fetchTransactions(currentUser!); alert("Revoked"); } else alert(data.message); } catch(e) { alert("Error"); } } };
  const handleGenerateQR = async () => { if (currentUser?.isVerified === false) return alert("Verify email first."); if (!tempAmount || isNaN(Number(tempAmount))) return; setApiLoading(true); setGeneratedQR(null); setGeneratedLink(null); if (IS_DEMO_MODE) { const qr = generateDynamicQR(config.qrisString, Number(tempAmount)); const token = Math.random().toString(36).substring(7); const link = `${window.location.origin}/?pay=${token}`; setTimeout(() => { setGeneratedQR(qr); setGeneratedLink(link); setTransactions([{ id: `TRX-${Date.now()}`, merchantId: currentUser?.id || '0', amount: Number(tempAmount), description: tempDesc, status: 'pending', createdAt: new Date().toISOString(), qrString: qr, paymentUrl: link }, ...transactions]); setApiLoading(false); }, 800); } else { try { const res = await fetch(`${API_BASE}/create_payment.php`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ merchant_id: currentUser?.id, amount: Number(tempAmount), description: tempDesc, expiry_minutes: expiryMinutes ? parseInt(expiryMinutes) : 0, single_use: singleUse, api_key: config.appSecretKey }) }); const data = await res.json(); if (data.success) { setGeneratedQR(data.qr_string); setGeneratedLink(data.payment_url); setTransactions([{ id: data.trx_id, merchantId: currentUser?.id || '0', amount: Number(tempAmount), description: tempDesc, status: 'pending', createdAt: new Date().toISOString(), qrString: data.qr_string, paymentUrl: data.payment_url }, ...transactions]); } else alert(data.message); } catch (e) { alert("Error"); } finally { setApiLoading(false); } } };

  // ... (Render Logic) ...
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
                
                {!isPaid && !isExpired && (
                    <div className="flex flex-col gap-3 w-full mt-4 animate-in fade-in slide-in-from-bottom-4">
                        <button onClick={() => handlePublicCheck(false)} disabled={isCheckingPublic} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                            {isCheckingPublic ? <Loader2 className="animate-spin" size={20}/> : <RefreshCw size={20}/>}<span>Check Payment Status</span>
                        </button>
                        {generatedQR && (<a href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(generatedQR)}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"><Download size={20}/><span>Download QR Image</span></a>)}
                    </div>
                )}
            </div>
            {config.branding?.customDomain && <p className="mt-8 text-gray-400 text-xs">Powered by {config.branding.customDomain}</p>}
        </div> 
     );
  }
  
  // RESTORED: LOGIC LOGIN & REGISTER PAGE
  if (showLanding && !currentUser) { return <LandingPage onLogin={() => setShowLanding(false)} onRegister={() => { setShowLanding(false); setShowRegister(true); }} />; }
  
  if (!currentUser) { 
      if (showRegister) { return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"><div className="bg-indigo-600 p-8 text-center relative"><button onClick={()=>{setShowRegister(false);setShowLanding(true);}} className="absolute top-4 left-4 text-white/50 hover:text-white"><X size={20}/></button><h1 className="text-2xl font-bold text-white">Create Account</h1></div><div className="p-8"><form onSubmit={handleRegister} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Username</label><input type="text" required className="w-full px-4 py-2 border border-gray-200 rounded-lg" value={regUser} onChange={e=>setRegUser(e.target.value)}/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input type="email" required className="w-full px-4 py-2 border border-gray-200 rounded-lg" value={regEmail} onChange={e=>setRegEmail(e.target.value)}/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><div className="relative"><input type={showPassword ? "text" : "password"} required className="w-full px-4 py-2 border border-gray-200 rounded-lg pr-10" value={regPass} onChange={e=>setRegPass(e.target.value)}/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label><div className="relative"><input type={showConfirmNewPass ? "text" : "password"} required className="w-full px-4 py-2 border border-gray-200 rounded-lg pr-10" value={regConfirmPass} onChange={e=>setRegConfirmPass(e.target.value)}/><button type="button" onClick={() => setShowConfirmNewPass(!showConfirmNewPass)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">{showConfirmNewPass ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>{regError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{regError}</div>}<button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold">{apiLoading?<Loader2 className="animate-spin"/>:'Sign Up'}</button>
      
      {/* SOCIAL LOGIN FOR REGISTER - USING SYSTEM CONFIG */}
      {(systemConfig.socialLogin?.google || systemConfig.socialLogin?.github || systemConfig.socialLogin?.facebook) && (
          <>
              <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or sign up with</span></div></div>
              <div className="grid grid-cols-3 gap-3">
                  {systemConfig.socialLogin?.google && <button type="button" className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Chrome size={20} className="text-red-500"/></button>}
                  {systemConfig.socialLogin?.github && <button type="button" className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Github size={20}/></button>}
                  {systemConfig.socialLogin?.facebook && <button type="button" className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Facebook size={20} className="text-blue-600"/></button>}
              </div>
          </>
      )}
      </form></div></div></div>; } 
      
      // --- LOGIN SCREEN RESTORED ---
      return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          
          {/* FORGOT PASSWORD MODAL */}
          {showForgotPass && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative">
                      <button onClick={()=>setShowForgotPass(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
                      <div className="p-6">
                          <h3 className="text-xl font-bold mb-4 text-center">Reset Password</h3>
                          
                          {/* Step 1: Input Identifier */}
                          {forgotStep === 'input' && (
                              <form onSubmit={handleForgotCheck} className="space-y-4">
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
                                      <input type="text" className="w-full border p-2 rounded-lg" value={forgotIdentifier} onChange={e=>setForgotIdentifier(e.target.value)} required />
                                  </div>
                                  <button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">
                                      {apiLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Check Account'}
                                  </button>
                              </form>
                          )}

                          {/* Step 2: Select Method */}
                          {forgotStep === 'method' && forgotMethods && (
                              <div className="space-y-4">
                                  <p className="text-sm text-gray-600">Select verifcation method:</p>
                                  {forgotMethods.has_email && <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${selectedMethod==='email'?'border-indigo-500 bg-indigo-50':''}`}><input type="radio" name="method" value="email" checked={selectedMethod==='email'} onChange={()=>setSelectedMethod('email')} /><div><p className="font-bold text-sm">Email Verification</p><p className="text-xs text-gray-500">Send link to {forgotMethods.email_masked}</p></div></label>}
                                  {forgotMethods.has_wa && <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${selectedMethod==='wa'?'border-green-500 bg-green-50':''}`}><input type="radio" name="method" value="wa" checked={selectedMethod==='wa'} onChange={()=>setSelectedMethod('wa')} /><div><p className="font-bold text-sm">WhatsApp OTP</p><p className="text-xs text-gray-500">Send code to {forgotMethods.phone_masked}</p></div></label>}
                                  <button onClick={handleForgotSend} disabled={apiLoading} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">{apiLoading ? <Loader2 className="animate-spin mx-auto"/> : (selectedMethod==='wa' ? 'Send OTP Code' : 'Send Reset Link')}</button>
                              </div>
                          )}

                          {/* Step 3: Verify OTP (WA Only) */}
                          {forgotStep === 'verify' && (
                              <div className="space-y-4">
                                  <p className="text-sm text-gray-600 text-center">Enter the code sent to your WhatsApp</p>
                                  <input type="text" className="w-full border p-2 rounded-lg text-center text-2xl tracking-widest" maxLength={6} value={forgotOtp} onChange={e=>setForgotOtp(e.target.value)} placeholder="000000" />
                                  <button onClick={handleForgotVerify} disabled={apiLoading} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">{apiLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Verify Code'}</button>
                              </div>
                          )}

                          {/* Step 4: Reset Password */}
                          {forgotStep === 'reset' && (
                              <form onSubmit={handleForgotReset} className="space-y-4">
                                  <div><label className="block text-sm font-medium mb-1">New Password</label><input type="password" className="w-full border p-2 rounded-lg" value={newPass} onChange={e=>setNewPass(e.target.value)} required /></div>
                                  <div><label className="block text-sm font-medium mb-1">Confirm New Password</label><input type="password" className="w-full border p-2 rounded-lg" value={confirmNewPass} onChange={e=>setConfirmNewPass(e.target.value)} required /></div>
                                  <button type="submit" disabled={apiLoading} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">{apiLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Change Password'}</button>
                              </form>
                          )}
                      </div>
                  </div>
              </div>
          )}

          <div className="