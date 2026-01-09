import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validationService from './validationService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// User Service - Single Responsibility: User business logic
class UserService {
    async registerUser(userData) {
        const { name, email, password } = userData;

        // Validation
        const validation = validationService.validateUserRegistration({ name, email, password });
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate token
        const token = this.generateToken(user._id);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        };
    }

    async loginUser(credentials) {
        const { email, password } = credentials;

        // Validation
        const validation = validationService.validateUserLogin({ email, password });
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate token
        const token = this.generateToken(user._id);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        };
    }

    generateToken(userId) {
        return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });
    }

    async getUserById(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}

export default new UserService();
