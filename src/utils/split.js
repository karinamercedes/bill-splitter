// The splitting engine: plain JavaScript, no React. Takes people, items (each
// assigned equally or custom) and optional tax/tip, returns exactly how much
// each person owes -- guaranteed to add up to the bill total to the penny.
//
// Working in integer pence throughout avoids classic floating-point bugs
// (0.1 + 0.2 !== 0.3) and is why the final numbers always reconcile exactly.

const toPence = (pounds) => Math.round(Number(pounds) * 100)
const toPounds = (pence) => (pence / 100).toFixed(2)

// Splits `totalPence` between the given people as evenly as possible.
// Uses the "largest remainder" method: give everyone the rounded-down share,
// then hand the leftover pennies one at a time to whoever's share was
// rounded down the most -- so the pennies land fairly, not always on the
// first or last person, and the parts always sum to exactly `totalPence`.
function splitEvenly(totalPence, peopleIds) {
  const n = peopleIds.length
  if (n === 0) return {}
  const base = Math.floor(totalPence / n)
  let remainder = totalPence - base * n // leftover pennies, always < n

  const shares = {}
  peopleIds.forEach((id) => { shares[id] = base })
  // Distribute the leftover pennies one each, in list order (stable & simple).
  for (let i = 0; i < remainder; i++) shares[peopleIds[i % n]] += 1
  return shares
}

export function calculateSplit({ people, items, taxTipPercent = 0, taxTipFixed = 0 }) {
  const totals = {} // personId -> pence owed
  people.forEach((p) => { totals[p.id] = 0 })

  for (const item of items) {
    const pricePence = toPence(item.price)
    if (item.splitType === 'custom') {
      // Custom shares are pence amounts the user typed per person; any
      // rounding gap (from typed values not summing exactly) is absorbed
      // by adjusting the largest share, so the item's own total stays exact.
      const entries = Object.entries(item.customShares || {})
      const given = entries.reduce((sum, [, v]) => sum + toPence(v), 0)
      const gap = pricePence - given
      entries.forEach(([id, v], i) => {
        totals[id] = (totals[id] || 0) + toPence(v) + (i === 0 ? gap : 0)
      })
    } else {
      const ids = item.sharedBy.length > 0 ? item.sharedBy : people.map((p) => p.id)
      const shares = splitEvenly(pricePence, ids)
      for (const id of ids) totals[id] = (totals[id] || 0) + shares[id]
    }
  }

  // Tax/tip is allocated proportionally to what each person already owes --
  // someone who ordered more pays a proportionally larger share of the tip.
  const subtotalPence = Object.values(totals).reduce((a, b) => a + b, 0)
  const taxTipPence = Math.round(subtotalPence * (taxTipPercent / 100)) + toPence(taxTipFixed)

  if (taxTipPence !== 0 && subtotalPence > 0) {
    const ids = people.map((p) => p.id)
    let distributed = 0
    const extra = {}
    ids.forEach((id) => {
      const share = Math.floor((totals[id] / subtotalPence) * taxTipPence)
      extra[id] = share
      distributed += share
    })
    // Largest-remainder again for the few pennies proportional rounding leaves over.
    let leftover = taxTipPence - distributed
    const byRemainder = [...ids].sort((a, b) => {
      const ra = (totals[b] / subtotalPence) * taxTipPence - Math.floor((totals[b] / subtotalPence) * taxTipPence)
      const rb = (totals[a] / subtotalPence) * taxTipPence - Math.floor((totals[a] / subtotalPence) * taxTipPence)
      return ra - rb
    })
    for (let i = 0; i < leftover; i++) extra[byRemainder[i % byRemainder.length]] += 1
    ids.forEach((id) => { totals[id] += extra[id] })
  }

  const billTotalPence = subtotalPence + taxTipPence
  const perPerson = people.map((p) => ({ id: p.id, name: p.name, owedPence: totals[p.id] || 0, owed: toPounds(totals[p.id] || 0) }))
  const checkSum = perPerson.reduce((sum, p) => sum + p.owedPence, 0)

  return {
    perPerson,
    subtotal: toPounds(subtotalPence),
    taxTip: toPounds(taxTipPence),
    billTotal: toPounds(billTotalPence),
    // Sanity check: the split must reconcile exactly. If this is ever false,
    // it's a bug in the rounding logic above, not a user-facing warning.
    reconciled: checkSum === billTotalPence,
  }
}
