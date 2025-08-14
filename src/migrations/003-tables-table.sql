-- DROP TABLE public.tables;

create table public.tables (
  id serial not null,
  name text,
  description text,
  capacity numeric,
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

alter table public.tables enable row level security;

-- Insert data meja awal
INSERT INTO public.tables (name, description, capacity, status)
VALUES
  ('Meja 1', 'Dekat jendela, cocok buat 2 orang', 2, 'available'),
  ('Meja 2', 'Di pojok, privasi tinggi', 4, 'available'),
  ('Meja 3', 'Dekat barista, suasana ramai', 2, 'occupied'),
  ('Meja 4', 'Area luar, cocok buat smoking area', 4, 'available'),
  ('Meja 5', 'Meja besar untuk grup', 6, 'reserved');