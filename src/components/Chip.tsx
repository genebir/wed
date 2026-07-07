interface ChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

export function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors ${
        selected
          ? 'bg-ink font-semibold text-white'
          : 'bg-white text-muted shadow-sm hover:text-ink'
      }`}
    >
      {label}
    </button>
  )
}
