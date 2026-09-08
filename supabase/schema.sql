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
  rotation numeric not null default 0 check (rotation >= -45 and rotation <= 45),
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

-- Site-wide settings, kept as a single row (id = 'main'). Currently used for
-- the Instagram post IDs shown on the homepage embed (edited from
-- /admin/settings); more fields (address/hours/about text etc.) may be
-- added later.
create table if not exists site_content (
  id text primary key default 'main',
  address text not null default '',
  phone text not null default '',
  hours_ja text not null default '',
  hours_de text not null default '',
  hours_en text not null default '',
  about_ja text not null default '',
  about_de text not null default '',
  about_en text not null default '',
  reservation_url text not null default '',
  instagram_post_ids text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

-- Anyone can read site settings (used by the public homepage).
create policy "Anyone can read site content" on site_content
  for select
  using (true);

-- Writes only happen server-side via the service role key (used in the
-- admin settings API route), so no public write policy is defined. Do not
-- add public insert/update policies here — a previous version of this table
-- allowed anonymous writes (and even stored a plaintext admin password),
-- which let anyone with the public anon key rewrite site content.
