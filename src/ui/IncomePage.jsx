import { useState, useSyncExternalStore } from 'react'
import { incomeViewModel } from '../viewmodel/incomeViewModel.js'
import { downloadIncomeJson } from '../utils/download.js'
import { downloadIncomePdf } from '../utils/pdf.js'

const money = (value) => `$${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`

function IncomeForm({ state }) {
  const submit = (event) => {
    event.preventDefault()
    incomeViewModel.calculate()
  }

  return <form className="income-form" onSubmit={submit} noValidate>
    {[['personA', 'Person A'], ['personB', 'Person B'], ['extraIn', 'Extra income']].map(([name, label]) => <label key={name}>
      <span>{label}</span>
      <input name={name} type="number" min="0" step="100" value={state.values[name]} onChange={(event) => incomeViewModel.changeField(name, event.target.value)} placeholder="$0" aria-invalid={Boolean(state.errors[name])} />
      {state.errors[name] && <small className="field-error">{state.errors[name]}</small>}
    </label>)}
    <button className="primary-button" type="submit">Calculate <span>→</span></button>
  </form>
}

function FormulaCard({ number, title, explanation, formula, example, children, wide = false }) {
  const [open, setOpen] = useState(false)

  return <article className={`result-card formula-card ${wide ? 'wide' : ''}`}>
    <div className="formula-heading"><span className="formula-number">{number}</span><div><span className="result-title">{title}</span><button className={`info-button ${open ? 'active' : ''}`} type="button" aria-label={`Show explanation for ${title}`} onClick={() => setOpen((current) => !current)}>i</button></div></div>
    {open && <div className="formula-explanation"><b>Explanation</b><p>{explanation}</p><b>Formula</b><p>{formula}</p><b>Example</b><p>{example}</p></div>}
    {children}
  </article>
}

function IncomePage() {
  const state = useSyncExternalStore(incomeViewModel.subscribe, incomeViewModel.getSnapshot, incomeViewModel.getSnapshot)
  const { summary } = state

  return <main className="page-shell">
    <nav className="top-nav" aria-label="Finance sections">{['Income', 'Assets', 'Debts', 'Expenses'].map((item, index) => <a className={index === 0 ? 'active' : ''} href={`#${item.toLowerCase()}`} key={item}>{item}{index > 0 && <small>soon</small>}</a>)}</nav>
    <header className="page-header"><h1>Income</h1>
    {/* <span className="saved-count">{state.savedCount}</span> */}
    </header>
    <section className="income-panel" id="income"><IncomeForm state={state} /></section>
    <section className="results-panel" aria-live="polite">
      <div className="results-header"><h2>Results</h2>{summary && <div className="export-actions"><button title="Download JSON" aria-label="Download JSON" onClick={() => downloadIncomeJson(summary)}>↓ JSON</button><button title="Download PDF" aria-label="Download PDF" onClick={() => downloadIncomePdf(summary)}>↓ PDF</button></div>}</div>
      <div className="results-grid">
        <FormulaCard number="01" title="Each person's own income" explanation="Add up every income line owned by that person alone. Anything marked joint is kept apart." formula="Add up every income line owned by that person alone. Anything marked joint is kept apart." example="Person A: $3,550 a fortnight × 26, plus a $6,000 bonus = $98,300"><strong>{summary ? money(summary.ownA) : '—'}</strong><small>Person A</small><strong>{summary ? money(summary.ownB) : '—'}</strong><small>Person B</small></FormulaCard>
        <FormulaCard number="02" title="Joint income" explanation="Add up every income line owned by that person alone. Anything marked joint is kept apart." formula="joint = total in − own A − own B" example="Total income in: $10,000 − Person A's income: $4,300 − Person B's income: $2,500 = Joint income remaining: $3,200"><strong>{summary ? money(summary.joint) : '—'}</strong><small>Joint income</small></FormulaCard>
        <FormulaCard number="03" title="Total money in" explanation="All three (each person's income and joint income) added together." formula="in = own A + own B + joint" example="$98,300 + $71,500 + $3,200 = $173,000"><strong>{summary ? money(summary.total) : '—'}</strong><small>Total income</small></FormulaCard>
        <FormulaCard number="04" title="Each person's share" explanation="Own income divided by both own incomes. If neither has personal income it falls back to half each; for a single person it is all of it." formula="share = own ÷ (own A + own B)" example="$98,300 ÷ ($98,300 + $71,500) = 57.9% Person A, 42.1% Person B"><div className="share-values"><strong>{summary ? `${summary.shares.personA.toFixed(1)}%` : '—'}</strong><small>Person A</small><strong>{summary ? `${summary.shares.personB.toFixed(1)}%` : '—'}</strong><small>Person B</small></div></FormulaCard>
      </div>
    </section>
    <section className="future-grid">{['Assets', 'Debts', 'Expenses'].map((section) => <article id={section.toLowerCase()} className="future-panel" key={section}><h2>{section}</h2><span>Coming soon</span></article>)}</section>
  </main>
}

export default IncomePage
