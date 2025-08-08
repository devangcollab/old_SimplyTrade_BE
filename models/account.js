const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
    branchName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationBranch",
    },
    accountName: { type: String, required: true },
    balance: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);
