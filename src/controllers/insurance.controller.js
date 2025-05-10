const Insurance = require('../models/insurance.model');

// Create new insurance
exports.createInsurance = async (req, res) => {
  try {
    const docs = req.files ? req.files.map(file => file.path) : [];
    const insurance = new Insurance({
      ...req.body,
      documents: docs,
      user: req.user.id // assuming you have authentication middleware
    });
    await insurance.save();
    res.status(201).json(insurance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all insurances for a user
exports.getInsurances = async (req, res) => {
  try {
    const insurances = await Insurance.find({ user: req.user.id });
    res.json(insurances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single insurance by ID
exports.getInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findOne({ _id: req.params.id, user: req.user.id });
    if (!insurance) return res.status(404).json({ error: 'Not found' });
    res.json(insurance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update insurance
exports.updateInsurance = async (req, res) => {
  try {
    const docs = req.files ? req.files.map(file => file.path) : [];
    const updateData = { ...req.body };
    if (docs.length) updateData.documents = docs;
    const insurance = await Insurance.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    );
    if (!insurance) return res.status(404).json({ error: 'Not found' });
    res.json(insurance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete insurance
exports.deleteInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!insurance) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
