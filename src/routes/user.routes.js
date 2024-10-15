const express = require("express");

const { validateParamsId, validateBodyData } = require("../middlewares/validator");
const sanitizeBodyData = require("../middlewares/sanitizer");
const { isAuth } = require("../middlewares/authenticator");

const {
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  createUsers,
  register,
} = require("../controllers/user.controller");

const { verifyEmail } = require("../services/emails/emailVerification");
const { sendNotifEmail, postEmail } = require("../services/emails/email.controller");

const userRouter = express.Router(); // Create an Express router

// User CRUD ops.
userRouter.post("/register", sanitizeBodyData, validateBodyData, register);
userRouter.get("/verify-email/:token", verifyEmail);
userRouter.post("/", isAuth, sanitizeBodyData, validateBodyData, createUsers);
userRouter.get("/", isAuth, getUsers);
userRouter.get("/:id", isAuth, validateParamsId, getUserById);
userRouter.patch(
  "/:id",
  isAuth,
  validateParamsId,
  sanitizeBodyData,
  validateBodyData,
  updateUser,
);
userRouter.delete("/:id", isAuth, validateParamsId, deleteUser);

userRouter.post("/notif", sendNotifEmail);
userRouter.post("/send/:id", validateParamsId, postEmail);


module.exports = userRouter;
