const express = require("express");
const cors = require("cors");
const ApiError = require("./app1/api-error");
const contactsRouter = require("./app1/routes/contact.route");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application." });
});

app.use("/api/contacts", contactsRouter);

// Xử lý lỗi 404 khi không tìm thấy endpoint phù hợp
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

// Middleware xử lý lỗi tập trung trên toàn hệ thống
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;
