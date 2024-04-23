const jwt = require('jsonwebtoken');
const JWT_SECTRET = "Thisismyreactappcourse";

const fetchuser = (req, res, next) => {
	// Get user from the JWT token and add id to the req object
	const token = req.header('auth-token');
	if (!token) {
		res.status(401).send({ error: "please authenticate using valid token" });
	}
	try {
		const data = jwt.verify(token, JWT_SECTRET);
		req.user = data.user;
		next();
	} catch (error) {
		console.log(error.message)
		res.status(401).send({ error: "please authenticate using valid token" });
	}

}

module.exports = fetchuser;