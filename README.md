# The BureauCapital™ Calendar

> The worst calendar ever built — on purpose.

A fully client-side React parody of bureaucratic software: a clean, modern calendar with an intentionally, gloriously terrible user experience. Scheduling a single event requires paying fake money, filling out three government-style forms, surviving a fake five-business-day approval process, paying an arbitrary invoice, watching three unskippable parody advertisements, and defeating multiple absurd CAPTCHAs. Editing or deleting an event is even harder.

**🔗 Live demo:** _see the repository's GitHub Pages link_

## The full bureaucratic gauntlet

1. **Classified calendar** — Every date is redacted (`██ 🔒`). You cannot even *see* today until you file **Form T‑0, Petition to Acknowledge the Present**, pay a disclosure fee, and receive a Declassification Certificate. Clearance expires at midnight.
2. **Temporal Access Purchase** — Future dates must be bought with BureauBucks™ (displayed in USD at an official 1:1 rate). Tomorrow ≈ $2; next year ≈ thousands. Weekends carry a "Premium Leisure Zone" surcharge.
3. **Three forms** — A‑17 (Reason for Existing, Likelihood of Fun — statutory minimum 90%), B‑24 (coffee to exactly two decimals, staple orientation), and Form C, the Form Verification Form (which requires your date of birth). One field always "fails secondary review."
4. **Approval** — A fake five-business-day review with an erratic progress bar and random rejections ("Ink color insufficiently blue"). Appeals cost extra.
5. **Invoice** — Itemized nonsense fees, including a 4.7% "Gratuity for the Algorithm."
6. **Advertisements** — Three unskippable parody ads. The Skip button is decorative and flees your cursor.
7. **Human verification** — Select every square containing bureaucracy; type COMPLIANCE in triplicate; and catch the "I am not a robot" checkbox, which physically evades you for five seconds.
8. **Edit / Delete** — Even worse: amendment fees, a supervisor named Janet (on lunch), retroactive advance-notice declarations, cancellation fees, and typing `I HEREBY RESCIND MY FUN` verbatim.

All state (wallet balance, events, declassification clearance) persists in `localStorage`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs to dist/
```

## Tech

Vite · React 18 · plain CSS. No backend. 100% client-side. 100% intentionally infuriating.

---

*BureauBucks™ have no cash value, sentimental value, or values in general. Refunds are a myth. This README certifies its own certification.*
