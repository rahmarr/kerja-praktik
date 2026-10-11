-- ============================================================
-- DIGITAK - SQLite Schema
-- PT Metanouva Informatika
-- Sumber: Dokumentasi Database & REST API Digitak (KP 2026)
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'admin',
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at    TEXT
);

CREATE TABLE IF NOT EXISTS services (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active   INTEGER NOT NULL DEFAULT 1,
    created_by  INTEGER REFERENCES users(id),
    updated_by  INTEGER REFERENCES users(id),
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at  TEXT
);

CREATE TABLE IF NOT EXISTS service_requests (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    request_code      TEXT NOT NULL UNIQUE,
    customer_name     TEXT NOT NULL,
    customer_type     TEXT NOT NULL,
    organization_name TEXT,
    email             TEXT NOT NULL,
    phone             TEXT,
    service_id        INTEGER NOT NULL REFERENCES services(id),
    description       TEXT NOT NULL,
    status            TEXT NOT NULL DEFAULT 'Menunggu Ditinjau',
    admin_response    TEXT,
    created_at        TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at        TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at        TEXT
);

CREATE TABLE IF NOT EXISTS request_history (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id     INTEGER NOT NULL REFERENCES service_requests(id),
    old_status     TEXT,
    new_status     TEXT NOT NULL,
    admin_response TEXT,
    changed_by     INTEGER REFERENCES users(id),
    created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    status        TEXT NOT NULL DEFAULT 'subscribed',
    subscribed_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contents (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    slug         TEXT NOT NULL UNIQUE,
    category     TEXT NOT NULL,
    body         TEXT NOT NULL,
    image_url    TEXT,
    is_published INTEGER NOT NULL DEFAULT 0,
    created_by   INTEGER REFERENCES users(id),
    updated_by   INTEGER REFERENCES users(id),
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at   TEXT
);

CREATE INDEX IF NOT EXISTS idx_service_requests_service ON service_requests(service_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status  ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_request_history_request  ON request_history(request_id);
CREATE INDEX IF NOT EXISTS idx_contents_category        ON contents(category);
CREATE INDEX IF NOT EXISTS idx_contents_slug            ON contents(slug);