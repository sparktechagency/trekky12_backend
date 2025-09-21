const User = require('../User/User');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');

exports.getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        users
    });
});

exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        user
    });
});

exports.blockUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    user.isBlocked = true;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'User blocked successfully',
        user
    });
});

exports.unblockUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    user.isBlocked = false;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'User unblocked successfully',
        user
    });
});

exports.deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new ApiError('User not found', 404);
    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        user
    });
});