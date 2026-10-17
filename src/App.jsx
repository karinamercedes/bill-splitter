import { useMemo } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import useScrollToHash from './hooks/useScrollToHash'
import PeopleForm from './components/PeopleForm'
import ItemForm from './components/ItemForm'
import ItemsList from './components/ItemsList'
import TaxTip from './components/TaxTip'
import Summary from './components/Summary'
import { calculateSplit } from './utils/split'

export default function App() {
  useScrollToHash()
  const [people, setPeople] = useLocalStorage('bs-people', [])
  const [items, setItems] = useLocalStorage('bs-items', [])
  const [taxTip, setTaxTip] = useLocalStorage('bs-taxtip', { percent: '', fixed: '' })

  function addPerson(name) {
    setPeople([...people, { id: crypto.randomUUID(), name }])
  }
  function removePerson(id) {
    setPeople(people.filter((p) => p.id !== id))
    // Clean up any item references to the removed person, so totals stay correct.
    setItems(items.map((item) => ({
      ...item,
      sharedBy: item.sharedBy?.filter((x) => x !== id) ?? [],
      customShares: item.customShares ? Object.fromEntries(Object.entries(item.customShares).filter(([k]) => k !== id)) : {},
    })))
  }
  function addItem(item) { setItems([...items, item]) }
  function removeItem(id) { setItems(items.filter((i) => i.id !== id)) }

  function resetAll() {
    setPeople([])
    setItems([])
    setTaxTip({ percent: '', fixed: '' })
  }

  // Derived state: recalculated from people, items and tax/tip every render.
  const result = useMemo(
    () => calculateSplit({ people, items, taxTipPercent: Number(taxTip.percent) || 0, taxTipFixed: Number(taxTip.fixed) || 0 }),
    [people, items, taxTip]
  )

  return (
    <main className="app">
      <header>
        <h1>Bill <span className="accent-word">Splitter</span></h1>
        <p className="subhead">Split a shared bill fairly, item by item.</p>
      </header>

      <PeopleForm people={people} onAdd={addPerson} onRemove={removePerson} />

      {/* Items can be entered before anyone's added to split them -- Shared
          by just won't have any names to show until People has some. */}
      <ItemForm people={people} onAdd={addItem} />
      <section className="section">
        <h2 className="accent-word">Items</h2>
        <ItemsList items={items} people={people} onRemove={removeItem} />
      </section>
      <TaxTip taxTip={taxTip} onChange={setTaxTip} />

      <div className="plan-controls">
        <button type="button" className="link-reset" onClick={resetAll}>Reset</button>
      </div>

      <Summary result={result} />
    </main>
  )
}
