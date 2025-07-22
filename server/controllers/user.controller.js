import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import Job from "../models/Job.js"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import { generateToken } from '../utils/generateToken.js';
import fs from 'fs';

// Sign up user
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing required fields" });
    }
    if (!imageFile) {
        return res.json({ success: false, message: "Missing required parameter - file (profile image)" });
    }

    try {
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.json({ success: false, message: "User already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        // Upload image from buffer to Cloudinary
        const b64 = Buffer.from(imageFile.buffer).toString('base64');
        const dataURI = `data:${imageFile.mimetype};base64,${b64}`;
        const imgUpload = await cloudinary.uploader.upload(dataURI);

        const user = await User.create({
            name,
            email,
            password: hashPass,
            image: imgUpload.secure_url
        });

        res.json({
            success: true,
            message: "User created successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                resume: user.resume
            },
            token: generateToken(user._id)
        });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// Sign in user
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid email or password" });
        }

        if (await bcrypt.compare(password, user.password)) {
            res.json({
                success: true,
                message: "Login successful",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    resume: user.resume
                },
                token: generateToken(user._id)
            });
        } else {
            res.json({ success: false, message: "invalid email and password" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get user data
export const getUserData = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.json({ success: false, message: "User Not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Apply for a job
export const applyforJob = async (req, res) => {
    const { jobId } = req.body;
    const userId = req.userId;

    try {
        const isAlreadyApplied = await JobApplication.find({ jobId, userId });

        if (isAlreadyApplied.length > 0) {
            res.json({ success: false, message: "Already Applied" });
            return;
        }

        const jobData = await Job.findById(jobId);

        if (!jobData) {
            res.json({ success: false, message: "Job not found" });
            return;
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now(),
        });

        res.json({ success: true, message: "Applied Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get user applied applications
export const getUserJobApplications = async (req, res) => {
    try {
        const userId = req.userId;

        const application = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec();

        if (!application) {
            return res.json({ success: false, message: "No Job Applications Found" });
        }

        return res.json({ success: true, applications: application });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update user profile
export const updateUserResume = async (req, res) => {
    try {
        const userId = req.userId;
        const resumeFile = req.file;
        console.log('Received file:', resumeFile);
        const userData = await User.findOne({ _id: userId });

        if (resumeFile) {
            // Convert buffer to base64 for Cloudinary upload
            const b64 = Buffer.from(resumeFile.buffer).toString('base64');
            const dataURI = `data:${resumeFile.mimetype};base64,${b64}`;

            const resumeUpload = await cloudinary.uploader.upload(dataURI, {
                folder: 'user-resumes',
                resource_type: 'raw'
            });
            console.log('Cloudinary upload result:', resumeUpload);
            userData.resume = resumeUpload.secure_url;
        } else {
            console.log('No file received for resume update.');
        }

        await userData.save();
        console.log('Updated user:', userData);
        res.json({ success: true, message: "Resume Updated" });
    } catch (error) {
        console.error('Error in updateUserResume:', error);
        res.json({ success: false, message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, email } = req.body;
        let imageUrl;
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const imgUpload = await cloudinary.uploader.upload(dataURI);
            imageUrl = imgUpload.secure_url;
        }
        const updateFields = { name, email };
        if (imageUrl) updateFields.image = imageUrl;
        const user = await User.findOneAndUpdate({ _id: userId }, updateFields, { new: true, select: '-password' });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findOne({_id: userId}).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        console.log(user);
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

