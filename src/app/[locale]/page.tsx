'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Lock, ArrowRight, Activity, ShieldCheck, 
  Database, Layers, Waves, Fingerprint, MapPin, 
  Cpu, Radar, Crosshair, BarChart3, Binary, 
  ShieldAlert, Microscope, Zap, TrendingUp, 
  CheckCircle, Download, FileText, Leaf, Building, 
  ChevronDown, CreditCard, Play, Mail, Phone, Globe
} from 'lucide-react';

export default function UltimateLuxuryBento() {
  const [searchTerm, setSearchTerm] = useState('');
  const [requiresPin, setRequiresPin] = useState(false);
  const [pin, setPin] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockedBuilding] = useState({
    name: 'Bodrum Residence Tower',
    uid: 'AUR-8920',
    description: 'Premium luxury residential complex — full lifecycle structural integrity, seismic compliance (Eurocode 8), and material diagnostics report. Certified by registered structural engineers.',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length > 2) {
      setRequiresPin(true);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      setIsUnlocked(true);
    }
  };

  const faqs = [
    {
      question: "Does core extraction compromise structural integrity?",
      answer: "No. We utilize surgical micro-drilling techniques governed by rigorous ISO-9001 protocols. The extraction points are minimal, strategically selected via subsurface radar, and immediately sealed with high-strength structural epoxy, leaving the asset completely uncompromised."
    },
    {
      question: "Is the cryptographic ledger compliant with EU privacy laws (KVKK/GDPR)?",
      answer: "Absolutely. We deploy zero-knowledge proofs and AES-256 encryption. Your property's specific data is mathematically verified on the edge network, but the underlying sensitive details remain entirely private and accessible only via your unique cryptographic pin."
    },
    {
      question: "Can these reports be used for official property valuations?",
      answer: "Yes. Our Eurocode 8 compliant reports are certified by registered structural engineers and are globally recognized by premium real estate brokerages, insurance firms, and private wealth institutions to justify and elevate asset valuation."
    },
    {
      question: "What happens if a structural vulnerability is detected?",
      answer: "If our algorithms detect an anomaly outside the safety threshold, the ledger is updated with a 'Condition Flag.' We immediately and confidentially consult with you to provide a targeted, discreet remediation roadmap before the data is finalized."
    }
  ];

  return (
    <main className="min-h-screen bg-white text-slate-600 font-sans selection:bg-blue-600/20 selection:text-blue-900 relative overflow-x-clip w-full">
      
      {/* --- GALLERY STRUCTURAL GRID --- */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.02) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(15, 23, 42, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
        }}
      />

      {/* --- SUBTLE AMBIENT GLOWS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] -right-20 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] -left-20 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[160px]" />
      </div>

      {/* --- EXECUTIVE TICKER BAR --- */}
      <div className="w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center overflow-hidden py-2.5 z-50 relative">
        <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap text-[9px] font-mono tracking-[0.3em] uppercase text-slate-400 font-semibold">
          <span className="mx-6">Bodrum_Grid: <span className="text-blue-600">Stable</span></span> •
          <span className="mx-6">Fethiye_Node: <span className="text-blue-600">Syncing</span></span> •
          <span className="mx-6">Kalkan_Sensor_Array: <span className="text-blue-600">Active</span></span> •
          <span className="mx-6">Datça_Fault_Monitor: <span className="text-blue-600">Optimal</span></span> •
          <span className="mx-6">Encryption_Protocol: <span className="text-indigo-600">AES-256</span></span> •
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* --- ELITE HEADER --- */}
      <header className="relative z-50 w-full pt-8 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between bg-white/95 border border-slate-100 backdrop-blur-2xl rounded-[2rem] px-8 py-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.2)]">
                <Activity className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            <span className="font-bold tracking-[0.3em] text-xs uppercase text-slate-900">
              AURA <span className="text-blue-600 font-light">ANALYTICS</span>
            </span>
          </div>
          <nav className="hidden lg:flex items-center gap-12 text-[10px] tracking-[0.25em] text-slate-500 uppercase font-bold">
            <a href="#" className="hover:text-blue-600 transition-colors">Lab Telemetry</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Eurocode Standard</a>
            <Link href="./admin/login" className="bg-slate-900 text-white px-8 py-3.5 rounded-full hover:bg-blue-700 transition-colors duration-300 text-[10px] font-bold uppercase tracking-widest shadow-md">
               Admin Portal
            </Link>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative max-w-[1600px] mx-auto px-6 md:px-12 pt-20 pb-32 grid lg:grid-cols-12 gap-12 items-center z-10">
        
        <div className="lg:col-span-6 flex flex-col items-start relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 backdrop-blur-md border border-blue-100/80 text-[9px] font-black tracking-[0.3em] text-blue-700 uppercase mb-8 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            V.4 Algorithmic Diagnostics
          </div>
          <h1 className="text-6xl md:text-[6rem] font-medium tracking-tighter text-slate-900 leading-[1.0] mb-8 pr-4">
            Structural <br />
            Integrity <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 italic font-serif pb-2">
              Decrypted.
            </span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-lg font-light leading-relaxed mb-12">
            The institutional standard for property safety. Input a structural signature to retrieve lab-verified telemetry.
          </p>

          {/* Flat, Elegant Search Console */}
          <div className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-[2.5rem] p-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.08)]">
            
            {isUnlocked ? (
              <div className="p-5 flex flex-col gap-5">
                {/* ── Vault Unlocked Header ── */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
                      <p className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.3em]">
                        Vault Unlocked
                      </p>
                      <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full font-mono text-[8px] text-slate-600 font-bold shrink-0">
                        {unlockedBuilding.uid}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {unlockedBuilding.name}
                    </h3>
                  </div>
                </div>

                {/* ── Description ── */}
                <p className="text-sm text-slate-500 font-light leading-relaxed border-l-2 border-blue-200 pl-4 ml-1">
                  {unlockedBuilding.description}
                </p>

                {/* ── Actions ── */}
                <div className="flex gap-2 flex-wrap items-center">
                  <button className="flex-1 min-w-0 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold tracking-widest text-[10px] py-4 rounded-[2rem] uppercase shadow-[0_8px_16px_rgba(37,99,235,0.2)] transition-all">
                    <FileText className="h-3.5 w-3.5" /> View Report
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-widest text-[10px] px-6 py-4 rounded-[2rem] uppercase transition-colors">
                    <Download className="h-3.5 w-3.5" /> PDF
                  </button>
                  <button
                    onClick={() => {
                      setIsUnlocked(false);
                      setRequiresPin(false);
                      setPin('');
                      setSearchTerm('');
                    }}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest px-3 py-4 rounded-[2rem] transition-colors"
                  >
                    ← New Search
                  </button>
                </div>
              </div>
            ) : !requiresPin ? (
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 relative">
                <div className="relative flex-grow">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                  <input
                    type="text"
                    placeholder="Enter Property Signature..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-5 py-5 bg-slate-50/50 border border-slate-100 text-slate-900 text-sm tracking-widest placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-200 transition-all duration-300 rounded-[2rem] uppercase"
                    autoFocus
                  />
                </div>
                <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold tracking-widest text-xs px-12 py-5 rounded-[2rem] transition-colors hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2 uppercase shadow-[0_8px_16px_rgba(37,99,235,0.2)] shrink-0">
                  Locate <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handlePinSubmit} className="flex flex-col xl:flex-row items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500 w-full">
                <div className="flex items-center gap-4 px-6 py-4 bg-blue-50/80 rounded-[2rem] border border-blue-100 shrink-0 w-full xl:w-auto">
                  <Fingerprint className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="text-[8px] text-blue-600/70 uppercase font-black tracking-[0.3em]">Locked Record</p>
                    <p className="text-xs font-bold text-slate-900 uppercase">SECURE_VAULT_NODE</p>
                  </div>
                </div>
                <div className="relative flex-grow w-full">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="ENTER PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 bg-slate-50/50 border border-slate-100 text-slate-900 text-xl tracking-[0.5em] placeholder:tracking-normal placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-200 transition-all rounded-[2rem]"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-2 w-full xl:w-auto shrink-0 justify-end">
                  <button type="button" onClick={() => { setRequiresPin(false); setPin(''); }} className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 py-4 px-6 transition-colors">Cancel</button>
                  <button type="submit" className="bg-slate-900 text-white font-bold tracking-[0.2em] text-xs px-10 py-4.5 rounded-[2rem] hover:bg-blue-700 transition-colors shadow-md uppercase">Decrypt</button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT SIDE MULTI-LAYERED IMAGES */}
        <div className="lg:col-span-6 relative h-[650px] w-full hidden md:block">
          <div className="absolute top-0 right-0 w-[85%] h-[500px] rounded-[3rem] overflow-hidden border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.06)] group">
             <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200" alt="Luxury Architecture" className="w-full h-full object-cover scale-105 transition-transform duration-[4s] ease-out group-hover:scale-100" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-80" />
          </div>
          
          <div className="absolute bottom-10 left-0 w-[55%] h-[300px] rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] z-20 group">
             <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" alt="Modern Details" className="w-full h-full object-cover scale-105 transition-transform duration-[4s] ease-out brightness-105 group-hover:scale-100" />
             <div className="absolute inset-0 bg-indigo-900/5 mix-blend-color" />
             <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-100 flex items-center gap-2.5 shadow-sm">
                 <MapPin className="w-3.5 h-3.5 text-blue-600" />
                 <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">Aegean Sector</span>
             </div>
          </div>
          
          {/* Glassmorphic Telemetry Widget */}
          <div className="absolute top-12 left-0 bg-white/70 backdrop-blur-3xl border border-white p-5 rounded-[2rem] shadow-[0_20px_40px_rgba(37,99,235,0.1)] z-30 w-[260px] transition-shadow duration-500 hover:shadow-[0_30px_50px_rgba(37,99,235,0.15)]">
             <div className="flex items-center gap-3 mb-5">
                 <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                     <Activity className="w-4 h-4 text-blue-600" />
                 </div>
                 <div>
                    <p className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">Telemetry Feed</p>
                    <p className="text-xs text-slate-900 font-bold tracking-tight">Active Scan</p>
                 </div>
             </div>
             <div className="h-10 w-full flex items-end gap-[3px]">
                 {[35, 50, 25, 75, 40, 85, 30, 65, 45, 70, 50, 80, 55, 75, 40].map((h, i) => (
                     <div key={i} className="bg-gradient-to-t from-blue-500 to-indigo-400 rounded-full flex-grow" style={{height: `${h}%`, opacity: i % 2 === 0 ? 0.5 : 1}} />
                 ))}
             </div>
          </div>

          {/* Obsidian Pill Widget */}
          <div className="absolute bottom-32 -right-6 bg-[#0A0F1C] text-white rounded-full p-2 pr-6 border border-slate-700/50 shadow-[0_20px_40px_rgba(0,0,0,0.15)] z-30 flex items-center gap-4 cursor-default transition-shadow duration-500 hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)]">
              <div className="bg-blue-600/20 rounded-full p-2.5">
                  <Cpu className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mb-1.5">Processing</p>
                  <p className="text-sm font-black text-white leading-none">Vercel Edge</p>
              </div>
          </div>
        </div>
      </section>

      {/* --- THE BENTO METHODOLOGY GRID --- */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 relative z-10 border-t border-slate-200/60 bg-white/40 backdrop-blur-3xl">
        <div className="mb-20">
            <h2 className="text-4xl font-medium text-slate-900 tracking-tight mb-4">Diagnostic <span className="font-serif italic text-blue-600">Codex.</span></h2>
            <p className="text-slate-500 font-light max-w-xl text-lg">A multifaceted approach to structural certainty. Combining physical core extraction with advanced subsurface radar modeling.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-8 h-auto md:h-[650px]">
            
            {/* Box 1: Core Analytics */}
            <div className="md:col-span-1 md:row-span-2 relative rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.04)] group cursor-pointer bg-slate-900 transition-shadow duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)]">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale transition-all duration-[2s] ease-out group-hover:scale-105" 
                  alt="Construction Engineering" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent" />
                <div className="absolute top-0 right-0 p-8">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-lg">
                        <Microscope className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 p-8 z-10">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Module_01</p>
                    <h3 className="text-3xl font-semibold text-white mb-4">Core Analytics</h3>
                    <p className="text-sm text-slate-300 font-light leading-relaxed">
                        Physical concrete strength verification using non-destructive ultrasonic resonance and meticulous micro-drilling extraction.
                    </p>
                </div>
            </div>

            {/* Box 2: Seismic Resonance */}
            <div className="md:col-span-2 md:row-span-1 bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-10 relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-shadow duration-700 hover:shadow-[0_30px_60px_rgba(37,99,235,0.08)]">
                
                {/* Fixed Visible Soil/Topography Background */}
                <img 
                  src="https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?auto=format&fit=crop&q=80&w=1200" 
                  alt="Earth Strata" 
                  className="absolute inset-0 w-full h-full object-cover opacity-[0.10] group-hover:opacity-[0.15] transition-opacity duration-1000 z-0 pointer-events-none mix-blend-multiply grayscale"
                />

                <div className="flex flex-col md:flex-row justify-between gap-10 relative z-10 h-full">
                    <div className="flex flex-col justify-center max-w-sm">
                        <div className="flex items-center gap-4 mb-5">
                            
                            <div className="p-2.5 bg-white border border-slate-200 rounded-xl relative overflow-hidden">
                                <img 
                                  src="https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?auto=format&fit=crop&q=80&w=200" 
                                  className="absolute inset-0 w-full h-full object-cover opacity-[0.25] grayscale mix-blend-multiply z-0 pointer-events-none" 
                                  alt="" 
                                />
                                <Zap className="w-5 h-5 text-blue-600 relative z-10" />
                            </div>

                            <span className="text-[9px] font-black text-blue-600/70 uppercase tracking-[0.3em]">Seismic_Dynamics</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Seismic Resonance</h3>
                        <p className="text-sm text-slate-600 font-light leading-relaxed font-medium">Dynamic stress-testing using advanced Eurocode 8 algorithms to simulate high-magnitude geological events on architectural frames.</p>
                    </div>
                    
                    <div className="flex-grow bg-slate-50/80 backdrop-blur-md rounded-[2rem] border border-slate-200 p-4 flex items-center justify-center relative overflow-hidden">
                        
                        <img 
                          src="https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?auto=format&fit=crop&q=80&w=800" 
                          alt="Earth Strata Inner" 
                          className="absolute inset-0 w-full h-full object-cover opacity-[0.15] scale-125 mix-blend-multiply z-0 pointer-events-none grayscale"
                        />
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-0 pointer-events-none" />

                        <Radar className="w-32 h-32 text-blue-600/20 absolute animate-[spin_6s_linear_infinite] z-10" />
                        <Crosshair className="w-8 h-8 text-blue-600 relative z-10" />
                        
                        <div className="absolute right-4 bottom-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-mono text-blue-600 uppercase tracking-widest border border-slate-200 shadow-sm flex items-center gap-2 z-10">
                           <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                           EC8_Protocol_Active
                        </div>
                    </div>
                </div>
            </div>

            {/* Box 3: Immutable Ledger (THE FROSTED AZURE BUBBLE) */}
            <div className="md:col-span-1 md:row-span-1 bg-white rounded-[2.5rem] border border-blue-100 p-8 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group transition-shadow duration-700 hover:shadow-[0_30px_60px_rgba(37,99,235,0.1)]">
                
                {/* Soft Blue Orb behind Frosted Glass */}
                <div className="absolute -right-8 -top-8 w-56 h-56 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#93c5fd,_#2563eb)] opacity-70 transition-transform duration-1000 group-hover:scale-105" />
                
                {/* Heavy Frosted Glass Overlay */}
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[24px] z-0 pointer-events-none" />
                
                <div className="flex justify-between items-start relative z-10">
                    <div className="p-3 bg-white/90 backdrop-blur-md rounded-2xl w-fit border border-slate-100 shadow-sm">
                        <Binary className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100 text-[8px] font-mono text-blue-700 flex items-center gap-2 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        NODE_SYNCED
                    </div>
                </div>

                <div className="relative z-10 mt-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Immutable Ledger</h3>
                    <p className="text-xs text-slate-500 font-light leading-relaxed mb-5">
                        Cryptographically hashed on distributed edge nodes.
                    </p>

                    <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-100 space-y-1.5 shadow-inner">
                        <div className="flex justify-between text-[8px] font-mono text-slate-500">
                            <span>BLOCK_7849</span>
                            <span className="text-blue-600 font-bold">VERIFIED</span>
                        </div>
                        <div className="text-[8px] font-mono text-slate-400 truncate">
                            hash: 0x8F9A2B4C...99E1
                        </div>
                    </div>
                    
                    <button className="w-full py-3.5 px-4 bg-slate-900 hover:bg-blue-600 rounded-xl border border-transparent text-white text-[9px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-between group/btn shadow-md">
                        Verify Certificate 
                        <ArrowRight className="w-3.5 h-3.5 text-blue-300" />
                    </button>
                </div>
            </div>

            {/* Box 4: Stat Card */}
            <div className="md:col-span-1 md:row-span-1 bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] group transition-shadow duration-700 hover:shadow-[0_30px_60px_rgba(37,99,235,0.08)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/80 via-transparent to-transparent opacity-100" />
                <div className="absolute -right-8 -bottom-8 opacity-[0.03] transition-opacity duration-700">
                    <BarChart3 className="w-64 h-64 text-blue-600" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-5">
                        <ShieldAlert className="w-4 h-4 text-blue-600" />
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em]">Precision_Metric</p>
                    </div>
                    <p className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">99.9<span className="text-3xl text-slate-400">%</span></p>
                    <p className="text-xs text-blue-700/60 uppercase tracking-widest font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Global Accuracy Standard
                    </p>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100/80">
                    <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Error Margin</p>
                        <p className="text-sm font-bold text-slate-800">±0.01%</p>
                    </div>
                    <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Calibration</p>
                        <p className="text-sm font-bold text-slate-800">ISO-9001</p>
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* --- THE VALUE OF CERTAINTY (SEO & BENEFITS) --- */}
      <section className="bg-white border-t border-slate-200/60 pt-32 pb-24 relative z-10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-12 gap-16 items-start">
                
                <div className="lg:col-span-5 flex flex-col items-start sticky top-32">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-8 shadow-sm">
                        Institutional Insight
                    </div>
                    <h2 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight leading-[1.1] mb-8">
                        The Value of <br />
                        <span className="italic font-serif text-blue-600">Certainty.</span>
                    </h2>
                    <div className="space-y-6 text-slate-500 font-light leading-relaxed text-lg">
                        <p>
                            Understanding the complete picture of your building's health, value, and safety involves prudent decision-making and professional insights. Navigating this complexity provides invaluable clarity and confidence.
                        </p>
                        <p>
                            Instituting a comprehensive building analysis is globally recognized for its profound value. It directly impacts current operational use, shapes future financial standing, and serves as the absolute bedrock for institutional risk management.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="grid md:grid-cols-2 gap-x-10 gap-y-14">
                        <div className="group">
                            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 w-fit group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-500 shadow-sm">
                                <ShieldCheck className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Structural Assessment</h3>
                            <p className="text-sm text-slate-500 font-light leading-relaxed">Gain precise, unassailable understanding of structural health, exact load-bearing capacities, and sub-surface material conditions.</p>
                        </div>

                        <div className="group">
                            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 w-fit group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-500 shadow-sm">
                                <CheckCircle className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Safety & Code Compliance</h3>
                            <p className="text-sm text-slate-500 font-light leading-relaxed">Rigorous, documented validation against all relevant building codes and safety regulations, including essential Eurocode 8 standards.</p>
                        </div>

                        <div className="group">
                            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 w-fit group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-500 shadow-sm">
                                <TrendingUp className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Resale Value Optimization</h3>
                            <p className="text-sm text-slate-500 font-light leading-relaxed">Cryptographic documentation proving structural soundness significantly enhances market appeal, institutional perception, and valuation.</p>
                        </div>

                        <div className="group">
                            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 w-fit group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-500 shadow-sm">
                                <Building className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Preventative Maintenance</h3>
                            <p className="text-sm text-slate-500 font-light leading-relaxed">Identification of potential sub-surface issues early allows for strategic, cost-effective maintenance scheduling and massive risk reduction.</p>
                        </div>

                        <div className="group">
                            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 w-fit group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-500 shadow-sm">
                                <FileText className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Insurance Risk Profiling</h3>
                            <p className="text-sm text-slate-500 font-light leading-relaxed">Comprehensive, verified data leads to highly favorable insurance terms by explicitly demonstrating reduced risk and professional oversight.</p>
                        </div>

                        <div className="group">
                            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 w-fit group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-500 shadow-sm">
                                <Leaf className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Energy Efficiency Insights</h3>
                            <p className="text-sm text-slate-500 font-light leading-relaxed">Advanced thermal and material evaluation reveals substantial opportunities for long-term operational savings and environmental upgrades.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* --- INVESTMENT & TIMELINE (THE OBSIDIAN BLACK CARD) --- */}
      <section className="bg-slate-50 border-t border-slate-200/60 py-32 relative z-10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-24">
                <h2 className="text-4xl font-medium text-slate-900 tracking-tight mb-5">Investment & Roadmap</h2>
                <p className="text-slate-500 font-light text-lg">Transparent, phased advisory engagements tailored to high-value architectural assets.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">
                
                {/* Left: The Obsidian Pricing Card */}
                <div className="bg-[#0A0F1C] rounded-[3rem] border border-slate-800 p-10 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.15)] relative overflow-hidden transition-shadow duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px]" />
                    <div className="relative z-10">
                        <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl w-fit border border-white/10 mb-8 shadow-inner">
                            <CreditCard className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-3">Comprehensive Audit</h3>
                        <p className="text-sm text-slate-400 font-light mb-10 leading-relaxed">Full lifecycle diagnostic, including core sampling, radar mapping, and Eurocode 8 seismic certification.</p>
                        
                        <div className="flex items-end gap-3 mb-10 border-b border-white/10 pb-10">
                            <span className="text-6xl font-black text-white tracking-tighter">€12,500</span>
                            <span className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-widest">base</span>
                        </div>
                        
                        <ul className="space-y-5 mb-12">
                            {['ISO-9001 Micro-drilling Extraction', 'Dynamic Seismic Stress Simulation', 'Cryptographic Report Generation', 'Priority Post-Audit Consultation'].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-sm text-slate-300 font-light">
                                    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" /> {item}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-[2rem] text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-colors shadow-inner flex items-center justify-center gap-3">
                            Initiate Engagement <Play className="w-3.5 h-3.5 fill-white" />
                        </button>
                    </div>
                </div>

                {/* Right: The Gallery Timeline */}
                <div className="space-y-10 pl-0 lg:pl-10">
                    <div className="flex gap-8 group">
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 font-black text-lg z-10 transition-colors duration-500 group-hover:border-blue-300">01</div>
                            <div className="w-px h-full bg-slate-200 mt-4 transition-colors duration-500 group-hover:bg-blue-200" />
                        </div>
                        <div className="pb-10">
                            <div className="flex items-center gap-4 mb-3">
                                <h4 className="text-2xl font-bold text-slate-900">Physical Extraction</h4>
                                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-blue-100/50">Days 1-3</span>
                            </div>
                            <p className="text-base text-slate-500 font-light leading-relaxed">On-site surgical micro-drilling and subsurface radar mapping executed discreetly by certified structural engineers.</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-8 group">
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 font-black text-lg z-10 transition-colors duration-500 group-hover:border-blue-300">02</div>
                            <div className="w-px h-full bg-slate-200 mt-4 transition-colors duration-500 group-hover:bg-blue-200" />
                        </div>
                        <div className="pb-10">
                            <div className="flex items-center gap-4 mb-3">
                                <h4 className="text-2xl font-bold text-slate-900">Lab & Resonance Analytics</h4>
                                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-blue-100/50">Days 4-10</span>
                            </div>
                            <p className="text-base text-slate-500 font-light leading-relaxed">Laboratory testing of core samples combined with high-compute Eurocode 8 seismic hazard simulations.</p>
                        </div>
                    </div>

                    <div className="flex gap-8 group">
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_8px_16px_rgba(37,99,235,0.25)] flex items-center justify-center text-white font-black text-lg z-10">03</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <h4 className="text-2xl font-bold text-slate-900">Cryptographic Delivery</h4>
                                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-emerald-100/50">Day 14</span>
                            </div>
                            <p className="text-base text-slate-500 font-light leading-relaxed">Finalizing the immutable ledger entry and securely hand-delivering access keys directly to the client.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="bg-white border-t border-slate-200/60 py-32 relative z-10">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-4">Common Inquiries</h2>
                <p className="text-slate-500 font-light">Clarity on our process and privacy standards.</p>
            </div>
            
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        className={`border rounded-[2rem] transition-all duration-500 overflow-hidden ${openFaq === index ? 'bg-blue-50/30 shadow-md border-blue-100' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                    >
                        <button 
                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
                        >
                            <span className="font-bold text-slate-900 text-lg pr-8">{faq.question}</span>
                            <div className={`p-2 rounded-full transition-colors duration-500 shrink-0 ${openFaq === index ? 'bg-white shadow-sm border border-slate-200' : 'bg-slate-50 border border-transparent'}`}>
                                <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${openFaq === index ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                            </div>
                        </button>
                        <div 
                            className={`px-8 transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <p className="text-base text-slate-500 font-light leading-relaxed border-l-2 border-blue-200 pl-6 ml-2">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- PRE-FOOTER CONTACT CTA --- */}
      <section className="bg-slate-50 border-t border-slate-200/60 py-24 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-medium text-slate-900 mb-6">Initiate a Consultation</h2>
          <p className="text-slate-500 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect directly with our structural advisory board to confidentially discuss your asset portfolio. We operate globally with dedicated engineering nodes in the Aegean and European sectors.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
               <Globe className="w-6 h-6 text-blue-600 mb-4" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Global HQ</p>
               <p className="text-sm text-slate-900 font-medium">Aegean Sector, TR</p>
               <p className="text-xs text-slate-500 mt-1">Kalkan & Bodrum Grid</p>
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
               <Mail className="w-6 h-6 text-blue-600 mb-4" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Secure Intel</p>
               <p className="text-sm text-slate-900 font-medium">advisory@aura.systems</p>
               <p className="text-xs text-slate-500 mt-1">PGP Key available upon request</p>
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
               <Phone className="w-6 h-6 text-blue-600 mb-4" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Direct Line</p>
               <p className="text-sm text-slate-900 font-medium">+90 (555) AURA 01</p>
               <p className="text-xs text-slate-500 mt-1">Mon - Fri, 09:00 - 18:00 (GMT+3)</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- EXPANDED FOOTER --- */}
      <footer className="border-t border-slate-200 py-16 bg-white relative z-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="flex items-center gap-4">
             <div className="bg-slate-900 p-2 rounded-xl shadow-inner">
                <Activity className="h-4 w-4 text-white" />
             </div>
             <div>
                 <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-slate-900 block mb-1">Aura Engineering &copy; 2026</span>
                 <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Institutional Structural Intelligence</span>
             </div>
          </div>
          <div className="flex flex-wrap gap-8 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
             <a href="#" className="hover:text-blue-600 transition-colors">About Us</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Pricing Structure</a>
             <a href="#" className="hover:text-blue-600 transition-colors">KVKK Compliance</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Data Privacy</a>
             <a href="#" className="hover:text-blue-600 transition-colors">System Status</a>
          </div>
        </div>
      </footer>
    </main>
  );
}