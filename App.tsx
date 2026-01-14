
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
  HelpCircle as QuestionMark
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

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="bg-indigo-600 p-8 text-center relative">
                  <button onClick={()=>setShowLanding(true)} className="absolute top-4 left-4 text-white/50 hover:text-white"><X size={20}/></button>
                  <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                  
                  {/* AUTH TOGGLE IF ENABLED */}
                  {(systemConfig?.loginMethod === 'hybrid' || systemConfig?.loginMethod === 'whatsapp_otp') && (
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
                          <div>
                              <div className="flex justify-between items-center mb-2">
                                  <label className="block text-sm font-medium text-gray-700">Password</label>
                                  <button type="button" onClick={() => setShowForgotPass(true)} className="text-xs text-indigo-600 font-bold hover:underline">Forgot?</button>
                              </div>
                              <div className="relative"><input type={showPassword ? "text" : "password"} required className="w-full px-4 py-3 border border-gray-200 rounded-lg pr-10" value={loginPass} onChange={(e)=>setLoginPass(e.target.value)}/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>
                          </div>
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
                  
                  {/* SOCIAL LOGIN - Using systemConfig derived from API/LocalStorage */}
                  {(systemConfig.socialLogin?.google || systemConfig.socialLogin?.github || systemConfig.socialLogin?.facebook) && (
                      <>
                          <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div></div>
                          <div className="grid grid-cols-3 gap-3">
                              {systemConfig.socialLogin?.google && <button className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Chrome size={20} className="text-red-500"/></button>}
                              {systemConfig.socialLogin?.github && <button className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Github size={20}/></button>}
                              {systemConfig.socialLogin?.facebook && <button className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Facebook size={20} className="text-blue-600"/></button>}
                          </div>
                      </>
                  )}

                  <div className="text-center text-sm mt-6"><span className="text-gray-500">New here? </span><button type="button" onClick={()=>{setShowRegister(true);}} className="text-indigo-600 font-bold hover:underline">Create Account</button></div>
              </div>
          </div>
      </div>
      ); 
  }

  // ... (Main Dashboard Return) ...
  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <TransactionModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} onCopyLink={(t: Transaction) => copyToClipboard(t.paymentUrl || '')} branding={config.branding} onCheckStatus={handleCheckStatus} />
      
      {/* USER MODALS (Fix blank issue by ensuring it handles state properly) */}
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
              {isTrue(currentUser.isVerified) ? <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full"><CheckCircle2 size={12}/> Email</span> : <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-full"><AlertTriangle size={12}/> Email</span>}
              {isTrue(currentUser.isPhoneVerified) ? <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full"><Phone size={12}/> WA</span> : null}
              {isTrue(currentUser.isKycVerified) ? <span className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-full"><ScanFace size={12}/> KYC</span> : null}
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 pb-20">
          <VerificationBanner user={currentUser} onVerifyClick={() => { setView('settings'); setSettingsTab('account'); }} />
          
          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
                        <div className="flex justify-between items-start">
                            <div><p className="text-indigo-100 font-medium">Total Transactions</p><h3 className="text-4xl font-bold mt-2">{transactions.length}</h3></div>
                            <div className="bg-white/20 p-2 rounded-lg"><Wallet className="text-white" size={24}/></div>
                        </div>
                    </Card>
                    <Card>
                        <p className="text-gray-500 font-medium">Total Revenue {IS_DEMO_MODE ? '(Demo)' : ''}</p>
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
                            <defs>
                                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                            </defs>
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

          {/* HISTORY / TRANSACTIONS VIEW */}
          {view === 'history' && (
            <Card className="overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-700">Transaction History</h3>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Search ID..." className="border p-2 rounded-lg text-sm" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr><th className="p-4">ID</th><th className="p-4">Date</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4">Action</th></tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {transactions.filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase())).map(t => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono text-xs text-gray-500">{t.id}</td>
                                    <td className="p-4 text-gray-600">{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold text-gray-800">{formatRupiah(t.amount)}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${t.status==='paid'?'bg-green-100 text-green-700':t.status==='pending'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>{t.status.toUpperCase()}</span></td>
                                    <td className="p-4">
                                        <button onClick={() => setSelectedTransaction(t)} className="text-indigo-600 hover:underline mr-3">View</button>
                                        {t.status === 'pending' && <button onClick={() => handleCheckStatus(t)} className="text-gray-500 hover:text-indigo-600"><RefreshCw size={14}/></button>}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No transactions found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </Card>
          )}

          {/* USER MANAGEMENT VIEW (FIXED BLANK ISSUE) */}
          {view === 'users' && (
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-700">User Management</h3>
                    <button onClick={() => { setEditingUser(null); setUserFormData({username:'', email:'', password:'', role:'user', merchantName:'', merchantCode:'', apiKey:'', qrisString:''}); setUserModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={16}/> Add User</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">KYC</th><th className="p-4">Action</th></tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {users && users.length > 0 ? (
                                users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{u.username}</div>
                                            <div className="text-xs text-gray-500">{u.email}</div>
                                        </td>
                                        <td className="p-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs uppercase font-bold">{u.role}</span></td>
                                        <td className="p-4">
                                            {isTrue(u.isVerified) ? <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={14}/> Email</span> : <button onClick={() => handleManualVerifyUser(u.id)} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200">Verify Email</button>}
                                        </td>
                                        <td className="p-4">
                                            {isTrue(u.isKycVerified) ? <span className="text-blue-600 flex items-center gap-1"><ScanFace size={14}/> KYC</span> : (u.role !== 'superadmin' && <button onClick={() => handleManualApproveKyc(u.id)} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-blue-50 hover:text-blue-600">Approve KYC</button>)}
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            <button onClick={() => { setEditingUser(u); setUserFormData({username:u.username, email:u.email||'', password:'', role:u.role, merchantName:u.merchantConfig?.merchantName||'', merchantCode:u.merchantConfig?.merchantCode||'', apiKey:u.merchantConfig?.qiospayApiKey||'', qrisString:u.merchantConfig?.qrisString||''}); setUserModalOpen(true); }} className="p-1 text-gray-500 hover:text-indigo-600"><Pencil size={16}/></button>
                                            <button onClick={() => { setEditingUser(u); setUserAuthModalOpen(true); }} className="p-1 text-gray-500 hover:text-green-600" title="Security Settings"><Shield size={16}/></button>
                                            <button onClick={() => handleDeleteUser(u)} className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No users found. Click 'Add User' to start.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
          )}

          {/* ... (Terminal & Links View same as before) ... */}
          {view === 'terminal' && (
            <div className="flex flex-col lg:flex-row gap-8">
                <Card className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Create Payment Link</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Amount (IDR)</label>
                            <div className="relative"><span className="absolute left-3 top-3 text-gray-400 font-bold">Rp</span><input type="number" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800" placeholder="0" value={tempAmount} onChange={(e) => setTempAmount(e.target.value)} /></div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Description (Optional)</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" value={tempDesc} onChange={e=>setTempDesc(e.target.value)} placeholder="e.g. Order #123" />
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                            <p className="text-xs font-bold text-gray-500 uppercase">Advanced Options</p>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Expiry Time (Minutes)</label>
                                <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white" value={expiryMinutes} onChange={e=>setExpiryMinutes(e.target.value)} placeholder="e.g. 60 (Leave empty for no expiry)" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="singleUse" checked={singleUse} onChange={e=>setSingleUse(e.target.checked)} className="h-4 w-4 text-indigo-600 rounded" />
                                <label htmlFor="singleUse" className="text-sm text-gray-700">One-time Use (Link expires after payment)</label>
                            </div>
                        </div>
                        <button onClick={handleGenerateQR} disabled={apiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2">{apiLoading ? <Loader2 className="animate-spin" size={24}/> : <><QrCode size={20} /><span>Generate Payment Link</span></>}</button>
                    </div>
                </Card>
                <Card className="flex-1 flex flex-col items-center justify-center bg-gray-50 border-dashed border-2 border-gray-200">
                    {generatedQR ? <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300 w-full"><div className="flex justify-center"><QRCodeDisplay data={generatedQR} width={200} logoUrl={config.branding?.logoUrl} /></div><div><h2 className="text-3xl font-extrabold text-indigo-900">{formatRupiah(Number(tempAmount))}</h2><p className="text-sm text-gray-500 mt-1">{tempDesc}</p></div>{generatedLink && <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-2 text-left"><div className="flex-1 truncate text-xs text-gray-500 font-mono">{generatedLink}</div><button onClick={() => copyToClipboard(generatedLink)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded"><Copy size={16}/></button><a href={generatedLink} target="_blank" className="text-gray-500 hover:bg-gray-50 p-2 rounded"><ExternalLink size={16}/></a></div>}</div> : <div className="text-center text-gray-400 py-12"><QrCode size={48} className="mx-auto mb-4 opacity-50" /><p>Generate to create QR & Link</p></div>}
                </Card>
            </div>
          )}

          {view === 'links' && (
            <Card>
                <h3 className="font-bold text-gray-700 mb-6">Active Payment Links</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr><th className="p-4">Created</th><th className="p-4">Amount</th><th className="p-4">Description</th><th className="p-4">Link</th><th className="p-4">Action</th></tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {transactions.filter(t => t.status === 'pending').map(t => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold">{formatRupiah(t.amount)}</td>
                                    <td className="p-4 text-gray-600">{t.description}</td>
                                    <td className="p-4"><a href={t.paymentUrl} target="_blank" className="text-indigo-600 hover:underline truncate max-w-[200px] block">{t.paymentUrl}</a></td>
                                    <td className="p-4">
                                        <button onClick={() => copyToClipboard(t.paymentUrl || '')} className="text-gray-500 hover:text-indigo-600 mr-3"><Copy size={16}/></button>
                                        <button onClick={() => handleRevokeLink(t)} className="text-red-400 hover:text-red-600"><Ban size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                            {transactions.filter(t => t.status === 'pending').length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No active links</td></tr>}
                        </tbody>
                    </table>
                </div>
            </Card>
          )}

          {view === 'integration' && (
            <div className="space-y-6">
                <Card>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><Code2 size={24}/></div>
                        <div><h3 className="text-lg font-bold">Integration Modules</h3><p className="text-gray-500 text-sm">Download ready-to-use plugins for your platform.</p></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border p-4 rounded-xl hover:border-indigo-500 transition-colors cursor-pointer group" onClick={() => window.open('https://github.com/nabhan-rp/qioslink', '_blank')}>
                            <div className="flex justify-between items-start mb-2"><h4 className="font-bold text-gray-800">WHMCS Module</h4><Download size={18} className="text-gray-400 group-hover:text-indigo-600"/></div>
                            <p className="text-xs text-gray-500">Automated payment gateway for WHMCS billing system. Supports auto-activation.</p>
                        </div>
                        <div className="border p-4 rounded-xl hover:border-indigo-500 transition-colors cursor-pointer group" onClick={() => window.open('https://github.com/nabhan-rp/qioslink', '_blank')}>
                            <div className="flex justify-between items-start mb-2"><h4 className="font-bold text-gray-800">WooCommerce Plugin</h4><Download size={18} className="text-gray-400 group-hover:text-indigo-600"/></div>
                            <p className="text-xs text-gray-500">WordPress plugin for online stores. Seamless checkout experience.</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-bold mb-4">API Credentials</h3>
                    <div className="space-y-4">
                        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                            <p className="text-gray-500 mb-2"># API Endpoint</p>
                            <p className="text-white">{window.location.origin}/api/create_payment.php</p>
                            <br/>
                            <p className="text-gray-500 mb-2"># Example JSON Payload</p>
                            <pre>{`{
  "merchant_id": "${currentUser?.id}",
  "amount": 50000,
  "description": "Invoice #100",
  "callback_url": "https://your-site.com/callback"
}`}</pre>
                        </div>
                    </div>
                </Card>
            </div>
          )}
          
          {/* ... (Settings Tab - No changes to structure, using helper isTrue) ... */}
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
                           <button onClick={() => setSettingsTab('auth')} className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${settingsTab === 'auth' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}><Shield size={14}/> Auth & Security</button>
                        </>
                     )}
                 </div>

                 {/* ... (Existing Tabs: config, branding, smtp, auth - Keeping same content) ... */}
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

                                     {config.kyc?.provider === 'manual' && (
                                         <div className="mt-4 space-y-4 border-t pt-4 animate-in fade-in">
                                             <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                                 <h4 className="font-bold text-gray-800 mb-2">Manual Verification Contact</h4>
                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                     <div><label className="block text-sm font-medium mb-1">Contact Method</label><select className="w-full border p-2 rounded bg-white" value={config.kyc?.manualContactType || 'whatsapp'} onChange={e => setConfig({...config, kyc: {...config.kyc!, manualContactType: e.target.value as any}})}><option value="whatsapp">WhatsApp</option><option value="email">Email</option></select></div>
                                                     <div><label className="block text-sm font-medium mb-1">Contact Value (Number/Email)</label><input type="text" className="w-full border p-2 rounded" value={config.kyc?.manualContactValue || ''} onChange={e => setConfig({...config, kyc: {...config.kyc!, manualContactValue: e.target.value}})} placeholder={config.kyc?.manualContactType === 'email' ? 'admin@example.com' : '628123456789'} /></div>
                                                 </div>
                                                 <p className="text-xs text-yellow-800 mt-2">When users click "Verify Identity", they will be redirected to this contact.</p>
                                             </div>
                                         </div>
                                     )}

                                     {config.kyc?.provider === 'didit' && (
                                         <div className="mt-4 space-y-4 border-t pt-4 animate-in fade-in">
                                             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4 flex gap-3 items-start"><div className="text-blue-600 mt-1"><AlertCircle size={20}/></div><div className="text-sm text-blue-800"><p className="font-bold mb-1">Didit.me Integration</p><p className="mb-2">Enter your App ID, API Key, and Webhook Secret from the Didit Dashboard.</p><a href="https://business.didit.me" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-700 font-bold hover:underline">Go to Didit Console <ExternalLink size={12}/></a></div></div>
                                             <div className="bg-white border p-4 rounded-lg shadow-sm">
                                                 <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">API Credentials</h4>
                                                 <div className="space-y-4">
                                                     <div><label className="block text-sm font-medium mb-1">App ID</label><input type="text" className="w-full border p-2 rounded" value={config.kyc?.diditAppId || ''} onChange={e => setConfig({...config, kyc: {...config.kyc!, diditAppId: e.target.value}})} placeholder="Enter Didit App ID"/></div>
                                                     <div><label className="block text-sm font-medium mb-1">API Key</label><input type="password" className="w-full border p-2 rounded" value={config.kyc?.diditApiKey || ''} onChange={e => setConfig({...config, kyc: {...config.kyc!, diditApiKey: e.target.value}})} placeholder="Enter Didit API Key"/></div>
                                                     <div><label className="block text-sm font-medium mb-1">Webhook Secret</label><input type="password" className="w-full border p-2 rounded" value={config.kyc?.diditWebhookSecret || ''} onChange={e => setConfig({...config, kyc: {...config.kyc!, diditWebhookSecret: e.target.value}})} placeholder="Enter Webhook Secret"/></div>
                                                     <div className="pt-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Webhook URL (Callback)</label><div className="flex gap-2"><input type="text" readOnly className="w-full bg-gray-50 border p-2 rounded text-gray-600 font-mono text-xs" value={window.location.origin + "/api/kyc_callback.php"} /><button onClick={() => copyToClipboard(window.location.origin + "/api/kyc_callback.php")} className="px-3 bg-gray-100 border rounded hover:bg-gray-200 text-gray-600"><Copy size={16}/></button></div></div>
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
                 {/* ... (Branding, SMTP, Auth Tabs - keeping same) ... */}
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
                         {/* ... (Login Logic & Social Auth - No changes) ... */}
                         <button onClick={handleUpdateConfig} disabled={apiLoading} className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-2">
                             {apiLoading ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Save All Security Settings
                         </button>
                     </div>
                 )}
             </div>
          )}
          
          {/* --- ACCOUNT TAB (FIXED KYC STATUS DISPLAY) --- */}
          {view === 'settings' && settingsTab === 'account' && (
             <div className="space-y-6">
                 {/* 1. Account Details Form */}
                 <Card>
                     <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><UserIcon size={20}/> Profile Details</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div><label className="block text-sm font-medium mb-1">Username</label><input type="text" className="w-full border p-2 rounded bg-gray-50" value={accountForm.username} readOnly /></div>
                         <div><label className="block text-sm font-medium mb-1">Email Address</label><div className="flex gap-2"><input type="email" className="w-full border p-2 rounded" value={accountForm.email} onChange={e => setAccountForm({...accountForm, email: e.target.value})} />{isTrue(currentUser.isVerified) ? <span className="text-green-500 flex items-center" title="Verified"><CheckCircle2 size={20}/></span> : <button onClick={() => {}} className="text-xs bg-yellow-100 text-yellow-700 px-2 rounded hover:bg-yellow-200">Verify</button>}</div></div>
                         <div><label className="block text-sm font-medium mb-1">WhatsApp Number</label><div className="flex gap-2"><input type="text" className="w-full border p-2 rounded" value={accountForm.phone} onChange={e => setAccountForm({...accountForm, phone: e.target.value})} placeholder="628..." />{isTrue(currentUser.isPhoneVerified) ? <span className="text-green-500 flex items-center" title="Verified"><CheckCircle2 size={20}/></span> : <span className="text-gray-300 flex items-center" title="Not Verified"><MinusCircle size={20}/></span>}</div></div>
                     </div>
                 </Card>

                 {/* 2. Verification Status */}
                 <Card>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield size={20}/> Verification Status</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                            <div className="flex items-center gap-3"><Mail size={20} className="text-gray-500"/><div><p className="font-medium">Email Verification</p><p className="text-xs text-gray-500">{currentUser.email}</p></div></div>
                            {isTrue(currentUser.isVerified) ? <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 size={16}/> Verified</span> : <div className="flex gap-2"><input type="text" placeholder="OTP" className="w-20 border p-1 rounded text-xs" value={otpCode} onChange={e=>setOtpCode(e.target.value)} /><button onClick={handleVerifyEmail} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">Submit</button><button onClick={handleResendOtp} className="text-xs text-indigo-600 underline">Resend</button></div>}
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                            <div className="flex items-center gap-3"><Phone size={20} className="text-gray-500"/><div><p className="font-medium">WhatsApp Verification</p><p className="text-xs text-gray-500">{currentUser.phone || 'Not set'}</p></div></div>
                            {isTrue(currentUser.isPhoneVerified) ? <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 size={16}/> Verified</span> : <button onClick={() => { if(!accountForm.phone) return alert("Save phone number first"); handleResendOtp(); }} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded">Send OTP</button>}
                        </div>

                        {/* KYC STATUS LOGIC FIXED HERE */}
                        {(isTrue(systemConfig.verifyKyc) || isTrue(config.kyc?.enabled) || isTrue(currentUser.merchantConfig?.kyc?.enabled)) && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3"><ScanFace size={20} className="text-gray-500"/><div><p className="font-medium">Identity Verification (KYC)</p><p className="text-xs text-gray-500">Required for higher limits</p></div></div>
                                {isTrue(currentUser.isKycVerified) ? 
                                    <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 size={16}/> Verified</span> : 
                                    <span className="text-gray-500 text-xs font-medium">Not Verified</span>
                                }
                            </div>
                        )}
                    </div>

                    {!isTrue(currentUser.isKycVerified) && (isTrue(systemConfig.verifyKyc) || isTrue(config.kyc?.enabled) || isTrue(currentUser.merchantConfig?.kyc?.enabled)) && ( 
                        <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 animate-in fade-in">
                            <p className="text-sm text-blue-800 mb-3">Upgrade your account security and limits by verifying your identity.</p>
                            <button onClick={(config.kyc?.provider === 'didit' || !config.kyc) ? handleStartDiditKyc : () => { const type = config.kyc?.manualContactType || 'whatsapp'; const value = config.kyc?.manualContactValue || '628123456789'; let url = type === 'whatsapp' ? `https://wa.me/${value.replace(/[^0-9]/g,'')}?text=Halo%20Admin,%20saya%20${currentUser.username}%20(ID:${currentUser.id})%20ingin%20verifikasi%20KYC%20manual.` : `mailto:${value}?subject=KYC%20Verification%20Request%20(${currentUser.username})&body=Hello%20Admin,%20I%20want%20to%20verify%20my%20account%20(ID:${currentUser.id}).`; window.open(url, '_blank'); }} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2"><ScanFace size={18}/> {config.kyc?.provider === 'didit' || !config.kyc ? 'Start Automated Verification' : 'Contact Admin for Verification'}</button>
                        </div> 
                    )}
                 </Card>

                 {/* 3. Password Change */}
                 <Card>
                     <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Lock size={20}/> Change Password</h3>
                     <div className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div><label className="block text-sm font-medium mb-1">New Password</label><div className="relative"><input type={showNewPass ? "text" : "password"} className="w-full border p-2 rounded" value={accountForm.newPassword} onChange={e => setAccountForm({...accountForm, newPassword: e.target.value})} /><button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">{showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
                             <div><label className="block text-sm font-medium mb-1">Confirm New Password</label><div className="relative"><input type={showConfirmNewPass ? "text" : "password"} className="w-full border p-2 rounded" value={accountForm.confirmNewPassword} onChange={e => setAccountForm({...accountForm, confirmNewPassword: e.target.value})} /><button type="button" onClick={() => setShowConfirmNewPass(!showConfirmNewPass)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">{showConfirmNewPass ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
                         </div>
                     </div>
                 </Card>

                 {/* 4. Two-Factor Settings (SYNTAX ERROR FIXED) */}
                 <Card>
                     <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Fingerprint size={20}/> Two-Factor Authentication</h3>
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                         <div><p className="font-bold text-gray-800">WhatsApp 2FA</p><p className="text-sm text-gray-500">Require OTP from WhatsApp when logging in.</p></div>
                         <button 
                             onClick={() => { 
                                 if(!currentUser.isPhoneVerified && !currentUser.twoFactorEnabled) return alert("Verify WhatsApp first!");
                                 // Placeholder logic for now, waiting for backend
                                 alert("Please confirm your password to toggle 2FA (Coming Soon in UI, currently managed by Admin)");
                             }} 
                             className={`px-4 py-2 rounded-lg font-bold transition-colors ${currentUser.twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                         >
                             {currentUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                         </button>
                     </div>
                 </Card>

                 <div className="pt-4">
                     <button onClick={handleUpdateAccount} disabled={apiLoading} className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-2">{apiLoading ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Update Profile</button>
                 </div>
             </div>
          )}
          {/* ... (Rest of views) ... */}
        </div>
      </main>
    </div>
  );
}
// Add missing icon import
function MinusCircle({size}:{size:number}) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
