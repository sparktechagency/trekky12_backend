const Insurance = require('../models/insurance.model');
const { deleteFile } = require('../utils/unlinkFile');

const addInsurance = async (req, res) => {
  try {
    const documentPaths = req.files ? req.files.map(file => file.path) : 
                         req.file ? [req.file.path] : [];

    const {
      companyName,
      websiteLink,
      phoneNumber,
      effectiveDate,
      renewalDate,
      cost,
      policyNumber
    } = req.body;

    const userId = req.user.id || req.user._id || req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }

    const insurance = await Insurance.create({
      companyName,
      websiteLink,
      phoneNumber,
      effectiveDate,
      renewalDate,
      cost,
      policyNumber,
      pictures: documentPaths.length > 0 ? documentPaths : [],
      user: userId
    });

    res.status(201).json({ 
      message: 'Insurance added successfully', 
      insurance, 
      uploadedFiles: documentPaths 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding insurance', error });
  }
};

const updateInsurance = async (req, res) => {
  try {
    const { id } = req.params;
    const documentPaths = req.files ? req.files.map(file => file.path) : 
                         req.file ? [req.file.path] : [];

    const {
      companyName,
      websiteLink,
      phoneNumber,
      effectiveDate,
      renewalDate,
      cost,
      policyNumber
    } = req.body;

    // Find insurance and check if it belongs to the user
    const existingInsurance = await Insurance.findOne({
      _id: id,
      user: req.user.id || req.user._id || req.user.userId
    });

    if (!existingInsurance) {
      return res.status(404).json({ message: 'Insurance not found or unauthorized' });
    }

    // Delete old files if new ones are being uploaded
    if (documentPaths.length > 0 && existingInsurance.pictures.length > 0) {
      try {
        for (const oldPicture of existingInsurance.pictures) {
          await deleteFile(oldPicture);
        }
        console.log('Old files deleted successfully');
      } catch (deleteError) {
        console.error('Error deleting old files:', deleteError);
      }
    }

    const updatedInsurance = await Insurance.findByIdAndUpdate(
      id,
      {
        companyName,
        websiteLink,
        phoneNumber,
        effectiveDate,
        renewalDate,
        cost,
        policyNumber,
        ...(documentPaths.length > 0 && { pictures: documentPaths })
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Insurance updated successfully',
      insurance: updatedInsurance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating insurance', error: error.message });
  }
};

const getInsurances = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;
    const insurances = await Insurance.find({ user: userId });
    res.status(200).json({ insurances });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching insurances', error });
  }
};

const getInsurance = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id || req.user.userId;
    
    const insurance = await Insurance.findOne({ _id: id, user: userId });
    
    if (!insurance) {
      return res.status(404).json({ message: 'Insurance not found or unauthorized' });
    }

    res.status(200).json({ insurance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching insurance', error });
  }
};

const deleteInsurance = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id || req.user.userId;

    const insurance = await Insurance.findOne({ _id: id, user: userId });

    if (!insurance) {
      return res.status(404).json({ message: 'Insurance not found or unauthorized' });
    }

    // Delete associated pictures
    if (insurance.pictures.length > 0) {
      try {
        for (const picture of insurance.pictures) {
          await deleteFile(picture);
        }
        console.log('Insurance pictures deleted successfully');
      } catch (deleteError) {
        console.error('Error deleting insurance pictures:', deleteError);
      }
    }

    await insurance.deleteOne();
    res.status(200).json({ message: 'Insurance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting insurance', error });
  }
};

module.exports = { 
  addInsurance, 
  updateInsurance, 
  getInsurances, 
  getInsurance, 
  deleteInsurance 
};