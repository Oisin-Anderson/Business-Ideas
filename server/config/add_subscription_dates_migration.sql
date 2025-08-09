-- Migration: Add subscription date columns to users table
-- Run this in Supabase SQL Editor

-- Add new columns for subscription dates
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_renewal_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS subscription_expiry_date TIMESTAMP;

-- Add comments to document the fields
COMMENT ON COLUMN users.subscription_renewal_date IS 'Date when the subscription will next renew (for recurring subscriptions)';
COMMENT ON COLUMN users.subscription_expiry_date IS 'Date when the subscription expires (for both recurring and lifetime subscriptions)';

-- For lifetime subscriptions, expiry_date should be NULL or far future
-- For recurring subscriptions, both renewal_date and expiry_date should be set
