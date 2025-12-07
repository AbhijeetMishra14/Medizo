#!/usr/bin/env node

import axios from 'axios';

async function testAdminLogin() {
  try {
    const response = await axios.post('http://localhost:5173/api/auth/login', {
      email: 'abhijeetmishralyff@gmail.com',
      password: 'AbhijeetMishra001'
    });

    console.log('✅ Admin Login Success!');
    console.log('Token:', response.data.token.substring(0, 50) + '...');
    console.log('User:', JSON.stringify(response.data.user, null, 2));
    console.log('Role:', response.data.user.role);
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
  }
}

testAdminLogin();
