/** Simple in-page tab switcher used inside the Sales and Purchases modules,
 *  which each bundle a few closely-related pages (New / History / Directory). */
export default function TabBar({ tabs, active, onChange }) {
  return (
    <div className="mb-5 flex gap-1 border-b border-slate-200 dark:border-slate-700/60">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            active === tab.key
              ? 'border-ledger-500 text-ledger-600 dark:text-ledger-300'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
