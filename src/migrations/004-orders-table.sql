-- First, drop the table with foreign key references
DROP TABLE IF EXISTS public.order_menus;

-- Then drop the referenced table
DROP TABLE IF EXISTS public.orders;

-- Now recreate the tables
create table public.orders (
  id serial not null,
  customer_name text,
  status text,
  payment_token text,
  table_id integer references tables on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

alter table public.orders enable row level security;

create table public.order_menus (
  id serial not null,
  order_id integer references orders on delete set null,
  menu_id integer references menus on delete set null,
  status text,
  quantity integer,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

alter table public.order_menus enable row level security;

-- Create Data

-- Insert ke tabel orders
INSERT INTO public.orders (customer_name, status, payment_token, table_id)
VALUES
('John Doe', 'pending', 'https://payment.example.com/order/1', 1),
('Jane Smith', 'paid', 'https://payment.example.com/order/2', 2),
('Michael Lee', 'completed', 'https://payment.example.com/order/3', 3),
('Sarah Connor', 'cancelled', 'https://payment.example.com/order/4', 4),
('David Kim', 'pending', 'https://payment.example.com/order/5', 1);

-- Insert ke tabel order_menus
INSERT INTO public.order_menus (order_id, menu_id, status, quantity, notes)
VALUES
(1, 1, 'pending', 2, 'Extra spicy'),
(1, 3, 'pending', 1, NULL),
(2, 2, 'served', 1, 'No onions'),
(3, 5, 'served', 2, NULL),
(3, 6, 'served', 1, 'Well done'),
(4, 4, 'cancelled', 1, 'Out of stock'),
(5, 1, 'pending', 1, 'Less sugar');