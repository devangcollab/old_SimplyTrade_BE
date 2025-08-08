const {
  createRepairService,
  getAllRepairDataServices,
  updateRepairServices,
  softDeleteRepairService,
  deleteRepairService,
  getRepairService,
} = require("../services/repair");
const { createLogActivity } = require("../utils/logActivity");

exports.getAllRepairData = async (req, res) => {
  try {
    const userOrgId = req.user.org;
    const role = req.user.role;
    const userId = req.user.id;
    const repairData = await getAllRepairDataServices(
      userOrgId,
      role,
      userId,
      req
    );

    if (!repairData)
      return res.status(404).json({ message: "Repair Data not Found" });

    return res.status(200).json({
      message: "RepairData retrieved successfully",
      data: repairData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getRepair = async (req, res) => {
  try {
    const repairId = req.params.id;
    const repair = await getRepairService(repairId);
    if (!repair) {
      return res.status(404).json({ message: "No Repair found" });
    }

    return res.status(200).json({
      message: "Repair retrieved successfully",
      data: repair,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.createRepair = async (req, res) => {
  try {
    const newData = req.body;
    const { device } = newData;

    if (!device || !Array.isArray(device) || device.length === 0) {
      return res.status(400).json({ message: "Invalid device data" });
    }

    const repairEntries = [];

    device.forEach((deviceItem) => {
      const repairEntry = {
        organization: newData.organization,
        branch: newData.branch,
        customerName: newData.customerName,
        customerPhone: newData.customerPhone,
        email: newData.email,
        modelName: deviceItem.modelName,
        deviceName: deviceItem.deviceName,
        amount: deviceItem.amount,
        estimatedCost: deviceItem.estimatedCost,
        status: deviceItem.status,
        date: deviceItem.date,
      };

      repairEntries.push(repairEntry);
    });

    const createRepair = await Promise.all(
      repairEntries.map((entry) => createRepairService(entry))
    );
    await createLogActivity(req, ` repair ${repairEntries?.length} created`);

    return res
      .status(200)
      .json({ message: "RepairData created", data: createRepair });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.updateRepairData = async (req, res) => {
  try {
    const repairId = req.params.id;
    const updateData = req.body;

    if (updateData.device && !Array.isArray(updateData.device)) {
      return res.status(400).json({ message: "Device must be an array" });
    }

    const updatedRepair = await updateRepairServices(repairId, updateData);
    if (!updatedRepair) {
      return res.status(404).json({ message: "Repair not found" });
    }
    await createLogActivity(req, `repair update`);

    return res
      .status(200)
      .json({ message: "Repair updated", data: updatedRepair });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.softDeleteRepair = async (req, res) => {
  try {
    const repairId = req.params.id;
    const repair = await softDeleteRepairService(repairId);
    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }
    await createLogActivity(req, `repair delete`);

    return res
      .status(200)
      .json({ message: "Repair soft deleted", data: repair });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteStock = async (req, res) => {
  try {
    const repairId = req.params.id;
    const repair = await deleteRepairService(repairId);
    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }
    return res.status(200).json({ message: "Repair deleted", data: repair });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
