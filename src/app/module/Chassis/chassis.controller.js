const Chessis = require('./chassis.model');

exports.createChassis = async (req, res) => {
    try {
        const chassis = new Chassis(req.body);
        await chassis.save();
        res.status(201).json(chassis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}