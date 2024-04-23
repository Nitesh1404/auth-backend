const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();

const JWT_SECTRET = "Thisismyreactappcourse";

// code for validation purpose store in array
const validate = [
	body('name', "Enter valid name").isLength({ min: 3 }),
	body('email', "Enter valid Email").isEmail(),
	body('password', "Enter Valid password").isLength({ min: 5 })
];

//  ROUTE 1: end point (api/auth/createuser) for creating user , no login required
router.post('/createuser', validate, async (req, res) => {
	let success = false;
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).json({ error: error.array() });
	}

	try {
		// check if email already exists in the databse 
		let user = await User.findOne({ email: req.body.email });
		if (user) {
			return res.status(400).json({ success, error: "The user with this email already exists.." });
		}
		// creating hash of password and then stroing them into databse 
		const salt = await bcrypt.genSalt(10);
		const secPass = await bcrypt.hash(req.body.password, salt);
		// if user not exist then create new user and save there data in databse 
		user = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: secPass
		});
		// Generating authentication token and sending it to user to access there account
		// data is generated based on the user id to access it faster
		const data = {
			user: {
				id: user.id
			}
		}
		const authtoken = jwt.sign(data, JWT_SECTRET);
		success = true;
		res.json({ success, authtoken });
		// res.json(user)
	}
	catch (error) {
		// if in case eny ineternal error occur then this will be catched in this block and the app will not be crashed
		console.log(error.message);
		res.status(500).send("Internal error from server");
	}

});

// ROUTE 2: End (api/auth/login) point for login user , no login required
router.post('/login', [
	body('email', "Enter valid Email").isEmail(),
	body('password', "password cannot be blanked").exists({ min: 5 })
], async (req, res) => {

	let success = false;
	//If there is a error return error with bad request
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).json({ error: error.array() });
	}

	const { email, password } = req.body;
	try {
		let user = await User.findOne({ email });
		// check if user with this email exists 
		if (!user) {
			return res.status(400).json({ error: "please enter valid creadentials" });
		}
		const passwordCompare = await bcrypt.compare(password, user.password);
		// check if password matched 
		if (!passwordCompare) {
			return res.status(400).json({ error: "please enter valid creadentials" });
		}
		// id all things are correct login with sending auth token
		const data = {
			user: {
				id: user.id
			}
		}
		const authtoken = jwt.sign(data, JWT_SECTRET);
		res.json({ success: true, authtoken });

	} catch (error) {
		console.log(error.message);
		res.status(500).send("Internal error from server");
	}

});

// ROUTE 3: getuser details end points (api/auth/getuser) for getting the user using auth-token , login required
// used to fetch the user data if we have auth-token
router.post('/getuser', fetchuser, async (req, res) => {
	try {
		let userId = req.user.id;
		// find all the data of user with id excluding password
		const user = await User.findById(userId).select('-password');
		res.send(user);
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Internal error from server");
	}
});

module.exports = router;