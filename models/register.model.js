const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        min: 1,
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
        min: 1,
    },
    userName: {
        type: String,
        required: [true, "User Name is required"],
        min: 1,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        // unique: true,
        min: 1,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        min: 8,
    },
    active: {
        type: Boolean,
        default: true,
    },
    updatedAt: {
        type: Date,
        default: () => new Date(),
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => new Date(),
    }
});

RegisterSchema.pre("save", async function (next) {
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model("Users", RegisterSchema);