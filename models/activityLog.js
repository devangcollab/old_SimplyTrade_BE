const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
    role: { type: String },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
    branchName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationBranch",
    },
    message: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
