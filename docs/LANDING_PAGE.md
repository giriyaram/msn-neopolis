# MSN Neopolis — Landing Page

The landing page lives at `/` (`src/app/page.tsx`). It reuses the design system (`/design-system`, not indexed). Everything shown comes from official data in `src/content/`. Nothing is estimated or invented.

| What | Where |
|---|---|
| Project facts, sizes, starting price, specs, payment plan, offer | `src/content/project.ts` |
| FAQ (generated from the project facts) | `src/content/faq.ts` |
| Official images, renders, floor plans, brochure | `src/content/media.ts` |
| Section components | `src/components/landing/` |
| Enquiry API | `src/app/api/enquiry/route.ts` |
| CRM adapter | `src/lib/server/crm.ts` |
| Analytics and attribution | `src/lib/analytics.ts`, `src/lib/attribution.ts`, `src/components/analytics/Analytics.tsx` |

**Pricing policy.** The site shows one price only: **Starting ₹3.2 Cr\*** (`startingPrice` in `project.ts`). It appears in the hero, the pricing section, the FAQ and the meta description. Per-SFT base rates, per-size and per-tower prices, and any figure below ₹3.2 Cr are deliberately **not stored in the codebase**, so they cannot reach the page or the JavaScript bundle. The MSN team shares them in the official cost sheet.

---

## 1. Imagery

All imagery is registered in `src/content/media.ts` and lives in `public/media/`. `width` and `height` must be the file's real pixel size. An empty slot falls back to a deliberate typographic layout.

There are two kinds of image, and they are never mixed up:

- **Project renders** (`public/media/*.webp`) are labelled "Artist's impression".
- **Context photography** (`public/media/stock/`, [Unsplash License](https://unsplash.com/license)) shows real Hyderabad places and representative materials. It is labelled "Representative imagery" with a photographer credit. It is never used to depict the project itself.

| Slot | File(s) | Used in |
|---|---|---|
| `hero` | `neopolis-aerial-dusk.webp` (supplied render, letterbox bars cropped) | Hero, offer band background, Open Graph |
| `architecture` | same render, framed on the tower tops | Architecture |
| `overview` | `courtyard.webp` | Overview, beside the figures |
| `interiors[]` | `living-room.webp`, `bedroom.webp` | Residences |
| `skyPavilions[]` | `sky-pavilions-west.webp`, `sky-pavilions-east.webp` (detail crops of the aerial render) | Sky pavilions |
| `amenities[]` | `pool-deck`, `clubhouse-lounge`, `cafe-terrace`, `garden-terrace` | Clubhouse & amenities gallery |
| `floorPlanPreview` | `floor-plan-preview-locked.webp`: a heavily blurred version of the supplied plan, baked into the file. The clear original is in `assets/floor-plans/`, outside `public/`, so it is never served | Floor-plan viewer: the same locked preview for every 3 & 4 BHK size, with an "Unlock this floor plan" enquiry |
| `location.band` | `stock/hyderabad-durgam-cheruvu-night.webp`: Rishabh Modi / Unsplash | Location opening band |
| `location.district` | `stock/hitec-city-knowledge-park.webp`: Himanshu Bag / Unsplash | Location, "western corridor" row |
| `materials.bath` | `stock/bathroom-stone-timber.webp`: Ela De Pure / Unsplash | Specifications |
| `materials.flooring` | `stock/marble-texture.webp`: Augustine Wong / Unsplash | Specifications |

`clubhouse-lounge.webp` is only 600 × 400, so it sits in the gallery's smallest slot. Replace it with a higher-resolution render when one is available.

**Assets still required from MSN**

| Slot | Effect when supplied |
|---|---|
| `towers.A/B/C` | Tower A/B/C selector in Architecture |
| `heroMobile` (optional, portrait crop) | Better hero crop on phones |
| `floorPlans[size]`: `{ image, pdf }` per SFT size | Replaces the blurred preview with the clear plan (zoom, PDF download, `view_floor_plan` tracking). Only add plans here that may be shown without an enquiry |
| `brochure` (PDF) | Reserved |
| Official MSN logo (SVG) | Replace the typeset placeholder in `src/components/ui/Wordmark.tsx` |

Before launch, confirm with MSN that every render in `public/media/` is approved for MSN Neopolis. Also confirm that each amenity caption names an amenity that is actually confirmed.

**Information still required**

- **RERA registration** — set `project.rera` in `project.ts`. It then appears in the footer automatically.
- **Statutory disclosures, privacy policy, terms** — `/privacy` and `/terms` are holding pages. Replace them with MSN's approved legal text.
- **Verified travel times** for the location section. Until supplied, the page links to live Google Maps journey times instead of quoting distances. The map is a labelled schematic (relative positions only).
- **Tower allocation per size** — not supplied, so the page says availability is "confirmed by the MSN team".
- **Sales phone number**: +91 90324 58800 is the default for every Call and WhatsApp button. To change it, set `NEXT_PUBLIC_SALES_PHONE` (E.164).

---

## 2. Environment variables

Copy `.env.example` to `.env.local` for development, or set the values in your hosting provider.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Yes (production)** | Canonical URL, Open Graph, sitemap, robots |
| `CRM_WEBHOOK_URL` | **Yes (production)** | HTTPS endpoint that receives each lead as JSON |
| `CRM_WEBHOOK_SECRET` | Recommended | Sent as `Authorization: Bearer …` |
| `NEXT_PUBLIC_GTM_ID` | One of these two | GTM container `GTM-XXXXXXX` (preferred) |
| `NEXT_PUBLIC_GA4_ID` | | GA4 `G-XXXXXXXXXX`, used only when no GTM ID is set |
| `LEAD_SESSION_SECRET` | **Yes (production)** | 32+ random characters (`openssl rand -base64 36`). Encrypts the post-enquiry session behind `/thank-you`. Without it, enquiries still deliver but show the inline confirmation instead of redirecting |
| `NEXT_PUBLIC_SALES_PHONE` | Optional | Overrides the Call / WhatsApp number (default `+919032458800`) |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Optional | WhatsApp number when it differs from the call number. Defaults to the sales number |
| `LEAD_DELIVERY_MODE=log` | Dev only | Prints leads to the console instead of delivering them. Ignored in production |

`NEXT_PUBLIC_*` values are built into the bundle, so rebuild after changing them.

**Without `CRM_WEBHOOK_URL` the form shows an error. It never shows a false success.**

---

## 3. Enquiry pipeline

1. One-step form with two fields: name, and mobile number with a country code (+91 by default, with NRI codes available) (`LeadForm.tsx`). Any configuration, size or tower the visitor already chose on the page, or that arrived through the ad URL, is sent silently as context. Unrecognised context values are dropped and never reject a lead. Client-side validation uses the same schema as the server (`src/lib/lead.ts`).
2. `POST /api/enquiry` checks, in order:
   - per-IP rate limit (6 per 10 min)
   - honeypot field and minimum completion time (3 s)
   - server-side validation
   - idempotency on `submissionId`: repeat or double submits return the original `leadId` and are not delivered twice
3. The lead is sent to `CRM_WEBHOOK_URL`. The API returns `{ ok: true, leadId }` **only after the CRM responds 2xx**. Otherwise it returns 502 or 503, and the form keeps the visitor's details for a retry.
4. On success the API also sets the post-enquiry session cookie and returns `next: "/thank-you"`. The form fires `generate_lead`, then navigates there client-side. A failed submission never sets the cookie and never redirects.

**Thank-you page** (`/thank-you`, `src/components/thank-you/`)

- **Lead context:** `msn_lead` is an AES-256-GCM encrypted, `httpOnly`, `Secure`, `SameSite=Lax` cookie (`src/lib/server/lead-session.ts`). It expires after 12 hours and holds the lead ID, name, phone and chosen configuration, size and tower. Nothing about the lead is put in the URL or in browser storage, and the browser can't read or change the cookie.
- **Access:** the page is open to anyone. With a valid cookie it is personalised (name, preferences, reference). Without one (direct visit, expired, tampered or forged cookie) it renders a generic version: no reference, no `thank_you_view`, and "Request payment details" / "Check offer eligibility" open WhatsApp instead of posting to the CRM. The site-visit form works either way.
- **Refreshing** re-reads the session. Nothing is submitted again and `generate_lead` does not fire again.
- **Shows** the visitor's first name, a reference, and only the preferences they actually chose. The WhatsApp message is pre-filled with those preferences.
- **Site visit:** a request form (preferred date within 90 days, morning, afternoon or evening, name, mobile, optional email), prefilled from the session. It is a request: the copy says the MSN team confirms availability, and no appointment slots are shown.
- **One-tap requests:** "Request payment details" and "Check offer eligibility" send a request using the contact details in the session. If the session has expired, they offer WhatsApp instead.
- **Delivery:** all three go through `POST /api/follow-up` to the same CRM webhook, linked to the enquiry by `lead_id`. They use the same controls as enquiries (rate limit, honeypot, validation, idempotency). Each request type is delivered at most once per lead or request.
- **Not indexed:** the page is `noindex` and disallowed in `robots.txt`.

**Lead popup** (`LeadPopup.tsx`, state in `src/lib/lead-popup.ts`)

- Opens 5 s after page load. After each close, it opens again 30 s later. The timings are the constants at the top of `LeadPopup.tsx`.
- Every styled call-to-action (anything rendered with `buttonClasses`) opens the popup instead of scrolling or navigating. The popup heading follows the button: floor plans, cost sheet, offer or general.
- Not intercepted: the form's own buttons, `tel:` and `mailto:` links, and plain controls such as size chips, tabs, FAQ toggles and nav links. Add `data-no-popup` to any element to exempt it.
- The timed popup waits while the visitor is typing in a field, another dialog is open, or the tab is hidden. It retries every 3 s.
- After a lead is delivered (from the popup or the page form), `msn_lead_submitted` is saved in `localStorage`. From then on the popup stops appearing and buttons behave normally, including on later visits.
- `lead_popup_open` is pushed to analytics with `trigger: "timer" | "button"`.

**Call and WhatsApp** (`ContactButtons.tsx`)

- They appear as floating buttons bottom-right on desktop, as icon buttons in the mobile CTA bar, as a "Prefer to talk?" row under the enquiry form and in the popup, and in the footer.
- WhatsApp opens `wa.me` with a pre-filled message about MSN Neopolis.
- These buttons never open the lead popup (`data-no-popup`).
- Clicks push `click_call` / `click_whatsapp` with `location`: `floating`, `mobile_bar`, `enquiry`, `popup` or `footer`. Mark them as secondary conversions in GA4 if useful.

The rate limit and idempotency maps are held in memory on each server instance. On multi-instance or serverless hosting, move them to a shared store (e.g. Redis), and also deduplicate on `submission_id` in the CRM.

**Payload sent to the CRM**

Every record has an `event_type`: `enquiry` (a new lead), or a follow-up from the thank-you page: `site_visit_request`, `payment_details_request` or `offer_eligibility_request`. Branch on it in the CRM workflow. Only `enquiry` creates a lead; follow-ups carry the original `lead_id`, and site visits add `site_visit: { preferred_date, preferred_time }` and `email`.

Every record also carries flat copies of the key fields for direct mapping (e.g. HighLevel → Create Contact). These are `full_name`, `first_name`, `last_name`, `phone`, `source`, `configuration`, `size_sft`, `tower`, `gclid` and `utm_*`. The campaign fields come from the last touch, falling back to the first.

```json
{
  "event_type": "enquiry",
  "lead_id": "uuid",
  "submission_id": "uuid",
  "submitted_at": "ISO-8601",
  "project": "MSN Neopolis",
  "intent": "floor-plans | pricing | offer | general",
  "preferences": { "configuration": "3bhk | 4bhk | both | null", "size_sft": 3600, "tower": "A | B | C | null" },
  "contact": { "name": "…", "phone_e164": "+919848012345", "phone_country": "IN" },
  "attribution": {
    "first": { "gclid": "…", "gbraid": "…", "wbraid": "…", "utm_source": "…", "utm_medium": "…",
               "utm_campaign": "…", "utm_term": "…", "utm_content": "…",
               "landing_page": "…", "referrer": "…", "captured_at": "…" },
    "last":  { "…": "same shape — most recent campaign visit" }
  },
  "page_url": "…",
  "user_agent": "…",
  "consent_text": "By submitting this form, you agree to be contacted…"
}
```

The form asks only for a name and a mobile number. There is no email, budget, purpose or timeline. The sales team qualifies those on the call.

---

## 4. Analytics

Events go to `window.dataLayer` (GTM) or `gtag` (GA4-only).

| Event | Fires when | Notes |
|---|---|---|
| `page_view` | Page load (GTM mode only) | In GTM, trigger the GA4 page view on this event. Don't also auto-send it from the Google tag |
| `view_item` | A configuration's panel reaches mid-screen, once per configuration per session | `items[0].item_id` = `3bhk` / `4bhk`. No price or value is sent |
| `select_configuration` | Visitor changes configuration, size or tower | `location`: `residences` or `floor_plans` |
| `view_floor_plan` | An official plan is displayed, enlarged or downloaded | Only once plan assets exist |
| `generate_lead` | **After the API confirms delivery** | Once per `lead_id`. Never on button clicks. No personal data in the event |
| `thank_you_view` | `/thank-you` is shown | Once per lead per browser session, so refreshes don't count. **Not a lead** |
| `whatsapp_contact_click` | A WhatsApp button on `/thank-you` | `location`: `primary_action`, `final_section` or `sticky_bar`. Secondary conversion |
| `site_visit_request` | **After the API confirms** a site-visit request | Secondary conversion |
| `payment_details_request` | **After the API confirms** a payment-details request | Once per lead |
| `consultation_request` | **After the API confirms** an offer-eligibility request | Once per lead |
| `floor_plan_view`, `pricing_view`, `specifications_view` | Detail links on `/thank-you` are clicked | Engagement only |
| `qualified_lead`, `schedule_site_visit`, `booking` | In the CRM | Import into Google Ads as **offline conversions**, keyed on the stored GCLID / GBRAID / WBRAID |

Mark only `generate_lead` (and the offline stages) as the primary lead conversion in Google Ads. `whatsapp_contact_click` and `site_visit_request` can be secondary conversions. Never use `thank_you_view` or a `/thank-you` page-view rule as a lead conversion: `generate_lead` already fires once, on the form, after confirmed delivery.

**Attribution:** GCLID, GBRAID, WBRAID, UTMs, landing page and external referrer are captured on arrival. They are kept in `localStorage` as first touch (90 days) and last touch, and sent with every lead. Query parameters are never displayed on the page.

**Search-intent URLs for ad groups**

| Ad group | Final URL |
|---|---|
| 3 BHK searches | `/?configuration=3bhk` |
| 4 BHK searches | `/?configuration=4bhk` |
| Optional deep links | `/?configuration=4bhk&size=3600&tower=a` |

These preselect the residence tabs, floor-plan viewer and enquiry form. The design is unchanged.

---

## 5. SEO and performance

- Unique title, description and canonical URL. Open Graph and Twitter metadata, with a generated share image until the hero render is supplied.
- JSON-LD: `ApartmentComplex` and `FAQPage`, both generated from the same project data.
- `sitemap.xml` and `robots.txt` (`/api/` and `/design-system` disallowed). Legal pages are `noindex`.
- The page is prerendered as static HTML. The hero headline is plain text (no entrance animation), so it is the fast LCP element. Fonts are self-hosted via `next/font`.
- Scroll reveals are CSS-only. All motion is disabled for reduced-motion users.
- Native `<dialog>` for the menu and plan zoom. Native radio inputs for every selector. Native `<details>` for the FAQ.

---

## 6. QA performed

Tested on a production build at 375, 390, 768, 1024, 1280, 1440 and 1920 px:

- no horizontal overflow at any width; header switches from menu to full navigation at 1280 px
- one H1 and a correct heading order; the only rupee figure in the HTML and JS is ₹3.2 Cr, with no base rates or per-unit prices
- URL preselection and attribution capture; no parameters visible on the page
- API: invalid fields (422), honeypot and too-fast submissions (400), size not in the chosen configuration (422), NRI number (+971), successful delivery, duplicate resubmission (no second delivery), CRM failure (502), rate limiting
- UI: field validation with focus moved to the first invalid field, phone validation per country, success state, honest error state with details kept, retry after failure, double-click → one delivery and one `generate_lead`
- `view_item`, `select_configuration` and `generate_lead` verified in the dataLayer
- no console errors (apart from the deliberate 502 during the failure test)

**Not yet testable:** the floor-plan zoom and PDF flows. They activate when official plan assets are added to `media.ts`.
