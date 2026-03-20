const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Category = require('../src/models/Category');

async function fixCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const result = await Category.updateMany(
      { type: { $exists: false } },
      { $set: { type: 'expense' } }
    );

    console.log(`Updated ${result.modifiedCount} categories to type 'expense'.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixCategories();
