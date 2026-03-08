# EV Deal Modeller — Seven Fincorp — Cursor Context

Paste this at the start of any Cursor chat for full project context.

---

**PROJECT: EV Deal Modeller — Seven Fincorp**

This is a React + Vite app (`src/App.jsx`) — a live deal modelling tool for an EV import business. All logic is in one file.

**Business context:**  
Seven Fincorp is a fintech company. We have two clients — an OEM/assembler who takes CKD kits from China and assembles EVs in India, and a CHA (customs house agent) who handles imports. We are tying them together into a three-way deal.

**The three models in the app (three tabs):**

- **Tab 1 — Current Math (Stage 1, OEM pitch tomorrow)**  
  OEM uses Seven Fincorp's Money Multiplier product (working capital loan) to buy CKD kits from the importer. SF earns the interest on the loan — calculated as a % on the landed port cost in INR. All base cost inputs (FOB, logistics, CHA, assembly etc.) are editable so we can confirm numbers live with the OEM.

- **Tab 2 — Leasing Model (Stage 2)**  
  Three revenue phases for SF:
  - **Production:** SF charges OEM 2% on each vehicle purchase + 10% of the advance the importer bills the OEM (SF doesn't bill the importer directly in this phase)
  - **Distribution:** SF handles local registration and RTO. SF bills the leasing company ₹1,000 as a service fee, which is baked into a ₹6,500 total (actual insurance + RTO costs + SF's ₹1,000 fee)
  - **Revenue:** SF bills the end customer ₹2,750/month and pays the leasing company ₹2,500/month, earning ₹250/month spread over the rental tenure

- **Tab 3 — OEM Sale (Stage 2, TBD)**  
  Importer sells directly to OEM at a margin on landed port cost. SF revenue model here is not yet defined — placeholder for future structuring.

**Persona toggle:** A header toggle switches view between **OEM** and **Importer**. Calculations and labels refocus on the selected persona (e.g. "Your cost", "Your margin"); Seven Fincorp revenue remains shown as reference in the SF summary card.

**Tech stack:** React 18, Vite 4. Single file component (`src/App.jsx`). No routing, no backend, no external state library. Styling is all inline CSS. Uses Google Fonts (IBM Plex Mono + Syne) loaded via `<link>` tag in the component itself.

**Design system (fintech-mature, not tech sci-fi):**
- Background: `#0c1222`; card: `#111827`; border: `#1e2a3a`
- OEM accent: `#2563eb`; Importer accent: `#0d9488`; SF revenue: `#b45309`
- Persona-driven: selected persona's key rows use `type="persona"` or `type="total"` with `personaColor`; SF rows use `type="sf"`
- All numbers in INR with ₹ prefix, Indian locale formatting

**Key calculation logic:**
- `landedPortINR = (FOB + logistics + CHA) × usdInr`
- `factoryLanding = landedPortINR + transport + components + consumables + assembly`
- All SF fees derived from `factoryLanding` or `landedPortINR` as base
- All calculations in a single `useMemo` block called `c`

**When making changes:**  
Keep all logic inside the `useMemo`, keep all editable inputs tied to the `p` state object via the `set(key)` handler pattern, and keep SF revenue rows visually distinct using `type="sf"` on the `Row` component.

---

Copy-paste the above (from "PROJECT" to the end of "Row component") at the start of any Cursor conversation for full context without reading the code first.
