import React, { useState, useRef } from "react"
import {
  X,
  Plus,
  Trash2,
  Check,
  Upload,
  Image as ImageIcon,
  Star,
  ArrowLeft,
  ArrowRight,
  Layers,
} from "lucide-react"
import { Project, Category, Shape } from "../data/projects"
import { processMultipleImageFiles, compressImageFile } from "../utils/imageStore"

interface ProjectEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (project: Project) => void
  initialProject?: Project | null
  nextId: number
}

export function ProjectEditModal({
  isOpen,
  onClose,
  onSave,
  initialProject,
  nextId,
}: ProjectEditModalProps) {
  const isEditing = !!initialProject

  const [form, setForm] = useState<Project>(() => {
    if (initialProject) return JSON.parse(JSON.stringify(initialProject))

    return {
      id: nextId,
      title: "",
      englishTitle: "",
      category: "Branding" as Category,
      shape: "landscape" as Shape,
      year: `${new Date().getFullYear()}. 01 — 03`,
      gray: "#dededb",
      accentColor: "#111111",
      tagline: "",
      coverImage: undefined,
      galleryImages: [],
      details: {
        overviewKo: "",
        overviewEn: "",
        client: "",
        role: "Lead Visual Designer",
        deliverables: ["Key Visual", "Brand Identity", "Applications"],
        tools: ["Ai", "Ps"],
        conceptKeyword: "Design & Form",
        palette: [
          { name: "Primary Dark", hex: "#111111", desc: "Core identity tone" },
          { name: "Accent Shade", hex: "#2962FF", desc: "Vibrant accent" },
          { name: "Light Tone", hex: "#F4F4F0", desc: "Background harmony" },
          { name: "Neutral Gray", hex: "#D4D4D0", desc: "Subtle structural base" },
        ],
        visuals: {
          heroAccent: "#2962FF",
          mockupType1: "POSTER & BILLBOARD",
          mockupType2: "PACKAGING & MERCH",
          mockupType3: "EDITORIAL GUIDE BOOK",
          mockupType4: "DIGITAL KEYFRAME",
          bannerLabel: "BRAND ARCHIVE EXHIBITION",
        },
      },
    }
  })

  const [isProcessingImages, setIsProcessingImages] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [deliverableInput, setDeliverableInput] = useState("")
  const [toolInput, setToolInput] = useState("")

  const coverInputRef = useRef<HTMLInputElement>(null)
  const multiGalleryInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  // Handle Cover Image Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsProcessingImages(true)
    try {
      const dataUrl = await compressImageFile(file)
      setForm((prev) => ({ ...prev, coverImage: dataUrl }))
    } catch (err) {
      alert("이미지 처리 중 오류가 발생했습니다.")
    } finally {
      setIsProcessingImages(false)
    }
  }

  // Handle Multiple Gallery Images Upload
  const handleMultipleGalleryUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return
    setIsProcessingImages(true)
    try {
      const dataUrls = await processMultipleImageFiles(files)
      setForm((prev) => {
        const currentGallery = prev.galleryImages || []
        const updated = [...currentGallery, ...dataUrls]
        // If no cover image yet, auto-set first image as cover
        const cover = prev.coverImage || updated[0]
        return {
          ...prev,
          coverImage: cover,
          galleryImages: updated,
        }
      })
    } catch (err) {
      alert("이미지 일괄 업로드 중 오류가 발생했습니다.")
    } finally {
      setIsProcessingImages(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleMultipleGalleryUpload(e.dataTransfer.files)
    }
  }

  const handleRemoveGalleryImage = (idx: number) => {
    setForm((prev) => {
      const current = prev.galleryImages || []
      const removedUrl = current[idx]
      const updated = current.filter((_, i) => i !== idx)
      const newCover = prev.coverImage === removedUrl ? updated[0] || undefined : prev.coverImage
      return {
        ...prev,
        coverImage: newCover,
        galleryImages: updated,
      }
    })
  }

  const handleSetAsCover = (imgUrl: string) => {
    setForm((prev) => ({ ...prev, coverImage: imgUrl }))
  }

  const handleMoveGalleryImage = (idx: number, direction: "left" | "right") => {
    setForm((prev) => {
      const current = [...(prev.galleryImages || [])]
      const targetIdx = direction === "left" ? idx - 1 : idx + 1
      if (targetIdx < 0 || targetIdx >= current.length) return prev
      const temp = current[idx]
      current[idx] = current[targetIdx]
      current[targetIdx] = temp
      return { ...prev, galleryImages: current }
    })
  }

  const handleAddDeliverable = () => {
    if (!deliverableInput.trim()) return
    setForm({
      ...form,
      details: {
        ...form.details,
        deliverables: [...form.details.deliverables, deliverableInput.trim()],
      },
    })
    setDeliverableInput("")
  }

  const handleRemoveDeliverable = (idx: number) => {
    setForm({
      ...form,
      details: {
        ...form.details,
        deliverables: form.details.deliverables.filter((_, i) => i !== idx),
      },
    })
  }

  const handleAddTool = () => {
    if (!toolInput.trim()) return
    setForm({
      ...form,
      details: {
        ...form.details,
        tools: [...form.details.tools, toolInput.trim()],
      },
    })
    setToolInput("")
  }

  const handleRemoveTool = (idx: number) => {
    setForm({
      ...form,
      details: {
        ...form.details,
        tools: form.details.tools.filter((_, i) => i !== idx),
      },
    })
  }

  const handlePaletteChange = (
    index: number,
    field: "name" | "hex" | "desc",
    value: string
  ) => {
    const updated = [...form.details.palette]
    updated[index] = { ...updated[index], [field]: value }
    setForm({
      ...form,
      details: {
        ...form.details,
        palette: updated,
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.englishTitle.trim()) {
      alert("프로젝트 한글 및 영문 제목을 입력해주세요.")
      return
    }
    onSave(form)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full my-8 bg-white rounded-sm shadow-2xl flex flex-col max-h-[92vh] border border-neutral-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
              Project Management · bom.d
            </span>
            <h3 className="text-lg font-bold text-neutral-900 font-serif italic">
              {isEditing ? `Edit: ${form.title}` : "Add New Project"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 md:p-8 space-y-8">
          {/* 01 / Image Upload Section (Local Multiple Files) */}
          <div className="bg-neutral-50 p-5 rounded-xs border border-neutral-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-bold flex items-center gap-2">
                  <ImageIcon size={14} /> Local Computer Image Upload (내 컴퓨터 이미지 업로드)
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  내 컴퓨터의 이미지 파일을 선택하여 여러 장 한 번에 올리거나 드래그&amp;드롭하세요.
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-500">
                {(form.galleryImages || []).length}장 등록됨
              </span>
            </div>

            {/* Drag & Drop Multi-file Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => multiGalleryInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-xs text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-neutral-900 bg-neutral-200/80 scale-[1.01]"
                  : "border-neutral-300 hover:border-neutral-700 bg-white"
              }`}
            >
              <input
                ref={multiGalleryInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleMultipleGalleryUpload(e.target.files)
                  }
                }}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <Upload size={18} />
                </div>
                <div className="text-xs">
                  <strong className="text-neutral-900 underline font-semibold">
                    내 컴퓨터에서 이미지 선택하기 (여러 장 한번에 선택 가능)
                  </strong>
                  <span className="text-neutral-500 block text-[11px] mt-0.5">
                    또는 여기에 이미지 파일들을 마우스로 끌어다 놓으세요 (JPG, PNG, WebP 지원)
                  </span>
                </div>
                {isProcessingImages && (
                  <p className="text-xs font-mono text-amber-600 animate-pulse mt-1">
                    이미지 최적화 처리 중... 잠시만 기다려주세요.
                  </p>
                )}
              </div>
            </div>

            {/* Gallery Images Strip */}
            {(form.galleryImages && form.galleryImages.length > 0) && (
              <div className="space-y-2 pt-2">
                <span className="block text-[11px] font-mono text-neutral-600">
                  업로드된 이미지 미리보기 (★ 표시는 메인 대표 커버 이미지):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {form.galleryImages.map((imgUrl, idx) => {
                    const isCover = form.coverImage === imgUrl
                    return (
                      <div
                        key={idx}
                        className={`group relative aspect-square rounded-xs overflow-hidden border-2 bg-neutral-200 shadow-2xs ${
                          isCover ? "border-amber-500 ring-2 ring-amber-400/40" : "border-neutral-200"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Uploaded ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Cover Badge */}
                        {isCover && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-mono font-bold rounded-2xs flex items-center gap-1 shadow-xs">
                            <Star size={9} fill="currentColor" /> COVER
                          </div>
                        )}

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                          <div className="flex justify-between items-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSetAsCover(imgUrl)
                              }}
                              className={`p-1 rounded-2xs text-[10px] ${
                                isCover
                                  ? "text-amber-400 font-bold"
                                  : "text-white/80 hover:text-white"
                              }`}
                              title="대표 커버로 설정"
                            >
                              ★
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveGalleryImage(idx)
                              }}
                              className="p-1 text-red-400 hover:text-red-300"
                              title="이미지 삭제"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          <div className="flex justify-between items-center text-white/80">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMoveGalleryImage(idx, "left")
                              }}
                              className="p-0.5 disabled:opacity-20 hover:text-white"
                              title="왼쪽으로 이동"
                            >
                              <ArrowLeft size={11} />
                            </button>
                            <span className="text-[9px] font-mono">#{idx + 1}</span>
                            <button
                              type="button"
                              disabled={idx === (form.galleryImages?.length || 0) - 1}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMoveGalleryImage(idx, "right")
                              }}
                              className="p-0.5 disabled:opacity-20 hover:text-white"
                              title="오른쪽으로 이동"
                            >
                              <ArrowRight size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 02 / Basic Info */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-200 mb-4">
              02 / Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Title (한글 제목) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 부산 디자인 위크"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  English Title (영문 제목) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Busan Design Week"
                  value={form.englishTitle}
                  onChange={(e) => setForm({ ...form, englishTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Category (분야)
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as Category })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs bg-white focus:border-neutral-900 focus:outline-hidden"
                >
                  <option value="Branding">Branding</option>
                  <option value="Promotion">Promotion</option>
                  <option value="Graphic">Graphic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Card Shape (그리드 형태)
                </label>
                <select
                  value={form.shape}
                  onChange={(e) =>
                    setForm({ ...form, shape: e.target.value as Shape })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs bg-white focus:border-neutral-900 focus:outline-hidden"
                >
                  <option value="landscape">Landscape (가로형)</option>
                  <option value="portrait">Portrait (세로형)</option>
                  <option value="square">Square (정사각형)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Year / Period (기간)
                </label>
                <input
                  type="text"
                  placeholder="2024. 03 — 05"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Accent Color (강조 색상)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={form.accentColor}
                    onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                    className="w-8 h-8 rounded-xs border border-neutral-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={form.accentColor}
                    onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Tagline (한 줄 요약 슬로건)
              </label>
              <input
                type="text"
                placeholder="브랜드의 고유한 정체성을 담은 시각 시스템 구축"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* 03 / Context & Details */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-200 mb-4">
              03 / Context &amp; Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Client (클라이언트)
                </label>
                <input
                  type="text"
                  placeholder="예: 부산문화재단"
                  value={form.details.client}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      details: { ...form.details, client: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Role (역할)
                </label>
                <input
                  type="text"
                  placeholder="Lead Visual Designer"
                  value={form.details.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      details: { ...form.details, role: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Concept Keyword (컨셉 키워드 글귀) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tidal Wave & Pulse"
                  value={form.details.conceptKeyword}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      details: { ...form.details, conceptKeyword: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-hidden"
                />
              </div>
            </div>



            {/* Deliverables & Tools tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Deliverables (납품 산출물)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="산출물 입력 (예: Key Visual Poster)"
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddDeliverable()
                      }
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-3 py-1.5 bg-neutral-900 text-white text-xs rounded-xs"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.details.deliverables.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 text-[11px] font-mono border rounded-xs"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="text-neutral-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Tools Used (사용 소프트웨어)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="툴 약칭 (예: Ai, Ps, Id, Ae, Figma)"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTool()
                      }
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTool}
                    className="px-3 py-1.5 bg-neutral-900 text-white text-xs rounded-xs"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.details.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 text-[11px] font-mono border rounded-xs"
                    >
                      {tool}
                      <button
                        type="button"
                        onClick={() => handleRemoveTool(idx)}
                        className="text-neutral-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Overviews */}
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Overview (국문 프로젝트 설명)
                </label>
                <textarea
                  rows={3}
                  value={form.details.overviewKo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      details: { ...form.details, overviewKo: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-hidden leading-relaxed"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Overview (English Translation)
                </label>
                <textarea
                  rows={3}
                  value={form.details.overviewEn}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      details: { ...form.details, overviewEn: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-hidden leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* 04 / Color Palette */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-200 mb-4">
              04 / Color Palette (4 Swatches)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {form.details.palette.map((color, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-neutral-50 rounded-xs border border-neutral-200 space-y-2"
                >
                  <div
                    className="w-full h-8 rounded-xs border border-neutral-300/60"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <label className="block text-[10px] text-neutral-500">Name</label>
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => handlePaletteChange(idx, "name", e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-neutral-300 rounded-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500">HEX Code</label>
                    <input
                      type="text"
                      value={color.hex}
                      onChange={(e) => handlePaletteChange(idx, "hex", e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono border border-neutral-300 rounded-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500">Description</label>
                    <input
                      type="text"
                      value={color.desc}
                      onChange={(e) => handlePaletteChange(idx, "desc", e.target.value)}
                      className="w-full px-2 py-1 text-[11px] border border-neutral-300 rounded-xs bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-mono uppercase rounded-xs hover:border-neutral-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessingImages}
              className="px-6 py-2 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider rounded-xs hover:bg-neutral-800 flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Check size={14} /> {isEditing ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
