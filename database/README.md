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

If you prefer PostgreSQL, see `schema-postgres.sql` for the PostgreSQL version of the todos schema, and `schema-bible-postgres.sql` for the Bible verses schema. You would need to:
1. Set up a PostgreSQL database
2. Update the database connection code in `db.ts`
3. Configure connection details in `.env`
4. Use `schema-bible-postgres.sql` instead of `schema-bible.sql` for Bible verses

**Note:** The main schema files (`schema.sql` and `schema-bible.sql`) are for SQLite (used by default in Electron). If you're using PostgreSQL, make sure to use the `-postgres.sql` versions.

## Usage

The database is automatically initialized when the Electron app starts. No manual setup required!

## Seeding Bible Verses (PostgreSQL)

If you're using PostgreSQL and want to seed the Bible verses table:

### Option 1: Using SQL Script
```bash
psql -U your_username -d scribble_tasks -f database/seed-bible-verses.sql
```

### Option 2: Using Node.js Script
```bash
# Make sure pg package is installed
npm install pg

# Set environment variables (optional, defaults shown)
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=scribble_tasks
export DB_USER=postgres
export DB_PASSWORD=your_password

# Run the seed script
node database/seed-bible-verses.js
```

The script will:
- Check if verses already exist (won't duplicate)
- Insert 15 motivational Bible verses
- Show a summary of inserted verses by category

