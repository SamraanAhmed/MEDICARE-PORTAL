require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGODB_URL, { dbName: 'MediCare' }).then(async () => {
  const hash = await bcrypt.hash('doctor123', 10);
  await mongoose.connection.db.collection('doctors').updateOne(
    { email: 'ali.ahmed@medicare.com' },
    { $set: { password: hash } }
  );
  console.log('Doctor password reset successfully!');
  console.log('Email: ali.ahmed@medicare.com');
  console.log('Password: doctor123');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
