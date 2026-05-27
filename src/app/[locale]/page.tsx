'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import {
  Search, Lock, ArrowRight, Activity, ShieldCheck,
  Fingerprint, MapPin,
  Cpu, Radar, Crosshair, BarChart3, Binary,
  ShieldAlert, Microscope, Zap, TrendingUp,
  CheckCircle, Download, FileText, Leaf, Building, Building2,
  ChevronDown, CreditCard, Play, Mail, Phone, Globe,
  Loader2, AlertCircle, X, Clock,
  Menu, ChevronRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type SearchResult = {
  id:          number;
  name:        string;
  uid:         string;
  description: string;
  imageUrl:    string | null;
  hasPdf:      boolean;
};

type UnlockedBuilding = {
  id:          number;
  name:        string;
  uid:         string;
  description: string;
  imageUrl:    string | null;
  pdfUrl:      string | null;
};

export default function UltimateLuxuryBento() {
  const params      = useParams();
  const locale      = (params.locale as string) ?? 'tr';
  const pathname    = usePathname();
  const otherLocale  = locale === 'tr' ? 'en' : 'tr';
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  // ── Auth check: skip login if already authenticated ──────────────────────────
  const [adminHref, setAdminHref] = useState(`/${locale}/admin/login`);
  useEffect(() => {
    fetch('/api/auth/check')
      .then(r => { if (r.ok) setAdminHref(`/${locale}/admin`); })
      .catch(() => {});
  }, [locale]);

  const tHero   = useTranslations('Hero');
  const tTicker = useTranslations('Ticker');
  const tHeader = useTranslations('Header');
  const tSearch = useTranslations('Search');
  const tMethod = useTranslations('Methodology');
  const tValue  = useTranslations('Value');
  const tPrice  = useTranslations('Pricing');
  const tFaq    = useTranslations('FAQ');
  const tContact= useTranslations('Contact');
  const tFooter = useTranslations('Footer');

  const [openFaq,     setOpenFaq]     = useState<number | null>(0);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [isSample,       setIsSample]       = useState(false);
  const [sampleLoading,  setSampleLoading]  = useState(false);
  const [sampleError,    setSampleError]    = useState<string | null>(null);

  // ── Search state ─────────────────────────────────────────────────────────────
  const [searchTerm,       setSearchTerm]       = useState('');
  const [searching,        setSearching]        = useState(false);
  const [searchError,      setSearchError]      = useState<string | null>(null);
  const [step,             setStep]             = useState<'search' | 'results' | 'pin' | 'unlocked'>('search');
  const [searchResults,    setSearchResults]    = useState<SearchResult[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<SearchResult | null>(null);

  // ── PIN + unlock state ────────────────────────────────────────────────────────
  const [pin,              setPin]              = useState('');
  const [verifying,        setVerifying]        = useState(false);
  const [pinError,         setPinError]         = useState<string | null>(null);
  const [unlockedBuilding, setUnlockedBuilding] = useState<UnlockedBuilding | null>(null);

  // ── Search handler ────────────────────────────────────────────────────────────
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q.length < 2) return;
    setSearching(true);
    setSearchError(null);
    try {
      const res  = await fetch(`/api/public/search?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) { setSearchError(json.error ?? tSearch('searchFailed')); return; }
      const results: SearchResult[] = json.buildings;
      if (results.length === 0) {
        setSearchError(tSearch('noBuilding'));
        return;
      }
      setSearchResults(results);
      if (results.length === 1) { setSelectedBuilding(results[0]); setStep('pin'); }
      else                      { setStep('results'); }
    } catch {
      setSearchError(tSearch('networkError'));
    } finally {
      setSearching(false);
    }
  };

  const handleSelectBuilding = (b: SearchResult) => {
    setSelectedBuilding(b); setStep('pin'); setPinError(null); setPin('');
  };

  // ── PIN verify handler ────────────────────────────────────────────────────────
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuilding || pin.length < 4) return;
    setVerifying(true);
    setPinError(null);
    try {
      const res  = await fetch('/api/public/verify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: selectedBuilding.id, pin }),
      });
      const json = await res.json();
      if (!res.ok) {
        setPinError(
          res.status === 401
            ? tSearch('incorrectPin')
            : (json.error ?? tSearch('verificationFailed')),
        );
        return;
      }
      setUnlockedBuilding(json.building);
      setStep('unlocked');
    } catch {
      setPinError(tSearch('pinNetworkError'));
    } finally {
      setVerifying(false);
    }
  };

  const handleReset = () => {
    setStep('search'); setSearchTerm(''); setSearchResults([]);
    setSelectedBuilding(null); setPin(''); setPinError(null);
    setSearchError(null); setUnlockedBuilding(null);
    setIsSample(false); setSampleError(null);
  };

  // ── Sample demo handler ───────────────────────────────────────────────────
  const handleSampleClick = async () => {
    setSampleLoading(true); setSampleError(null);
    try {
      const res  = await fetch('/api/public/sample');
      const json = await res.json();
      if (!res.ok || !json.sample?.available) {
        setSampleError(tHero('sampleUnavailable'));
        return;
      }
      const { title, description, pdfUrl } = json.sample;
      setUnlockedBuilding({ id: 0, name: title, uid: 'DEMO', description, imageUrl: null, pdfUrl });
      setIsSample(true);
      setStep('unlocked');
    } catch {
      setSampleError(tHero('sampleError'));
    } finally {
      setSampleLoading(false);
    }
  };

  const faqs = [
    { question: tFaq('q1'), answer: tFaq('a1') },
    { question: tFaq('q2'), answer: tFaq('a2') },
    { question: tFaq('q3'), answer: tFaq('a3') },
    { question: tFaq('q4'), answer: tFaq('a4') },
  ];

  const valueFeatures = [
    { icon: ShieldCheck, title: tValue('feat1Title'), desc: tValue('feat1Desc') },
    { icon: CheckCircle, title: tValue('feat2Title'), desc: tValue('feat2Desc') },
    { icon: TrendingUp,  title: tValue('feat3Title'), desc: tValue('feat3Desc') },
    { icon: Building,    title: tValue('feat4Title'), desc: tValue('feat4Desc') },
    { icon: FileText,    title: tValue('feat5Title'), desc: tValue('feat5Desc') },
    { icon: Leaf,        title: tValue('feat6Title'), desc: tValue('feat6Desc') },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-600 font-sans selection:bg-blue-600/20 selection:text-blue-900 relative overflow-x-clip w-full">

      {/* --- GALLERY STRUCTURAL GRID --- */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)
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
          <span className="mx-6">{tTicker('bodrumGrid')}: <span className="text-blue-600">{tTicker('bodrumStatus')}</span></span> •
          <span className="mx-6">{tTicker('fethiyeNode')}: <span className="text-blue-600">{tTicker('fethiyeStatus')}</span></span> •
          <span className="mx-6">{tTicker('kalkanSensor')}: <span className="text-blue-600">{tTicker('kalkanStatus')}</span></span> •
          <span className="mx-6">{tTicker('datcaFault')}: <span className="text-blue-600">{tTicker('datcaStatus')}</span></span> •
          <span className="mx-6">{tTicker('encryption')}: <span className="text-indigo-600">AES-256</span></span> •
          <span className="mx-6">{tTicker('bodrumGrid')}: <span className="text-blue-600">{tTicker('bodrumStatus')}</span></span> •
          <span className="mx-6">{tTicker('fethiyeNode')}: <span className="text-blue-600">{tTicker('fethiyeStatus')}</span></span> •
          <span className="mx-6">{tTicker('kalkanSensor')}: <span className="text-blue-600">{tTicker('kalkanStatus')}</span></span> •
          <span className="mx-6">{tTicker('datcaFault')}: <span className="text-blue-600">{tTicker('datcaStatus')}</span></span> •
          <span className="mx-6">{tTicker('encryption')}: <span className="text-indigo-600">AES-256</span></span> •
        </div>
      </div>

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          aria-hidden
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* --- ELITE HEADER --- */}
      <header className="relative z-50 w-full pt-8 px-4 md:px-12">
        <div className="max-w-[1600px] mx-auto">

          {/* Pill */}
          <div className="flex items-center justify-between bg-white/95 border border-slate-100 backdrop-blur-2xl rounded-[2rem] px-5 md:px-8 py-4 md:py-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]">

            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.2)] shrink-0">
                <Activity className="h-4 w-4 text-white stroke-[2.5]" />
              </div>
              <span className="hidden sm:block font-bold tracking-[0.3em] text-xs uppercase text-slate-900">
                AURA <span className="text-blue-600 font-light">ANALYTICS</span>
              </span>
              <span className="block sm:hidden font-bold tracking-[0.2em] text-xs uppercase text-slate-900">
                AURA
              </span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-10 text-[10px] tracking-[0.25em] text-slate-500 uppercase font-bold">
              <Link href={`/${locale}/about`}      className="hover:text-blue-600 transition-colors">{tHeader('about')}</Link>
              <Link href={`/${locale}/projects`}   className="hover:text-blue-600 transition-colors">{tHeader('projects')}</Link>
              <Link href={`/${locale}/procedures`} className="hover:text-blue-600 transition-colors">{tHeader('procedures')}</Link>
              <Link href={`/${locale}/contact`}    className="hover:text-blue-600 transition-colors">{tHeader('contact')}</Link>
              <Link
                href={switchedPath}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200 text-[9px] font-bold uppercase tracking-[0.2em] transition-all"
              >
                <Globe className="w-3 h-3" />
                {otherLocale.toUpperCase()}
              </Link>
              <div className="w-px h-4 bg-slate-200" />
              <Link href={adminHref} className="bg-slate-900 text-white px-8 py-3.5 rounded-full hover:bg-blue-700 transition-colors duration-300 text-[10px] font-bold uppercase tracking-widest shadow-md ml-2">
                {tHeader('adminPortal')}
              </Link>
            </nav>

            {/* Mobile right: locale + hamburger (below lg) */}
            <div className="flex items-center gap-2 lg:hidden shrink-0">
              <Link
                href={switchedPath}
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg border border-slate-200 text-slate-500 text-[9px] font-bold uppercase tracking-[0.15em] hover:bg-slate-50 transition-colors"
              >
                <Globe className="w-3 h-3" />
                {otherLocale.toUpperCase()}
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(v => !v)}
                aria-expanded={mobileOpen}
                aria-label="Toggle menu"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-blue-700 active:scale-95 transition-all shrink-0"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Mobile dropdown panel */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              mobileOpen ? 'max-h-[24rem] opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white border border-slate-200 rounded-[1.75rem] shadow-xl overflow-hidden">
              <nav className="flex flex-col divide-y divide-slate-50">
                {[
                  { href: `/${locale}/about`,      label: tHeader('about')      },
                  { href: `/${locale}/projects`,   label: tHeader('projects')   },
                  { href: `/${locale}/procedures`, label: tHeader('procedures') },
                  { href: `/${locale}/contact`,    label: tHeader('contact')    },
                ].map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </Link>
                ))}
              </nav>
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <Link
                  href={adminHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-blue-700 active:scale-[0.98] transition-all duration-200"
                >
                  {tHeader('adminPortal')}
                </Link>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative max-w-[1600px] mx-auto px-6 md:px-12 pt-20 pb-32 grid lg:grid-cols-12 gap-12 items-center z-10">

        <div className="lg:col-span-6 flex flex-col items-start relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 backdrop-blur-md border border-blue-100/80 text-[9px] font-black tracking-[0.3em] text-blue-700 uppercase mb-8 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            {tHero('algoBadge')}
          </div>
          <h1 className="text-6xl md:text-[6rem] font-medium tracking-tighter text-slate-900 leading-[1.0] mb-8 pr-4">
            {tHero('title1')} <br />
            {tHero('title2')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 italic font-serif pb-2">
              {tHero('title3')}
            </span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-lg font-light leading-relaxed mb-12">
            {tHero('subtitle')}
          </p>

          {/* ── Sample demo button ── */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <button
              type="button"
              onClick={handleSampleClick}
              disabled={sampleLoading}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-white/80 backdrop-blur-md border border-blue-100 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700 hover:bg-blue-50 hover:border-blue-200 active:scale-[0.98] transition-all duration-200 shadow-sm disabled:opacity-60 group"
            >
              {sampleLoading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                : <Microscope className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />}
              {tHero('sampleButton')}
              {!sampleLoading && <ArrowRight className="w-3 h-3 text-blue-500" />}
            </button>
            {sampleError && (
              <span className="text-[9px] text-red-500 font-medium">{sampleError}</span>
            )}
          </div>

          {/* Flat, Elegant Search Console */}
          <div className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-[2.5rem] p-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.08)]">

            {/* ── UNLOCKED VIEW ── */}
            {step === 'unlocked' && unlockedBuilding ? (
              <div className="p-5 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-inner ${isSample ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                    {isSample
                      ? <Microscope className="w-5 h-5 text-blue-600" />
                      : <CheckCircle className="w-5 h-5 text-emerald-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
                      {isSample
                        ? <p className="text-[8px] font-black text-blue-600 uppercase tracking-[0.3em]">{tSearch('sampleDemo')}</p>
                        : <p className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.3em]">{tSearch('vaultUnlocked')}</p>}
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[8px] font-bold shrink-0 ${isSample ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'bg-slate-100 border border-slate-200 text-slate-600'}`}>
                        {unlockedBuilding.uid}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {unlockedBuilding.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 font-light leading-relaxed border-l-2 border-blue-200 pl-4 ml-1">
                  {unlockedBuilding.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap items-center">
                  {unlockedBuilding.pdfUrl ? (
                    <>
                      <a
                        href={unlockedBuilding.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-0 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold tracking-widest text-[10px] py-4 rounded-[2rem] uppercase shadow-[0_8px_16px_rgba(37,99,235,0.2)] transition-all"
                      >
                        <FileText className="h-3.5 w-3.5" /> {tSearch('viewReport')}
                      </a>
                      <a
                        href={unlockedBuilding.pdfUrl}
                        download
                        className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-widest text-[10px] px-6 py-4 rounded-[2rem] uppercase transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" /> {tSearch('pdf')}
                      </a>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-[2rem] px-5 py-3.5">
                      <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                      <p className="text-xs text-amber-700 font-medium leading-snug">
                        {tSearch('reportPending')}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleReset}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest px-3 py-4 rounded-[2rem] transition-colors"
                  >
                    {tSearch('newSearch')}
                  </button>
                </div>
              </div>

            /* ── RESULTS LIST (multiple matches) ── */
            ) : step === 'results' ? (
              <div className="p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between px-2 mb-1">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">
                    {tSearch('buildingsFound', { count: searchResults.length })}
                  </p>
                  <button
                    onClick={handleReset}
                    className="text-[9px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors"
                  >
                    {tSearch('newSearch')}
                  </button>
                </div>
                {searchResults.map(b => (
                  <button
                    key={b.id}
                    onClick={() => handleSelectBuilding(b)}
                    className="flex items-center gap-4 p-3 rounded-[1.5rem] border border-slate-100 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-200 transition-all text-left group"
                  >
                    {b.imageUrl ? (
                      <img
                        src={b.imageUrl}
                        alt={b.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{b.name}</p>
                      <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">{b.uid}</p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest shrink-0 ${
                      b.hasPdf
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {b.hasPdf ? tSearch('reportReady') : tSearch('pending')}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                  </button>
                ))}
              </div>

            /* ── PIN FORM ── */
            ) : step === 'pin' && selectedBuilding ? (
              <form
                onSubmit={handlePinSubmit}
                className="flex flex-col gap-3 p-2 animate-in fade-in slide-in-from-right-4 duration-500"
              >
                {/* Building info pill */}
                <div className="flex items-center gap-4 px-5 py-3 bg-blue-50/80 rounded-[2rem] border border-blue-100">
                  {selectedBuilding.imageUrl ? (
                    <img
                      src={selectedBuilding.imageUrl}
                      alt={selectedBuilding.name}
                      className="w-9 h-9 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <Fingerprint className="h-5 w-5 text-blue-600 shrink-0" />
                  )}
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[8px] text-blue-600/70 uppercase font-black tracking-[0.3em]">{tSearch('lockedRecord')}</p>
                    <p className="text-xs font-bold text-slate-900 truncate">{selectedBuilding.name}</p>
                  </div>
                  <span className="font-mono text-[9px] text-slate-400 shrink-0">{selectedBuilding.uid}</span>
                </div>

                {/* PIN input + buttons row */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors" />
                    <input
                      type="password"
                      maxLength={6}
                      placeholder={tSearch('enterPin')}
                      value={pin}
                      onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setPinError(null); }}
                      className={`w-full pl-14 pr-4 py-4 bg-slate-50/50 border text-slate-900 text-xl tracking-[0.5em] placeholder:tracking-normal placeholder-slate-400 focus:outline-none focus:bg-white transition-all rounded-[2rem] ${
                        pinError
                          ? 'border-red-300 focus:border-red-400'
                          : 'border-slate-100 focus:border-blue-200'
                      }`}
                      autoFocus
                      inputMode="numeric"
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(searchResults.length > 1 ? 'results' : 'search');
                        setPin('');
                        setPinError(null);
                      }}
                      className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 py-4 px-4 transition-colors"
                    >
                      {tSearch('cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={verifying || pin.length < 4}
                      className="bg-slate-900 text-white font-bold tracking-[0.2em] text-xs px-8 py-4 rounded-[2rem] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md uppercase flex items-center gap-2"
                    >
                      {verifying
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {tSearch('checking')}</>
                        : tSearch('decrypt')}
                    </button>
                  </div>
                </div>

                {/* PIN error */}
                {pinError && (
                  <div className="flex items-center gap-2.5 px-5 py-3 bg-red-50 border border-red-100 rounded-[2rem]">
                    <X className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600 font-medium">{pinError}</p>
                  </div>
                )}
              </form>

            /* ── SEARCH FORM (default) ── */
            ) : (
              <form onSubmit={handleSearch} className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row gap-2 relative">
                  <div className="relative flex-grow">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors duration-300" />
                    <input
                      type="text"
                      placeholder={tHero('searchPlaceholder')}
                      value={searchTerm}
                      onChange={e => { setSearchTerm(e.target.value); setSearchError(null); }}
                      className="w-full pl-16 pr-5 py-5 bg-slate-50/50 border border-slate-100 text-slate-900 text-sm tracking-widest placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-200 transition-all duration-300 rounded-[2rem] uppercase"
                      
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={searching || searchTerm.trim().length < 2}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold tracking-widest text-xs px-12 py-5 rounded-[2rem] transition-colors hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2 uppercase shadow-[0_8px_16px_rgba(37,99,235,0.2)] shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {searching
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> {tHero('searching')}</>
                      : <>{tHero('searchButton')} <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </div>
                {searchError && (
                  <div className="flex items-center gap-2.5 px-5 py-3 bg-red-50 border border-red-100 rounded-[2rem]">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600 font-medium">{searchError}</p>
                  </div>
                )}
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
                 <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">{tHero('aegeanSector')}</span>
             </div>
          </div>

          {/* Glassmorphic Telemetry Widget */}
          <div className="absolute top-12 left-0 bg-white/70 backdrop-blur-3xl border border-white p-5 rounded-[2rem] shadow-[0_20px_40px_rgba(37,99,235,0.1)] z-30 w-[260px] transition-shadow duration-500 hover:shadow-[0_30px_50px_rgba(37,99,235,0.15)]">
             <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-blue-600 rounded-xl">
                     <Activity className="w-4 h-4 text-white" />
                 </div>
                 <div>
                    <p className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">{tHero('telemetryFeed')}</p>
                    <p className="text-xs text-slate-900 font-bold tracking-tight">{tHero('activeScan')}</p>
                 </div>
             </div>
             <div className="h-10 w-full flex items-end gap-[3px] mb-3">
                 {[35, 50, 25, 75, 40, 85, 30, 65, 45, 70, 50, 80, 55, 75, 40].map((h, i) => (
                     <div key={i} className="bg-gradient-to-t from-blue-500 to-indigo-400 rounded-full flex-grow" style={{height: `${h}%`, opacity: i % 2 === 0 ? 0.5 : 1}} />
                 ))}
             </div>
             <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-widest">
               <span className="text-slate-400">Bodrum · Kalkan · Fethiye</span>
               <span className="text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />Live</span>
             </div>
          </div>

          {/* Obsidian Pill Widget */}
          <div className="absolute bottom-32 -right-6 bg-[#0A0F1C] text-white rounded-full p-2 pr-6 border border-slate-700/50 shadow-[0_20px_40px_rgba(0,0,0,0.15)] z-30 flex items-center gap-4 cursor-default transition-shadow duration-500 hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)]">
              <div className="bg-blue-600/20 rounded-full p-2.5">
                  <Cpu className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mb-1.5">{tHero('processing')}</p>
                  <p className="text-sm font-black text-white leading-none">Aegean Region</p>
              </div>
          </div>
        </div>
      </section>

      {/* --- THE BENTO METHODOLOGY GRID --- */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 relative z-10 border-t border-slate-200/60 bg-white/40 backdrop-blur-3xl">
        <div className="mb-20">
            <h2 className="text-4xl font-medium text-slate-900 tracking-tight mb-4">
              {tMethod('sectionTitle')} <span className="font-serif italic text-blue-600">{tMethod('sectionTitleItalic')}</span>
            </h2>
            <p className="text-slate-500 font-light max-w-xl text-lg">{tMethod('sectionSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-8 h-auto md:h-[780px]">

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
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">{tMethod('module01')}</p>
                    <h3 className="text-3xl font-semibold text-white mb-4">{tMethod('box1Title')}</h3>
                    <p className="text-sm text-slate-300 font-light leading-relaxed">
                        {tMethod('box1Desc')}
                    </p>
                </div>
            </div>

            {/* Box 2: Seismic Hazard Analysis — seismograph redesign */}
            <div className="md:col-span-2 md:row-span-1 bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-10 relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-shadow duration-700 hover:shadow-[0_30px_60px_rgba(37,99,235,0.08)]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-white pointer-events-none" />
                <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10 h-full">

                    {/* Left: text */}
                    <div className="flex flex-col justify-center max-w-[260px] shrink-0">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl">
                                <Zap className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-[9px] font-black text-blue-600/80 uppercase tracking-[0.3em]">{tMethod('seismicTag')}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{tMethod('box2Title')}</h3>
                        <p className="text-sm text-slate-500 font-light leading-relaxed">{tMethod('box2Desc')}</p>
                        <div className="flex flex-wrap gap-2 mt-6">
                            <span className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[8px] font-mono text-blue-700 font-bold">Mw 7.5 Simulation</span>
                            <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[8px] font-mono text-slate-600 font-bold">TBDY 2018 Zone 1</span>
                        </div>
                    </div>

                    {/* Right: seismograph panel */}
                    <div className="flex-grow bg-slate-50 rounded-[2rem] border border-slate-100 p-5 flex flex-col justify-between min-h-[160px] overflow-hidden">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Ground Motion Record · EC8</p>
                            <div className="px-2.5 py-1 bg-white rounded-full border border-slate-200 text-[8px] font-mono text-blue-600 flex items-center gap-1.5 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                {tMethod('ec8Protocol')}
                            </div>
                        </div>

                        {/* Seismograph waveform */}
                        <div className="flex-1 flex items-center py-1">
                            <svg viewBox="0 0 400 72" className="w-full" preserveAspectRatio="none">
                                {/* horizontal grid */}
                                <line x1="0" y1="36" x2="400" y2="36" stroke="#e2e8f0" strokeWidth="1"/>
                                <line x1="0" y1="18" x2="400" y2="18" stroke="#f1f5f9" strokeWidth="0.75" strokeDasharray="4 4"/>
                                <line x1="0" y1="54" x2="400" y2="54" stroke="#f1f5f9" strokeWidth="0.75" strokeDasharray="4 4"/>
                                {/* pre-event flat trace */}
                                <polyline points="0,36 30,36 34,35 38,37 42,36" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round"/>
                                {/* P-wave arrival */}
                                <line x1="48" y1="10" x2="48" y2="66" stroke="#cbd5e1" strokeWidth="0.75" strokeDasharray="2 3"/>
                                <text x="50" y="14" fill="#94a3b8" fontSize="5.5" fontFamily="monospace">P</text>
                                {/* S-wave arrival */}
                                <line x1="88" y1="10" x2="88" y2="66" stroke="#fca5a5" strokeWidth="0.75" strokeDasharray="2 3"/>
                                <text x="90" y="14" fill="#f87171" fontSize="5.5" fontFamily="monospace">S</text>
                                {/* P-wave small wiggles */}
                                <polyline points="42,36 48,36 52,33 56,39 60,34 64,38 68,35 72,37 76,34 80,38 84,36 88,36" fill="none" stroke="#60a5fa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                {/* S-wave main event */}
                                <polyline points="88,36 92,30 96,18 100,6 104,2 108,10 112,24 116,48 120,62 124,66 128,58 132,44 136,34 140,38 144,33 148,39 152,35 156,37 160,36" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                {/* peak annotation dot */}
                                <circle cx="104" cy="2" r="2.5" fill="#ef4444"/>
                                <text x="108" y="7" fill="#ef4444" fontSize="5.5" fontFamily="monospace" fontWeight="bold">PGA 0.38g</text>
                                {/* coda / post-event settle */}
                                <polyline points="160,36 168,34 174,38 180,36 190,36 200,35 210,37 220,36 260,36 280,36 400,36" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                        </div>

                        {/* bottom metrics */}
                        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-200 mt-1">
                            <div className="text-center">
                                <p className="text-[7px] font-mono text-slate-400 uppercase tracking-widest mb-0.5">Magnitude</p>
                                <p className="text-xs font-black text-slate-900">Mw 7.5</p>
                            </div>
                            <div className="text-center border-x border-slate-200">
                                <p className="text-[7px] font-mono text-slate-400 uppercase tracking-widest mb-0.5">PGA</p>
                                <p className="text-xs font-black text-blue-600">0.38g</p>
                            </div>
                            <div className="text-center border-r border-slate-200">
                                <p className="text-[7px] font-mono text-slate-400 uppercase tracking-widest mb-0.5">Duration</p>
                                <p className="text-xs font-black text-slate-900">42s</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[7px] font-mono text-slate-400 uppercase tracking-widest mb-0.5">Return Pd.</p>
                                <p className="text-xs font-black text-slate-900">475 yr</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Box 3: Tamper-Proof Delivery — dark certificate card */}
            <div className="md:col-span-1 md:row-span-1 bg-[#0A0F1C] rounded-[2.5rem] border border-slate-800 p-7 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.18)] relative overflow-hidden group transition-shadow duration-700 hover:shadow-[0_30px_60px_rgba(37,99,235,0.18)]">
                {/* ambient glows */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-[60px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/8 rounded-full blur-[50px] pointer-events-none" />

                {/* top label + live badge */}
                <div className="flex items-center justify-between relative z-10">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.35em]">Phase 03 · Delivery</p>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-mono text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE
                    </span>
                </div>

                {/* central seal */}
                <div className="flex flex-col items-center justify-center py-3 relative z-10">
                    <div className="relative mb-3">
                        <div className="w-20 h-20 rounded-full border-2 border-emerald-500/30 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.2)]">
                                <ShieldCheck className="w-7 h-7 text-emerald-400" />
                            </div>
                        </div>
                        <svg className="absolute inset-0 w-20 h-20 animate-[spin_8s_linear_infinite]" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth="1" strokeDasharray="4 8" />
                        </svg>
                    </div>
                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-0.5">{tMethod('verified')}</p>
                    <p className="text-[8px] font-mono text-slate-500 tracking-widest">{tMethod('calibrationValue')}</p>
                </div>

                {/* certificate data rows */}
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-3 space-y-2.5 relative z-10">
                    <div className="flex justify-between items-center">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Report ID</span>
                        <span className="text-[8px] font-mono text-blue-400">AUR-2026-047</span>
                    </div>
                    <div className="w-full h-px bg-white/[0.06]" />
                    <div className="flex justify-between items-center">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Standard</span>
                        <span className="text-[8px] font-mono text-slate-300">EC8 · TBDY 2018</span>
                    </div>
                    <div className="w-full h-px bg-white/[0.06]" />
                    <div className="flex justify-between items-center">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Encryption</span>
                        <span className="text-[8px] font-mono text-slate-300">AES-256</span>
                    </div>
                    <div className="w-full h-px bg-white/[0.06]" />
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest shrink-0">Hash</span>
                        <span className="text-[8px] font-mono text-blue-400 truncate">{tMethod('hashText')}</span>
                    </div>
                </div>

                {/* footer PIN hint */}
                <div className="flex items-center gap-3 mt-1 relative z-10">
                    <div className="flex items-center gap-1">
                        {[0,1,2,3].map(i => (
                            <div key={i} className="w-5 h-7 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-slate-400 text-sm">·</div>
                        ))}
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-white uppercase tracking-[0.2em] leading-none mb-0.5">{tMethod('box3Title')}</p>
                        <p className="text-[8px] text-slate-500 font-light">{tMethod('nodeSynced')}</p>
                    </div>
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
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em]">{tMethod('precisionMetric')}</p>
                    </div>
                    <p className="text-6xl font-black text-slate-900 mb-1 tracking-tighter">14<span className="text-2xl text-slate-400 ml-1">days</span></p>
                    <p className="text-xs text-blue-700/60 uppercase tracking-widest font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {tMethod('accuracyLabel')}
                    </p>
                </div>
                <div className="relative z-10 grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100/80">
                    <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">{tMethod('errorMarginLabel')}</p>
                        <p className="text-sm font-bold text-slate-800">{tMethod('errorMarginValue')}</p>
                    </div>
                    <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">{tMethod('calibrationLabel')}</p>
                        <p className="text-sm font-bold text-slate-800">{tMethod('calibrationValue')}</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- THE VALUE OF CERTAINTY --- */}
      <section className="bg-white border-t border-slate-200/60 pt-32 pb-24 relative z-10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-12 gap-16 items-start">

                <div className="lg:col-span-5 flex flex-col items-start sticky top-12 md:top-32">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-8 shadow-sm">
                        {tValue('badge')}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight leading-[1.1] mb-8">
                        {tValue('title1')} <br />
                        <span className="italic font-serif text-blue-600">{tValue('title2')}</span>
                    </h2>
                    <div className="space-y-6 text-slate-500 font-light leading-relaxed text-lg">
                        <p>{tValue('p1')}</p>
                        <p>{tValue('p2')}</p>
                    </div>
                </div>

                <div className="lg:col-span-7 bg-white z-11">
                    <div className="grid md:grid-cols-2 gap-x-10 gap-y-14">
                        {valueFeatures.map(({ icon: Icon, title, desc }, i) => (
                          <div key={i} className="group">
                            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 w-fit group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-500 shadow-sm">
                              <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                            <p className="text-sm text-slate-500 font-light leading-relaxed">{desc}</p>
                          </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- INVESTMENT & TIMELINE (THE OBSIDIAN BLACK CARD) --- */}
      <section className="bg-slate-50 border-t border-slate-200/60 py-32 relative z-10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-24">
                <h2 className="text-4xl font-medium text-slate-900 tracking-tight mb-5">{tPrice('sectionTitle')}</h2>
                <p className="text-slate-500 font-light text-lg">{tPrice('sectionSubtitle')}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">

                {/* Left: The Obsidian Pricing Card */}
                <div className="bg-[#0A0F1C] rounded-[3rem] border border-slate-800 p-10 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.15)] relative overflow-hidden transition-shadow duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px]" />
                    <div className="relative z-10">
                        <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl w-fit border border-white/10 mb-8 shadow-inner">
                            <CreditCard className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-3">{tPrice('cardTitle')}</h3>
                        <p className="text-sm text-slate-400 font-light mb-10 leading-relaxed">{tPrice('cardDesc')}</p>

                        <div className="flex items-end gap-3 mb-10 border-b border-white/10 pb-10">
                            <span className="text-6xl font-black text-white tracking-tighter">{tPrice('price')}</span>
                            <span className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-widest">{tPrice('priceBase')}</span>
                        </div>

                        <ul className="space-y-5 mb-12">
                            {[tPrice('feat1'), tPrice('feat2'), tPrice('feat3'), tPrice('feat4')].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-sm text-slate-300 font-light">
                                    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" /> {item}
                                </li>
                            ))}
                        </ul>
                        <Link href={`/${locale}/engage`} className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-[2rem] text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-colors shadow-inner flex items-center justify-center gap-3">
                            {tPrice('ctaButton')} <Play className="w-3.5 h-3.5 fill-white" />
                        </Link>
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
                                <h4 className="text-2xl font-bold text-slate-900">{tPrice('step1Title')}</h4>
                                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-blue-100/50">{tPrice('step1Days')}</span>
                            </div>
                            <p className="text-base text-slate-500 font-light leading-relaxed">{tPrice('step1Desc')}</p>
                        </div>
                    </div>

                    <div className="flex gap-8 group">
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 font-black text-lg z-10 transition-colors duration-500 group-hover:border-blue-300">02</div>
                            <div className="w-px h-full bg-slate-200 mt-4 transition-colors duration-500 group-hover:bg-blue-200" />
                        </div>
                        <div className="pb-10">
                            <div className="flex items-center gap-4 mb-3">
                                <h4 className="text-2xl font-bold text-slate-900">{tPrice('step2Title')}</h4>
                                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-blue-100/50">{tPrice('step2Days')}</span>
                            </div>
                            <p className="text-base text-slate-500 font-light leading-relaxed">{tPrice('step2Desc')}</p>
                        </div>
                    </div>

                    <div className="flex gap-8 group">
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_8px_16px_rgba(37,99,235,0.25)] flex items-center justify-center text-white font-black text-lg z-10">03</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <h4 className="text-2xl font-bold text-slate-900">{tPrice('step3Title')}</h4>
                                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-emerald-100/50">{tPrice('step3Day')}</span>
                            </div>
                            <p className="text-base text-slate-500 font-light leading-relaxed">{tPrice('step3Desc')}</p>
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
                <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-4">{tFaq('sectionTitle')}</h2>
                <p className="text-slate-500 font-light">{tFaq('sectionSubtitle')}</p>
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
                        <div className={`px-8 transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
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
          <h2 className="text-3xl font-medium text-slate-900 mb-6">{tContact('sectionTitle')}</h2>
          <p className="text-slate-500 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            {tContact('sectionDesc')}
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
               <Globe className="w-6 h-6 text-blue-600 mb-4" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{tContact('hqLabel')}</p>
               <p className="text-sm text-slate-900 font-medium">{tContact('hqValue')}</p>
               <p className="text-xs text-slate-500 mt-1">{tContact('hqSub')}</p>
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
               <Mail className="w-6 h-6 text-blue-600 mb-4" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{tContact('emailLabel')}</p>
               <p className="text-sm text-slate-900 font-medium">{tContact('emailValue')}</p>
               <p className="text-xs text-slate-500 mt-1">{tContact('emailSub')}</p>
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
               <Phone className="w-6 h-6 text-blue-600 mb-4" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{tContact('phoneLabel')}</p>
               <p className="text-sm text-slate-900 font-medium">{tContact('phoneValue')}</p>
               <p className="text-xs text-slate-500 mt-1">{tContact('phoneSub')}</p>
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
                 <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-slate-900 block mb-1">{tFooter('brand')}</span>
                 <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{tFooter('tagline')}</span>
             </div>
          </div>
          <div className="flex flex-wrap gap-8 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
             <Link href={`/${locale}/about`} className="hover:text-blue-600 transition-colors">{tFooter('aboutUs')}</Link>
             <Link href={`/${locale}/projects`} className="hover:text-blue-600 transition-colors">{tFooter('projects')}</Link>
             <Link href={`/${locale}/procedures`} className="hover:text-blue-600 transition-colors">{tFooter('procedures')}</Link>
             <Link href={`/${locale}/contact`} className="hover:text-blue-600 transition-colors">{tFooter('contact')}</Link>
             <Link href={`/${locale}/kvkk`}    className="hover:text-blue-600 transition-colors">{tFooter('kvkk')}</Link>
             <Link href={`/${locale}/privacy`} className="hover:text-blue-600 transition-colors">{tFooter('privacy')}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
