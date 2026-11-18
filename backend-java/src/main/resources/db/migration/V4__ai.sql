CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE legal_documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    act_name        VARCHAR(512) NOT NULL,
    section_number  VARCHAR(64) NOT NULL,
    source_url      VARCHAR(1024),
    content         TEXT NOT NULL,
    embedding       vector(1536),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_legal_documents_act ON legal_documents (act_name);

CREATE TABLE ai_conversations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    distress_flagged    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_messages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     UUID NOT NULL REFERENCES ai_conversations (id) ON DELETE CASCADE,
    sender_type         VARCHAR(32) NOT NULL,
    content             TEXT NOT NULL,
    citations_json      JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ai_messages_sender_type_check CHECK (sender_type IN ('USER', 'ASSISTANT', 'SYSTEM'))
);