CREATE TABLE notes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id    UUID NOT NULL,
    title       VARCHAR(255) NOT NULL,
    content     TEXT,
    created_by  UUID NOT NULL,
    updated_by  UUID,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_notes_group_id
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_notes_created_by
        FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_notes_updated_by
        FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE INDEX idx_notes_group_id ON notes(group_id);
CREATE INDEX idx_notes_created_by ON notes(created_by);
