import React from "react"

export interface MotifOption {
  id: string
  name: string
  label: string
  category?: string
}

export const MOTIF_OPTIONS: MotifOption[] = [
  { id: "star", name: "Star (시그니처 스타)", label: "✦" },
  { id: "wave", name: "Wave (파도/파동)", label: "〰" },
  { id: "orbit", name: "Orbit (행성 궤도)", label: "🪐" },
  { id: "sun", name: "Sun (태양/광채)", label: "☀" },
  { id: "sparkle", name: "Sparkle (반짝임/스파클)", label: "✹" },
  { id: "compass", name: "Compass (나침반/방향)", label: "🧭" },
  { id: "diamond", name: "Diamond (다이아몬드/보석)", label: "◈" },
  { id: "flower", name: "Flower (꽃/유기적 꽃잎)", label: "✿" },
  { id: "mountain", name: "Mountain (산등성이/봉우리)", label: "▲" },
  { id: "flame", name: "Flame (불꽃/에너지)", label: "⚡" },
  { id: "drop", name: "Drop (물방울/자연)", label: "💧" },
  { id: "moon", name: "Moon (초승달/사색)", label: "🌙" },
  { id: "cube", name: "Cube (공간/입체)", label: "⬡" },
  { id: "eye", name: "Eye (시선/관점)", label: "👁" },
  { id: "cross", name: "Cross (크로스/좌표)", label: "✚" },
  { id: "heart", name: "Heart (감성/마음)", label: "♥" },
]

interface MotifIconProps {
  name?: string
  size?: number
  className?: string
  color?: string
}

export function MotifIcon({
  name = "star",
  size = 64,
  className = "",
  color = "currentColor",
}: MotifIconProps) {
  // If user entered a custom single character or emoji
  if (name && name.length <= 2 && !MOTIF_OPTIONS.some((opt) => opt.id === name)) {
    return (
      <span
        style={{ fontSize: size * 0.85, lineHeight: 1 }}
        className={`inline-block select-none ${className}`}
      >
        {name}
      </span>
    )
  }

  // If user provided an image URL for the motif
  if (name && (name.startsWith("data:image") || name.startsWith("http") || name.startsWith("/"))) {
    return (
      <img
        src={name}
        alt="Motif Icon"
        style={{ width: size, height: size }}
        className={`object-contain ${className}`}
      />
    )
  }

  const iconSize = size

  switch (name) {
    case "wave":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
        >
          <path
            d="M8 24C16 16 24 32 32 24C40 16 48 32 56 24M8 40C16 32 24 48 32 40C40 32 48 48 56 40"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

    case "orbit":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
        >
          <circle cx="32" cy="32" r="14" fill={color} />
          <ellipse
            cx="32"
            cy="32"
            rx="28"
            ry="9"
            transform="rotate(-28 32 32)"
            stroke={color}
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
        </svg>
      )

    case "sun":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
        >
          <circle cx="32" cy="32" r="13" fill={color} />
          <path
            d="M32 6V12M32 52V58M6 32H12M52 32H58M14 14L18 18M46 46L50 50M14 50L18 46M46 18L50 14"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )

    case "sparkle":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill={color}
          className={className}
        >
          <path d="M32 4L36 24L56 20L40 32L56 44L36 40L32 60L28 40L8 44L24 32L8 20L28 24Z" />
        </svg>
      )

    case "compass":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
        >
          <circle cx="32" cy="32" r="26" stroke={color} strokeWidth="2.5" />
          <polygon points="32,12 38,32 32,28 26,32" fill={color} />
          <polygon points="32,52 38,32 32,36 26,32" fill={color} opacity="0.4" />
          <circle cx="32" cy="32" r="3" fill={color} />
        </svg>
      )

    case "diamond":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
        >
          <path
            d="M32 6L58 32L32 58L6 32Z"
            stroke={color}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M32 16L48 32L32 48L16 32Z"
            fill={color}
            opacity="0.3"
          />
        </svg>
      )

    case "flower":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill={color}
          className={className}
        >
          <circle cx="32" cy="20" r="10" />
          <circle cx="32" cy="44" r="10" />
          <circle cx="20" cy="32" r="10" />
          <circle cx="44" cy="32" r="10" />
          <circle cx="32" cy="32" r="8" fill="#ffffff" />
          <circle cx="32" cy="32" r="4" fill={color} />
        </svg>
      )

    case "mountain":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
        >
          <path
            d="M6 52L26 16L38 34L44 26L58 52H6Z"
            stroke={color}
            strokeWidth="3"
            strokeLinejoin="round"
            fill={color}
            fillOpacity="0.15"
          />
          <path
            d="M26 16L32 26L26 30L20 26Z"
            fill={color}
          />
        </svg>
      )

    case "flame":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill={color}
          className={className}
        >
          <path d="M34 4C34 16 46 22 46 36C46 47 38 56 28 56C18 56 12 48 12 38C12 28 20 18 24 10C24 18 28 22 34 4Z" />
          <path
            d="M28 32C28 38 32 42 32 48C32 50 30 52 28 52C25 52 22 49 22 45C22 40 25 36 28 32Z"
            fill="#ffffff"
          />
        </svg>
      )

    case "drop":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill={color}
          className={className}
        >
          <path d="M32 6C32 6 14 28 14 40C14 50 22 58 32 58C42 58 50 50 50 40C50 28 32 6 32 6Z" />
          <ellipse cx="26" cy="40" rx="4" ry="8" fill="#ffffff" opacity="0.4" />
        </svg>
      )

    case "moon":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill={color}
          className={className}
        >
          <path d="M46 36C46 50 34 58 22 58C16 58 12 56 8 52C24 52 36 40 36 24C36 14 30 8 24 4C36 6 46 18 46 36Z" />
        </svg>
      )

    case "cube":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinejoin="round"
          className={className}
        >
          <polygon points="32,6 56,20 56,48 32,62 8,48 8,20" />
          <line x1="32" y1="6" x2="32" y2="36" />
          <line x1="32" y1="36" x2="56" y2="48" />
          <line x1="32" y1="36" x2="8" y2="48" />
        </svg>
      )

    case "eye":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          className={className}
        >
          <path d="M6 32C14 18 50 18 58 32C50 46 14 46 6 32Z" />
          <circle cx="32" cy="32" r="9" fill={color} />
          <circle cx="34" cy="30" r="3" fill="#ffffff" />
        </svg>
      )

    case "cross":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill={color}
          className={className}
        >
          <path d="M26 6H38V26H58V38H38V58H26V38H6V26H26V6Z" />
        </svg>
      )

    case "heart":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill={color}
          className={className}
        >
          <path d="M32 54L28 50C14 38 6 30 6 20C6 11 13 4 22 4C27 4 31 7 32 10C33 7 37 4 42 4C51 4 58 11 58 20C58 30 50 38 36 50L32 54Z" />
        </svg>
      )

    case "star":
    default:
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 20 20"
          fill={color}
          className={className}
        >
          <path d="M10 0.5C10.55 7.25 12.75 9.45 19.5 10C12.75 10.55 10.55 12.75 10 19.5C9.45 12.75 7.25 10.55 0.5 10C7.25 9.45 9.45 7.25 10 0.5Z" />
        </svg>
      )
  }
}
