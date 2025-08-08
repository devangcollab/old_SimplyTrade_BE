const {
  findOneDeviceServices,
  findAllDeviceServices,
  createDeviceServices,
  updateDeviceServices,
  deleteDeviceServices,
  findUserDeviceServices,
  softDeleteDeviceService,
  selectDeviceByModelServices,
} = require("../services/device");
const { createLogActivity } = require("../utils/logActivity");

exports.findAllDevice = async (req, res) => {
  try {
    const userId = req?.user?.id;

    const deviceData = await findAllDeviceServices(userId, req);

    if (!deviceData) {
      return res.status(404).json({ message: "No Device found" });
    }

    return res.status(200).json({
      message: "Device retrieved successfully",
      data: deviceData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.findOneDevice = async (req, res) => {
  try {
    const deviceId = req.params.id;
    const deviceData = await findOneDeviceServices(deviceId);

    if (!deviceData) {
      return res.status(404).json({ message: "No Device found" });
    }

    return res.status(200).json({
      message: "Device retrieved successfully",
      data: deviceData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
exports.selectDeviceByModel = async (req, res) => {
  try {
    const modelId = req.params.id;

    const orgText = req?.query?.text || "";

    if (!modelId && !orgText) {
      return res.status(400).json({
        message: "Please provide either modelId or orgText for filtering.",
      });
    }
    const deviceData = await selectDeviceByModelServices(modelId, orgText);

    if (!deviceData) {
      return res.status(404).json({ message: "No Device found" });
    }

    return res.status(200).json({
      message: "Device retrieved successfully",
      data: deviceData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.findUserDevice = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const deviceData = await findUserDeviceServices(userId);

    if (!deviceData) {
      return res.status(404).json({ message: "No Device found" });
    }

    return res.status(200).json({
      message: "Device retrieved successfully",
      data: deviceData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.createDevice = async (req, res) => {
  try {
    const data = req.body;
    const deviceData = await createDeviceServices(
      data
      // userId: req.user.id,
    );
    await createLogActivity(req, `Created device`);

    return res
      .status(200)
      .json({ message: "Device created", data: deviceData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const deviceId = req.params.id;

    const data = req.body;
    const deviceData = await updateDeviceServices(deviceId, data);
    if (!deviceData) {
      return res.status(404).json({ message: "Device not found" });
    }
    await createLogActivity(req, `update device`);

    return res
      .status(200)
      .json({ message: "Device updated", data: deviceData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.softDeleteDevice = async (req, res) => {
  try {
    const deviceId = req.params.id;
    const data = await softDeleteDeviceService(deviceId);
    if (!data) {
      return res.status(404).json({ message: "Device not found" });
    }
    await createLogActivity(req, `delete device`);

    return res.status(200).json({ message: "Device soft deleted", data: data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const deviceId = req.params.id;
    const deviceData = await deleteDeviceServices(deviceId);
    if (!deviceData) {
      return res.status(404).json({ message: "Device not found" });
    }
    return res
      .status(200)
      .json({ message: "Device deleted", data: deviceData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};