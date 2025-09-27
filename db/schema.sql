-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  health_conditions text[],
  onboarding_completed boolean default false
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up
-- See https://supabase.com/docs/guides/auth/managing-user-data
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a table for drugs
create table drugs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  brandName text,
  activeIngredients jsonb,
  category text,
  tags text[],
  summary text,
  sideEffects text,
  addedAt timestamp with time zone default timezone('utc'::text, now()) not null,
  isTaking boolean,
  frequency text,
  startDate text
);

-- Set up Row Level Security (RLS) for drugs table
alter table drugs
  enable row level security;

create policy "Users can view their own drugs." on drugs
  for select using (auth.uid() = user_id);

create policy "Users can insert their own drugs." on drugs
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own drugs." on drugs
  for update using (auth.uid() = user_id);

create policy "Users can delete their own drugs." on drugs
  for delete using (auth.uid() = user_id);

-- Enable realtime for drugs table
alter publication supabase_realtime add table drugs;

