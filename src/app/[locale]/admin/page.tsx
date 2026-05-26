'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Activity, Building2, Plus, Search, Edit2, Trash2,
  Eye, EyeOff, LogOut, FileText, Clock, CheckCircle,
  ImageIcon, Lock, BarChart3, ShieldCheck, Loader2, AlertCircle,
  RefreshCw, Mail, Phone, ChevronDown, ChevronUp, MessageSquare,
  MailOpen, MailCheck, Euro, Home, Factory, Layers,
  Settings, Upload, X, Microscope,
} from 'lucide-react';
import Link from 'next/link';

type Building = {
  id: number; uid: string; name: string; description: string;
  pin: string; imageUrl: string | null; pdfUrl: string | null; createdAt: string;
};

type ContactMessage = {
  id: number; name: string; email: string; phone: string | null;
  subject: string | null; message: string; isRead: boolean; createdAt: string;
};

type Quotation = {
  id: number; fullName: string; email: string; phone: string | null;
  company: string | null; propertyName: string; propertyType: string;
  propertySize: string; floors: string; buildingAge: string;
  addons: string | null; notes: string | null; totalPrice: number;
  status: string; isRead: boolean; createdAt: string;
};

export default function AdminDashboard() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) ?? 'en';
  const t      = useTranslations('AdminDashboard');
  const tMsg   = useTranslations('AdminMessages');
  const tQuot  = useTranslations('AdminQuotations');

  // ── Tab state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'buildings' | 'messages' | 'quotations' | 'settings'>('buildings');

  // ── Buildings state ────────────────────────────────────────────────────────
  const [buildings,    setBuildings]    = useState<Building[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [fetchError,   setFetchError]   = useState<string | null>(null);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [revealedPins, setRevealedPins] = useState<Set<number>>(new Set());
  const [deletingId,   setDeletingId]   = useState<number | null>(null);

  // ── Messages state ─────────────────────────────────────────────────────────
  const [messages,     setMessages]     = useState<ContactMessage[]>([]);
  const [msgsLoading,  setMsgsLoading]  = useState(false);
  const [msgsError,    setMsgsError]    = useState<string | null>(null);
  const [expandedMsg,  setExpandedMsg]  = useState<number | null>(null);

  // ── Quotations state ───────────────────────────────────────────────────────
  const [quotations,    setQuotations]    = useState<Quotation[]>([]);
  const [quotLoading,   setQuotLoading]   = useState(false);
  const [quotError,     setQuotError]     = useState<string | null>(null);
  const [expandedQuot,  setExpandedQuot]  = useState<number | null>(null);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}/admin/login`);
  };

  // ── Load buildings ─────────────────────────────────────────────────────────
  const loadBuildings = useCallback(async () => {
    setLoading(true); setFetchError(null);
    try {
      const res  = await fetch('/api/buildings', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) { setFetchError(json.error ?? t('failedLoad')); return; }
      setBuildings(json.buildings);
    } catch { setFetchError(t('networkError')); }
    finally  { setLoading(false); }
  }, [t]);

  useEffect(() => {
    loadBuildings();
    const handlePageShow = (e: PageTransitionEvent) => { if (e.persisted) loadBuildings(); };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [loadBuildings]);

  // ── Load messages ──────────────────────────────────────────────────────────
  const loadMessages = useCallback(async () => {
    setMsgsLoading(true); setMsgsError(null);
    try {
      const res  = await fetch('/api/admin/messages', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) { setMsgsError(json.error ?? tMsg('failedLoad')); return; }
      setMessages(json.messages);
    } catch { setMsgsError(tMsg('networkError')); }
    finally  { setMsgsLoading(false); }
  }, [tMsg]);

  useEffect(() => { if (activeTab === 'messages') loadMessages(); }, [activeTab, loadMessages]);

  // ── Load quotations ────────────────────────────────────────────────────────
  const loadQuotations = useCallback(async () => {
    setQuotLoading(true); setQuotError(null);
    try {
      const res  = await fetch('/api/admin/quotations', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) { setQuotError(json.error ?? tQuot('failedLoad')); return; }
      setQuotations(json.quotations);
    } catch { setQuotError(tQuot('networkError')); }
    finally  { setQuotLoading(false); }
  }, [tQuot]);

  // ── Load quotations on tab switch ──────────────────────────────────────────
  useEffect(() => { if (activeTab === 'quotations') loadQuotations(); }, [activeTab, loadQuotations]);

  const toggleQuotRead = async (q: Quotation) => {
    const newVal = !q.isRead;
    setQuotations(prev => prev.map(x => x.id === q.id ? { ...x, isRead: newVal } : x));
    await fetch('/api/admin/quotations', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id: q.id, isRead: newVal }),
    });
  };

  const updateQuotStatus = async (q: Quotation, status: string) => {
    setQuotations(prev => prev.map(x => x.id === q.id ? { ...x, status } : x));
    await fetch('/api/admin/quotations', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id: q.id, status }),
    });
  };

  // ── Toggle read ────────────────────────────────────────────────────────────
  const toggleRead = async (msg: ContactMessage) => {
    const newVal = !msg.isRead;
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: newVal } : m));
    await fetch('/api/admin/messages', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id: msg.id, isRead: newVal }),
    });
  };

  const filtered = buildings.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.uid.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const togglePin   = (id: number) => setRevealedPins(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/buildings/${id}`, { method: 'DELETE' });
      if (res.ok) setTimeout(() => { setBuildings(prev => prev.filter(b => b.id !== id)); setDeletingId(null); }, 450);
      else setDeletingId(null);
    } catch { setDeletingId(null); }
  };

  const withReport     = buildings.filter(b => !!b.pdfUrl).length;
  const withoutReport  = buildings.filter(b => !b.pdfUrl).length;
  const completionRate = buildings.length > 0 ? Math.round((withReport / buildings.length) * 100) : 0;
  // ── Settings state ─────────────────────────────────────────────────────────
  const tSet   = useTranslations('AdminSettings');
  const [settingsData,    setSettingsData]    = useState<Record<string, string | null>>({});
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError,   setSettingsError]   = useState<string | null>(null);
  const [sampleTitle,     setSampleTitle]     = useState('');
  const [sampleDesc,      setSampleDesc]      = useState('');
  const [samplePdfFile,   setSamplePdfFile]   = useState<File | null>(null);
  const [sampleDragOver,  setSampleDragOver]  = useState(false);
  const [settingsSaving,  setSettingsSaving]  = useState(false);
  const [settingsSaved,   setSettingsSaved]   = useState(false);
  const [settingsSaveErr, setSettingsSaveErr] = useState<string | null>(null);
  const samplePdfInputRef = useRef<HTMLInputElement>(null);

  const loadSettings = useCallback(async () => {
    setSettingsLoading(true); setSettingsError(null);
    try {
      const res  = await fetch('/api/admin/settings', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) { setSettingsError(json.error ?? tSet('networkError')); return; }
      setSettingsData(json.settings);
      setSampleTitle(json.settings['sample_title']       ?? '');
      setSampleDesc( json.settings['sample_description'] ?? '');
    } catch { setSettingsError(tSet('networkError')); }
    finally  { setSettingsLoading(false); }
  }, [tSet]);

  useEffect(() => { if (activeTab === 'settings') loadSettings(); }, [activeTab, loadSettings]);

  const handleSaveSettings = async () => {
    setSettingsSaving(true); setSettingsSaved(false); setSettingsSaveErr(null);
    try {
      // Save text fields
      await fetch('/api/admin/settings', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'sample_title', value: sampleTitle || null }),
      });
      await fetch('/api/admin/settings', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'sample_description', value: sampleDesc || null }),
      });
      // Upload PDF if selected
      if (samplePdfFile) {
        const form = new FormData();
        form.append('key', 'sample_pdf_url');
        form.append('pdf', samplePdfFile);
        const res  = await fetch('/api/admin/settings', { method: 'PATCH', body: form });
        const json = await res.json();
        if (res.ok && json.value) {
          setSettingsData(prev => ({ ...prev, sample_pdf_url: json.value }));
          setSamplePdfFile(null);
        }
      }
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch { setSettingsSaveErr(tSet('saveError')); }
    finally  { setSettingsSaving(false); }
  };

  const handleRemoveSamplePdf = async () => {
    await fetch('/api/admin/settings', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'sample_pdf_url' }),
    });
    setSettingsData(prev => ({ ...prev, sample_pdf_url: null }));
    setSamplePdfFile(null);
  };

  const unreadCount    = messages.filter(m => !m.isRead).length;
  const unreadQuotCount = quotations.filter(q => !q.isRead).length;

  const stats = [
    { label: t('totalBuildings'), value: buildings.length, icon: Building2,   bg: 'bg-blue-50',    iconColor: 'text-blue-600',    badge: t('allTime')  },
    { label: t('reportsReady'),   value: withReport,        icon: CheckCircle, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', badge: t('active')   },
    { label: t('awaitingPdf'),    value: withoutReport,     icon: Clock,       bg: 'bg-amber-50',   iconColor: 'text-amber-600',   badge: t('pending')  },
    { label: t('completion'),     value: `${completionRate}%`, icon: BarChart3, bg: 'bg-indigo-50', iconColor: 'text-indigo-600',  badge: t('rate')     },
  ];

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">

      {/* ══ HEADER ════════════════════════════════════════════════════════════ */}
      <header className="bg-[#0A0F1C] border-b border-white/[0.05] px-8 py-4 sticky top-0 z-50 shadow-xl shadow-black/20">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.35)]">
              <Activity className="h-4 w-4 text-white stroke-[2.5]" />
            </div>
            <div className="leading-none">
              <span className="font-bold tracking-[0.22em] text-[11px] uppercase text-white block mb-0.5">
                AURA <span className="text-blue-400 font-light">ANALYTICS</span>
              </span>
              <span className="text-[8px] text-slate-500 uppercase tracking-[0.3em] font-bold">{t('adminDashboard')}</span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link href={`/${locale}`} className="text-slate-500 hover:text-slate-300 text-[9px] uppercase tracking-[0.25em] font-bold transition-colors">{t('viewSite')}</Link>
            <div className="w-px h-4 bg-white/[0.08]" />
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] text-slate-300 uppercase tracking-[0.25em] font-bold">{t('adminSession')}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors text-[9px] uppercase tracking-[0.25em] font-bold">
              <LogOut className="h-3.5 w-3.5" /> {t('logout')}
            </button>
          </div>
        </div>
      </header>

      {/* ══ MAIN ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1440px] mx-auto px-8 py-10">

        {/* Page heading */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">{t('pageTitle')}</h1>
            <p className="text-sm text-slate-400 font-light">{t('pageSubtitle')}</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[9px] text-blue-700 font-bold uppercase tracking-[0.25em]">{t('vaultSecure')}</span>
          </div>
        </div>

        {/* ── Stat cards (buildings only) ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${s.bg}`}><s.icon className={`w-4 h-4 ${s.iconColor}`} /></div>
                <span className="text-[8px] text-slate-400 uppercase tracking-[0.25em] font-bold">{s.badge}</span>
              </div>
              <p className="text-[2.25rem] leading-none font-black text-slate-900 mb-1.5">{loading ? '—' : s.value}</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-[0.25em] font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Tab switcher ── */}
        <div className="flex items-center gap-1 mb-8 bg-white border border-slate-200 rounded-2xl p-1.5 w-fit shadow-sm">
          <button
            onClick={() => setActiveTab('buildings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${
              activeTab === 'buildings'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> {t('tabBuildings')}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${
              activeTab === 'messages'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> {tMsg('tabLabel')}
            {unreadCount > 0 && activeTab !== 'messages' && (
              <span className="bg-blue-600 text-white text-[8px] font-black rounded-full px-1.5 py-0.5 leading-none min-w-[1.1rem] text-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('quotations')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${
              activeTab === 'quotations'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Euro className="w-3.5 h-3.5" /> {tQuot('tabLabel')}
            {unreadQuotCount > 0 && activeTab !== 'quotations' && (
              <span className="bg-indigo-600 text-white text-[8px] font-black rounded-full px-1.5 py-0.5 leading-none min-w-[1.1rem] text-center">
                {unreadQuotCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> {tSet('tabLabel')}
          </button>
        </div>

        {/* ══════════ BUILDINGS TAB ══════════ */}
        {activeTab === 'buildings' && (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="bg-white border border-slate-200 text-slate-900 text-sm pl-11 pr-5 py-2.5 rounded-xl focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100/80 transition-all placeholder-slate-400 w-72 shadow-sm"
                  />
                </div>
                <button onClick={loadBuildings} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl transition-all shadow-sm" title={t('refresh')}>
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{t('refresh')}</span>
                </button>
              </div>
              <Link href={`/${locale}/admin/buildings/new`} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl flex items-center gap-2 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_4px_14px_rgba(37,99,235,0.22)] shrink-0">
                <Plus className="h-4 w-4" /> {t('newBuilding')}
              </Link>
            </div>

            {loading && <div className="flex flex-col items-center justify-center py-28 gap-4"><Loader2 className="w-8 h-8 text-blue-400 animate-spin" /><p className="text-slate-400 text-sm font-medium">{t('loadingBuildings')}</p></div>}

            {!loading && fetchError && (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
                <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem]"><AlertCircle className="w-10 h-10 text-red-400" /></div>
                <div>
                  <p className="text-slate-700 font-semibold mb-1">{t('failedToLoad')}</p>
                  <p className="text-slate-400 text-sm font-light mb-6">{fetchError}</p>
                  <button onClick={loadBuildings} className="flex items-center gap-2 mx-auto bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> {t('tryAgain')}
                  </button>
                </div>
              </div>
            )}

            {!loading && !fetchError && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(building => (
                  <div key={building.id} className={`bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5 ${deletingId === building.id ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                    <div className="h-48 relative bg-slate-100 overflow-hidden group">
                      {building.imageUrl ? (
                        <img src={building.imageUrl} alt={building.name} className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 to-slate-200">
                          <ImageIcon className="w-10 h-10 text-slate-300" />
                          <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">{t('noThumbnail')}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] font-mono font-bold text-white border border-white/20 shadow-sm">{building.uid}</div>
                      <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm ${building.pdfUrl ? 'bg-emerald-500/85 text-white' : 'bg-amber-500/85 text-white'}`}>
                        {building.pdfUrl ? <><CheckCircle className="w-2.5 h-2.5" /> {t('reportReady')}</> : <><Clock className="w-2.5 h-2.5" /> {t('pendingPdf')}</>}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 text-[15px] leading-snug mb-1.5">{building.name}</h3>
                      <p className="text-xs text-slate-400 font-light leading-relaxed mb-4 line-clamp-2">{building.description}</p>
                      <div className="flex items-center justify-between py-2.5 px-3.5 bg-slate-50 rounded-xl border border-slate-100/80 mb-4">
                        <div className="flex items-center gap-2"><Lock className="w-3 h-3 text-slate-400" /><span className="text-[8px] text-slate-500 uppercase tracking-[0.25em] font-bold">{t('accessPin')}</span></div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-[13px] tracking-[0.45em]">{revealedPins.has(building.id) ? building.pin : '••••'}</span>
                          <button onClick={() => togglePin(building.id)} className="text-slate-400 hover:text-slate-700 transition-colors" aria-label={revealedPins.has(building.id) ? t('hidePin') : t('revealPin')}>
                            {revealedPins.has(building.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <p className="text-[8px] text-slate-400 uppercase tracking-[0.25em] font-bold mb-4">
                        {t('registered')}:{' '}
                        {new Date(building.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <div className="flex gap-2">
                        <Link href={`/${locale}/admin/buildings/${building.id}/edit`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 transition-colors">
                          <Edit2 className="w-3 h-3" /> {t('edit')}
                        </Link>
                        {building.pdfUrl && (
                          <Link href={`/${locale}/admin/buildings/${building.id}/report`} className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-slate-100 transition-colors">
                            <FileText className="w-3 h-3" />
                          </Link>
                        )}
                        <button onClick={() => handleDelete(building.id)} disabled={deletingId === building.id} className="flex items-center justify-center py-2.5 px-3.5 bg-red-50 border border-red-100 text-red-400 rounded-xl text-[9px] font-bold hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50" aria-label="Delete building">
                          {deletingId === building.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && buildings.length > 0 && (
                  <div className="col-span-3 flex flex-col items-center justify-center py-28 text-center">
                    <div className="p-6 bg-slate-100 rounded-[2rem] mb-5"><Search className="w-10 h-10 text-slate-300" /></div>
                    <p className="text-slate-500 text-sm font-medium mb-1">{t('noResults')}</p>
                    <p className="text-slate-400 text-xs font-light">{t('tryDifferent')}</p>
                  </div>
                )}
                {buildings.length === 0 && (
                  <div className="col-span-3 flex flex-col items-center justify-center py-28 text-center">
                    <div className="p-6 bg-slate-100 rounded-[2rem] mb-5"><Building2 className="w-10 h-10 text-slate-300" /></div>
                    <p className="text-slate-500 text-sm font-medium mb-1">{t('emptyVault')}</p>
                    <p className="text-slate-400 text-xs font-light mb-8">{t('registerFirst')}</p>
                    <Link href={`/${locale}/admin/buildings/new`} className="text-blue-600 hover:text-blue-700 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> {t('registerNew')}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ══════════ MESSAGES TAB ══════════ */}
        {activeTab === 'messages' && (
          <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">{tMsg('title')}</h2>
                <p className="text-sm text-slate-400 font-light">{tMsg('subtitle')}</p>
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3.5 py-2 rounded-xl">
                    <MailOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[9px] text-blue-700 font-bold uppercase tracking-[0.2em]">
                      {unreadCount} {tMsg('unread')}
                    </span>
                  </div>
                )}
                <button onClick={loadMessages} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl transition-all shadow-sm">
                  <RefreshCw className={`h-3.5 w-3.5 ${msgsLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{tMsg('refresh')}</span>
                </button>
              </div>
            </div>

            {msgsLoading && <div className="flex flex-col items-center justify-center py-28 gap-4"><Loader2 className="w-8 h-8 text-blue-400 animate-spin" /><p className="text-slate-400 text-sm font-medium">{tMsg('loading')}</p></div>}

            {!msgsLoading && msgsError && (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
                <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem]"><AlertCircle className="w-10 h-10 text-red-400" /></div>
                <div>
                  <p className="text-slate-700 font-semibold mb-1">{tMsg('failedLoad')}</p>
                  <p className="text-slate-400 text-sm font-light mb-6">{msgsError}</p>
                  <button onClick={loadMessages} className="flex items-center gap-2 mx-auto bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> {tMsg('tryAgain')}
                  </button>
                </div>
              </div>
            )}

            {!msgsLoading && !msgsError && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <div className="p-6 bg-slate-100 rounded-[2rem] mb-5"><MessageSquare className="w-10 h-10 text-slate-300" /></div>
                <p className="text-slate-500 text-sm font-medium mb-1">{tMsg('noMessages')}</p>
                <p className="text-slate-400 text-xs font-light">{tMsg('noMessagesDesc')}</p>
              </div>
            )}

            {!msgsLoading && !msgsError && messages.length > 0 && (
              <div className="space-y-3">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                      msg.isRead ? 'border-slate-200' : 'border-blue-200 shadow-sm'
                    }`}
                  >
                    {/* Message header row */}
                    <div className="flex items-center gap-4 p-5">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black text-sm ${msg.isRead ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'}`}>
                        {msg.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className={`text-sm font-bold truncate ${msg.isRead ? 'text-slate-700' : 'text-slate-900'}`}>{msg.name}</span>
                          {!msg.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-[9px] text-slate-400 font-mono">{msg.email}</span>
                          {msg.phone && <span className="text-[9px] text-slate-400 font-mono">{msg.phone}</span>}
                          {msg.subject && (
                            <span className="text-[8px] font-bold text-blue-600 uppercase tracking-[0.15em] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">{msg.subject}</span>
                          )}
                        </div>
                      </div>

                      {/* Date + actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[8px] text-slate-400 uppercase tracking-[0.2em] font-bold hidden sm:block">
                          {new Date(msg.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <button
                          onClick={() => toggleRead(msg)}
                          title={msg.isRead ? tMsg('markUnread') : tMsg('markRead')}
                          className={`p-2 rounded-xl transition-colors ${msg.isRead ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-50' : 'text-blue-600 hover:bg-blue-50'}`}
                        >
                          {msg.isRead ? <Mail className="w-4 h-4" /> : <MailCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setExpandedMsg(expandedMsg === msg.id ? null : msg.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          {expandedMsg === msg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded message body */}
                    {expandedMsg === msg.id && (
                      <div className="px-5 pb-5 pt-0">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-2">{tMsg('messageLabel')}</p>
                          <p className="text-sm text-slate-700 font-light leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-3 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <a href={`mailto:${msg.email}`} className="text-[9px] text-blue-600 hover:underline font-mono">{msg.email}</a>
                          </div>
                          {msg.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <a href={`tel:${msg.phone}`} className="text-[9px] text-blue-600 hover:underline font-mono">{msg.phone}</a>
                            </div>
                          )}
                          <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold ml-auto">
                            {new Date(msg.createdAt).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════ QUOTATIONS TAB ══════════ */}
        {activeTab === 'quotations' && (
          <div>
            <div className="flex items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">{tQuot('title')}</h2>
                <p className="text-sm text-slate-400 font-light">{tQuot('subtitle')}</p>
              </div>
              <div className="flex items-center gap-3">
                {unreadQuotCount > 0 && (
                  <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3.5 py-2 rounded-xl">
                    <Euro className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[9px] text-indigo-700 font-bold uppercase tracking-[0.2em]">
                      {unreadQuotCount} {tQuot('unread')}
                    </span>
                  </div>
                )}
                <button onClick={loadQuotations} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl transition-all shadow-sm">
                  <RefreshCw className={`h-3.5 w-3.5 ${quotLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{tQuot('refresh')}</span>
                </button>
              </div>
            </div>

            {quotLoading && <div className="flex flex-col items-center justify-center py-28 gap-4"><Loader2 className="w-8 h-8 text-blue-400 animate-spin" /><p className="text-slate-400 text-sm font-medium">{tQuot('loading')}</p></div>}

            {!quotLoading && quotError && (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
                <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem]"><AlertCircle className="w-10 h-10 text-red-400" /></div>
                <div>
                  <p className="text-slate-700 font-semibold mb-1">{tQuot('failedLoad')}</p>
                  <p className="text-slate-400 text-sm font-light mb-6">{quotError}</p>
                  <button onClick={loadQuotations} className="flex items-center gap-2 mx-auto bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> {tQuot('tryAgain')}
                  </button>
                </div>
              </div>
            )}

            {!quotLoading && !quotError && quotations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <div className="p-6 bg-slate-100 rounded-[2rem] mb-5"><Euro className="w-10 h-10 text-slate-300" /></div>
                <p className="text-slate-500 text-sm font-medium mb-1">{tQuot('noQuotations')}</p>
                <p className="text-slate-400 text-xs font-light">{tQuot('noQuotationsDesc')}</p>
              </div>
            )}

            {!quotLoading && !quotError && quotations.length > 0 && (
              <div className="space-y-3">
                {quotations.map(q => {
                  const typeIconMap: Record<string, React.ReactNode> = {
                    residential: <Home className="w-4 h-4 text-blue-600" />,
                    commercial:  <Building2 className="w-4 h-4 text-blue-600" />,
                    industrial:  <Factory className="w-4 h-4 text-blue-600" />,
                    mixed:       <Layers className="w-4 h-4 text-blue-600" />,
                  };
                  const statusColors: Record<string, string> = {
                    pending:    'bg-amber-50  text-amber-700  border-amber-200',
                    reviewing:  'bg-blue-50   text-blue-700   border-blue-200',
                    confirmed:  'bg-emerald-50 text-emerald-700 border-emerald-200',
                    declined:   'bg-red-50    text-red-700    border-red-200',
                  };
                  const addonsArr: string[] = q.addons ? JSON.parse(q.addons) : [];
                  return (
                    <div key={q.id} className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${q.isRead ? 'border-slate-200' : 'border-indigo-200 shadow-sm'}`}>
                      {/* Row */}
                      <div className="flex items-center gap-4 p-5">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black text-sm ${q.isRead ? 'bg-slate-100 text-slate-500' : 'bg-indigo-100 text-indigo-700'}`}>
                          {q.fullName.charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className={`text-sm font-bold truncate ${q.isRead ? 'text-slate-700' : 'text-slate-900'}`}>{q.fullName}</span>
                            {!q.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[9px] text-slate-400 font-mono">{q.email}</span>
                            <span className="text-[9px] font-bold text-slate-600 truncate max-w-[180px]">{q.propertyName}</span>
                            <span className={`text-[8px] font-bold uppercase tracking-[0.15em] border px-2 py-0.5 rounded-full ${statusColors[q.status] ?? statusColors.pending}`}>
                              {tQuot(`status_${q.status}`)}
                            </span>
                          </div>
                        </div>

                        {/* Price + actions */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">{tQuot('totalEstimate')}</p>
                            <p className="text-sm font-black text-slate-900">€{q.totalPrice.toLocaleString('en-EU')}</p>
                          </div>
                          <button
                            onClick={() => toggleQuotRead(q)}
                            title={q.isRead ? tQuot('markUnread') : tQuot('markRead')}
                            className={`p-2 rounded-xl transition-colors ${q.isRead ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-50' : 'text-indigo-600 hover:bg-indigo-50'}`}
                          >
                            {q.isRead ? <Mail className="w-4 h-4" /> : <MailCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setExpandedQuot(expandedQuot === q.id ? null : q.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            {expandedQuot === q.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded */}
                      {expandedQuot === q.id && (
                        <div className="px-5 pb-5 pt-0 space-y-4">
                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {/* Contact */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-2">{tQuot('contactLabel')}</p>
                              <p className="text-xs font-bold text-slate-800">{q.fullName}</p>
                              <a href={`mailto:${q.email}`} className="text-[9px] text-blue-600 hover:underline font-mono block">{q.email}</a>
                              {q.phone && <a href={`tel:${q.phone}`} className="text-[9px] text-blue-600 hover:underline font-mono block">{q.phone}</a>}
                              {q.company && <p className="text-[9px] text-slate-500 mt-1">{q.company}</p>}
                            </div>
                            {/* Property */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-2">{tQuot('propertyLabel')}</p>
                              <div className="flex items-center gap-2 mb-1">
                                {typeIconMap[q.propertyType]}
                                <p className="text-xs font-bold text-slate-800 truncate">{q.propertyName}</p>
                              </div>
                              <p className="text-[9px] text-slate-500 capitalize">{q.propertyType} · {q.propertySize.replace(/_/g,' ')}</p>
                              <p className="text-[9px] text-slate-500">{q.floors.replace(/_/g,' ')} floors · {q.buildingAge.replace(/_/g,' ')} old</p>
                            </div>
                            {/* Add-ons */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-2">{tQuot('addonsLabel')}</p>
                              {addonsArr.length > 0
                                ? addonsArr.map(a => <p key={a} className="text-[9px] text-slate-600 capitalize">• {a}</p>)
                                : <p className="text-[9px] text-slate-400">—</p>}
                              <p className="text-sm font-black text-slate-900 mt-2">€{q.totalPrice.toLocaleString('en-EU')}</p>
                            </div>
                            {/* Notes */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-2">{tQuot('notesLabel')}</p>
                              <p className="text-[9px] text-slate-600 leading-relaxed whitespace-pre-wrap">{q.notes || '—'}</p>
                              <p className="text-[8px] text-slate-400 font-bold mt-2">
                                {new Date(q.createdAt).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          {/* Status updater */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">{tQuot('updateStatus')}:</span>
                            {(['pending','reviewing','confirmed','declined'] as const).map(s => (
                              <button
                                key={s}
                                onClick={() => updateQuotStatus(q, s)}
                                className={`px-3 py-1.5 rounded-lg border text-[8px] font-bold uppercase tracking-[0.15em] transition-all ${
                                  q.status === s
                                    ? (statusColors[s] ?? '') + ' font-black'
                                    : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                {tQuot(`status_${s}`)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════ SETTINGS TAB ══════════ */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">{tSet('title')}</h2>
                <p className="text-sm text-slate-400 font-light">{tSet('subtitle')}</p>
              </div>
              <button onClick={loadSettings} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl transition-all shadow-sm">
                <RefreshCw className={`h-3.5 w-3.5 ${settingsLoading ? 'animate-spin' : ''}`} />
                {tSet('refresh')}
              </button>
            </div>

            {settingsLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-slate-400 text-sm">{tSet('loading')}</p>
              </div>
            )}

            {!settingsLoading && settingsError && (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
                <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem]"><AlertCircle className="w-10 h-10 text-red-400" /></div>
                <div>
                  <p className="text-slate-700 font-semibold mb-6">{settingsError}</p>
                  <button onClick={loadSettings} className="flex items-center gap-2 mx-auto bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> {tSet('tryAgain')}
                  </button>
                </div>
              </div>
            )}

            {!settingsLoading && !settingsError && (
              <div className="bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm">

                {/* Section header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-start gap-5">
                  <div className="p-3 bg-blue-50 rounded-2xl shrink-0">
                    <Microscope className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">{tSet('sampleSectionTitle')}</h3>
                    <p className="text-sm text-slate-400 font-light leading-relaxed">{tSet('sampleSectionSubtitle')}</p>
                  </div>
                  {/* Status pill */}
                  <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] border shrink-0 ${
                    settingsData['sample_pdf_url']
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${settingsData['sample_pdf_url'] ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    {settingsData['sample_pdf_url'] ? tSet('statusEnabled') : tSet('statusDisabled')}
                  </div>
                </div>

                <div className="p-8 space-y-6">

                  {/* PDF Upload */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-3">{tSet('pdfLabel')}</label>
                    <input
                      ref={samplePdfInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) setSamplePdfFile(f); }}
                    />
                    <div
                      onDragOver={e => { e.preventDefault(); setSampleDragOver(true); }}
                      onDragLeave={() => setSampleDragOver(false)}
                      onDrop={e => {
                        e.preventDefault(); setSampleDragOver(false);
                        const f = e.dataTransfer.files[0];
                        if (f?.type === 'application/pdf') setSamplePdfFile(f);
                      }}
                      onClick={() => samplePdfInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                        sampleDragOver
                          ? 'border-blue-400 bg-blue-50'
                          : samplePdfFile || settingsData['sample_pdf_url']
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40'
                      }`}
                    >
                      {sampleDragOver ? (
                        <>
                          <Upload className="w-8 h-8 text-blue-500" />
                          <p className="text-sm font-bold text-blue-600">{tSet('dropHere')}</p>
                        </>
                      ) : samplePdfFile ? (
                        <>
                          <FileText className="w-8 h-8 text-emerald-600" />
                          <p className="text-sm font-bold text-emerald-700">{samplePdfFile.name}</p>
                          <p className="text-[9px] text-emerald-600 font-mono">{(samplePdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </>
                      ) : settingsData['sample_pdf_url'] ? (
                        <>
                          <FileText className="w-8 h-8 text-emerald-600" />
                          <p className="text-sm font-bold text-emerald-700">{tSet('pdfUploaded')}</p>
                          <p className="text-[9px] text-slate-400 font-light">{tSet('pdfUploadedHint')}</p>
                          <a
                            href={settingsData['sample_pdf_url']}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-[9px] text-blue-600 hover:underline font-mono truncate max-w-xs"
                          >
                            {settingsData['sample_pdf_url'].split('/').pop()}
                          </a>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-400" />
                          <p className="text-sm font-medium text-slate-500">{tSet('uploadPdf')}</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">PDF only</p>
                        </>
                      )}
                    </div>

                    {(samplePdfFile || settingsData['sample_pdf_url']) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSamplePdfFile(null);
                          if (samplePdfInputRef.current) samplePdfInputRef.current.value = '';
                          if (!samplePdfFile) handleRemoveSamplePdf();
                        }}
                        className="mt-2 flex items-center gap-1.5 text-[9px] font-bold text-red-500 hover:text-red-700 uppercase tracking-[0.2em] transition-colors"
                      >
                        <X className="w-3 h-3" /> {tSet('removePdf')}
                      </button>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-2">{tSet('sampleTitleLabel')}</label>
                    <input
                      type="text"
                      value={sampleTitle}
                      onChange={e => setSampleTitle(e.target.value)}
                      placeholder={tSet('sampleTitlePlaceholder')}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-2">{tSet('sampleDescLabel')}</label>
                    <textarea
                      value={sampleDesc}
                      onChange={e => setSampleDesc(e.target.value)}
                      placeholder={tSet('sampleDescPlaceholder')}
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm px-5 py-3.5 rounded-xl focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400 resize-none"
                    />
                  </div>

                  {/* Save button + feedback */}
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      disabled={settingsSaving}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3.5 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md disabled:opacity-60"
                    >
                      {settingsSaving
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {tSet('saving')}</>
                        : <><CheckCircle className="w-3.5 h-3.5" /> {tSet('saveButton')}</>}
                    </button>
                    {settingsSaved && (
                      <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> {tSet('saveSuccess')}
                      </span>
                    )}
                    {settingsSaveErr && (
                      <span className="text-[9px] text-red-500 font-bold uppercase tracking-[0.2em]">{settingsSaveErr}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
