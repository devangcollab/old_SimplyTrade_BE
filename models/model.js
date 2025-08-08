const mongoose = require("mongoose");
const organization = require("./organization");

const modelSchema = new mongoose.Schema({
  modelName: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  branchName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrganizationBranch",
  },
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Model", modelSchema);
//model == brand of category
