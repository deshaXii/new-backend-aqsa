import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ username: 'admin' });
  if (existing) {
    console.log('Admin user already exists');
    process.exit();
  }

  const hashed = await bcrypt.hash('admin123', 10);

  const admin = new User({
    name: 'Admin',
    username: 'admin',
    password: hashed,
    role: 'admin',
    permissions: {
      addRepair: true,
      editRepair: true,
      deleteRepair: true,
      receiveDevice: true
    }
  });

  await admin.save();
  console.log('Admin user created');
  process.exit();
};

seedAdmin();
