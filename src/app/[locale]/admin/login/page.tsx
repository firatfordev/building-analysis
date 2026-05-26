'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Activity, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const params   = useParams();
  const router   = useRouter();
  const locale   = (params.locale as string) ?? 'en';
  const t        = useTranslations('AdminLogin');

  // Redirect to dashboard if already logged in
  useEffect(() => {
    fetch('/api/auth/check')
      .then(r => { if (r.ok) router.replace(`/${locale}/admin`); })
      .catch(() => {});
  }, [locale, router]);

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('fillAllFields'));
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json() as { error?: string };

      if (!res.ok) {
        setError(data.error ?? t('authFailed'));
      } else {
        // Successful login – redirect to admin dashboard
        router.push(`/${locale}/admin`);
      }
    } catch {
      setError(t('networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070B14] flex items-center justify-center p-6 relative overflow-hidden">

      {/* ── Ambient glows ── */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/[0.07] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-indigo-800/[0.07] rounded-full blur-[130px] pointer-events-none" />

      {/* ── Structural grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 w-full max-w-[420px]">

        {/* ── Back link ── */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-[10px] uppercase tracking-[0.3em] font-bold mb-10 transition-colors w-fit group"
        >
          <ArrowRight className="h-3 w-3 rotate-180 transition-transform group-hover:-translate-x-0.5" />
          {t('backToPortal')}
        </Link>

        {/* ── Logo ── */}
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-2xl shadow-[0_8px_28px_rgba(37,99,235,0.35)]">
            <Activity className="h-6 w-6 text-white stroke-[2]" />
          </div>
          <div>
            <span className="font-bold tracking-[0.25em] text-xs uppercase text-white block leading-none mb-1">
              AURA <span className="text-blue-400 font-light">ANALYTICS</span>
            </span>
            <span className="text-[8px] text-slate-500 uppercase tracking-[0.35em] font-bold">
              {t('adminVault')}
            </span>
          </div>
        </div>

        {/* ── Title ── */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">{t('title')}</h1>
          <p className="text-sm text-slate-400 font-light leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* ── Form card ── */}
        <div className="bg-white/[0.025] backdrop-blur-2xl border border-white/[0.06] rounded-[2rem] p-8 shadow-[0_48px_96px_rgba(0,0,0,0.55)]">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.35em] mb-2.5">
                {t('emailLabel')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  autoComplete="email"
                  className="w-full bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.13] focus:border-blue-500/50 text-white placeholder-slate-600 text-sm pl-11 pr-5 py-4 rounded-xl focus:outline-none focus:bg-white/[0.06] transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.35em] mb-2.5">
                {t('passwordLabel')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.13] focus:border-blue-500/50 text-white placeholder-slate-600 text-sm pl-11 pr-12 py-4 rounded-xl focus:outline-none focus:bg-white/[0.06] transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold tracking-[0.2em] text-[10px] py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_28px_rgba(37,99,235,0.28)] uppercase mt-3"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{t('submitButton')} <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
        </div>

        {/* ── Security footnote ── */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
          <span className="text-[9px] text-slate-600 uppercase tracking-[0.3em] font-bold">
            {t('securityNote')}
          </span>
        </div>

        <p className="text-center mt-4 text-[9px] text-slate-700 uppercase tracking-widest">
          {t('copyright')}
        </p>
      </div>
    </main>
  );
}
