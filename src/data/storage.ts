import { projects as defaultProjects, Project, Category } from "./projects"

export interface AboutData {
  headline: string
  subhead: string
  leadKo: string
  experience: Array<{ title: string; period: string; desc: string }>
  education: Array<{ degree: string; school: string }>
  skills: {
    certificates: string[]
    core: string[]
  }
  software: string[]
  interests: Array<{ icon: string; name: string; tooltip: string }>
  philosophy: string
  location: string
  locationCoords: string
}

export interface SiteContactData {
  email: string
  instagram: string
  behance: string
  locationText: string
  coordsText: string
}

export interface InquiryMessage {
  id: string
  name: string
  email: string
  projectType: string
  message: string
  date: string
  read: boolean
}

export const defaultAboutData: AboutData = {
  headline: "Ideas in orbit,\nstories in form.",
  subhead: "About me",
  leadKo:
    "안녕하세요. 브랜드의 고유한 이야기를 발견하고, 선명한 시각 언어로 연결하는 그래픽 & 브랜드 디자이너 김봄입니다. 부산을 거점으로 다양한 클라이언트와 협업하며 온·오프라인 경계를 넘나드는 정교하고 감각적인 시각 경험을 만듭니다.",
  experience: [
    {
      title: "Freelance Designer",
      period: "2023 — Present · Busan / Seoul",
      desc: "브랜드 아이덴티티, 전시 그래픽 및 로컬 축제 프로모션 총괄",
    },
    {
      title: "Studio B, Brand Designer",
      period: "2021 — 2023",
      desc: "F&B 브랜딩, 패키지 지기구조 및 키비주얼 시스템 구축",
    },
    {
      title: "Design Intern, Cultural Lab",
      period: "2020 — 2021",
      desc: "포스터 디자인, 인쇄 감리 및 오프라인 전시 사이니지 보조",
    },
  ],
  education: [
    {
      degree: "Visual Communication Design (시각디자인학 학사)",
      school: "Dongseo University, 2021",
    },
  ],
  skills: {
    certificates: ["GTQ Graphic Technology 1급", "시각디자인기사 자격증"],
    core: ["Brand Identity", "Editorial & Print", "Campaign Art Direction", "Packaging Structure"],
  },
  software: [
    "Illustrator (Ai)",
    "Photoshop (Ps)",
    "InDesign (Id)",
    "After Effects (Ae)",
    "Figma",
    "Blender 3D",
  ],
  interests: [
    { icon: "◯", name: "Space", tooltip: "Cosmic geometry & starry skies" },
    { icon: "⌁", name: "Sea", tooltip: "Busan coast & coastal waves" },
    { icon: "♬", name: "Music", tooltip: "Ambient & city pop vinyls" },
    { icon: "△", name: "Camping", tooltip: "Wild camping & campfire" },
  ],
  philosophy: "본질을 해치지 않는 절제된 형태미와 마음을 끄는 디테일의 조화",
  location: "Busan, South Korea",
  locationCoords: "35.1796° N, 129.0756° E",
}

export const defaultContactData: SiteContactData = {
  email: "hello@kimbom.design",
  instagram: "@bom.design",
  behance: "behance.net/kimbom",
  locationText: "Busan, South Korea",
  coordsText: "35.1796° N, 129.0756° E",
}

const STORAGE_KEY_PROJECTS = "kimbom_portfolio_projects_v2"
const STORAGE_KEY_ABOUT = "kimbom_portfolio_about_v2"
const STORAGE_KEY_CONTACT = "kimbom_portfolio_contact_v2"
const STORAGE_KEY_ADMIN_PWD = "kimbom_admin_pwd_custom"
const STORAGE_KEY_FAILED_ATTEMPTS = "kimbom_admin_failed_attempts"
const STORAGE_KEY_INQUIRIES = "kimbom_portfolio_inquiries_v2"
const STORAGE_KEY_ADMIN_AUTH = "kimbom_admin_auth_v2"
const DEFAULT_PASSWORD = "4238"

export function getAdminPassword(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ADMIN_PWD)
    if (saved && saved.trim().length > 0) return saved
  } catch {}
  return DEFAULT_PASSWORD
}

export function setAdminPassword(newPassword: string): boolean {
  if (!newPassword || newPassword.trim().length < 4) return false
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN_PWD, newPassword.trim())
    return true
  } catch {
    return false
  }
}

export function checkLockoutStatus(): { isLocked: boolean; remainingSec: number } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_FAILED_ATTEMPTS)
    if (!raw) return { isLocked: false, remainingSec: 0 }
    const { count, lockUntil } = JSON.parse(raw)
    const now = Date.now()
    if (lockUntil && now < lockUntil) {
      return { isLocked: true, remainingSec: Math.ceil((lockUntil - now) / 1000) }
    }
  } catch {}
  return { isLocked: false, remainingSec: 0 }
}

export function recordFailedAttempt(): { isLocked: boolean; attemptsLeft: number } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_FAILED_ATTEMPTS)
    let count = 0
    if (raw) {
      count = JSON.parse(raw).count || 0
    }
    count += 1
    if (count >= 5) {
      const lockUntil = Date.now() + 5 * 60 * 1000 // 5 minutes lockout
      sessionStorage.setItem(
        STORAGE_KEY_FAILED_ATTEMPTS,
        JSON.stringify({ count, lockUntil })
      )
      return { isLocked: true, attemptsLeft: 0 }
    } else {
      sessionStorage.setItem(
        STORAGE_KEY_FAILED_ATTEMPTS,
        JSON.stringify({ count, lockUntil: 0 })
      )
      return { isLocked: false, attemptsLeft: 5 - count }
    }
  } catch {}
  return { isLocked: false, attemptsLeft: 3 }
}

export function resetFailedAttempts(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY_FAILED_ATTEMPTS)
  } catch {}
}

export function verifyAdminPassword(input: string): boolean {
  const currentPwd = getAdminPassword()
  const isValid = input.trim() === currentPwd
  if (isValid) {
    resetFailedAttempts()
  } else {
    recordFailedAttempt()
  }
  return isValid
}

// Projects storage
export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => {
          const def = defaultProjects.find((d) => d.id === p.id)
          return {
            ...p,
            details: {
              ...p.details,
              motifIcon: p.details?.motifIcon || def?.details.motifIcon || "star",
            },
          }
        })
      }
    }
  } catch (e) {
    console.error("Failed to load projects from localStorage", e)
  }
  return defaultProjects
}

export function saveProjects(data: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(data))
  } catch (e) {
    console.error("Failed to save projects to localStorage", e)
  }
}

export function resetProjects(): Project[] {
  saveProjects(defaultProjects)
  return defaultProjects
}

// About storage
export function loadAboutData(): AboutData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ABOUT)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error("Failed to load about data from localStorage", e)
  }
  return defaultAboutData
}

export function saveAboutData(data: AboutData): void {
  try {
    localStorage.setItem(STORAGE_KEY_ABOUT, JSON.stringify(data))
  } catch (e) {
    console.error("Failed to save about data to localStorage", e)
  }
}

// Contact storage
export function loadContactData(): SiteContactData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONTACT)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error("Failed to load contact data from localStorage", e)
  }
  return defaultContactData
}

export function saveContactData(data: SiteContactData): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(data))
  } catch (e) {
    console.error("Failed to save contact data to localStorage", e)
  }
}

// Inquiries storage
export function loadInquiries(): InquiryMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INQUIRIES)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error("Failed to load inquiries from localStorage", e)
  }
  return [
    {
      id: "demo-inq-1",
      name: "이도현 (스튜디오 파도)",
      email: "dohyun@studiopado.kr",
      projectType: "Branding",
      message:
        "안녕하세요 김봄 디자이너님, 부산 로컬 라이프스타일 브랜드 런칭을 준비하고 있어 BI 및 패키지 개발 견적과 일정 문의드립니다.",
      date: "2025-05-12 14:30",
      read: true,
    },
    {
      id: "demo-inq-2",
      name: "Sarah Jenkins (Creative Director)",
      email: "sarah.j@aperture-culture.com",
      projectType: "Promotion",
      message:
        "Hi Kim Bom! Loved your work on the KAISO Campaign. We are organizing a graphic art biennial in Seoul next spring and would love to invite you for the main poster visual.",
      date: "2025-05-14 09:15",
      read: false,
    },
  ]
}

export function saveInquiry(inquiry: Omit<InquiryMessage, "id" | "date" | "read">): void {
  const current = loadInquiries()
  const newEntry: InquiryMessage = {
    ...inquiry,
    id: `inq-${Date.now()}`,
    date: new Date().toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: false,
  }
  const updated = [newEntry, ...current]
  try {
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated))
  } catch (e) {
    console.error("Failed to save inquiry to localStorage", e)
  }
}

export function deleteInquiry(id: string): InquiryMessage[] {
  const current = loadInquiries()
  const updated = current.filter((item) => item.id !== id)
  try {
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated))
  } catch (e) {
    console.error("Failed to delete inquiry from localStorage", e)
  }
  return updated
}

// Admin Auth storage
export function checkAdminAuth(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === "authenticated"
  } catch (e) {
    return false
  }
}

export function setAdminAuth(authenticated: boolean): void {
  try {
    if (authenticated) {
      localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, "authenticated")
    } else {
      localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH)
    }
  } catch (e) {
    console.error("Failed to update admin auth in localStorage", e)
  }
}
