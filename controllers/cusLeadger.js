const PDFDocument = require("pdfkit-table");
const { getLedgerData } = require("../services/cusLeader");
require("pdfkit-table");

const exportLedgerPdf = async (req, res) => {
  try {
    const { sellData, stockData, repairData } = await getLedgerData(req);

    // Initialize PDF document
    const doc = new PDFDocument({ margin: 20, size: "A4" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=customer_ledger.pdf"
    );
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Customer Ledger", { align: "center" }).moveDown(1);

    // Table rendering function
    const renderTable = (title, data) => {
      if (!Array.isArray(data) || data.length === 0) {
        doc.fontSize(12).text(`${title} has no data.`).moveDown();
        return;
      }

      // Section title
      doc.fontSize(16).text(title, { underline: true }).moveDown(0.5);

      // Define headers
      const headers = [
        { label: "#", property: "index", width: 30, align: "center" },
        { label: "Customer", property: "customer", width: 100 },
        { label: "Model", property: "model", width: 80 },
        { label: "Device", property: "device", width: 80 },
        { label: "Total", property: "total", width: 70, align: "right" },
        { label: "Paid", property: "paid", width: 70, align: "right" },
        {
          label: "Remaining",
          property: "remaining",
          width: 70,
          align: "right",
        },
        {
          label: "Estimated",
          property: "estimated",
          width: 70,
          align: "right",
        },
      ];

      // Format data into object-based rows
      const datas = data.map((item, i) => ({
        index: i + 1,
        customer: item.customerName?.customerName || "N/A",
        model: item.modelName?.modelName || "N/A",
        device: item.deviceName?.deviceName || "N/A",
        total: item.amount || item.totalAmount || "-",
        paid:
          item.customerPaid !== undefined || item.paidToCustomer !== undefined
            ? item.customerPaid ?? item.paidToCustomer
            : "-",
        remaining:
          item.remainingAmount !== undefined ? item.remainingAmount : "-",
        estimated: item.estimatedCost !== undefined ? item.estimatedCost : "-",
      }));

      doc.table(
        {
          headers,
          datas,
        },
        {
          width: doc.page.width - doc.options.margin * 2,
          prepareHeader: () =>
            doc.font("Helvetica-Bold").fontSize(10).fillColor("black"),
          prepareRow: () =>
            doc.font("Helvetica").fontSize(9).fillColor("black"),
          columnSpacing: 2,
          padding: 2,
        }
      );

      doc.moveDown();
    };

    // Ensure space for first table
    if (doc.y > doc.page.height - 300) {
      doc.addPage();
    }

    // Render all ledgers
    renderTable("Sell Ledger", sellData);
    renderTable("Stock Ledger", stockData);
    renderTable("Repair Ledger", repairData);

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error("Export PDF Error:", err);
    res.status(500).send("Failed to export PDF.");
  }
};

module.exports = {
  exportLedgerPdf,
};
