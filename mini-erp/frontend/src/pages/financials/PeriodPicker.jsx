import { PRESETS } from '../../utils/dateRanges'

export default function PeriodPicker({ preset, onChange }) {
  return (
    <div className="mb-4 flex gap-2">
      {PRESETS.map((p) => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            preset === p.key ? 'bg-ledger-500 text-white' : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
