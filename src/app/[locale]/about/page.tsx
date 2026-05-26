'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Activity, ShieldCheck, Microscope, Zap, Binary,
  Users, Award, CheckCircle, BarChart3, Globe,
  Building2, TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';

export default function AboutPage() {
  const params = useParams();
  const locale = (params.locale as string) ?? 'en';
  const t = useTranslations('AboutPage');
  const tFooter = useTranslations('Footer');

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), sub: t('stat1Sub'), bg: 'bg-blue-50',    iconColor: 'text-blue-600',    icon: Building2 },
    { value: t('stat2Value'), label: t('stat2Label'), sub: t('stat2Sub'), bg: 'bg-indigo-50',  iconColor: 'text-indigo-600',  icon: Award     },
    { value: t('stat3Value'), label: t('stat3Label'), sub: t('stat3Sub'), bg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: BarChart3  },
    { value: t('stat4Value'), label: t('stat4Label'), sub: t('stat4Sub'), bg: 'bg-violet-50',  iconColor: 'text-violet-600',  icon: Globe     },
  ];

  const values = [
    { icon: Microscope, title: t('val1Title'), desc: t('val1Desc'), color: 'text-blue-600',    bg: 'bg-blue-50'    },
    { icon: Binary,     title: t('val2Title'), desc: t('val2Desc'), color: 'text-indigo-600',  bg: 'bg-indigo-50'  },
    { icon: ShieldCheck,title: t('val3Title'), desc: t('val3Desc'), color: 'text-violet-600',  bg: 'bg-violet-50'  },
    { icon: Zap,        title: t('val4Title'), desc: t('val4Desc'), color: 'text-amber-600',   bg: 'bg-amber-50'   },
    { icon: Users,      title: t('val5Title'), desc: t('val5Desc'), color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: TrendingUp, title: t('val6Title'), desc: t('val6Desc'), color: 'text-teal-600',    bg: 'bg-teal-50'    },
  ];

  const team = [
    { name: t('m1Name'), role: t('m1Role'), cert: t('m1Cert'), desc: t('m1Desc'), initials: 'MY', color: 'from-blue-600 to-indigo-600'   },
    { name: t('m2Name'), role: t('m2Role'), cert: t('m2Cert'), desc: t('m2Desc'), initials: 'AK', color: 'from-violet-600 to-purple-600' },
    { name: t('m3Name'), role: t('m3Role'), cert: t('m3Cert'), desc: t('m3Desc'), initials: 'JH', color: 'from-slate-700 to-slate-900'   },
    { name: t('m4Name'), role: t('m4Role'), cert: t('m4Cert'), desc: t('m4Desc'), initials: 'EŞ', color: 'from-emerald-600 to-teal-600'  },
  ];

  const certs = [t('c1'), t('c2'), t('c3'), t('c4'), t('c5'), t('c6')];

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">

      <PublicNavbar locale={locale} activePage="about" />

      {/* ══ HERO ════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#0A0F1C] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-8 py-20 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-[9px] font-bold tracking-[0.25em] text-blue-400 uppercase mb-6">
            {t('badge')}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6 max-w-3xl">
            {t('title')}{' '}
            <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              {t('titleItalic')}
            </span>
          </h1>
          <p className="text-slate-400 font-light max-w-2xl leading-relaxed text-lg">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-12">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-16 -mt-8 relative z-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${s.bg}`}>
                  <s.icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
                <span className="text-[8px] text-slate-400 uppercase tracking-[0.25em] font-bold">{s.sub}</span>
              </div>
              <p className="text-[2.25rem] leading-none font-black text-slate-900 mb-1.5">{s.value}</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-[0.25em] font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Mission & Vision ── */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[9px] font-bold tracking-[0.25em] text-blue-700 uppercase mb-8 shadow-sm">
            {t('missionBadge')}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[1.5rem] border border-slate-200 p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[40px]" />
              <div className="p-3 bg-blue-50 rounded-2xl w-fit mb-5 border border-blue-100">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('missionTitle')}</h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">{t('missionDesc')}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[1.5rem] border border-slate-700 p-8 shadow-sm relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[60px]" />
              <div className="p-3 bg-white/10 rounded-2xl w-fit mb-5 border border-white/20">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('visionTitle')}</h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed">{t('visionDesc')}</p>
            </div>
          </div>
        </div>

        {/* ── Values ── */}
        <div className="mb-16">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {t('valuesTitle')}{' '}
              <span className="italic font-serif text-blue-600">{t('valuesTitleItalic')}</span>
            </h2>
            <p className="text-slate-400 font-light">{t('valuesSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5">
                <div className={`p-3 rounded-xl ${v.bg} w-fit mb-4 border border-slate-100 group-hover:scale-110 transition-transform duration-300`}>
                  <v.icon className={`w-5 h-5 ${v.color}`} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Team ── */}
        <div className="mb-16">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {t('teamTitle')}{' '}
              <span className="italic font-serif text-blue-600">{t('teamTitleItalic')}</span>
            </h2>
            <p className="text-slate-400 font-light">{t('teamSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5">
                <div className={`h-32 bg-gradient-to-br ${member.color} relative overflow-hidden flex items-center justify-center`}>
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: '16px 16px',
                    }}
                  />
                  <span className="text-3xl font-black text-white/90 relative z-10">{member.initials}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-[13px] leading-tight mb-1">{member.name}</h3>
                  <p className="text-[9px] text-blue-600 uppercase tracking-[0.2em] font-bold mb-1.5">{member.role}</p>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-100 rounded-full mb-3">
                    <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                    <span className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.15em]">{member.cert}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Certifications ── */}
        <div className="mb-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {t('certTitle')}{' '}
              <span className="italic font-serif text-blue-600">{t('certTitleItalic')}</span>
            </h2>
            <p className="text-slate-400 font-light">{t('certSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {certs.map((cert, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-start gap-4 group">
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 shrink-0 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-colors duration-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-sm font-medium text-slate-700 leading-snug pt-0.5">{cert}</p>
              </div>
            ))}
          </div>
        </div>
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
            <Link href={`/${locale}/about`}      className="text-blue-600">{tFooter('aboutUs')}</Link>
            <Link href={`/${locale}/projects`}   className="hover:text-blue-600 transition-colors">{tFooter('projects')}</Link>
            <Link href={`/${locale}/procedures`} className="hover:text-blue-600 transition-colors">{tFooter('procedures')}</Link>
            <Link href={`/${locale}/contact`}    className="hover:text-blue-600 transition-colors">{tFooter('contact')}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
