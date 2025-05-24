const Tire = require('../../models/appliance.model/tire.model');

// Add new tire
const addTire = async (req, res) => {
    try {
        const documentPaths = req.files ? req.files.map(file => file.path) : [];
        
        // Check if we have at least one picture
        if (!documentPaths.length) {
            return res.status(400).json({
                success: false,
                message: 'At least one picture is required'
            });
        }

        const {
            tireBrand,
            mfg,
            modelNumber,
            BTU,
            purchaseDate,
            initialMileage,
            currentMileage,
            tireSize,
            position,
            price,
            vendor,
            notes,
            rvId,
        } = req.body;

        // Validate required fields
        if (!tireBrand || !mfg || !modelNumber || !purchaseDate || !position || !price || !rvId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const newTire = await Tire.create({
            tireBrand,
            mfg,
            modelNumber,
            BTU,
            purchaseDate,
            initialMileage,
            currentMileage,
            tireSize,
            position,
            price,
            vendor,
            picture: documentPaths[0], // First picture is the main picture
            notes,
            rvId,
            userId: req.user.userId
        });

        res.status(201).json({
            success: true,
            message: 'Tire added successfully',
            tire: newTire
        });
    } catch (error) {
        console.error('Error adding tire:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add tire',
            error: error.message
        });
    }
};


const getTires = async (req, res) => {
    const tires = await Tire.find();
    res.status(200).json({
        success: true,
        tires
    });
};

const getTireById = async (req, res) => {
    const tire = await Tire.findById(req.params.id);
    res.status(200).json({
        success: true,
        tire
    });
};  

const updateTire = async (req, res) => {
    const tire = await Tire.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
        success: true,
        message: 'Tire updated successfully',
        tire
    });
};

const deleteTire = async (req, res) => {
    const tire = await Tire.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        tire
    });
};

module.exports = {
    addTire,
    getTires,
    getTireById,
    updateTire,
    deleteTire
};  