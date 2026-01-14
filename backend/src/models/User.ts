import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    department: {
        type: String,
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        enum: ['researcher', 'guide'],
        required: true,
    },
    // Specific to Researcher
    registrationNumber: {
        type: String,
        required: function (this: any) { return this.role === 'researcher'; }
    },
    // Specific to Guide
    facultyId: {
        type: String,
        required: function (this: any) { return this.role === 'guide'; }
    }
}, {
    timestamps: true,
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
