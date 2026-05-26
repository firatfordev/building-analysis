'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';
import {
  Building2, Home, Factory, Layers, Ruler, Layers3,
  Calendar, Zap, Thermometer, Clock, MessageSquare,
  CheckCircle, ArrowRight, Loader2, AlertCircle,
  ShieldCheck, Lock, Euro,
} from 'lucide-react';

// ─── Pricing constants (in €) ──────────────────────────────────────────────
const BASE_PRICE = 12500;

const TYPE_PRICES: Record<string, number> = {
  residential: 0,
  commercial:  2500,
  industrial:  5000,
  mixed:       3500,
};
const SIZE_PRICES: Record<string, number> = {
  under_100:   0,
  '100_250':   1000,
  '250_500':   2500,
  '500_1000':  4500,
  over_1000:   8000,
};
const FLOOR_PRICES: Record<string, number> = {
  '1_2':   0,
  '3_5':   1500,
  '6_10':  3000,
  '11plus': 6000,
};
const AGE_PRICES: Record<string, number> = {
  under_5:  0,
  '5_15':   500,
  '15_30':  1500,
  over_30:  3000,
};
const ADDON_PRICES: Record<string, number> = {
  energy:       1200,
  thermal:      800,
  express:      2500,
  consultation: 1500,
};

function formatEur(n: number) {
  return '€' + n.toLocaleString('en-EU');
}

export default function EngagePage() {
  const params = useParams();
  const locale = (params.locale as string) ?? 'en';
  const t      = useTranslations('EngagePage');

  // ── Form state ──────────────────────────────────────────────────────────────
  const [fullName,     setFullName]     = useState('');
  const [email,        setEmail]        = useState('');
  const [phone,        setPhone]        = useState('');
  const [company,      setCompany]      = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [propertySize, setPropertySize] = useState('');
  const [floors,       setFloors]       = useState('');
  const [buildingAge,  setBuildingAge]  = useState('');
  const [addons,       setAddons]       = useState<string[]>([]);
  const [notes,        setNotes]        = useState('');

  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted,   setSubmitted]   = useState(false);

  // ── Live price calculation ──────────────────────────────────────────────────
  const breakdown = useMemo(() => {
    const lines: { label: string; amount: number }[] = [];
    lines.push({ label: t('baseAudit'), amount: BASE_PRICE });

    if (propertyType && TYPE_PRICES[propertyType] > 0)
      lines.push({ label: t(`type_${propertyType}`), amount: TYPE_PRICES[propertyType] });

    if (propertySize && SIZE_PRICES[propertySize] > 0)
      lines.push({ label: t(`size_${propertySize}`), amount: SIZE_PRICES[propertySize] });

    if (floors && FLOOR_PRICES[floors] > 0)
      lines.push({ label: t(`floors_${floors}`), amount: FLOOR_PRICES[floors] });

    if (buildingAge && AGE_PRICES[buildingAge] > 0)
      lines.push({ label: t(`age_${buildingAge}`), amount: AGE_PRICES[buildingAge] });

    for (const a of addons) {
      if (ADDON_PRICES[a] > 0)
        lines.push({ label: t(`addon_${a}`), amount: ADDON_PRICES[a] });
    }

    return lines;
  }, [propertyType, propertySize, floors, buildingAge, addons, t]);

  const total = useMemo(() => breakdown.reduce((s, l) => s + l.amount, 0), [breakdown]);

  const toggleAddon = (key: string) =>
    setAddons(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/public/quotations', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          fullName, email, phone, company,
          propertyName, propertyType, propertySize, floors, buildingAge,
          addons, notes, totalPrice: total,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setSubmitError(json.error ?? t('submitError')); return; }
      setSubmitted(true);
    } catch {
      setSubmitError(t('networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  const propertyTypes = [
    { key: 'residential', icon: Home,      label: t('type_residential') },
    { key: 'commercial',  icon: Building2, label: t('type_commercial')  },
    { key: 'industrial',  icon: Factory,   label: t('type_industrial')  },
    { key: 'mixed',       icon: Layers,    label: t('type_mixed')       },
  ];

  const sizeOptions = [
    { key: 'under_100',  label: t('size_under_100')  },
    { key: '100_250',    label: t('size_100_250')    },
    { key: '250_500',    label: t('size_250_500')    },
    { key: '500_1000',   label: t('size_500_1000')   },
    { key: 'over_1000',  label: t('size_over_1000')  },
  ];

  const floorOptions = [
    { key: '1_2',    label: t('floors_1_2')    },
    { key: '3_5',    label: t('floors_3_5')    },
    { key: '6_10',   label: t('floors_6_10')   },
    { key: '11plus', label: t('floors_11plus') },
  ];

  const ageOptions = [
    { key: 'under_5', label: t('age_under_5') },
    { key: '5_15',    label: t('age_5_15')    },
    { key: '15_30',   label: t('age_15_30')   },
    { key: 'over_30', label: t('age_over_30') },
  ];

  const addonOptions = [
    { key: 'energy',       icon: Zap,         label: t('addon_energy'),       price: ADDON_PRICES.energy       },
    { key: 'thermal',      icon: Thermometer, label: t('addon_thermal'),      price: ADDON_PRICES.thermal      },
    { key: 'express',      icon: Clock,       label: t('addon_express'),      price: ADDON_PRICES.express      },
    { key: 'consultation', icon: MessageSquare, label: t('addon_consultation'), price: ADDON_PRICES.consultation },
  ];

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <PublicNavbar locale={locale} />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{t('successTitle')}</h1>
            <p className="text-slate-500 font-light leading-relaxed mb-3">{t('successDesc')}</p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 mb-8 inline-block">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">{t('totalLabel')}</p>
              <p className="text-3xl font-black text-slate-900">{formatEur(total)}</p>
            </div>
            <br />
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.25em] hover:bg-blue-700 transition-colors"
            >
              {t('backToPortal')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar locale={locale} activePage="home" />

      {/* ── Hero strip ── */}
      <div className="bg-[#0A0F1C] text-white py-16 px-4 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-[9px] font-black tracking-[0.3em] text-blue-300 uppercase mb-6">
            <Euro className="h-3 w-3" /> {t('badge')}
          </div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight mb-4">
            {t('title')}<br />
            <span className="italic font-serif text-blue-400">{t('titleItalic')}</span>
          </h1>
          <p className="text-slate-400 font-light max-w-xl text-lg">{t('subtitle')}</p>
        </div>
      </div>

      {/* ── Form + price panel ── */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-16">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-5 gap-10 items-start">

            {/* ── Left: form (3 cols) ── */}
            <div className="lg:col-span-3 space-y-10">

              {/* ── Section 1: Contact ── */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-1">{t('contactTitle')}</h2>
                <p className="text-sm text-slate-400 font-light mb-6">{t('contactSubtitle')}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">{t('fullNameLabel')} *</label>
                    <input
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder={t('fullNamePlaceholder')}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">{t('emailLabel')} *</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={t('emailPlaceholder')}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">{t('phoneLabel')}</label>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+90 (---) --- -- --"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">{t('companyLabel')}</label>
                    <input
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder={t('companyPlaceholder')}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* ── Section 2: Property Name ── */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-1">{t('propertyTitle')}</h2>
                <p className="text-sm text-slate-400 font-light mb-6">{t('propertySubtitle')}</p>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">{t('propertyNameLabel')} *</label>
                  <input
                    required
                    value={propertyName}
                    onChange={e => setPropertyName(e.target.value)}
                    placeholder={t('propertyNamePlaceholder')}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              {/* ── Section 3: Property Type ── */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-1">{t('typeTitle')} *</h2>
                <p className="text-sm text-slate-400 font-light mb-6">{t('typeSubtitle')}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {propertyTypes.map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPropertyType(key)}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${
                        propertyType === key
                          ? 'border-blue-600 bg-blue-50 shadow-[0_0_0_4px_rgba(37,99,235,0.08)]'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${propertyType === key ? 'bg-blue-600' : 'bg-slate-100'}`}>
                        <Icon className={`w-5 h-5 ${propertyType === key ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-[0.15em] text-center leading-tight ${
                        propertyType === key ? 'text-blue-700' : 'text-slate-600'
                      }`}>
                        {label}
                      </span>
                      {TYPE_PRICES[key] > 0 && (
                        <span className={`text-[9px] font-bold ${propertyType === key ? 'text-blue-600' : 'text-slate-400'}`}>
                          +{formatEur(TYPE_PRICES[key])}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Section 4: Size / Floors / Age ── */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-1">{t('detailsTitle')} *</h2>
                <p className="text-sm text-slate-400 font-light mb-6">{t('detailsSubtitle')}</p>
                <div className="grid md:grid-cols-3 gap-6">

                  {/* Size */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">
                      <Ruler className="w-3 h-3" /> {t('sizeLabel')} *
                    </label>
                    <div className="space-y-2">
                      {sizeOptions.map(({ key, label }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setPropertySize(key)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                            propertySize === key
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span>{label}</span>
                          {SIZE_PRICES[key] > 0 && (
                            <span className={`text-[9px] font-bold ${propertySize === key ? 'text-blue-500' : 'text-slate-400'}`}>
                              +{formatEur(SIZE_PRICES[key])}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Floors */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">
                      <Layers3 className="w-3 h-3" /> {t('floorsLabel')} *
                    </label>
                    <div className="space-y-2">
                      {floorOptions.map(({ key, label }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFloors(key)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                            floors === key
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span>{label}</span>
                          {FLOOR_PRICES[key] > 0 && (
                            <span className={`text-[9px] font-bold ${floors === key ? 'text-blue-500' : 'text-slate-400'}`}>
                              +{formatEur(FLOOR_PRICES[key])}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">
                      <Calendar className="w-3 h-3" /> {t('ageLabel')} *
                    </label>
                    <div className="space-y-2">
                      {ageOptions.map(({ key, label }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setBuildingAge(key)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                            buildingAge === key
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span>{label}</span>
                          {AGE_PRICES[key] > 0 && (
                            <span className={`text-[9px] font-bold ${buildingAge === key ? 'text-blue-500' : 'text-slate-400'}`}>
                              +{formatEur(AGE_PRICES[key])}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 5: Add-ons ── */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-1">{t('addonsTitle')}</h2>
                <p className="text-sm text-slate-400 font-light mb-6">{t('addonsSubtitle')}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {addonOptions.map(({ key, icon: Icon, label, price }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleAddon(key)}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        addons.includes(key)
                          ? 'border-blue-600 bg-blue-50 shadow-[0_0_0_4px_rgba(37,99,235,0.08)]'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 ${addons.includes(key) ? 'bg-blue-600' : 'bg-slate-100'}`}>
                        <Icon className={`w-4 h-4 ${addons.includes(key) ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold ${addons.includes(key) ? 'text-blue-700' : 'text-slate-700'}`}>{label}</p>
                        <p className={`text-[10px] font-bold mt-0.5 ${addons.includes(key) ? 'text-blue-500' : 'text-slate-400'}`}>
                          +{formatEur(price)}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        addons.includes(key) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                      }`}>
                        {addons.includes(key) && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Section 6: Notes ── */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-1">{t('notesTitle')}</h2>
                <p className="text-sm text-slate-400 font-light mb-6">{t('notesSubtitle')}</p>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={t('notesPlaceholder')}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400 resize-none"
                />
              </div>

            </div>

            {/* ── Right: sticky price summary (2 cols) ── */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-4">

                {/* Price card */}
                <div className="bg-[#0A0F1C] rounded-[2rem] p-8 text-white shadow-2xl">
                  <p className="text-[9px] font-black uppercase tracking-[0.35em] text-blue-400 mb-2">{t('priceSummaryLabel')}</p>
                  <div className="text-5xl font-black tracking-tight mb-1 tabular-nums transition-all duration-500">
                    {formatEur(total)}
                  </div>
                  <p className="text-xs text-slate-500 mb-8">{t('priceBaseNote')}</p>

                  {/* Line items */}
                  <div className="space-y-2 border-t border-white/10 pt-6 mb-6">
                    {breakdown.map((line, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-light">{line.label}</span>
                        <span className={`text-xs font-bold tabular-nums ${i === 0 ? 'text-white' : 'text-blue-400'}`}>
                          {i === 0 ? formatEur(line.amount) : `+${formatEur(line.amount)}`}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Divider + total */}
                  <div className="flex items-center justify-between border-t border-white/20 pt-4 mb-8">
                    <span className="text-xs font-bold text-white uppercase tracking-widest">{t('totalLabel')}</span>
                    <span className="text-xl font-black text-white tabular-nums">{formatEur(total)}</span>
                  </div>

                  {/* Submit button */}
                  {submitError && (
                    <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <p className="text-xs text-red-300">{submitError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !propertyType || !propertySize || !floors || !buildingAge}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[10px] uppercase tracking-[0.25em] py-5 rounded-2xl transition-all duration-300 shadow-[0_8px_24px_rgba(37,99,235,0.35)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {submitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('submitting')}</>
                      : <>{t('submitButton')} <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>

                {/* Trust badges */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  {[
                    { icon: ShieldCheck, text: t('trust1') },
                    { icon: Lock,        text: t('trust2') },
                    { icon: CheckCircle, text: t('trust3') },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <Icon className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">{text}</span>
                    </div>
                  ))}
                </div>

                {/* Required fields note */}
                {(!propertyType || !propertySize || !floors || !buildingAge) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <p className="text-[10px] text-amber-700 font-bold uppercase tracking-[0.15em] mb-1">{t('requiredNote')}</p>
                    <ul className="space-y-1">
                      {!propertyType  && <li className="text-[10px] text-amber-600">• {t('type_residential').replace('Residential', '')} {t('typeTitle')}</li>}
                      {!propertySize  && <li className="text-[10px] text-amber-600">• {t('sizeLabel')}</li>}
                      {!floors        && <li className="text-[10px] text-amber-600">• {t('floorsLabel')}</li>}
                      {!buildingAge   && <li className="text-[10px] text-amber-600">• {t('ageLabel')}</li>}
                    </ul>
                  </div>
                )}

              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
