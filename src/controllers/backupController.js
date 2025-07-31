import Repair from "../models/Repair.model.js";
import User from "../models/User.model.js";
import Log from "../models/Log.model.js";
import mongoose from "mongoose";

export const getStats = async (req, res) => {
  const repairCount = await Repair.countDocuments();
  const technicianCount = await User.countDocuments({ role: "technician" });

  const stats = await mongoose.connection.db.stats();
  const dbSizeMB = (stats.storageSize / (1024 * 1024)).toFixed(2);

  res.json({ repairCount, technicianCount, dbSizeMB });
};

export const exportData = async (req, res) => {
  const repairs = await Repair.find();
  const users = await User.find();
  const logs = await Log.find();

  res.json({ repairs, users, logs });
};

export const importData = async (req, res) => {
  const { repairs, users, logs } = req.body;

  await Repair.insertMany(repairs);
  await User.insertMany(users);
  await Log.insertMany(logs);

  res.json({ message: "Data imported successfully" });
};

export const deleteAllData = async (req, res) => {
  await Repair.deleteMany();
  await User.deleteMany({ role: { $ne: "admin" } });
  await Log.deleteMany();

  res.json({ message: "All data deleted" });
};
