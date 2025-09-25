
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    health_conditions TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pharmacy_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    drug_name TEXT NOT NULL,
    category TEXT,
    tags TEXT[],
    added_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    author_id UUID REFERENCES users(id),
    image_url TEXT,
    published_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX ON profiles (user_id);
CREATE INDEX ON pharmacy_items (user_id);
CREATE INDEX ON blog_posts (slug);
CREATE INDEX ON blog_posts (author_id);

