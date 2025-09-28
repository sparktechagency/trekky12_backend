const User = require('../User/User');
const { ApiError } = require('../../../errors/errorHandler');
const asyncHandler = require('../../../utils/asyncHandler');
const tokenService = require('../../../utils/tokenService');
const emailService = require('../../../utils/emailService');
const bcrypt = require('bcrypt');
const RV = require('../RV/RV');

exports.getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate({
            path: 'rvIds',
            select: 'nickname currentMileage isOverdueForMaintenance',
        })
        .populate('selectedRvId', 'nickname currentMileage isOverdueForMaintenance')
        .select('-password');
    if (!user) throw new ApiError('User not found', 404);
    return res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        user,
    });
});


exports.updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { name, phone, currentMileage } = req.body;
    const update = { name, phone, currentMileage };
    if (req.file) {
        update.profilePic = req.file.location;
    }
    const user = await User.findById(userId);
    if (!user) throw new ApiError('User not found', 404);
    const selectedRv = user.selectedRvId;
    if (selectedRv) {
        const rv = await RV.findByIdAndUpdate(selectedRv, { currentMileage }, { new: true });
        if (!rv) throw new ApiError('RV not found', 404);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password')
        .populate('rvIds', 'nickname currentMileage')
        .populate('selectedRvId', 'nickname currentMileage')
    
    return res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        user: updatedUser,
    });
});



exports.changePassword = asyncHandler(async (req, res) => { // start of change password function
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id); // get user from database
    if (!user) throw new ApiError('User not found', 404); // if user does not exist, throw error
    if (newPassword !== confirmPassword) throw new ApiError('Confirm password do not match', 400); // if new and confirm password do not match, throw error
    if (oldPassword === newPassword) throw new ApiError('New password cannot be the same as the old password', 400); // if new password is the same as old password, throw error
    const isMatch = await bcrypt.compare(oldPassword, user.password); // compare old password with stored password in database
    if (!isMatch) throw new ApiError('Invalid old password', 404); // if old password is invalid, throw error
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword; // update user password
    await user.save(); // save user to database
    return res.status(200).json({ // return success message
        success: true,
        message: 'Password changed successfully'
    });
});


exports.deleteAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id); // get user from database
    if (!user) throw new ApiError('User not found', 404); // if user does not exist, throw error
    await user.deleteOne(); // delete user from database
    return res.status(200).json({ // return success message
        success: true,
        message: 'Account deleted successfully'
    });
});


exports.selectRV = asyncHandler(async (req, res) => {
    const { rvId } = req.body;
    const user = await User.findById(req.user.id); // get user from database
    if (!user) throw new ApiError('User not found', 404); // if user does not exist, throw error
    if (user.rvIds.length > 1) {
        user.selectedRvId = rvId; // update user selected rv id
    } else {
        user.selectedRvId = user.rvIds[0]; // update user selected rv id
    }
    await user.save(); // save user to database
    return res.status(200).json({ // return success message
        success: true,
        message: 'RV selected successfully'
    });
});
