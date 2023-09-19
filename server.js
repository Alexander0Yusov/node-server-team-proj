const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./App');

const { DB_HOST, PORT } = process.env;

mongoose.set('strictQuery', true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT);
    console.log('Database connection successful');
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  });

// tdlLdWkpg4MiGAyO - pass, user - login
// add collection on 30-00 min mod-3 les-1
// 1-15 deploy onrender
// 03-37 proj planning about cloudinary
