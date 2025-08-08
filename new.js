
const express = require("express");
const User = require("../models/User");
const sendVerificationEmail = require("../services/emailService");

const router = express.Router();

// Generate Random 6-Digit Code
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send Verification Code
router.post("/send-verification", async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    // Generate code and expiration time (10 min)
    const code = generateVerificationCode();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    if (!user) {
      user = new User({ email, verificationCode: code, codeExpires });
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
});

// Verify Code
router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.verificationCode !== code || new Date() > user.codeExpires) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.codeExpires = null;
    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

