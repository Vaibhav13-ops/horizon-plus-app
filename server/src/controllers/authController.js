const User = require('../models/User.js');
const generateToken = require('../utils/generateToken.js');
const bcrypt = require('bcryptjs');

const registerUser = async (req,res) => {
    const {username, email, password, role} = req.body;

    try {
        const userExists = await User.findOne({email});

        if(userExists) {
            res.status(400).json({message: 'User already exists'});
            return;
        }

        const user = await User.create({
            username,
            email,
            password,
            role,
        });

        if(user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString(), user.role),
            });
        } else {
            res.status(400).json({message: 'Invalid user data'});
        }
    } catch(error) {
        res.status(500).json({message: 'Server Error'});
    }
};

const loginUser = async (req, res) => {
  const { email, password, expectedRole } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.role !== expectedRole) {
        if (expectedRole === 'user') {
            return res.status(403).json({ message: 'You are not a registered user. Please use the consultant sign-in page.' });
        } else {
            return res.status(403).json({ message: 'You are not a registered consultant. Please use the user sign-in page.' });
        }
      }

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { registerUser, loginUser };
