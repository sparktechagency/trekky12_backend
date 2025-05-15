const Membership = require('../models/membership.model');

const addMembership = async (req, res) => {
  try {

    //  console.log('Request user:', req.user); // Debug log
    // console.log('Request body:', req.body); // Debug log
    const documentPaths = req.files ? req.files.map(file => file.path) : [];
    const {
      name,
      datePurchased,
      website,
      phoneNumber,
      accountNumber,
      amountPaid,
      expirationDate,
      notes
    } = req.body;


      const userId = req.user.id || req.user._id || req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }

    const membership = await Membership.create({
      name,
      datePurchased,
      website,
      phoneNumber,
      accountNumber,
      amountPaid,
      expirationDate,
      picture: documentPaths[0], // Assuming only one picture is uploaded
      notes,
      user: userId // Assuming user ID is available in req.user
    });

    res.status(201).json({ message: 'Membership added successfully', membership });
  } catch (error) {
    res.status(500).json({ message: 'Error adding membership', error });
    // console.log(req.user._id);
  }
}


module.exports = { addMembership };