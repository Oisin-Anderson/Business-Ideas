const pool = require('../config/database');

// Initialize database table
async function initializeDatabase() {
  try {
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '../config/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database schema:', error);
    throw error;
  }
}

// Add a user to the database
async function addUser(user) {
  try {
    const { email, password, google_id } = user;
    
    const query = `
      INSERT INTO users (email, password, google_id)
      VALUES ($1, $2, $3)
      RETURNING id, email, google_id, subscription_status, stripe_customer_id, 
                subscription_renewal_date, subscription_expiry_date, created_at
    `;
    
    const values = [email, password, google_id];
    const result = await pool.query(query, values);
    
    console.log(`✅ User added: ${email}`);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error adding user:', error);
    throw error;
  }
}

// Update a user in the database
async function updateUser(userId, updates) {
  try {
    const setClause = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    Object.keys(updates).forEach(key => {
      if (key !== 'id') { // Don't allow updating the ID
        setClause.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (setClause.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(userId);
    const query = `
      UPDATE users 
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, google_id, subscription_status, stripe_customer_id, 
                subscription_renewal_date, subscription_expiry_date, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }

    console.log(`✅ User updated: ID ${userId}`);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error updating user:', error);
    throw error;
  }
}

// Find user by ID
async function findUserById(userId) {
  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('❌ Error finding user by ID:', error);
    throw error;
  }
}

// Find user by email
async function findUserByEmail(email) {
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('❌ Error finding user by email:', error);
    throw error;
  }
}

// Find user by Google ID
async function findUserByGoogleId(googleId) {
  try {
    const query = 'SELECT * FROM users WHERE google_id = $1';
    const result = await pool.query(query, [googleId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('❌ Error finding user by Google ID:', error);
    throw error;
  }
}

// Get all users (for admin purposes)
async function getAllUsers() {
  try {
    const query = 'SELECT id, email, subscription_status, created_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('❌ Error getting all users:', error);
    throw error;
  }
}

// Update user subscription status with dates
async function updateUserSubscription(userId, subscriptionData) {
  try {
    const { 
      subscriptionStatus, 
      subscriptionId = null, 
      renewalDate = null, 
      expiryDate = null 
    } = subscriptionData;

    const query = `
      UPDATE users 
      SET subscription_status = $1, 
          subscription_id = $2, 
          subscription_renewal_date = $3, 
          subscription_expiry_date = $4
      WHERE id = $5
      RETURNING id, email, subscription_status, subscription_id, 
                subscription_renewal_date, subscription_expiry_date
    `;
    
    const result = await pool.query(query, [
      subscriptionStatus, 
      subscriptionId, 
      renewalDate, 
      expiryDate, 
      userId
    ]);
    
    if (result.rows.length === 0) {
      return null;
    }

    console.log(`✅ User subscription updated: ID ${userId} -> ${subscriptionStatus}`);
    if (renewalDate) console.log(`   Renewal Date: ${renewalDate}`);
    if (expiryDate) console.log(`   Expiry Date: ${expiryDate}`);
    
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error updating user subscription:', error);
    throw error;
  }
}

// Delete a user (for admin purposes)
async function deleteUser(userId) {
  try {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id, email';
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    console.log(`✅ User deleted: ID ${userId}`);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw error;
  }
}

// Add a saved idea for a user
async function addSavedIdea(userId, ideaId) {
  try {
    const query = `
      INSERT INTO saved_ideas (user_id, idea_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, idea_id) DO NOTHING
      RETURNING id, user_id, idea_id, created_at
    `;
    
    const result = await pool.query(query, [userId, ideaId]);
    
    if (result.rows.length > 0) {
      console.log(`✅ Idea ${ideaId} saved for user ${userId}`);
      return result.rows[0];
    } else {
      console.log(`ℹ️ Idea ${ideaId} already saved for user ${userId}`);
      return { already_saved: true };
    }
  } catch (error) {
    console.error('❌ Error saving idea:', error);
    throw error;
  }
}

// Remove a saved idea for a user
async function removeSavedIdea(userId, ideaId) {
  try {
    const query = `
      DELETE FROM saved_ideas 
      WHERE user_id = $1 AND idea_id = $2
      RETURNING id, idea_id
    `;
    
    const result = await pool.query(query, [userId, ideaId]);
    
    if (result.rows.length > 0) {
      console.log(`✅ Idea ${ideaId} removed from saved for user ${userId}`);
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('❌ Error removing saved idea:', error);
    throw error;
  }
}

// Get all saved ideas for a user
async function getSavedIdeas(userId) {
  try {
    const query = `
      SELECT idea_id, created_at 
      FROM saved_ideas 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    console.log(`✅ Retrieved ${result.rows.length} saved ideas for user ${userId}`);
    return result.rows;
  } catch (error) {
    console.error('❌ Error getting saved ideas:', error);
    throw error;
  }
}

// Check if an idea is saved by a user
async function isIdeaSaved(userId, ideaId) {
  try {
    const query = `
      SELECT id FROM saved_ideas 
      WHERE user_id = $1 AND idea_id = $2
    `;
    
    const result = await pool.query(query, [userId, ideaId]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('❌ Error checking if idea is saved:', error);
    throw error;
  }
}

// Initialize database on module load
initializeDatabase().catch((error) => {
  console.error('❌ Failed to initialize database:', error);
  console.error('Error details:', {
    message: error.message,
    code: error.code,
    detail: error.detail,
    hint: error.hint
  });
});

module.exports = {
  addUser,
  updateUser,
  findUserById,
  findUserByEmail,
  findUserByGoogleId,
  getAllUsers,
  updateUserSubscription,
  deleteUser,
  initializeDatabase,
  // Saved ideas functions
  addSavedIdea,
  removeSavedIdea,
  getSavedIdeas,
  isIdeaSaved
}; 