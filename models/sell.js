const mongoose = require("mongoose");

const sellSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      // required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationBranch",
      // required: true,
    },
    customerName: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    customerPhone: {
      type: String,
      required: true,
    },
    modelName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      // required: true,
    },
    deviceName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      // required: true,
    },
    amount: { type: Number, required: true },
    customerPaid: { type: Number, required: true },
    remainingAmount: { type: Number, required: true },
    upload: { type: String },
    stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
    paymentType: {
      type: String,
      enum: ["Cash", "Cheque", "Upi", "Neft", "Card", "Other"],
    },
    payment: [
      {
        paymentAccount: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
        },
        paymentAmount: { type: Number, required: true },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sell", sellSchema);
