const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    // Main Information
    salutation: {
      type: String,
      enum: ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", ""],
    },
    firstName: {
      type: String,
      required: [true, "Se requiere un nombre."],
      trim: true,
      match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/, "Por favor brinde un nombre válido."],
    },
    logo: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Se requiere un apellido."],
      trim: true,
      match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/, "Por favor brinde un apellido válido."],
    },
    // Contact Information
    email: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [
        /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm,
        "Please provide a valid email address.",
      ],
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    birthday: {
      type: String,
      required: false,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      zipCode: { type: String, trim: true },
    },
    description: {
      type: String,
      maxlength: 80,
      trim: true,
    },
    emailOptOut: Boolean,

    // Social Media Links
    socials: {
      X: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        match: /x/g,
      },
      LinkedIn: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        match: /linkedin/g, // l3gz
      }, // Add more.. la bghiti
      Facebook: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        match: /facebook/g, // l3gz
      }, // Add more.. la bghiti
    },

    avatar: String,

    // Sales pipeline specific infos
    leadSource: {
      type: String,
      enum: [
        "None",
        "Advertisement",
        "Employee Referral",
        "Facebook",
        "Twitter",
        "Google+",
        "External Referral",
        "Public Relations",
        "Web Download",
        "Web Research",
        "Cold Call",
        "Chat",
        "",
      ],
    },

    // Association Information
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    title: {
      type: String,
      trim: true,
      MaxLength: 60,
    },
    skypeId: {
      type: String,
      trim: true,
    },

    // System Information
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    locked: Boolean, // Flag indicating if record is locked for editing
    id: {
      type: String,
    },
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

module.exports = mongoose.model("Contact", ContactSchema);
