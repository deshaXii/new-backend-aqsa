import Notification from "../models/Notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "فشل في جلب الإشعارات", error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "تم تعليم الإشعار كمقروء" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "فشل في تحديث الإشعار", error: error.message });
  }
};

export const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    res.json({ message: "تم مسح كل الإشعارات" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "فشل في مسح الإشعارات", error: error.message });
  }
};

// 📌 دالة مساعدة لإنشاء إشعار
export const createNotification = async (message, type, userId) => {
  try {
    await Notification.create({ message, type, user: userId });
  } catch (error) {
    console.error("فشل في إنشاء الإشعار:", error.message);
  }
};
