const RV = require('./RV');
const asyncHandler = require('../../../utils/asyncHandler');

exports.addRv = asyncHandler(async (req, res) => {
    const rv = await RV.create(req.body);
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
