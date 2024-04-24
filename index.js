const express = require('express');
const connectToMongoDb = require('./db');
require('dotenv').config();



var cors = require('cors')
// connection to mongodb
connectToMongoDb();
const app = express();
const port = 5000;

// cors middleware
const conrsConfig = {
	origin: '*',
	credential: true,
	methods: ["POST", "GET"],
}
app.use(cors(conrsConfig));

// middleware to fetch json data from the website body
app.use(express.json());

app.get('/', (req, res) => {
	res.send("app running");
})

app.use('/api/auth', require('./routes/auth'));


app.listen(port, () => {
	console.log(`The app listening on port ${port}`)
});