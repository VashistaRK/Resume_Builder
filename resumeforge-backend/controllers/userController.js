import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: "1d" })
}

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password should contain minimum of 8 characters" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword })

        res.status(201).json({
            success: true,
            message: "User created successfully",
            _id: auth.userId,
            name: user.name,
            email: user.email,
            token: generateToken(auth.userId)
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(500).json({ message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({ message: "Invalid password" })
        }
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            _id: auth.userId,
            name: user.name,
            email: user.email,
            token: generateToken(auth.userId)
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.auth.userId).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        res.json(user)
    } catch (error){
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}