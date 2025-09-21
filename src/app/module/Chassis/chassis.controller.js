const Chassis = require('./Chassis');
const { ApiError } = require('../../../errors/errorHandler');
const asyncHandler = require('../../../utils/asyncHandler');
const RV = require('../RV/RV');

exports.createChassis = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    // console.log(userId);
    const { rvId } = req.body; // Ensure rvId is passed in the request body

    const chassis = await Chassis.create({ ...req.body, user: userId, rvId });
    const rv = await RV.findById(req.body.rvId);
    if (rv) {
        rv.chassis = chassis._id; // Assuming chassisId is the field in RV schema
        await rv.save();
    }

    return res.status(201).json({
        success: true,
        message: 'Chassis created successfully',
        chassis
    });
});


//logged in user can see his own chessis and related rv if query rvId is provided
exports.getChassis = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const currentRv = req.query.rvId;
    const chassis = await Chassis.find({ user: userId, rvId: currentRv });
    if (!chassis) throw new ApiError('Chassis not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Chassis retrieved successfully',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        chassis
    });
});


//in the ui we already show those chessis which belongs to logged in user and his related rv
exports.getChassisById = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const chassis = await Chassis.findById(req.params.id).populate('user', 'name email');
    if (!chassis) throw new ApiError('Chassis not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Chassis retrieved successfully',
        chassis
    });
});


//for update the chessis of logged in user and his related rv you need to give id of the chessis. 
exports.updateChassis = asyncHandler(async (req, res) => {

    const chassis = await Chassis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!chassis) throw new ApiError('Chassis not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Chassis updated successfully',
        chassis
    });
});

//for delete the chessis of logged in user and his related rv you need to give id of the chessis. 
exports.deleteChassis = asyncHandler(async (req, res) => {
    const chassis = await Chassis.findByIdAndDelete(req.params.id);
    if (!chassis) throw new ApiError('Chassis not found', 404);
    const rv = await RV.updateOne({ chassis: chassis._id }, { $unset: { chassis: "" } });
    return res.status(200).json({
        success: true,
        message: 'Chassis deleted successfully',
        chassis
    });
});
