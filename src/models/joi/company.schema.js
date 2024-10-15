const Joi = require("joi");

const companySchema = Joi.object({
  // Main Information
  name: Joi.string().trim().min(3).max(80).required(),
  logo: Joi.string().trim(),
  // Address Information
  billingAddress: Joi.object({
    Street: Joi.string().trim(),
    City: Joi.string().trim(),
    State: Joi.string().trim(),
    BillingCode: Joi.string().trim(),
    PostalCode: Joi.string().trim(),
  }),

  shippingAddress: Joi.object({
    Street: Joi.string().trim(),
    City: Joi.string().trim(),
    ShippingCode: Joi.string().trim(),
    PostalCode: Joi.string().trim(),
  }),

  // Company Relationships
  owner: Joi.string()
    .trim()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message("Invalid Mongo Id"),
  parentCompany: Joi.string()
    .trim()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message("Invalid Mongo Id"),

  // Descriptive Information
  description: Joi.string().trim().max(255),
  rating: Joi.string()
    .trim()
    .valid("Acquired", "Active", "Market Failed", "Project Cancelled", "Shut Down"),
  website: Joi.string().trim().uri().message("No es una URL válida"),
  tickerSymbol: Joi.string().trim().uppercase(),

  // Company Details
  companyType: Joi.string().max(50).required(),
  ownership: Joi.string().trim().max(16),
  industry: Joi.string().trim().max(30),
  employees: Joi.string().required(),
  annualRevenue: Joi.number().precision(2),

  // Optional Information
  tag: Joi.string().trim(),
  // System Information
  lastActivityTime: Joi.date(),
}).options({ abortEarly: false, stripUnknown: true });

const companyUpdateSchema = companySchema.fork(["name", "industry"], (schema) =>
  schema.optional(),
);

module.exports = {
  companySchema,
  companyUpdateSchema,
};
