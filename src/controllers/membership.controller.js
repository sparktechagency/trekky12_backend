const Membership = require('../models/membership.model');
const { deleteFile } = require('../utils/unlinkFile');

const addMembership = async (req, res) => {
  try {

    const documentPaths = req.files ? req.files.map(file => file.path) : 
                         req.file ? [req.file.path] : [];

    const {
      name,
      datePurchased,
      website,
      phoneNumber,
      accountNumber,
      amountPaid,
      expirationDate,
      picture,
      notes
    } = req.body;


    const userId = req.user.id || req.user._id || req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }

    const membership = await Membership.create({
      name,
      datePurchased,
      website,
      phoneNumber,
      accountNumber,
      amountPaid,
      expirationDate,
      picture: documentPaths[0] || null, // Assuming only one picture is uploaded
      notes,
      user: userId // Assuming user ID is available in req.user
    });

    res.status(201).json({ message: 'Membership added successfully', membership, uploadedFile: documentPaths[0] || null });
  } catch (error) {
    res.status(500).json({ message: 'Error adding membership', error });
  }
}


const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const documentPaths = req.files ? req.files.map(file => file.path) : 
                         req.file ? [req.file.path] : [];
    const {
      datePurchased,
      amountPaid,
      expirationDate,
      notes
    } = req.body;

    // Find membership and check if it belongs to the user
    const existingMembership = await Membership.findOne({
      _id: id,
      user: req.user.id || req.user._id || req.user.userId
    });

    if (!existingMembership) {
      return res.status(404).json({ message: 'Membership not found or unauthorized' });
    }

    // Delete old file if new one is being uploaded
    if (documentPaths.length > 0 && existingMembership.picture) {
      try {
        await deleteFile(existingMembership.picture);
        console.log('Old file deleted successfully');
      } catch (deleteError) {
        console.error('Error deleting old file:', deleteError);
      }
    }

    const updatedMembership = await Membership.findByIdAndUpdate(
      id,
      {
        datePurchased,
        amountPaid,
        expirationDate,
        notes,
        ...(documentPaths.length > 0 && { picture: documentPaths[0] })
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Membership updated successfully',
      membership: updatedMembership
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating membership', error: error.message });
  }
};

module.exports = { addMembership, updateMembership };