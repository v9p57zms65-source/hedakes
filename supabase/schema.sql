-- Onset — Supabase schema.
-- Paste into the Supabase SQL editor and run once.
--
-- One row per user holding the whole journal as a JSON document. Records
-- inside the document each carry their own `u` timestamp, so two devices
-- that both changed things merge per record rather than one clobbering the
-- other.

create table if not exists public.journals (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  doc        jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Keep updated_at honest regardless of what the client sends.
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

-- Row-level security: a user can only ever see or write their own row.
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

-- Belt and braces: no anonymous role should reach this table at all.
revoke all on public.journals from anon;
grant select, insert, update, delete on public.journals to authenticated;
