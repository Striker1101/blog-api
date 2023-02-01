const mongoose = require("mongoose");

// Set up mongoose connection
const dev_db_url = process.env.DEV_DB;
const mongoDb = process.env.MONGODB_URL || dev_db_url;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
