import React, { useState } from "react"
import { Lock, X, AlertCircle } from "lucide-react"
import { ADMIN_PASSWORD } from "../data/storage"

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setError(false)
      setPassword("")
      onSuccess()
    } else {
      setError(true)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full bg-white rounded-sm shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4 border border-neutral-200">
            <Lock size={20} />
          </div>

          <h3 className="text-xl font-bold tracking-tight text-neutral-900 font-serif italic">
            Admin Access
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            포트폴리오 관리자 모드로 전환하려면 비밀번호를 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
              Password (비밀번호)
            </label>
            <input
              type="password"
              autoFocus
              maxLength={10}
              placeholder="••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              className={`w-full px-3.5 py-2.5 text-center text-base tracking-widest bg-neutral-50 border rounded-xs font-mono focus:outline-hidden transition-all ${
                error
                  ? "border-red-500 bg-red-50/40 text-red-700"
                  : "border-neutral-300 focus:border-neutral-900 bg-white"
              }`}
            />
            {error && (
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-red-600 mt-2 font-mono">
                <AlertCircle size={12} /> 비밀번호가 올바르지 않습니다. (기본: 4238)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-widest rounded-xs hover:bg-neutral-800 transition-colors shadow-xs"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
          <span className="text-[10px] font-mono text-neutral-400">
            Kim Bom Portfolio CMS · Password: 4238
          </span>
        </div>
      </div>
    </div>
  )
}
