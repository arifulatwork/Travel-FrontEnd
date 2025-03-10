-- Remove demo user and related data
DO $$
BEGIN
  -- Delete from profiles first due to foreign key constraints
  DELETE FROM public.profiles
  WHERE username = 'demouser';

  -- Delete from auth.identities
  DELETE FROM auth.identities 
  WHERE identity_data->>'email' = 'user@example.com';

  -- Delete from auth.users
  DELETE FROM auth.users
  WHERE email = 'user@example.com';
END $$;