export default function TaxTip({ taxTip, onChange }) {
  return (
    <section className="section">
      <h2>Tax &amp; <span className="accent-word">tip</span></h2>
      <p className="muted">Shared proportionally -- whoever ordered more pays a bit more of it.</p>
      <div className="grid">
        <label>
          Percentage (%)
          <input type="number" min="0" step="0.5" value={taxTip.percent}
            onChange={(e) => onChange({ ...taxTip, percent: e.target.value })} />
        </label>
        <label>
          Fixed amount (£)
          <input type="number" min="0" step="0.01" value={taxTip.fixed}
            onChange={(e) => onChange({ ...taxTip, fixed: e.target.value })} />
        </label>
      </div>
    </section>
  )
}
