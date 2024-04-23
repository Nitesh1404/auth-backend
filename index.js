const express = require('express');
const connectToMongoDb = require('./db');
require('dotenv').config();

var cors = require('cors')
// connection to mongodb
connectToMongoDb();
const app = express();
const port = 5000;

// cors middleware
app.use(cors())

// middleware to fetch json data from the website body
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));


app.listen(port, () => {
	console.log(`The app listening on port ${port}`)
});