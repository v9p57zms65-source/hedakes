-- Hedake — Supabase schema.
-- Paste into the Supabase SQL editor and run once.

-- ============================================================================
-- ACTIVE: journal_state — the table the app actually uses.
--
-- One single fixed row (id = 'hedake-main'), read and written by every
-- device with nothing but the public anon key — no login, no per-user
-- identity, same pattern as the GTA V completion tracker's `tracker_state`
-- table. That's what makes "open the page on a second device and it's
-- already synced" possible with zero setup on that device.
--
-- The RLS policy below is deliberately permissive ("allow all"), and `anon`
-- is granted full privileges. Be clear that this means there is no real
-- access control on this table beyond the app's URL not being published —
-- anyone who has the URL can view-source it, get the anon key and this
-- table name, and read or write this journal directly via the REST API.
-- That's an accepted tradeoff for a personal single-user app whose link
-- isn't shared, not an oversight. Don't copy this pattern for anything
-- where that wouldn't be fine.
-- ============================================================================

create table if not exists public.journal_state (
  id         text primary key,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.journal_state enable row level security;

drop policy if exists "allow all for now" on public.journal_state;
create policy "allow all for now" on public.journal_state
  for all using (true) with check (true);

grant select, insert, update, delete on public.journal_state to anon, authenticated;

-- ============================================================================
-- LEGACY: journals — the original per-user, auth.uid()-scoped design.
--
-- No longer used by the app. Left in place rather than dropped, in case any
-- of its history (including one orphaned row from an earlier password-based
-- sync attempt) is ever wanted back. Harmless as-is: real RLS, nothing
-- reachable without a genuine Supabase Auth session, and the app no longer
-- creates any such session.
-- ============================================================================

create table if not exists public.journals (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  doc        jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_journal()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists journals_touch on public.journals;
create trigger journals_touch
  before insert or update on public.journals
  for each row execute function public.touch_journal();

alter table public.journals enable row level security;

drop policy if exists journals_select_own on public.journals;
create policy journals_select_own on public.journals
  for select using (auth.uid() = user_id);

drop policy if exists journals_insert_own on public.journals;
create policy journals_insert_own on public.journals
  for insert with check (auth.uid() = user_id);

drop policy if exists journals_update_own on public.journals;
create policy journals_update_own on public.journals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists journals_delete_own on public.journals;
create policy journals_delete_own on public.journals
  for delete using (auth.uid() = user_id);

revoke all on public.journals from anon;
grant select, insert, update, delete on public.journals to authenticated;
