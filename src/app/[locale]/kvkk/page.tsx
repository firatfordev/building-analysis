'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Activity, Database, Scale, Target, UserCheck,
  Lock, Share2, Cookie, RefreshCw, CheckCircle,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';

export default function KVKKPage() {
  const params  = useParams();
  const locale  = (params.locale as string) ?? 'en';
  const t       = useTranslations('KVKKPage');
  const tFooter = useTranslations('Footer');

  const sections = [
    { icon: Database,   color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100',    title: t('s1Title'), content: t('s1Content') },
    { icon: Scale,      color: 'text-violet-600',   bg: 'bg-violet-50',  border: 'border-violet-100',  title: t('s2Title'), content: t('s2Content') },
    { icon: Target,     color: 'text-indigo-600',   bg: 'bg-indigo-50',  border: 'border-indigo-100',  title: t('s3Title'), content: t('s3Content') },
    { icon: UserCheck,  color: 'text-emerald-600',  bg: 'bg-emerald-50', border: 'border-emerald-100', title: t('s4Title'), content: t('s4Content') },
    { icon: RefreshCw,  color: 'text-amber-600',    bg: 'bg-amber-50',   border: 'border-amber-100',   title: t('s5Title'), content: t('s5Content') },
    { icon: Lock,       color: 'text-slate-700',    bg: 'bg-slate-100',  border: 'border-slate-200',   title: t('s6Title'), content: t('s6Content') },
    { icon: Share2,     color: 'text-rose-600',     bg: 'bg-rose-50',    border: 'border-rose-100',    title: t('s7Title'), content: t('s7Content') },
    { icon: Cookie,     color: 'text-orange-600',   bg: 'bg-orange-50',  border: 'border-orange-100',  title: t('s8Title'), content: t('s8Content') },
    { icon: RefreshCw,  color: 'text-teal-600',     bg: 'bg-teal-50',    border: 'border-teal-100',    title: t('s9Title'), content: t('s9Content') },
  ];

  const rights = [
    t('r1'), t('r2'), t('r3'), t('r4'),
    t('r5'), t('r6'), t('r7'), t('r8'),
  ];

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">

      <PublicNavbar locale={locale} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div className="bg-[#0A0F1C] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right,rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.05) 1px,transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-8 py-20 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-[9px] font-bold tracking-[0.25em] text-blue-400 uppercase mb-6">
            {t('badge')}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4 max-w-3xl">
            {t('title')}{' '}
            <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              {t('titleItalic')}
            </span>
          </h1>
          <p className="text-slate-400 font-light max-w-2xl leading-relaxed text-base mb-4">
            {t('subtitle')}
          </p>
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">
            {t('lastUpdated')}
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-12">

        {/* ── Data Controller banner ─────────────────────────────────────────── */}
        <div className="bg-blue-600 rounded-[1.5rem] p-6 mb-10 relative overflow-hidden -mt-6 shadow-[0_20px_50px_rgba(37,99,235,0.25)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px]" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black text-blue-200 uppercase tracking-[0.3em] mb-1">{t('controllerTitle')}</p>
              <p className="text-sm text-white font-light leading-relaxed">{t('controllerDesc')}</p>
            </div>
          </div>
        </div>

        {/* ── Rights summary grid ────────────────────────────────────────────── */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
              {t('rightsTitle')}
            </h2>
            <p className="text-sm text-slate-400 font-light">{t('rightsSubtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {rights.map((right, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-3 group hover:-translate-y-0.5">
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 shrink-0 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-colors duration-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-snug pt-0.5">{right}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Legal sections ─────────────────────────────────────────────────── */}
        <div className="space-y-4 mb-12">
          {sections.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-[1.5rem] border border-slate-200/80 p-7 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start gap-5">
                <div className={`p-3 rounded-xl ${s.bg} border ${s.border} shrink-0`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[8px] font-black text-slate-400 font-mono uppercase tracking-[0.3em]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 font-light leading-relaxed">{s.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── DPO Contact ────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[1.5rem] border border-slate-700 p-8 shadow-sm mb-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[60px]" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl border border-white/20 shrink-0">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{t('contactTitle')}</p>
                <p className="text-sm text-slate-300 font-light leading-relaxed max-w-lg">{t('contactDesc')}</p>
                <p className="text-sm font-bold text-blue-400 mt-2">{t('dpoEmail')}</p>
              </div>
            </div>
            <p className="text-[9px] font-mono text-slate-500 max-w-xs shrink-0">{t('dpoNote')}</p>
          </div>
        </div>

      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 py-16 bg-white mt-8">
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
            <Link href={`/${locale}/projects`}   className="hover:text-blue-600 transition-colors">{tFooter('projects')}</Link>
            <Link href={`/${locale}/procedures`} className="hover:text-blue-600 transition-colors">{tFooter('procedures')}</Link>
            <Link href={`/${locale}/contact`}    className="hover:text-blue-600 transition-colors">{tFooter('contact')}</Link>
            <Link href={`/${locale}/kvkk`}       className="text-blue-600">{tFooter('kvkk')}</Link>
            <Link href={`/${locale}/privacy`}    className="hover:text-blue-600 transition-colors">{tFooter('privacy')}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
