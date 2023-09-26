const { userModel } = require("../models/User");
const bcryptjs = require("bcryptjs");
// const fs = require("fs");
const jwt = require("jsonwebtoken");

const { requiredFieldIsEmpty } = require("../functions/EmptyFields");

//function to register user
exports.handleRegister = async (req, res) => {
  let { phone_number, username, password, confirm_pwd } = req.body;
  //varible to hold error in event of any error in validation
  let errorExist;

  let requiredArr = ["username", "phone_number", "password"];
  let inputs = { phone_number, username, password };

  //check to see if any required field is empty
  errorExist = requiredFieldIsEmpty(inputs, requiredArr);
  if (errorExist.length > 0) {
    return res.status(401).json({
      status: -1,
      message: `Please enter:- ${errorExist.join(", ")}`,
    });
  }

  //TEST TO SEE IF PASSWORD MATCHES CONFIRM PASSWORD
  if (password != confirm_pwd) {
    return res.status(400).json({
      status: -1,
      message: `Password do not match`,
    });
  }

  // checking if user already exists and returns failed status
  userModel.findOne({ phone_number }).then((data) => {
    if (data) {
      return res
        .status(409)
        .json({ status: -1, message: "Username is already taken" });
    }

    //  CREATE/REGISTER THE USER IF NO ERROR EXISTS AFTER HASHING THE PASSWORD
    let newPwd = bcryptjs.hashSync(password);
    // let imageUrl = uploadedImage.url;
    // let imageUrl =
    //   req.protocol +
    //   "://" +
    //   req.hostname+
    //   "/static/" +
    //   req.file.filename;
    let newUser = new userModel({
      username,
      phone_number,
      password: newPwd,
      image: "",
      about: "",
    });
    newUser
      .save()
      .then(() => {
        return res
          .status(201)
          .json({ status: 1, message: "User created successfully" });
      })
      .catch(() => {
        return res.status(500).json({
          status: -1,
          message: "Opps! something happened. Try again",
        });
      });
  });
};

// FUNCTION TO LOGIN USER IN
exports.handleLogin = async (req, res) => {
  let { phone_number, password } = req.body;

  //varible to hold error in event of any error in validation
  let errorExist;

  let requiredArr = ["phone_number", "password"];
  let inputs = { phone_number, password };

  //check to see if any required field is empty
  errorExist = requiredFieldIsEmpty(inputs, requiredArr);
  if (errorExist.length > 0) {
    return res.status(401).json({
      status: -1,
      message: `Please enter ${errorExist.join(", ")}`,
    });
  }

  // getting user from database
  try {
    let user = await userModel.findOne({ phone_number });
    if (!user) {
      return res
        .status(400)
        .json({ status: -1, message: "User does not exist" });
    }
    // comparing to see if user password does not match
    if (!bcryptjs.compareSync(req.body.password, user.password)) {
      return res
        .status(400)
        .json({
          status: -1,
          message: "User password or phone_number does not match",
        });
    }

    //proceed if the password matched
    let token = jwt.sign(
      { id: user._id, name: user.username },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    return res
    .cookie("token", token, {
      // httpOnly: true,
      secure: true,
      sameSite: 'none'
      // sameSite: false
    })
    .status(200).json({
        status: 1,
        message: "user logged in",
        result_data: { ...user._doc, token: token },
      });
  } catch (error) {
    return res
      .status(400)
      .json({ status: -1, message: "Opps! something went wrong" });
  }
};

// FUNCTION TO LOAD USER PROFILE IF TOKEN IS STILL ACTIVE
exports.handleLoadUserProfile = async (req, res) => {
  let { id } = res.locals;

  // getting user from database
  try {
    let user = await userModel.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ status: -1, message: "User does not exist" });
    }
    //proceed if the user exist
    // let token = jwt.sign({ id: user._id, name:user.username }, process.env.JWT_SECRET_KEY, {
    //   expiresIn: "1d",
    // });
    // return res.cookie('token',token).status(200).json({ status: 1, message: "user logged in", result_data:{...user._doc, token:token} });
    return res
      .status(200)
      .json({
        status: 1,
        message: "user logged in",
        result_data: { ...user._doc },
      });
  } catch (error) {
    return res
      .status(400)
      .json({ status: -1, message: "Opps! something went wrong" });
  }
};
