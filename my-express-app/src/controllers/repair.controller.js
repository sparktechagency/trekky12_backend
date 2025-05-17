const Repair = require('../models/repair.model');

const addRepair = async (req, res) => {
    try {
        const { date, vendor, rv, cost, mileage, repair, message } = req.body;

        const repairEntry = await Repair.create({
            date,
            vendor,
            rv,
            cost,
            mileage,
            repair,
            message,
            user: req.user.id || req.user._id || req.user.userId
        });

        res.status(201).json({
            message: 'Repair added successfully',
            repair: repairEntry
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding repair', error: error.message });
    }
};

const updateRepair = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, vendor, rv, cost, mileage, repair, message } = req.body;

        const updatedRepair = await Repair.findByIdAndUpdate(
            id,
            { date, vendor, rv, cost, mileage, repair, message },
            { new: true, runValidators: true }
        );

        if (!updatedRepair) {
            return res.status(404).json({ message: 'Repair not found' });
        }

        res.json({
            message: 'Repair updated successfully',
            repair: updatedRepair
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating repair', error: error.message });
    }
};

const getRepair = async (req, res) => {
    try {
        const { id } = req.params;
        const repair = await Repair.findById(id);

        if (!repair) {
            return res.status(404).json({ message: 'Repair not found' });
        }

        res.json(repair);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching repair', error: error.message });
    }
};

const deleteRepair = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRepair = await Repair.findByIdAndDelete(id);

        if (!deletedRepair) {
            return res.status(404).json({ message: 'Repair not found' });
        }

        res.json({ message: 'Repair deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting repair', error: error.message });
    }
};

module.exports = { addRepair, updateRepair, getRepair, deleteRepair };