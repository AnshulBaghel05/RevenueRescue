-- Create shopify_connections table to store OAuth tokens
CREATE TABLE IF NOT EXISTS shopify_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_domain TEXT NOT NULL,
  access_token TEXT NOT NULL,
  scopes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, shop_domain)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_shopify_connections_user_id ON shopify_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_shopify_connections_shop_domain ON shopify_connections(shop_domain);

-- Enable Row Level Security
ALTER TABLE shopify_connections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own Shopify connections"
  ON shopify_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Shopify connections"
  ON shopify_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Shopify connections"
  ON shopify_connections FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Shopify connections"
  ON shopify_connections FOR DELETE
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_shopify_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shopify_connections_updated_at
  BEFORE UPDATE ON shopify_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_shopify_connections_updated_at();
