const {
  getAllCustomerService,
  getCustomerService,
  createCustomerService,
  updateCustomerService,
  deleteCustomerService,
  softDeleteCustomerService,
  searchCustomerServices,
  selectCustomerServices,
  getCustomerByOrgService,
  getSellerByOrgService,
  getBuyerByOrgService,
  getSellerByBranchService,
  getBuyerByBranchService,
  getCustomerByBranchService,
} = require("../services/customer");
const { createLogActivity } = require("../utils/logActivity");

exports.getAllCustomer = async (req, res) => {
  try {
    const userId = req.user.id;
    const userBranchId = req.user.orgBranch;
    const role = req.user.role;
    const cus = await getAllCustomerService(userId, role, userBranchId, req);
    if (!cus) {
      return res.status(404).json({ message: "No Customer found" });
    }
    return res.status(200).json({
      message: "Customer retrieved successfully",
      data: cus,
    });
  } catch (err) {
    return res
      .status(500)

      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const cusId = req.params.id;
    const cus = await getCustomerService(cusId);
    if (!cus) {
      return res.status(404).json({ message: "No Customer found" });
    }
    return res.status(200).json({
      message: "Customer retrieved successfully",
      data: cus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const newCus = req.body;
    const createdCus = await createCustomerService(newCus);
    await createLogActivity(req, `Created customer`);

    return res
      .status(200)
      .json({ message: "Customer added", data: createdCus });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const cusId = req.params.id;
    const cus = req.body;
    const updatedCus = await updateCustomerService(cusId, cus);
    if (!updatedCus) {
      return res.status(404).json({ message: "Customer not found" });
    }
    await createLogActivity(req, `update customer`);

    return res
      .status(200)
      .json({ message: "Customer updated", data: updatedCus });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.softDeleteCustomer = async (req, res) => {
  try {
    const cusId = req.params.id;
    const cus = await softDeleteCustomerService(cusId);
    if (!cus) {
      return res.status(404).json({ message: "Customer not found" });
    }
    await createLogActivity(req, `delete customer`);

    return res
      .status(200)
      .json({ message: "Customer soft deleted", data: cus });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const cusId = req.params.id;
    const cus = await deleteCustomerService(cusId);
    if (!cus) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ message: "Customer deleted", data: cus });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.selectCustomer = async (req, res) => {
  try {
    const branchId = req?.params?.id;
    const orgText = req?.query?.text || "";

    if (!branchId && !orgText) {
      return res.status(400).json({
        message: "Please provide either branchId or orgText for filtering.",
      });
    }

    const customerData = await selectCustomerServices(branchId, orgText);

    if (!customerData || customerData.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }

    return res.status(200).json({
      message: "Customer data retrieved successfully",
      data: customerData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getCustomerByOrg = async (req, res) => {
  try {
    const orgId = req?.params?.id;
    const cus = await getCustomerByOrgService(orgId);
    if (!cus) {
      return res.status(404).json({ message: "No Customer found" });
    }
    return res.status(200).json({
      message: "Customer retrieved successfully",
      data: cus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getCustomerByBranch = async (req, res) => {
  try {
    const branchId = req?.params?.id;
    const cus = await getCustomerByBranchService(branchId);
    if (!cus) {
      return res.status(404).json({ message: "No Customer found" });
    }
    return res.status(200).json({
      message: "Customer retrieved successfully",
      data: cus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSellerByOrg = async (req, res) => {
  try {
    const orgId = req?.params?.id;
    const seller = await getSellerByOrgService(orgId);
    if (!seller) {
      return res.status(404).json({ message: "No Seller found" });
    }
    return res.status(200).json({
      message: "Seller retrieved successfully",
      data: seller,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBuyerByBranch = async (req, res) => {
  try {
    const branchId = req?.params?.id;
    const buyer = await getBuyerByBranchService(branchId);
    if (!buyer) {
      return res.status(404).json({ message: "No Buyer found" });
    }
    return res.status(200).json({
      message: "Buyer retrieved successfully",
      data: buyer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getBuyerByOrg = async (req, res) => {
  try {
    const orgId = req?.params?.id;
    const buyer = await getBuyerByOrgService(orgId);
    if (!buyer) {
      return res.status(404).json({ message: "No Buyer found" });
    }
    return res.status(200).json({
      message: "Buyer retrieved successfully",
      data: buyer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSellerByBranch = async (req, res) => {
  try {
    const branchId = req?.params?.id;
    const seller = await getSellerByBranchService(branchId);
    if (!seller) {
      return res.status(404).json({ message: "No Seller found" });
    }
    return res.status(200).json({
      message: "Seller retrieved successfully",
      data: seller,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
