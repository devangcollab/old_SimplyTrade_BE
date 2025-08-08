const User = require("../models/user");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // App password (not your Gmail password)
  },
});

exports.sendVerificationEmail = async (email, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code},expire in 10 minutes`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

exports.findUserServices = async (email) => {
  const userData = await User.findOne({ email }).populate(
    "organization orgBranch"
  );
  return userData;
};

exports.findAllUserServices = async (req) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const search = req.query.search || "";

  const skip = (page - 1) * limit;
  const query = { name: { $regex: search, $options: "i" } };

  const items = await User.find({ ...query, role: "user", isDeleted: false })
    .sort({ createdAt: -1 })
    .populate("organization orgBranch")
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await User.countDocuments({
    ...query,
    isDeleted: false,
    role: "user",
  });

  return { totalCount, items };
};
exports.findOneUserServices = async (id) => {
  const data = await User.findById(id)
    .populate("orgBranch organization")
    .lean();

  return data;
};

exports.createUserServices = async (data) => {
  const userData = await User.create(data);
  return userData;
};

exports.updateUserServices = async (userID, data) => {
  const userData = await User.findByIdAndUpdate(userID, data, {
    new: true,
  }).lean();

  return userData;
};

exports.softDeleteUserService = async (userID) => {
  return await User.findByIdAndUpdate(userID, { isDeleted: true });
};

exports.deleteUserServices = async (userID) => {
  const userData = await User.findByIdAndDelete(userID).lean();
  return userData;
};
