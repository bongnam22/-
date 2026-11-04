import React, { useState, useEffect } from "react"
import { Lock, X, AlertCircle, ShieldAlert } from "lucide-react"
import { verifyAdminPassword, checkLockoutStatus } from "../data/storage"

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [lockout, setLockout] = useState<{ isLocked: boolean; remainingSec: number }>({
    isLocked: false,
    remainingSec: 0,
  })

  useEffect(() => {
    if (!isOpen) return
    const status = checkLockoutStatus()
    setLockout(status)
    setPassword("")
    setErrorMsg(null)
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const currentLock = checkLockoutStatus()
    if (currentLock.isLocked) {
      setLockout(currentLock)
      setErrorMsg(`비밀번호 연속 오류로 인해 ${currentLock.remainingSec}초 후 다시 시도할 수 있습니다.`)
      return
    }

    if (verifyAdminPassword(password)) {
      setErrorMsg(null)
      setPassword("")
      onSuccess()
    } else {
      const updatedLock = checkLockoutStatus()
      setLockout(updatedLock)
      setPassword("")
      if (updatedLock.isLocked) {
        setErrorMsg("비밀번호 5회 연속 오류로 인해 5분간 로그인이 제한됩니다.")
      } else {
        setErrorMsg("비밀번호가 일치하지 않습니다. 다시 확인해주세요.")
      }
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
            {lockout.isLocked ? <ShieldAlert size={22} className="text-red-600" /> : <Lock size={20} />}
          </div>

          <h3 className="text-xl font-bold tracking-tight text-neutral-900 font-serif italic">
            Admin Access
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            관리자 전용 로그인 공간입니다. 등록된 관리자 비밀번호를 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
              Admin Password
            </label>
            <input
              type="password"
              autoFocus
              disabled={lockout.isLocked}
              maxLength={20}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrorMsg(null)
              }}
              className={`w-full px-3.5 py-2.5 text-center text-base tracking-widest bg-neutral-50 border rounded-xs font-mono focus:outline-hidden transition-all ${
                errorMsg
                  ? "border-red-500 bg-red-50/40 text-red-700"
                  : "border-neutral-300 focus:border-neutral-900 bg-white"
              } disabled:opacity-50`}
            />
            {errorMsg && (
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-red-600 mt-2 font-mono text-center">
                <AlertCircle size={12} className="shrink-0" /> {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={lockout.isLocked || !password}
            className="w-full py-2.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-widest rounded-xs hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-xs"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
          <span className="text-[10px] font-mono text-neutral-400">
            bom.d Portfolio CMS · Authorized Personnel Only
          </span>
        </div>
      </div>
    </div>
  )
}
