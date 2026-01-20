CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    custom_fields JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS error_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    error_message TEXT NOT NULL,
    custom_fields JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT fk_project
      FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_error_log_error_message_fts 
ON error_log USING GIN (to_tsvector('english', error_message));

CREATE INDEX IF NOT EXISTS idx_error_log_project_id ON error_log(project_id);
CREATE INDEX IF NOT EXISTS idx_error_log_created_at ON error_log(created_at);

CREATE INDEX IF NOT EXISTS idx_projects_custom_fields_gin
  ON projects USING gin (custom_fields jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_error_log_custom_fields_gin
  ON error_log USING gin (custom_fields jsonb_path_ops);
