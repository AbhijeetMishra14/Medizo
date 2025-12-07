#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { promisify } from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const scrypt = promisify(crypto.scrypt);

// Simple User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  passwordHash: String,
  phone: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const buf = await scrypt(password, salt, 64);
  return `${salt}:${buf.toString('hex')}`;
}

async function main() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not set in .env');
      process.exit(1);
    }

    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      dbName: dbName || 'medicalstore'
    });
    console.log('✅ Connected to MongoDB');

    const User = mongoose.model('User', userSchema);

    // Create test admin
    const testAdminEmail = 'admin@test.com';
    const testAdminPassword = 'admin123';
    
    const testAdminExists = await User.findOne({ email: testAdminEmail });
    if (testAdminExists) {
      console.log(`\n✅ Test Admin Already Exists`);
      console.log(`   Email: ${testAdminEmail}`);
      console.log(`   Password: ${testAdminPassword}`);
    } else {
      const testAdminPasswordHash = await hashPassword(testAdminPassword);
      await User.create({
        name: 'Test Admin',
        email: testAdminEmail,
        passwordHash: testAdminPasswordHash,
        role: 'admin'
      });
      console.log(`\n✅ Test Admin Created!`);
      console.log(`   Email: ${testAdminEmail}`);
      console.log(`   Password: ${testAdminPassword}`);
    }

    // Create demo user
    const demoEmail = 'demo@example.com';
    const demoPassword = 'password123';
    
    const demoExists = await User.findOne({ email: demoEmail });
    if (demoExists) {
      console.log(`\n✅ Demo User Already Exists`);
      console.log(`   Email: ${demoEmail}`);
      console.log(`   Password: ${demoPassword}`);
    } else {
      const demoPasswordHash = await hashPassword(demoPassword);
      await User.create({
        name: 'Demo User',
        email: demoEmail,
        passwordHash: demoPasswordHash,
        role: 'user'
      });
      console.log(`\n✅ Demo User Created!`);
      console.log(`   Email: ${demoEmail}`);
      console.log(`   Password: ${demoPassword}`);
    }

    // Also create the original admin user if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'abhijeetmishralyff@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AbhijeetMishra001';
    
    const adminUserExists = await User.findOne({ email: adminEmail.toLowerCase() });
    if (adminUserExists) {
      console.log(`\n✅ Original Admin Already Exists`);
      console.log(`   Email: ${adminEmail}`);
    } else {
      const adminPasswordHash = await hashPassword(adminPassword);
      await User.create({
        name: 'Admin User',
        email: adminEmail.toLowerCase(),
        passwordHash: adminPasswordHash,
        role: 'admin'
      });
      console.log(`\n✅ Original Admin Created!`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Done! You can now log in with the credentials above.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
