require('dotenv').config();
// const UserReportCronService = require('./service/admin/cronjob.service');
const express = require('express');
const path = require("path")
const cors = require("cors")
const fileUpload = require("express-fileupload");
const userRouter = require("./src/routes/app/user.routes")
const adminRouter = require("./src/routes/admin/admin.routes")
const imageRouter = require("./src/routes/upload/upload.route")
const mongooseConnection = require("./src/config/db");
const app = express();
const PORT = process.env.PORT || 3006;
mongooseConnection();

app.use(cors({
  origin: '*', 
  credentials: true               
}));
app.use("/images", express.static(path.join(__dirname, "/public/profile")));
app.use("/images", express.static(path.join(__dirname, "/public/banner")));
app.use("/images", express.static(path.join(__dirname, "/public/linkLogo")));
app.use("/images", express.static(path.join(__dirname, "/public/tempUploads")));
app.use("/images", express.static(path.join(__dirname, "/public/default")));
app.use("/images", express.static(path.join(__dirname, "/public/themeImg")));
app.use("/images", express.static(path.join(__dirname, "/public/linkCategory")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload())
// UserReportCronService.startCronJob();
app.use("/api/v1", userRouter);
// admin
app.use("/api/admin/v1", adminRouter);
// image upload
app.use("/api/upload", imageRouter);

app.use((request, response) => {
  response.status(404).json({
    status: false,
    message: 'This endpoint does not exist. Please provide a valid endpoint .'
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
