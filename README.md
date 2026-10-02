# Bill Splitter

A free, no-signup tool for splitting a shared bill between friends, item by item -- built for exactly the "who owes what" conversation that comes up at the end of every group trip.

**Live demo:** _add your Vercel link here once deployed_
**Repo:** _add your GitHub link here_

## Why this exists

The usual bill-splitting problem isn't the maths, it's that everyone had something different: one person skipped dessert, someone else only had a drink, and then there's a service charge to divide fairly on top. This tool handles that directly: add people, add items one at a time (split equally among whoever shared it, or type a custom amount per person), add a tax/tip percentage or fixed amount, and it tells you exactly what each person owes -- with the totals always adding up to the exact bill total, to the penny.

## Features

- Add/remove people on the fly
- Add items with a price, split equally among selected people or with custom per-person amounts
- Tax/tip entered as a percentage or fixed amount, allocated proportionally to what each person already owes
- Totals are guaranteed to reconcile exactly to the bill total (see "How the splitting works" below)
- Running summary of what each person owes, updated live
- Reset button, everything saved in the browser, no account needed

## Tech stack

React + Vite. No backend, no paid services, nothing external except Google Fonts.

## Run it locally

```bash
npm install
npm run dev
```
Open the address it prints (usually http://localhost:5173).

## Project structure

```
src/
  components/   PeopleForm, ItemForm, ItemsList, TaxTip, Summary
  hooks/        useLocalStorage.js
  utils/        split.js (the splitting engine)
  App.jsx
```

## How the splitting works

`utils/split.js` is plain JavaScript with no React in it, the same separation used in my other projects (the logic can be tested and reasoned about on its own).

The tricky part of bill splitting is rounding: if three people split £10, the "obvious" answer (£3.33 each) is 1p short. This uses the **largest remainder method** -- everyone gets the rounded-down share, then the leftover pennies are handed out one at a time -- so the parts always sum to exactly the whole. The same approach allocates tax/tip proportionally to each person's subtotal, and custom per-person amounts have their own rounding gap absorbed automatically, so every item and the whole bill always reconcile exactly.

All money is handled in integer pence internally rather than decimal pounds, which avoids classic floating-point bugs (`0.1 + 0.2 !== 0.3` in JavaScript) that would otherwise make totals drift by a penny over several items.

**Known limitations:** this splits a single shared bill by who-had-what; it doesn't yet track who actually paid or net balances across multiple payers (a "settle up" / minimal-transfers feature is a natural next step).

## Roadmap

- [x] People, items (equal/custom split), tax/tip, live summary
- [x] Penny-accurate rounding (largest remainder method)
- [ ] Track who paid and show minimal "who pays whom" transfers
- [ ] Export / share the summary
