const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");
const campaignRoutes = require("./routes/campaignRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 8081;

const userRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/campaigns", campaignRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campaigndb')
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("signups", userSchema);

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });

  if (existing) {
    return res.json({ success: false, message: "User already exists" });
  }

  const newUser = new User({ name, email, password });
  await newUser.save();
  res.json({ success: true });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (user) {
    res.json({ success: true, user });
  } else {
    res.json({ success: false });
  }
});

const campaignSchema = new mongoose.Schema({
  title: String,
  client: String,
  startDate: Date,
  status: { type: String, default: 'Active' }
});

const Campaign = require("./models/Campaign");

app.post('/api/campaigns', async (req, res) => {
  try {
    const { title, client, startDate } = req.body;
    const campaign = new Campaign({ title, client, startDate, status: 'Active' });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    console.error(' Error adding campaign:', err);
    res.status(500).json({ message: 'Failed to add campaign' });
  }
});

app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    console.error(' Error fetching campaigns:', err);
    res.status(500).json({ message: 'Failed to fetch campaigns' });
  }
});

app.put("/api/campaigns/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await Campaign.findByIdAndUpdate(id, { status }, { new: true });

    if (!result) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(' Error deleting campaign:', err);
    res.status(500).json({ message: 'Failed to delete campaign' });
  }
});

app.use(express.static(path.join(__dirname, '../frontend')));
app.use("/api/campaigns", campaignRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
