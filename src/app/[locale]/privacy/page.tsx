'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Activity, Database, Settings, Key, Cookie,
  Share2, Lock, Clock, UserCheck, Globe, RefreshCw,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';

export default function PrivacyPage() {
  const params  = useParams();
  const locale  = (params.locale as string) ?? 'en';
  const t       = useTranslations('PrivacyPage');
  const tFooter = useTranslations('Footer');

  const sections = [
    { icon: Database,   color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100',    title: t('s1Title'),  content: t('s1Content')  },
    { icon: Settings,   color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-100',  title: t('s2Title'),  content: t('s2Content')  },
    { icon: Key,        color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', title: t('s3Title'),  content: t('s3Content')  },
    { icon: Cookie,     color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-100',  title: t('s4Title'),  content: t('s4Content')  },
    { icon: Share2,     color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100',    title: t('s5Title'),  content: t('s5Content')  },
    { icon: Lock,       color: 'text-slate-700',   bg: 'bg-slate-100',  border: 'border-slate-200',   title: t('s6Title'),  content: t('s6Content')  },
    { icon: Clock,      color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100',   title: t('s7Title'),  content: t('s7Content')  },
    { icon: UserCheck,  color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100',  title: t('s8Title'),  content: t('s8Content')  },
    { icon: Globe,      color: 'text-teal-600',    bg: 'bg-teal-50',    border: 'border-teal-100',    title: t('s9Title'),  content: t('s9Content')  },
    { icon: RefreshCw,  color: 'text-cyan-600',    bg: 'bg-cyan-50',    border: 'border-cyan-100',    title: t('s10Title'), content: t('s10Content') },
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
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-8 py-20 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-[9px] font-bold tracking-[0.25em] text-indigo-400 uppercase mb-6">
            {t('badge')}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4 max-w-3xl">
            {t('title')}{' '}
            <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
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

        {/* ── Quick summary bar ─────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10 -mt-6 relative z-10">
          {[
            { icon: Lock,     label: t('pillEncryption'), color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100'   },
            { icon: Share2,   label: t('pillNoSell'),     color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-100' },
            { icon: UserCheck,label: t('pillRights'),     color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100'  },
          ].map((pill, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-md flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${pill.bg} border ${pill.border} shrink-0`}>
                <pill.icon className={`w-4 h-4 ${pill.color}`} />
              </div>
              <p className="text-xs font-bold text-slate-700">{pill.label}</p>
            </div>
          ))}
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

        {/* ── Contact ───────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[1.5rem] border border-slate-700 p-8 shadow-sm mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-[60px]" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl border border-white/20 shrink-0">
                <Mail className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{t('contactTitle')}</p>
                <p className="text-sm text-slate-300 font-light leading-relaxed max-w-lg">{t('contactDesc')}</p>
                <p className="text-sm font-bold text-indigo-400 mt-2">{t('contactEmail')}</p>
              </div>
            </div>
            <Link
              href={`/${locale}/kvkk`}
              className="shrink-0 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-white transition-colors"
            >
              {t('kvkkLink')}
            </Link>
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
            <Link href={`/${locale}/kvkk`}       className="hover:text-blue-600 transition-colors">{tFooter('kvkk')}</Link>
            <Link href={`/${locale}/privacy`}    className="text-blue-600">{tFooter('privacy')}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
