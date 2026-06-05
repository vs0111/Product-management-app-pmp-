const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("DataBase Connected Successfully");
  } catch (error) {
    console.error("Database Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
