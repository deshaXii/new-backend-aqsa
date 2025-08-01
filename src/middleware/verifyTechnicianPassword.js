import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

const verifyTechnicianPassword = async (req, res, next) => {
  try {
    const { technicianPassword } = req.body;

    if (!technicianPassword) {
      return res
        .status(400)
        .json({ message: "يجب إدخال كلمة مرور الفني للتعديل" });
    }

    const user = await User.findById(req.user._id);
    const isValid = await bcrypt.compare(technicianPassword, user.password);

    if (!isValid) {
      return res.status(403).json({ message: "كلمة المرور غير صحيحة" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "فشل في التحقق من كلمة مرور الفني" });
  }
};

export default verifyTechnicianPassword;
