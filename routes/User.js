const userRoutes = require("express").Router();

const { handleRegister, handleLogin, handleLoadUserProfile } = require("../controller/User");

const {validToken} = require('../middleware/validToken')


//User register route
userRoutes.post("/register", handleRegister);

//User login route
userRoutes.post("/login", handleLogin);

//User login route
userRoutes.post("/profile", validToken, handleLoadUserProfile);


module.exports = userRoutes;