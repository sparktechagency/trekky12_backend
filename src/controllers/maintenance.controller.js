const Maintenance = require('../models/maintenance.model');
const { deleteFile } = require('../utils/unlinkFile');
const NotificationService = require('../services/notification.service');

const addMaintenance = async (req, res) => {

    const documentPaths = req.files ? req.files.map(file => file.path) : 
                         req.file ? [req.file.path] : [];
    try {
        const {
            component,
            dateCreated,
            issue,
            underWarranty,
            vendor,
            maintenanceToBePerformed,
            dropOffDate,
            initialMileage,
            notes,
            invoiceNumber,
            currentMileage,
            pictures,
            status,
            rvId
        } = req.body;

        const maintenance = await Maintenance.create({
            component,
            dateCreated,
            issue,
            underWarranty,
            vendor,
            maintenanceToBePerformed,
            dropOffDate,
            initialMileage,
            notes,
            invoiceNumber,
            currentMileage,
            pictures: documentPaths[0] || null,
            status,
            rv: rvId,
            user: req.user.id || req.user._id || req.user.userId
        });

        // Schedule notification for maintenance due date
        await NotificationService.scheduleMaintenance(maintenance);

        res.status(201).json({
            message: 'Maintenance schedule created successfully',
            maintenance
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating maintenance schedule', error: error.message });
    }
};

const updateMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const documentPaths = req.files ? req.files.map(file => file.path) : [];

        const {
            vendor,
            dropOffDate,
            invoiceNumber,
            currentMileage,
            status,
            completedDate,
            notes
        } = req.body;

        const existingMaintenance = await Maintenance.findOne({
            _id: id,
            user: req.user.id || req.user._id || req.user.userId
        });

        if (!existingMaintenance) {
            return res.status(404).json({ message: 'Maintenance record not found or unauthorized' });
        }

        // Delete old pictures if new ones are being uploaded
        if (documentPaths.length > 0 && existingMaintenance.pictures?.length > 0) {
            try {
                for (const oldPicture of existingMaintenance.pictures) {
                    await deleteFile(oldPicture);
                }
            } catch (deleteError) {
                console.error('Error deleting old pictures:', deleteError);
            }
        }

        const updateData = {
            vendor,
            dropOffDate,
            invoiceNumber,
            currentMileage,
            status,
            notes,
            ...(completedDate && { completedDate }),
            ...(documentPaths.length > 0 && { pictures: documentPaths })
        };

        const updatedMaintenance = await Maintenance.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        // Send notification about maintenance update
        await NotificationService.notifyMaintenanceUpdate(updatedMaintenance);

        res.status(200).json({
            message: 'Maintenance record updated successfully',
            maintenance: updatedMaintenance
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating maintenance record', error: error.message });
    }
};

const getMaintenance = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id || req.user.userId;
        const maintenance = await Maintenance.find({ user: userId })
            .populate('rv', 'nickname manufacturer model');
        res.status(200).json({ maintenance });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching maintenance records', error });
    }
};

const deleteMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const maintenance = await Maintenance.findOne({
            _id: id,
            user: req.user.id || req.user._id || req.user.userId
        });

        if (!maintenance) {
            return res.status(404).json({ message: 'Maintenance record not found or unauthorized' });
        }

        // Delete associated pictures
        if (maintenance.pictures?.length > 0) {
            try {
                for (const picture of maintenance.pictures) {
                    await deleteFile(picture);
                }
            } catch (deleteError) {
                console.error('Error deleting pictures:', deleteError);
            }
        }

        await maintenance.deleteOne();
        res.status(200).json({ message: 'Maintenance record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting maintenance record', error });
    }
};

module.exports = {
    addMaintenance,
    updateMaintenance,
    getMaintenance,
    deleteMaintenance
};