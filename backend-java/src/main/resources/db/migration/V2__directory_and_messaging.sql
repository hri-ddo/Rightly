CREATE TABLE professional_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    display_name    VARCHAR(255) NOT NULL,
    district        VARCHAR(128) NOT NULL,
    specialty       VARCHAR(255) NOT NULL,
    fee_bdt         INTEGER NOT NULL DEFAULT 0,
    languages       VARCHAR(512) NOT NULL DEFAULT 'Bengali',
    bio             TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_professional_profiles_district ON professional_profiles (district);
CREATE INDEX idx_professional_profiles_specialty ON professional_profiles (specialty);
CREATE INDEX idx_professional_profiles_fee ON professional_profiles (fee_bdt);

CREATE TABLE availability_slots (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id     UUID NOT NULL REFERENCES professional_profiles (id) ON DELETE CASCADE,
    start_time_utc      TIMESTAMPTZ NOT NULL,
    end_time_utc        TIMESTAMPTZ NOT NULL,
    booked              BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_availability_professional ON availability_slots (professional_id);

CREATE TABLE threads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_a   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    participant_b   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT threads_distinct_participants CHECK (participant_a <> participant_b),
    CONSTRAINT threads_pair_unique UNIQUE (participant_a, participant_b)
);

CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id       UUID NOT NULL REFERENCES threads (id) ON DELETE CASCADE,
    sender_id       UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    body            TEXT NOT NULL,
    sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_thread ON messages (thread_id, sent_at);

CREATE TABLE meetings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id         UUID REFERENCES availability_slots (id) ON DELETE SET NULL,
    requester_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES professional_profiles (id) ON DELETE CASCADE,
    status          VARCHAR(32) NOT NULL DEFAULT 'REQUESTED',
    room_code       VARCHAR(64),
    reminder_sent   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT meetings_status_check CHECK (status IN ('REQUESTED', 'ACCEPTED', 'DECLINED'))
);