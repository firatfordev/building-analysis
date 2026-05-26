'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Activity, Mail, Phone, Globe, Clock,
  Send, CheckCircle, Lock, MapPin, ShieldCheck,
  ArrowRight, Zap,
} from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';

export default function ContactPage() {
  const params = useParams();
  const locale = (params.locale as string) ?? 'en';
  const t = useTranslations('ContactPage');
  const tFooter = useTranslations('Footer');

  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/public/messages', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      if (!res.ok) {
        const json = await res.json();
        setSubmitError(json.error ?? t('submitError'));
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(t('submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  const contactCards = [
    { icon: Globe,  label: t('hqLabel'),       value: t('hqValue'),        sub: t('hqSub'),        bg: 'bg-blue-50',    iconColor: 'text-blue-600'    },
    { icon: Mail,   label: t('emailInfoLabel'), value: t('emailInfoValue'), sub: t('emailInfoSub'), bg: 'bg-indigo-50',  iconColor: 'text-indigo-600'  },
    { icon: Phone,  label: t('phoneInfoLabel'), value: t('phoneInfoValue'), sub: t('phoneInfoSub'), bg: 'bg-violet-50',  iconColor: 'text-violet-600'  },
    { icon: Clock,  label: t('responseLabel'),  value: t('responseValue'),  sub: t('responseSub'),  bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  ];

  const nodes = [
    { title: t('node1Title'), desc: t('node1Desc'), tag: t('node1Tag'), dot: 'bg-emerald-400' },
    { title: t('node2Title'), desc: t('node2Desc'), tag: t('node2Tag'), dot: 'bg-blue-400'    },
    { title: t('node3Title'), desc: t('node3Desc'), tag: t('node3Tag'), dot: 'bg-amber-400'   },
  ];

  const subjects = [t('sub1'), t('sub2'), t('sub3'), t('sub4'), t('sub5')];

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">

      <PublicNavbar locale={locale} activePage="contact" />

      <div className="max-w-[1440px] mx-auto px-8 py-12">

        {/* ── Hero ── */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[9px] font-bold tracking-[0.25em] text-blue-700 uppercase mb-6 shadow-sm">
            <ShieldCheck className="h-3 w-3 text-blue-600" />
            {t('badge')}
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
            {t('title')}{' '}
            <span className="italic font-serif text-blue-600">{t('titleItalic')}</span>
          </h1>
          <p className="text-slate-500 font-light max-w-2xl leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* ── Contact Cards ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
          {contactCards.map((card, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className={`p-2.5 rounded-xl ${card.bg} w-fit mb-4`}>
                <card.icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <p className="text-[8px] text-slate-400 uppercase tracking-[0.25em] font-bold mb-1">{card.label}</p>
              <p className="text-sm font-bold text-slate-900 mb-0.5">{card.value}</p>
              <p className="text-xs text-slate-400 font-light">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Main Grid: Form + Info ── */}
        <div className="grid lg:grid-cols-5 gap-8 mb-12">

          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">{t('formTitle')}</h2>
              <p className="text-sm text-slate-400 font-light">{t('formSubtitle')}</p>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-[2rem]">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 mb-2">{t('successTitle')}</p>
                  <p className="text-sm text-slate-400 font-light max-w-sm leading-relaxed">{t('successDesc')}</p>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {t('newMessage')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold mb-2">{t('nameLabel')}</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder={t('namePlaceholder')}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100/80 transition-all placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold mb-2">{t('emailLabel')}</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder={t('emailPlaceholder')}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100/80 transition-all placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold mb-2">{t('phoneLabel')}</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder={t('phonePlaceholder')}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100/80 transition-all placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold mb-2">{t('subjectLabel')}</label>
                    <select
                      value={form.subject}
                      onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100/80 transition-all"
                    >
                      <option value="">— Select —</option>
                      {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold mb-2">{t('messageLabel')}</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder={t('messagePlaceholder')}
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100/80 transition-all placeholder-slate-400 resize-none"
                  />
                </div>

                {submitError && (
                  <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                    {submitError}
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span className="text-[8px] text-slate-400 uppercase tracking-[0.2em] font-bold">{t('privacyNote')}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_4px_14px_rgba(37,99,235,0.22)] disabled:opacity-60 shrink-0"
                  >
                    {submitting
                      ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('submitting')}</>
                      : <><Send className="w-3.5 h-3.5" /> {t('submitButton')}</>}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Map placeholder */}
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-[1.5rem] overflow-hidden h-48 border border-slate-700">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <MapPin className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Aegean Sector</p>
                  <p className="text-xs text-white font-bold">Turkey · GMT+3</p>
                </div>
              </div>
              <div className="absolute top-6 left-8 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <div className="absolute top-14 right-12 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-10 left-16 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-6 right-8 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-mono text-white border border-white/20">
                3 Nodes Active
              </div>
            </div>

            {/* Encryption badge */}
            <div className="bg-[#0A0F1C] rounded-2xl border border-white/[0.06] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-600/20 rounded-xl">
                  <Zap className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.25em]">Encryption Status</p>
                  <p className="text-xs font-bold text-white">AES-256 Active</p>
                </div>
              </div>
              <div className="space-y-2">
                {['AES-256 · End-to-End', 'Zero-Knowledge Proof', 'KVKK / GDPR Compliant'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="text-[9px] text-slate-400 font-mono uppercase tracking-[0.15em]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Engineering Nodes ── */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
            {t('officesTitle')}{' '}
            <span className="italic font-serif text-blue-600">{t('officesTitleItalic')}</span>
          </h2>
          <p className="text-sm text-slate-400 font-light mb-8">{t('officesSubtitle')}</p>
          <div className="grid md:grid-cols-3 gap-5">
            {nodes.map((node, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${node.dot} animate-pulse`} />
                    <span className="text-[8px] text-slate-500 uppercase tracking-[0.25em] font-bold">{node.tag}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{node.title}</h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{node.desc}</p>
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
            <Link href={`/${locale}/about`}      className="hover:text-blue-600 transition-colors">{tFooter('aboutUs')}</Link>
            <Link href={`/${locale}/projects`}   className="hover:text-blue-600 transition-colors">{tFooter('projects')}</Link>
            <Link href={`/${locale}/procedures`} className="hover:text-blue-600 transition-colors">{tFooter('procedures')}</Link>
            <Link href={`/${locale}/contact`}    className="text-blue-600">{tFooter('contact')}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
