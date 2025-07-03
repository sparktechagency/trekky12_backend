const asyncHandler = require('../../../utils/asyncHandler');
const User = require('./../User/User');
const TempUser = require('./../TempUser/TempUser');
const { ApiError } = require('../../../errors/errorHandler');
const tokenService = require('../../../utils/tokenService');
const emailService = require('../../../utils/emailService');
const bcrypt = require('bcrypt');


//REGISTER
exports.signup = async (req, res, next) => {
    const { name, email, phone, password, confirmPassword } = req.body;

    try {
        // Check if password and confirm password match
        if (password !== confirmPassword) {
            throw new ApiError('Password and confirm password do not match', 400);
        }

        // Check if user already exists in main User collection
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new ApiError('User already exists', 409);
        }

        // Check if there's a pending verification in TempUser
        let tempUser = await TempUser.findOne({ email });
        if (tempUser) {
            await TempUser.findOneAndDelete({ email });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification code using tokenService
        const verificationCode = tokenService.generateVerificationCode();

        // Create temporary user
        tempUser = new TempUser({
            name,
            email,
            phone,
            password: hashedPassword,
            verificationCode: {
                verificationCode,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            },
            role: 'USER'
        });

        await tempUser.save();

        // Send verification email
        try {
            emailService.sendVerificationCode(email, verificationCode);
            return res.status(201).json({
                success: true,
                message: 'Please verify your email to complete registration',
                email
            });
        } catch (emailError) {
            await TempUser.findOneAndDelete({ email });
            return next(new ApiError('Failed to send verification email', 500));
        }
    } catch (err) {
        return next(err);
    }
};

// EMAIL VERIFICATION
exports.verifyEmail = async (req, res, next) => {
    const { email, code } = req.body;
    try {
        const tempUser = await TempUser.findOne({ email });
        if (!tempUser) throw new ApiError('No pending verification for this email', 404);
        if (tempUser.verificationCode !== code) {
            throw new ApiError('Invalid verification code', 400);
        }
        if (tempUser.verificationCode.expiresAt < new Date()) {
            throw new ApiError('Verification code has expired', 400);
        }
        // Move user from TempUser to User
        const { name, phone, password } = tempUser;

        const user = new User({ name, email, phone, password, isVerified: true });


        await user.save();
        await TempUser.deleteOne({ email });
        await emailService.sendWelcomeEmail(email, name, tempUser.role);

        // Auto-login: generate tokens
        const accessToken = tokenService.generateAccessToken({ id: user._id, role: tempUser.role });
        const refreshToken = tokenService.generateRefreshToken({ id: user._id, role: tempUser.role });

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully. You are now logged in.',
            accessToken,
            refreshToken,
            user: { id: user._id, name: user.name, email: user.email, rv: user.rvIds.length }
        });
    } catch (err) {
        return next(err);
    }
};

// LOGIN
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) throw new ApiError('User not found', 404);

        if (!user?.isVerified) throw new ApiError('Email not verified', 403);

        // Check if user or owner exists
        const existingUser = user;
        if (!existingUser) throw new ApiError('User not found', 404);

        // Check if user password matches
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) throw new ApiError('Invalid email or password', 401);
        // Generate tokens
        const accessToken = tokenService.generateAccessToken({ id: existingUser._id, role: existingUser.role });
        const refreshToken = tokenService.generateRefreshToken({ id: existingUser._id, role: existingUser.role });
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: { id: existingUser._id, name: existingUser.name, email: existingUser.email, rv: existingUser.rvIds.length }
        });
    } catch (err) {
        return next(err);
    }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) throw new ApiError('User not found', 404);
        const resetCode = tokenService.generateVerificationCode();
        user.passwordResetCode = resetCode;
        user.passwordResetCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        if (user) await user.save();
        // Send password reset code
        await emailService.sendPasswordResetCode(email, resetCode);

        return res.status(200).json({
            success: true,
            message: 'Password reset code sent to your email.'
        });
    } catch (err) {
        return next(err);
    }
};


// VERIFY CODE (for generic code verification, e.g. resend/validate)
exports.verifyCode = async (req, res, next) => {
    const { email, code } = req.body; // type: 'verification' or 'reset'
    try {
        const user = await User.findOne({ email });
        if (!user) throw new ApiError('User not found', 404);
        const valid = user?.passwordResetCode === code && user.passwordResetCodeExpiresAt > Date.now();
        if (!valid) throw new ApiError('Invalid or expired code', 400);
        return res.status(200).json({
            success: true,
            message: 'Code is valid.'
        });
    } catch (err) {
        return next(err);
    }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    try {
        // 2. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // 1. Validate password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }




        // 3. Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // 4. Clear reset code fields
        user.passwordResetCode = undefined;
        user.passwordResetCodeExpiresAt = undefined;

        // 5. Save user
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.resendVerificationCode = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) throw new ApiError('User not found', 404);
        if (user.isVerified) throw new ApiError('Email already verified', 403);
        const code = tokenService.generateVerificationCode();
        user.verificationCode = { code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
        await user.save();
        // Send verification code
        await emailService.sendVerificationCode(email, code);

        return res.status(200).json({
            success: true,
            message: 'Verification code resent to your email.'
        });
    } catch (err) {
        return next(err);
    }
};




