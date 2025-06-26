require('dotenv').config();
// const i18next = require('i18next');
// const Backend = require('i18next-fs-backend');
const express = require('express');
const path = require("path")
const cors = require("cors")
const fileUpload = require("express-fileupload");
const onlyJsonMiddleware = require("./middleware/onlyJsonMiddleware ")
const userRouter = require("./routes/app/user.routes")
const adminRouter = require("./routes/admin/admin.routes")
const imageRouter = require("./routes/upload/upload.route")
const mongooseConnection = require("./config/db");
const app = express();
const PORT = process.env.PORT || 3006;
mongooseConnection();
app.use(cors())
app.use(cors({
  origin: '*', 
  credentials: true               
}));
app.use("/images", express.static(path.join(__dirname, "../public/profile")));
app.use("/images", express.static(path.join(__dirname, "../public/tempUploads")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload())
app.use(onlyJsonMiddleware);
// i18next.use(Backend).init({
//   lng: 'en',
//   fallbackLng: 'en',
//   preload: ['en', 'fr','ar','de','el','es','it-ca','it','pl','pl-br','pt-pt','ru','zh'], 
//   ns: ['translation'], 
//   defaultNS: 'translation',
//   backend: {
//     loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json')
//   }
// });
// web
// app.use("/api/web/v1", webRouter);
// // mobile
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
