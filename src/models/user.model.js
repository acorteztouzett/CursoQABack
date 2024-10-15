const mongoose = require("mongoose");
const { hashPassword, hashExistingPassword } = require("../lib/bcrypt");
const { logger } = require("../utils/logger");
const { sendConfirmationMail } = require("../services/emails/post");

const UserSchema = new mongoose.Schema(
  {
    // Main Information
    uuid: {
      type: String,
      default: crypto.randomUUID(),
    },
    firstName: {
      type: String,
      required: false,
      trim: true,
      minlength: 1, // Enforce a minimum length
      maxlength: 50, // Enforce a maximum length
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    bio: String,

    // Contact Information
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true, // Convert email to lowercase for consistency
      validate: {
        validator: (email) =>
          /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm.test(email),
        message: "Invalid email format",
      },
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [
        /* Detects most of the phone numbers all over the world */
        /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/g,
        "Please provide a valid phone number.",
      ],
    },

    // Address Information
    address: {
      type: mongoose.Schema.Types.Mixed, // redundant but good to know.
      properties: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        zipCode: { type: String, trim: true },
      },
    },

    // Login Information
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true,
      match: [/[a-z_.0-9]/, "Invalid username format"],
    },
    password: {
      type: String,
      required: true,
    },

    // User Details
    dateOfBirth: { type: Date },
    urls: [{
      type: String,
      trim: true,
    }],
    avatar: { type: String, trim: true }, // Store the path to the avatar image,

    // Preferences
    language: { type: String, trim: true },
    countryLocale: { type: String, trim: true },
    timeZone: { type: String, trim: true },
    dateFormat: { type: String, trim: true },
    timeFormat: { type: String, trim: true },

    // Roles and Permissions
    role: { type: String, enum: ["admin", "user", "editor"] }, // Define allowed roles },

    // Account Management
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    verified: { type: Boolean, default: true },

    // Additional Information and preferences Inshaa'Allah
    alias: { type: String, trim: true },
    grouping: { type: String, trim: true },
    sortOrder: { type: String, trim: true },
    confirm: { type: Boolean },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    virtuals: {
      fullName: {
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
      },
    },
  },
);

// Before saving the user to the database,
// Both at regisration, creation and update.
// Hash the plain password:
UserSchema.pre("save", hashPassword);
UserSchema.pre("updateOne", hashExistingPassword);

// After saving the new user, i.e. registering,
// Send a confirmation email...
UserSchema.post("save", sendConfirmationMail);
UserSchema.post("save", (doc, next) => {
  logger.log("info", `User saved with ID: ${doc._id}`);
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
