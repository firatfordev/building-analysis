'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Menu, X, Globe, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

type NavbarProps = {
  locale: string;
  activePage?: 'about' | 'projects' | 'procedures' | 'contact' | 'home';
};

export default function PublicNavbar({ locale, activePage }: NavbarProps) {
  const t        = useTranslations('Navbar');
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminHref,  setAdminHref]  = useState(`/${locale}/admin/login`);
  const menuRef = useRef<HTMLDivElement>(null);

  /* check admin session */
  useEffect(() => {
    fetch('/api/auth/check')
      .then(r => { if (r.ok) setAdminHref(`/${locale}/admin`); })
      .catch(() => {});
  }, [locale]);

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* close on route change */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const otherLocale  = locale === 'tr' ? 'en' : 'tr';
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const navLinks = [
    { href: `/${locale}/about`,      label: t('about'),      key: 'about'      },
    { href: `/${locale}/projects`,   label: t('projects'),   key: 'projects'   },
    { href: `/${locale}/procedures`, label: t('procedures'), key: 'procedures' },
    { href: `/${locale}/contact`,    label: t('contact'),    key: 'contact'    },
  ];

  return (
    <>
      {/* ── Full-screen mobile backdrop ── */}
      {mobileOpen && (
        <div
          aria-hidden
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <header className="sticky top-0 z-50 w-full py-3 px-4 md:px-10">
        <div className="max-w-[1600px] mx-auto" ref={menuRef}>

          {/* ── Pill ── */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-[2rem] px-5 md:px-8 py-3 shadow-sm">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 md:gap-3 shrink-0">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-md shrink-0">
                <Activity className="h-4 w-4 text-white stroke-[2.5]" />
              </div>
              {/* Full text on md+; short on xs */}
              <span className="hidden sm:block font-bold tracking-[0.28em] text-[11px] uppercase text-slate-900">
                AURA <span className="text-blue-600 font-light">ANALYTICS</span>
              </span>
              <span className="block sm:hidden font-bold tracking-[0.2em] text-[11px] uppercase text-slate-900">
                AURA
              </span>
            </Link>

            {/* ── Desktop nav (lg+) ── */}
            <nav className="hidden lg:flex items-center gap-8 text-[9.5px] tracking-[0.25em] text-slate-500 uppercase font-bold">
              {navLinks.map(link => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`transition-colors relative group ${
                    activePage === link.key ? 'text-blue-600' : 'hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-[1.5px] rounded-full bg-blue-500 transition-all duration-300 ${
                    activePage === link.key ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* ── Desktop right actions (lg+) ── */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href={switchedPath}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200 text-[9px] font-bold uppercase tracking-[0.2em] transition-all"
              >
                <Globe className="w-3 h-3" />
                {otherLocale.toUpperCase()}
              </Link>
              <div className="w-px h-4 bg-slate-200" />
              <Link
                href={adminHref}
                className="bg-slate-900 text-white px-7 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 text-[9.5px] font-bold uppercase tracking-widest shadow-sm"
              >
                {t('adminPortal')}
              </Link>
            </div>

            {/* ── Mobile right: locale + hamburger (below lg) ── */}
            <div className="flex items-center gap-2 lg:hidden shrink-0">
              <Link
                href={switchedPath}
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg border border-slate-200 text-slate-500 text-[9px] font-bold uppercase tracking-[0.15em] hover:bg-slate-50 transition-colors"
              >
                <Globe className="w-3 h-3" />
                {otherLocale.toUpperCase()}
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(v => !v)}
                aria-expanded={mobileOpen}
                aria-label={t('toggleMenu')}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-blue-700 active:scale-95 transition-all"
              >
                {mobileOpen
                  ? <X    className="w-5 h-5" />
                  : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* ── Mobile dropdown panel ── */}
          <div
            aria-hidden={!mobileOpen}
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              mobileOpen ? 'max-h-[26rem] opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white border border-slate-200 rounded-[1.75rem] shadow-xl overflow-hidden">

              {/* Nav links */}
              <nav className="flex flex-col divide-y divide-slate-50">
                {navLinks.map(link => (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
                      activePage === link.key
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className={`w-4 h-4 ${
                      activePage === link.key ? 'text-blue-400' : 'text-slate-300'
                    }`} />
                  </Link>
                ))}
              </nav>

              {/* Admin CTA */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <Link
                  href={adminHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-blue-700 active:scale-[0.98] transition-all duration-200"
                >
                  {t('adminPortal')}
                </Link>
              </div>

            </div>
          </div>

        </div>
      </header>
    </>
  );
}
