const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Admin = require('../src/models/Admin');

async function checkAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admins = await Admin.find().select('name email role');
    console.log('ADMINS|' + JSON.stringify(admins));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
checkAdmins();
