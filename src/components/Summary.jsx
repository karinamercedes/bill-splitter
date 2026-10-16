export default function Summary({ result }) {
  if (!result || result.perPerson.length === 0) return null

  return (
    <section className="section">
      <h2><span className="accent-word">Who</span> owes <span className="accent-word">what</span></h2>
      <ul className="summary-list">
        {result.perPerson.map((p) => (
          <li key={p.id}>
            <span>{p.name}</span>
            <strong>£{p.owed}</strong>
          </li>
        ))}
      </ul>
      <div className="summary-total">
        <span>Subtotal £{result.subtotal} + tax/tip £{result.taxTip}</span>
        <strong><span className="accent-word">Total</span> £{result.billTotal}</strong>
      </div>
      {!result.reconciled && (
        <p className="error" role="alert">Something doesn't add up -- please check the amounts entered.</p>
      )}
    </section>
  )
}
