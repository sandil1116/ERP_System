# ERP System

**Phase 1:** Auth, Roles, Layout, Dark/Light Mode
**Phase 2:** Inventory/Products, Customers, Suppliers, Sales (POS + History), Purchases, Printable Invoices
**Phase 3:** Financials — Profit & Loss, Cash Flow, Account Balances, Expenses, Double-Entry Ledger
**Phase 4:** Employees & Payroll — records, loans/advances, automated deduction payroll runs

One project throughout — same login, same JWT, same layout shell, same
Modal/RowActions/TabBar patterns. Phase 4's payroll writes to the exact
same `ledger` collection Sales/Purchases/Expenses have been using since
Phase 2, so Financials (Phase 3) picks up salary costs automatically with
no changes needed there beyond one aggregation line.

```
mini-erp/
├── backend/     Spring Boot + MongoDB (Java 17)
└── frontend/    React + Vite + Tailwind CSS
```

## What's included (cumulative)

**Phase 1** — JWT login, first-run Admin setup, role-based access, Admin-only
User Management, dark/light mode saved to the user's profile.

**Phase 2** — Inventory (low-stock alerts), Customers (credit + Record
Payment), Suppliers (payable + Mark as Paid), New Sale (POS), Sales
History, New Purchase, Purchase History, printable Invoices.

**Phase 3** — Profit & Loss, Cash Flow, Account Balances, Expenses,
Ledger — all built by reading the `ledger` collection, not by manual entry.
Dashboard shows real live numbers.

**Phase 4**
- **Employees** — name, job title, contact, base salary, active/inactive
- **Loans & Advances** (per employee, via a "Loans" button on each row) —
  give a **Loan** (custom installment amount + weekly/monthly frequency)
  or an **Advance** (deducted in full on the next payroll run). The cash
  leaves the business immediately and is logged to the ledger the moment
  it's given — repayment via payroll doesn't create a second cash entry,
  since that money was already counted as paid out.
- **Payroll Run** — preview shows every active employee's base salary,
  automatically-calculated loan deduction, and net pay, all *before* you
  commit to anything. Confirming pays everyone in one action: writes one
  "Salary paid" ledger entry per employee (for the net amount) and reduces
  each active loan's remaining balance by the installment — marking it
  **Settled** once it hits zero. Deduction is capped so pay can never go
  negative. Full payroll history is kept.
- **Financials integration** — salary payments now count as a labor cost
  in Profit & Loss; loan/advance disbursements show up in Cash Flow (real
  money leaving) but are correctly excluded from P&L expenses (they're a
  receivable, not a cost, until proven otherwise).

## Role permissions in Phase 4

Employees & Payroll is **Admin only**, per the original design doc —
Cashier and Staff don't see this module at all.

## Running it locally

### 1. MongoDB
```bash
docker run -d -p 27017:27017 --name mini-erp-mongo mongo:7
```

### 2. Backend
```bash
cd backend
mvn spring-boot:run
```
Runs on **http://localhost:8080**. Replace `jwt.secret` in
`application.yml` before real use.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on **http://localhost:5173**.

### 4. Trying the loan-deduction flow
1. Add an employee under **Employees & Payroll → Employees**, e.g. base
   salary LKR 30,000.
2. Click the 🏦 icon on their row → give them a **Loan**: LKR 100,000,
   installment LKR 5,000, Monthly.
3. Go to **Payroll Run** — you'll see their net pay already shows
   LKR 25,000 (30,000 − 5,000 deduction), calculated automatically.
4. Click **Run payroll**. Check the employee's Loans modal again — the
   balance dropped to LKR 95,000. Run it 20 times (or adjust the
   installment) and watch it hit **Settled**.
5. Check **Financials → Profit & Loss** — the salary payment is now
   included as an expense for that period.

## API reference (new in Phase 4)

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET/POST | `/api/employees` | Admin | List / create employee |
| PUT/DELETE | `/api/employees/{id}` | Admin | Edit / soft-delete employee |
| GET | `/api/employee-loans?employeeId=` | Admin | List an employee's loans/advances |
| POST | `/api/employee-loans` | Admin | Give a loan or advance |
| GET | `/api/payroll/preview` | Admin | See what a payroll run would pay right now |
| POST | `/api/payroll/run` | Admin | Actually run payroll (pays everyone, applies deductions) |
| GET | `/api/payroll/history` | Admin | Past payroll runs |

(Phase 1, 2 & 3 endpoints are unchanged — see earlier sections above.)

## What's next

The core system design doc is now fully built (Phases 1-4 cover every
module from Sections A-E). From here, natural next steps are the
"suggested enhancements" from the design doc — audit trail, payment
reminders for overdue credit, dashboard charts, data export, or barcode
support — whichever would help your shop most. Just let me know.

start 5-8
GIT_AUTHOR_DATE="2026-07-12 10:00:00" GIT_COMMITTER_DATE="2026-07-12 11:00:00" git commit -m "Introduction about the system and instruction to use (Clone)"
