const { userModel } = require("../models/User");

// FUNCTION TO GET ALL FRIENDS
exports.handleLoadUserFriends = async (req, res) => {
    let { id } = res.locals;
  
    // getting user from database
    try {
      let friends = await userModel.find({});
      let friendsExUser = friends.filter(friend => friend.id != id)
      if (!friendsExUser) {
        return res
          .status(400)
          .json({ status: -1, message: "User does not exist" });
      }
      return res
        .status(200)
        .json({
          status: 1,
          message: "user logged in",
          result_data: friendsExUser,
        });
    } catch (error) {
      return res
        .status(400)
        .json({ status: -1, message: "Opps! something went wrong" });
    }
  };