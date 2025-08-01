import dbConnect from "../utils/dbConnect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  if (method === "POST") {
    // ✅ تسجيل الدخول
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user._id, role: user.role, permissions: user.permissions },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
          permissions: user.permissions,
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Login failed", error: err.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
