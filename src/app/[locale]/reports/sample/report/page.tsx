'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Activity, ArrowLeft, Download, FileText,
  AlertCircle, Loader2, ExternalLink, Microscope,
} from 'lucide-react';

type Sample = {
  available: boolean;
  title:       string;
  description: string;
  pdfUrl:      string | null;
};

export default function SampleReport({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  const [sample,    setSample]    = useState<Sample | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError,  setPdfError]  = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch('/api/public/sample');
        const json = await res.json();

        if (!res.ok || !json.sample?.available) {
          setLoadError('Sample report is not available at this time.');
          return;
        }
        setSample(json.sample);
      } catch {
        setLoadError('Network error – could not load sample report.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ══ LOADING ═══════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading sample report…</p>
        </div>
      </main>
    );
  }

  // ══ ERROR ═════════════════════════════════════════════════════════════════
  if (loadError || !sample) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="p-5 bg-red-50 border border-red-100 rounded-[2rem] mb-5 inline-flex">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Unavailable</h2>
          <p className="text-slate-500 text-sm mb-8">{loadError ?? 'Sample report not found.'}</p>
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

  const hasPdf = !!sample.pdfUrl;

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

          {/* Right — download only */}
          {hasPdf && (
            <a
              href={sample.pdfUrl!}
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

        {/* ── Sample info card ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm mb-8">
          <div className="p-8 flex flex-col gap-4">
            {/* Demo badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200">
                <Microscope className="w-3 h-3" /> Sample Demo
              </div>
              <div className="bg-slate-900 text-white font-mono text-[9px] font-bold px-3 py-1.5 rounded-full tracking-widest">
                DEMO
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {sample.title}
            </h1>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              {sample.description}
            </p>

            {/* Action row */}
            {hasPdf && (
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <a
                  href={sample.pdfUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white text-[9px] font-bold uppercase tracking-[0.2em] px-5 py-3 rounded-xl transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
                </a>
                <a
                  href={sample.pdfUrl!}
                  download
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-[0.2em] px-5 py-3 rounded-xl transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── PDF Viewer ───────────────────────────────────────────────────── */}
        {hasPdf ? (
          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Microscope className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Sample Analysis Report</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                    PDF Document · DEMO
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
                  href={sample.pdfUrl!}
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
                    <p className="text-slate-700 font-semibold mb-2">Unable to preview PDF in browser</p>
                    <p className="text-slate-400 text-sm mb-6">
                      The PDF is available but cannot be displayed inline. Use the button below to open it.
                    </p>
                    <a
                      href={sample.pdfUrl!}
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
                  src={sample.pdfUrl!}
                  className="w-full h-full border-0"
                  title="Sample Analysis Report"
                  onLoad={() => setPdfLoaded(true)}
                  onError={() => { setPdfError(true); setPdfLoaded(true); }}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex flex-col items-center justify-center py-28 text-center px-8">
              <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-[2rem] mb-6">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Sample Not Yet Available</h3>
              <p className="text-slate-400 text-sm font-light max-w-sm mb-8 leading-relaxed">
                The sample report is being prepared. Please check back later.
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
