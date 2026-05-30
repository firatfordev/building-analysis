'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Activity, ArrowLeft, Download, FileText, Building2,
  Calendar, Tag, Lock, ImageIcon, AlertCircle, Loader2,
  ExternalLink, CheckCircle, Clock,
} from 'lucide-react';

type Building = {
  id: number;
  uid: string;
  name: string;
  description: string;
  imageUrl: string | null;
  pdfUrl: string | null;
  createdAt: string;
};

export default function PublicBuildingReport({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = use(params);

  const [building,  setBuilding]  = useState<Building | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError,  setPdfError]  = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // URL fragments are client-side only — read after mount
        const hash = window.location.hash.slice(1); // strip leading #

        if (!hash || hash.length !== 64) {
          setLoadError(
            'Invalid or missing access token. Please open this report via the search on the home page.',
          );
          return;
        }

        const res  = await fetch('/api/public/verify-hash', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ id: Number(id), hash }),
        });
        const json = await res.json();

        if (!res.ok) {
          setLoadError(
            res.status === 401
              ? 'Access denied. The link is invalid or the PIN has changed.'
              : (json.error ?? 'Failed to load report.'),
          );
          return;
        }

        setBuilding(json.building);
      } catch {
        setLoadError('Network error – could not load report.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ══ LOADING ═══════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Verifying access…</p>
        </div>
      </main>
    );
  }

  // ══ ACCESS ERROR ══════════════════════════════════════════════════════════
  if (loadError || !building) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="p-5 bg-red-50 border border-red-100 rounded-[2rem] mb-5 inline-flex">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 text-sm mb-8">{loadError ?? 'Building not found.'}</p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const hasReport     = !!building.pdfUrl;
  const formattedDate = new Date(building.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // ══ MAIN VIEW ════════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-slate-50 pb-16">

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header className="bg-[#0A0F1C] border-b border-white/[0.05] px-8 py-4 sticky top-0 z-50 shadow-xl shadow-black/20">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center gap-5">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-[10px] uppercase tracking-[0.25em] font-bold group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Home
            </Link>
            <div className="w-px h-4 bg-white/[0.08]" />
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 rounded-lg">
                <Activity className="h-3.5 w-3.5 text-white stroke-[2.5]" />
              </div>
              <span className="font-bold tracking-[0.22em] text-[11px] uppercase text-white">
                AURA <span className="text-blue-400 font-light">ANALYTICS</span>
              </span>
            </div>
          </div>

          {/* Right — download only, no edit button */}
          {hasReport && (
            <a
              href={building.pdfUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
            >
              <Download className="w-3 h-3" /> Download PDF
            </a>
          )}
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-8 py-10">

        {/* ── Building info card ─────────────────────────────────────────── */}
        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm mb-8">
          <div className="grid lg:grid-cols-3 gap-0">

            {/* Thumbnail */}
            <div className="h-64 lg:h-auto lg:col-span-1 relative bg-slate-100 overflow-hidden">
              {building.imageUrl ? (
                <img
                  src={building.imageUrl}
                  alt={building.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 to-slate-200">
                  <ImageIcon className="w-12 h-12 text-slate-300" />
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">
                    No Thumbnail
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r" />
            </div>

            {/* Info */}
            <div className="lg:col-span-2 p-8 flex flex-col justify-between">
              <div>
                {/* Status + UID row */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-slate-900 text-white font-mono text-[9px] font-bold px-3 py-1.5 rounded-full tracking-widest flex items-center gap-1.5">
                    <Tag className="w-3 h-3" />
                    {building.uid}
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                    hasReport
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {hasReport
                      ? <><CheckCircle className="w-3 h-3" /> Report Ready</>
                      : <><Clock className="w-3 h-3" /> Awaiting PDF</>}
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight leading-snug">
                  {building.name}
                </h1>
                <p className="text-sm text-slate-500 font-light leading-relaxed mb-6">
                  {building.description}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[9px] text-slate-400 uppercase tracking-[0.25em] font-bold">
                      Registered {formattedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[9px] text-slate-400 uppercase tracking-[0.25em] font-bold">
                      PIN Verified Access
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[9px] text-slate-400 uppercase tracking-[0.25em] font-bold">
                      ID #{building.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              {hasReport && (
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                  <a
                    href={building.pdfUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white text-[9px] font-bold uppercase tracking-[0.2em] px-5 py-3 rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
                  </a>
                  <a
                    href={building.pdfUrl!}
                    download
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-[0.2em] px-5 py-3 rounded-xl transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── PDF Viewer ────────────────────────────────────────────────── */}
        {hasReport ? (
          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            {/* Viewer toolbar */}
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-xl">
                  <FileText className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Analysis Report</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                    PDF Document · {building.uid}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pdfLoaded && (
                  <span className="flex items-center gap-1.5 text-[8px] text-emerald-600 font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Loaded
                  </span>
                )}
                <a
                  href={building.pdfUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-[9px] font-bold uppercase tracking-[0.2em] transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> Open Full Screen
                </a>
              </div>
            </div>

            {/* Iframe */}
            <div className="relative" style={{ height: '80vh', minHeight: '600px' }}>
              {!pdfLoaded && !pdfError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 gap-4">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                  <p className="text-slate-400 text-sm">Loading PDF viewer…</p>
                </div>
              )}
              {pdfError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 gap-5 p-8 text-center">
                  <div className="p-5 bg-amber-50 border border-amber-100 rounded-[2rem]">
                    <FileText className="w-10 h-10 text-amber-400 mx-auto" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-semibold mb-2">
                      Unable to preview PDF in browser
                    </p>
                    <p className="text-slate-400 text-sm mb-6">
                      The PDF is available but cannot be displayed inline. Use the button below to open it.
                    </p>
                    <a
                      href={building.pdfUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open PDF
                    </a>
                  </div>
                </div>
              ) : (
                <iframe
                  src={building.pdfUrl!}
                  className="w-full h-full border-0"
                  title={`${building.name} – Analysis Report`}
                  onLoad={() => setPdfLoaded(true)}
                  onError={() => { setPdfError(true); setPdfLoaded(true); }}
                />
              )}
            </div>
          </div>
        ) : (
          /* ── No PDF placeholder ── */
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex flex-col items-center justify-center py-28 text-center px-8">
              <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-[2rem] mb-6">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Report Not Yet Available</h3>
              <p className="text-slate-400 text-sm font-light max-w-sm mb-8 leading-relaxed">
                The analysis report for this building is currently being prepared. Please check back later.
              </p>
              <Link
                href={`/${locale}`}
                className="flex items-center gap-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl hover:bg-blue-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
