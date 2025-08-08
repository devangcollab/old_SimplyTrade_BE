const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    organizationName: { type: String, required: true },
    primaryAddress: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    telePhone: { type: String, required: true },
    email: { type: String, required: true },
    upload: { type: String},
    gstApplicable: { type: String, enum: ["yes", "no"], required: true },
    gstNumber: { type: String },
    gstType: { type: String, enum: ["regular", "composite"] },
    companyType: { type: String, required: true },
    dealingCurrency: { type: String },
    financialYear: { type: String },
    defaultStockMethod: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", organizationSchema);
