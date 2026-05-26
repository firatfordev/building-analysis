'use client';

import { useState, useRef, useEffect, use } from 'react';
import { useTranslations } from 'next-intl';
import {
  Activity, ArrowLeft, Upload, ImageIcon, FileText,
  RefreshCw, Eye, EyeOff, Check, X, Lock,
  Info, Tag, ArrowRight, Loader2, AlertCircle, Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateUID() {
  return `AUR-${Math.floor(1000 + Math.random() * 9000)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function EditBuilding({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = use(params);
  const router = useRouter();
  const t      = useTranslations('EditBuilding');

  // ── Loading state ────────────────────────────────────────────────────────────
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError]     = useState<string | null>(null);

  // ── Form state ───────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    uid: generateUID(),
    pin: '',
    description: '',
  });

  // Existing URLs from DB
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [existingPdfUrl,   setExistingPdfUrl]   = useState<string | null>(null);

  // New file selections
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile,    setThumbnailFile]    = useState<File | null>(null);
  const [pdfFile,          setPdfFile]          = useState<File | null>(null);

  // Removal flags
  const [removeImage, setRemoveImage] = useState(false);
  const [removePdf,   setRemovePdf]   = useState(false);

  const [showPin,         setShowPin]         = useState(false);
  const [isDragOverThumb, setIsDragOverThumb] = useState(false);
  const [isDragOverPdf,   setIsDragOverPdf]   = useState(false);
  const [isSubmitting,    setIsSubmitting]    = useState(false);
  const [isSuccess,       setIsSuccess]       = useState(false);
  const [errors,          setErrors]          = useState<Record<string, string>>({});
  const [submitError,     setSubmitError]     = useState<string | null>(null);

  const thumbInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef   = useRef<HTMLInputElement>(null);

  // ── Load existing building data ───────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`/api/buildings/${id}`);
        const json = await res.json();
        if (!res.ok) {
          setLoadError(json.error ?? t('loadError'));
          return;
        }
        const b = json.building;
        setFormData({
          name:        b.name,
          uid:         b.uid,
          pin:         b.pin,
          description: b.description,
        });
        setExistingImageUrl(b.imageUrl);
        setExistingPdfUrl(b.pdfUrl);
      } catch {
        setLoadError(t('networkLoadError'));
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [id, t]);

  // ── File handlers ─────────────────────────────────────────────────────────────
  const handleThumbFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setThumbnailFile(file);
    setRemoveImage(false);
    const reader = new FileReader();
    reader.onload = e => setThumbnailPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePdfFile = (file: File) => {
    if (file.type !== 'application/pdf') return;
    setPdfFile(file);
    setRemovePdf(false);
  };

  // ── Validation ────────────────────────────────────────────────────────────────
  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim())        errs.name        = t('nameRequired');
    if (!formData.uid.trim())         errs.uid         = t('uidRequired');
    if (!formData.pin.trim() || formData.pin.length < 4) errs.pin = t('pinRequired');
    if (!formData.description.trim()) errs.description = t('descriptionRequired');
    return errs;
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('uid',         formData.uid);
      data.append('name',        formData.name);
      data.append('pin',         formData.pin);
      data.append('description', formData.description);
      if (thumbnailFile)          data.append('image',       thumbnailFile);
      if (pdfFile)                data.append('pdf',         pdfFile);
      if (removeImage)            data.append('removeImage', 'true');
      if (removePdf)              data.append('removePdf',   'true');

      const res  = await fetch(`/api/buildings/${id}`, { method: 'PATCH', body: data });
      const json = await res.json();

      if (!res.ok) {
        setSubmitError(json.error ?? t('networkError'));
        return;
      }

      setIsSuccess(true);
    } catch {
      setSubmitError(t('networkError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Derived display values ────────────────────────────────────────────────────
  const displayImage = thumbnailPreview ?? (removeImage ? null : existingImageUrl);
  const hasPdf       = !removePdf && (pdfFile !== null || existingPdfUrl !== null);

  // ══ LOADING ══════════════════════════════════════════════════════════════════
  if (loadingData) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">{t('loadingData')}</p>
        </div>
      </main>
    );
  }

  // ══ LOAD ERROR ════════════════════════════════════════════════════════════════
  if (loadError) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="p-5 bg-red-50 border border-red-100 rounded-[2rem] mb-5 inline-flex">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{t('failedToLoad')}</h2>
          <p className="text-slate-500 text-sm mb-8">{loadError}</p>
          <Link
            href={`/${locale}/admin`}
            className="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors"
          >
            {t('backToDashboard')}
          </Link>
        </div>
      </main>
    );
  }

  // ══ SUCCESS VIEW ══════════════════════════════════════════════════════════════
  if (isSuccess) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center shadow-[0_0_0_12px_rgba(16,185,129,0.06)]">
              <Check className="w-11 h-11 text-emerald-500 stroke-[2.5]" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            {t('successTitle')}
          </h2>
          <p className="text-slate-500 font-light mb-2 leading-relaxed">
            <code className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg text-sm">
              {formData.uid}
            </code>
            {' '}{t('successDesc')}
          </p>
          <p className="text-slate-400 text-sm font-light mb-10">
            {t('successNote')}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push(`/${locale}/admin`)}
              className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-xl transition-colors shadow-md"
            >
              {t('backToDashboard')}
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
            <button
              onClick={() => router.push(`/${locale}/admin`)}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-[10px] uppercase tracking-[0.25em] font-bold group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              {t('dashboardLink')}
            </button>
            <div className="w-px h-5 bg-slate-200" />
            <h1 className="text-sm font-bold text-slate-900">{t('pageTitle')}</h1>
            <div className="bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
              <span className="text-[8px] text-amber-700 font-bold uppercase tracking-[0.25em]">
                {t('editingBadge')}
              </span>
            </div>
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
                  {t('thumbnailLabel')}
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
                      : displayImage
                      ? 'border-slate-200 bg-white'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  {displayImage ? (
                    <>
                      <img src={displayImage} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/35 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/50 px-5 py-2 rounded-full">
                          {t('changeImage')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setThumbnailPreview(null);
                          setThumbnailFile(null);
                          setRemoveImage(true);
                        }}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-md text-slate-500 hover:text-red-500 transition-colors z-10"
                        aria-label={t('removeThumbnail')}
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
                          {isDragOverThumb ? t('dropHere') : t('dropOrBrowse')}
                        </p>
                        <p className="text-xs text-slate-400">{t('imageFormats')}</p>
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
                  {t('pdfLabel')}
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
                      : hasPdf
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-7 flex flex-col items-center gap-3">
                    {hasPdf ? (
                      <>
                        <div className="p-4 bg-emerald-100 rounded-2xl">
                          <FileText className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-emerald-700 mb-1">
                            {pdfFile ? pdfFile.name : t('existingReport')}
                          </p>
                          {pdfFile && (
                            <p className="text-xs text-emerald-500">
                              {(pdfFile.size / 1024 / 1024).toFixed(2)} MB · PDF Document
                            </p>
                          )}
                          {!pdfFile && existingPdfUrl && (
                            <p className="text-xs text-emerald-500">{t('existingReportHint')}</p>
                          )}
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setPdfFile(null);
                              setRemovePdf(true);
                            }}
                            className="flex items-center gap-1.5 text-[9px] text-red-400 hover:text-red-600 font-bold uppercase tracking-widest mt-3 transition-colors mx-auto"
                          >
                            <Trash2 className="w-3 h-3" /> {t('removePdf')}
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
                            {isDragOverPdf ? t('dropPdf') : t('uploadReport')}
                          </p>
                          <p className="text-xs text-slate-400">{t('pdfFormats')}</p>
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
                {!hasPdf && (
                  <p className="text-[9px] text-slate-400 mt-2.5 flex items-center gap-1.5">
                    <Info className="w-3 h-3 shrink-0" />
                    {t('pdfHint')}
                  </p>
                )}
              </div>
            </div>

            {/* ── RIGHT: form fields ──────────────────────────────────────── */}
            <div className="lg:col-span-3 bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <div className="mb-7">
                <h2 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">
                  {t('sectionTitle')}
                </h2>
                <p className="text-sm text-slate-400 font-light">
                  {t('sectionSubtitle')}
                </p>
              </div>

              <div className="h-px bg-slate-100 mb-7" />

              <div className="space-y-6">

                {/* Project name */}
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.35em] mb-2.5">
                    {t('nameLabel')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder={t('namePlaceholder')}
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
                    {t('uidLabel')} <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={formData.uid}
                        onChange={e => setFormData(p => ({ ...p, uid: e.target.value.toUpperCase() }))}
                        placeholder={t('uidPlaceholder')}
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
                      title={t('regenerate')}
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 px-4 py-4 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-colors shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t('regenerate')}</span>
                    </button>
                  </div>
                  {errors.uid && (
                    <p className="text-red-500 text-xs mt-2 font-medium">{errors.uid}</p>
                  )}
                </div>

                {/* Access PIN */}
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.35em] mb-2.5">
                    {t('pinLabel')} <span className="text-red-400">*</span>
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
                      placeholder={t('pinPlaceholder')}
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
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.pin && (
                    <p className="text-red-500 text-xs mt-2 font-medium">{errors.pin}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.35em] mb-2.5">
                    {t('descriptionLabel')} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder={t('descriptionPlaceholder')}
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

              {/* Server-side error banner */}
              {submitError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl mb-6">
                  <X className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold tracking-[0.2em] text-[10px] py-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_28px_rgba(37,99,235,0.22)] uppercase"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {t('submitButton')}
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
