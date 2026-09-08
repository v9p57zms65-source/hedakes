/* Hedake — Supabase configuration.
 *
 * Both values below are safe to commit — same as they always were — but
 * what they unlock changed. This app now syncs across every device with
 * zero login, the same way the GTA V completion tracker does: every device
 * reads and writes ONE fixed row (id "hedake-main") in the `journal_state`
 * table, using nothing but this public anon key. There is no per-user
 * identity at all — no email, no password, no anonymous-auth session —
 * which is exactly what makes "just open the page on your phone and it's
 * already synced" possible.
 *
 * Be clear-eyed about what that means for security: it means there isn't
 * any, beyond this URL not being published anywhere. The anon key above and
 * the row id in index.html are both sitting in this file's plain-text
 * source, so anyone who finds this exact GitHub Pages URL and looks at the
 * page source can read and overwrite this journal. That's an accepted,
 * deliberate tradeoff for a personal single-user app whose URL isn't
 * shared — the same one already made for the GTA tracker — not an
 * oversight. Don't copy this pattern for anything where that wouldn't be
 * fine.
 *
 * `journal_state` has row-level security enabled but with an intentionally
 * permissive "allow all" policy, and full grants to the `anon` role — see
 * supabase/schema.sql. The older `journals` table (per-user rows keyed to
 * Supabase Auth identities) is no longer used by this app; it's harmless
 * dead weight, left in place rather than dropped in case any of that
 * history is ever wanted back.
 *
 * Clear url/anonKey and the app reverts to local-only — no network at all.
 */
window.HEDAKE_CONFIG = {
  url: 'https://einodrrumonmokcpeswi.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpbm9kcnJ1bW9ubW9rY3Blc3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0Mjk0NDgsImV4cCI6MjEwMTAwNTQ0OH0.mb-pM_UmDVJYsAo6U73fKOqeJbCbNpKL5zNgVDSt0qo'
};
