const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationBranch",
      required: true,
    },
    customerName: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    customerPhone: { type: String, required: true },
    categoryName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    modelName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      required: true,
    },
    deviceName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    capacityName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Capacity",
      required: true,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    imeiNo: { type: String },
    srNo: { type: String },
    totalAmount: { type: Number, required: true },
    paidToCustomer: { type: Number, required: true },
    remainingAmount: { type: Number },
    upload: { type: String },
    payment: [
      {
        paymentAccount: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
        },
        paymentAmount: { type: Number, required: true },
      },
    ],
    expense: { type: mongoose.Schema.Types.ObjectId, ref: "Expense" },
    expenseAmount: { type: Number },
    expenseDate: { type: Date },
    expenseDescription: { type: String },
    sellAmount: { type: Number },
    isSelled: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Stock", stockSchema);
