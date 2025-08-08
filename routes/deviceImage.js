const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const API_TOKEN = "ae41fb86c2766e9e662f924a07bca78a4828838a";

// Proxy: search device
router.get("/proxy/device-search", async (req, res) => {
  const { name } = req.query;
  try {
    const response = await fetch(
      `https://mobileapi.dev/devices/search/?name=${encodeURIComponent(name)}`,
      {
        headers: { Authorization: `Token ${API_TOKEN}` },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Device search failed" });
  }
});

// Proxy: device detail
router.get("/proxy/device-detail/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`https://mobileapi.dev/devices/${id}/`, {
      headers: { Authorization: `Token ${API_TOKEN}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Device detail fetch failed" });
  }
});

module.exports = router;
