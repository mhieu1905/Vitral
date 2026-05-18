-- Create enum types for specific fields to ensure data integrity
CREATE TYPE health_goal AS ENUM ('lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle', 'improve_fitness');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE activity_level_type AS ENUM ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active');

-- Create the user_health_profiles table
CREATE TABLE IF NOT EXISTS user_health_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Assuming this references an auth.users or similar table in Supabase
    goal health_goal NOT NULL,
    height_cm NUMERIC(5, 2) NOT NULL, -- Example: 175.50
    weight_kg NUMERIC(5, 2) NOT NULL, -- Example: 70.20
    age INTEGER NOT NULL CHECK (age > 0),
    gender gender_type NOT NULL,
    activity_level activity_level_type NOT NULL,
    tdee NUMERIC(7, 2), -- Total Daily Energy Expenditure
    calorie_goal NUMERIC(7, 2),
    notification_enabled BOOLEAN DEFAULT false,
    reminder_time TIME, -- Time of day for reminders
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add a comment to the table
COMMENT ON TABLE user_health_profiles IS 'Stores user health data, goals, and onboarding settings.';

-- Create an index on user_id for faster lookups (assuming one profile per user or querying by user)
CREATE INDEX IF NOT EXISTS idx_user_health_profiles_user_id ON user_health_profiles(user_id);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_health_profiles_updated_at
    BEFORE UPDATE ON user_health_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Add Row Level Security (RLS) policies
-- ALTER TABLE user_health_profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view their own health profile" ON user_health_profiles FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert their own health profile" ON user_health_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Users can update their own health profile" ON user_health_profiles FOR UPDATE USING (auth.uid() = user_id);
