const Payment = require("../models/payment");

exports.getAllPaymentService = async () => {
  const pay = await Payment.find({ isDeleted: false }).lean();

  return pay;
};

exports.getPaymentService = async (paymentId) => {
  return await Payment.findById(paymentId).populate("organization").lean();
};

exports.createPaymentService = async (newPayment) => {
  return await Payment.create(newPayment);
};

exports.updatePaymentService = async (paymentId, payment) => {
  return await Payment.findByIdAndUpdate(paymentId, payment, {
    new: true,
  }).lean();
};

exports.softDeletePaymentService = async (paymentId) => {
  return await Payment.findByIdAndUpdate(paymentId, { isDeleted: true });
};

exports.deletePaymentService = async (paymentId) => {
  return await Payment.findByIdAndDelete(paymentId);
};
