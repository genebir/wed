interface ProgressBarProps {
  /** 0~100 */
  percent: number
  className?: string
}

export function ProgressBar({ percent, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-beige-100 ${className}`}>
      <div
        className="h-full rounded-full bg-blush-400 transition-all duration-700 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
