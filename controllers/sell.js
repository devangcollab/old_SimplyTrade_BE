const {
  getAllSellService,
  getSellService,
  createSellService,
  updateSellService,
  softDeleteSellService,
  deleteSellService,
  getAllStockSellRepairService,
  getSellByDateService,
} = require("../services/sell");
const { createLogActivity } = require("../utils/logActivity");

exports.getAllSell = async (req, res) => {
  try {
    const userOrgId = req.user.org;
    const userBranchId = req.user.orgBranch;
    const role = req.user.role;
    const userId = req.user.id;
    const sell = await getAllSellService(userBranchId, role, userId, req);
    if (!sell) {
      return res.status(404).json({ message: "No sell found" });
    }

    return res.status(200).json({
      message: "Sell retrieved successfully",
      data: sell,
    });
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getSell = async (req, res) => {
  try {
    const sellId = req.params.id;
    const sell = await getSellService(sellId);
    if (!sell) {
      return res.status(404).json({ message: "No sell found" });
    }

    return res.status(200).json({
      message: "Sell retrieved successfully",
      data: sell,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.createSell = async (req, res) => {
  try {
    const newSell = req.body;

    const { device, stock, payment } = newSell;

    const deviceData = newSell && newSell.device && newSell.device[0];

    // Validate request body
    if (!device || !Array.isArray(device) || device.length === 0) {
      return res.status(400).json({ message: "Invalid device data" });
    }

    const sellEntries = [];

    device.forEach((deviceItem) => {
      const sellEntry = {
        organization: newSell.organization,
        branch: newSell.branch,
        customerName: newSell.customerName,
        customerPhone: newSell.customerPhone,
        stock: newSell.stock,
        modelName: deviceItem.modelName,
        deviceName: deviceItem.deviceName,
        amount: deviceItem.amount,
        customerPaid: deviceItem.customerPaid,
        remainingAmount: deviceItem.remainingAmount,
        paymentType: deviceItem.paymentType,
        payment: payment,
        upload: deviceItem.upload,
      };
      sellEntries.push(sellEntry);
    });

    // Save all sell entries to the database
    const createdSells = await Promise.all(
      sellEntries.map((entry) =>
        createSellService(entry, stock, deviceData.amount)
      )
    );
    await createLogActivity(req, `create ${sellEntries.length} sell `);

    return res
      .status(200)
      .json({ message: "Sell created", data: createdSells });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.updateSell = async (req, res) => {
  try {
    const sellId = req.params.id;
    const updateData = req.body;

    if (updateData.device && !Array.isArray(updateData.device)) {
      return res.status(400).json({ message: "Invalid device data" });
    }

    const updatedSell = await updateSellService(sellId, updateData);
    if (!updatedSell) {
      return res.status(404).json({ message: "Sell not found" });
    }
    await createLogActivity(req, `sell update`);

    return res.status(200).json({ message: "Sell updated", data: updatedSell });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.softDeleteSell = async (req, res) => {
  try {
    const sellId = req.params.id;
    const sell = await softDeleteSellService(sellId);
    if (!sell) {
      return res.status(404).json({ message: "Sell not found" });
    }
    await createLogActivity(req, `sell delete`);

    return res.status(200).json({ message: "Sell soft deleted", data: sell });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteSell = async (req, res) => {
  try {
    const sellId = req.params.id;
    const sell = await deleteSellService(sellId);
    if (!sell) {
      return res.status(404).json({ message: "Sell not found" });
    }
    return res.status(200).json({ message: "Sell deleted", data: sell });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getAllStockSellRepair = async (req, res) => {
  try {
    const userOrgId = req.user?.org;
    const role = req.user?.role;
    const userId = req.user?.id;
    const userBranchId = req.user?.orgBranch;

    const allData = await getAllStockSellRepairService(
      userOrgId,
      role,
      userId,
      req,
      userBranchId
    );
    if (!allData) {
      return res.status(404).json({ message: "No Data found" });
    }

    return res.status(200).json({
      message: "Data retrieved successfully",
      data: allData,
    });
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getSellByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const branchId = req.user.orgBranch;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required.",
      });
    }

    const expenses = await getSellByDateService(
      { startDate, endDate },
      branchId
    );

    res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error("❌ Error in getSellByDate:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching sell.",
    });
  }
};
