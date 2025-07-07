const express = require('express');
const adminController = require("../../../src/controller/admin/auth.controller");
const userController = require("../../../src/controller/admin/user.controller");
const adminMiddleWare = require("../../../src/middleware/admin.middleware");
const reportController = require('../../../src/controller/app/report.controller');

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