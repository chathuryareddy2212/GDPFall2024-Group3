const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SECRET_KEY = process.env.JWT_SECRET || 'gdpFall2024Group3SecretKey';

module.exports = (sequelize) => {
  const User = require('../models/users')(sequelize);

  const registerUser = async (req, res) => {
    const { username, email, phoneNum, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = await User.create({ username, email, phoneNum, password });

      if (user.UserID !== undefined) {
        const otpApiResponse = await axios.post('http://192.168.1.11:3000/api/user/generateotp', { email });
        if (otpApiResponse.status !== 200) {
          await user.destroy();
          return res.status(500).json({ error: 'Failed to generate OTP. Registration rolled back.' });
        }

        const sendOtpResponse = await axios.post('http://192.168.1.11:3000/api/user/sendotp', { email });
        if (sendOtpResponse.status !== 200) {
          await user.destroy();
          return res.status(500).json({ error: 'Failed to send OTP. Registration rolled back.' });
        }

        return res.status(201).json({
          message: 'User registered successfully. OTP has been sent.',
          user: { username: user.username, email: user.email, phoneNum: user.phoneNum },
        });
      }
    } catch (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ error: 'An error occurred during registration.' });
    }
  };

  const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (user && await user.validatePassword(password)) {
        const otpApiResponse = await axios.post('http://192.168.1.11:3000/api/user/generateotp', { email: user.email });
        if (otpApiResponse.status !== 200) {
          return res.status(500).json({ error: 'Failed to generate OTP for 2FA.' });
        }

        const sendOtpResponse = await axios.post('http://192.168.1.11:3000/api/user/sendotp', { email: user.email });
        if (sendOtpResponse.status !== 200) {
          return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
        }

        const token = jwt.sign(
          {
            userId: user.UserID,
            email: user.email,
          },
          SECRET_KEY,
          { expiresIn: '5h' }
        );

        return res.status(200).json({
          message: 'Authentication successful. OTP has been sent for 2FA.',
          token,
          user: { username: user.username, email: user.email, id: user.UserID, phoneNumber: user.phoneNumber },
        });
      } else {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'An error occurred during login.' });
    }
  };

  const getUserDetails = async (req, res) => {
    const { userID } = req.params;

    try {
      const user = await User.findOne({ where: { UserID: userID } });

      if (user) {
        res.status(200).json({
          message: 'User details fetched successfully',
          user: { username: user.username, email: user.email, phoneNumber: user.phoneNumber },
        });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      res.status(500).json({ error: 'An error occurred while fetching user details.' });
    }
  };

  const updateUser = async (req, res) => {
    const { email, username, phoneNumber, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedFields = {};
      if (username) updatedFields.username = username;
      if (phoneNumber) updatedFields.phoneNumber = phoneNumber;
      if (password) {
        updatedFields.password = crypto.createHash('sha256').update(password).digest('hex');
      }

      await user.update(updatedFields);

      return res.status(200).json({
        message: 'User details updated successfully',
        user: {
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'An error occurred while updating user details.' });
    }
  };

  const updateUserProfile = async (req, res) => {
    const { email, username, phoneNumber } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedFields = {};
      if (username) updatedFields.username = username;
      if (phoneNumber) updatedFields.phoneNumber = phoneNumber;

      await user.update(updatedFields);

      return res.status(200).json({
        message: 'User details updated successfully',
        user: {
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'An error occurred while updating user details.' });
    }
  };

  return {
    registerUser,
    loginUser,
    getUserDetails,
    updateUser,
    updateUserProfile,
  };
};
