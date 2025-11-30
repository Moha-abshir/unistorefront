import User from '../models/User.js';

/**
 * Run all database migrations
 */
export const runMigrations = async () => {
  try {
    console.log('🔄 Running database migrations...');
    
    // Migration 1: Add isEmailVerified field to existing users
    const result = await User.updateMany(
      { isEmailVerified: { $exists: false } },
      { $set: { isEmailVerified: false } }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Migration: Added isEmailVerified to ${result.modifiedCount} users`);
    }

    console.log('✅ All migrations completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error.message || error);
    return false;
  }
};
