# Hedake — Headache Journal

A single-file, self-contained headache diary. Log attacks in about forty
seconds, add a daily check-in, and see everything — today, your numbers, the
calendar history, your data settings — on one screen. No tabs, no bottom
nav; it's built for one person logging headaches, not a multi-screen app.

## What it tracks

| Metric | Why it's there |
| --- | --- |
| Monthly headache days | The primary frequency measure |
| Acute medication days | A guardrail against medication-overuse headache |

Peak pain is shown on a green (mild) → yellow → red (severe) scale everywhere
it appears — the log slider, the calendar dots, the 30-day chart — so the same
number always reads the same colour.

## Logging an attack

Four steps: how bad it is (0–10, colour-coded), where and what else (a head
map plus symptom chips), how you treated it (Medication / Rest / Water /
Other), and what it cost you (impact, duration, and one note field covering
the whole entry). "Same as usual" re-logs your usual pattern in one tap.

## The one screen

Today's check-in (sleep, screen time, stress, a few lifestyle toggles), the
two headline metrics, the 30-day pain chart, and the calendar history all sit
on one scrolling screen — tap any day in the calendar to see what was logged.
Your data settings (sync, export/import, medication-day threshold, delete
everything) are a card at the very bottom of the same screen.

The check-in fields aren't analysed against anything at the moment (an
earlier build correlated them against headaches and surfaced verdicts — that
feature is on hold, described in `CLAUDE.md` for whoever picks it back up).
They're still logged so that history isn't lost if it returns. The doctor
-facing clinical-summary report (MIDAS score, print/PDF export) was dropped
for the same reason this is a single screen now: this build is scoped to
personal logging, not clinic hand-offs.

## Data and sync

The app is **local-first**. Every change writes to `localStorage` under
`hedake.v1` immediately, so it works offline and never blocks on the network.
(Earlier builds of this app were called Onset; if a browser still has data
under the old `onset.v1` key, it's copied over automatically on first load.)

Sync is configured in `supabase-config.js` and is opt-in: the app is fully
usable without signing in, and "Sign in to sync" at the bottom of the screen
is what mirrors the journal to Supabase so phone and laptop show the same
thing.

There is **one account and no sign-up flow**. It is created by hand from the
Supabase dashboard, pre-confirmed, and signed in with a password — no email is
ever sent or received. The identifier (`identity` in the config) is
email-shaped only because Supabase requires it; `me@hedakes.app` does not need
to be a real mailbox. Set `requireAuth: true` to turn the app into a blank
sign-in wall instead.

**How the merge works.** The whole journal is one JSONB document per user, but
every record inside it (each attack, each check-in, the settings block)
carries its own `u` timestamp. When two devices have both changed things,
they merge record by record — newest wins per record — rather than one device
overwriting the other's day. Deletes are tombstones, so a deleted entry stays
deleted instead of reappearing from the other device.

**Why the anon key is safe to commit.** It identifies the project, not you.
`journals` has row-level security enabled with policies scoped to
`auth.uid() = user_id`, and the `anon` role has all privileges revoked on the
table — so a request without a valid session can read and write nothing.

Set-up, once:

1. Run `supabase/schema.sql` in the SQL editor (Supabase → SQL Editor → New
   query → paste → Run).
2. **Authentication → Users → Add user → Create new user.** Email
   `me@hedakes.app`, a password you choose, and tick **Auto Confirm User** —
   that last part is what makes the account work without an inbox.
3. **Authentication → Sign-ups → disable new sign-ups.** Now no second account
   can be created, which is what closes the app to everyone but you.
4. Open the site, scroll to *Your data* → *Sign in to sync*, enter the
   password.

Password sign-in sends no mail, so no Site URL or redirect configuration is
needed. If you ever forget the password, reset it from the same Users screen.

JSON export/import in the *Your data* card still works either way, and
remains the right way to take a backup off-device.

## Running it

Open `index.html`. That's all it needs — no build step, no dependencies
beyond two CDN stylesheets (Inter and Phosphor icons), and it works offline
after the first load via the service worker.

## Publishing

Two routes, depending on whether the source should be readable:

- **Public repo + GitHub Pages** — free. Settings → Pages → deploy from
  `main`, root. Lands at `https://<user>.github.io/<repo>/`. Nothing secret
  is committed, so a public repo costs you nothing in privacy; access control
  is Supabase's job.
- **Private repo + Cloudflare Pages or Vercel** — both deploy private repos on
  their free tier. GitHub Pages from a private repo needs a paid GitHub plan.

Whichever you pick, put that URL into Supabase's Site URL and redirect list, or
the sign-in link will bounce.

## Not medical advice

Hedake organises what you record. It does not diagnose.

## Design

Built on the Nocturne design system — dark blue-grey ground, Inter, a single
blurple accent used as line and glow, outlined actions, 8px radii. Headache
severity is the one place colour departs from the accent ramp: it uses a
green → yellow → red scale on purpose, because "how bad is it" is exactly the
kind of number a traffic-light scale is for.
