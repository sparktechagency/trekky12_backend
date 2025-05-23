const Repair = require('../models/repair.model');

const addRepair = async (req, res) => {
    try {
        const {
            vendor,
            rv,
            city,
            dropOffDate,
            cost,
            mileage,
            repair,
            message
        } = req.body;

        const newRepair = await Repair.create({
            vendor,
            rv,
            city,
            dropOffDate,
            cost,
            mileage,
            repair,
            message,
            user: req.user.id || req.user._id || req.user.userId
        });

        res.status(201).json({
            message: 'Repair record created successfully',
            repair: newRepair
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating repair record', 
            error: error.message 
        });
    }
};

const updateRepair = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            vendor,
            rv,
            city,
            dropOffDate,
            cost,
            mileage,
            repair,
            message,
            status
        } = req.body;

        const existingRepair = await Repair.findOne({
            _id: id,
            user: req.user.id || req.user._id || req.user.userId
        });

        if (!existingRepair) {
            return res.status(404).json({ 
                message: 'Repair record not found or unauthorized' 
            });
        }

        const updatedRepair = await Repair.findByIdAndUpdate(
            id,
            {
                date,
                vendor,
                rv,
                city,
                dropOffDate,
                cost,
                mileage,
                repair,
                message,
                status
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Repair record updated successfully',
            repair: updatedRepair
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating repair record', 
            error: error.message 
        });
    }
};

const getRepairs = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id || req.user.userId;
        const repairs = await Repair.find({ user: userId })
            .populate('rv', 'nickname manufacturer model')
            .populate('vendor', 'name');

        res.status(200).json({ repairs });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching repair records', 
            error: error.message 
        });
    }
};

const getRepair = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id || req.user._id || req.user.userId;

        const repair = await Repair.findOne({ 
            _id: id, 
            user: userId 
        })
        .populate('rv', 'nickname manufacturer model')
        .populate('vendor', 'name');

        if (!repair) {
            return res.status(404).json({ 
                message: 'Repair record not found or unauthorized' 
            });
        }

        res.status(200).json({ repair });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching repair record', 
            error: error.message 
        });
    }
};

const deleteRepair = async (req, res) => {
    try {
        const { id } = req.params;
        const repair = await Repair.findOne({
            _id: id,
            user: req.user.id || req.user._id || req.user.userId
        });

        if (!repair) {
            return res.status(404).json({ 
                message: 'Repair record not found or unauthorized' 
            });
        }

        await repair.deleteOne();
        res.status(200).json({ message: 'Repair record deleted successfully' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting repair record', 
            error: error.message 
        });
    }
};

module.exports = {
    addRepair,
    updateRepair,
    getRepairs,
    getRepair,
    deleteRepair
};