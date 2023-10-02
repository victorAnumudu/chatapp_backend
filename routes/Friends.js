const friendsRoutes = require("express").Router();

const { handleLoadUserFriends } = require("../controller/Friends");

const {validToken} = require('../middleware/validToken')

// Friend login route
friendsRoutes.post("/friends", validToken, handleLoadUserFriends);


module.exports = friendsRoutes;