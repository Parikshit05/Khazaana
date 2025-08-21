// const User = require("../models/User");
// const jwt = require("jsonwebtoken");

// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
// }

// exports.registerUser = async (req, res) => {
//   const {fullName , email, password, profileImageUrl} = req.body;

//   // Validation: Check for missing fields
//   if(!fullName || !email || !password) {
//     return res.status(400).json({ message: "Please fill in all fields" });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const user = await User.create({ fullName, email, password, profileImageUrl });
//     const token = generateToken(user._id);
//     res.status(201).json({ id: user._id, user, token });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.loginUser = async (req, res) => {
//   const {email, password} = req.body;
//   if(!email || !password) {
//     return res.status(400).json({ message: "Please fill in all fields" });
//   }
//   try {
//     const user = await User.findOne({email});
//     if(!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//     res.status(200).json({
//       id: user._id,
//       user,
//       token: generateToken(user._id),
//     })
//   }catch(e){
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getUserInfo = async (req, res) => {
//   try{
//     const user = await User.findById(req.user.id).select("-password"); 
//     if(!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(user);
//   }catch(err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Get profile image URL (from multer)
    let profileImageUrl = null;
    if (req.file) {
      // if saving locally
      profileImageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      // if using Cloudinary, use: req.file.path
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password, // ⚠️ make sure your User model hashes this with pre-save middleware
      profileImageUrl,
    });

    const token = generateToken(user._id);
    res.status(201).json({
      id: user._id,
      user,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
