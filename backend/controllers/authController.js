import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
      password,
      wallet,
      sponsorCode,
    } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const count = await User.countDocuments();
    const userCode = String(count + 1).padStart(6, "0");

    const hashedPassword = await bcrypt.hash(password, 10);

    const sponsorUser = sponsorCode
      ? await User.findOne({ userCode: sponsorCode })
      : null;

    const newUser = new User({
      userCode,
      fullname,
      email,
      phone,
      password: hashedPassword,
      wallet,

      sponsorCode: sponsorUser ? sponsorUser.userCode : null,
      sponsorName: sponsorUser ? sponsorUser.fullname : "—",

      uplines: [],
      registerDate: new Date().toISOString().slice(0, 10),
    });

    /* ===== BUILD UPLINES ===== */
    if (sponsorUser) {
      newUser.uplines.push(sponsorUser.userCode);

      if (sponsorUser.uplines[0])
        newUser.uplines.push(sponsorUser.uplines[0]);

      if (sponsorUser.uplines[1])
        newUser.uplines.push(sponsorUser.uplines[1]);
    }

    /* ===== REWARD DISTRIBUTION ===== */
    const rewardMap = [100, 50, 25];

    for (let i = 0; i < newUser.uplines.length; i++) {
      const upline = await User.findOne({ userCode: newUser.uplines[i] });
      if (upline) {
        upline.referralIncome += rewardMap[i];
        upline.totalRewards += rewardMap[i];
        await upline.save();
      }
    }

    await newUser.save();
    res.json({ success: true, message: "Registration successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET PROFILE ================= */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid Email or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Email or Password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        userCode: user.userCode,
        fullname: user.fullname,
        email: user.email,
        referralIncome: user.referralIncome,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
