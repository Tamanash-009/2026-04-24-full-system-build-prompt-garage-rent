create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  phone text not null default '',
  role text not null check (role in ('admin', 'tenant')),
  created_at timestamp with time zone not null default timezone('utc', now())
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  owner_id uuid not null references public.users (id) on delete cascade
);

create table if not exists public.tenancies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  start_date date not null,
  advance_paid numeric not null default 0,
  monthly_rent numeric not null,
  status text not null
);

create table if not exists public.rent_payments (
  id uuid primary key default gen_random_uuid(),
  tenancy_id uuid not null references public.tenancies (id) on delete cascade,
  month text not null,
  amount numeric not null,
  status text not null check (status in ('paid', 'pending')),
  paid_on timestamp with time zone,
  constraint rent_payments_tenancy_month_key unique (tenancy_id, month)
);

create table if not exists public.electricity (
  id uuid primary key default gen_random_uuid(),
  tenancy_id uuid not null references public.tenancies (id) on delete cascade,
  initial_reading numeric not null,
  current_reading numeric not null,
  units_used numeric not null,
  bill_amount numeric not null,
  paid_on timestamp with time zone
);

create index if not exists tenancies_user_id_idx on public.tenancies (user_id);
create index if not exists tenancies_property_id_idx on public.tenancies (property_id);
create index if not exists rent_payments_tenancy_id_idx on public.rent_payments (tenancy_id);
create index if not exists electricity_tenancy_id_idx on public.electricity (tenancy_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    case
      when coalesce(new.raw_user_meta_data ->> 'role', 'tenant') = 'admin' then 'admin'
      else 'tenant'
    end
  )
  on conflict (id) do update
  set
    name = excluded.name,
    phone = excluded.phone,
    role = excluded.role;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.sync_rent_payments_for_tenancy(target_tenancy uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  tenancy_record public.tenancies%rowtype;
  month_cursor date;
  current_month date := date_trunc('month', current_date)::date;
begin
  select * into tenancy_record
  from public.tenancies
  where id = target_tenancy;

  if tenancy_record.id is null or tenancy_record.status = 'inactive' then
    return;
  end if;

  month_cursor := date_trunc('month', tenancy_record.start_date)::date;

  while month_cursor <= current_month loop
    insert into public.rent_payments (tenancy_id, month, amount, status, paid_on)
    values (
      tenancy_record.id,
      to_char(month_cursor, 'YYYY-MM'),
      tenancy_record.monthly_rent,
      'pending',
      null
    )
    on conflict (tenancy_id, month) do nothing;

    month_cursor := (month_cursor + interval '1 month')::date;
  end loop;
end;
$$;

create or replace function public.sync_all_rent_payments()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  tenancy_record record;
begin
  for tenancy_record in select id from public.tenancies where status <> 'inactive'
  loop
    perform public.sync_rent_payments_for_tenancy(tenancy_record.id);
  end loop;
end;
$$;

create or replace function public.handle_tenancy_rent_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.sync_rent_payments_for_tenancy(new.id);
  return new;
end;
$$;

drop trigger if exists on_tenancy_sync on public.tenancies;
create trigger on_tenancy_sync
after insert or update of start_date, monthly_rent, status on public.tenancies
for each row execute procedure public.handle_tenancy_rent_sync();

alter table public.users enable row level security;
alter table public.properties enable row level security;
alter table public.tenancies enable row level security;
alter table public.rent_payments enable row level security;
alter table public.electricity enable row level security;

drop policy if exists "users select self or admin" on public.users;
create policy "users select self or admin"
on public.users for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "users update self or admin" on public.users;
create policy "users update self or admin"
on public.users for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "users insert admin" on public.users;
create policy "users insert admin"
on public.users for insert
with check (public.is_admin());

drop policy if exists "properties read scope" on public.properties;
create policy "properties read scope"
on public.properties for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.tenancies
    where tenancies.property_id = properties.id
      and tenancies.user_id = auth.uid()
  )
);

drop policy if exists "properties admin write" on public.properties;
create policy "properties admin write"
on public.properties for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "tenancies read scope" on public.tenancies;
create policy "tenancies read scope"
on public.tenancies for select
using (public.is_admin() or user_id = auth.uid());

drop policy if exists "tenancies admin write" on public.tenancies;
create policy "tenancies admin write"
on public.tenancies for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "rent payments read scope" on public.rent_payments;
create policy "rent payments read scope"
on public.rent_payments for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.tenancies
    where tenancies.id = rent_payments.tenancy_id
      and tenancies.user_id = auth.uid()
  )
);

drop policy if exists "rent payments admin write" on public.rent_payments;
create policy "rent payments admin write"
on public.rent_payments for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "electricity read scope" on public.electricity;
create policy "electricity read scope"
on public.electricity for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.tenancies
    where tenancies.id = electricity.tenancy_id
      and tenancies.user_id = auth.uid()
  )
);

drop policy if exists "electricity admin write" on public.electricity;
create policy "electricity admin write"
on public.electricity for all
using (public.is_admin())
with check (public.is_admin());

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'users'
  ) then
    alter publication supabase_realtime add table public.users;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'properties'
  ) then
    alter publication supabase_realtime add table public.properties;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'tenancies'
  ) then
    alter publication supabase_realtime add table public.tenancies;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'rent_payments'
  ) then
    alter publication supabase_realtime add table public.rent_payments;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'electricity'
  ) then
    alter publication supabase_realtime add table public.electricity;
  end if;
end $$;
