'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Activity, Building2, Plus, Search, Edit2, Trash2,
  Eye, EyeOff, LogOut, FileText, Clock, CheckCircle,
  ImageIcon, Lock, BarChart3, ShieldCheck, Loader2, AlertCircle,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
type Building = {
  id: number;
  uid: string;
  name: string;
  description: string;
  pin: string;
  imageUrl: string | null;
  pdfUrl: string | null;
  createdAt: string;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const params   = useParams();
  const router   = useRouter();
  const locale   = (params.locale as string) ?? 'en';
  const t        = useTranslations('AdminDashboard');

  const [buildings,     setBuildings]     = useState<Building[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [fetchError,    setFetchError]    = useState<string | null>(null);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [revealedPins,  setRevealedPins]  = useState<Set<number>>(new Set());
  const [deletingId,    setDeletingId]    = useState<number | null>(null);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}/admin/login`);
  };

  // ── Fetch buildings from DB ─────────────────────────────────────────────────
  const loadBuildings = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res  = await fetch('/api/buildings', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) {
        setFetchError(json.error ?? t('failedLoad'));
        return;
      }
      setBuildings(json.buildings);
    } catch {
      setFetchError(t('networkError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadBuildings();

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) loadBuildings();
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [loadBuildings]);

  const filtered = buildings.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.uid.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const togglePin = (id: number) => {
    setRevealedPins(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Delete with API call ────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/buildings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTimeout(() => {
          setBuildings(prev => prev.filter(b => b.id !== id));
          setDeletingId(null);
        }, 450);
      } else {
        setDeletingId(null);
      }
    } catch {
      setDeletingId(null);
    }
  };

  const withReport     = buildings.filter(b => !!b.pdfUrl).length;
  const withoutReport  = buildings.filter(b => !b.pdfUrl).length;
  const completionRate = buildings.length > 0
    ? Math.round((withReport / buildings.length) * 100)
    : 0;

  // ─── Stats config ─────────────────────────────────────────────────────────
  const stats = [
    {
      label: t('totalBuildings'),
      value: buildings.length,
      icon: Building2,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badge: t('allTime'),
    },
    {
      label: t('reportsReady'),
      value: withReport,
      icon: CheckCircle,
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      badge: t('active'),
    },
    {
      label: t('awaitingPdf'),
      value: withoutReport,
      icon: Clock,
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      badge: t('pending'),
    },
    {
      label: t('completion'),
      value: `${completionRate}%`,
      icon: BarChart3,
      bg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      badge: t('rate'),
    },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header className="bg-[#0A0F1C] border-b border-white/[0.05] px-8 py-4 sticky top-0 z-50 shadow-xl shadow-black/20">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.35)]">
              <Activity className="h-4 w-4 text-white stroke-[2.5]" />
            </div>
            <div className="leading-none">
              <span className="font-bold tracking-[0.22em] text-[11px] uppercase text-white block mb-0.5">
                AURA <span className="text-blue-400 font-light">ANALYTICS</span>
              </span>
              <span className="text-[8px] text-slate-500 uppercase tracking-[0.3em] font-bold">
                {t('adminDashboard')}
              </span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-5">
            <Link
              href={`/${locale}`}
              className="text-slate-500 hover:text-slate-300 text-[9px] uppercase tracking-[0.25em] font-bold transition-colors"
            >
              {t('viewSite')}
            </Link>
            <div className="w-px h-4 bg-white/[0.08]" />
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] text-slate-300 uppercase tracking-[0.25em] font-bold">
                {t('adminSession')}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors text-[9px] uppercase tracking-[0.25em] font-bold"
            >
              <LogOut className="h-3.5 w-3.5" /> {t('logout')}
            </button>
          </div>
        </div>
      </header>

      {/* ══ MAIN CONTENT ════════════════════════════════════════════════════ */}
      <div className="max-w-[1440px] mx-auto px-8 py-10">

        {/* Page heading */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
              {t('pageTitle')}
            </h1>
            <p className="text-sm text-slate-400 font-light">
              {t('pageSubtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[9px] text-blue-700 font-bold uppercase tracking-[0.25em]">
              {t('vaultSecure')}
            </span>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${s.bg}`}>
                  <s.icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
                <span className="text-[8px] text-slate-400 uppercase tracking-[0.25em] font-bold">
                  {s.badge}
                </span>
              </div>
              <p className="text-[2.25rem] leading-none font-black text-slate-900 mb-1.5">
                {loading ? '—' : s.value}
              </p>
              <p className="text-[9px] text-slate-400 uppercase tracking-[0.25em] font-bold">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="bg-white border border-slate-200 text-slate-900 text-sm pl-11 pr-5 py-2.5 rounded-xl focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100/80 transition-all placeholder-slate-400 w-72 shadow-sm"
              />
            </div>
            <button
              onClick={loadBuildings}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl transition-all shadow-sm"
              title={t('refresh')}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t('refresh')}</span>
            </button>
          </div>
          <Link
            href={`/${locale}/admin/buildings/new`}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl flex items-center gap-2 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_4px_14px_rgba(37,99,235,0.22)] shrink-0"
          >
            <Plus className="h-4 w-4" /> {t('newBuilding')}
          </Link>
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">{t('loadingBuildings')}</p>
          </div>
        )}

        {/* ── Error state ── */}
        {!loading && fetchError && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
            <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem]">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <div>
              <p className="text-slate-700 font-semibold mb-1">{t('failedToLoad')}</p>
              <p className="text-slate-400 text-sm font-light mb-6">{fetchError}</p>
              <button
                onClick={loadBuildings}
                className="flex items-center gap-2 mx-auto bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> {t('tryAgain')}
              </button>
            </div>
          </div>
        )}

        {/* ── Building cards ── */}
        {!loading && !fetchError && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(building => (
              <div
                key={building.id}
                className={`bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5 ${
                  deletingId === building.id
                    ? 'opacity-0 scale-95 pointer-events-none'
                    : 'opacity-100 scale-100'
                }`}
              >
                {/* ── Thumbnail ── */}
                <div className="h-48 relative bg-slate-100 overflow-hidden group">
                  {building.imageUrl ? (
                    <img
                      src={building.imageUrl}
                      alt={building.name}
                      className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 to-slate-200">
                      <ImageIcon className="w-10 h-10 text-slate-300" />
                      <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">
                        {t('noThumbnail')}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* UID */}
                  <div className="absolute bottom-3 left-3 bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] font-mono font-bold text-white border border-white/20 shadow-sm">
                    {building.uid}
                  </div>

                  {/* Status */}
                  <div
                    className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm ${
                      building.pdfUrl
                        ? 'bg-emerald-500/85 text-white'
                        : 'bg-amber-500/85 text-white'
                    }`}
                  >
                    {building.pdfUrl ? (
                      <><CheckCircle className="w-2.5 h-2.5" /> {t('reportReady')}</>
                    ) : (
                      <><Clock className="w-2.5 h-2.5" /> {t('pendingPdf')}</>
                    )}
                  </div>
                </div>

                {/* ── Content ── */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-[15px] leading-snug mb-1.5">
                    {building.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed mb-4 line-clamp-2">
                    {building.description}
                  </p>

                  {/* PIN row */}
                  <div className="flex items-center justify-between py-2.5 px-3.5 bg-slate-50 rounded-xl border border-slate-100/80 mb-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span className="text-[8px] text-slate-500 uppercase tracking-[0.25em] font-bold">
                        {t('accessPin')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-[13px] tracking-[0.45em]">
                        {revealedPins.has(building.id) ? building.pin : '••••'}
                      </span>
                      <button
                        onClick={() => togglePin(building.id)}
                        className="text-slate-400 hover:text-slate-700 transition-colors"
                        aria-label={revealedPins.has(building.id) ? t('hidePin') : t('revealPin')}
                      >
                        {revealedPins.has(building.id)
                          ? <EyeOff className="w-3.5 h-3.5" />
                          : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Date */}
                  <p className="text-[8px] text-slate-400 uppercase tracking-[0.25em] font-bold mb-4">
                    {t('registered')}:{' '}
                    {new Date(building.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/${locale}/admin/buildings/${building.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" /> {t('edit')}
                    </Link>
                    {building.pdfUrl && (
                      <Link
                        href={`/${locale}/admin/buildings/${building.id}/report`}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-slate-100 transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(building.id)}
                      disabled={deletingId === building.id}
                      className="flex items-center justify-center py-2.5 px-3.5 bg-red-50 border border-red-100 text-red-400 rounded-xl text-[9px] font-bold hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
                      aria-label="Delete building"
                    >
                      {deletingId === building.id
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <Trash2 className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* ── Empty state ── */}
            {filtered.length === 0 && buildings.length > 0 && (
              <div className="col-span-3 flex flex-col items-center justify-center py-28 text-center">
                <div className="p-6 bg-slate-100 rounded-[2rem] mb-5">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">
                  {t('noResults')}
                </p>
                <p className="text-slate-400 text-xs font-light">
                  {t('tryDifferent')}
                </p>
              </div>
            )}

            {/* ── First-time empty state ── */}
            {buildings.length === 0 && (
              <div className="col-span-3 flex flex-col items-center justify-center py-28 text-center">
                <div className="p-6 bg-slate-100 rounded-[2rem] mb-5">
                  <Building2 className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">
                  {t('emptyVault')}
                </p>
                <p className="text-slate-400 text-xs font-light mb-8">
                  {t('registerFirst')}
                </p>
                <Link
                  href={`/${locale}/admin/buildings/new`}
                  className="text-blue-600 hover:text-blue-700 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> {t('registerNew')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
