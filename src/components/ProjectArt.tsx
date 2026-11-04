import React from "react"
import { Project } from "../data/projects"

interface ProjectArtProps {
  project: Project
  variant?: "thumb" | "hero" | "mockup1" | "mockup2" | "mockup3" | "mockup4" | "experience"
  customImage?: string
  className?: string
}

export function ProjectArt({
  project,
  variant = "thumb",
  customImage,
  className = "",
}: ProjectArtProps) {
  const p = project
  const pal = p.details.palette

  // If a specific customImage was passed, or if coverImage is available for thumbnail
  const activeImage =
    customImage ||
    (variant === "thumb" ? p.coverImage : undefined) ||
    (variant === "hero" ? p.coverImage : undefined) ||
    (variant === "mockup1" ? p.galleryImages?.[0] : undefined) ||
    (variant === "mockup2" ? p.galleryImages?.[1] : undefined) ||
    (variant === "mockup3" ? p.galleryImages?.[2] : undefined) ||
    (variant === "mockup4" ? p.galleryImages?.[3] : undefined)

  if (activeImage && (variant === "thumb" || customImage)) {
    return (
      <div className={`relative w-full h-full overflow-hidden flex items-center justify-center select-none ${className}`}>
        <img
          src={activeImage}
          alt={p.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    )
  }

  if (variant === "thumb") {
    return (
      <div className={`relative w-full h-full overflow-hidden flex items-center justify-center select-none ${className}`}>
        {/* Subtle geometric composition based on project ID */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            background: `radial-gradient(circle at 75% 25%, ${pal[1]?.hex || p.accentColor}18 0%, ${p.gray} 85%)`,
          }}
        />

        {/* Decorative Designer Grid & Art Elements */}
        <svg
          className="absolute inset-0 w-full h-full opacity-65 pointer-events-none transition-opacity duration-300 group-hover:opacity-90"
          viewBox="0 0 300 220"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id={`grad-${p.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={pal[1]?.hex || p.accentColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={pal[0]?.hex || "#111"} stopOpacity="0.1" />
            </linearGradient>
            <pattern id={`pattern-${p.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.12" />
            </pattern>
          </defs>

          {/* Grid pattern */}
          <rect width="100%" height="100%" fill={`url(#pattern-${p.id})`} />

          {/* Abstract geometric vector corresponding to project category */}
          {p.category === "Promotion" && (
            <g transform="translate(150, 110)">
              <circle r="60" fill="none" stroke={pal[1]?.hex || p.accentColor} strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
              <circle r="40" fill={`url(#grad-${p.id})`} />
              <path d="M -45 0 L 45 0 M 0 -45 L 0 45" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
              <polygon points="0,-25 22,18 -22,18" fill="none" stroke={pal[2]?.hex || "#111"} strokeWidth="1.2" />
            </g>
          )}

          {p.category === "Graphic" && (
            <g transform="translate(150, 110)">
              <rect x="-42" y="-42" width="84" height="84" rx="16" fill={`url(#grad-${p.id})`} />
              <circle cx="0" cy="0" r="32" fill="none" stroke={pal[0]?.hex || "#111"} strokeWidth="1.2" />
              <path d="M -25 -25 C 0 -45, 0 45, 25 25" fill="none" stroke={pal[1]?.hex || "#fff"} strokeWidth="1.5" />
              <circle cx="-12" cy="-8" r="4" fill={pal[0]?.hex || "#111"} />
              <circle cx="12" cy="-8" r="4" fill={pal[0]?.hex || "#111"} />
            </g>
          )}

          {p.category === "Branding" && (
            <g transform="translate(150, 110)">
              <circle r="52" fill="none" stroke={pal[0]?.hex || "#111"} strokeWidth="1" opacity="0.4" />
              <circle r="46" fill={`url(#grad-${p.id})`} />
              <rect x="-24" y="-24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fontSize="18"
                fontFamily="Instrument Serif, serif"
                fontStyle="italic"
                fill={pal[0]?.hex || "#111"}
              >
                {p.englishTitle.slice(0, 2).toUpperCase()}
              </text>
            </g>
          )}
        </svg>

        {/* Center Title preview watermark */}
        <div className="relative z-10 text-center px-4 pointer-events-none transform transition-transform duration-300 group-hover:-translate-y-1">
          <span
            className="block text-[11px] font-mono tracking-widest uppercase opacity-40 mb-1"
            style={{ color: pal[0]?.hex || "#111" }}
          >
            {p.details.conceptKeyword}
          </span>
          <h4
            className="text-base font-semibold tracking-tight leading-tight text-neutral-800"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            {p.title}
          </h4>
          <span className="text-[10px] tracking-wide text-neutral-500 font-light block mt-0.5">
            {p.englishTitle}
          </span>
        </div>
      </div>
    )
  }

  if (variant === "hero") {
    if (p.coverImage) {
      return (
        <div
          className={`relative w-full h-full min-h-[420px] md:min-h-[560px] overflow-hidden flex flex-col justify-end p-8 md:p-14 select-none ${className}`}
        >
          <img
            src={p.coverImage}
            alt={p.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          {/* Top Bar overlay */}
          <div className="absolute top-6 left-6 right-6 md:top-10 md:left-14 md:right-14 flex items-center justify-between text-[11px] font-mono text-white/80 tracking-wider z-10">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accentColor }} />
              COVER IMAGE · {p.category.toUpperCase()}
            </span>
            <span>{p.year}</span>
          </div>

          {/* Content bottom */}
          <div className="relative z-10 max-w-2xl text-white">
            <span className="inline-block px-3 py-1 text-[11px] tracking-widest font-mono uppercase rounded-full mb-3 bg-white/20 backdrop-blur-md">
              {p.details.conceptKeyword}
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              {p.title}
            </h2>
            <p className="mt-2 text-xl md:text-2xl font-light text-white/80 tracking-tight font-serif italic">
              {p.englishTitle}
            </p>
            <p className="mt-3 text-sm md:text-base text-white/90 max-w-lg leading-relaxed">
              {p.tagline}
            </p>
          </div>
        </div>
      )
    }

    return (
      <div
        className={`relative w-full h-full min-h-[360px] md:min-h-[500px] overflow-hidden flex flex-col justify-between p-8 md:p-14 select-none ${className}`}
        style={{
          background: `linear-gradient(135deg, ${p.gray} 0%, ${pal[3]?.hex || "#f4f4f2"} 50%, ${pal[1]?.hex || p.accentColor}25 100%)`,
        }}
      >
        {/* Architectural backdrop grids */}
        <div className="absolute inset-0 bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Top bar with design coordinates */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-neutral-500 tracking-wider">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accentColor }} />
            KEY VISUAL COVER · {p.category.toUpperCase()}
          </span>
          <span>{p.year}</span>
        </div>

        {/* Center Graphic Exhibition Poster Layout */}
        <div className="relative z-10 my-auto py-8 max-w-2xl">
          <span
            className="inline-block px-3 py-1 text-[11px] tracking-widest font-mono uppercase rounded-full mb-4 bg-white/70 backdrop-blur-sm shadow-xs"
            style={{ color: pal[0]?.hex || "#111" }}
          >
            {p.details.conceptKeyword}
          </span>
          <h2
            className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.05]"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            {p.title}
          </h2>
          <p className="mt-2 text-xl md:text-2xl font-light text-neutral-600 tracking-tight font-serif italic">
            {p.englishTitle}
          </p>
          <p className="mt-4 text-sm md:text-base text-neutral-600 max-w-lg leading-relaxed">
            {p.tagline}
          </p>
        </div>

        {/* Bottom Specs */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-neutral-300/60 text-[11px] font-mono text-neutral-600">
          <div className="flex items-center gap-4">
            <span>CLIENT: {p.details.client}</span>
            <span>·</span>
            <span>ROLE: {p.details.role}</span>
          </div>
          <div className="flex items-center gap-2">
            {p.details.tools.map((t) => (
              <span key={t} className="px-2 py-0.5 border border-neutral-800 rounded-sm text-[10px] font-bold">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // If this mockup has a dedicated uploaded gallery image
  if (activeImage) {
    return (
      <div
        className={`relative w-full h-full min-h-[280px] overflow-hidden flex flex-col justify-between select-none group/img rounded-sm ${className}`}
      >
        <img
          src={activeImage}
          alt={p.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-103"
        />
        <div className="relative z-10 p-4 bg-gradient-to-b from-black/50 to-transparent flex items-center justify-between text-[10px] font-mono text-white/90 uppercase tracking-widest">
          <span>{variant.toUpperCase()}</span>
          <span>{p.englishTitle}</span>
        </div>
        <div className="relative z-10 p-4 bg-gradient-to-t from-black/60 to-transparent text-[10px] font-mono text-white/80">
          CLICK TO ZOOM
        </div>
      </div>
    )
  }

  // Detailed mockups representations (posters, packaging, brand systems)
  return (
    <div
      className={`relative w-full h-full min-h-[260px] overflow-hidden flex flex-col justify-between p-6 md:p-8 select-none transition-all duration-300 hover:shadow-lg ${className}`}
      style={{
        backgroundColor: p.gray,
        backgroundImage: `linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.04) 100%)`,
      }}
    >
      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
        <span>{variant.toUpperCase()}</span>
        <span className="opacity-60">{p.englishTitle}</span>
      </div>

      {/* Visual illustration of real deliverables */}
      <div className="my-auto py-6 flex items-center justify-center">
        {variant === "mockup1" && (
          <div className="w-full max-w-xs bg-white p-5 shadow-md border border-neutral-200 rounded-sm transform -rotate-1 transition-transform hover:rotate-0">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200 text-[9px] font-mono text-neutral-400">
              <span>{p.category}</span>
              <span>{p.year}</span>
            </div>
            <div
              className="mt-3 aspect-4/3 rounded-xs flex flex-col justify-end p-3 text-white"
              style={{ backgroundColor: pal[1]?.hex || p.accentColor }}
            >
              <span className="text-[10px] font-bold tracking-tight">{p.title}</span>
              <span className="text-[8px] opacity-80">{p.details.visuals.mockupType1}</span>
            </div>
            <p className="mt-3 text-[11px] font-medium text-neutral-800">{p.details.visuals.mockupType1}</p>
          </div>
        )}

        {variant === "mockup2" && (
          <div className="w-full max-w-xs flex gap-3 items-center justify-center">
            <div
              className="w-28 h-40 rounded-sm shadow-md p-3 flex flex-col justify-between text-white"
              style={{ backgroundColor: pal[0]?.hex || "#111" }}
            >
              <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center text-[7px]">★</div>
              <div className="text-[10px] font-semibold leading-tight">{p.details.visuals.mockupType2}</div>
            </div>
            <div className="w-28 h-36 bg-white rounded-sm shadow-sm p-3 border border-neutral-200 flex flex-col justify-between">
              <span className="text-[8px] font-mono text-neutral-400">SPEC: 02</span>
              <div className="w-8 h-1" style={{ backgroundColor: pal[2]?.hex || p.accentColor }} />
              <span className="text-[9px] font-bold text-neutral-800">{p.title}</span>
            </div>
          </div>
        )}

        {variant === "mockup3" && (
          <div className="w-full max-w-md bg-white/90 backdrop-blur-xs p-6 shadow-sm border border-neutral-200/80 rounded-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: p.accentColor }}>
                ✦
              </div>
              <div>
                <h5 className="text-xs font-bold text-neutral-900">{p.details.visuals.bannerLabel}</h5>
                <p className="text-[10px] text-neutral-500 font-mono">{p.details.visuals.mockupType3}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-100">
              {pal.map((c) => (
                <div key={c.name} className="h-6 rounded-xs" style={{ backgroundColor: c.hex }} title={c.name} />
              ))}
            </div>
          </div>
        )}

        {variant === "mockup4" && (
          <div className="w-full max-w-xs aspect-square bg-white shadow-md p-5 rounded-sm border border-neutral-200 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-neutral-400">IDENTITY SYSTEM</span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accentColor }} />
            </div>
            <div className="text-center my-auto">
              <div
                className="w-16 h-16 mx-auto rounded-full border border-dashed flex items-center justify-center text-lg font-serif italic mb-2"
                style={{ borderColor: pal[0]?.hex || "#111", color: pal[0]?.hex || "#111" }}
              >
                {p.title.slice(0, 1)}
              </div>
              <p className="text-xs font-bold text-neutral-800">{p.details.visuals.mockupType4}</p>
            </div>
            <span className="text-[9px] text-neutral-400 text-center font-mono">BOM.D ARCHIVE</span>
          </div>
        )}

        {variant === "experience" && (
          <div className="w-full max-w-xl text-center py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full text-[10px] font-mono uppercase tracking-widest text-neutral-700 mb-3 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.accentColor }} />
              {p.details.visuals.bannerLabel}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
              {p.title} — {p.englishTitle}
            </h3>
            <p className="mt-2 text-xs md:text-sm text-neutral-600 max-w-md mx-auto">
              {p.tagline}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-3 border-t border-neutral-300/50">
        <span>ARCHIVE REF #{String(p.id).padStart(2, "0")}</span>
        <span>BOM.D STUDIO</span>
      </div>
    </div>
  )
}
