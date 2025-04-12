const jwt = require('jsonwebtoken');
const SECRET_KEY = 'gdpFall2024Group3SecretKey';


const verifyTokenWithUserID = (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing.' });
      }
  
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token missing.' });
      }
  
      const decoded = jwt.verify(token, SECRET_KEY);
  
      const { userID } = req.body || req.params || {}; 
      if (userID && decoded.userID !== userID) {
        return res.status(403).json({ error: 'User ID does not match token.' });
      }
  
      req.user = decoded; 
      console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQ",req.user)
      next();
    } catch (err) {
      console.error('Token verification error:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
  };
  
  module.exports = verifyTokenWithUserID;
  