const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
    branchName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationBranch",
    },
    date: { type: Date, require: true },
    amount: { type: Number, require: true },
    category: {
      type: String,
      enum: ["General", "Phone"],
      require: true,
    },
    modelName: { type: mongoose.Schema.Types.ObjectId, ref: "Model" },
    deviceName: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },
    description: { type: String, require: true },
    stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
