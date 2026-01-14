import mongoose from 'mongoose';

const collaboratorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['researcher', 'guide'], required: true },
    registrationNumber: { type: String }, // Optional, for researchers
    organization: { type: String },
    country: { type: String }
});

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    track: { type: String, required: true },
    format: { type: String, required: true },
    conference: { type: String },
    deadline: { type: Date },
    paperUrl: { type: String },
    collaborators: [collaboratorSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Idea', 'In Progress', 'Submitted', 'Accepted', 'Published'],
        default: 'Idea'
    },
    researchStep: {
        type: String,
        enum: ['abstract', 'literature', 'methodology', 'results', 'conclusion'],
        default: 'abstract'
    }
}, {
    timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
