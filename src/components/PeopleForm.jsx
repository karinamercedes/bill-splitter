import { useState } from 'react'

export default function PeopleForm({ people, onAdd, onRemove }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setName('')
  }

  return (
    <section className="section">
      <h2>Who's splitting?</h2>
      <form className="row" onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a name" />
        <button type="submit" className="primary">Add</button>
      </form>
      {people.length > 0 && (
        <ul className="people-list">
          {people.map((p) => (
            <li key={p.id}>
              <span>{p.name}</span>
              <button type="button" className="link-reset" onClick={() => onRemove(p.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
