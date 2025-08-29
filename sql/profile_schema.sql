-- Profile data storage options for Supabase

-- OPTION 1: Using Supabase Auth User Metadata (Current Implementation)
-- Profile data is stored in the auth.users table in the raw_user_meta_data JSONB column

-- Example of how profile data is stored in raw_user_meta_data:
-- {
--   "full_name": "John Doe",
--   "gender": "male",
--   "timezone": "America/New_York",
--   "bio": "Software developer and note-taking enthusiast",
--   "phone": "+1234567890",
--   "website": "https://johndoe.com",
--   "location": "New York, USA",
--   "avatar_url": "https://example.com/avatar.jpg"
-- }

-- Query to retrieve user profile data
-- Replace 'USER_ID_HERE' with an actual UUID when executing
-- Example:
/*
SELECT 
    id,
    email,
    raw_user_meta_data->>'full_name' as full_name,
    raw_user_meta_data->>'gender' as gender,
    raw_user_meta_data->>'timezone' as timezone,
    raw_user_meta_data->>'bio' as bio,
    raw_user_meta_data->>'phone' as phone,
    raw_user_meta_data->>'website' as website,
    raw_user_meta_data->>'location' as location,
    raw_user_meta_data->>'avatar_url' as avatar_url
FROM auth.users 
WHERE id = 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8';
*/

-- Update user profile data (typically done through Supabase auth API)
-- Example raw SQL update (for reference only):
/*
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"full_name": "John Doe", "gender": "male", "avatar_url": "https://example.com/avatar.jpg"}'::jsonb
WHERE id = 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8';
*/


-- OPTION 2: Separate Profiles Table (Alternative Implementation)
-- Create a dedicated profiles table for more complex profile management

-- Add avatar_url column to existing profiles table if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies (using IF NOT EXISTS to avoid errors if policies already exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile" 
        ON public.profiles FOR SELECT 
        USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile" 
        ON public.profiles FOR UPDATE 
        USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile" 
        ON public.profiles FOR INSERT 
        WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create a profile when a user signs up (using IF NOT EXISTS)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

