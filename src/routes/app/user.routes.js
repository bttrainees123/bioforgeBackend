const express = require('express');
const userRouter = express.Router();
const authController=require("../../controller/app/auth.controller")
const linkController=require("../../controller/app/addlink.controller")
const userController = require("../../controller/Admin/user.controller")
const adminMiddleWare = require("../../middleware/admin.middleware")
const middleWare=require("../../middleware/user.middleware")

userRouter.post("/register",authController.register) 
userRouter.post("/login",authController.login)
userRouter.post("/sendOtp",authController.sendOtp)
userRouter.post("/verifyOtp",authController.verifyOpt)
userRouter.post("/changePassword",middleWare,authController.changePassword)
userRouter.post("/accountDelete",middleWare,authController.accountDelete)
userRouter.post("/forgetPassword",authController.forgetPassword)
userRouter.post("/updateProfile",authController.updateProfile);
userRouter.get("/getUserInfo",authController.getUserInfo);
userRouter.get("/getUserInfotoken",middleWare,authController.getUserTokenInfo);
userRouter.post('/logout', authController.logout);
//add-link
userRouter.post('/add-multiple', middleWare,linkController.addLinks);
userRouter.post('/add-updateLink', linkController.updateLink);
userRouter.post('/deleteLink',middleWare, linkController.deleteLink);
userRouter.post('/update-Theme', authController.updateTheme);

userRouter.delete("/deleteUser", adminMiddleWare, userController.delete)
userRouter.get("/getUser", adminMiddleWare, userController.getAll)
userRouter.get("/statusUser", adminMiddleWare, userController.status)

module.exports=userRouter