const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    branchName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationBranch",
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    role: { type: String, enum: ["Buyer", "Seller"], required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
