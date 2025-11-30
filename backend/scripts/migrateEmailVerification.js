#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.js';

const main = async () => {
  await connectDB();

  try {
    console.log('🔄 Starting migration: Adding isEmailVerified field to existing users...');

    // Update all users that don't have isEmailVerified field
    const result = await User.updateMany(
      { isEmailVerified: { $exists: false } },
      { $set: { isEmailVerified: false } }
    );

    console.log(`✅ Migration complete!`);
    console.log(`   - Matched: ${result.matchedCount} documents`);
    console.log(`   - Modified: ${result.modifiedCount} documents`);

    if (result.modifiedCount > 0) {
      console.log(`\n📋 Updated ${result.modifiedCount} existing customers with isEmailVerified: false`);
      console.log(`   These customers can now be verified by admin or via email link.`);
    } else {
      console.log(`\n✅ All users already have the isEmailVerified field.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message || error);
    process.exit(1);
  }
};

main();
