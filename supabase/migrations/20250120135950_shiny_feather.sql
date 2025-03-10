/*
  # Initial Travel Platform Schema

  1. New Tables
    - profiles (extends auth.users)
      - Basic user profile information
      - Preferences and settings
    - destinations
      - Travel destinations with details
    - activities
      - Tours, attractions, and experiences
    - bookings
      - Activity and tour bookings
    - schedules
      - User's weekly activity schedules
    - messages
      - Chat system between users
    - connections
      - User connections/travel buddies
    - reviews
      - User reviews for activities
    - notifications
      - System notifications
  
  2. Security
    - RLS policies for all tables
    - Secure user data access
    - Protected booking information
    - Controlled messaging system

  3. Features
    - Real-time chat capabilities
    - Schedule management
    - Booking system
    - Social networking
    - Review system
*/

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username citext unique,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  languages text[],
  interests text[],
  occupation text,
  settings jsonb default '{
    "notifications": {
      "push": true,
      "email": true,
      "marketing": false
    },
    "appearance": {
      "darkMode": false,
      "fontSize": "medium"
    },
    "language": "en",
    "currency": "EUR"
  }'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Destinations table
create table public.destinations (
  id uuid primary key default uuid_generate_v4(),
  country text not null,
  city text not null,
  description text,
  coordinates point,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Activities table
create table public.activities (
  id uuid primary key default uuid_generate_v4(),
  destination_id uuid references public.destinations on delete cascade,
  title text not null,
  description text,
  type text not null check (type in ('tour', 'attraction', 'restaurant', 'custom')),
  price decimal(10,2),
  group_price decimal(10,2),
  min_group_size int,
  max_group_size int,
  duration interval,
  location text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bookings table
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  activity_id uuid references public.activities on delete cascade not null,
  booking_date date not null,
  start_time time not null,
  participants int not null default 1,
  total_price decimal(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  special_requests text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Schedules table
create table public.schedules (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  day_of_week text not null check (day_of_week in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  activity_id uuid references public.activities on delete cascade,
  custom_title text,
  custom_location text,
  start_time time not null,
  duration interval not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references auth.users on delete cascade not null,
  receiver_id uuid references auth.users on delete cascade not null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Connections table
create table public.connections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  connected_user_id uuid references auth.users on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint unique_connection unique (user_id, connected_user_id)
);

-- Reviews table
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  activity_id uuid references public.activities on delete cascade not null,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint one_review_per_activity unique (user_id, activity_id)
);

-- Notifications table
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  type text not null check (type in ('booking', 'connection', 'message', 'system')),
  title text not null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.activities enable row level security;
alter table public.bookings enable row level security;
alter table public.schedules enable row level security;
alter table public.messages enable row level security;
alter table public.connections enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Destinations policies
create policy "Destinations are viewable by everyone"
  on public.destinations for select
  using (true);

create policy "Only admins can modify destinations"
  on public.destinations for all
  using (auth.role() = 'admin');

-- Activities policies
create policy "Activities are viewable by everyone"
  on public.activities for select
  using (true);

create policy "Only admins can modify activities"
  on public.activities for all
  using (auth.role() = 'admin');

-- Bookings policies
create policy "Users can view own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bookings"
  on public.bookings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Schedules policies
create policy "Users can view own schedule"
  on public.schedules for select
  using (auth.uid() = user_id);

create policy "Users can insert into own schedule"
  on public.schedules for insert
  with check (auth.uid() = user_id);

create policy "Users can update own schedule"
  on public.schedules for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete from own schedule"
  on public.schedules for delete
  using (auth.uid() = user_id);

-- Messages policies
create policy "Users can view own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- Connections policies
create policy "Users can view own connections"
  on public.connections for select
  using (auth.uid() = user_id or auth.uid() = connected_user_id);

create policy "Users can insert own connections"
  on public.connections for insert
  with check (auth.uid() = user_id);

create policy "Users can update own connections"
  on public.connections for update
  using (auth.uid() = user_id or auth.uid() = connected_user_id)
  with check (auth.uid() = user_id or auth.uid() = connected_user_id);

-- Reviews policies
create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Users can insert own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Notifications policies
create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "System can insert notifications"
  on public.notifications for insert
  with check (true);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create indexes for better performance
create index idx_profiles_username on public.profiles (username);
create index idx_destinations_city on public.destinations (city);
create index idx_activities_type on public.activities (type);
create index idx_bookings_user on public.bookings (user_id);
create index idx_bookings_status on public.bookings (status);
create index idx_schedules_user_day on public.schedules (user_id, day_of_week);
create index idx_messages_participants on public.messages (sender_id, receiver_id);
create index idx_connections_users on public.connections (user_id, connected_user_id);
create index idx_reviews_activity on public.reviews (activity_id);
create index idx_notifications_user on public.notifications (user_id);

-- Create functions for real-time features
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to relevant tables
create trigger handle_updated_at_profiles
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_destinations
  before update on public.destinations
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_activities
  before update on public.activities
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_bookings
  before update on public.bookings
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_schedules
  before update on public.schedules
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_connections
  before update on public.connections
  for each row execute procedure public.handle_updated_at();