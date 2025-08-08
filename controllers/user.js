const {
  findAllUserServices,
  createUserServices,
  updateUserServices,
  deleteUserServices,
  findUserServices,
  sendVerificationEmail,
  findOneUserServices,
  softDeleteUserService,
} = require("../services/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createLogActivity } = require("../utils/logActivity");

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await findUserServices(email);

    // Generate code and expiration time (10 min)
    const code = generateVerificationCode();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    } else {
      user.verificationCode = code;
      user.codeExpires = codeExpires;
    }

    await user.save();
    await sendVerificationEmail(email, code);

    res.json({ message: "Verification code sent!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await findUserServices(email);
    if (
      !user ||
      user.verificationCode !== code ||
      new Date() > user.codeExpires
    ) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    user.verificationCode = null;
    user.codeExpires = null;
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    await user.save();

    res.json({ message: "Email verified successfully!", token: token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserServices(email);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isRightPassword = await bcrypt.compare(password, user.password);

    const jwtData = {
      id: user._id,
      email: user.email,
      role: user.role || "",
      org: user?.organization?._id,
      orgBranch: user?.orgBranch?._id,
    };
    if (isRightPassword) {
      const token = jwt.sign(jwtData, process.env.JWT_SECRET);
      await createLogActivity(jwtData, `login ${user.name}`);

      return res
        .status(200)
        .json({ message: "login successfully", token: token, role: user });
    } else {
      return res.status(400).json({ message: "wrong password" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const data = req.body;
    const { name, password, email, mobileNo, organization, orgBranch, role } =
      data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const isExistsUser = await findUserServices(email);
    if (isExistsUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const userData = {
      name,
      email,
      mobileNo,
      password: hashedPassword,
      organization,
      orgBranch,
      role,
    };
    const user = await createUserServices(userData);
    return res
      .status(201)
      .json({ message: "User register successfully", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

exports.findAllUser = async (req, res) => {
  try {
    const userdata = await findAllUserServices(req);

    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "user found", data: userdata });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};
exports.findUser = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userdata = await findUserServices(userEmail);

    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "user found", data: userdata });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};
exports.findOneUser = async (req, res) => {
  try {
    const userid = req?.params?.id;
    const userdata = await findOneUserServices(userid);

    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "user found", data: userdata });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};
exports.createUser = async (req, res) => {
  try {
    const data = req.body;
    const userData = await createUserServices(data);
    const log = await createLogActivity(req, `create user`);

    return res.status(200).json({ message: "User created", data: userData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const data = req.body;
    const { name, email, mobileNo, organization, orgBranch } = data;
    const uData = {
      name,
      email,
      mobileNo,
      organization,
      orgBranch,
    };
    await createLogActivity(req, `update user`);

    const userData = await updateUserServices(userId, uData);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User updated", data: userData });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

exports.softDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await softDeleteUserService(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User soft deleted", data: user });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      res.status(404).json({ message: "User not found" });
    }
    const userData = await deleteUserServices(userId);
    return res.status(200).json({ message: "User deleted", data: userData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};
