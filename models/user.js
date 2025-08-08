const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNo: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "admin" },
    verificationCode: { type: String },
    codeExpires: { type: Date },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
    orgBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationBranch",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
