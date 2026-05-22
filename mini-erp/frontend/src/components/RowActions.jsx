import { Eye, Pencil, Trash2 } from 'lucide-react'

/**
 * The reusable "Edit / Delete / View" action cluster used on every table
 * row across every module (Users, Customers, Products, Sales, etc).
 * Keeping it as one component means the edit pattern looks and behaves
 * identically everywhere in the app.
 */
export default function RowActions({ onView, onEdit, onDelete, deleteLabel = 'Deactivate' }) {
  return (
    <div className="flex items-center justify-end gap-1">
      {onView && (
        <button className="icon-btn" title="View details" onClick={onView}>
          <Eye size={16} />
        </button>
      )}
      {onEdit && (
        <button className="icon-btn" title="Edit" onClick={onEdit}>
          <Pencil size={16} />
        </button>
      )}
      {onDelete && (
        <button className="icon-btn hover:!bg-rust-500/10 hover:!text-rust-500" title={deleteLabel} onClick={onDelete}>
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}
