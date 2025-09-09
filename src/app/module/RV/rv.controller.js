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

exports.getRvs = asyncHandler(async (req, res) => {
    const rvs = await RV.find();
    res.status(200).json({
        success: true,
        data: rvs
    })
})

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
    res.status(200).json({
        success: true,
        data: rv
    })
})
