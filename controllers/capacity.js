const {
  getAllCapacityService,
  getCapacityService,
  createCapacityService,
  updateCapacityService,
  deleteCapacityService,
  softDeleteCapacityService,
  selectCapacityByDeviceService,
} = require("../services/capacity");
const { createLogActivity } = require("../utils/logActivity");

exports.getAllCapacity = async (req, res) => {
  try {
    userId = req.user.id;
    const cap = await getAllCapacityService(userId, req);
    if (!cap) {
      return res.status(404).json({ message: "No Capacity found" });
    }
    return res.status(200).json({
      message: "Capacity retrieved successfully",
      data: cap,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getCapacity = async (req, res) => {
  try {
    const capId = req.params.id;
    const cap = await getCapacityService(capId);
    if (!cap) {
      return res.status(404).json({ message: "No Capacity found" });
    }
    return res.status(200).json({
      message: "Capacity retrieved successfully",
      data: cap,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createCapacity = async (req, res) => {
  try {
    const newCap = req.body;
    const createdCap = await createCapacityService(newCap);
    await createLogActivity(req, `Created Capacity`);

    return res
      .status(200)
      .json({ message: "Capacity added", data: createdCap });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.updateCapacity = async (req, res) => {
  try {
    const capId = req.params.id;
    const cap = req.body;
    const updatedCap = await updateCapacityService(capId, cap);
    if (!updatedCap) {
      return res.status(404).json({ message: "Capacity not found" });
    }
    await createLogActivity(req, `update Capacity`);

    return res
      .status(200)
      .json({ message: "Capacity updated", data: updatedCap });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.softDeleteCapacity = async (req, res) => {
  try {
    const capId = req.params.id;
    const cap = await softDeleteCapacityService(capId);
    if (!cap) {
      return res.status(404).json({ message: "Capacity not found" });
    }
    await createLogActivity(req, `delete Capacity`);

    return res
      .status(200)
      .json({ message: "Capacity soft deleted", data: cap });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteCapacity = async (req, res) => {
  try {
    const capId = req.params.id;
    const cat = await deleteCapacityService(capId);
    if (!cap) {
      return res.status(404).json({ message: "Capacity not found" });
    }

    return res.status(200).json({ message: "Capacity deleted", data: cat });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.selectCapacity = async (req, res) => {
  try {
    const deviceId = req?.params?.id;
    const orgText = req?.query?.text || "";

    if (!deviceId && !orgText) {
      return res.status(400).json({
        message: "Please provide either deviceId or orgText for filtering.",
      });
    }

    const Data = await selectCapacityByDeviceService(deviceId, orgText);

    if (!Data || Data.length === 0) {
      return res.status(404).json({ message: "No capacity found" });
    }

    return res.status(200).json({
      message: "Capacity data retrieved successfully",
      data: Data,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
