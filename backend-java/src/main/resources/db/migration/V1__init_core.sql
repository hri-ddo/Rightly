CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(32),
    role            VARCHAR(32) NOT NULL DEFAULT 'USER',
    verification_status VARCHAR(32) NOT NULL DEFAULT 'UNVERIFIED',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_phone_unique UNIQUE (phone),
    CONSTRAINT users_role_check CHECK (role IN ('USER', 'LAWYER', 'PSYCHIATRIST')),
    CONSTRAINT users_verification_status_check CHECK (
        verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED')
    ),
    CONSTRAINT users_contact_check CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_verification_status ON users (verification_status);