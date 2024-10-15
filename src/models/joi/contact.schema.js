const Joi = require("joi");

const contactSchema = Joi.object({
  // Main Information
  logo: Joi.string().trim(),
  salutation: Joi.string().valid("Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", ""),
  firstName: Joi.string()
    .required()
    .trim()
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/)
    .error(new Error("Por favor brinde un nombre válido (Solo letras).")),
  lastName: Joi.string()
    .required()
    .trim()
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/)
    .error(new Error("Please provide a valid name.")),

  // Contact Information
  email: Joi.string()
    .trim()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } }), // Allow null for optional fields
  phone: Joi.string()
    .trim()
    .regex(
      /^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/,
    ),
  birthday: Joi.string().trim(),
  address: Joi.object({
    street: Joi.string().trim(),
    city: Joi.string().trim(),
    state: Joi.string().trim(),
    country: Joi.string().trim(),
    zipCode: Joi.string().trim(),
  }),
  description: Joi.string().trim().max(80),
  emailOptOut: Joi.boolean(),
  avatar: Joi.string().uri(),

  // Social Media Links
  socials: Joi.object({
    X: Joi.string()
      .trim()
      .regex(/x/),
    Facebook: Joi.string()
      .trim()
      .regex(/facebook/),
    LinkedIn: Joi.string()
      .trim()
      .regex(/linkedin/),
  }),

  // Sales pipeline specific infos
  leadSource: Joi.string().valid(
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
  ),
  createdBy: Joi.string()
    .trim()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message("Invalid Mongo Id"),

  lastModifiedBy: Joi.string()
    .trim()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message("Invalid Mongo Id"),

  // Association Information
  title: Joi.string().trim().max(60),
  skypeId: Joi.string().trim(),
}).options({ abortEarly: false, stripUnknown: true });

const contactUpdateSchema = contactSchema.fork(["firstName", "lastName"], (schema) =>
  schema.optional(),
);

module.exports = { contactSchema, contactUpdateSchema };
