CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
    

CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_by UUID NOT NULL,
    group_avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_groups_created_by 
        FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_group_created_by ON groups(created_by);

CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_group_members_group
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_group_members_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_group_id_user_id UNIQUE (group_id, user_id),
    CONSTRAINT check_role CHECK (role IN ('OWNER', 'MEMBER'))
);

CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);

CREATE TABLE invite_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    token VARCHAR(255) NOT NULL,
    invited_by UUID NOT NULL,
    invited_email VARCHAR(255),
    role VARCHAR(20)NOT NULL DEFAULT 'MEMBER',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    used_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_invite_tokens_group
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_invite_tokens_invited_by
        FOREIGN KEY (invited_by) REFERENCES users(id),
    CONSTRAINT fk_invite_tokens_used_by
        FOREIGN KEY (used_by) REFERENCES users(id),
    CONSTRAINT check_invite_token_role CHECK (role IN ('OWNER', 'MEMBER'))
);

CREATE INDEX idx_invite_tokens_token ON invite_tokens(token);
CREATE INDEX idx_invite_tokens_group_id ON invite_tokens(group_id);

CREATE TABLE bills_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_catergory_id UUID NOT NULL,
    group_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    bill_month DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,

    CONSTRAINT fk_bills_bill_catergory_id
        FOREIGN KEY (bill_catergory_id) REFERENCES bills_categories(id),
    CONSTRAINT fk_bills_group_id
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_bills_created_by
        FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT check_bills_amount CHECK (amount > 0)
);

CREATE INDEX idx_bills_group_id ON bills(group_id);
CREATE INDEX idx_bills_created_by ON bills(created_by);
CREATE INDEX idx_bills_bill_month ON bills(bill_month);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    color VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_events_group_id
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_events_owner_id
        FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE INDEX idx_events_group_id ON events(group_id);
CREATE INDEX idx_events_owner_id ON events(owner_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_end_date ON events(end_date);