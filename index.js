const express = require('express');
const connectToMongoDb = require('./db');
require('dotenv').config();

const cors = require('cors');

// Connection to MongoDB
connectToMongoDb();

const app = express();
const port = process.env.PORT || 5000; // Use environment port or default to 5000

// CORS middleware configuration
const corsConfig = {
	origin: '*',
	methods: ["POST", "GET"],
	credentials: true
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));

// Middleware to parse JSON requests
app.use(express.json());

app.get('/', (req, res) => {
	res.send("App running");
});

// Mounting auth routes
app.use('/api/auth', require('./routes/auth'));

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
