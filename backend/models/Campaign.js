const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  client: { type: String, required: true },
  startDate: { type: Date, required: true },
  status: { type: String, default: 'Active' }
});

module.exports = mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
