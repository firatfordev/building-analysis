'use client';

import { useState, useRef } from 'react';
import {
  Activity, ArrowLeft, Upload, ImageIcon, FileText,
  RefreshCw, Eye, EyeOff, Plus, Check, X, Lock,
  Info, Tag, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateUID() {
  return `AUR-${Math.floor(1000 + Math.random() * 9000)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function NewBuilding() {
  const [formData, setFormData] = useState({
    name: '',
    uid: generateUID(),
    pin: '',
    description: '',
  });
  const [thumbnail, setThumbnail]         = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile]             = useState<File | null>(null);
  const [showPin, setShowPin]             = useState(false);
  const [isDragOverThumb, setIsDragOverThumb] = useState(false);
  const [isDragOverPdf, setIsDragOverPdf]     = useState(false);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [isSuccess, setIsSuccess]         = useState(false);
  const [errors, setErrors]               = useState<Record<string, string>>({});

  const thumbInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef   = useRef<HTMLInputElement>(null);

  // ─── File handlers ──────────────────────────────────────────────────────────
  const handleThumbFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onload = e => setThumbnail(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePdfFile = (file: File) => {
    if (file.type !== 'application/pdf') return;
    setPdfFile(file);
  };

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim())
      errs.name = 'Project name is required.';
    if (!formData.uid.trim())
      errs.uid = 'Unique ID is required.';
    if (!formData.pin.trim() || formData.pin.length < 4)
      errs.pin = 'PIN must be at least 4 digits.';
    if (!formData.description.trim())
      errs.description = 'Description is required.';
    return errs;
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);
    // TODO: POST to /api/buildings with formData + files
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  // ─── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setIsSuccess(false);
    setFormData({ name: '', uid: generateUID(), pin: '', description: '' });
    setThumbnail(null);
    setThumbnailFile(null);
    setPdfFile(null);
    setErrors({});
  };

  // ══ SUCCESS VIEW ═════════════════════════════════════════════════════════════
  if (isSuccess) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          {/* Checkmark */}
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center shadow-[0_0_0_12px_rgba(16,185,129,0.06)]">
              <Check className="w-11 h-11 text-emerald-500 stroke-[2.5]" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            Building Registered
          </h2>
          <p className="text-slate-500 font-light mb-2 leading-relaxed">
            <code className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg text-sm">
              {formData.uid}
            </code>
            {' '}has been added to the vault.
          </p>
          <p className="text-slate-400 text-sm font-light mb-10 leading-relaxed">
            Customers can now search for this building and access the report
            using the configured PIN.
          </p>

          <div className="flex gap-3 justify-center">
            <Link
              href="/admin"
              className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-xl transition-colors shadow-md"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={handleReset}
              className="border border-slate-200 bg-white text-slate-600 font-bold text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Add Another
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ══ MAIN FORM ════════════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-slate-50 pb-16">

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1160px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-[10px] uppercase tracking-[0.25em] font-bold group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Dashboard
            </Link>
            <div className="w-px h-5 bg-slate-200" />
            <h1 className="text-sm font-bold text-slate-900">Register New Building</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 rounded-lg shadow-[0_4px_10px_rgba(37,99,235,0.3)]">
              <Activity className="h-3.5 w-3.5 text-white stroke-[2.5]" />
            </div>
            <span className="font-bold tracking-[0.22em] text-[10px] uppercase text-slate-900 hidden sm:block">
              AURA <span className="text-blue-600 font-light">ANALYTICS</span>
            </span>
          </div>
        </div>
      </header>

      {/* ══ FORM ════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1160px] mx-auto px-8 pt-10">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid lg:grid-cols-5 gap-8 items-start">

            {/* ── LEFT: media uploads ─────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Thumbnail upload */}
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.35em] mb-3">
                  Building Thumbnail
                </label>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => thumbInputRef.current?.click()}
                  onKeyDown={e => e.key === 'Enter' && thumbInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragOverThumb(true); }}
                  onDragLeave={() => setIsDragOverThumb(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setIsDragOverThumb(false);
                    const f = e.dataTransfer.files[0];
                    if (f) handleThumbFile(f);
                  }}
                  className={`relative h-56 rounded-[1.5rem] border-2 border-dashed cursor-pointer overflow-hidden select-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    isDragOverThumb
                      ? 'border-blue-400 bg-blue-50/80 scale-[1.015]'
                      : thumbnail
                      ? 'border-slate-200 bg-white'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  {thumbnail ? (
                    <>
                      <img src={thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/35 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/50 px-5 py-2 rounded-full">
                          Change Image
                        </span>
                      </div>
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setThumbnail(null); setThumbnailFile(null); }}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-md text-slate-500 hover:text-red-500 transition-colors z-10"
                        aria-label="Remove thumbnail"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
                      <div className={`p-4 rounded-2xl transition-colors ${isDragOverThumb ? 'bg-blue-100' : 'bg-slate-100'}`}>
                        <ImageIcon className={`w-7 h-7 transition-colors ${isDragOverThumb ? 'text-blue-500' : 'text-slate-400'}`} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-600 mb-1">
                          {isDragOverThumb ? 'Drop to upload' : 'Drop image or click to browse'}
                        </p>
                        <p className="text-xs text-slate-400">PNG, JPG, WebP · Recommended 800 × 600</p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={thumbInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleThumbFile(f); }}
                  />
                </div>
              </div>

              {/* PDF upload */}
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.35em] mb-3">
                  Analysis Report (PDF)
                </label>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => pdfInputRef.current?.click()}
                  onKeyDown={e => e.key === 'Enter' && pdfInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragOverPdf(true); }}
                  onDragLeave={() => setIsDragOverPdf(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setIsDragOverPdf(false);
                    const f = e.dataTransfer.files[0];
                    if (f) handlePdfFile(f);
                  }}
                  className={`relative rounded-[1.5rem] border-2 border-dashed cursor-pointer select-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    isDragOverPdf
                      ? 'border-blue-400 bg-blue-50/80 scale-[1.015]'
                      : pdfFile
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-7 flex flex-col items-center gap-3">
                    {pdfFile ? (
                      <>
                        <div className="p-4 bg-emerald-100 rounded-2xl">
                          <FileText className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-emerald-700 mb-1 truncate max-w-[220px]">
                            {pdfFile.name}
                          </p>
                          <p className="text-xs text-emerald-500">
                            {(pdfFile.size / 1024 / 1024).toFixed(2)} MB · PDF Document
                          </p>
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); setPdfFile(null); }}
                            className="text-[9px] text-red-400 hover:text-red-600 font-bold uppercase tracking-widest mt-3 transition-colors"
                          >
                            Remove File
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={`p-4 rounded-2xl transition-colors ${isDragOverPdf ? 'bg-blue-100' : 'bg-slate-100'}`}>
                          <Upload className={`w-7 h-7 transition-colors ${isDragOverPdf ? 'text-blue-500' : 'text-slate-400'}`} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-slate-600 mb-1">
                            {isDragOverPdf ? 'Drop PDF to upload' : 'Upload Analysis Report'}
                          </p>
                          <p className="text-xs text-slate-400">PDF format only · No size limit</p>
                        </div>
                      </>
                    )}
                  </div>
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handlePdfFile(f); }}
                  />
                </div>
                {!pdfFile && (
                  <p className="text-[9px] text-slate-400 mt-2.5 flex items-center gap-1.5">
                    <Info className="w-3 h-3 shrink-0" />
                    PDF can be uploaded later if the report isn&apos;t ready yet.
                  </p>
                )}
              </div>
            </div>

            {/* ── RIGHT: form fields ──────────────────────────────────────── */}
            <div className="lg:col-span-3 bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <div className="mb-7">
                <h2 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">
                  Building Details
                </h2>
                <p className="text-sm text-slate-400 font-light">
                  Configure the vault record and customer access credentials.
                </p>
              </div>

              <div className="h-px bg-slate-100 mb-7" />

              <div className="space-y-6">

                {/* Project name */}
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.35em] mb-2.5">
                    Project Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Bodrum Residence Tower"
                    className={`w-full bg-slate-50 text-slate-900 text-sm px-5 py-4 rounded-xl border transition-all placeholder-slate-300 focus:outline-none focus:bg-white focus:ring-2 ${
                      errors.name
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-300 focus:ring-blue-100'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-2 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* Unique ID */}
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.35em] mb-2.5">
                    Unique Short ID <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={formData.uid}
                        onChange={e => setFormData(p => ({ ...p, uid: e.target.value.toUpperCase() }))}
                        placeholder="AUR-0000"
                        className={`w-full bg-slate-50 font-mono text-slate-900 text-sm pl-11 pr-5 py-4 rounded-xl border transition-all placeholder-slate-300 focus:outline-none focus:bg-white focus:ring-2 ${
                          errors.uid
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                            : 'border-slate-200 focus:border-blue-300 focus:ring-blue-100'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, uid: generateUID() }))}
                      title="Generate a new random ID"
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 px-4 py-4 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-colors shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Regenerate</span>
                    </button>
                  </div>
                  {errors.uid && (
                    <p className="text-red-500 text-xs mt-2 font-medium">{errors.uid}</p>
                  )}
                  <p className="text-[9px] text-slate-400 mt-2 uppercase tracking-wider">
                    Customers use this ID to locate the building in search.
                  </p>
                </div>

                {/* Access PIN */}
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.35em] mb-2.5">
                    Access PIN (4–6 digits) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={formData.pin}
                      onChange={e =>
                        setFormData(p => ({
                          ...p,
                          pin: e.target.value.replace(/\D/g, '').slice(0, 6),
                        }))
                      }
                      placeholder="Enter 4–6 digit PIN"
                      maxLength={6}
                      inputMode="numeric"
                      className={`w-full bg-slate-50 font-mono text-slate-900 text-sm pl-11 pr-14 py-4 rounded-xl border tracking-[0.45em] transition-all placeholder-slate-300 placeholder:tracking-normal focus:outline-none focus:bg-white focus:ring-2 ${
                        errors.pin
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                          : 'border-slate-200 focus:border-blue-300 focus:ring-blue-100'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                      aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.pin && (
                    <p className="text-red-500 text-xs mt-2 font-medium">{errors.pin}</p>
                  )}
                  <p className="text-[9px] text-slate-400 mt-2 uppercase tracking-wider">
                    Customers must enter this PIN to view the report.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.35em] mb-2.5">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Brief description of the building and the scope of analysis..."
                    rows={4}
                    className={`w-full bg-slate-50 text-slate-900 text-sm px-5 py-4 rounded-xl border transition-all placeholder-slate-300 focus:outline-none focus:bg-white focus:ring-2 resize-none leading-relaxed ${
                      errors.description
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-300 focus:ring-blue-100'
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-2 font-medium">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="h-px bg-slate-100 my-7" />

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold tracking-[0.2em] text-[10px] py-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_28px_rgba(37,99,235,0.22)] uppercase"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering Building…
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Register Building in Vault
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
