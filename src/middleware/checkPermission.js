const checkPermission = (permission) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: no user found" });
    }

    // Allow full access for admin
    if (user.role === "admin") {
      return next();
    }

    // Check if user has specific permission
    if (user.permissions && user.permissions[permission]) {
      return next();
    }

    return res
      .status(403)
      .json({ message: "ليس لديك صلاحية للقيام بهذا الإجراء" });
  };
};

export default checkPermission;
