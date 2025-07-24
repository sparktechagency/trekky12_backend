const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_MILE = 1;

exports.getUpcomingMaintenance = asyncHandler(async (req, res) => {
    const maintenanceSchedules = await MaintenanceSchedule.find({});

    const upcomingMaintenances = maintenanceSchedules.map(maintenance => {
        const performDate = new Date(maintenance.maintenanceToBePerformed);
        const today = new Date();
        const diffTime = Math.abs(performDate - today);
        const diffDays = Math.ceil(diffTime / ONE_DAY);

        const { currentMileage } = req.user.rv;

        const diffMilage = Math.abs(currentMileage - maintenance.initialMilage);

        if (diffDays <= 7 || diffMilage <= ONE_MILE) {
            return {
                ...maintenance._doc,
                color: 'red'
            };
        }

        return maintenance;
    });

    res.status(200).json({
        success: true,
        message: 'Upcoming maintenances retrieved successfully',
        upcomingMaintenances
    });
});

