-- Create demo user with hashed password
DO $$
DECLARE
  demo_user_id uuid := gen_random_uuid();
  existing_user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_user_id
  FROM auth.users 
  WHERE email = 'user@example.com';

  IF existing_user_id IS NULL THEN
    -- Insert demo user into auth.users
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change_token_current,
      email_change_token_new,
      recovery_token,
      is_super_admin,
      confirmed_at
    )
    VALUES (
      demo_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'user@example.com',
      crypt('password123', gen_salt('bf')),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Demo User"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      '',
      false,
      NOW()
    );

    -- Create identities record
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(), -- Use a different UUID for identity
      demo_user_id,
      'email',
      jsonb_build_object(
        'sub', demo_user_id::text,
        'email', 'user@example.com'
      ),
      'email',
      NOW(),
      NOW(),
      NOW()
    );

    -- Create profile for demo user
    INSERT INTO public.profiles (
      id,
      username,
      full_name,
      avatar_url,
      preferences
    )
    SELECT
      demo_user_id,
      'demouser',
      'Demo User',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80',
      '{
        "climate": ["Mediterranean", "Tropical"],
        "groupSize": "couple",
        "travelStyle": ["Adventure", "Cultural"],
        "budget": "moderate",
        "seasonPreference": ["Spring", "Fall"],
        "activityLevel": "moderate",
        "interests": ["History", "Food", "Photography"]
      }'::jsonb
    WHERE NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = demo_user_id
    );
  END IF;
END $$;