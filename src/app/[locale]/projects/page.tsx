'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Activity, Building2, Search, CheckCircle, Clock,
  ImageIcon, BarChart3, ShieldCheck, Loader2, AlertCircle,
  RefreshCw, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';

type Project = {
  id: number;
  uid: string;
  name: string;
  description: string;
  imageUrl: string | null;
  hasPdf: boolean;
  createdAt: string;
};

export default function ProjectsPage() {
  const params = useParams();
  const locale = (params.locale as string) ?? 'en';
  const t = useTranslations('ProjectsPage');
  const tFooter = useTranslations('Footer');

  const [projects,   setProjects]   = useState<Project[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res  = await fetch('/api/public/projects', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) { setFetchError(json.error ?? t('failedToLoad')); return; }
      setProjects(json.buildings);
    } catch {
      setFetchError(t('networkError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const filtered   = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.uid.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const certified  = projects.filter(p => p.hasPdf).length;
  const pending    = projects.filter(p => !p.hasPdf).length;
  const rate       = projects.length > 0 ? Math.round((certified / projects.length) * 100) : 0;

  const stats = [
    { label: t('totalLabel'),     value: projects.length, icon: Building2,   bg: 'bg-blue-50',    iconColor: 'text-blue-600',    sub: t('allTime')      },
    { label: t('certifiedLabel'), value: certified,        icon: CheckCircle, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', sub: t('certifiedSub') },
    { label: t('pendingLabel'),   value: pending,          icon: Clock,       bg: 'bg-amber-50',   iconColor: 'text-amber-600',   sub: t('pendingSub')   },
    { label: t('rateLabel'),      value: `${rate}%`,       icon: BarChart3,   bg: 'bg-indigo-50',  iconColor: 'text-indigo-600',  sub: t('rateSub')      },
  ];

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">

      <PublicNavbar locale={locale} activePage="projects" />

      {/* ══ MAIN ════════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1440px] mx-auto px-8 py-10">

        {/* Page heading */}
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[9px] font-bold tracking-[0.25em] text-blue-700 uppercase mb-4 shadow-sm">
              {t('badge')}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
              {t('title')}{' '}
              <span className="italic font-serif text-blue-600">{t('titleItalic')}</span>
            </h1>
            <p className="text-sm text-slate-400 font-light max-w-2xl leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[9px] text-blue-700 font-bold uppercase tracking-[0.25em]">
              {t('vaultVerified')}
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
                <span className="text-[8px] text-slate-400 uppercase tracking-[0.25em] font-bold">{s.sub}</span>
              </div>
              <p className="text-[2.25rem] leading-none font-black text-slate-900 mb-1.5">
                {loading ? '—' : s.value}
              </p>
              <p className="text-[9px] text-slate-400 uppercase tracking-[0.25em] font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 mb-6">
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
            onClick={loadProjects}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t('refresh')}</span>
          </button>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">{t('loading')}</p>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && fetchError && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
            <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem]">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <div>
              <p className="text-slate-700 font-semibold mb-1">{t('failedToLoad')}</p>
              <p className="text-slate-400 text-sm font-light mb-6">{fetchError}</p>
              <button
                onClick={loadProjects}
                className="flex items-center gap-2 mx-auto bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> {t('tryAgain')}
              </button>
            </div>
          </div>
        )}

        {/* ── Project Cards ── */}
        {!loading && !fetchError && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(project => (
              <div
                key={project.id}
                className="bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="h-48 relative bg-slate-100 overflow-hidden group">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 to-slate-200">
                      <ImageIcon className="w-10 h-10 text-slate-300" />
                      <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">{t('noThumbnail')}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] font-mono font-bold text-white border border-white/20 shadow-sm">
                    {project.uid}
                  </div>
                  <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm ${
                    project.hasPdf ? 'bg-emerald-500/85 text-white' : 'bg-amber-500/85 text-white'
                  }`}>
                    {project.hasPdf
                      ? <><CheckCircle className="w-2.5 h-2.5" /> {t('reportCertified')}</>
                      : <><Clock className="w-2.5 h-2.5" /> {t('reportPending')}</>}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-[15px] leading-snug mb-1.5">{project.name}</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed mb-4 line-clamp-2">{project.description}</p>
                  <p className="text-[8px] text-slate-400 uppercase tracking-[0.25em] font-bold mb-4">
                    {t('registered')}:{' '}
                    {new Date(project.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                  <Link
                    href={`/${locale}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> {t('viewOnPortal')}
                  </Link>
                </div>
              </div>
            ))}

            {filtered.length === 0 && projects.length > 0 && (
              <div className="col-span-3 flex flex-col items-center justify-center py-28 text-center">
                <div className="p-6 bg-slate-100 rounded-[2rem] mb-5">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">{t('noResults')}</p>
                <p className="text-slate-400 text-xs font-light">{t('tryDifferent')}</p>
              </div>
            )}

            {projects.length === 0 && (
              <div className="col-span-3 flex flex-col items-center justify-center py-28 text-center">
                <div className="p-6 bg-slate-100 rounded-[2rem] mb-5">
                  <Building2 className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">{t('emptyState')}</p>
                <p className="text-slate-400 text-xs font-light">{t('emptyStateSub')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-200 py-16 bg-white mt-12">
        <div className="max-w-[1440px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-xl">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-slate-900 block mb-0.5">{tFooter('brand')}</span>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{tFooter('tagline')}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <Link href={`/${locale}/about`}      className="hover:text-blue-600 transition-colors">{tFooter('aboutUs')}</Link>
            <Link href={`/${locale}/projects`}   className="text-blue-600">{tFooter('projects')}</Link>
            <Link href={`/${locale}/procedures`} className="hover:text-blue-600 transition-colors">{tFooter('procedures')}</Link>
            <Link href={`/${locale}/contact`}    className="hover:text-blue-600 transition-colors">{tFooter('contact')}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
