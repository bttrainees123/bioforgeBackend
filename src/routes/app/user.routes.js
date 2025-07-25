const express = require('express');
const userRouter = express.Router();
const authController=require("../../controller/app/auth.controller");
const linksController=require("../../controller/app/link.controller");
const middleWare=require("../../middleware/user.middleware");
const reportController = require('../../controller/app/report.controller');
const templateController = require('../../controller/app/template.controller');

userRouter.post("/register",authController.register);
userRouter.post("/login",authController.login);
userRouter.post("/sendOtp",authController.sendOtp);
userRouter.post("/verifyOtp",authController.verifyOpt);
userRouter.post("/changePassword",middleWare,authController.changePassword);
userRouter.post("/accountDelete",middleWare,authController.accountDelete);
userRouter.post("/forgetPassword",authController.forgetPassword);
userRouter.post("/updateProfile",middleWare,authController.updateProfile);
userRouter.get("/getUserInfo",authController.getUserInfo);
userRouter.get("/getUserInfotoken",middleWare,authController.getUserTokenInfo);
userRouter.get("/getAllUser",authController.getAllUser);
userRouter.post('/logout', authController.logout);
userRouter.get('/getTemplate', middleWare, authController.getTemplate);

//links
userRouter.post('/add-links', middleWare,linksController.add);
userRouter.post("/link-update",middleWare, linksController.update);
userRouter.get("/link-updateStatus",middleWare, linksController.updateStatus);
userRouter.post("/update-index",middleWare, linksController.updateIndex);
userRouter.post("/link-delete",middleWare, linksController.delete);
userRouter.get("/get-links",middleWare, linksController.getAll);

//links record click
userRouter.post('/link/click/:linkId',linksController.recordClick);

//report user
userRouter.post('/report',middleWare,reportController.add);

//template 
userRouter.post('/add-template',middleWare,templateController.add);
userRouter.post('/update-template',middleWare,templateController.update);
userRouter.delete('/delete-template',middleWare,templateController.delete);
userRouter.get('/getAll-template',middleWare,templateController.getAll);

module.exports=userRouter