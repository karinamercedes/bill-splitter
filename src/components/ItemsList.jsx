export default function ItemsList({ items, people, onRemove }) {
  if (items.length === 0) return <p className="empty">No items yet. Add your first one above.</p>
  const byId = new Map(people.map((p) => [p.id, p.name]))

  return (
    <ul className="items-list">
      {items.map((item) => (
        <li key={item.id}>
          <div>
            <strong>{item.name}</strong>
            <span className="muted">
              £{Number(item.price).toFixed(2)} ·{' '}
              {item.splitType === 'equal'
                ? item.sharedBy.map((id) => byId.get(id)).join(', ') || 'everyone'
                : 'custom split'}
            </span>
          </div>
          <button type="button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}>Remove</button>
        </li>
      ))}
    </ul>
  )
}
