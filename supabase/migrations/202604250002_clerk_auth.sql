alter table public.users
drop constraint if exists users_id_fkey;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

alter table public.users
add column if not exists clerk_user_id text,
add column if not exists email text not null default '';

create unique index if not exists users_clerk_user_id_idx
on public.users (clerk_user_id)
where clerk_user_id is not null;

create unique index if not exists users_email_idx
on public.users (email)
where email <> '';

create or replace function public.requesting_clerk_user_id()
returns text
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'sub', '');
$$;

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
    where clerk_user_id = public.requesting_clerk_user_id()
      and role = 'admin'
  );
$$;

drop policy if exists "users select self or admin" on public.users;
create policy "users select self or admin"
on public.users for select
using (clerk_user_id = public.requesting_clerk_user_id() or public.is_admin());

drop policy if exists "users update self or admin" on public.users;
create policy "users update self or admin"
on public.users for update
using (clerk_user_id = public.requesting_clerk_user_id() or public.is_admin())
with check (clerk_user_id = public.requesting_clerk_user_id() or public.is_admin());

drop policy if exists "users insert self or admin" on public.users;
create policy "users insert self or admin"
on public.users for insert
with check (clerk_user_id = public.requesting_clerk_user_id() or public.is_admin());

drop policy if exists "users insert admin" on public.users;

drop policy if exists "properties read scope" on public.properties;
create policy "properties read scope"
on public.properties for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.tenancies
    join public.users on users.id = tenancies.user_id
    where tenancies.property_id = properties.id
      and users.clerk_user_id = public.requesting_clerk_user_id()
  )
);

drop policy if exists "tenancies read scope" on public.tenancies;
create policy "tenancies read scope"
on public.tenancies for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.users
    where users.id = tenancies.user_id
      and users.clerk_user_id = public.requesting_clerk_user_id()
  )
);

drop policy if exists "rent payments read scope" on public.rent_payments;
create policy "rent payments read scope"
on public.rent_payments for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.tenancies
    join public.users on users.id = tenancies.user_id
    where tenancies.id = rent_payments.tenancy_id
      and users.clerk_user_id = public.requesting_clerk_user_id()
  )
);

drop policy if exists "electricity read scope" on public.electricity;
create policy "electricity read scope"
on public.electricity for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.tenancies
    join public.users on users.id = tenancies.user_id
    where tenancies.id = electricity.tenancy_id
      and users.clerk_user_id = public.requesting_clerk_user_id()
  )
);
