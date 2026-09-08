/* Hedake — Supabase configuration.
 *
 * Both values below are safe to commit. The anon key identifies the project,
 * not you: every row in the journals table is fenced by row-level security to
 * auth.uid(), and the anon (unauthenticated) role has all privileges revoked
 * on that table, so a request with no session can read or write nothing.
 *
 * There is no password and no login screen. On first run the app silently
 * calls supabase.auth.signInAnonymously(), which mints a real Supabase user
 * with no email or password — just a uuid. That session is cached by
 * supabase-js in this browser's localStorage, so every later visit restores
 * the same uuid, which is what keeps this device's backup pointed at the
 * same row. Security is entirely Supabase's row-level security on that id,
 * not anything the app itself gates.
 *
 * This backs up one device to the cloud; it does not merge two devices into
 * one journal, because there's no shared credential to carry between them
 * (that would need an actual login again).
 *
 * Requires "Allow anonymous sign-ins" turned on for this project — Supabase
 * dashboard → Authentication → Sign In / Providers → Anonymous Sign-Ins.
 * Anonymous auth is off by default on a new project, so this is a one-time
 * manual toggle; without it every push/pull fails quietly and the app just
 * stays local-only.
 *
 * Clear url/anonKey and the app reverts to local-only — no network at all.
 */
window.HEDAKE_CONFIG = {
  url: 'https://einodrrumonmokcpeswi.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpbm9kcnJ1bW9ubW9rY3Blc3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0Mjk0NDgsImV4cCI6MjEwMTAwNTQ0OH0.mb-pM_UmDVJYsAo6U73fKOqeJbCbNpKL5zNgVDSt0qo'
};
