require('dotenv').config();

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/database');
const { User } = require('../src/models');

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@threadsapp.in').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin123';
  const phone = process.env.ADMIN_PHONE || '9999999999';
  const name = process.env.ADMIN_NAME || 'ThreadsApp Admin';

  await connectDB();

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name,
        phone,
        passwordHash,
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  console.log(`Admin user ready: ${admin.email}`);
  console.log(`Password: ${password}`);
}

seedAdmin()
  .catch((error) => {
    console.error('Failed to seed admin user:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
