const express = require('express');
const router = express.Router();
const verifyToken = require('../jwt/verify');

module.exports = (sequelize) => {
  const userController = require('../controllers/userController')(sequelize);

  const { registerUser, loginUser, getUserDetails, updateUser, updateUserProfile } = userController;

  router.post('/register', registerUser);
  router.post('/login', loginUser);
  router.get('/details/:userID', verifyToken, getUserDetails);
  router.post('/update', updateUser);
  router.post('/update/profile', updateUserProfile);

  return router;
};