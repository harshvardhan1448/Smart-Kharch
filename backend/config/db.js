const mongoos = require('mongoose');

const connectDB = async () => {
    try {
        await mongoos.connect(process.env.MONG_URI, {});
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;