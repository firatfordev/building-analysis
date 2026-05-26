'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Activity, ShieldCheck, CheckCircle, ChevronDown,
  Microscope, Radar, Binary, FileText, Zap, MapPin,
  Award, BarChart3, Layers, Lock, FlaskConical,
} from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';

export default function ProceduresPage() {
  const params = useParams();
  const locale = (params.locale as string) ?? 'en';
  const t = useTranslations('ProceduresPage');

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const phases = [
    { tag: t('ph1Tag'), title: t('ph1Title'), desc: t('ph1Desc'), detail: t('ph1Detail'), sub: t('ph1Sub'), icon: MapPin,       color: 'from-slate-700 to-slate-900', num: '01' },
    { tag: t('ph2Tag'), title: t('ph2Title'), desc: t('ph2Desc'), detail: t('ph2Detail'), sub: t('ph2Sub'), icon: Radar,         color: 'from-blue-700 to-blue-900',  num: '02' },
    { tag: t('ph3Tag'), title: t('ph3Title'), desc: t('ph3Desc'), detail: t('ph3Detail'), sub: t('ph3Sub'), icon: Microscope,    color: 'from-indigo-700 to-indigo-900', num: '03' },
    { tag: t('ph4Tag'), title: t('ph4Title'), desc: t('ph4Desc'), detail: t('ph4Detail'), sub: t('ph4Sub'), icon: FlaskConical,  color: 'from-violet-700 to-violet-900', num: '04' },
    { tag: t('ph5Tag'), title: t('ph5Title'), desc: t('ph5Desc'), detail: t('ph5Detail'), sub: t('ph5Sub'), icon: Zap,           color: 'from-blue-600 to-indigo-700',   num: '05' },
    { tag: t('ph6Tag'), title: t('ph6Title'), desc: t('ph6Desc'), detail: t('ph6Detail'), sub: t('ph6Sub'), icon: Binary,        color: 'from-emerald-700 to-teal-800',  num: '06' },
  ];

  const licenses = [
    { code: t('lic1Code'), sub: t('lic1Sub'), desc: t('lic1Desc'), status: t('lic1Status'), bg: 'bg-blue-50', border: 'border-blue-100', codeBg: 'bg-blue-600', statusBg: 'bg-emerald-50', statusText: 'text-emerald-700', statusBorder: 'border-emerald-100' },
    { code: t('lic2Code'), sub: t('lic2Sub'), desc: t('lic2Desc'), status: t('lic2Status'), bg: 'bg-indigo-50', border: 'border-indigo-100', codeBg: 'bg-indigo-600', statusBg: 'bg-emerald-50', statusText: 'text-emerald-700', statusBorder: 'border-emerald-100' },
    { code: t('lic3Code'), sub: t('lic3Sub'), desc: t('lic3Desc'), status: t('lic3Status'), bg: 'bg-violet-50', border: 'border-violet-100', codeBg: 'bg-violet-600', statusBg: 'bg-emerald-50', statusText: 'text-emerald-700', statusBorder: 'border-emerald-100' },
    { code: t('lic4Code'), sub: t('lic4Sub'), desc: t('lic4Desc'), status: t('lic4Status'), bg: 'bg-slate-50', border: 'border-slate-200', codeBg: 'bg-slate-700', statusBg: 'bg-emerald-50', statusText: 'text-emerald-700', statusBorder: 'border-emerald-100' },
    { code: t('lic5Code'), sub: t('lic5Sub'), desc: t('lic5Desc'), status: t('lic5Status'), bg: 'bg-amber-50', border: 'border-amber-100', codeBg: 'bg-amber-600', statusBg: 'bg-emerald-50', statusText: 'text-emerald-700', statusBorder: 'border-emerald-100' },
    { code: t('lic6Code'), sub: t('lic6Sub'), desc: t('lic6Desc'), status: t('lic6Status'), bg: 'bg-teal-50', border: 'border-teal-100', codeBg: 'bg-teal-600', statusBg: 'bg-emerald-50', statusText: 'text-emerald-700', statusBorder: 'border-emerald-100' },
  ];

  const regulations = [
    t('reg1'), t('reg2'), t('reg3'), t('reg4'), t('reg5'), t('reg6'),
  ];

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
  ];

  const phaseIcons = [MapPin, Radar, Microscope, FlaskConical, Zap, Binary];

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">

      <PublicNavbar locale={locale} activePage="procedures" />

      {/* ══ DARK HERO ════════════════════════════════════════════════════════════ */}
      <div className="bg-[#0A0F1C] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-8 py-20 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-[9px] font-bold tracking-[0.25em] text-blue-400 uppercase mb-6">
            <ShieldCheck className="w-3 h-3" /> {t('badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 max-w-3xl leading-tight">
            {t('title')}{' '}
            <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              {t('titleItalic')}
            </span>
          </h1>
          <p className="text-slate-400 font-light max-w-2xl leading-relaxed text-lg mb-12">
            {t('subtitle')}
          </p>

          {/* Mini stats row */}
          <div className="flex flex-wrap gap-4">
            {[
              { icon: Award,    label: 'ISO 9001:2015', sub: 'Certified' },
              { icon: Zap,      label: 'Eurocode 8',    sub: 'EC8 / EN 1998' },
              { icon: Lock,     label: 'AES-256',       sub: 'KVKK / GDPR' },
              { icon: BarChart3, label: '99.9%',        sub: 'Accuracy Rate' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3">
                <item.icon className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white leading-none mb-0.5">{item.label}</p>
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-16">

        {/* ── Process Timeline ── */}
        <div className="mb-20">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              {t('processTitle')}{' '}
              <span className="italic font-serif text-blue-600">{t('processTitleItalic')}</span>
            </h2>
            <p className="text-slate-500 font-light max-w-2xl leading-relaxed">{t('processSubtitle')}</p>
          </div>

          {/* Visual timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-[2.75rem] top-10 bottom-10 w-px bg-gradient-to-b from-blue-200 via-indigo-200 to-emerald-200 hidden lg:block" />

            <div className="space-y-6">
              {phases.map((phase, i) => {
                const Icon = phaseIcons[i];
                return (
                  <div key={i} className="flex gap-6 group">
                    {/* Phase number + icon */}
                    <div className="hidden lg:flex flex-col items-center shrink-0">
                      <div className={`w-[5.5rem] h-[5.5rem] rounded-[1.5rem] bg-gradient-to-br ${phase.color} flex flex-col items-center justify-center shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-300`}>
                        <Icon className="w-5 h-5 text-white/80 mb-1" />
                        <span className="text-white font-black text-sm leading-none">{phase.num}</span>
                      </div>
                    </div>

                    {/* Content card */}
                    <div className="flex-1 bg-white rounded-[1.5rem] border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group-hover:border-blue-100">
                      <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {/* Mobile phase number */}
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center lg:hidden`}>
                            <span className="text-white font-black text-xs">{phase.num}</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.3em] block mb-0.5">{phase.tag}</span>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight">{phase.title}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]">{phase.detail}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-light leading-relaxed mb-3">{phase.desc}</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-[0.15em]">{phase.sub}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Licenses Grid ── */}
        <div className="mb-20">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              {t('licTitle')}{' '}
              <span className="italic font-serif text-blue-600">{t('licTitleItalic')}</span>
            </h2>
            <p className="text-slate-500 font-light max-w-2xl">{t('licSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {licenses.map((lic, i) => (
              <div key={i} className={`rounded-[1.5rem] border ${lic.border} ${lic.bg} p-6 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`${lic.codeBg} px-3 py-1.5 rounded-xl`}>
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{lic.code}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 ${lic.statusBg} border ${lic.statusBorder} rounded-full`}>
                    <CheckCircle className={`w-2.5 h-2.5 ${lic.statusText}`} />
                    <span className={`text-[8px] font-bold uppercase tracking-[0.2em] ${lic.statusText}`}>{lic.status}</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{lic.sub}</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">{lic.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Regulatory Framework ── */}
        <div className="mb-20">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              {t('regTitle')}{' '}
              <span className="italic font-serif text-blue-600">{t('regTitleItalic')}</span>
            </h2>
            <p className="text-slate-500 font-light max-w-2xl">{t('regSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {regulations.map((reg, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-start gap-4 group">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-2.5 shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-300">
                  <Layers className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="pt-0.5">
                  <p className="text-[8px] text-slate-400 uppercase tracking-[0.25em] font-bold mb-1">Standard {String(i + 1).padStart(2, '0')}</p>
                  <p className="text-sm font-medium text-slate-700 leading-snug">{reg}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual compliance bar */}
          <div className="mt-8 bg-[#0A0F1C] rounded-[1.5rem] border border-white/[0.06] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-600/20 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.25em]">Full Compliance Verified</p>
                  <p className="text-sm font-bold text-white">Turkish & European Standards</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'TS 500 / TBDY 2018', value: '100%', color: 'bg-blue-500' },
                  { label: 'Eurocode 2 / EC8',   value: '100%', color: 'bg-indigo-500' },
                  { label: 'ISO Standards',       value: '100%', color: 'bg-emerald-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] text-slate-400 uppercase tracking-[0.15em] font-bold">{item.label}</span>
                      <span className="text-[9px] text-white font-bold">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full w-full`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div>
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              {t('faqTitle')}{' '}
              <span className="italic font-serif text-blue-600">{t('faqTitleItalic')}</span>
            </h2>
          </div>
          <div className="space-y-4 max-w-4xl">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-[1.5rem] transition-all duration-500 overflow-hidden ${
                  openFaq === i
                    ? 'bg-blue-50/50 shadow-md border-blue-100'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-900 text-base pr-8">{faq.q}</span>
                  <div className={`p-2 rounded-full transition-colors duration-300 shrink-0 ${openFaq === i ? 'bg-white shadow-sm border border-slate-200' : 'bg-slate-50 border border-transparent'}`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${openFaq === i ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                  </div>
                </button>
                <div className={`px-6 transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm text-slate-500 font-light leading-relaxed border-l-2 border-blue-200 pl-5 ml-1">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-12 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 text-[9px] font-bold tracking-[0.25em] text-white uppercase mb-6">
              <FileText className="w-3 h-3" /> Ready to Start?
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Initiate a Building Analysis</h3>
            <p className="text-blue-100 font-light mb-8 max-w-lg mx-auto text-sm leading-relaxed">
              Connect with our advisory board to schedule a full lifecycle diagnostic for your property. Certified results in 14 days.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href={`/${locale}/contact`}
                className="bg-white text-blue-700 font-bold text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 rounded-2xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Contact Advisory Board
              </Link>
              <Link
                href={`/${locale}`}
                className="border border-white/40 text-white font-bold text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 rounded-2xl hover:bg-white/10 transition-colors"
              >
                Search Your Building
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.05] py-10 bg-[#0A0F1C]">
        <div className="max-w-[1440px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-2 rounded-xl">
              <Activity className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white block mb-0.5">Aura Engineering © 2026</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Institutional Structural Intelligence</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            <Link href={`/${locale}/about`} className="hover:text-blue-400 transition-colors">About Us</Link>
            <Link href={`/${locale}/projects`} className="hover:text-blue-400 transition-colors">Projects</Link>
            <Link href={`/${locale}/procedures`} className="hover:text-blue-400 transition-colors text-blue-400">Procedures</Link>
            <Link href={`/${locale}/contact`} className="hover:text-blue-400 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
