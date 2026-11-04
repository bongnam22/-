import React, { useState } from "react"
import {
  FolderKanban,
  User,
  Mail,
  Settings,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  LogOut,
  ExternalLink,
  Check,
  Sparkles,
} from "lucide-react"
import { Project } from "../data/projects"
import {
  AboutData,
  SiteContactData,
  InquiryMessage,
  resetProjects,
  deleteInquiry,
} from "../data/storage"
import { ProjectEditModal } from "./ProjectEditModal"

interface AdminDashboardProps {
  projects: Project[]
  aboutData: AboutData
  contactData: SiteContactData
  inquiries: InquiryMessage[]
  onUpdateProjects: (projects: Project[]) => void
  onUpdateAbout: (about: AboutData) => void
  onUpdateContact: (contact: SiteContactData) => void
  onUpdateInquiries: (inquiries: InquiryMessage[]) => void
  onLogout: () => void
  onClose: () => void
  onShowToast: (msg: string) => void
}

type AdminTab = "projects" | "about" | "contact" | "inquiries"

export function AdminDashboard({
  projects,
  aboutData,
  contactData,
  inquiries,
  onUpdateProjects,
  onUpdateAbout,
  onUpdateContact,
  onUpdateInquiries,
  onLogout,
  onClose,
  onShowToast,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<AdminTab>("projects")

  // Project Edit Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // About Data Form State
  const [aboutForm, setAboutForm] = useState<AboutData>(aboutData)

  // Contact Data Form State
  const [contactForm, setContactForm] = useState<SiteContactData>(contactData)

  // Experience item input
  const [newExp, setNewExp] = useState({ title: "", period: "", desc: "" })
  const [newCert, setNewCert] = useState("")
  const [newSoftware, setNewSoftware] = useState("")

  // Project Management Actions
  const handleOpenAddProject = () => {
    setEditingProject(null)
    setIsEditModalOpen(true)
  }

  const handleOpenEditProject = (p: Project) => {
    setEditingProject(p)
    setIsEditModalOpen(true)
  }

  const handleSaveProject = (saved: Project) => {
    let updated: Project[]
    if (editingProject) {
      updated = projects.map((p) => (p.id === saved.id ? saved : p))
      onShowToast(`프로젝트 '${saved.title}' 수정이 저장되었습니다.`)
    } else {
      updated = [saved, ...projects]
      onShowToast(`새 프로젝트 '${saved.title}'이 추가되었습니다.`)
    }
    onUpdateProjects(updated)
    setIsEditModalOpen(false)
  }

  const handleDeleteProject = (id: number, title: string) => {
    if (confirm(`'${title}' 프로젝트를 정말 삭제하시겠습니까?`)) {
      const updated = projects.filter((p) => p.id !== id)
      onUpdateProjects(updated)
      onShowToast(`프로젝트 '${title}'이 삭제되었습니다.`)
    }
  }

  const handleMoveProject = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === projects.length - 1)
    ) {
      return
    }
    const targetIdx = direction === "up" ? index - 1 : index + 1
    const copy = [...projects]
    const temp = copy[index]
    copy[index] = copy[targetIdx]
    copy[targetIdx] = temp
    onUpdateProjects(copy)
    onShowToast("프로젝트 순서가 변경되었습니다.")
  }

  const handleResetProjects = () => {
    if (
      confirm("기본 9개 프로젝트로 초기화하시겠습니까? 추가/수정된 데이터가 복원됩니다.")
    ) {
      const restored = resetProjects()
      onUpdateProjects(restored)
      onShowToast("기본 프로젝트 데이터로 복원되었습니다.")
    }
  }

  // About Management Actions
  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateAbout(aboutForm)
    onShowToast("소개(About) 정보가 성공적으로 저장되었습니다.")
  }

  const handleAddExperience = () => {
    if (!newExp.title.trim()) return
    setAboutForm({
      ...aboutForm,
      experience: [...aboutForm.experience, { ...newExp }],
    })
    setNewExp({ title: "", period: "", desc: "" })
  }

  const handleRemoveExperience = (idx: number) => {
    setAboutForm({
      ...aboutForm,
      experience: aboutForm.experience.filter((_, i) => i !== idx),
    })
  }

  const handleAddCertificate = () => {
    if (!newCert.trim()) return
    setAboutForm({
      ...aboutForm,
      skills: {
        ...aboutForm.skills,
        certificates: [...aboutForm.skills.certificates, newCert.trim()],
      },
    })
    setNewCert("")
  }

  const handleRemoveCertificate = (idx: number) => {
    setAboutForm({
      ...aboutForm,
      skills: {
        ...aboutForm.skills,
        certificates: aboutForm.skills.certificates.filter((_, i) => i !== idx),
      },
    })
  }

  const handleAddSoftware = () => {
    if (!newSoftware.trim()) return
    setAboutForm({
      ...aboutForm,
      software: [...aboutForm.software, newSoftware.trim()],
    })
    setNewSoftware("")
  }

  const handleRemoveSoftware = (idx: number) => {
    setAboutForm({
      ...aboutForm,
      software: aboutForm.software.filter((_, i) => i !== idx),
    })
  }

  // Contact Management Actions
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateContact(contactForm)
    onShowToast("연락처 및 링크 설정이 성공적으로 저장되었습니다.")
  }

  // Inquiries Actions
  const handleDeleteInquiry = (id: string) => {
    const updated = deleteInquiry(id)
    onUpdateInquiries(updated)
    onShowToast("문의 내역이 삭제되었습니다.")
  }

  const nextProjectId =
    projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 pb-20">
      {/* Top Admin Bar */}
      <div className="sticky top-0 z-40 bg-neutral-900 text-white px-4 sm:px-8 py-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-sm font-semibold tracking-tight font-serif italic">
            Kim Bom Portfolio CMS — Admin Panel
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
            PW: 4238 ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono rounded-xs transition-colors"
          >
            포트폴리오 보기 ↗
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 border border-neutral-700 hover:border-red-400 hover:text-red-400 text-neutral-400 text-xs font-mono rounded-xs transition-colors flex items-center gap-1.5"
            title="관리자 세션 로그아웃"
          >
            <LogOut size={12} /> 로그아웃
          </button>
        </div>
      </div>

      {/* Admin Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-300 gap-1 sm:gap-2 mb-8 bg-white p-1 rounded-sm shadow-xs overflow-x-auto">
          <button
            onClick={() => setTab("projects")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xs transition-all ${
              tab === "projects"
                ? "bg-neutral-900 text-white font-semibold shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <FolderKanban size={14} /> Projects ({projects.length})
          </button>
          <button
            onClick={() => setTab("about")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xs transition-all ${
              tab === "about"
                ? "bg-neutral-900 text-white font-semibold shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <User size={14} /> Profile / About
          </button>
          <button
            onClick={() => setTab("contact")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xs transition-all ${
              tab === "contact"
                ? "bg-neutral-900 text-white font-semibold shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <Settings size={14} /> Site Contact
          </button>
          <button
            onClick={() => setTab("inquiries")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xs transition-all ${
              tab === "inquiries"
                ? "bg-neutral-900 text-white font-semibold shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <Mail size={14} /> Inquiries ({inquiries.length})
          </button>
        </div>

        {/* Tab 1: Projects Management */}
        {tab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-sm border border-neutral-200 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  포트폴리오 프로젝트 목록 ({projects.length}개)
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  프로젝트를 추가, 수정, 순서 변경하거나 삭제할 수 있습니다. 변경사항은 즉시 반영됩니다.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetProjects}
                  className="px-3 py-2 border border-neutral-300 hover:border-neutral-500 text-neutral-600 text-xs font-mono rounded-xs flex items-center gap-1.5 transition-colors"
                  title="기본 9개 프로젝트 데이터 복원"
                >
                  <RotateCcw size={12} /> 기본 데이터 복원
                </button>
                <button
                  onClick={handleOpenAddProject}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus size={14} /> 새 프로젝트 추가
                </button>
              </div>
            </div>

            {/* Project List Items */}
            <div className="bg-white rounded-sm border border-neutral-200 shadow-xs divide-y divide-neutral-200">
              {projects.map((p, index) => (
                <div
                  key={p.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Color Thumbnail Preview */}
                    <div
                      className="w-14 h-14 rounded-xs border border-neutral-300/80 flex flex-col justify-between p-1.5 shrink-0 shadow-2xs"
                      style={{ backgroundColor: p.gray }}
                    >
                      <span className="text-[9px] font-mono font-bold text-neutral-500">
                        #{String(p.id).padStart(2, "0")}
                      </span>
                      <div
                        className="w-3 h-3 rounded-full self-end"
                        style={{ backgroundColor: p.accentColor }}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-900">
                          {p.title}
                        </span>
                        <span className="text-xs text-neutral-500 font-serif italic">
                          ({p.englishTitle})
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono rounded-xs border uppercase ${
                            p.category === "Branding"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : p.category === "Promotion"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          {p.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                        {p.tagline || p.details.overviewKo}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400 mt-1">
                        <span>{p.year}</span>
                        <span>·</span>
                        <span>클라이언트: {p.details.client || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleMoveProject(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-500 border border-neutral-200 rounded-xs bg-white"
                      title="위로 이동"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => handleMoveProject(index, "down")}
                      disabled={index === projects.length - 1}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-500 border border-neutral-200 rounded-xs bg-white"
                      title="아래로 이동"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => handleOpenEditProject(p)}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono rounded-xs flex items-center gap-1 transition-colors"
                    >
                      <Pencil size={12} /> 수정
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id, p.title)}
                      className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 text-xs font-mono rounded-xs transition-colors"
                      title="삭제"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Profile & About Management */}
        {tab === "about" && (
          <form onSubmit={handleSaveAbout} className="space-y-6">
            <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-200">
                01 / Main Hero Headline &amp; Greeting
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Headline (영문 메인 헤드라인)
                  </label>
                  <textarea
                    rows={2}
                    value={aboutForm.headline}
                    onChange={(e) =>
                      setAboutForm({ ...aboutForm, headline: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Design Philosophy (철학 요약)
                  </label>
                  <textarea
                    rows={2}
                    value={aboutForm.philosophy}
                    onChange={(e) =>
                      setAboutForm({ ...aboutForm, philosophy: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Introduction Lead (국문 소개 본문)
                </label>
                <textarea
                  rows={3}
                  value={aboutForm.leadKo}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, leadKo: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Experience list */}
            <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-200">
                02 / Experience (경력 사항)
              </h3>
              <div className="space-y-3">
                {aboutForm.experience.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-50 border rounded-xs flex items-center justify-between gap-4"
                  >
                    <div>
                      <strong className="text-xs text-neutral-900 block font-semibold">
                        {item.title}
                      </strong>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {item.period}
                      </span>
                      <p className="text-xs text-neutral-600 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(idx)}
                      className="text-neutral-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Experience form */}
              <div className="pt-2 border-t border-neutral-200 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="직책 및 회사 (예: Studio B, Designer)"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xs"
                />
                <input
                  type="text"
                  placeholder="기간 (예: 2021 — 2023)"
                  value={newExp.period}
                  onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                  className="w-full sm:w-48 px-3 py-1.5 text-xs border border-neutral-300 rounded-xs"
                />
                <input
                  type="text"
                  placeholder="주요 업무 요약"
                  value={newExp.desc}
                  onChange={(e) => setNewExp({ ...newExp, desc: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xs"
                />
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-mono rounded-xs shrink-0"
                >
                  경력 추가
                </button>
              </div>
            </div>

            {/* Skills & Software */}
            <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-200">
                03 / Software &amp; Certificates
              </h3>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Software Stack (사용 툴 목록)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="새 소프트웨어 (예: Cinema 4D)"
                    value={newSoftware}
                    onChange={(e) => setNewSoftware(e.target.value)}
                    className="w-full sm:w-64 px-3 py-1.5 text-xs border border-neutral-300 rounded-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddSoftware}
                    className="px-3 py-1.5 bg-neutral-900 text-white text-xs rounded-xs"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aboutForm.software.map((sw, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-neutral-100 border text-xs font-mono rounded-full flex items-center gap-1.5"
                    >
                      {sw}
                      <button
                        type="button"
                        onClick={() => handleRemoveSoftware(idx)}
                        className="text-neutral-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Certificates (자격 사항)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="자격증 명칭 (예: GTQ Graphic Technology 1급)"
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    className="w-full sm:w-64 px-3 py-1.5 text-xs border border-neutral-300 rounded-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCertificate}
                    className="px-3 py-1.5 bg-neutral-900 text-white text-xs rounded-xs"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aboutForm.skills.certificates.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-neutral-100 border text-xs rounded-xs flex items-center gap-1.5"
                    >
                      {cert}
                      <button
                        type="button"
                        onClick={() => handleRemoveCertificate(idx)}
                        className="text-neutral-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider rounded-xs hover:bg-neutral-800 shadow-xs flex items-center gap-2"
              >
                <Check size={14} /> Save About Changes
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Site Contact Settings */}
        {tab === "contact" && (
          <form
            onSubmit={handleSaveContact}
            className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs space-y-6"
          >
            <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-200">
              Site Contact &amp; Links Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Primary Contact Email (대표 이메일) *
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Instagram Handle (@계정)
                </label>
                <input
                  type="text"
                  value={contactForm.instagram}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, instagram: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Behance Portfolio URL
                </label>
                <input
                  type="text"
                  value={contactForm.behance}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, behance: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Studio Location (스튜디오 위치)
                </label>
                <input
                  type="text"
                  value={contactForm.locationText}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, locationText: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-200">
              <button
                type="submit"
                className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider rounded-xs hover:bg-neutral-800 shadow-xs flex items-center gap-2"
              >
                <Check size={14} /> Save Contact Settings
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Inquiries Inbox */}
        {tab === "inquiries" && (
          <div className="bg-white rounded-sm border border-neutral-200 shadow-xs divide-y divide-neutral-200">
            <div className="p-5 flex justify-between items-center bg-neutral-50/60">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  접수된 문의 내역 ({inquiries.length}건)
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  홈페이지 Contact 폼에서 방문자가 전송한 협업 제안 및 문의 내역입니다.
                </p>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-12 text-center text-neutral-400 text-xs font-mono">
                접수된 문의 내역이 없습니다.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="p-5 space-y-2 hover:bg-neutral-50/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900">
                        {inq.name}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono">
                        &lt;{inq.email}&gt;
                      </span>
                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] font-mono border rounded-xs">
                        {inq.projectType}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">{inq.date}</span>
                  </div>

                  <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xs border border-neutral-200/60">
                    {inq.message}
                  </p>

                  <div className="flex justify-end gap-3 pt-1">
                    <a
                      href={`mailto:${inq.email}?subject=RE: [Kim Bom Studio] 협업 문의 회신`}
                      className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono rounded-xs flex items-center gap-1.5"
                    >
                      <Mail size={12} /> 답장하기
                    </a>
                    <button
                      onClick={() => handleDeleteInquiry(inq.id)}
                      className="px-2 py-1 text-neutral-400 hover:text-red-600 text-xs font-mono"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Project Edit Modal */}
      <ProjectEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProject}
        initialProject={editingProject}
        nextId={nextProjectId}
      />
    </div>
  )
}
