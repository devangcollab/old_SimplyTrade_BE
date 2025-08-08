const express = require("express");
const {
  findAllUser,
  deleteUser,
  updateUser,
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  findUser,
  findOneUser,
  softDeleteUser,
} = require("../controllers/user");
const {
  validateCreateData,
  validateDeleteUserData,
  validateGetOneUserData,
  validateUpdateUserData,
  AuthUser,
} = require("../middleware/user");
const userRoute = express.Router();

userRoute.get("/findUser", AuthUser, findUser);
userRoute.get("/findAllUser",AuthUser, findAllUser);
userRoute.get("/findOneUser/:id", validateGetOneUserData, findOneUser);
userRoute.post("/userSignUp", validateCreateData, registerUser);
userRoute.post("/userLogIn", loginUser);
userRoute.put("/updateUser/:id", AuthUser,validateUpdateUserData, updateUser);
userRoute.put("/deleteUser/:id",AuthUser, validateDeleteUserData, softDeleteUser);

userRoute.post("/sendOtp", sendOtp);
userRoute.post("/verifyOtp", verifyOtp);

module.exports = userRoute;
