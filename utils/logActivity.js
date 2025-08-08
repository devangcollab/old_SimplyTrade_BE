const ActivityLog = require("../models/ActivityLog");
const { findUserServices } = require("../services/user");

exports.createLogActivity = async (req, res) => {
  try {
    const user = req?.user || {};
    const userdata = await findUserServices(user.email || req?.email);
    const logMessage = req.body?.message;

    const activityLog = {
      userId: req?.id || user.id || null,
      name: userdata.name || null,
      role: req?.role || user.role || null,
      organization: req?.org || user.org || null,
      branchName: req?.orgBranch || user.orgBranch || null,
      message: logMessage ? `${userdata.name} ${logMessage}` : res, //when its work as normal function res is a message for all logs or logMessage is a message for logout time
    };

    const logs = await ActivityLog.create(activityLog);

    if (logMessage) {
      return res.status(200).json({
        message: "Activity logged successfully",
        data: logs,
      });
    }
  } catch (err) {
    console.error("Activity logging failed:", err.message);
  }
};

exports.getAllLogActivity = async (req, res) => {
  try {
    const { startDate, endDate, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include full end day

    const filter = {
      ...(req.user.role === "user" && { branchName: req.user.orgBranch }),
    };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Filter by date range
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: end,
      };
    }

    const logs = await ActivityLog.find(filter)
      .populate("organization")
      .populate("branchName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await ActivityLog.countDocuments(filter);

    return res.status(200).json({
      message: "Logs fetched",
      data: logs,
      totalCount,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch logs",
      error: err.message,
    });
  }
};
