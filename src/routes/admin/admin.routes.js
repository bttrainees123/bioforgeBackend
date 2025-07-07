const express = require('express');
const adminController = require("../../controller/admin/auth.controller");
const userController = require("../../controller/Admin/user.controller");
const adminMiddleWare = require("../../middleware/admin.middleware");
const reportController = require('../../controller/app/report.controller');

const adminRouter = express.Router();
//login
adminRouter.post("/login", adminController.login);
//dashboard
adminRouter.post("/addUser", adminMiddleWare, userController.add);
adminRouter.post("/updateUser", adminMiddleWare, userController.update);
adminRouter.delete("/deleteUser", adminMiddleWare, userController.delete);
adminRouter.get("/getUser", adminMiddleWare, userController.getAll);
adminRouter.get("/userStatusUpdate", adminMiddleWare, userController.status);

// Get all reported users
adminRouter.get('/reports', adminMiddleWare, reportController.getReports);

// Get specific report details by Id
adminRouter.get('/report/:reportId', adminMiddleWare, reportController.getReportDetails);


module.exports = adminRouter