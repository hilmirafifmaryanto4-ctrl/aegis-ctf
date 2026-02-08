-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- 1. Tabel Pengguna (users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    total_score INTEGER DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Membuat index untuk performa query
CREATE INDEX idx_users_total_score ON users(total_score DESC);
CREATE INDEX idx_users_username ON users(username);

-- 2. Tabel Kategori (categories)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#00FFFF',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data awal kategori
INSERT INTO categories (name, slug, color) VALUES
('Web', 'web', '#00FFFF'),
('Cryptography', 'crypto', '#8B5CF6'),
('Pwn', 'pwn', '#EF4444'),
('Reverse Engineering', 'reverse', '#F59E0B'),
('Forensics', 'forensics', '#10B981');

-- 3. Tabel Tantangan (challenges)
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    points INTEGER NOT NULL CHECK (points > 0),
    flag VARCHAR(255) NOT NULL,
    file_url VARCHAR(500),
    solves_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_challenges_category ON challenges(category_id);
CREATE INDEX idx_challenges_points ON challenges(points DESC);
CREATE INDEX idx_challenges_active ON challenges(is_active);

-- 4. Tabel Solves (solves)
CREATE TABLE solves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    solved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    points_earned INTEGER NOT NULL,
    UNIQUE(user_id, challenge_id)
);

CREATE INDEX idx_solves_user ON solves(user_id);
CREATE INDEX idx_solves_challenge ON solves(challenge_id);
CREATE INDEX idx_solves_time ON solves(solved_at DESC);

-- 5. Kebijakan Akses Row Level Security (RLS)

-- Kebijakan untuk tabel challenges
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pengguna dapat melihat tantangan aktif" ON challenges
    FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Admin dapat mengelola tantangan" ON challenges
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- Kebijakan untuk tabel users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pengguna dapat melihat profil sendiri" ON users
    FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Admin dapat melihat semua pengguna" ON users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- Kebijakan untuk tabel solves
ALTER TABLE solves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua dapat melihat solves" ON solves
    FOR SELECT
    USING (true);

CREATE POLICY "Pengguna dapat membuat solves sendiri" ON solves
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- 6. Fungsi Database untuk Update Skor
CREATE OR REPLACE FUNCTION update_user_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total skor pengguna
    UPDATE users 
    SET total_score = total_score + NEW.points_earned,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    
    -- Update solves count untuk tantangan
    UPDATE challenges 
    SET solves_count = solves_count + 1,
        updated_at = NOW()
    WHERE id = NEW.challenge_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk memanggil fungsi setelah insert solves
CREATE TRIGGER trigger_update_score
    AFTER INSERT ON solves
    FOR EACH ROW
    EXECUTE FUNCTION update_user_score();
