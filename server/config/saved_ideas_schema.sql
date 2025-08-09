-- Create saved_ideas table to store user's bookmarked business ideas
CREATE TABLE IF NOT EXISTS saved_ideas (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  idea_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, idea_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_ideas_user_id ON saved_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_ideas_idea_id ON saved_ideas(idea_id);
