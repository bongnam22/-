import React, { useEffect } from "react"
import { X } from "lucide-react"

interface LightboxProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function Lightbox({ isOpen, onClose, title, subtitle, children }: LightboxProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-sm overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div>
            <h4 className="text-sm font-semibold tracking-tight text-neutral-900">{title}</h4>
            {subtitle && <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-200/60 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content area */}
        <div className="overflow-auto max-h-[calc(90vh-70px)] p-4 md:p-8 flex items-center justify-center bg-neutral-100">
          {children}
        </div>
      </div>
    </div>
  )
}
