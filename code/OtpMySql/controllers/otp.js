const Otp = require('../models/otp');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

exports.generateOtp = async (req, res) => {
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const email = req.body.email;

    const existingOtp = await Otp.findOne({ where: { email } });

    if (!existingOtp) {
      await Otp.create({ email, otp: otpCode });
    } else {
      await Otp.update(
        { otp: otpCode, createdAt: new Date() },
        { where: { email } }
      );
    }

    return res.json({ message: "OTP generated or updated successfully." });

  } catch (err) {
    console.error('Error generating OTP:', err);
    return res.status(500).json({ error: 'An error occurred while generating OTP.' });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const userOtp = await Otp.findOne({ where: { email } });

    if (userOtp) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bearcatfinancenwmsu@gmail.com',
          pass: 'ggly kldq lmik dtte',
        },
      });

      const result = await transporter.sendMail({
        from: 'Bearcat Finance App <bearcatfinancenwmsu@gmail.com>',
        to: email,
        subject: 'OTP - Bearcat Code',
        text: `Your OTP for Bearcat Finance App is ${userOtp.otp}`,
      });

      console.log('Email sent:', result);
      return res.status(200).json({ message: 'OTP sent successfully.' });

    } else {
      return res.status(400).json({ error: 'OTP not found.' });
    }

  } catch (err) {
    console.error('Error sending OTP:', err);
    return res.status(500).json({ error: 'An error occurred while sending OTP.' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, Otp: enteredOtp } = req.body;

    const userOtp = await Otp.findOne({ where: { email } });

    if (!userOtp) {
      return res.status(400).json({ error: 'OTP not found.' });
    }

    const otpValidityMinutes = 10;
    const currentTime = new Date();
    const createdAt = new Date(userOtp.createdAt);
    const diffMinutes = (currentTime - createdAt) / 1000 / 60;

    if (diffMinutes > otpValidityMinutes) {
      return res.status(400).json({ error: 'OTP expired.' });
    }

    if (enteredOtp === userOtp.otp) {
      return res.json({ message: 'OTP verified successfully.' });
    } else {
      return res.status(400).json({ error: 'Incorrect OTP.' });
    }

  } catch (err) {
    console.error('Error verifying OTP:', err);
    return res.status(500).json({ error: 'An error occurred while verifying OTP.' });
  }
};
