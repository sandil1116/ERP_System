import { Printer } from 'lucide-react'
import Modal from './Modal'

/**
 * Printable invoice, generated at view-time from the sale record - not a
 * separately-stored document, so it always reflects the latest data even
 * if a sale is later corrected (see design doc, page "Invoice View/Print").
 */
export default function InvoiceView({ sale, onClose }) {
  if (!sale) return null

  return (
    <Modal title="Invoice" onClose={onClose}>
      <div id="invoice-print-area">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-slate-800 dark:text-slate-100">Mini ERP</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sales Invoice</p>
          </div>
          <div className="text-right text-xs text-slate-500 dark:text-slate-400">
            <p>{new Date(sale.createdAt).toLocaleString()}</p>
            <p className="figure">#{sale.id.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        <div className="mb-4 rounded-card border border-dashed border-slate-300 p-3 text-sm dark:border-slate-600">
          <p className="text-slate-500 dark:text-slate-400">Billed to</p>
          <p className="font-medium text-slate-800 dark:text-slate-100">{sale.customerName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Served by {sale.staffName}</p>
        </div>

        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
            <tr>
              <th className="pb-2 text-left font-medium">Item</th>
              <th className="pb-2 text-right font-medium">Qty</th>
              <th className="pb-2 text-right font-medium">Price</th>
              <th className="pb-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="figure">
            {sale.items.map((item, idx) => (
              <tr key={idx} className="border-t border-slate-100 dark:border-slate-800">
                <td className="py-1.5 font-sans">{item.productName}</td>
                <td className="py-1.5 text-right">{item.quantity}</td>
                <td className="py-1.5 text-right">{item.unitPrice.toFixed(2)}</td>
                <td className="py-1.5 text-right">{item.lineTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 dark:border-slate-700">
          <span className="font-medium text-slate-700 dark:text-slate-200">
            Payment: <span className={sale.paymentType === 'CASH' ? 'text-ledger-600 dark:text-ledger-300' : 'text-amber-500'}>{sale.paymentType}</span>
          </span>
          <span className="figure text-lg font-semibold text-slate-800 dark:text-slate-100">
            LKR {sale.total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2 print:hidden">
        <button className="btn-secondary" onClick={onClose}>Close</button>
        <button className="btn-primary" onClick={() => window.print()}>
          <Printer size={16} /> Print
        </button>
      </div>
    </Modal>
  )
}
