const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
    orgBranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationBranch",
      required: true,
    },
    orgId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
