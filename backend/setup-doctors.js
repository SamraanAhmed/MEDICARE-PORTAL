require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGODB_URL, { dbName: 'MediCare' }).then(async () => {
  const hash = await bcrypt.hash('doctor123', 10);
  
  // Revert the email back
  await mongoose.connection.db.collection('doctors').updateOne(
    { email: 'doctor@medicare.com' },
    { $set: { email: 'ali.ahmed@medicare.com' } }
  );
  
  // Set password for ALL doctors to doctor123
  const result = await mongoose.connection.db.collection('doctors').updateMany(
    {},
    { $set: { password: hash } }
  );

  console.log(`Reverted email and updated passwords for ${result.modifiedCount} doctors!`);
  
  const docs = await mongoose.connection.db.collection('doctors').find({}).project({name:1, email:1, _id:0}).toArray();
  console.log("Current Doctors List:");
  console.log(JSON.stringify(docs, null, 2));

  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
