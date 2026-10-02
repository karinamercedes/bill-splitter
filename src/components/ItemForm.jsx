import { useState } from 'react'

const empty = (people) => ({
  name: '', price: '', splitType: 'equal',
  sharedBy: people.map((p) => p.id), // defaults to everyone
  customShares: {},
})

export default function ItemForm({ people, onAdd }) {
  const [item, setItem] = useState(() => empty(people))

  function toggleShared(id) {
    const sharedBy = item.sharedBy.includes(id)
      ? item.sharedBy.filter((x) => x !== id)
      : [...item.sharedBy, id]
    setItem({ ...item, sharedBy })
  }

  function setCustomShare(id, value) {
    setItem({ ...item, customShares: { ...item.customShares, [id]: value } })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!item.name.trim() || !Number(item.price)) return
    onAdd({ ...item, name: item.name.trim(), id: crypto.randomUUID() })
    setItem(empty(people))
  }

  const customTotal = Object.values(item.customShares).reduce((s, v) => s + (Number(v) || 0), 0)

  return (
    <form className="section" onSubmit={handleSubmit}>
      <h2>Add an item</h2>
      <div className="grid">
        <label className="wide">
          Item
          <input value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} placeholder="e.g. Pizza" />
        </label>
        <label>
          Price (£)
          <input type="number" min="0" step="0.01" value={item.price} onChange={(e) => setItem({ ...item, price: e.target.value })} />
        </label>
        <label>
          Split
          <select value={item.splitType} onChange={(e) => setItem({ ...item, splitType: e.target.value })}>
            <option value="equal">Equally</option>
            <option value="custom">Custom amounts</option>
          </select>
        </label>
      </div>

      {item.splitType === 'equal' ? (
        <>
          <p className="label-row">Shared by</p>
          <div className="chips">
            {people.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`chip ${item.sharedBy.includes(p.id) ? 'chip-on' : ''}`}
                onClick={() => toggleShared(p.id)}
                aria-pressed={item.sharedBy.includes(p.id)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="label-row">How much each person had (£)</p>
          <div className="grid">
            {people.map((p) => (
              <label key={p.id}>
                {p.name}
                <input
                  type="number" min="0" step="0.01"
                  value={item.customShares[p.id] ?? ''}
                  onChange={(e) => setCustomShare(p.id, e.target.value)}
                />
              </label>
            ))}
          </div>
          {Number(item.price) > 0 && (
            <p className={`muted ${customTotal.toFixed(2) !== Number(item.price).toFixed(2) ? 'warn' : ''}`}>
              Entered so far: £{customTotal.toFixed(2)} of £{Number(item.price).toFixed(2)}
            </p>
          )}
        </>
      )}

      <button type="submit" className="primary" disabled={people.length === 0}>Add item</button>
    </form>
  )
}
