-- Add price column to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS estimated_price decimal(10, 2) DEFAULT 0;

-- Add index for better performance on price queries
CREATE INDEX IF NOT EXISTS idx_appointments_price ON appointments(estimated_price);
