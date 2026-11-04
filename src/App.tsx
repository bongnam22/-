import React, { useEffect, useMemo, useState, useRef } from "react"
import { Project, Category } from "./data/projects"
import {
  loadProjects,
  saveProjects,
  loadAboutData,
  saveAboutData,
  loadContactData,
  saveContactData,
  loadInquiries,
  saveInquiry,
  checkAdminAuth,
  setAdminAuth,
  AboutData,
  SiteContactData,
  InquiryMessage,
} from "./data/storage"
import { ProjectArt } from "./components/ProjectArt"
import { Lightbox } from "./components/Lightbox"
import { AdminLoginModal } from "./components/AdminLoginModal"
import { AdminDashboard } from "./components/AdminDashboard"
import { ProjectEditModal } from "./components/ProjectEditModal"
import { processMultipleImageFiles } from "./utils/imageStore"
import {
  Check,
  Copy,
  ExternalLink,
  Mail,
  Send,
  Sparkles,
  Lock,
  Unlock,
  Pencil,
  Shield,
  Upload,
  Plus,
} from "lucide-react"

type View = "home" | "project" | "about" | "contact" | "admin"

function Star({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 0.5C10.55 7.25 12.75 9.45 19.5 10C12.75 10.55 10.55 12.75 10 19.5C9.45 12.75 7.25 10.55 0.5 10C7.25 9.45 9.45 7.25 10 0.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

function OrbitMark() {
  return (
    <div className="orbit-mark" aria-hidden="true">
      <svg viewBox="0 0 110 54" fill="none">
        <path
          d="M3 38C21 4 73 1 104 17C127 29 87 53 38 48"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
      </svg>
      <span>
        <Star size={9} />
      </span>
    </div>
  )
}

function Header({
  view,
  onNavigate,
  onOpenAdmin,
  isAdmin,
}: {
  view: View
  onNavigate: (view: View) => void
  onOpenAdmin: () => void
  isAdmin: boolean
}) {
  return (
    <header className="site-header">
      <div className="wordmark-wrap">
        <button
          className="wordmark"
          onClick={() => onNavigate("home")}
          aria-label="bom.d home"
        >
          bom.d
        </button>
        <div className="logo-star">
          <Star size={11} />
        </div>
      </div>
      <nav aria-label="Main navigation">
        <button
          className={view === "home" || view === "project" ? "active" : ""}
          onClick={() => onNavigate("home")}
        >
          Work
        </button>
        <button
          className={view === "about" ? "active" : ""}
          onClick={() => onNavigate("about")}
        >
          About
        </button>
        <button
          className={view === "contact" ? "active" : ""}
          onClick={() => onNavigate("contact")}
        >
          Contact
        </button>
        <button
          className={`flex items-center gap-1.5 font-mono ${
            view === "admin" ? "active text-neutral-900" : ""
          } ${isAdmin ? "text-amber-800 font-semibold" : ""}`}
          onClick={onOpenAdmin}
          title={isAdmin ? "관리자 대시보드 열기" : "관리자 로그인"}
        >
          {isAdmin ? <Unlock size={11} className="text-amber-600" /> : <Lock size={11} />}
          Admin
        </button>
      </nav>
    </header>
  )
}

const filterOptions = ["All", "Promotion", "Graphic", "Branding"] as const

function FilterTabs({
  active,
  onChange,
  projectsList,
}: {
  active: string
  onChange: (value: string) => void
  projectsList: Project[]
}) {
  return (
    <div className="filter-tabs" aria-label="Filter projects">
      {filterOptions.map((filter) => {
        const count =
          filter === "All"
            ? projectsList.length
            : projectsList.filter((p) => p.category === filter).length
        return (
          <button
            key={filter}
            className={active === filter ? "active" : ""}
            onClick={() => onChange(filter)}
          >
            {filter}
            <span className="count">({count})</span>
          </button>
        )
      })}
    </div>
  )
}

function ThumbnailCard({
  project,
  onOpen,
  isAdmin,
  onEdit,
}: {
  project: Project
  onOpen: () => void
  isAdmin: boolean
  onEdit: (e: React.MouseEvent) => void
}) {
  return (
    <div className="relative group">
      <button
        className={`thumbnail-card ${project.shape}`}
        onClick={onOpen}
        aria-label={`Open ${project.title} project`}
      >
        <span className="placeholder-index">
          {String(project.id).padStart(2, "0")}
        </span>
        <span className="placeholder-cross" aria-hidden="true" />
        <ProjectArt project={project} variant="thumb" />
        <span className="thumbnail-label">
          <strong>{project.title}</strong>
          <span>{project.category}</span>
        </span>
      </button>

      {isAdmin && (
        <button
          onClick={onEdit}
          className="absolute top-3 right-3 z-30 p-1.5 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-full shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
          title="관리자: 이 프로젝트 수정"
        >
          <Pencil size={12} />
        </button>
      )}
    </div>
  )
}

function Footer({
  onNavigate,
  onOpenAdmin,
  isAdmin,
}: {
  onNavigate: (view: View) => void
  onOpenAdmin: () => void
  isAdmin: boolean
}) {
  return (
    <footer>
      <div className="flex items-center gap-3">
        <span>© 2025 bom.d · Graphic &amp; Brand Designer</span>
        <span className="text-neutral-300">|</span>
        <button
          onClick={onOpenAdmin}
          className="text-neutral-400 hover:text-neutral-700 text-[11px] font-mono flex items-center gap-1"
        >
          {isAdmin ? <Unlock size={10} /> : <Lock size={10} />}
          {isAdmin ? "Admin Active" : "Admin"}
        </button>
      </div>
      <button onClick={() => onNavigate("contact")}>
        Let’s work together ↗
      </button>
    </footer>
  )
}

function Home({
  projectsList,
  onOpen,
  onNavigate,
  onOpenAdmin,
  isAdmin,
  onQuickEdit,
}: {
  projectsList: Project[]
  onOpen: (project: Project) => void
  onNavigate: (view: View) => void
  onOpenAdmin: () => void
  isAdmin: boolean
  onQuickEdit: (project: Project) => void
}) {
  const [filter, setFilter] = useState("All")

  const visible = useMemo(
    () =>
      filter === "All"
        ? projectsList
        : projectsList.filter((project) => project.category === filter),
    [filter, projectsList],
  )

  return (
    <main className="home-page page-enter">
      {/* Admin Mode Bar if logged in */}
      {isAdmin && (
        <div className="mx-4 sm:mx-8 mb-4 px-4 py-2 bg-amber-50 border border-amber-200/80 rounded-xs flex items-center justify-between text-xs font-mono text-amber-900">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-amber-600" />
            <span>관리자 모드 활성화 (bom.d) — 카드 위 수정 아이콘을 누르거나 대시보드에서 내 컴퓨터 이미지를 여러 장 등록할 수 있습니다.</span>
          </div>
          <button
            onClick={onOpenAdmin}
            className="underline hover:text-amber-700 font-semibold"
          >
            대시보드 열기 ↗
          </button>
        </div>
      )}

      <div className="home-intro">
        <div className="intro-text">
          <p>
            <strong>bom.d</strong> — Graphic &amp; Brand Designer
            <br />
            based in Korea.
          </p>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Focusing on brand identity, campaign art direction, and cultural posters.
          </p>
        </div>
        <FilterTabs
          active={filter}
          onChange={setFilter}
          projectsList={projectsList}
        />
      </div>

      <section className="masonry-grid" aria-live="polite">
        {visible.map((project) => (
          <ThumbnailCard
            key={project.id}
            project={project}
            onOpen={() => onOpen(project)}
            isAdmin={isAdmin}
            onEdit={(e) => {
              e.stopPropagation()
              onQuickEdit(project)
            }}
          />
        ))}
      </section>

      <Footer
        onNavigate={onNavigate}
        onOpenAdmin={onOpenAdmin}
        isAdmin={isAdmin}
      />
    </main>
  )
}

function ProjectDetail({
  project,
  projectsList,
  onBack,
  onNext,
  onShowToast,
  isAdmin,
  onQuickEdit,
  onAddImagesToProject,
}: {
  project: Project
  projectsList: Project[]
  onBack: () => void
  onNext: (project: Project) => void
  onShowToast: (msg: string) => void
  isAdmin: boolean
  onQuickEdit: (project: Project) => void
  onAddImagesToProject: (projectId: number, newImages: string[]) => void
}) {
  const currentIndex = projectsList.findIndex((p) => p.id === project.id)
  const next = projectsList[(currentIndex + 1) % projectsList.length]
  const prev = projectsList[(currentIndex - 1 + projectsList.length) % projectsList.length]

  const quickImageInputRef = useRef<HTMLInputElement>(null)

  const copyColor = (hex: string, name: string) => {
    navigator.clipboard.writeText(hex)
    onShowToast(`Copied ${name} (${hex}) to clipboard!`)
  }

  const handleQuickAddImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    onShowToast("이미지 처리 및 업로드 중...")
    try {
      const dataUrls = await processMultipleImageFiles(files)
      onAddImagesToProject(project.id, dataUrls)
      onShowToast(`${dataUrls.length}장의 이미지가 프로젝트에 추가되었습니다!`)
    } catch {
      onShowToast("이미지 업로드에 실패했습니다.")
    }
  }

  const hasUploadedGallery =
    project.galleryImages && project.galleryImages.length > 0

  return (
    <main className="project-page page-enter pt-4">
      {/* Admin Quick Edit & Multi-image Upload Banner */}
      {isAdmin && (
        <div className="mb-6 px-4 py-2.5 bg-neutral-900 text-white rounded-xs flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-amber-400" />
            <span>관리자 권한: &apos;{project.title}&apos; 이미지 업로드 및 상세 정보 수정</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={quickImageInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleQuickAddImages(e.target.files)}
            />
            <button
              onClick={() => quickImageInputRef.current?.click()}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xs flex items-center gap-1.5 transition-colors"
              title="내 컴퓨터에서 여러 장의 이미지를 바로 추가"
            >
              <Upload size={12} /> + 내 컴퓨터 이미지 추가
            </button>
            <button
              onClick={() => onQuickEdit(project)}
              className="px-3 py-1 bg-amber-400 text-neutral-900 font-semibold rounded-xs hover:bg-amber-300 transition-colors flex items-center gap-1.5"
            >
              <Pencil size={12} /> 프로젝트 전체 수정
            </button>
          </div>
        </div>
      )}

      {/* Main 2-Column Split: Left = Images Stream (Original Size), Right = Sticky Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start pb-20">
        
        {/* Left Column: Photos Stream (Original natural size, no forced cropping, no lightbox) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8 order-2 lg:order-1">
          {hasUploadedGallery ? (
            <div className="space-y-6">
              {project.galleryImages?.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xs overflow-hidden border border-neutral-200/90 shadow-2xs"
                >
                  <img
                    src={imgUrl}
                    alt={`${project.title} - ${idx + 1}`}
                    className="w-full h-auto block object-contain"
                    loading="lazy"
                  />
                  <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>{project.englishTitle} — #{String(idx + 1).padStart(2, "0")}</span>
                    <span>ORIGINAL SIZE</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Default artwork mockups if no custom photos uploaded yet */
            <div className="space-y-6">
              <div className="bg-white rounded-xs overflow-hidden border border-neutral-200/90 shadow-2xs">
                <ProjectArt project={project} variant="mockup1" className="wide" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xs overflow-hidden border border-neutral-200/90 shadow-2xs">
                  <ProjectArt project={project} variant="mockup2" />
                </div>
                <div className="bg-white rounded-xs overflow-hidden border border-neutral-200/90 shadow-2xs">
                  <ProjectArt project={project} variant="mockup3" />
                </div>
              </div>
              <div className="bg-white rounded-xs overflow-hidden border border-neutral-200/90 shadow-2xs">
                <ProjectArt project={project} variant="experience" className="wide tall" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xs overflow-hidden border border-neutral-200/90 shadow-2xs">
                  <ProjectArt project={project} variant="mockup4" />
                </div>
                <div className="bg-white rounded-xs overflow-hidden border border-neutral-200/90 shadow-2xs">
                  <ProjectArt project={project} variant="mockup1" />
                </div>
              </div>
            </div>
          )}

          {/* Quick Add upload prompt for Admin if empty or adding more */}
          {isAdmin && (
            <div
              onClick={() => quickImageInputRef.current?.click()}
              className="p-6 border-2 border-dashed border-neutral-300 hover:border-neutral-700 bg-neutral-50 rounded-xs text-center cursor-pointer transition-colors"
            >
              <div className="flex flex-col items-center justify-center gap-1.5 text-xs text-neutral-600">
                <Upload size={18} className="text-neutral-500" />
                <span className="font-semibold underline text-neutral-800">
                  + 내 컴퓨터에서 사진 추가하기
                </span>
                <span className="text-[11px] text-neutral-400">
                  여러 장의 사진을 선택하면 원본 비율 그대로 목록에 추가됩니다.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Overview & Project System */}
        <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 lg:self-start space-y-8 order-1 lg:order-2 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
          
          {/* Heading & Meta */}
          <div className="space-y-4 pb-6 border-b border-neutral-200">
            <div>
              <p className="eyebrow text-neutral-500">
                Selected work · {project.category} · #{String(project.id).padStart(2, "0")}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mt-2 leading-tight">
                {project.title}
              </h1>
              <p className="english-title text-base text-neutral-500 mt-1">
                {project.englishTitle}
              </p>
              <p className="text-xs text-neutral-600 mt-2.5 font-medium leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Meta tags */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-2.5 bg-neutral-50 rounded-xs border border-neutral-200/60">
                <span className="block text-[10px] font-mono uppercase text-neutral-400">Period</span>
                <strong className="text-neutral-800 font-semibold">{project.year}</strong>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-xs border border-neutral-200/60">
                <span className="block text-[10px] font-mono uppercase text-neutral-400">Client</span>
                <strong className="text-neutral-800 font-semibold truncate block" title={project.details.client}>
                  {project.details.client || "-"}
                </strong>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-xs border border-neutral-200/60 col-span-2 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Tools</span>
                <div className="flex gap-1.5">
                  {project.details.tools.map((t) => (
                    <span key={t} className="px-2 py-0.5 border border-neutral-800 rounded-full text-[10px] font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 01 / Overview */}
          <div className="space-y-3 pb-6 border-b border-neutral-200">
            <p className="eyebrow text-neutral-500">01 / Overview</p>
            <h3 className="text-lg font-bold text-neutral-900 leading-snug">
              일상 속 새로운 장면을
              <br />
              만드는 디자인
            </h3>
            <p className="text-xs text-neutral-700 leading-relaxed pt-1">
              {project.details.overviewKo}
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed italic font-serif pt-1">
              {project.details.overviewEn}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.details.deliverables.map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 text-[10px] font-mono uppercase bg-neutral-100 text-neutral-700 rounded-xs border border-neutral-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 02 / Color System */}
          <div className="space-y-3 pb-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-neutral-500">02 / Color System</p>
              <span className="text-[10px] font-mono text-neutral-400">CLICK TO COPY HEX</span>
            </div>

            {/* Color Swatches */}
            <div className="grid grid-cols-2 gap-2">
              {project.details.palette.map((color) => {
                const isDark =
                  color.hex === "#111111" ||
                  color.hex === "#0E1E38" ||
                  color.hex === "#003A70" ||
                  color.hex === "#191B1F" ||
                  color.hex === "#3E2723" ||
                  color.hex === "#00695C" ||
                  color.hex === "#37474F" ||
                  color.hex === "#4E342E" ||
                  color.hex === "#1B5E20" ||
                  color.hex === "#263238" ||
                  color.hex === "#8D6E63"

                return (
                  <div
                    key={color.hex}
                    style={{
                      backgroundColor: color.hex,
                      color: isDark ? "#ffffff" : "#111111",
                    }}
                    onClick={() => copyColor(color.hex, color.name)}
                    className="p-3 rounded-xs flex flex-col justify-between h-24 cursor-pointer group transition-all hover:scale-[1.02] shadow-2xs border border-black/5"
                    title="Click to copy HEX"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-xs leading-tight block truncate">
                        {color.name}
                      </span>
                      <Copy size={11} className="opacity-0 group-hover:opacity-100 shrink-0" />
                    </div>
                    <div>
                      <p className="text-[10px] opacity-75 line-clamp-1 mb-1">
                        {color.desc}
                      </p>
                      <small className="font-mono text-[10px] opacity-90 font-medium">
                        {color.hex}
                      </small>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              ← Back to all
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNext(prev)}
                className="text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors"
                title={`Previous: ${prev.title}`}
              >
                Prev
              </button>
              <span className="text-neutral-300">/</span>
              <button
                onClick={() => onNext(next)}
                className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-900 hover:opacity-60 transition-opacity flex items-center gap-1"
                title={`Next: ${next.title}`}
              >
                Next: {next.title} ↗
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

function Globe({ onSpin }: { onSpin?: () => void }) {
  const [rotation, setRotation] = useState(0)

  const handleGlobeClick = () => {
    setRotation((r) => r + 45)
    onSpin?.()
  }

  return (
    <div
      className="globe-wrap"
      aria-label="bom.d globe illustration"
      onClick={handleGlobeClick}
      title="Click to spin the globe!"
    >
      <svg
        viewBox="0 0 260 260"
        role="img"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "transform 800ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <defs>
          <radialGradient id="globeGradient" cx="35%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#f8f8f6" />
            <stop offset="60%" stopColor="#c5c8c2" />
            <stop offset="100%" stopColor="#8e918d" />
          </radialGradient>
          <path id="curve" d="M42,145 A92,92 0 0,1 218,145" />
        </defs>
        <circle cx="130" cy="140" r="72" fill="url(#globeGradient)" />
        <ellipse
          cx="130"
          cy="140"
          rx="72"
          ry="23"
          fill="none"
          stroke="#fff"
          strokeOpacity=".6"
        />
        <ellipse
          cx="130"
          cy="140"
          rx="26"
          ry="72"
          fill="none"
          stroke="#fff"
          strokeOpacity=".6"
        />
        <path
          d="M62 116C103 130 161 129 199 109M63 168C105 151 160 153 198 173"
          fill="none"
          stroke="#fff"
          strokeOpacity=".5"
        />
        <text className="curve-text">
          <textPath href="#curve" startOffset="50%" textAnchor="middle">
            BOM.D · GRAPHIC DESIGNER ·
          </textPath>
        </text>
      </svg>
      <div className="globe-star">
        <Star size={24} />
      </div>
    </div>
  )
}

function About({
  aboutData,
  onNavigate,
  onShowToast,
  onOpenAdmin,
  isAdmin,
}: {
  aboutData: AboutData
  onNavigate: (view: View) => void
  onShowToast: (msg: string) => void
  onOpenAdmin: () => void
  isAdmin: boolean
}) {
  const downloadResume = () => {
    onShowToast("bom.d's Resume & Portfolio brief ready for download!")
  }

  return (
    <main className="about-page page-enter">
      <section className="about-hero">
        <div>
          <p className="eyebrow">{aboutData.subhead}</p>
          <h1 className="whitespace-pre-line">{aboutData.headline}</h1>
          <p className="about-lead">{aboutData.leadKo}</p>
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={() => onNavigate("contact")}
              className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-mono tracking-wider uppercase rounded-xs hover:bg-neutral-800 transition-colors"
            >
              Start a Conversation ↗
            </button>
            <button
              onClick={downloadResume}
              className="px-4 py-2.5 border border-neutral-300 text-neutral-800 text-xs font-mono tracking-wider uppercase rounded-xs hover:border-neutral-900 transition-colors"
            >
              Resume Brief
            </button>
          </div>
        </div>
        <Globe onSpin={() => onShowToast("Ideas in orbit!")} />
      </section>

      <section className="profile-grid">
        <div>
          <p className="section-label">Experience</p>
          <ul>
            {aboutData.experience.map((item, idx) => (
              <li key={idx}>
                <strong>{item.title}</strong>
                <span>{item.period}</span>
                <p className="text-xs text-neutral-500 mt-1">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="section-label">Education</p>
          <ul>
            {aboutData.education.map((edu, idx) => (
              <li key={idx}>
                <strong>{edu.degree}</strong>
                <span>{edu.school}</span>
              </li>
            ))}
          </ul>

          <p className="section-label sub-label">Certificate / Skills</p>
          <div className="space-y-1.5 text-xs text-neutral-600">
            {aboutData.skills.certificates.map((cert, idx) => (
              <p
                key={idx}
                className={idx === 0 ? "font-semibold text-neutral-900" : ""}
              >
                {cert}
              </p>
            ))}
            <p className="pt-2 text-neutral-500">
              {aboutData.skills.core.join(" · ")}
            </p>
          </div>
        </div>

        <div>
          <p className="section-label">Software</p>
          <div className="pill-list">
            {aboutData.software.map((sw, idx) => (
              <span key={idx}>{sw}</span>
            ))}
          </div>
          <div className="mt-8 p-4 bg-neutral-50 rounded-xs border border-neutral-200/60">
            <span className="block text-[11px] font-mono text-neutral-400 uppercase tracking-widest mb-1">
              Design Philosophy
            </span>
            <p className="text-xs text-neutral-700 leading-relaxed">
              &quot;{aboutData.philosophy}&quot;
            </p>
          </div>
        </div>

        <div>
          <p className="section-label">Interests</p>
          <div className="interest-list">
            {aboutData.interests.map((item, idx) => (
              <span key={idx} title={item.tooltip}>
                <i>{item.icon}</i>
                {item.name}
              </span>
            ))}
          </div>
          <div className="mt-8 text-xs text-neutral-500 font-mono">
            <p>LOCATION</p>
            <p className="text-neutral-800 font-semibold mt-0.5">
              {aboutData.location}
            </p>
            <p className="text-[10px] mt-1 text-neutral-400">
              Available for global remote projects.
            </p>
          </div>
        </div>
      </section>

      <Footer
        onNavigate={onNavigate}
        onOpenAdmin={onOpenAdmin}
        isAdmin={isAdmin}
      />
    </main>
  )
}

function Contact({
  contactData,
  onShowToast,
  onNewInquiry,
}: {
  contactData: SiteContactData
  onShowToast: (msg: string) => void
  onNewInquiry: (inq: {
    name: string
    email: string
    projectType: string
    message: string
  }) => void
}) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    projectType: "Branding",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText(contactData.email)
    onShowToast(`Copied ${contactData.email} to clipboard!`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.name || !formState.email || !formState.message) {
      onShowToast("Please fill in your name, email, and message.")
      return
    }

    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setIsSubmitted(true)
      onNewInquiry(formState)
      onShowToast("Thank you! Your message has been sent to bom.d.")
    }, 500)
  }

  return (
    <main className="contact-page page-enter">
      <div className="contact-content">
        <p className="eyebrow">Say hello</p>
        <h1>Contact</h1>
        <p>
          새로운 프로젝트와 즐거운 협업 제안을 언제나 환영합니다.
          <br />
          브랜드 아이덴티티, 캠페인 비주얼, 패키지 및 아트 디렉션에 대해 편하게 문의해주세요.
        </p>

        {/* Direct Contact Links */}
        <div className="contact-links">
          <a href={`mailto:${contactData.email}`} onClick={handleCopyEmail}>
            <span>Email (Click to copy)</span>
            {contactData.email} ↗
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col"
          >
            <span>Instagram</span>
            {contactData.instagram} ↗
          </a>
          <a
            href="https://behance.net"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col"
          >
            <span>Portfolio Archive</span>
            {contactData.behance} ↗
          </a>
        </div>

        {/* Inquiry Form */}
        <div className="mt-14 max-w-xl p-8 bg-neutral-50/90 backdrop-blur-xs border border-neutral-200/80 rounded-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-200">
            <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
              <Mail size={16} /> Send a Message
            </h3>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              Typical reply: &lt; 24h
            </span>
          </div>

          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Check size={24} />
              </div>
              <h4 className="text-base font-semibold text-neutral-900">
                메시지가 전송되었습니다!
              </h4>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                작성해주신 내용({formState.name}님, {formState.projectType})을 확인 후 24시간 이내에
                이메일({formState.email})로 연락드리겠습니다.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false)
                  setFormState({
                    name: "",
                    email: "",
                    projectType: "Branding",
                    message: "",
                  })
                }}
                className="mt-4 px-4 py-2 text-xs font-mono uppercase border border-neutral-300 rounded-xs hover:border-neutral-900"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동 / Name"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xs focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xs focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1">
                  Project Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["Branding", "Promotion", "Graphic", "Other"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormState({ ...formState, projectType: type })
                      }
                      className={`py-2 px-3 text-xs font-mono rounded-xs border text-center transition-all ${
                        formState.projectType === type
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1">
                  Message / Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="프로젝트 일정, 예산 범위, 구상 중이신 방향을 자유롭게 적어주세요."
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xs focus:outline-hidden focus:border-neutral-900 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 bg-neutral-900 text-white text-xs font-mono uppercase tracking-widest rounded-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                {isSending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={13} /> Send Inquiry
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="contact-orbit">
        <OrbitMark />
      </div>

      <div className="contact-bottom">
        <span>
          {contactData.locationText} · {contactData.coordsText}
        </span>
        <span>© 2025 bom.d. All rights reserved.</span>
      </div>
    </main>
  )
}

export default function App() {
  const [view, setView] = useState<View>("home")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Persistent States
  const [projectsList, setProjectsList] = useState<Project[]>(loadProjects)
  const [aboutData, setAboutData] = useState<AboutData>(loadAboutData)
  const [contactData, setContactData] = useState<SiteContactData>(loadContactData)
  const [inquiries, setInquiries] = useState<InquiryMessage[]>(loadInquiries)

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(checkAdminAuth)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // Quick edit modal from client
  const [quickEditProject, setQuickEditProject] = useState<Project | null>(null)
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false)

  // Selected project for ProjectDetail view
  const [selectedProject, setSelectedProject] = useState<Project>(() => projectsList[0])

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur))
    }, 2800)
  }

  const navigate = (nextView: View) => {
    setView(nextView)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const openProject = (project: Project) => {
    setSelectedProject(project)
    navigate("project")
  }

  // Open Admin Handler
  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      navigate("admin")
    } else {
      setIsLoginModalOpen(true)
    }
  }

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true)
    setAdminAuth(true)
    setIsLoginModalOpen(false)
    navigate("admin")
    showToast("관리자 모드로 로그인되었습니다.")
  }

  const handleLogout = () => {
    setIsAdminLoggedIn(false)
    setAdminAuth(false)
    navigate("home")
    showToast("관리자 세션에서 로그아웃되었습니다.")
  }

  // Updates from Admin
  const handleUpdateProjects = (newProjects: Project[]) => {
    setProjectsList(newProjects)
    saveProjects(newProjects)
    // Keep selectedProject in sync
    const currentStillExists = newProjects.find((p) => p.id === selectedProject?.id)
    if (currentStillExists) {
      setSelectedProject(currentStillExists)
    } else if (newProjects.length > 0) {
      setSelectedProject(newProjects[0])
    }
  }

  // Quick Add multiple images to a project
  const handleAddImagesToProject = (projectId: number, newImages: string[]) => {
    const updated = projectsList.map((p) => {
      if (p.id !== projectId) return p
      const currentGallery = p.galleryImages || []
      const merged = [...currentGallery, ...newImages]
      return {
        ...p,
        coverImage: p.coverImage || merged[0],
        galleryImages: merged,
      }
    })
    handleUpdateProjects(updated)
  }

  const handleUpdateAbout = (newAbout: AboutData) => {
    setAboutData(newAbout)
    saveAboutData(newAbout)
  }

  const handleUpdateContact = (newContact: SiteContactData) => {
    setContactData(newContact)
    saveContactData(newContact)
  }

  const handleNewInquiry = (inquiry: {
    name: string
    email: string
    projectType: string
    message: string
  }) => {
    saveInquiry(inquiry)
    setInquiries(loadInquiries())
  }

  // Quick Edit Trigger
  const handleTriggerQuickEdit = (p: Project) => {
    setQuickEditProject(p)
    setIsQuickEditOpen(true)
  }

  const handleSaveQuickEdit = (saved: Project) => {
    const updated = projectsList.map((p) => (p.id === saved.id ? saved : p))
    handleUpdateProjects(updated)
    setSelectedProject(saved)
    setIsQuickEditOpen(false)
    showToast(`프로젝트 '${saved.title}' 수정이 저장되었습니다.`)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (view === "project" || view === "admin") {
          navigate("home")
        }
      }
      if (view === "project") {
        const curIdx = projectsList.findIndex((p) => p.id === selectedProject.id)
        if (event.key === "ArrowRight") {
          const nextIdx = (curIdx + 1) % projectsList.length
          setSelectedProject(projectsList[nextIdx])
          window.scrollTo({ top: 0, behavior: "smooth" })
        } else if (event.key === "ArrowLeft") {
          const prevIdx = (curIdx - 1 + projectsList.length) % projectsList.length
          setSelectedProject(projectsList[prevIdx])
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [view, selectedProject, projectsList])

  return (
    <div className="app-shell">
      {view !== "admin" && (
        <Header
          view={view}
          onNavigate={navigate}
          onOpenAdmin={handleOpenAdmin}
          isAdmin={isAdminLoggedIn}
        />
      )}

      {view === "home" && (
        <Home
          projectsList={projectsList}
          onOpen={openProject}
          onNavigate={navigate}
          onOpenAdmin={handleOpenAdmin}
          isAdmin={isAdminLoggedIn}
          onQuickEdit={handleTriggerQuickEdit}
        />
      )}

      {view === "project" && (
        <ProjectDetail
          project={selectedProject}
          projectsList={projectsList}
          onBack={() => navigate("home")}
          onNext={openProject}
          onShowToast={showToast}
          isAdmin={isAdminLoggedIn}
          onQuickEdit={handleTriggerQuickEdit}
          onAddImagesToProject={handleAddImagesToProject}
        />
      )}

      {view === "about" && (
        <About
          aboutData={aboutData}
          onNavigate={navigate}
          onShowToast={showToast}
          onOpenAdmin={handleOpenAdmin}
          isAdmin={isAdminLoggedIn}
        />
      )}

      {view === "contact" && (
        <Contact
          contactData={contactData}
          onShowToast={showToast}
          onNewInquiry={handleNewInquiry}
        />
      )}

      {view === "admin" && (
        <AdminDashboard
          projects={projectsList}
          aboutData={aboutData}
          contactData={contactData}
          inquiries={inquiries}
          onUpdateProjects={handleUpdateProjects}
          onUpdateAbout={handleUpdateAbout}
          onUpdateContact={handleUpdateContact}
          onUpdateInquiries={setInquiries}
          onLogout={handleLogout}
          onClose={() => navigate("home")}
          onShowToast={showToast}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Quick Edit Modal */}
      {isQuickEditOpen && (
        <ProjectEditModal
          isOpen={true}
          onClose={() => setIsQuickEditOpen(false)}
          onSave={handleSaveQuickEdit}
          initialProject={quickEditProject}
          nextId={projectsList.length + 1}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-neutral-900 text-white text-xs font-mono rounded-xs shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles size={13} className="text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
