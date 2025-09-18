const RV = require('./RV');
const asyncHandler = require('../../../utils/asyncHandler');
const User = require('../User/User');

exports.addRv = asyncHandler(async (req, res) => {
    console.log(req.body);
    const rv = await RV.create(req.body);
    const user = await User.findById(req.user.id);
    console.log(user);
     user?.rvIds?.push(rv._id);
    // console.log(req.user);
    await user.save();
    await rv.save();
    res.status(201).json({
        success: true,
        data: rv
    })
}) 


exports.getUserRvs = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('rvIds');
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    res.status(200).json({
        success: true,
        data: user.rvIds || []
    });
});




exports.getRv = asyncHandler(async (req, res) => {
    const rv = await RV.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: rv
    })
})

exports.updateRv = asyncHandler(async (req, res) => {
    const rv = await RV.findByIdAndUpdate(req.params.id, req.body, {
        new: true
        })
    res.status(200).json({
        success: true,
        data: rv
    })
})

exports.deleteRv = asyncHandler(async (req, res) => {
    const rv = await RV.findByIdAndDelete(req.params.id);
    // Remove the deleted RV's ID from all users' rvIds arrays
    if (rv) {
        const User = require('../User/User');
        await User.updateMany(
            { rvIds: rv._id },
            { $pull: { rvIds: rv._id } }
        );
    }
    res.status(200).json({
        success: true,
        data: rv
    })
})

exports.updateCurrentMileage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { currentMileage } = req.body;

    if (typeof currentMileage !== 'number') {
        return res.status(400).json({
            success: false,
            message: 'currentMileage must be a number'
        });
    }

    const rv = await RV.findById(id);
    if (!rv) {
        return res.status(404).json({
            success: false,
            message: 'RV not found'
        });
    }

    rv.currentMileage = currentMileage;
    await rv.save();

    res.status(200).json({
        success: true,
        message: 'Current mileage updated successfully',
        data: rv
    });
});


//for admin
exports.getRvs = asyncHandler(async (req, res) => {
    const rvs = await RV.find();
    res.status(200).json({
        success: true,
        data: rvs
    })
})