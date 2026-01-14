# Database Setup

This project uses **SQLite** for data persistence, which is perfect for Electron desktop applications.

## Database Schema

The database schema is defined in `schema.sql`. The main table is:

### `todos` table
- `id` (TEXT, PRIMARY KEY) - Unique identifier for each todo
- `text` (TEXT, NOT NULL) - The todo text content
- `completed` (INTEGER, NOT NULL, DEFAULT 0) - Boolean flag (0 = false, 1 = true)
- `priority` (TEXT, NOT NULL, DEFAULT 'medium') - Priority level: 'low', 'medium', or 'high'
- `created_at` (TEXT, NOT NULL) - ISO 8601 timestamp
- `updated_at` (TEXT, NOT NULL) - ISO 8601 timestamp (auto-updated)

## Database Location

In Electron, the database is stored in the user's app data directory:
- **Windows**: `%APPDATA%/scribble-tasks/scribble-tasks.db`
- **macOS**: `~/Library/Application Support/scribble-tasks/scribble-tasks.db`
- **Linux**: `~/.config/scribble-tasks/scribble-tasks.db`

## Features

- **Automatic schema initialization** - The database schema is created automatically on first run
- **WAL mode** - Write-Ahead Logging enabled for better concurrency
- **Indexes** - Optimized indexes on `completed`, `priority`, and `created_at` columns
- **Auto-update timestamps** - `updated_at` is automatically updated when a todo changes

## PostgreSQL Alternative

If you prefer PostgreSQL, see `schema-postgres.sql` for the PostgreSQL version of the schema. You would need to:
1. Set up a PostgreSQL database
2. Update the database connection code in `db.ts`
3. Configure connection details in `.env`

## Usage

The database is automatically initialized when the Electron app starts. No manual setup required!

