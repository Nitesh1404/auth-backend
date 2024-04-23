const mongoose = require('mongoose');
require('dotenv').config();
const URI = process.env.MONGO_URI;

const connectToMongoDb = () => {
	mongoose.connect(URI);
	if (mongoose.connection) {
		console.log("Successfully connected");
	}
};

module.exports = connectToMongoDb;