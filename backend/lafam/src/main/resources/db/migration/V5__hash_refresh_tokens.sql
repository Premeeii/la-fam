-- Existing refresh tokens were JWTs. Renaming this column invalidates them,
-- so users must sign in again and receive the new opaque-token format.
ALTER TABLE refresh_tokens RENAME COLUMN token TO token_hash;

DROP INDEX IF EXISTS idx_refresh_tokens_token;
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
