const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceName: { type: String, required: true },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      required: true,
    },
     organization : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
      },
      branchName : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrganizationBranch",
      },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);

// device == iphone , s24 ultra ect 