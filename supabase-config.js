/* Hedake — Supabase configuration.
 *
 * Both values below are safe to commit. The anon key identifies the project,
 * not you: every row in the journals table is fenced by row-level security to
 * auth.uid(), and the anon role has all privileges revoked on that table, so a
 * request without a valid session can read and write nothing.
 *
 * Clear url/anonKey and the app reverts to local-only — no account, no
 * network, everything still works.
 */
window.HEDAKE_CONFIG = {
  url: 'https://einodrrumonmokcpeswi.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpbm9kcnJ1bW9ubW9rY3Blc3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0Mjk0NDgsImV4cCI6MjEwMTAwNTQ0OH0.mb-pM_UmDVJYsAo6U73fKOqeJbCbNpKL5zNgVDSt0qo',

  // The account identifier. Supabase needs an email-shaped username; this one
  // never has to receive mail, because sign-in is by password and the user is
  // created (pre-confirmed) from the dashboard. Prefilled so you only ever
  // type the password.
  identity: 'me@hedakes.app',

  // false → the app is usable locally without signing in; sync is opt-in from
  //         the Report tab. true → blank sign-in wall until authenticated.
  requireAuth: false
};
