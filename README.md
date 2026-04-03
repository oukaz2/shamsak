# شمسك — Shamsak

**دليل مثبتي الطاقة الشمسية المعتمدين في مصر**  
Egypt's Certified Solar Installer Directory

---

## Overview

Shamsak is a bilingual (Arabic/English) directory of certified solar installer companies in Egypt. It presents publicly available information from official sources in a clean, searchable, and easy-to-browse interface.

- Arabic default with RTL layout
- Full English support with a language toggle
- 54 certified installer companies seeded from NREA public data
- Admin panel for managing listings
- No lead generation, no paid rankings, no forms

---

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express.js (Node.js)
- **Database**: SQLite via Drizzle ORM (auto-seeded on first run)
- **Routing**: Wouter (hash-based for static deployment compatibility)

---

## Local Development

```bash
npm install
npm run dev
```

Runs on http://localhost:5000. Database is auto-created and seeded on first launch.

---

## Admin Panel

Navigate to `/#/admin` and enter the admin password.

Default password (change via environment variable): `shamsak-admin-2026`

Set `ADMIN_PASSWORD` environment variable in production.

---

## Deployment (Vercel / Railway)

1. Push to GitHub
2. Connect repo to Vercel or Railway
3. Set environment variable: `ADMIN_PASSWORD=your-secure-password`
4. Build command: `npm run build`
5. Start command: `NODE_ENV=production node dist/index.cjs`

---

## Data Structure

Installers are stored in SQLite with the following key fields:

| Field | Description |
|---|---|
| `nameAr` | Arabic company name |
| `nameEn` | English company name |
| `publicCategory` | `up_to_500kw` or `above_500kw` (public filter) |
| `sourceCategory` | Original NREA category (for reference) |
| `stationsCount` | Number of documented stations |
| `installedPowerKw` | Total installed capacity in kW |
| `descriptionAr` / `descriptionEn` | Editable descriptions |
| `featured` | Whether shown in homepage featured section |
| `hidden` | Whether hidden from public directory |

---

## Adding / Editing Companies

Use the admin panel at `/#/admin` to:
- Add new companies
- Edit names, descriptions, contact info, power data
- Toggle featured/hidden status
- Delete listings

---

## Source

Data sourced from:
- NREA (New and Renewable Energy Authority) Golden and Bronze Lists
- Egypt Solar Platform (pv-hub.org)
- EGYPTERA licensing data

---

*Shamsak is an independent directory. No paid placements. All data is from public official sources.*
