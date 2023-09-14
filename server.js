const mongoose = require('mongoose');
require('dotenv').config();

const server = require('./App');
const { DB_HOST, PORT } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    server.listen(PORT);
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
