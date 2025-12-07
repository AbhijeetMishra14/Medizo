#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function main() {
  try {
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

    // Define Order Schema
    const orderSchema = new mongoose.Schema({
      userId: { type: String, required: true },
      items: [{
        productId: String,
        productName: String,
        quantity: Number,
        price: Number
      }],
      total: Number,
      status: { type: String, default: 'pending' },
      shippingAddress: String,
      createdAt: { type: Date, default: Date.now }
    });

    const Order = mongoose.model('Order', orderSchema);

    // Check existing orders
    const existingOrders = await Order.countDocuments();
    console.log(`📦 Found ${existingOrders} existing orders`);

    if (existingOrders === 0) {
      console.log('Creating sample orders for last 7 days...');
      
      const orders = [];
      const statuses = ['pending', 'processing', 'shipped', 'delivered'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);

        // Create 2-3 orders per day
        const ordersPerDay = Math.floor(Math.random() * 2) + 2;
        
        for (let j = 0; j < ordersPerDay; j++) {
          orders.push({
            userId: 'demo-user-' + Math.floor(Math.random() * 100),
            items: [
              {
                productId: 'prod-' + Math.floor(Math.random() * 50),
                productName: 'Medical Product ' + Math.floor(Math.random() * 50),
                quantity: Math.floor(Math.random() * 5) + 1,
                price: (Math.random() * 5000) + 500
              }
            ],
            total: (Math.random() * 10000) + 1000,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            shippingAddress: 'Sample Address ' + i,
            createdAt: date
          });
        }
      }

      await Order.insertMany(orders);
      console.log(`✅ Created ${orders.length} sample orders`);
    } else {
      console.log('✅ Orders already exist, skipping seed');
    }

    await mongoose.disconnect();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
