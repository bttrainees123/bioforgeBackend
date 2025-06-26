const express = require('express');
const adminController = require("../../controller/admin/auth.controller");
const userController = require("../../controller/Admin/user.controller");
const adminMiddleWare = require("../../middleware/admin.middleware");

const adminRouter = express.Router();
//login
adminRouter.post("/login", adminController.login)
//dashboard
adminRouter.post("/addUser", adminMiddleWare, userController.add)
adminRouter.post("/updateUser", adminMiddleWare, userController.update)
adminRouter.delete("/deleteUser", adminMiddleWare, userController.delete)
adminRouter.get("/getUser", adminMiddleWare, userController.getAll)
adminRouter.get("/statusUser", adminMiddleWare, userController.status)

module.exports = adminRouter