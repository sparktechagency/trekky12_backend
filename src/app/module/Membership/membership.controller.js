const Membership = require('./Membership');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const upload = require('../../../utils/uploadConfig');
const deleteFile = require('../../../utils/unlinkFile');


exports.createMembership = asyncHandler(async (req, res) => {
    const membership = await Membership.create(req.body);
    if (!membership) throw new ApiError('Membership not created', 500);
    const images = req.files.map(image => image.path.replace('upload/', ''));
    membership.images = images;
    await membership.save();

    res.status(201).json({
        success: true,
        message: 'Membership created successfully',
        membership
    });
});

exports.getMembership = asyncHandler(async (req, res) => {
    const membership = await Membership.find();
    if (!membership) throw new ApiError('Membership not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Membership retrieved successfully',
        membership
    });
});

exports.getMembershipById = asyncHandler(async (req, res) => {
    const membership = await Membership.findById(req.params.id);
    if (!membership) throw new ApiError('Membership not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Membership retrieved successfully',
        membership
    });
});


exports.updateMembership = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
  
      // Convert values from req.body
      const renewalDate = new Date(req.body.renewalDate);
      const expirationDate = new Date(req.body.expirationDate);
      const cost = Number(req.body.cost);
  
      // Prepare update fields
      const updateData = {
        renewalDate,
        expirationDate,
        cost,
        membershipNumber: req.body.membershipNumber,
        notes: req.body.notes,
      };
  
      // Handle uploaded images (if any)
      if (req.files && req.files.length > 0) {
        updateData.images = req.files.map(file => file.path);
      }
  
      // Find existing membership
      const membership = await Membership.findById(id);
      if (!membership) {
        throw new ApiError('Membership not found', 404);
      }
  
      // Calculate new expiration and payment
      const prevExpiration = new Date(membership.membershipExpiration || renewalDate);
      const prevAmount = Number(membership.amountPaid || 0);
  
      const extensionDuration = expirationDate.getTime() - renewalDate.getTime();
      const newExpiration = new Date(prevExpiration.getTime() + extensionDuration);
      const newAmountPaid = prevAmount + cost;
  
      // Assign calculated fields
      updateData.membershipExpiration = newExpiration;
      updateData.amountPaid = newAmountPaid;
  
      // Push to history
      membership.history.unshift({
        updatedAt: new Date(),
        cost,
        renewalDate,
        expirationDate,
      });
  
      // Update and save
      const updatedMembership = await Membership.findByIdAndUpdate(id, updateData, { new: true });
      await membership.save(); // Save updated history
  
      res.status(200).json(updatedMembership);
    } catch (error) {
      res.status(500).json({
        message: 'Update failed',
        error: error.message || error, 
      });
    }
});

exports.deleteMembership = asyncHandler(async (req, res) => {
    const membership = await Membership.findByIdAndDelete(req.params.id);
    if (!membership) throw new ApiError('Membership not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Membership deleted successfully',
        membership
    });
});
