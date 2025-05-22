const RV = require('../models/rv.model');
const { deleteFile } = require('../utils/unlinkFile');

const addRV = async (req, res) => {
  try {
    const documentPaths = req.files ? req.files.map(file => file.path) : [];
    // console.log('Files received:', req.files);
    // console.log('Document paths:', documentPaths);
    const {
      type,
      manufacturer,
      year,
      mileage,
      nickname,
      datePurchased,
      amountPaid,
      purchasedFrom,
      city,
      state,
      phoneNumber,
      website,
      documents,
      notes,
      model,
      name,
      floorplan,
      length,
      width,
      height,
      weight,
      interiorColorScheme,
      exteriorColorScheme,
      class: rvClass,
      vin,
      serialId
    } = req.body;

    const rv = await RV.create({
      type,
      manufacturer,
      year,
      mileage,
      nickname,
      datePurchased,
      amountPaid,
      purchasedFrom,
      city,
      state,
      phoneNumber,
      website,
      documents: documentPaths,
      notes,
      model,
      name,
      floorplan,
      length,
      width,
      height,
      weight,
      interiorColorScheme,
      exteriorColorScheme,
      class: rvClass,
      vin,
      serialId,
      user: req.user.userId // Associate RV with the logged-in user
    });

    res.status(201).json(rv);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add RV', error: error.message });
  }
};

const getRVDetails = async (req, res) => {
  try {
    const { rvId } = req.params;

    const rv = await RV.findById(rvId)
      .populate('user', 'name email') // This will include user's name and email
      .lean();

    if (!rv) {
      return res.status(404).json({ message: 'RV not found' });
    }

    res.status(200).json(rv);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch RV details', 
      error: error.message 
    });
  }
};


const updateRV = async (req, res) => {
  try {
    const { rvId } = req.params;
    const documentPaths = req.files ? req.files.map(file => file.path) : [];
    
    // Get existing RV to check ownership
    const existingRV = await RV.findById(rvId);
    if (!existingRV) {
      return res.status(404).json({ message: 'RV not found' });
    }

    // Check if the user owns this RV
    if (existingRV.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this RV' });
    }

    // Delete old file if new one is being uploaded
    // if (documentPaths.length > 0 && existingRV.documents) {
    //   try {
    //     await deleteFile(existingRV.documents);
    //     console.log('Old file deleted successfully');
    //   } catch (deleteError) {
    //     console.error('Error deleting old file:', deleteError);
    //   }
    // }

    // Prepare update data
    const updateData = {
      ...req.body,
      class: req.body.class || existingRV.class
    };

    // Only add new documents if files were uploaded
    if (documentPaths.length > 0) {
      updateData.documents = [...existingRV.documents, ...documentPaths];
    }

    const updatedRV = await RV.findByIdAndUpdate(
      rvId,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.status(200).json(updatedRV);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update RV', 
      error: error.message 
    });
  }
};

const deleteRV = async (req, res) => {
  try {
    const { rvId } = req.params;

    // Get existing RV to check ownership
    const existingRV = await RV.findById(rvId);
    if (!existingRV) {
      return res.status(404).json({ message: 'RV not found' });
    }

    // Check if the user owns this RV
    if (existingRV.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this RV' });
    }

    // Delete associated document files
    if (existingRV.documents && existingRV.documents.length > 0) {
      for (const documentPath of existingRV.documents) {
        try {
          await deleteFile(documentPath);
        } catch (deleteError) {
          console.error(`Error deleting file ${documentPath}:`, deleteError);
        }
      }
    }

    // Delete the RV
    await RV.findByIdAndDelete(rvId);

    res.status(200).json({ message: 'RV deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete RV', 
      error: error.message 
    });
  }
};

module.exports = { addRV, getRVDetails,updateRV, deleteRV };