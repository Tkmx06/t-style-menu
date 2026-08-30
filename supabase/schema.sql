create extension if not exists "pgcrypto";

create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  description text,
  image_url text not null,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('published','archived')),
  focal_x numeric not null default 0.5 check (focal_x >= 0 and focal_x <= 1),
  focal_y numeric not null default 0.5 check (focal_y >= 0 and focal_y <= 1),
  zoom numeric not null default 1 check (zoom >= 1 and zoom <= 3),
  created_at timestamptz not null default now()
);

create index if not exists dishes_category_idx on dishes (category, sort_order);

alter table dishes enable row level security;

-- Anyone can read the menu (used by the public site).
create policy "public read" on dishes
  for select
  using (true);

-- Inserts/updates/deletes only happen server-side via the service role key
-- (used in the admin upload route), so no public write policy is defined.

-- Storage: create a public bucket named "dish-photos" from the Supabase
-- dashboard (Storage -> New bucket -> Public bucket). No SQL needed for that.
