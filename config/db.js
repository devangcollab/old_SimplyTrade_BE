const mongoose = require("mongoose");

exports.connectMongoDB = () => {
  mongoose
    .connect(process.env.MONG_URL)
    .then(console.log("MongoDB connected"))
    .catch((err) => console.log(" mongo error:",err));
};
